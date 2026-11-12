import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
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
    mission: 'Delivering life-changing projects to support vulnerable communities: providing child support, food relief, clean water access, free education, vocational empowerment, and emergency disaster relief.'
  },
  urgentNotice: {
    enabled: true,
    badge: 'Urgent Relief Alert',
    headline: 'Flood & Riverbank Erosion Crisis Emergency Response Active',
    description: 'Providing immediate hot food rations, purified water sachets, and child hygiene packets in northern districts.',
    ctaText: 'Provide Free Relief (1-Click)',
    severity: 'high'
  },
  announcements: [
    {
      id: 'ann-1',
      badge: 'Future Project',
      title: 'A Future Project of M R S',
      message: 'M R S Charity Foundation is an upcoming initiative dedicated to healthcare, education & essential necessities. Support the launch 100% free!',
      actionText: 'Support Future Project (Free)',
      active: true
    },
    {
      id: 'ann-2',
      badge: 'Free Donation',
      title: 'No Money Needed to Donate!',
      message: 'Simply click the Donate button. Our sponsor partners cover 100% of the cost for children’s education & hot midday meals.',
      actionText: 'Click to Donate (Free)',
      active: true
    },
    {
      id: 'ann-3',
      badge: 'Zero-Cost Giving',
      title: 'Your Click Creates Real Aid',
      message: 'You don’t have to spend a single Taka. Every time you click "Donate", a sponsor link opens in a new tab and funds rural Bangladesh schools.',
      actionText: 'Click to Donate Now',
      active: true
    },
    {
      id: 'ann-4',
      badge: '1 Click = 1 Hope',
      title: 'Click-to-Donate Initiative',
      message: 'No bank card or cash required from your pocket. Click the Donate button anytime to send sponsor-backed emergency relief.',
      actionText: 'Free Donate (Opens Sponsor)',
      active: true
    },
    {
      id: 'ann-5',
      badge: 'Unlimited Support',
      title: 'Donate As Many Times As You Wish',
      message: 'Each click opens a different verified sponsor link in a new tab. The more you click, the more free humanitarian aid we deliver!',
      actionText: 'Click Again to Donate More',
      active: true
    }
  ],
  impactMetrics: [
    { id: 'm-1', label: 'Children Educated Daily', value: '4,850+', detail: 'Community classroom centers' },
    { id: 'm-2', label: 'Youth Volunteers Active', value: '16,200+', detail: 'Grassroots action chapters' },
    { id: 'm-3', label: 'Families Assisted with Necessities', value: '85,000+', detail: 'Healthcare, food & shelter support' },
    { id: 'm-4', label: 'Clean Water & Hygiene Stations', value: '340+', detail: 'Pure safe drinking water access' }
  ],
  donationStats: {
    totalSupporters: 18450,
    totalRaisedBDT: 62450000,
    mealsServed: 320000,
    cleanWaterLitres: 1850000,
    lastSupporterName: 'Supporter from Dhaka',
    lastDonationTime: new Date().toISOString()
  },
  futureProject: {
    status: 'Upcoming Official Flagship',
    launchPhase: 'Phase 1 - Groundwork & Grassroots Registration',
    targetLaunchYear: '2025-2026',
    backer: 'M R S Group',
    notice: 'M R S Charity Foundation is an upcoming initiative dedicated to healthcare, education & essential necessities.'
  },
  automaticSystem: {
    enabled: true,
    autoSupporterIncrement: true,
    supporterIncrementIntervalSec: 8,
    autoTickerSync: true,
    lastAutoUpdate: new Date().toISOString(),
    totalAutoTicks: 0,
    syncIntervalSec: 5,
    updateLog: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'SERVICE_READY',
        details: 'Community live sync initialized.',
        source: 'core'
      }
    ]
  },
  brainEngine: {
    enabled: true,
    persuasionMode: 'goal-gradient' as 'goal-gradient' | 'empathy' | 'urgency' | 'social-proof',
    dailyGoalClicks: 500,
    todayClicks: 427,
    clickImpactUnit: '1 Child Meal + 1 Study Notebook Credit',
    activeHeadline: 'Only {remaining} Free Clicks Left to Complete Today’s Rural Aid Goal',
    activeSubtext: 'Zero money needed from your pocket—one quick click unlocks sponsor-funded meals and school kits for children.',
    activeCtaLabel: 'Unlock Free Meal & Study Aid (1-Click)',
    floatingNudge: {
      enabled: true,
      delaySeconds: 6,
      badge: 'Daily Milestone · Almost Complete',
      headline: 'Help Finish Today’s Rural School & Meal Batch',
      message: 'Every click opens a sponsor partner in a new tab and immediately credits a child’s meal at $0 cost to you.',
      ctaLabel: '1-Click Free Support'
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
    activityStream: [
      {
        id: 'act-1',
        location: 'Dhaka',
        actionText: 'unlocked 1 Child Meal & Study Credit (0 cost)',
        impactText: '+1 Free Support Click',
        timestamp: new Date().toISOString()
      },
      {
        id: 'act-2',
        location: 'Sylhet',
        actionText: 'sponsored clean drinking water sachet via free link',
        impactText: '+1 Water Credit',
        timestamp: new Date(Date.now() - 25000).toISOString()
      },
      {
        id: 'act-3',
        location: 'London, UK',
        actionText: 'completed 3 consecutive free sponsor support clicks',
        impactText: '+3 Meal Credits',
        timestamp: new Date(Date.now() - 55000).toISOString()
      }
    ],
    realClickAnalytics: {
      totalRealClicks: 0,
      lastRealClickAt: '',
      clicksBySection: {} as Record<string, number>
    }
  },
  knowledgeBase: {
    missionBrief: 'M R S Charity Foundation is currently an active online-based humanitarian initiative mobilizing foundational resources at zero cost to everyday visitors. Every verified sponsor link click accumulates real support toward launching our upcoming flagship ground project by M R S.',
    howItWorksSummary: 'Commercial brand partners pay verified sponsorship rates when visitors open our partner links. We allocate those sponsor proceeds toward rural learning hubs, daily student nutrition, clean water wells, and rapid disaster relief—so you give meaningfully without spending personal money.',
    transparencyNote: 'All foundational funds gathered during the current online phase are transparently tracked and reserved for establishing M R S community learning centers and relief operations.',
    faqs: [
      {
        id: 'faq-1',
        category: 'Zero-Cost Giving',
        question: 'How does clicking a button donate without using my money?',
        answer: 'When you click any free support button, a verified sponsor partner page opens in a new tab. Our advertising & corporate sponsor partners fund that visit directly, allowing us to convert everyday web clicks into meals, school notebooks, and clean water credits at zero cost to you.',
        ctaText: 'Try 1 Free Support Click Now',
        active: true
      },
      {
        id: 'faq-2',
        category: 'Repeat Support',
        question: 'Can I click more than once to generate more help?',
        answer: 'Yes! Each click automatically rotates through 10 different verified sponsor links. Clicking multiple times opens a fresh partner link each time and compounds the support credited toward today’s community milestone.',
        ctaText: 'Open Next Sponsor Link (Free)',
        active: true
      },
      {
        id: 'faq-3',
        category: 'Project Roadmap',
        question: 'Where does M R S Charity Foundation currently operate?',
        answer: 'Right now we are in our online fund-collection and community-building phase. The resources raised online are directly preparing the upcoming major ground project by M R S—establishing free rural primary schools, clean water stations, and family relief kitchens.',
        ctaText: 'Support the Upcoming Launch (Free)',
        active: true
      },
      {
        id: 'faq-4',
        category: 'Trust & Safety',
        question: 'Do I ever need to enter bank cards, passwords, or personal payment details?',
        answer: 'Never. We never ask visitors for credit cards, mobile banking PINs, or cash transfers on this portal. Every action on this site is 100% free and powered entirely by verified sponsor clicks.',
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
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'London, UK',
  'Toronto, Canada',
  'Comilla'
];

const BRAIN_ACTIVITY_TEMPLATES = [
  'unlocked 1 Child Meal & Study Credit (0 cost)',
  'sponsored a clean drinking water sachet via free click',
  'contributed to today’s rural classroom kit goal',
  'supported a student textbook pack without paying a cent',
  'completed a free sponsor click for emergency relief'
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
        const mealBump = supporterBump * 2;
        const actionText = BRAIN_ACTIVITY_TEMPLATES[Math.floor(Math.random() * BRAIN_ACTIVITY_TEMPLATES.length)];

        currentContent.donationStats.totalSupporters += supporterBump;
        currentContent.donationStats.mealsServed += mealBump;
        currentContent.donationStats.cleanWaterLitres += supporterBump * 5;
        currentContent.donationStats.lastSupporterName = `Supporter from ${city}`;
        currentContent.donationStats.lastDonationTime = new Date().toISOString();

        if (currentContent.brainEngine?.enabled) {
          currentContent.brainEngine.todayClicks = (currentContent.brainEngine.todayClicks || 427) + 1;
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

  // Block automated vulnerability scanners and common exploit probe paths
  const BLOCKED_PROBE_REGEX = /^\/(\.env|\.git|wp-admin|wp-login|wp-content|phpinfo|phpmyadmin|server-status|config\.json|administrator|admin\.php|xmlrpc\.php)/i;
  app.use((req, res, next) => {
    if (BLOCKED_PROBE_REGEX.test(req.path)) {
      return res.status(404).end();
    }
    next();
  });

  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /api/\nDisallow: /brain\nDisallow: /mrs-vault\n');
  });

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  const publicDir = path.resolve(__dirname, 'public');

  app.get(['/logo.png', '/logo.jpg'], (req, res) => {
    const filename = req.path.endsWith('.jpg') ? 'logo.jpg' : 'logo.png';
    const filePath = path.resolve(publicDir, filename);
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
    currentContent.donationStats.mealsServed += 2;
    currentContent.donationStats.cleanWaterLitres += 5;
    currentContent.donationStats.lastSupporterName = 'Verified Community Supporter';
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
      location: 'Verified Live Click',
      actionText: `unlocked 1 Child Meal & Study Credit (Partner #${linkNumber})`,
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
    currentContent.donationStats.mealsServed += bump * 3;
    currentContent.donationStats.lastSupporterName = `Supporter from ${randomRegion}`;
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
    currentContent.donationStats.mealsServed += addClicks * 2;
    currentContent.brainEngine.todayClicks = (currentContent.brainEngine.todayClicks || 0) + addClicks;
    if (currentContent.brainEngine.todayClicks >= currentContent.brainEngine.dailyGoalClicks) {
      currentContent.brainEngine.dailyGoalClicks += 250;
    }

    const newActivity = {
      id: `pulse-${Date.now()}`,
      location: (typeof location === 'string' && location.trim()) ? location.trim() : 'Dhaka',
      actionText: (typeof actionText === 'string' && actionText.trim()) ? actionText.trim() : 'unlocked 1 Child Meal & Study Credit (0 cost)',
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

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`M R S Charity Foundation server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
