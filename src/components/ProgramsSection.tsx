import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { openNextSponsorLink } from '../services/adDonateService';

interface ProgramsSectionProps {
  onOpenDonate: (cause?: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onOpenDonate }) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const pillars = ['All', 'Healthcare', 'Education', 'Essential Necessities'];

  const filteredPrograms =
    selectedPillar === 'All'
      ? SITE_CONFIG.programs
      : SITE_CONFIG.programs.filter((p) => p.pillar === selectedPillar);

  const handleSupportProgram = (title: string) => {
    openNextSponsorLink(`program-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    onOpenDonate(title);
  };

  return (
    <section id="our-work" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Clean Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
              Our Work &amp; Program Focus
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
              Core Initiatives Prepared for Community Impact
            </h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
              Each program track below outlines how sponsor-generated reserves are directed across education, primary healthcare, clean water, and essential household relief.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter programs by humanitarian pillar"
            className="flex flex-wrap items-center gap-1 p-1 bg-[#FAFAF8] border border-slate-200 rounded-lg shrink-0 self-start md:self-auto"
          >
            {pillars.map((pillar) => (
              <button
                key={pillar}
                type="button"
                onClick={() => setSelectedPillar(pillar)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedPillar === pillar
                    ? 'bg-[#0F3D3E] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((prog) => (
            <article
              key={prog.id}
              className="bg-[#FAFAF8] rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#0F3D3E]/40 transition-colors flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span className="text-[#0F3D3E] font-semibold">{prog.pillar}</span>
                    <span aria-hidden="true">·</span>
                    <span>{prog.scopeNote}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prog.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSupportProgram(prog.title)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#D97706] hover:text-[#B45309] transition-colors cursor-pointer group"
                  >
                    <span>Support This Focus Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
