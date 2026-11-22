/**
 * Supporter Tracker Service
 * Automatically counts every click on the site and updates the live supporter count on screen.
 * Tracks total supporters, user-contributed clicks, and persists them to localStorage.
 */

const STORAGE_TOTAL_SUPPORTERS_KEY = 'mrs_total_supporters_count';
const STORAGE_USER_CLICKS_KEY = 'mrs_user_clicks_count';
const BASE_SUPPORTERS_COUNT = 0;

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

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedClicks = localStorage.getItem(STORAGE_USER_CLICKS_KEY);
      if (savedClicks !== null) {
        this.userClicks = Math.max(0, parseInt(savedClicks, 10) || 0);
      }

      const savedTotal = localStorage.getItem(STORAGE_TOTAL_SUPPORTERS_KEY);
      if (savedTotal !== null) {
        const parsedTotal = parseInt(savedTotal, 10) || 0;
        // Reset legacy inflated baseline values (>= 18450 with few/no real clicks)
        this.totalSupporters =
          parsedTotal >= 18450 && this.userClicks < 100
            ? this.userClicks
            : Math.max(this.userClicks, parsedTotal);
        if (this.totalSupporters !== parsedTotal) {
          this.saveState();
        }
      } else {
        this.totalSupporters = this.userClicks;
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
   * Initializes real free-click event tracking for Phase 1 online fund collection.
   */
  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    window.addEventListener('mrs_free_click', () => {
      this.addSupporters(1);
    });
  }

  public recordClick() {
    this.addSupporters(1);
  }

  public addSupporters(count: number = 1) {
    this.totalSupporters += count;
    this.userClicks += count;
    this.saveState();
    this.notify();
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
