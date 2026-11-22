import React, { useState, useEffect } from 'react';
import { X, Heart, ExternalLink, CheckCircle2, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import {
  openNextSponsorLink,
  getNextDonateLink,
  getTotalFreeClicks,
  getSponsorLinks,
} from '../services/adDonateService';
import { useSiteLogo } from '../services/logoService';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCause?: string;
  onOpenDonatePage?: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  defaultCause = 'Healthcare, Education & Essential Relief',
  onOpenDonatePage,
}) => {
  const { logo } = useSiteLogo();
  const [totalClicks, setTotalClicks] = useState<number>(getTotalFreeClicks());
  const [lastOpenedNum, setLastOpenedNum] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTotalClicks(getTotalFreeClicks());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sponsorLinks = getSponsorLinks();
  const nextLinkInfo = getNextDonateLink();
  const activeLogo = logo === '/logo.png' ? './logo.png' : logo || SITE_CONFIG.organization.logoPath;

  const handleFreeDonateClick = () => {
    const result = openNextSponsorLink('support-modal');
    setTotalClicks(result.totalClicks);
    setLastOpenedNum(result.linkNumber);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-modal-title"
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close support dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2 text-center pt-1">
            <img
              src={activeLogo}
              alt={`${SITE_CONFIG.organization.name} Logo`}
              className="h-12 w-12 object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0F3D3E]">
              100% Free Ad-Sponsored Giving
            </p>
            <h2
              id="donate-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-slate-900"
            >
              Support at Zero Cost to You
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Focus: <strong className="text-slate-800">{defaultCause}</strong>. Clicking below opens a verified commercial sponsor partner in a new tab—our partners fund the contribution while you spend nothing.
            </p>
          </div>

          <div className="bg-[#FAFAF8] border border-slate-200 rounded-xl p-5 space-y-4 text-center">
            <div className="text-xs text-slate-500">
              Next Partner: <strong className="text-slate-800">Link {nextLinkInfo.index + 1} of {sponsorLinks.length}</strong>
            </div>

            <button
              type="button"
              onClick={handleFreeDonateClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold py-3.5 px-5 rounded-lg text-sm sm:text-base shadow-sm transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white/90 shrink-0" />
              <span>Support Now — Open Sponsor Link (Free)</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </button>

            {lastOpenedNum !== null && (
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-[#0F3D3E] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Sponsor link #{lastOpenedNum} opened in a new tab. Thank you!</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 pt-1">
              <span>
                Your clicks: <strong className="tabular-nums text-[#0F3D3E]">{totalClicks}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#0F3D3E]" />
                <span>Rotates across {sponsorLinks.length} verified partners</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
            <span>Zero credit cards or personal cash needed.</span>
            {onOpenDonatePage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDonatePage();
                }}
                className="font-semibold text-[#0F3D3E] hover:underline cursor-pointer"
              >
                Full Giving Guide &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
