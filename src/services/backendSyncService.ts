export interface FoundationInfo {
  name: string;
  shortName: string;
  logo: string;
  parentOrg: string;
  motto: string;
  secondaryMotto: string;
  mission: string;
}

export interface UrgentNotice {
  enabled: boolean;
  badge: string;
  headline: string;
  description: string;
  ctaText: string;
  severity: 'high' | 'critical' | 'info';
}

export interface AnnouncementSlide {
  id: string;
  badge: string;
  title: string;
  message: string;
  actionText: string;
  active: boolean;
}

export interface ImpactMetricItem {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface DonationStats {
  totalSupporters: number;
  totalRaisedBDT: number;
  mealsServed: number;
  cleanWaterLitres: number;
  lastSupporterName: string;
  lastDonationTime: string;
}

export interface BackendLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  source: string;
}

export interface AutomaticSystemConfig {
  enabled: boolean;
  autoSupporterIncrement: boolean;
  supporterIncrementIntervalSec: number;
  autoTickerSync: boolean;
  lastAutoUpdate: string;
  totalAutoTicks: number;
  syncIntervalSec: number;
  updateLog: BackendLog[];
}

export interface FloatingNudgeConfig {
  enabled: boolean;
  delaySeconds: number;
  badge: string;
  headline: string;
  message: string;
  ctaLabel: string;
}

export interface BrainActivityItem {
  id: string;
  location: string;
  actionText: string;
  impactText: string;
  timestamp: string;
}

export interface BrainEngineConfig {
  enabled: boolean;
  persuasionMode: 'goal-gradient' | 'empathy' | 'urgency' | 'social-proof';
  dailyGoalClicks: number;
  todayClicks: number;
  clickImpactUnit: string;
  activeHeadline: string;
  activeSubtext: string;
  activeCtaLabel: string;
  floatingNudge: FloatingNudgeConfig;
  sponsorLinks: string[];
  activityStream: BrainActivityItem[];
  realClickAnalytics: {
    totalRealClicks: number;
    lastRealClickAt: string;
    clicksBySection: Record<string, number>;
  };
}

export interface KnowledgeFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  ctaText: string;
  active: boolean;
}

export interface KnowledgeBaseConfig {
  missionBrief: string;
  howItWorksSummary: string;
  transparencyNote: string;
  faqs: KnowledgeFaqItem[];
}

export interface SiteContentState {
  version: number;
  lastUpdated: string;
  foundationInfo: FoundationInfo;
  urgentNotice: UrgentNotice;
  announcements: AnnouncementSlide[];
  impactMetrics: ImpactMetricItem[];
  donationStats: DonationStats;
  futureProject: {
    status: string;
    launchPhase: string;
    targetLaunchYear: string;
    backer: string;
    notice: string;
  };
  automaticSystem: AutomaticSystemConfig;
  brainEngine: BrainEngineConfig;
  knowledgeBase: KnowledgeBaseConfig;
}

export const INITIAL_SITE_STATE: SiteContentState = {
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
    updateLog: []
  },
  brainEngine: {
    enabled: true,
    persuasionMode: 'goal-gradient',
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
    activityStream: [],
    realClickAnalytics: {
      totalRealClicks: 0,
      lastRealClickAt: '',
      clicksBySection: {}
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

const VAULT_TOKEN_KEY = 'mrs_vault_token';

export function getVaultToken(): string | null {
  try {
    return sessionStorage.getItem(VAULT_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setVaultToken(token: string): void {
  try {
    sessionStorage.setItem(VAULT_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
}

export function clearVaultToken(): void {
  try {
    sessionStorage.removeItem(VAULT_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

function getAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getVaultToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    clearVaultToken();
  }
}

export async function loginVault(passphrase: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/vault/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase })
    });
    const json = await res.json();
    if (res.ok && json.success && json.token) {
      setVaultToken(json.token);
      return { success: true };
    }
    return { success: false, error: json.error || 'Access denied' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Verification failed' };
  }
}

export async function verifyVaultSession(): Promise<boolean> {
  const token = getVaultToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/vault/verify', {
      headers: getAuthHeaders()
    });
    handleUnauthorized(res);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchVaultSnapshot(): Promise<{ success: boolean; connectedClients?: number; data?: SiteContentState }> {
  try {
    const res = await fetch('/api/vault/snapshot', {
      headers: getAuthHeaders()
    });
    handleUnauthorized(res);
    if (!res.ok) return { success: false };
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function rotateVaultKey(currentKey: string, newKey: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/vault/rotate-key', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentKey, newKey })
    });
    handleUnauthorized(res);
    const json = await res.json();
    if (res.ok && json.success && json.token) {
      setVaultToken(json.token);
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Key rotation failed' };
  }
}

// Public & Admin API Helpers
export async function fetchBackendContent(): Promise<SiteContentState | null> {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function sendBackendContentUpdate(updates: Partial<SiteContentState>): Promise<{ success: boolean; data?: SiteContentState; error?: string }> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

export async function sendBackendLogoUpdate(logoDataUrl: string): Promise<{ success: boolean; logo?: string; error?: string }> {
  try {
    const res = await fetch('/api/logo', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ logoDataUrl })
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Logo update failed' };
  }
}

export async function triggerBackendManualTick(): Promise<{ success: boolean; stats?: DonationStats; error?: string }> {
  try {
    const res = await fetch('/api/auto-system/trigger', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Trigger failed' };
  }
}

export async function toggleBackendAutoConfig(config: {
  enabled?: boolean;
  autoSupporterIncrement?: boolean;
  intervalSec?: number;
}): Promise<{ success: boolean; automaticSystem?: AutomaticSystemConfig; error?: string }> {
  try {
    const res = await fetch('/api/auto-system/toggle', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(config)
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Config update failed' };
  }
}

export async function resetBackendContentToDefaults(): Promise<boolean> {
  try {
    const res = await fetch('/api/content/reset', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    handleUnauthorized(res);
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateBrainEngine(
  updates: Partial<BrainEngineConfig>
): Promise<{ success: boolean; brainEngine?: BrainEngineConfig; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/brain/update', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Update failed' };
  }
}

export async function updateKnowledgeBase(
  updates: Partial<KnowledgeBaseConfig>
): Promise<{ success: boolean; knowledgeBase?: KnowledgeBaseConfig; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/brain/knowledge', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Knowledge update failed' };
  }
}

export async function triggerBrainPulse(payload: {
  location?: string;
  actionText?: string;
  impactText?: string;
  bumpClicks?: number;
}): Promise<{ success: boolean; brainEngine?: BrainEngineConfig; error?: string }> {
  try {
    const res = await fetch('/api/brain/pulse', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    handleUnauthorized(res);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Pulse trigger failed' };
  }
}
