import React, { useState } from 'react';
import { openNextSponsorLink, getNextDonateLink, getTotalFreeClicks, getSponsorLinks } from '../services/adDonateService';
import { FOUNDATION_INFO } from '../data/charityData';
import { useSiteLogo } from '../services/logoService';
import { X, Heart, HeartHandshake, ExternalLink, CheckCircle2, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCause?: string;
  defaultAmount?: number;
  defaultCurrency?: string;
  defaultFrequency?: 'one-time' | 'monthly';
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  defaultCause = 'General Humanitarian & Child Education Fund',
}) => {
  const { logo } = useSiteLogo();
  const [totalClicks, setTotalClicks] = useState<number>(getTotalFreeClicks());
  const [lastOpenedLink, setLastOpenedLink] = useState<{ url: string; linkNumber: number } | null>(null);

  if (!isOpen) return null;

  const sponsorLinks = getSponsorLinks();
  const nextLinkInfo = getNextDonateLink();

  const handleFreeDonateClick = () => {
    const result = openNextSponsorLink('donation-modal');
    setTotalClicks(result.totalClicks);
    setLastOpenedLink({ url: result.url, linkNumber: result.linkNumber });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close donation modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="flex justify-center mb-2">
              <div className="h-14 w-14 flex items-center justify-center">
                <img
                  src={logo}
                  alt="MRS Charity Foundation Logo"
                  className="max-h-full max-w-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>100% Free Click-to-Donate</span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
              No Money Needed to Donate!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              You do not need to spend any money from your pocket. Simply click the button below — each click opens a verified sponsor partner in a new tab.
              <strong> Our sponsor network pays on your behalf</strong> to provide free education, meals, and relief to underprivileged children in Bangladesh.
            </p>
          </div>

          {/* Primary Action Button (The core click-to-donate with link rotation) */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 p-6 rounded-2xl border-2 border-emerald-500/40 text-center space-y-4 shadow-sm">
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Zero-Cost Humanitarian Action</span>
              </div>
              <div className="text-xs text-slate-500">
                Next sponsor destination: <span className="font-mono text-slate-700 font-semibold">Link {nextLinkInfo.index + 1} of {sponsorLinks.length}</span> (rotates every click)
              </div>
            </div>

            <button
              onClick={handleFreeDonateClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl text-base sm:text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-700/25 cursor-pointer flex items-center justify-center gap-3 group"
            >
              <Heart className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Click to Donate (Free · No Money Needed)</span>
              <ExternalLink className="w-5 h-5 text-emerald-200" />
            </button>

            {/* Post-click acknowledgement */}
            {lastOpenedLink && (
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1 animate-fade-in">
                <div className="font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sponsor Link #{lastOpenedLink.linkNumber} Opened in New Tab!</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Thank you! Your click generated free humanitarian revenue for MRS Charity Foundation. Click the button again to open the next sponsor link!
                </p>
              </div>
            )}

            {/* Click Count Tally */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Your Free Clicks:</span>
                <span className="font-display font-extrabold text-emerald-700 text-base tabular-nums">
                  {totalClicks}
                </span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1 text-emerald-700">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rotates {sponsorLinks.length} unique ad links automatically</span>
              </div>
            </div>
          </div>

          {/* How It Works Explainer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="font-bold text-slate-900">1. Click Donate</div>
              <p className="text-slate-500 text-[11px] leading-tight">
                No credit cards, bKash, or cash needed from you.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="font-bold text-slate-900">2. New Tab Opens</div>
              <p className="text-slate-500 text-[11px] leading-tight">
                A verified sponsor page opens in a new browser tab.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="font-bold text-slate-900">3. Sponsors Pay</div>
              <p className="text-slate-500 text-[11px] leading-tight">
                Ad networks convert your visit into real charity funding.
              </p>
            </div>
          </div>

          {/* Zero-Cost Assurance */}
          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            <p>
              M R S Charity Foundation · Motto: <strong>"Poverty Ends With Us"</strong>
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Humanity United Against Poverty · 100% Free Ad-Sponsored Giving
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
