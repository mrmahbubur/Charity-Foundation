export interface FoundationInfo {
  name: string;
  shortName: string;
  logo: string;
  parentOrg: string;
  motto: string;
  secondaryMotto: string;
  mission: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    helpline?: string;
  };
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
}

export const INITIAL_SITE_STATE: SiteContentState = {
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
    updateLog: []
  }
};

// API Helpers
export async function fetchBackendContent(): Promise<SiteContentState | null> {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Could not fetch backend content:', err);
    return null;
  }
}

export async function sendBackendContentUpdate(updates: Partial<SiteContentState>): Promise<{ success: boolean; data?: SiteContentState; error?: string }> {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-source': 'admin-control-panel' },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

export async function sendBackendLogoUpdate(logoDataUrl: string): Promise<{ success: boolean; logo?: string; error?: string }> {
  try {
    const res = await fetch('/api/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoDataUrl })
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || 'Logo update failed' };
  }
}

export async function triggerBackendManualTick(): Promise<{ success: boolean; stats?: DonationStats; error?: string }> {
  try {
    const res = await fetch('/api/auto-system/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Config update failed' };
  }
}

export async function resetBackendContentToDefaults(): Promise<boolean> {
  try {
    const res = await fetch('/api/content/reset', { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}
