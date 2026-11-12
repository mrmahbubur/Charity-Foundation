/**
 * Supporter Tracker Service
 * Automatically counts every click on the site and updates the live supporter count on screen.
 * Tracks total supporters, user-contributed clicks, and persists them to localStorage.
 */

const STORAGE_TOTAL_SUPPORTERS_KEY = 'mrs_total_supporters_count';
const STORAGE_USER_CLICKS_KEY = 'mrs_user_clicks_count';
const BASE_SUPPORTERS_COUNT = 28450;

type SupporterListener = (data: {
  totalSupporters: number;
  userClicks: number;
  recentLocation?: string;
}) => void;

class SupporterTracker {
  private totalSupporters: number = BASE_SUPPORTERS_COUNT;
  private userClicks: number = 0;
  private listeners: Set<SupporterListener> = new Set();
  private isInitialized = false;

  private randomLocations = [
    'Dhaka, Bangladesh',
    'Chittagong, Bangladesh',
    'Sylhet, Bangladesh',
    'Rajshahi, Bangladesh',
    'Khulna, Bangladesh',
    'Barisal, Bangladesh',
    'Rangpur, Bangladesh',
    'London, UK',
    'New York, USA',
    'Toronto, Canada',
    'Sydney, Australia',
    'Dubai, UAE',
    'Kuala Lumpur, Malaysia'
  ];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedClicks = localStorage.getItem(STORAGE_USER_CLICKS_KEY);
      if (savedClicks !== null) {
        this.userClicks = parseInt(savedClicks, 10) || 0;
      }

      const savedTotal = localStorage.getItem(STORAGE_TOTAL_SUPPORTERS_KEY);
      if (savedTotal !== null) {
        this.totalSupporters = Math.max(BASE_SUPPORTERS_COUNT, parseInt(savedTotal, 10) || BASE_SUPPORTERS_COUNT);
      } else {
        this.totalSupporters = BASE_SUPPORTERS_COUNT + this.userClicks;
        this.saveState();
      }
    } catch {
      this.totalSupporters = BASE_SUPPORTERS_COUNT;
      this.userClicks = 0;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_USER_CLICKS_KEY, this.userClicks.toString());
      localStorage.setItem(STORAGE_TOTAL_SUPPORTERS_KEY, this.totalSupporters.toString());
    } catch {
      // Storage might be restricted in some iframe contexts
    }
  }

  /**
   * Initializes the automatic global click tracking listener.
   * Every click on the document increments user clicks and updates screen supporters.
   */
  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Listen to every click across the entire document
    document.addEventListener('click', (e: MouseEvent) => {
      this.recordClick(e.clientX, e.clientY);
    }, { capture: true, passive: true });

    // Subtle background heartbeat: new supporters join periodically from around the world
    setInterval(() => {
      this.simulateGlobalSupporter();
    }, 24000);
  }

  public recordClick(clientX?: number, clientY?: number) {
    this.userClicks += 1;
    this.totalSupporters += 1;
    this.saveState();
    this.notify();

    // Spawn floating "+1 Supporter" animation badge at click position
    if (clientX !== undefined && clientY !== undefined && clientX > 0 && clientY > 0) {
      this.spawnClickParticle(clientX, clientY);
    }
  }

  public addSupporters(count: number = 1) {
    this.totalSupporters += count;
    this.userClicks += count;
    this.saveState();
    this.notify();
  }

  private simulateGlobalSupporter() {
    const randomLoc = this.randomLocations[Math.floor(Math.random() * this.randomLocations.length)];
    this.totalSupporters += 1;
    this.saveState();
    this.notify(randomLoc);
  }

  private spawnClickParticle(x: number, y: number) {
    if (typeof document === 'undefined') return;

    const badge = document.createElement('div');
    badge.className = 'fixed pointer-events-none select-none z-50 text-xs font-extrabold text-emerald-600 bg-white/95 px-2.5 py-1 rounded-full shadow-lg border border-emerald-300 flex items-center gap-1 transition-all duration-700';
    badge.style.left = `${Math.min(window.innerWidth - 120, Math.max(10, x - 30))}px`;
    badge.style.top = `${Math.max(10, y - 25)}px`;
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0) scale(1)';
    badge.innerHTML = `<span>❤️</span><span>+1 Supporter!</span>`;

    document.body.appendChild(badge);

    // Animate up and fade out
    requestAnimationFrame(() => {
      badge.style.transform = 'translateY(-35px) scale(1.1)';
      badge.style.opacity = '0';
    });

    setTimeout(() => {
      if (badge.parentNode) {
        badge.parentNode.removeChild(badge);
      }
    }, 750);
  }

  public subscribe(listener: SupporterListener): () => void {
    this.listeners.add(listener);
    // Send immediate current state
    listener({
      totalSupporters: this.totalSupporters,
      userClicks: this.userClicks,
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(recentLocation?: string) {
    const data = {
      totalSupporters: this.totalSupporters,
      userClicks: this.userClicks,
      recentLocation,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Error notifying supporter listener', err);
      }
    });
  }

  public getState() {
    return {
      totalSupporters: this.totalSupporters,
      userClicks: this.userClicks,
    };
  }
}

export const supporterTracker = new SupporterTracker();
