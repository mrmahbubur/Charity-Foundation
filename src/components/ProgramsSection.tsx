import React from 'react';
import { CAMPAIGNS, FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { Heart, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgramsSectionProps {
  onOpenDonate?: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onOpenDonate }) => {
  const handleSupportCause = (e: React.MouseEvent) => {
    e.preventDefault();
    openNextSponsorLink();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
    if (onOpenDonate) onOpenDonate();
  };

  return (
    <section id="programs" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald-700">
            {FOUNDATION_INFO.motto}
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Key Programs &amp; Initiatives
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {FOUNDATION_INFO.mission} Every program below is powered by your free clicks — zero money needed from your wallet.
          </p>
        </div>

        {/* 4 Featured Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {CAMPAIGNS.map((camp) => {
            const percent = Math.min(100, Math.round((camp.raisedAmountBDT / camp.targetAmountBDT) * 100));

            return (
              <div
                key={camp.id}
                className="bg-[#FCFCFA] rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-md bg-white/90 backdrop-blur-sm text-slate-900 shadow">
                      {camp.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-amber-300 font-semibold mb-1">
                      {camp.impactMetrics}
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight text-white">
                      {camp.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {camp.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">
                          Sponsor Clicks: <strong className="text-emerald-700 tabular-nums">{camp.donorsCount * 12} generated</strong>
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          Ad Funding Goal ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <span>100% Free to supporters</span>
                        <span>Direct Community Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <button
                      onClick={handleSupportCause}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm group"
                    >
                      <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                      <span>Click to Free Donate (Opens Sponsor in New Tab)</span>
                      <ExternalLink className="w-4 h-4 text-emerald-200" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
