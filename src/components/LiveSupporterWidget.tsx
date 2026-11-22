import React, { useState } from 'react';
import { Heart, ChevronUp, ChevronDown, ExternalLink, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { useSupporterCount } from '../hooks/useSupporterCount';
import { useBackendSync } from '../context/BackendSyncContext';
import { openNextSponsorLink, getSponsorLinks } from '../services/adDonateService';

export const LiveSupporterWidget: React.FC = () => {
  const { userClicks } = useSupporterCount();
  const { content } = useBackendSync();
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const dailyGoal = Math.max(
    1,
    content.brainEngine?.dailyGoalClicks || SITE_CONFIG.impactSection.dailyClickGoalTarget
  );
  const todayClicks = content.brainEngine?.todayClicks || 0;
  const progressPercent = Math.min(100, Math.max(2, Math.round((todayClicks / dailyGoal) * 100)));
  const sponsorCount = getSponsorLinks().length;

  const handleQuickSupport = () => {
    const res = openNextSponsorLink('floating-widget');
    setStatusMsg(`Opened sponsor #${res.linkNumber}/${sponsorCount}. Thank you!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <aside
      aria-label="Quick Free Support Widget"
      className="fixed bottom-4 right-4 z-30 pb-[env(safe-area-inset-bottom)]"
    >
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-expanded={false}
          aria-label="Open quick free support widget"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-surface text-xs font-semibold px-4 py-2.5 rounded-control shadow-md border border-surface/15 transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-accent-highlight fill-accent-highlight" />
          <span>Quick Free Support</span>
          {userClicks > 0 && (
            <span className="tabular-nums text-accent-highlight">({userClicks})</span>
          )}
          <ChevronUp className="w-3.5 h-3.5 text-on-primary-muted" />
        </button>
      ) : (
        <div className="w-72 bg-surface rounded-card border border-border shadow-modal overflow-hidden animate-modalIn">
          <div className="bg-primary text-surface px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold">Phase 1 Online Fund-Collection</span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-expanded={true}
              aria-label="Minimize quick free support widget"
              className="p-1 rounded hover:bg-surface/10 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted">Phase 1 fund-collection clicks</span>
              <span className="font-semibold text-primary tabular-nums">
                {todayClicks.toLocaleString()} / {dailyGoal.toLocaleString()}
              </span>
            </div>

            <div className="w-full h-2 bg-surface-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {statusMsg && (
              <div className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-md px-2.5 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleQuickSupport}
              className="btn-accent w-full text-xs py-2.5 px-3"
            >
              <Heart className="w-3.5 h-3.5 fill-surface/90" />
              <span>Support Now (Free)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
