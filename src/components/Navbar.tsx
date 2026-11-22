import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { useBackendSync } from '../context/BackendSyncContext';

export type AppPageRoute = 'home' | 'transparency' | 'donate' | 'privacy' | 'terms' | 'not-found';

interface NavbarProps {
  currentPage: AppPageRoute;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onNavigatePage: (page: AppPageRoute) => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeSection,
  onNavigateSection,
  onNavigatePage,
  onOpenDonate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useBackendSync();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks: Array<{ id: string; label: string; type: 'section' | 'page'; page?: AppPageRoute }> = [
    { id: 'home', label: 'Home', type: 'section' },
    { id: 'about', label: 'About Us', type: 'section' },
    { id: 'our-work', label: 'Our Work', type: 'section' },
    { id: 'impact', label: 'Impact', type: 'section' },
    { id: 'transparency', label: 'Transparency', type: 'section' },
    { id: 'get-involved', label: 'Get Involved', type: 'section' },
    { id: 'contact', label: 'Contact', type: 'section' },
  ];

  const handleLinkClick = (item: (typeof navLinks)[number]) => {
    setMobileMenuOpen(false);
    if (item.type === 'page' && item.page) {
      onNavigatePage(item.page);
    } else {
      onNavigateSection(item.id);
    }
  };

  const activeLogo =
    content.foundationInfo.logo === '/logo.png'
      ? './logo.png'
      : content.foundationInfo.logo || SITE_CONFIG.organization.logoPath;
  const orgName = content.foundationInfo.name || SITE_CONFIG.organization.name;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Left: Official Logo + Single-Line Organization Title */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onNavigateSection('home');
          }}
          className="flex items-center gap-3 text-left shrink-0 cursor-pointer group"
        >
          <img
            src={activeLogo}
            alt={`${orgName} Logo`}
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain select-none shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif text-base sm:text-lg font-bold text-[#0F3D3E] tracking-tight whitespace-nowrap">
            {orgName}
          </span>
        </button>

        {/* Center: Clean Editorial Navigation */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((item) => {
            const isActive =
              (currentPage === 'home' && activeSection === item.id) ||
              (currentPage === 'transparency' && item.id === 'transparency');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#0F3D3E] text-[#0F3D3E] font-semibold'
                    : 'border-transparent text-slate-600 hover:text-[#0F3D3E] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Single Prominent Accent CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDonate();
            }}
            className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white/90 shrink-0" />
            <span>Support Now</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#0F3D3E] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 shadow-md"
        >
          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navLinks.map((item) => {
              const isActive =
                (currentPage === 'home' && activeSection === item.id) ||
                (currentPage === 'transparency' && item.id === 'transparency');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0F3D3E]/10 text-[#0F3D3E] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-4 py-3 rounded-lg transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white/90" />
              <span>Support Now (Free Ad-Sponsored)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigatePage('transparency');
              }}
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0F3D3E] border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View Full Transparency Report
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
