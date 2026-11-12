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
    supporterIncrementIntervalSec: 6,
    autoTickerSync: true,
    lastAutoUpdate: new Date().toISOString(),
    totalAutoTicks: 0,
    syncIntervalSec: 5,
    updateLog: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_BOOT',
        details: 'Backend Automatic System initialized successfully with persistent storage and SSE live sync stream.',
        source: 'backend-daemon'
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
        automaticSystem: { ...DEFAULT_CONTENT.automaticSystem, ...(parsed.automaticSystem || {}) }
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
  'Supporter from Dhaka',
  'Supporter from Chittagong',
  'Supporter from Sylhet',
  'Supporter from Rajshahi',
  'Supporter from Khulna',
  'Supporter from Barisal',
  'Supporter from Rangpur',
  'Global Humanitarian Supporter',
  'Youth Volunteer from Bogura',
  'Grassroots Partner from Comilla'
];

let autoTickCounter = 0;
setInterval(() => {
  if (!currentContent.automaticSystem.enabled) return;

  if (currentContent.automaticSystem.autoSupporterIncrement) {
    autoTickCounter++;
    const randomRegion = RANDOM_REGIONS[Math.floor(Math.random() * RANDOM_REGIONS.length)];
    const supporterBump = Math.floor(Math.random() * 2) + 1; // +1 or +2
    const mealBump = supporterBump * 3;

    currentContent.donationStats.totalSupporters += supporterBump;
    currentContent.donationStats.mealsServed += mealBump;
    currentContent.donationStats.lastSupporterName = randomRegion;
    currentContent.donationStats.lastDonationTime = new Date().toISOString();
    currentContent.automaticSystem.lastAutoUpdate = new Date().toISOString();
    currentContent.automaticSystem.totalAutoTicks = (currentContent.automaticSystem.totalAutoTicks || 0) + 1;
    currentContent.version += 1;
    currentContent.lastUpdated = new Date().toISOString();

    // Log every 5 ticks to avoid flooding
    if (autoTickCounter % 5 === 0) {
      recordLog(
        'AUTO_TICK',
        `Backend automated worker synced supporter counter (+${supporterBump} from ${randomRegion}, Total: ${currentContent.donationStats.totalSupporters.toLocaleString()})`,
        'backend-worker'
      );
      saveSiteContent(currentContent);
    }

    // Broadcast live to all connected sites
    broadcastUpdate('AUTO_TICK', {
      donationStats: currentContent.donationStats,
      automaticSystem: {
        lastAutoUpdate: currentContent.automaticSystem.lastAutoUpdate,
        totalAutoTicks: currentContent.automaticSystem.totalAutoTicks
      }
    });
  }
}, (currentContent.automaticSystem.supporterIncrementIntervalSec || 6) * 1000);

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
