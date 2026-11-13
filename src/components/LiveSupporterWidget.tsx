import React, { useState } from 'react';
import { useSupporterCount } from '../hooks/useSupporterCount';
import { useBackendSync } from '../context/BackendSyncContext';
import { openNextSponsorLink, getSponsorLinks } from '../services/adDonateService';
import { Heart, ChevronDown, ChevronUp, Users, ExternalLink, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveSupporterWidget: React.FC = () => {
  const { totalSupporters: localSupporters, userClicks, recentNotification, addManualSupporter } = useSupporterCount();
  const { content } = useBackendSync();
  const [isMinimized, setIsMinimized] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [hasClickedBoost, setHasClickedBoost] = useState(false);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);

  const totalSupporters = content.donationStats.totalSupporters || localSupporters;
  const brain = content.brainEngine;
  const dailyGoal = Math.max(1, brain?.dailyGoalClicks || 500);
  const todayClicks = brain?.todayClicks || 427;
  const progressPercent = Math.min(99, Math.max(8, Math.round((todayClicks / dailyGoal) * 100)));
  const latestActivity = brain?.activityStream && brain.activityStream.length > 0 ? brain.activityStream[0] : null;
  const sponsorCount = getSponsorLinks().length;

  const handleOneClickFreeSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = openNextSponsorLink('floating-widget');
    addManualSupporter(e);
    setHasClickedBoost(true);
    setRewardMsg(`Unlocked +1 Credit (Partner #${res.linkNumber}/${sponsorCount})! Click again for next link.`);
    setTimeout(() => setHasClickedBoost(false), 450);
    setTimeout(() => setRewardMsg(null), 4000);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.85 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <aside
      aria-label="Live Community Impact"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 max-w-[calc(100vw-1.5rem)] font-sans pb-[env(safe-area-inset-bottom)]"
      style={{ width: isMinimized ? 'auto' : 'min(320px, calc(100vw - 1.5rem))' }}
    >
      {/* Recent Supporter Notification Toast */}
      {recentNotification && (
        <div className="mb-2 bg-emerald-900/95 text-white text-xs px-3.5 py-1.5 rounded-xl shadow-xl border border-emerald-500/40 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-medium truncate">{recentNotification}</span>
        </div>
      )}

      {/* Main Impact Card */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden transition-all duration-300">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/85 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Community Impact
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            title={isMinimized ? 'Expand live impact' : 'Minimize live impact'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Body content */}
        {!isMinimized && (
          <div className="p-3.5 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Total Supporters
                </div>
                <div className="text-2xl font-extrabold text-amber-400 tabular-nums flex items-center gap-1.5 font-display">
                  <span>{totalSupporters.toLocaleString()}</span>
                  <Heart className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">Your Support</div>
                <div className="text-sm font-bold text-emerald-300 tabular-nums">
                  +{userClicks} credits
                </div>
              </div>
            </div>

            {/* Today's Batch Goal Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium">Today’s Aid Goal</span>
                <span className="text-amber-300 font-bold tabular-nums">
                  {todayClicks} / {dailyGoal} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Live Activity Ticker Line */}
            {latestActivity && (
              <div className="text-[11px] text-slate-300 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60 leading-snug">
                <span className="text-emerald-400 font-bold">{latestActivity.location}:</span>{' '}
                <span>{latestActivity.actionText}</span>
              </div>
            )}

            {/* Instant Feedback after click */}
            {rewardMsg && (
              <div className="text-[11px] text-emerald-200 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rewardMsg}</span>
              </div>
            )}

            {/* Quick 1-Click Ad Support Button */}
            <button
              onClick={handleOneClickFreeSupport}
              className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasClickedBoost
                  ? 'bg-amber-400 text-slate-950 scale-95'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30 hover:-translate-y-0.5'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />
              <span>1-Click Free Support (No Cost)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            </button>
          </div>
        )}

        {/* Minimized Pill View */}
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3.5 py-2 flex items-center gap-2.5 text-xs text-white hover:bg-slate-800 transition-colors cursor-pointer w-full"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-amber-400 tabular-nums">
              {totalSupporters.toLocaleString()} Supporters
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              +{userClicks}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};
