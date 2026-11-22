import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

interface TransparencySectionProps {
  onOpenTransparencyPage: () => void;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  onOpenTransparencyPage,
}) => {
  const { allocations, allocationNote, accountabilityStatement } = SITE_CONFIG.transparency;

  return (
    <section id="transparency" className="py-16 lg:py-24 bg-surface border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">
                Financial Transparency
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                How Collected Sponsor Proceeds Are Allocated
              </h2>
              <p className="text-base text-ink-muted leading-relaxed max-w-[65ch]">
                {allocationNote}
              </p>
            </div>

            <div className="space-y-2">
              <div
                className="w-full h-4 rounded-lg overflow-hidden flex border border-slate-200"
                aria-label="Planned fund allocation breakdown bar"
              >
                {allocations.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.label}: ${item.percentage}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
                {allocations.map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="tabular-nums font-semibold">{item.percentage}%</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {allocations.map((item) => (
                <div
                  key={item.id}
                  className="bg-canvas border border-slate-200 rounded-xl p-5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900">
                        {item.label}
                      </h3>
                    </div>
                    <span className="font-serif text-xl font-bold text-primary tabular-nums shrink-0">
                      {item.percentage}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-primary text-white rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Accountability Commitment
                </h3>
                <p className="text-xs text-slate-300">Zero donor financial risk</p>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {accountabilityStatement}
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 border-t border-white/15 pt-5">
              <li>• No personal bank cards, wallets, or money requested</li>
              <li>• Online-only pre-launch operations with no physical office overhead</li>
              <li>• Honest status disclosures with zero fabricated badges or awards</li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTransparencyPage}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Open Full Transparency Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
