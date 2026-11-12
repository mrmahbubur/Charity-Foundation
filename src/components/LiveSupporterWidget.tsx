import React, { useState } from 'react';
import { useSupporterCount } from '../hooks/useSupporterCount';
import { useBackendSync } from '../context/BackendSyncContext';
import { Heart, Sparkles, ChevronDown, ChevronUp, Users, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveSupporterWidget: React.FC = () => {
  const { totalSupporters: localSupporters, userClicks, recentNotification, addManualSupporter } = useSupporterCount();
  const { content, triggerTick } = useBackendSync();
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasClickedBoost, setHasClickedBoost] = useState(false);

  const totalSupporters = content.donationStats.totalSupporters || localSupporters;

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addManualSupporter(e);
    triggerTick();
    setHasClickedBoost(true);
    setTimeout(() => setHasClickedBoost(false), 500);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.85 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <aside
      aria-label="Live Supporter Counter"
      className="fixed bottom-4 right-4 z-40 max-w-sm font-sans"
    >
      {/* Recent Supporter Notification Toast */}
      {recentNotification && (
        <div className="mb-2 bg-emerald-900/95 text-white text-xs px-3.5 py-1.5 rounded-xl shadow-xl border border-emerald-500/40 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium">{recentNotification}</span>
        </div>
      )}

      {/* Main Counter Card */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden transition-all duration-300">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Supporter System
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            title={isMinimized ? 'Expand counter' : 'Minimize counter'}
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
                <div className="text-[10px] text-slate-400">Your Clicks</div>
                <div className="text-sm font-bold text-emerald-300 tabular-nums">
                  +{userClicks} added
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              ⚡ <strong>Automatic Click Tracker:</strong> Every click anywhere on this site automatically counts and adds you as a supporter!
            </p>

            {/* Quick 1-Click Boost Button */}
            <button
              onClick={handleBoostClick}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasClickedBoost
                  ? 'bg-amber-400 text-slate-950 scale-95'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30 hover:-translate-y-0.5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Click to Add Supporter (+1)</span>
              <Flame className="w-3.5 h-3.5 text-amber-300" />
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
