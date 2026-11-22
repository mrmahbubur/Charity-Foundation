import React from 'react';
import { MousePointerClick, ExternalLink, Landmark, HeartHandshake, Heart } from 'lucide-react';

interface HowItWorksSectionProps {
  onSupportNow: () => void;
  onOpenDonatePage: () => void;
}

const STEPS = [
  {
    number: '01',
    title: 'Click "Support Now"',
    description:
      'Choose any Support Now button across our portal. No account login, credit card, or personal payment is ever requested.',
    icon: MousePointerClick,
  },
  {
    number: '02',
    title: 'Visit Verified Sponsor Link',
    description:
      'A partner sponsor destination opens cleanly in a new browser tab. Rotating across verified partners keeps participation reliable.',
    icon: ExternalLink,
  },
  {
    number: '03',
    title: 'Sponsor Covers the Cost',
    description:
      'Commercial sponsors compensate valid page visits. That revenue replaces direct cash donations from your own pocket.',
    icon: Landmark,
  },
  {
    number: '04',
    title: 'Allocated to Program Reserves',
    description:
      'Net proceeds are reserved toward rural learning supplies, basic health checkups, clean water, and essential relief.',
    icon: HeartHandshake,
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onSupportNow,
  onOpenDonatePage,
}) => {
  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-[#FAFAF8] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-12">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
            How It Works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
            How Zero-Cost Ad-Sponsored Giving Works
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            A straightforward, transparent four-step cycle that converts everyday web visits into reserved humanitarian funding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-slate-400 tabular-nums">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
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
            className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white/90" />
            <span>Try One Free Support Click</span>
          </button>

          <button
            type="button"
            onClick={onOpenDonatePage}
            className="text-sm font-semibold text-[#0F3D3E] hover:underline underline-offset-4 cursor-pointer"
          >
            Read the full Giving Guide &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
