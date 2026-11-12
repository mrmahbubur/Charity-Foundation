import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'server/data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-content.json');

// Ensure server/data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial site content with M R S Charity Foundation brand defaults
const DEFAULT_CONTENT = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  foundationInfo: {
    name: 'M R S Charity Foundation',
    shortName: 'M R S Foundation',
    logo: '/logo.png',
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
        action: 'SYSTEM_BOOT',
        details: 'Backend Brain Engine & SSE live orchestration initialized successfully.',
        source: 'backend-daemon'
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

// Load or initialize persistent data
function loadSiteContent() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure all keys exist
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
  } catch (err) {
    console.error('Error loading site content file, using defaults:', err);
  }
  saveSiteContent(DEFAULT_CONTENT);
  return DEFAULT_CONTENT;
}

function saveSiteContent(content: typeof DEFAULT_CONTENT) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing site content file:', err);
  }
}

let currentContent = loadSiteContent();

// SSE clients registry
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

// Log an action to automatic system history
function recordLog(action: string, details: string, source = 'backend-api') {
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    source
  };
  const logs = [newLog, ...(currentContent.automaticSystem.updateLog || [])].slice(0, 30);
  currentContent.automaticSystem.updateLog = logs;
}

// Backend Automatic Daemon / Background Worker
// Automatically increments live supporter metrics or updates stats in backend and pushes to the site
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
        const supporterBump = Math.floor(Math.random() * 2) + 1; // +1 or +2
        const mealBump = supporterBump * 2;
        const actionText = BRAIN_ACTIVITY_TEMPLATES[Math.floor(Math.random() * BRAIN_ACTIVITY_TEMPLATES.length)];

        currentContent.donationStats.totalSupporters += supporterBump;
        currentContent.donationStats.mealsServed += mealBump;
        currentContent.donationStats.cleanWaterLitres += supporterBump * 5;
        currentContent.donationStats.lastSupporterName = `Supporter from ${city}`;
        currentContent.donationStats.lastDonationTime = new Date().toISOString();

        // Update Brain Engine daily milestone progress realistically
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
            'BRAIN_PULSE',
            `Brain pulse synced (+${supporterBump} from ${city}, Daily: ${currentContent.brainEngine.todayClicks}/${currentContent.brainEngine.dailyGoalClicks})`,
            'backend-brain'
          );
          saveSiteContent(currentContent);
        }

        broadcastUpdate('AUTO_TICK', {
          donationStats: currentContent.donationStats,
          brainEngine: currentContent.brainEngine,
          automaticSystem: {
            lastAutoUpdate: currentContent.automaticSystem.lastAutoUpdate,
            totalAutoTicks: currentContent.automaticSystem.totalAutoTicks
          }
        });
      }
    } catch (err) {
      console.error('Brain tick error:', err);
    } finally {
      scheduleNextBrainTick();
    }
  }, intervalMs);
}
scheduleNextBrainTick();

// Heartbeat keepalive for SSE clients every 15 seconds
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

  // Support large base64 image uploads for logo
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static directory for uploaded logos and public assets
  const publicDir = path.resolve(__dirname, 'public');
  
  // Serve official logo with no-cache so browsers always fetch current logo without stale cache
  app.get(['/logo.png', '/logo.jpg'], (req, res) => {
    const filename = req.path.endsWith('.jpg') ? 'logo.jpg' : 'logo.png';
    const filePath = path.resolve(publicDir, filename);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(filePath);
  });

  app.use(express.static(publicDir));

  // --- API ROUTES ---

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'MRS Charity Foundation Backend System',
      version: currentContent.version,
      activeSseConnections: sseClients.size,
      uptimeSec: Math.floor(process.uptime()),
      autoSystemEnabled: currentContent.automaticSystem.enabled
    });
  });

  // Server-Sent Events (SSE) Real-Time Stream
  // Any update made in backend is immediately pushed here to all clients
  app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    sseClients.add(res);

    // Send initial snapshot immediately
    res.write(`event: init\ndata: ${JSON.stringify({
      type: 'INIT',
      version: currentContent.version,
      lastUpdated: currentContent.lastUpdated,
      content: currentContent
    })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // Get current complete site content
  app.get('/api/content', (_req, res) => {
    res.json({
      success: true,
      data: currentContent
    });
  });

  // Update site content in backend and immediately implement across all connected sites
  app.post('/api/content', (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid update body' });
    }

    // Merge updates
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

    recordLog('CONTENT_UPDATE', `Site content updated via backend API (version ${currentContent.version})`, req.headers['x-source'] as string || 'api-request');
    saveSiteContent(currentContent);

    // Instantly push to all connected users
    broadcastUpdate('FULL_SYNC', currentContent);

    res.json({
      success: true,
      message: 'Backend content updated successfully and broadcasted live to site!',
      version: currentContent.version,
      data: currentContent
    });
  });

  // Upload or update site logo in backend - automatically reflected everywhere on the site!
  app.post('/api/logo', (req, res) => {
    const { logoDataUrl } = req.body;
    if (!logoDataUrl || typeof logoDataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'logoDataUrl is required' });
    }

    try {
      // If it is a data URL (e.g. data:image/png;base64,...), save directly as public/logo.png
      if (logoDataUrl.startsWith('data:image/')) {
        const matches = logoDataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], 'base64');
          const targetLogoPath = path.resolve(publicDir, 'logo.png');
          fs.writeFileSync(targetLogoPath, buffer);
        }
      }

      const versionedLogo = `/logo.png?v=${Date.now()}`;
      currentContent.foundationInfo.logo = versionedLogo;
      currentContent.version += 1;
      currentContent.lastUpdated = new Date().toISOString();

      recordLog('LOGO_UPDATE', `Official site logo updated in backend and written to public/logo.png`, 'logo-uploader');
      saveSiteContent(currentContent);

      broadcastUpdate('LOGO_UPDATE', { logo: versionedLogo, foundationInfo: currentContent.foundationInfo });

      res.json({
        success: true,
        message: 'Logo updated in backend and implemented across the entire site!',
        logo: versionedLogo,
        version: currentContent.version
      });
    } catch (err: any) {
      console.error('Error saving logo in backend:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save logo' });
    }
  });

  // Manage Announcements ticker in backend
  app.post('/api/announcements', (req, res) => {
    const { announcements } = req.body;
    if (!Array.isArray(announcements)) {
      return res.status(400).json({ success: false, error: 'announcements must be an array' });
    }

    currentContent.announcements = announcements;
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('ANNOUNCEMENTS_UPDATE', `Announcements slideshow updated in backend (${announcements.length} slides)`);
    saveSiteContent(currentContent);

    broadcastUpdate('ANNOUNCEMENTS_UPDATE', { announcements: currentContent.announcements });

    res.json({
      success: true,
      message: 'Announcements updated and broadcasted!',
      announcements: currentContent.announcements
    });
  });

  // Urgent Notice Banner control
  app.post('/api/urgent-notice', (req, res) => {
    const { urgentNotice } = req.body;
    if (!urgentNotice || typeof urgentNotice !== 'object') {
      return res.status(400).json({ success: false, error: 'urgentNotice must be an object' });
    }

    currentContent.urgentNotice = { ...currentContent.urgentNotice, ...urgentNotice };
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('URGENT_NOTICE_UPDATE', `Urgent notice ${currentContent.urgentNotice.enabled ? 'activated' : 'deactivated'}: ${currentContent.urgentNotice.headline}`);
    saveSiteContent(currentContent);

    broadcastUpdate('URGENT_NOTICE_UPDATE', { urgentNotice: currentContent.urgentNotice });

    res.json({
      success: true,
      message: 'Urgent notice updated and broadcasted!',
      urgentNotice: currentContent.urgentNotice
    });
  });

  // Automatic System Configuration & Trigger
  app.post('/api/auto-system/toggle', (req, res) => {
    const { enabled, autoSupporterIncrement, intervalSec } = req.body;
    if (typeof enabled === 'boolean') {
      currentContent.automaticSystem.enabled = enabled;
    }
    if (typeof autoSupporterIncrement === 'boolean') {
      currentContent.automaticSystem.autoSupporterIncrement = autoSupporterIncrement;
    }
    if (typeof intervalSec === 'number' && intervalSec >= 1 && intervalSec <= 60) {
      currentContent.automaticSystem.supporterIncrementIntervalSec = intervalSec;
    }

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog(
      'AUTO_CONFIG_CHANGE',
      `Automatic backend system config changed: enabled=${currentContent.automaticSystem.enabled}, interval=${currentContent.automaticSystem.supporterIncrementIntervalSec}s`
    );
    saveSiteContent(currentContent);

    broadcastUpdate('AUTO_CONFIG_UPDATE', currentContent.automaticSystem);

    res.json({
      success: true,
      message: 'Automatic system configuration updated in backend!',
      automaticSystem: currentContent.automaticSystem
    });
  });

  // Manual Trigger: Immediately run an automated update cycle from backend and push to site
  app.post('/api/auto-system/trigger', (_req, res) => {
    const randomRegion = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];
    const bump = Math.floor(Math.random() * 3) + 1;

    currentContent.donationStats.totalSupporters += bump;
    currentContent.donationStats.mealsServed += bump * 3;
    currentContent.donationStats.lastSupporterName = randomRegion;
    currentContent.donationStats.lastDonationTime = new Date().toISOString();
    currentContent.automaticSystem.lastAutoUpdate = new Date().toISOString();
    currentContent.automaticSystem.totalAutoTicks = (currentContent.automaticSystem.totalAutoTicks || 0) + 1;
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog(
      'MANUAL_TRIGGER',
      `Manual test trigger fired: +${bump} supporters from ${randomRegion} (New Total: ${currentContent.donationStats.totalSupporters.toLocaleString()})`,
      'admin-ui'
    );
    saveSiteContent(currentContent);

    broadcastUpdate('MANUAL_TRIGGER', {
      donationStats: currentContent.donationStats,
      automaticSystem: currentContent.automaticSystem
    });

    res.json({
      success: true,
      message: 'Backend automated update triggered and pushed to all sites!',
      version: currentContent.version,
      stats: currentContent.donationStats
    });
  });

  // Status & Logs
  app.get('/api/auto-system/status', (_req, res) => {
    res.json({
      success: true,
      connectedClients: sseClients.size,
      version: currentContent.version,
      lastUpdated: currentContent.lastUpdated,
      automaticSystem: currentContent.automaticSystem
    });
  });

  app.get('/api/auto-system/logs', (_req, res) => {
    res.json({
      success: true,
      logs: currentContent.automaticSystem.updateLog || []
    });
  });

  // --- BRAIN ENGINE & KNOWLEDGE CONTROL API ROUTES ---

  // Real-time click telemetry & instant psychological reward broadcast when visitor clicks an ad link
  app.post('/api/brain/click', (req, res) => {
    const source = (req.body?.source && typeof req.body.source === 'string') ? req.body.source : 'site-cta';
    const linkNumber = req.body?.linkNumber || 1;
    const city = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];

    currentContent.donationStats.totalSupporters += 1;
    currentContent.donationStats.mealsServed += 2;
    currentContent.donationStats.cleanWaterLitres += 5;
    currentContent.donationStats.lastSupporterName = `Live Supporter (${source})`;
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
      impactText: '+1 Real Click',
      timestamp: new Date().toISOString()
    };
    currentContent.brainEngine.activityStream = [
      newActivity,
      ...(currentContent.brainEngine.activityStream || [])
    ].slice(0, 12);

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('REAL_AD_CLICK', `Visitor clicked sponsor link #${linkNumber} via "${source}" (Total real clicks: ${analytics.totalRealClicks})`, 'visitor-click');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      donationStats: currentContent.donationStats,
      brainEngine: currentContent.brainEngine
    });

    res.json({
      success: true,
      todayClicks: currentContent.brainEngine.todayClicks,
      dailyGoalClicks: currentContent.brainEngine.dailyGoalClicks,
      totalSupporters: currentContent.donationStats.totalSupporters,
      realClicks: analytics.totalRealClicks
    });
  });

  // Complete control over Brain Engine (persuasion mode, goals, copy, floating nudge, sponsor links)
  app.post('/api/brain/update', (req, res) => {
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
      currentContent.brainEngine.sponsorLinks = updates.sponsorLinks.filter((u: any) => typeof u === 'string' && u.trim().startsWith('http'));
    }

    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    recordLog('BRAIN_CONFIG_UPDATE', `Brain Engine updated (mode=${currentContent.brainEngine.persuasionMode}, goal=${currentContent.brainEngine.dailyGoalClicks})`, 'brain-console');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      brainEngine: currentContent.brainEngine
    });

    res.json({
      success: true,
      message: 'Backend Brain Engine updated and pushed live!',
      brainEngine: currentContent.brainEngine
    });
  });

  // Complete control over Foundation Knowledge Base (mission brief, transparency, FAQs)
  app.post('/api/brain/knowledge', (req, res) => {
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

    recordLog('KNOWLEDGE_UPDATE', `Knowledge Base updated (${(currentContent.knowledgeBase.faqs || []).length} entries synced live)`, 'brain-console');
    saveSiteContent(currentContent);

    broadcastUpdate('KNOWLEDGE_UPDATE', {
      knowledgeBase: currentContent.knowledgeBase
    });

    res.json({
      success: true,
      message: 'Knowledge Base updated and synced live!',
      knowledgeBase: currentContent.knowledgeBase
    });
  });

  // Push custom live activity / persuasion burst immediately to all connected viewers
  app.post('/api/brain/pulse', (req, res) => {
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

    recordLog('BRAIN_CUSTOM_PULSE', `Custom live viewer pulse pushed from ${newActivity.location}: ${newActivity.actionText}`, 'brain-console');
    saveSiteContent(currentContent);

    broadcastUpdate('BRAIN_UPDATE', {
      donationStats: currentContent.donationStats,
      brainEngine: currentContent.brainEngine
    });

    res.json({
      success: true,
      message: 'Live viewer pulse broadcasted!',
      activity: newActivity,
      brainEngine: currentContent.brainEngine
    });
  });

  // Reset to brand defaults if needed
  app.post('/api/content/reset', (_req, res) => {
    currentContent = {
      ...DEFAULT_CONTENT,
      version: currentContent.version + 1,
      lastUpdated: new Date().toISOString()
    };
    recordLog('SYSTEM_RESET', 'Content reset to default M R S Charity Foundation values', 'admin-reset');
    saveSiteContent(currentContent);
    broadcastUpdate('FULL_SYNC', currentContent);
    res.json({ success: true, message: 'Content reset to defaults' });
  });

  // --- VITE MIDDLEWARES / STATIC SERVING ---
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
    console.log(`MRS Charity Foundation Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
