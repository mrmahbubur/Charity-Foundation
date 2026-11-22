import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { useBackendSync } from '../context/BackendSyncContext';

interface HeroProps {
  onSupportNow: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSupportNow, onLearnMore }) => {
  const { content } = useBackendSync();
  const mission = SITE_CONFIG.organization.heroMission;
  const projectLabel =
    content.foundationInfo.parentOrg || SITE_CONFIG.organization.projectOf;

  return (
    <section
      id="home"
      className="relative w-full min-h-[540px] lg:min-h-[620px] flex items-center bg-[#0F3D3E] text-white overflow-hidden"
    >
      {/* Full-width Documentary Background Photography */}
      <img
        src={SITE_CONFIG.images.hero}
        alt="Students reading storybooks together in a rural community learning room"
        className="absolute inset-0 w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
      />

      {/* Calm Dark Contrast Overlay for Editorial Readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#092425]/92 via-[#0A292A]/78 to-[#0A292A]/50"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Calm Editorial Eyebrow */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold text-amber-300">
            {SITE_CONFIG.organization.name} · {projectLabel}
          </p>

          {/* Strong Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight text-balance">
            {SITE_CONFIG.organization.heroHeadline}
          </h1>

          {/* One-sentence Honest Mission */}
          <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-[65ch]">
            {mission}
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={onSupportNow}
              className="inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold px-7 py-3.5 rounded-lg text-sm sm:text-base shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-white/90 shrink-0" />
              <span>Support Now</span>
            </button>

            <button
              type="button"
              onClick={onLearnMore}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold px-7 py-3.5 rounded-lg text-sm sm:text-base transition-colors cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <p className="text-xs text-slate-300 pt-2">
            100% free participation — powered by verified sponsor visits, never donor cash or cards.
          </p>
        </div>
      </div>
    </section>
  );
};
