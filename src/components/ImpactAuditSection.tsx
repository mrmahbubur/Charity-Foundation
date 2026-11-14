import React from 'react';
import { FINANCIAL_AUDIT, FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink, DONATE_SPONSOR_LINKS } from '../services/adDonateService';
import { ShieldCheck, Heart, ExternalLink, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImpactAuditSection: React.FC = () => {
  const handleDonateClick = () => {
    openNextSponsorLink('impact-audit');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section id="impact" className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="text-xs uppercase tracking-widest font-bold text-emerald-800">
            Zero-Cost Financial Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            How Your Free Ad Clicks Are Converted into Real Impact
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Public trust and transparency are paramount. Every visit to our sponsor links generates advertising revenue from our global partner networks that is converted directly into free food, schooling, and healthcare.
          </p>
        </div>

        {/* Audit Breakdown Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Allocation Breakdown Cards */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-4">
              Sponsor Revenue Allocation
            </h3>

            {FINANCIAL_AUDIT.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">
                      {item.category}
                    </span>
                  </div>
                  <div className="font-display font-extrabold text-lg sm:text-xl tabular-nums text-slate-900">
                    {item.percentage}%
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                  <span>{item.detail}</span>
                  <span className="font-semibold text-emerald-700 shrink-0">
                    {item.amountUSD}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ad Sponsor Verification Box - No Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-900 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Zero-Cost Guarantee</h4>
                  <div className="text-xs text-emerald-300">Poverty Ends With Us</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                You never need to give financial details or donate money. When you click our donate buttons, our sponsor network handles 100% of the funds and transfers them directly to purchase meals, textbooks, and relief supplies.
              </p>

              <div className="space-y-2.5 text-xs text-emerald-200/90 pt-2 border-t border-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free: No money, credit card, or payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rotates through {DONATE_SPONSOR_LINKS.length} verified sponsor partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited clicks allowed — support daily from anywhere</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-emerald-900/80">
                <button
                  onClick={handleDonateClick}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>Click to Free Donate Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
