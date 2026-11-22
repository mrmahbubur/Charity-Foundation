import React from 'react';
import { Stethoscope, BookOpen, Package } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from './EditorialContainer';

const PILLAR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  healthcare: Stethoscope,
  education: BookOpen,
  'essential-necessities': Package,
};

export const MissionStrip: React.FC = () => {
  return (
    <section
      aria-label="Core Humanitarian Pillars"
      className="bg-canvas border-b border-border py-14 lg:py-16"
    >
      <EditorialContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITE_CONFIG.missionPillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id] || BookOpen;
            return (
              <article
                key={pillar.id}
                className="editorial-card p-6 sm:p-8 hover:border-primary/30 transition-colors flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-xl font-bold text-heading">
                    {pillar.title}
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-[65ch]">
                    {pillar.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </EditorialContainer>
    </section>
  );
};
