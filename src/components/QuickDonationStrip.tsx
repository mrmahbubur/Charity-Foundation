import React, { useState } from 'react';
import { Currency } from '../types';
import { openNextSponsorLink, DONATE_SPONSOR_LINKS } from '../services/adDonateService';
import { useSupporterCount } from '../hooks/useSupporterCount';
import { Heart, Sparkles, Zap, ExternalLink, RefreshCw, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickDonationStripProps {
  onOpenDonate: (cause?: string, defaultAmount?: number, currency?: Currency, frequency?: 'one-time' | 'monthly') => void;
}

export const QuickDonationStrip: React.FC<QuickDonationStripProps> = ({ onOpenDonate }) => {
  const { totalSupporters, userClicks } = useSupporterCount();
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const handleFreeDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const result = openNextSponsorLink();
    setLastMessage(`Sponsor Link #${result.linkNumber} Opened! +1 Supporter & Free donation registered.`);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.25 },
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => setLastMessage(null), 3000);
  };

  return (
    <section className="bg-white border-b border-slate-200 py-5 sm:py-6 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Left Title & Explanation */}
          <div className="space-y-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Zero-Cost Giving System</span>
              </span>
              <span className="text-xs text-emerald-700 font-semibold hidden sm:inline">
                No money needed from you
              </span>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
              Click the Button Below to Donate 100% Free
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Every click opens a different verified ad sponsor in a new tab. Our partners fund tuition, hot midday meals, and winter relief for children in Bangladesh.
            </p>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
            <button
              onClick={handleFreeDonateClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2.5 whitespace-nowrap group transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Click to Donate (Free · No Money Needed)</span>
              <ExternalLink className="w-4 h-4 text-emerald-200" />
            </button>

            <button
              onClick={() => onOpenDonate()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Learn How It Works</span>
            </button>
          </div>
        </div>

        {/* Live feedback alert or counter bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          {lastMessage ? (
            <div className="text-emerald-700 font-bold flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{lastMessage} (Next click will open another unique link!)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automatically rotates through {DONATE_SPONSOR_LINKS.length} verified sponsor links in new tabs. Click as many times as you want!</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-700 font-semibold">
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Community Supporters: <strong className="text-emerald-700 font-bold tabular-nums">{totalSupporters.toLocaleString()}</strong></span>
            </span>
            {userClicks > 0 && (
              <span className="text-slate-600">
                Your Clicks: <strong className="text-emerald-700 font-bold tabular-nums">{userClicks}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
