import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from './EditorialContainer';

interface TransparencySectionProps {
  onOpenTransparencyPage: () => void;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  onOpenTransparencyPage,
}) => {
  const { allocations, allocationNote, accountabilityStatement } = SITE_CONFIG.transparency;

  return (
    <section id="transparency" className="section-editorial bg-surface border-b border-border">
      <EditorialContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <p className="eyebrow-heading">Financial Transparency</p>
              <h2 className="section-title">
                How Collected Sponsor Proceeds Are Allocated
              </h2>
              <p className="text-base text-ink-muted leading-relaxed max-w-[65ch]">
                {allocationNote}
              </p>
            </div>

            <div className="space-y-2">
              <div
                className="w-full h-4 rounded-control overflow-hidden flex border border-border"
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
                  className="bg-canvas border border-border rounded-card p-5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <h3 className="font-semibold text-sm sm:text-base text-heading">
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

          <div className="lg:col-span-5 bg-primary text-surface rounded-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-control bg-surface/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-accent-highlight" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-surface">
                  Accountability Commitment
                </h3>
                <p className="text-xs text-on-primary-muted">Zero donor financial risk</p>
              </div>
            </div>

            <p className="text-sm text-on-primary-soft leading-relaxed">
              {accountabilityStatement}
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-on-primary-soft border-t border-on-primary/15 pt-5">
              <li>• No personal bank cards, wallets, or money requested</li>
              <li>• Online-only pre-launch operations with no physical office overhead</li>
              <li>• Honest status disclosures with zero fabricated badges or awards</li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTransparencyPage}
                className="btn-accent w-full text-sm px-5 py-3"
              >
                <span>Open Full Transparency Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </EditorialContainer>
    </section>
  );
};
