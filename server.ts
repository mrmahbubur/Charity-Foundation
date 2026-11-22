import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  const portEqArg = process.argv.find((arg) => arg.startsWith('--port='));
  if (portEqArg) {
    const parsed = Number(portEqArg.split('=')[1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  if (process.env.NODE_ENV !== 'production') {
    const envPort = Number(process.env.PORT);
    const nginxPort = Number(process.env.NGINX_PORT);
    if (envPort && envPort !== nginxPort && envPort !== 8080) {
      return envPort;
    }
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }
  return Number(process.env.PORT) || 3000;
}

const PORT = resolvePort();
const DATA_DIR = path.resolve(__dirname, 'server/data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-content.json');
const VAULT_FILE = path.resolve(DATA_DIR, 'vault-auth.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// --- CRYPTOGRAPHIC VAULT AUTHENTICATION & RATE LIMITING ---

interface VaultAuthRecord {
  salt: string;
  keyHash: string;
  tokenSecret: string;
  updatedAt: string;
}

function hashSecret(passphrase: string, saltHex: string): string {
  return crypto.scryptSync(passphrase, saltHex, 64).toString('hex');
}

function safeEqualHex(aHex: string, bHex: string): boolean {
  try {
    const a = Buffer.from(aHex, 'hex');
    const b = Buffer.from(bHex, 'hex');
    if (a.length !== b.length || a.length === 0) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function loadOrInitVaultAuth(): VaultAuthRecord {
  const envKey = process.env.MRS_ADMIN_KEY?.trim();
  try {
    if (fs.existsSync(VAULT_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf-8')) as VaultAuthRecord;
      if (parsed.salt && parsed.keyHash && parsed.tokenSecret) {
        if (envKey && !safeEqualHex(parsed.keyHash, hashSecret(envKey, parsed.salt))) {
          const salt = crypto.randomBytes(16).toString('hex');
          const updated: VaultAuthRecord = {
            salt,
            keyHash: hashSecret(envKey, salt),
            tokenSecret: parsed.tokenSecret,
            updatedAt: new Date().toISOString()
          };
          fs.writeFileSync(VAULT_FILE, JSON.stringify(updated, null, 2), 'utf-8');
          return updated;
        }
        return parsed;
      }
    }
  } catch {
    // re-initialize if corrupt
  }

  const initialKey = envKey || 'MRS-Vault-2026!';
  const salt = crypto.randomBytes(16).toString('hex');
  const record: VaultAuthRecord = {
    salt,
    keyHash: hashSecret(initialKey, salt),
    tokenSecret: crypto.randomBytes(32).toString('hex'),
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(VAULT_FILE, JSON.stringify(record, null, 2), 'utf-8');
  return record;
}

let vaultAuth = loadOrInitVaultAuth();

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function signSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      r: 'owner',
      iat: Date.now(),
      exp: Date.now() + TOKEN_TTL_MS,
      jti: crypto.randomBytes(8).toString('hex')
    })
  ).toString('base64url');

  const sig = crypto
    .createHmac('sha256', vaultAuth.tokenSecret)
    .update(payload)
    .digest('base64url');

  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return false;

  try {
    const expectedSig = crypto
      .createHmac('sha256', vaultAuth.tokenSecret)
      .update(payloadB64)
      .digest();
    const actualSig = Buffer.from(sigB64, 'base64url');
    if (expectedSig.length !== actualSig.length) return false;
    if (!crypto.timingSafeEqual(expectedSig, actualSig)) return false;

    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!decoded || typeof decoded.exp !== 'number' || decoded.exp < Date.now()) {
      return false;
    }
    return decoded.r === 'owner';
  } catch {
    return false;
  }
}

function getClientIp(req: express.Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

// Brute-force lockout tracker for vault login
const authAttempts = new Map<string, { fails: number; lockUntil: number; firstFailAt: number }>();
const MAX_AUTH_FAILS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

// Rate limiter for public click endpoint
const clickRateTracker = new Map<string, { count: number; resetAt: number }>();
const MAX_CLICKS_PER_MIN = 45;

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!verifySessionToken(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}

// --- SITE CONTENT MODEL ---

const DEFAULT_CONTENT = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  foundationInfo: {
    name: 'M R S Charity Foundation',
    shortName: 'M R S Foundation',
    logo: './logo.png',
    parentOrg: 'A Future Project of M R S',
    motto: 'Poverty Ends With Us',
    secondaryMotto: 'Humanity United Against Poverty',
    mission:
      'A future humanitarian project of M R S currently collecting funds online for healthcare, education, and essential necessities through zero-cost sponsor giving.'
  },
  urgentNotice: {
    enabled: false,
    badge: 'Pre-Launch Phase',
    headline: 'Online Fund Collection Active for Future Programs',
    description:
      'Operating 100% online with no physical office overhead while reserving ad-sponsored funds for future healthcare, education, and essential relief.',
    ctaText: 'Support Online Launch (Free)',
    severity: 'info'
  },
  announcements: [
    {
      id: 'ann-1',
      badge: 'Future Project',
      title: 'A Future Project of M R S',
      message:
        'M R S Charity Foundation is currently collecting initial reserves online ahead of launching future healthcare, education, and essential necessities programs.',
      actionText: 'Support Future Project (Free)',
      active: true
    },
    {
      id: 'ann-2',
      badge: 'Zero-Cost Giving',
      title: 'No Personal Money Needed',
      message:
        'Visiting a verified commercial sponsor partner link builds our charitable reserve at zero personal cost—never requiring credit cards or cash.',
      actionText: 'Open Verified Sponsor Link (Free)',
      active: true
    }
  ],
  impactMetrics: [
    { id: 'm-1', label: 'Current Project Stage', value: 'Phase 1', detail: 'Active online fund collection for future M R S launch' },
    { id: 'm-2', label: 'Operations Footprint', value: '100% Online', detail: 'No physical office address or rent overhead yet' },
    { id: 'm-3', label: 'Target Program Allocation', value: '88% Direct Aid', detail: 'Planned reserve share for education, health & essentials' },
    { id: 'm-4', label: 'Cost to Supporters', value: '$0 / Free', detail: 'Funded exclusively by voluntary sponsor link visits' }
  ],
  donationStats: {
    totalSupporters: 0,
    totalRaisedBDT: 0,
    mealsServed: 0,
    cleanWaterLitres: 0,
    lastSupporterName: 'Online Portal Active',
    lastDonationTime: new Date().toISOString()
  },
  futureProject: {
    status: 'Pre-Registration (Online Collection Phase)',
    launchPhase: 'Phase 1 — Online Mobilization & Reserve Building',
    targetLaunchYear: 'Upcoming Ground Rollout',
    backer: 'M R S',
    notice:
      'M R S Charity Foundation is a future humanitarian project operating wholly online without a physical office address during initial fund collection.'
  },
  automaticSystem: {
    enabled: true,
    autoSupporterIncrement: false,
    supporterIncrementIntervalSec: 15,
    autoTickerSync: true,
    lastAutoUpdate: new Date().toISOString(),
    totalAutoTicks: 0,
    syncIntervalSec: 5,
    updateLog: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'SERVICE_READY',
        details: 'Community live sync initialized in honest Phase 1 mode.',
        source: 'core'
      }
    ]
  },
  brainEngine: {
    enabled: true,
    persuasionMode: 'goal-gradient' as 'goal-gradient' | 'empathy' | 'urgency' | 'social-proof',
    dailyGoalClicks: 500,
    todayClicks: 0,
    clickImpactUnit: 'Verified Sponsor Reserve Contribution',
    activeHeadline: 'Help Build Reserves for Our Future Community Launch ({remaining} clicks to daily milestone)',
    activeSubtext: 'Zero personal cost—clicking opens a verified sponsor partner in a new tab to support future healthcare, education, and relief reserves.',
    activeCtaLabel: 'Support Now (Free)',
    floatingNudge: {
      enabled: true,
      delaySeconds: 6,
      badge: 'Online Fund Collection',
      headline: 'Support the Upcoming Launch at $0 Cost',
      message: 'Every voluntary click opens a verified sponsor partner in a new tab with zero money requested from you.',
      ctaLabel: 'Support Now (Free)'
    },
    sponsorLinks: [
      'https://uplcm.com/4/12250130',
      'https://uplcm.com/4/12250135',
      'https://uplcm.com/4/12250137',
      'https://uplcm.com/4/10016819',
      'https://uplcm.com/4/12250134',
      'https://uplcm.com/4/12250132',
      'https://uplcm.com/4/12250138',
      'https://uplcm.com/4/12250129',
      'https://uplcm.com/4/12250133',
      'https://uplcm.com/4/12250136'
    ],
    activityStream: [] as Array<{
      id: string;
      location: string;
      actionText: string;
      impactText: string;
      timestamp: string;
    }>,
    realClickAnalytics: {
      totalRealClicks: 0,
      lastRealClickAt: '',
      clicksBySection: {} as Record<string, number>
    }
  },
  knowledgeBase: {
    missionBrief:
      'M R S Charity Foundation is a future project of M R S currently operating 100% online in its initial fund-collection phase with no physical office address yet.',
    howItWorksSummary:
      'Commercial brand partners compensate verified page visits. Net sponsor proceeds accumulate toward planned rural learning kits, preventive health checkups, clean water stations, and staple relief packs—at zero personal cost to visitors.',
    transparencyNote:
      'Planned allocation reserves 88% for direct humanitarian programs, 8% for future field launch coordination, and 4% for online platform hosting and stewardship.',
    faqs: [
      {
        id: 'faq-1',
        category: 'Zero-Cost Giving',
        question: 'How does clicking support the foundation without using my money?',
        answer:
          'Clicking any Support Now button opens a verified commercial sponsor destination in a new tab. Sponsors compensate publisher visits, building our pre-launch reserves at $0 cost to you.',
        ctaText: 'Support Now (Free)',
        active: true
      },
      {
        id: 'faq-2',
        category: 'Repeat Support',
        question: 'Can I participate more than once?',
        answer:
          'Yes. Our portal rotates sequentially across 10 verified sponsor destinations so natural human clicks open fresh partner links and build additional reserves.',
        ctaText: 'Open Next Sponsor Link (Free)',
        active: true
      },
      {
        id: 'faq-3',
        category: 'Project Stage',
        question: 'Does the foundation currently have a physical office address?',
        answer:
          'No. During Phase 1 online fund collection, we maintain no physical office so resources stay dedicated to building community reserves before ground operations launch.',
        ctaText: 'View Transparency & Governance',
        active: true
      },
      {
        id: 'faq-4',
        category: 'Trust & Safety',
        question: 'Do I ever need to enter payment cards or bank details?',
        answer:
          'Never. This portal never requests credit cards, debit cards, mobile banking PINs, or cash transfers from general visitors.',
        ctaText: 'Give Safely at $0 Cost',
        active: true
      }
    ]
  }
};

function loadSiteContent() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        foundationInfo: { ...DEFAULT_CONTENT.foundationInfo, ...(parsed.foundationInfo || {}) },
        urgentNotice: { ...DEFAULT_CONTENT.urgentNotice, ...(parsed.urgentNotice || {}) },
        donationStats: { ...DEFAULT_CONTENT.donationStats, ...(parsed.donationStats || {}) },
        automaticSystem: { ...DEFAULT_CONTENT.automaticSystem, ...(parsed.automaticSystem || {}) },
        brainEngine: {
          ...DEFAULT_CONTENT.brainEngine,
          ...(parsed.brainEngine || {}),
          floatingNudge: {
            ...DEFAULT_CONTENT.brainEngine.floatingNudge,
            ...((parsed.brainEngine && parsed.brainEngine.floatingNudge) || {})
          },
          realClickAnalytics: {
            ...DEFAULT_CONTENT.brainEngine.realClickAnalytics,
            ...((parsed.brainEngine && parsed.brainEngine.realClickAnalytics) || {})
          }
        },
        knowledgeBase: {
          ...DEFAULT_CONTENT.knowledgeBase,
          ...(parsed.knowledgeBase || {})
        }
      };
    }
  } catch {
    // fallback to default
  }
  saveSiteContent(DEFAULT_CONTENT);
  return DEFAULT_CONTENT;
}

function saveSiteContent(content: typeof DEFAULT_CONTENT) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf-8');
  } catch {
    // ignore disk errors
  }
}

let currentContent = loadSiteContent();

// Strict Public Projection: NEVER leaks internal logs, system state, or analytics
function toPublicBrainProjection(brain: typeof DEFAULT_CONTENT.brainEngine) {
  return {
    enabled: brain.enabled,
    persuasionMode: brain.persuasionMode,
    dailyGoalClicks: brain.dailyGoalClicks,
    todayClicks: brain.todayClicks,
    clickImpactUnit: brain.clickImpactUnit,
    activeHeadline: brain.activeHeadline,
    activeSubtext: brain.activeSubtext,
    activeCtaLabel: brain.activeCtaLabel,
    floatingNudge: brain.floatingNudge,
    sponsorLinks: brain.sponsorLinks,
    activityStream: brain.activityStream
  };
}

function toPublicContentProjection(content: typeof DEFAULT_CONTENT) {
  return {
    version: content.version,
    lastUpdated: content.lastUpdated,
    foundationInfo: content.foundationInfo,
    urgentNotice: content.urgentNotice,
    announcements: content.announcements,
    impactMetrics: content.impactMetrics,
    donationStats: content.donationStats,
    futureProject: content.futureProject,
    brainEngine: toPublicBrainProjection(content.brainEngine),
    knowledgeBase: content.knowledgeBase
  };
}

const sseClients = new Set<express.Response>();

function broadcastUpdate(type: string, payload: any) {
  const message = `event: update\ndata: ${JSON.stringify({
    type,
    version: currentContent.version,
    lastUpdated: currentContent.lastUpdated,
    payload
  })}\n\n`;

  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

function recordLog(action: string, details: string, source = 'api') {
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    source
  };
  const logs = [newLog, ...(currentContent.automaticSystem.updateLog || [])].slice(0, 30);
  currentContent.automaticSystem.updateLog = logs;
}

const RANDOM_REGIONS = [
  'Online Community Visitor',
  'Global Online Supporter',
  'Digital Giving Portal'
];

const BRAIN_ACTIVITY_TEMPLATES = [
  'completed a free sponsor visit for future program reserves',
  'contributed to Phase 1 online fund collection at $0 cost',
  'supported future education, healthcare & essential relief reserves'
];

let autoTickCounter = 0;
function scheduleNextBrainTick() {
  const intervalMs = Math.max(2, currentContent.automaticSystem.supporterIncrementIntervalSec || 8) * 1000;
  setTimeout(() => {
    try {
      if (currentContent.automaticSystem.enabled && currentContent.automaticSystem.autoSupporterIncrement) {
        autoTickCounter++;
        const city = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];
        const supporterBump = Math.floor(Math.random() * 2) + 1;
        const actionText = BRAIN_ACTIVITY_TEMPLATES[Math.floor(Math.random() * BRAIN_ACTIVITY_TEMPLATES.length)];

        currentContent.donationStats.totalSupporters += supporterBump;
        currentContent.donationStats.lastSupporterName = city;
        currentContent.donationStats.lastDonationTime = new Date().toISOString();

        if (currentContent.brainEngine?.enabled) {
          currentContent.brainEngine.todayClicks = (currentContent.brainEngine.todayClicks || 0) + 1;
          if (currentContent.brainEngine.todayClicks >= currentContent.brainEngine.dailyGoalClicks) {
            currentContent.brainEngine.dailyGoalClicks += 250;
          }
          const newActivity = {
            id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            location: city,
            actionText,
            impactText: `+${supporterBump} Free Credit${supporterBump > 1 ? 's' : ''}`,
            timestamp: new Date().toISOString()
          };
          currentContent.brainEngine.activityStream = [
            newActivity,
            ...(currentContent.brainEngine.activityStream || [])
          ].slice(0, 12);
        }

        currentContent.automaticSystem.lastAutoUpdate = new Date().toISOString();
        currentContent.automaticSystem.totalAutoTicks = (currentContent.automaticSystem.totalAutoTicks || 0) + 1;
        currentContent.version += 1;
        currentContent.lastUpdated = new Date().toISOString();

        if (autoTickCounter % 5 === 0) {
          recordLog(
            'COMMUNITY_PULSE',
            `Pulse synced (+${supporterBump} from ${city}, Daily: ${currentContent.brainEngine.todayClicks}/${currentContent.brainEngine.dailyGoalClicks})`,
            'scheduler'
          );
          saveSiteContent(currentContent);
        }

        broadcastUpdate('AUTO_TICK', {
          donationStats: currentContent.donationStats,
          brainEngine: toPublicBrainProjection(currentContent.brainEngine)
        });
      }
    } catch {
      // keep scheduler resilient
    } finally {
      scheduleNextBrainTick();
    }
  }, intervalMs);
}
scheduleNextBrainTick();

setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(':keepalive\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

async function startServer() {
  const app = express();

  // Disable framework fingerprint headers
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Global security headers (iframe-safe for preview, hardens MIME/permissions/robots)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
    next();
  });

  // Block automated vulnerability scanners, internal paths, and common exploit probes
  const BLOCKED_PROBE_REGEX = /^\/(\.env|\.git|\.github|\.gitignore|\.aistudio|\.node-version|render\.yaml|server\.ts|server\/|public\/|package\.json|package-lock\.json|bun\.lock|tsconfig\.json|vite\.config\.ts|metadata\.json|README\.md|wp-admin|wp-login|wp-content|phpinfo|phpmyadmin|server-status|config\.json|administrator|admin\.php|xmlrpc\.php)(\/|$)/i;
  app.use((req, res, next) => {
    if (BLOCKED_PROBE_REGEX.test(req.path) || (process.env.NODE_ENV === 'production' && req.path.endsWith('.map'))) {
      return res.status(404).end();
    }
    next();
  });

  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /api/\nDisallow: /mrs-vault\n');
  });

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  const publicDir = path.resolve(__dirname, 'public');

  app.get(['/logo.png', '/logo.jpg'], (_req, res) => {
    const filePath = path.resolve(publicDir, 'logo.png');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(filePath);
  });

  app.use(express.static(publicDir));

  // --- VAULT AUTHENTICATION ROUTES ---

  app.post('/api/vault/auth', (req, res) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const record = authAttempts.get(ip);

    if (record && record.lockUntil > now) {
      const waitMin = Math.ceil((record.lockUntil - now) / 60000);
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Locked for ${waitMin} minute(s).`
      });
    }

    const passphrase = typeof req.body?.passphrase === 'string' ? req.body.passphrase : '';
    const candidateHash = hashSecret(passphrase, vaultAuth.salt);

    if (!passphrase || !safeEqualHex(candidateHash, vaultAuth.keyHash)) {
      const prevFails = record && now - record.firstFailAt < LOCK_DURATION_MS ? record.fails : 0;
      const nextFails = prevFails + 1;
      authAttempts.set(ip, {
        fails: nextFails,
        firstFailAt: prevFails === 0 ? now : (record?.firstFailAt || now),
        lockUntil: nextFails >= MAX_AUTH_FAILS ? now + LOCK_DURATION_MS : 0
      });
      return res.status(401).json({ success: false, error: 'Invalid access key' });
    }

    authAttempts.delete(ip);
    const token = signSessionToken();
    recordLog('VAULT_LOGIN', 'Owner authenticated into private control console', 'auth');
    saveSiteContent(currentContent);

    return res.json({
      success: true,
      token,
      expiresInSec: Math.floor(TOKEN_TTL_MS / 1000)
    });
  });

  app.get('/api/vault/verify', requireAdminAuth, (_req, res) => {
    res.json({ success: true, valid: true });
  });

  app.get('/api/vault/snapshot', requireAdminAuth, (_req, res) => {
    res.json({
      success: true,
      connectedClients: sseClients.size,
      data: currentContent
    });
  });

  app.post('/api/vault/rotate-key', requireAdminAuth, (req, res) => {
    const currentKey = typeof req.body?.currentKey === 'string' ? req.body.currentKey : '';
    const newKey = typeof req.body?.newKey === 'string' ? req.body.newKey.trim() : '';

    if (newKey.length < 8) {
      return res.status(400).json({ success: false, error: 'New access key must be at least 8 characters' });
    }
    if (!safeEqualHex(hashSecret(currentKey, vaultAuth.salt), vaultAuth.keyHash)) {
      return res.status(401).json({ success: false, error: 'Current access key is incorrect' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    vaultAuth = {
      salt,
      keyHash: hashSecret(newKey, salt),
      tokenSecret: crypto.randomBytes(32).toString('hex'),
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(VAULT_FILE, JSON.stringify(vaultAuth, null, 2), 'utf-8');

    const freshToken = signSessionToken();
    recordLog('KEY_ROTATED', 'Owner access key and signing secret rotated', 'auth');
    saveSiteContent(currentContent);

    res.json({
      success: true,
      token: freshToken,
      message: 'Access key rotated successfully'
    });
  });

  // --- PUBLIC ROUTES (STRICTLY SANITIZED) ---

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    sseClients.add(res);

    res.write(`event: init\ndata: ${JSON.stringify({
      type: 'INIT',
      version: currentContent.version,
      lastUpdated: currentContent.lastUpdated,
      content: toPublicContentProjection(currentContent)
    })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  app.get('/api/content', (_req, res) => {
    res.json({
      success: true,
      data: toPublicContentProjection(currentContent)
    });
  });

  // Rate-limited public click reporting endpoint
  app.post('/api/brain/click', (req, res) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const rate = clickRateTracker.get(ip);
    if (rate && rate.resetAt > now) {
      if (rate.count >= MAX_CLICKS_PER_MIN) {
        return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
      }
      rate.count += 1;
    } else {
      clickRateTracker.set(ip, { count: 1, resetAt: now + 60000 });
    }

    const rawSource = (req.body?.source && typeof req.body.source === 'string') ? req.body.source : 'site-cta';
    const source = rawSource.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'site-cta';
    const rawNum = Number(req.body?.linkNumber);
    const linkNumber = Number.isFinite(rawNum) ? Math.max(1, Math.min(100, Math.floor(rawNum))) : 1;

    currentContent.donationStats.totalSupporters += 1;
    currentContent.donationStats.lastSupporterName = 'Verified Online Supporter';
    currentContent.donationStats.lastDonationTime = new Date().toISOString();

    currentContent.brainEngine.todayClicks = (currentContent.brainEngine.todayClicks || 0) + 1;
    if (currentContent.brainEngine.todayClicks >= currentContent.brainEngine.dailyGoalClicks) {
      currentContent.brainEngine.dailyGoalClicks += 250;
    }

    const analytics = currentContent.brainEngine.realClickAnalytics || {
      totalRealClicks: 0,
      lastRealClickAt: '',
      clicksBySection: {}
    };
    analytics.totalRealClicks = (analytics.totalRealClicks || 0) + 1;
    analytics.lastRealClickAt = new Date().toISOString();
    analytics.clicksBySection = {
      ...(analytics.clicksBySection || {}),
      [source]: ((analytics.clicksBySection && analytics.clicksBySection[source]) || 0) + 1
    };
    currentContent.brainEngine.realClickAnalytics = analytics;

    const newActivity = {
      id: `real-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      location: 'Verified Online Click',
      actionText: `completed free sponsor visit (Partner #${linkNumber})`,
      impactText: '+1 Free Click',
      timestamp: new Date().toISOString()
    };
    currentContent.brainEngine.activityStream = [
      newActivity,
      ...(currentContent.brainEngine.activityStream || [])
    ].slice(0, 12);

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('REAL_AD_CLICK', `Sponsor link #${linkNumber} clicked via "${source}" (Total: ${analytics.totalRealClicks})`, 'visitor');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      donationStats: currentContent.donationStats,
      brainEngine: toPublicBrainProjection(currentContent.brainEngine)
    });

    res.json({
      success: true,
      todayClicks: currentContent.brainEngine.todayClicks,
      dailyGoalClicks: currentContent.brainEngine.dailyGoalClicks,
      totalSupporters: currentContent.donationStats.totalSupporters
    });
  });

  // --- PROTECTED ADMIN & CONTROL ROUTES (REQUIRE VAULT TOKEN) ---

  app.post('/api/content', requireAdminAuth, (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid update body' });
    }

    if (updates.foundationInfo) {
      currentContent.foundationInfo = { ...currentContent.foundationInfo, ...updates.foundationInfo };
    }
    if (updates.urgentNotice) {
      currentContent.urgentNotice = { ...currentContent.urgentNotice, ...updates.urgentNotice };
    }
    if (updates.announcements && Array.isArray(updates.announcements)) {
      currentContent.announcements = updates.announcements;
    }
    if (updates.impactMetrics && Array.isArray(updates.impactMetrics)) {
      currentContent.impactMetrics = updates.impactMetrics;
    }
    if (updates.donationStats) {
      currentContent.donationStats = { ...currentContent.donationStats, ...updates.donationStats };
    }
    if (updates.futureProject) {
      currentContent.futureProject = { ...currentContent.futureProject, ...updates.futureProject };
    }
    if (updates.automaticSystem) {
      currentContent.automaticSystem = { ...currentContent.automaticSystem, ...updates.automaticSystem };
    }

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('CONTENT_UPDATE', `Site content updated (v${currentContent.version})`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('FULL_SYNC', toPublicContentProjection(currentContent));

    res.json({
      success: true,
      message: 'Content updated and published live',
      version: currentContent.version,
      data: currentContent
    });
  });

  app.post('/api/logo', requireAdminAuth, (req, res) => {
    const { logoDataUrl } = req.body;
    if (!logoDataUrl || typeof logoDataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'logoDataUrl is required' });
    }

    try {
      if (logoDataUrl.startsWith('data:image/')) {
        const matches = logoDataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync(path.resolve(publicDir, 'logo.png'), buffer);
        }
      }

      const versionedLogo = `./logo.png?v=${Date.now()}`;
      currentContent.foundationInfo.logo = versionedLogo;
      currentContent.version += 1;
      currentContent.lastUpdated = new Date().toISOString();

      recordLog('LOGO_UPDATE', 'Site logo updated', 'owner');
      saveSiteContent(currentContent);

      broadcastUpdate('LOGO_UPDATE', { logo: versionedLogo, foundationInfo: currentContent.foundationInfo });

      res.json({ success: true, logo: versionedLogo, version: currentContent.version });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to save logo' });
    }
  });

  app.post('/api/announcements', requireAdminAuth, (req, res) => {
    const { announcements } = req.body;
    if (!Array.isArray(announcements)) {
      return res.status(400).json({ success: false, error: 'announcements must be an array' });
    }

    currentContent.announcements = announcements;
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('ANNOUNCEMENTS_UPDATE', `Announcements updated (${announcements.length} slides)`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('ANNOUNCEMENTS_UPDATE', { announcements: currentContent.announcements });

    res.json({ success: true, announcements: currentContent.announcements });
  });

  app.post('/api/urgent-notice', requireAdminAuth, (req, res) => {
    const { urgentNotice } = req.body;
    if (!urgentNotice || typeof urgentNotice !== 'object') {
      return res.status(400).json({ success: false, error: 'urgentNotice must be an object' });
    }

    currentContent.urgentNotice = { ...currentContent.urgentNotice, ...urgentNotice };
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('URGENT_NOTICE_UPDATE', `Urgent notice ${currentContent.urgentNotice.enabled ? 'enabled' : 'disabled'}`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('URGENT_NOTICE_UPDATE', { urgentNotice: currentContent.urgentNotice });

    res.json({ success: true, urgentNotice: currentContent.urgentNotice });
  });

  app.post('/api/auto-system/toggle', requireAdminAuth, (req, res) => {
    const { enabled, autoSupporterIncrement, intervalSec } = req.body;
    if (typeof enabled === 'boolean') {
      currentContent.automaticSystem.enabled = enabled;
    }
    if (typeof autoSupporterIncrement === 'boolean') {
      currentContent.automaticSystem.autoSupporterIncrement = autoSupporterIncrement;
    }
    if (typeof intervalSec === 'number' && intervalSec >= 2 && intervalSec <= 60) {
      currentContent.automaticSystem.supporterIncrementIntervalSec = intervalSec;
    }

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('PACING_UPDATE', `Pacing updated: enabled=${currentContent.automaticSystem.enabled}, interval=${currentContent.automaticSystem.supporterIncrementIntervalSec}s`, 'owner');
    saveSiteContent(currentContent);

    res.json({
      success: true,
      automaticSystem: currentContent.automaticSystem
    });
  });

  app.post('/api/auto-system/trigger', requireAdminAuth, (_req, res) => {
    const randomRegion = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];
    const bump = Math.floor(Math.random() * 3) + 1;

    currentContent.donationStats.totalSupporters += bump;
    currentContent.donationStats.lastSupporterName = randomRegion;
    currentContent.donationStats.lastDonationTime = new Date().toISOString();
    currentContent.automaticSystem.lastAutoUpdate = new Date().toISOString();
    currentContent.automaticSystem.totalAutoTicks = (currentContent.automaticSystem.totalAutoTicks || 0) + 1;
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('MANUAL_PULSE', `Triggered +${bump} supporters from ${randomRegion}`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('MANUAL_TRIGGER', {
      donationStats: currentContent.donationStats
    });

    res.json({
      success: true,
      version: currentContent.version,
      stats: currentContent.donationStats
    });
  });

  app.get('/api/auto-system/status', requireAdminAuth, (_req, res) => {
    res.json({
      success: true,
      connectedClients: sseClients.size,
      version: currentContent.version,
      lastUpdated: currentContent.lastUpdated,
      automaticSystem: currentContent.automaticSystem
    });
  });

  app.get('/api/auto-system/logs', requireAdminAuth, (_req, res) => {
    res.json({
      success: true,
      logs: currentContent.automaticSystem.updateLog || []
    });
  });

  app.post('/api/brain/update', requireAdminAuth, (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid brain update body' });
    }

    currentContent.brainEngine = {
      ...currentContent.brainEngine,
      ...updates,
      floatingNudge: updates.floatingNudge
        ? { ...currentContent.brainEngine.floatingNudge, ...updates.floatingNudge }
        : currentContent.brainEngine.floatingNudge
    };

    if (Array.isArray(updates.sponsorLinks) && updates.sponsorLinks.length > 0) {
      currentContent.brainEngine.sponsorLinks = updates.sponsorLinks.filter(
        (u: any) => typeof u === 'string' && /^https?:\/\//i.test(u.trim())
      );
    }

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('STRATEGY_UPDATE', `Goal=${currentContent.brainEngine.dailyGoalClicks}, mode=${currentContent.brainEngine.persuasionMode}`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      brainEngine: toPublicBrainProjection(currentContent.brainEngine)
    });

    res.json({
      success: true,
      message: 'Strategy configuration updated live',
      brainEngine: currentContent.brainEngine
    });
  });

  app.post('/api/brain/knowledge', requireAdminAuth, (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid knowledge update body' });
    }

    currentContent.knowledgeBase = {
      ...currentContent.knowledgeBase,
      ...updates
    };

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('KNOWLEDGE_UPDATE', `Knowledge base synced (${(currentContent.knowledgeBase.faqs || []).length} FAQs)`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('KNOWLEDGE_UPDATE', {
      knowledgeBase: currentContent.knowledgeBase
    });

    res.json({
      success: true,
      message: 'Knowledge Base synced live',
      knowledgeBase: currentContent.knowledgeBase
    });
  });

  app.post('/api/brain/pulse', requireAdminAuth, (req, res) => {
    const { location, actionText, impactText, bumpClicks } = req.body || {};
    const addClicks = typeof bumpClicks === 'number' ? Math.max(0, Math.min(25, bumpClicks)) : 1;

    currentContent.donationStats.totalSupporters += addClicks;
    currentContent.brainEngine.todayClicks = (currentContent.brainEngine.todayClicks || 0) + addClicks;
    if (currentContent.brainEngine.todayClicks >= currentContent.brainEngine.dailyGoalClicks) {
      currentContent.brainEngine.dailyGoalClicks += 250;
    }

    const newActivity = {
      id: `pulse-${Date.now()}`,
      location: (typeof location === 'string' && location.trim()) ? location.trim() : 'Online Portal',
      actionText:
        (typeof actionText === 'string' && actionText.trim())
          ? actionText.trim()
          : 'completed a free sponsor visit for future program reserves',
      impactText: (typeof impactText === 'string' && impactText.trim()) ? impactText.trim() : `+${addClicks} Free Support`,
      timestamp: new Date().toISOString()
    };

    currentContent.brainEngine.activityStream = [
      newActivity,
      ...(currentContent.brainEngine.activityStream || [])
    ].slice(0, 12);

    currentContent.donationStats.lastSupporterName = `Supporter from ${newActivity.location}`;
    currentContent.donationStats.lastDonationTime = new Date().toISOString();
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('CUSTOM_PULSE', `Pulse broadcasted from ${newActivity.location}`, 'owner');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      donationStats: currentContent.donationStats,
      brainEngine: toPublicBrainProjection(currentContent.brainEngine)
    });

    res.json({
      success: true,
      message: 'Live viewer pulse broadcasted',
      activity: newActivity,
      brainEngine: currentContent.brainEngine
    });
  });

  app.post('/api/content/reset', requireAdminAuth, (_req, res) => {
    currentContent = {
      ...DEFAULT_CONTENT,
      version: currentContent.version + 1,
      lastUpdated: new Date().toISOString()
    };
    recordLog('RESET', 'Content restored to defaults', 'owner');
    saveSiteContent(currentContent);
    broadcastUpdate('FULL_SYNC', toPublicContentProjection(currentContent));
    res.json({ success: true, message: 'Content reset to defaults', data: currentContent });
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    let viteMiddlewares: express.RequestHandler | null = null;
    app.use((req, res, next) => {
      if (viteMiddlewares) {
        return viteMiddlewares(req, res, next);
      }
      res.status(503).send('Server initializing');
    });

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`M R S Charity Foundation server listening on http://0.0.0.0:${PORT}`);
    });

    const { createServer: createViteServer } = await import('vite');
    createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer }
      },
      appType: 'spa'
    })
      .then((vite) => {
        viteMiddlewares = vite.middlewares;
      })
      .catch((err) => {
        console.error('Failed to initialize Vite middleware:', err);
        process.exit(1);
      });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const staticProdDir = fs.existsSync(path.join(distPath, 'index.html')) ? distPath : __dirname;
    app.use(express.static(staticProdDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(staticProdDir, 'index.html'));
    });

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`M R S Charity Foundation server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
