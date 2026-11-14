import React, { useState } from 'react';
import { IMPACT_STORIES, FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { Quote, ArrowLeft, ArrowRight, MapPin, Award, Heart, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoriesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentStory = IMPACT_STORIES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % IMPACT_STORIES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + IMPACT_STORIES.length) % IMPACT_STORIES.length);
  };

  const handleFreeDonateClick = () => {
    openNextSponsorLink('stories');
    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section id="stories" className="py-16 lg:py-24 bg-[#FCFCFA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-700">
            {FOUNDATION_INFO.motto}
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Real Lives Transformed
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {FOUNDATION_INFO.mission} Every statistic represents an individual scholar, artisan, or family breaking free from poverty through collective action.
          </p>
        </div>

        {/* Feature Story Card with Asymmetric Layout */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Visual Left */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full lg:min-h-[400px] bg-slate-900">
            <img
              src={currentStory.image}
              alt={currentStory.personName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                {currentStory.program}
              </span>
              <h4 className="font-display font-bold text-2xl text-white">
                {currentStory.personName}
              </h4>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentStory.location}</span>
              </div>
            </div>
          </div>

          {/* Editorial Content Right */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                  Transformation Impact
                </span>
                <span className="tabular-nums">
                  Story {activeIndex + 1} of {IMPACT_STORIES.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-snug">
                "{currentStory.title}"
              </h3>

              <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed pl-4 border-l-2 border-emerald-500">
                "{currentStory.fullQuote}"
              </p>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Verified Outcome:
                </div>
                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{currentStory.achievement}</span>
                </div>
              </div>
            </div>

            {/* CTA and Pagination Controls */}
            <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleFreeDonateClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Click to Free Donate</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {IMPACT_STORIES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeIndex === idx ? 'w-6 bg-emerald-700' : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                      aria-label={`Go to story ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Previous story"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Next story"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
