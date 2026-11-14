import React, { useState, useEffect } from 'react';
import { openNextSponsorLink, getTotalFreeClicks } from '../services/adDonateService';
import { useBackendSync } from '../context/BackendSyncContext';
import { Heart, Megaphone, ChevronLeft, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnnouncementSlideshowBarProps {
  onDonationClick?: () => void;
}

export const AnnouncementSlideshowBar: React.FC<AnnouncementSlideshowBarProps> = ({ onDonationClick }) => {
  const { content } = useBackendSync();
  const announcements = content.announcements && content.announcements.length > 0
    ? content.announcements
    : [
        {
          id: 'def-1',
          badge: 'Future Project',
          title: 'A Future Project of M R S',
          message: 'M R S Charity Foundation is an upcoming initiative dedicated to healthcare, education & essential necessities.',
          actionText: 'Support Future Project (Free)',
          active: true
        }
      ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalClicks, setTotalClicks] = useState(getTotalFreeClicks());
  const [isPaused, setIsPaused] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  // Auto-slide every 4.5 seconds continuously
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, announcements.length]);

  const handleFreeDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const result = openNextSponsorLink('announcement-bar');
    setTotalClicks(result.totalClicks);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 2000);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.15 },
      });
    } catch {
      // safe fallback
    }

    if (onDonationClick) {
      onDonationClick();
    }
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const slide = announcements[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-slate-950 shadow-md relative z-30 border-b border-amber-400/40 select-none overflow-hidden"
    >
      {/* Background subtle animated shimmer */}
      <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Slideshow message container */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-0">
            {/* Prev/Next arrows */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrev}
                className="p-1 rounded-md bg-black/10 hover:bg-black/20 text-slate-900 transition-colors cursor-pointer"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-md bg-black/10 hover:bg-black/20 text-slate-900 transition-colors cursor-pointer"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slide Content */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 min-w-0 text-xs sm:text-sm">
              <span className="bg-slate-950 text-amber-300 font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 inline-flex items-center gap-1 shadow-sm self-start sm:self-auto">
                <Megaphone className="w-3 h-3 text-amber-400" />
                <span>{slide.badge}</span>
              </span>

              <div className="line-clamp-2 md:truncate">
                <strong className="text-slate-950 font-bold">{slide.title}: </strong>
                <span className="text-slate-900 font-medium">{slide.message}</span>
              </div>
            </div>
          </div>

          {/* Right: Instant Free Donate Button with rotating links */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-center md:justify-end">
            {totalClicks > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-white/40 px-2 py-1 rounded-md">
                <Zap className="w-3 h-3 text-amber-900" />
                <span>Your Free Clicks: {totalClicks}</span>
              </div>
            )}

            <button
              onClick={handleFreeDonateClick}
              className={`w-full sm:w-auto justify-center px-4 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2 ${
                justClicked
                  ? 'bg-white text-emerald-800 scale-[1.02]'
                  : 'bg-slate-950 hover:bg-slate-900 text-white hover:shadow-md'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 shrink-0 ${justClicked ? 'fill-emerald-600 text-emerald-600' : 'fill-amber-400 text-amber-400'}`} />
              <span>{justClicked ? 'Thank you! Link Opened' : slide.actionText}</span>
              <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
            </button>
          </div>
        </div>

        {/* Slide pagination dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1.5">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-slate-950' : 'w-2 bg-slate-950/30 hover:bg-slate-950/60'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
