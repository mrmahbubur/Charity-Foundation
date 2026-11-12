/**
 * Sponsor Ad Click-to-Donate Service
 * Allows visitors to support MRS Charity Foundation for 100% free with zero money needed.
 * Every click rotates through verified sponsor links and opens in a new tab.
 */

export const DONATE_SPONSOR_LINKS = [
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

const STORAGE_INDEX_KEY = 'mrs_donate_link_index';
const STORAGE_CLICKS_KEY = 'mrs_donate_total_clicks';

let memoryIndex = 0;
let memoryClicks = 0;

export function getNextDonateLink(): { url: string; index: number } {
  let currentIndex = memoryIndex;
  try {
    const saved = localStorage.getItem(STORAGE_INDEX_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        currentIndex = parsed % DONATE_SPONSOR_LINKS.length;
      }
    }
  } catch {
    currentIndex = memoryIndex % DONATE_SPONSOR_LINKS.length;
  }

  const url = DONATE_SPONSOR_LINKS[currentIndex];
  return { url, index: currentIndex };
}

export function advanceDonateLink(): number {
  const { index: current } = getNextDonateLink();
  const nextIndex = (current + 1) % DONATE_SPONSOR_LINKS.length;
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
 * using an anchor tag element.
 */
export function openNextSponsorLink(): { url: string; linkNumber: number; totalClicks: number } {
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

  return {
    url,
    linkNumber: index + 1,
    totalClicks,
  };
}
