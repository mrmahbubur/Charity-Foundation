import React, { useState } from 'react';
import { ArrowLeft, Heart, ExternalLink, CheckCircle2, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import {
  openNextSponsorLink,
  getNextDonateLink,
  getSponsorLinks,
  getTotalFreeClicks,
} from '../services/adDonateService';

interface DonatePageProps {
  onBackHome: () => void;
  onOpenTransparencyPage: () => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({
  onBackHome,
  onOpenTransparencyPage,
}) => {
  const [totalClicks, setTotalClicks] = useState<number>(getTotalFreeClicks());
  const [lastLinkNum, setLastLinkNum] = useState<number | null>(null);

  const sponsorLinks = getSponsorLinks();
  const nextInfo = getNextDonateLink();

  const handleDonateClick = () => {
    const res = openNextSponsorLink('donate-page');
    setTotalClicks(res.totalClicks);
    setLastLinkNum(res.linkNumber);
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D3E] hover:underline underline-offset-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
            Zero-Cost Humanitarian Giving
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            How Free Ad-Sponsored Giving Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[65ch]">
            {SITE_CONFIG.organization.name} makes charitable participation accessible to everyone—even without a credit card or spare budget.
          </p>
        </header>

        {/* Primary Interactive Support Card */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Contribute With One Free Click
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Next destination: Sponsor Partner #{nextInfo.index + 1} of {sponsorLinks.length}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">Your Session Clicks</div>
              <div className="font-serif text-2xl font-bold text-[#0F3D3E] tabular-nums">
                {totalClicks}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDonateClick}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-base px-6 py-4 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white/90 shrink-0" />
            <span>Support Now — Open Verified Sponsor Link (Free)</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>

          {lastLinkNum !== null && (
            <div className="bg-[#0F3D3E]/5 border border-[#0F3D3E]/20 rounded-lg p-4 flex items-start gap-3 text-sm text-[#0F3D3E]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">
                  Sponsor link #{lastLinkNum} opened in a new browser tab.
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you for contributing at zero personal cost. You may click again anytime to visit the next rotating sponsor partner.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="w-3.5 h-3.5 text-[#0F3D3E] shrink-0" />
            <span>
              Links automatically rotate across {sponsorLinks.length} sponsor partner URLs without asking for passwords, bank cards, or personal funds.
            </span>
          </div>
        </section>

        {/* Honest Walkthrough */}
        <section className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-[70ch]">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            What Happens Behind the Scenes?
          </h2>
          <p>
            1. <strong>You click Support Now:</strong> A curated third-party sponsor destination opens in a separate tab. Your browser keeps your spot on this site.
          </p>
          <p>
            2. <strong>Sponsor networks pay publisher rates:</strong> Advertising and commercial partners compensate qualified web visits under their standard publisher agreements.
          </p>
          <p>
            3. <strong>Reserves grow for our future launch:</strong> Because we are currently in our online fund-collection phase with no physical office overhead, net sponsor proceeds are earmarked directly for upcoming educational kits, clean water maintenance, preventive health outreach, and staple relief packs.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenTransparencyPage}
              className="text-sm font-semibold text-[#0F3D3E] hover:underline underline-offset-4 cursor-pointer"
            >
              Inspect Fund Allocation &amp; Transparency Details &rarr;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
