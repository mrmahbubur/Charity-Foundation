import { useState, useEffect } from 'react';
import { supporterTracker } from '../services/supporterTracker';

export function useSupporterCount() {
  const [data, setData] = useState(() => supporterTracker.getState());
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the tracker listener is running
    supporterTracker.init();

    const unsubscribe = supporterTracker.subscribe((update) => {
      setData({
        totalSupporters: update.totalSupporters,
        userClicks: update.userClicks,
      });

      if (update.recentLocation) {
        setRecentNotification(`New supporter joined from ${update.recentLocation}`);
        const timer = setTimeout(() => {
          setRecentNotification(null);
        }, 4000);
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  const addManualSupporter = (e?: React.MouseEvent) => {
    if (e) {
      supporterTracker.recordClick(e.clientX, e.clientY);
    } else {
      supporterTracker.addSupporters(1);
    }
  };

  return {
    totalSupporters: data.totalSupporters,
    userClicks: data.userClicks,
    recentNotification,
    addManualSupporter,
  };
}
