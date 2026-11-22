import React, { useState } from 'react';
import { ArrowLeft, Heart, ExternalLink, CheckCircle2, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from '../components/EditorialContainer';
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
    <div className="bg-canvas min-h-screen py-12 lg:py-20">
      <EditorialContainer size="prose" className="space-y-10">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <header className="space-y-4">
          <p className="eyebrow-heading">Zero-Cost Humanitarian Giving</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heading leading-tight">
            How Free Ad-Sponsored Giving Works
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-[65ch]">
            {SITE_CONFIG.organization.name} makes charitable participation accessible to everyone—even without a credit card or spare budget.
          </p>
        </header>

        <section className="editorial-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-heading">
                Contribute With One Free Click
              </h2>
              <p className="text-sm text-ink-muted mt-1">
                Next destination: Sponsor Partner #{nextInfo.index + 1} of {sponsorLinks.length}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-ink-subtle">Your Session Clicks</div>
              <div className="font-serif text-2xl font-bold text-primary tabular-nums">
                {totalClicks}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDonateClick}
            className="btn-accent w-full text-base px-6 py-4"
          >
            <Heart className="w-5 h-5 fill-surface/90 shrink-0" />
            <span>Support Now — Open Verified Sponsor Link (Free)</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>

          {lastLinkNum !== null && (
            <div className="bg-primary/5 border border-primary/20 rounded-control p-4 flex items-start gap-3 text-sm text-primary">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">
                  Sponsor link #{lastLinkNum} opened in a new browser tab.
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Thank you for contributing at zero personal cost. You may click again anytime to visit the next rotating sponsor partner.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-ink-subtle">
            <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              Links automatically rotate across {sponsorLinks.length} sponsor partner URLs without asking for passwords, bank cards, or personal funds.
            </span>
          </div>
        </section>

        <section className="space-y-5 text-sm sm:text-base text-ink-muted leading-relaxed max-w-[70ch]">
          <h2 className="font-serif text-2xl font-bold text-heading">
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
              className="text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
            >
              Inspect Fund Allocation &amp; Transparency Details &rarr;
            </button>
          </div>
        </section>
      </EditorialContainer>
    </div>
  );
};
