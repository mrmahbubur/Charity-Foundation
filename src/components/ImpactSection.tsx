import React from 'react';
import { SITE_CONFIG } from '../../site.config';
import { useBackendSync } from '../context/BackendSyncContext';
import { useSupporterCount } from '../hooks/useSupporterCount';

export const ImpactSection: React.FC = () => {
  const { content } = useBackendSync();
  const { userClicks } = useSupporterCount();

  const dailyGoal = Math.max(
    1,
    content.brainEngine?.dailyGoalClicks || SITE_CONFIG.impactSection.dailyClickGoalTarget || 500
  );
  const todayClicks = content.brainEngine?.todayClicks || 0;
  const clampedPercent = Math.min(100, Math.max(2, Math.round((todayClicks / dailyGoal) * 100)));

  return (
    <section id="impact" className="py-16 lg:py-24 bg-canvas border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
            Progress &amp; Mobilization Status
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Transparent Milestones as We Collect Initial Funds Online
          </h2>
          <p className="text-base text-ink-muted leading-relaxed max-w-[65ch]">
            Every statistic we present reflects our genuine current stage as a pre-launch future project of M R S—with no inflated claims or fabricated field totals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.impactSection.metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-surface rounded-xl border border-slate-200 p-6 shadow-sm space-y-2"
            >
              <div className="font-serif text-2xl sm:text-3xl font-bold text-primary tabular-nums">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-slate-900">{metric.label}</div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {metric.unitOrContext}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Daily Free Sponsor Click Goal
              </h3>
              <p className="text-sm text-ink-muted mt-1">
                Tracks cumulative free sponsor visits building reserves during the current online fund-collection drive.
              </p>
            </div>
            <div className="text-sm font-semibold text-primary tabular-nums shrink-0">
              {todayClicks.toLocaleString()} / {dailyGoal.toLocaleString()} clicks ({clampedPercent}%)
            </div>
          </div>

          <div
            className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
            role="progressbar"
            aria-valuenow={clampedPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Daily sponsor click goal completion"
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${clampedPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>{SITE_CONFIG.impactSection.disclaimer}</span>
            {userClicks > 0 && (
              <span className="font-semibold text-primary tabular-nums shrink-0">
                Your session contributions: {userClicks}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
