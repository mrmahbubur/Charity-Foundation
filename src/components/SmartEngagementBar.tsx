import React, { useState, useEffect } from 'react';
import { useBackendSync } from '../context/BackendSyncContext';
import { openNextSponsorLink } from '../services/adDonateService';
import { Heart, ExternalLink, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartEngagementBar: React.FC = () => {
  const { content } = useBackendSync();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [clickNotice, setClickNotice] = useState<string | null>(null);

  const brain = content.brainEngine;
  const nudge = brain?.floatingNudge;
  const delaySec = Math.max(1, nudge?.delaySeconds ?? 6);

  useEffect(() => {
    if (!brain?.enabled || !nudge?.enabled || dismissed) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, delaySec * 1000);

    return () => clearTimeout(timer);
  }, [brain?.enabled, nudge?.enabled, delaySec, dismissed]);

  if (!visible || !brain?.enabled || !nudge?.enabled || dismissed) {
    return null;
  }

  const dailyGoal = Math.max(1, brain.dailyGoalClicks || 500);
  const todayClicks = brain.todayClicks || 427;
  const remaining = Math.max(1, dailyGoal - todayClicks);
  const pct = Math.min(99, Math.max(8, Math.round((todayClicks / dailyGoal) * 100)));

  const handleNudgeClick = () => {
    const res = openNextSponsorLink('smart-nudge');
    setClickNotice(`Partner link #${res.linkNumber} opened! Only ${Math.max(1, remaining - 1)} left in batch.`);
    setTimeout(() => setClickNotice(null), 3500);
    try {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { x: 0.15, y: 0.85 }
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div
      role="region"
      aria-label="Community Daily Goal Nudge"
      className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm font-sans animate-fade-in hidden sm:block"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-emerald-500/40 p-4 space-y-3 text-slate-900 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Dismiss goal reminder"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{nudge.badge || 'Daily Milestone · Almost Complete'}</span>
          </div>

          <h4 className="font-display font-extrabold text-sm text-slate-900 leading-snug pt-0.5">
            {nudge.headline || 'Help Finish Today’s Rural School & Meal Batch'}
          </h4>
        </div>

        {/* Mini Goal Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-emerald-700">{remaining} clicks left in today’s batch</span>
            <span className="text-slate-600 tabular-nums">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {nudge.message}
        </p>

        {clickNotice && (
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{clickNotice}</span>
          </div>
        )}

        <button
          onClick={handleNudgeClick}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
        >
          <Heart className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
          <span>{nudge.ctaLabel || '1-Click Free Support'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
        </button>
      </div>
    </div>
  );
};
