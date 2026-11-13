import React from 'react';
import { openNextSponsorLink } from '../services/adDonateService';
import { useBackendSync } from '../context/BackendSyncContext';
import { Heart, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FooterProps {
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonate }) => {
  const { content } = useBackendSync();
  const info = content.foundationInfo;
  const activeLogo = info.logo === '/logo.png' ? './logo.png' : (info.logo || './logo.png');

  const handleFooterDonate = (e: React.MouseEvent) => {
    e.preventDefault();
    openNextSponsorLink('footer');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // safe fallback
    }
    onOpenDonate();
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center shrink-0">
                <img
                  src={activeLogo}
                  alt="MRS Charity Foundation Logo"
                  className="max-h-full max-w-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                {info.name}
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              {info.name} is currently an <strong>online-based initiative</strong> dedicated to building awareness and collecting preliminary funds. A <strong>future big humanitarian project</strong> is coming from M R S to launch full-scale ground initiatives across rural education, hunger alleviation, and disaster relief.
            </p>

            <div className="text-xs text-amber-400 font-bold space-y-1">
              <div>Motto: "{info.motto}"</div>
              <div>Vision: "{info.secondaryMotto}"</div>
              <div className="text-emerald-400 font-semibold">Phase: Online Fund Collection · Big Ground Project in Development</div>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Core Pillars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#future-project" className="hover:text-white text-emerald-400 font-semibold transition-colors">
                  Future Project Roadmap
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Free Child Education
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Community Healthcare
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors">
                  Essential Food &amp; Relief
                </a>
              </li>
              <li>
                <a href="#sponsor" className="hover:text-white transition-colors">
                  Student Scholar Sponsorship
                </a>
              </li>
              <li>
                <a href="#volunteer" className="hover:text-white transition-colors">
                  Volunteer Supporter Network
                </a>
              </li>
            </ul>
          </div>

          {/* Zero Cost Ads Donate */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Zero-Cost Giving
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No money required from your wallet. Simply click below to trigger a sponsor contribution.
            </p>

            <button
              onClick={handleFooterDonate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Click to Donate (100% Free)</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 M R S Charity Foundation · A Future Project of M R S · All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-semibold">Poverty Ends With Us</span>
            <span>·</span>
            <span>Humanity United Against Poverty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
