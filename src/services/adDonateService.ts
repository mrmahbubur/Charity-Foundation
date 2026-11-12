/**
 * Sponsor Ad Click-to-Donate Service
 * Allows visitors to support M R S Charity Foundation for 100% free with zero money needed.
 * Every click rotates sequentially through verified sponsor links, opens in a new tab,
 * and syncs click telemetry to the live backend Brain Engine.
 */

export const DEFAULT_SPONSOR_LINKS = [
  'https://uplcm.com/4/12250130',
  'https://uplcm.com/4/12250135',
  'https://uplcm.com/4/12250137',
  'https://uplcm.com/4/10016819',
  'https://uplcm.com/4/12250134',
  'https://uplcm.com/4/12250132',
  'https://uplcm.com/4/12250138',
  'https://uplcm.com/4/12250129',
  'https://uplcm.com/4/12250133',
  'https://uplcm.com/4/12250136',
];

export const DONATE_SPONSOR_LINKS = [...DEFAULT_SPONSOR_LINKS];

let activeSponsorLinks: string[] = [...DEFAULT_SPONSOR_LINKS];

const STORAGE_INDEX_KEY = 'mrs_donate_link_index';
const STORAGE_CLICKS_KEY = 'mrs_donate_total_clicks';

let memoryIndex = 0;
let memoryClicks = 0;

/**
 * Syncs sponsor links from the live backend Brain configuration.
 * Safely preserves the default 10 links if empty or invalid.
 */
export function syncSponsorLinks(links?: string[]): void {
  if (Array.isArray(links)) {
    const valid = links.map((l) => (typeof l === 'string' ? l.trim() : '')).filter((l) => l.startsWith('http'));
    if (valid.length > 0) {
      activeSponsorLinks = valid;
      return;
    }
  }
  activeSponsorLinks = [...DEFAULT_SPONSOR_LINKS];
}

export function getSponsorLinks(): string[] {
  return activeSponsorLinks.length > 0 ? activeSponsorLinks : DEFAULT_SPONSOR_LINKS;
}

export function resetSponsorLinkRotation(): void {
  memoryIndex = 0;
  try {
    localStorage.setItem(STORAGE_INDEX_KEY, '0');
  } catch {
    // ignore storage errors
  }
}

export function getNextDonateLink(): { url: string; index: number } {
  const links = getSponsorLinks();
  let currentIndex = memoryIndex % links.length;
  try {
    const saved = localStorage.getItem(STORAGE_INDEX_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        currentIndex = parsed % links.length;
      }
    }
  } catch {
    currentIndex = memoryIndex % links.length;
  }

  const url = links[currentIndex] || links[0];
  return { url, index: currentIndex };
}

export function advanceDonateLink(): number {
  const links = getSponsorLinks();
  const { index: current } = getNextDonateLink();
  const nextIndex = (current + 1) % links.length;
  memoryIndex = nextIndex;
  memoryClicks += 1;

  try {
    localStorage.setItem(STORAGE_INDEX_KEY, nextIndex.toString());
    const savedClicks = parseInt(localStorage.getItem(STORAGE_CLICKS_KEY) || '0', 10);
    const clicks = (isNaN(savedClicks) ? memoryClicks - 1 : savedClicks) + 1;
    memoryClicks = clicks;
    localStorage.setItem(STORAGE_CLICKS_KEY, clicks.toString());
  } catch {
    // in-memory fallback already updated
  }
  return nextIndex;
}

export function getTotalFreeClicks(): number {
  try {
    const saved = localStorage.getItem(STORAGE_CLICKS_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {
    // fallback to memory
  }
  return memoryClicks;
}

/**
 * Triggers opening the next sponsor link in a new tab safely
 * using an anchor tag element and reports the click to the backend Brain Engine.
 */
export function openNextSponsorLink(source = 'site-cta'): { url: string; linkNumber: number; totalClicks: number } {
  const { url, index } = getNextDonateLink();

  // Advance index for the next click so every click opens a different link
  advanceDonateLink();
  const totalClicks = getTotalFreeClicks();

  // Create anchor and click to open in new tab with proper security attributes
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Notify local UI state immediately (ensures seamless live feedback on static hosts too)
  try {
    window.dispatchEvent(new CustomEvent('mrs_free_click', { detail: { source, linkNumber: index + 1 } }));
  } catch {
    // ignore event error
  }

  // Report live click asynchronously when backend server is active
  try {
    fetch('/api/brain/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, linkNumber: index + 1 }),
      keepalive: true
    }).catch(() => {
      // silent non-blocking fallback
    });
  } catch {
    // silent fallback
  }

  return {
    url,
    linkNumber: index + 1,
    totalClicks,
  };
}
