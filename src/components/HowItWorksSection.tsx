import React from 'react';
import { MousePointerClick, ExternalLink, Landmark, HeartHandshake, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

interface HowItWorksSectionProps {
  onSupportNow: () => void;
  onOpenDonatePage: () => void;
}

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  click: MousePointerClick,
  visit: ExternalLink,
  sponsor: Landmark,
  allocate: HeartHandshake,
};

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onSupportNow,
  onOpenDonatePage,
}) => {
  const { eyebrow, heading, subheading, steps } = SITE_CONFIG.howItWorks;

  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-canvas border-b border-border"
    >
      <div className="container-editorial">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="eyebrow-heading">{eyebrow}</p>
          <h2 className="section-title">{heading}</h2>
          <p className="text-base text-ink-muted leading-relaxed max-w-[65ch]">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = STEP_ICONS[step.id] || MousePointerClick;
            return (
              <div
                key={step.number}
                className="editorial-card p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-ink-subtle tabular-nums">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-heading">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onSupportNow}
            className="btn-accent text-sm px-6 py-3"
          >
            <Heart className="w-4 h-4 fill-white/90" />
            <span>Try One Free Support Click</span>
          </button>

          <button
            type="button"
            onClick={onOpenDonatePage}
            className="text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            Read the full Giving Guide &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
