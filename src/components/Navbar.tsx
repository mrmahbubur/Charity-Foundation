import React, { useState } from 'react';
import { openNextSponsorLink } from '../services/adDonateService';
import { useBackendSync } from '../context/BackendSyncContext';
import { Heart, Menu, X, ExternalLink, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NavbarProps {
  onOpenDonate: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDonate,
  activeTab,
  setActiveTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useBackendSync();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'future-project', label: 'Future Project' },
    { id: 'sponsor', label: 'Student Sponsorship' },
    { id: 'programs', label: 'Our Pillars' },
    { id: 'posts', label: 'Dispatches & Posts' },
    { id: 'knowledge', label: 'Knowledge & FAQ' },
    { id: 'impact', label: 'Transparency' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickDonate = () => {
    openNextSponsorLink('navbar');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
      });
    } catch {
      // safe fallback
    }
    onOpenDonate();
  };

  const activeLogo = content.foundationInfo.logo || '/logo.png';
  const foundationName = content.foundationInfo.name || 'M R S Charity Foundation';
  const motto = content.foundationInfo.motto || 'Poverty Ends With Us';
  const secondaryMotto = content.foundationInfo.secondaryMotto || 'Humanity United Against Poverty';
  const totalSupporters = content.donationStats.totalSupporters || 18450;

  return (
    <>
      {/* Top Motto Ribbon - Showing Automatic Live Backend Sync & Supporters */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">{foundationName}:</span>
            <span>"{motto}" — {secondaryMotto}</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-200">
            {/* Live Supporter automatic counter */}
            <div className="flex items-center gap-1.5 bg-emerald-900/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-emerald-700/60 font-semibold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="tabular-nums">{totalSupporters.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-300 font-normal hidden sm:inline">Supporters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Navigation conforming to strict Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark Element with Official Site Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shrink-0">
              <img
                src={activeLogo}
                alt="MRS Charity Foundation Logo"
                className="max-h-full max-w-full object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
                {foundationName}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
                A Project of M R S · {motto}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
                  activeTab === item.id
                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleQuickDonate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap flex items-center gap-2 group"
            >
              <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>Donate (100% Free)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
