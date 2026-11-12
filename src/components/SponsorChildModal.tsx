import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { X, Heart, Award, GraduationCap, MapPin, ExternalLink, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsorChildModalProps {
  child: ChildProfile | null;
  onClose: () => void;
}

export const SponsorChildModal: React.FC<SponsorChildModalProps> = ({ child, onClose }) => {
  const [completed, setCompleted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  if (!child) return null;

  const handleFreeSponsorClick = () => {
    const res = openNextSponsorLink();
    setClickCount((prev) => prev + 1);
    setCompleted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleResetAndClose = () => {
    setCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close child sponsor modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!completed ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-extrabold text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-amber-600" />
                <span>100% Free Sponsorship</span>
              </span>
              <h3 className="font-display font-extrabold text-2xl text-slate-900">
                Sponsor {child.name}
              </h3>
              <p className="text-xs text-slate-500">
                No money or personal contact details required. Each click triggers a sponsor-funded donation.
              </p>
            </div>

            {/* Child Profile Snapshot */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200">
              <img
                src={child.image}
                alt={child.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-300"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                  {child.name}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span>Class: <strong>{child.grade}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{child.district}</span>
                  </span>
                </div>
                <div className="text-xs text-emerald-700 font-semibold">
                  Aspirations: {child.dream}
                </div>
              </div>
            </div>

            {/* What it accomplishes */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span>What Happens When You Click:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px]">
                <li>A verified sponsor link opens in a new tab.</li>
                <li>Our ad partner network converts the visit into education funding.</li>
                <li>Provides textbooks, stationery, and midday meals for {child.name}.</li>
              </ul>
            </div>

            <button
              onClick={handleFreeSponsorClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl text-base transition-all shadow-lg shadow-emerald-700/25 cursor-pointer flex items-center justify-center gap-2 group transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Click to Sponsor for Free (Opens in New Tab)</span>
              <ExternalLink className="w-4 h-4 text-emerald-200" />
            </button>
          </div>
        ) : (
          /* Sponsorship Welcome Confirmation */
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900">
                Free Sponsorship Registered!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                Thank you! Your sponsor click opened in a new tab and funded educational support for {child.name}.
              </p>
            </div>

            {/* Official Sponsor Certificate */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border-2 border-emerald-500 text-left space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
                  M R S Charity Foundation · Free Sponsor Pass
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  REF-{Math.floor(10000 + Math.random() * 90000)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-900">{child.name}</div>
                  <div className="text-slate-600">{child.schoolName}</div>
                  <div className="text-emerald-700 font-semibold">Dream: {child.dream}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-xs text-slate-600">
                Motto: <strong>"Poverty Ends With Us"</strong> · Humanity United Against Poverty
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleFreeSponsorClick}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-slate-950" />
                <span>Click Again (Open Next Sponsor)</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
