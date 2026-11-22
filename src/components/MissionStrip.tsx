import React from 'react';
import { Stethoscope, BookOpen, Package } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

const PILLAR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  healthcare: Stethoscope,
  education: BookOpen,
  'essential-necessities': Package,
};

export const MissionStrip: React.FC = () => {
  return (
    <section
      aria-label="Core Humanitarian Pillars"
      className="bg-[#FAFAF8] border-b border-slate-200 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITE_CONFIG.missionPillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id] || BookOpen;
            return (
              <article
                key={pillar.id}
                className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-[#0F3D3E]/30 transition-colors flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-xl font-bold text-slate-900">
                    {pillar.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[65ch]">
                    {pillar.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
