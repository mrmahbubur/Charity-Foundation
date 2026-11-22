import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { SITE_CONFIG, ConfigPageKey, NavItemConfig } from '../../site.config';
import { useBackendSync } from '../context/BackendSyncContext';
import { EditorialContainer } from './EditorialContainer';

export type AppPageRoute = ConfigPageKey;

interface NavbarProps {
  currentPage: AppPageRoute;
  activeSection: string;
  onSelectNavItem: (item: NavItemConfig) => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeSection,
  onSelectNavItem,
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

  const navLinks = SITE_CONFIG.navigation;
  const homeNav = navLinks[0] || { id: 'home', label: 'Home', target: 'section' as const };
  const featuredMobileNav = SITE_CONFIG.mobileFeaturedAction;

  const activeLogo =
    content.foundationInfo.logo === '/logo.png'
      ? SITE_CONFIG.organization.logoPath
      : content.foundationInfo.logo || SITE_CONFIG.organization.logoPath;
  const orgName = content.foundationInfo.name || SITE_CONFIG.organization.name;

  const isNavItemActive = (item: NavItemConfig) => {
    const targetSection = item.sectionId || item.id;
    return (
      (item.target === 'section' && currentPage === 'home' && activeSection === targetSection) ||
      (item.target === 'page' && item.page === currentPage) ||
      Boolean(item.activeOnPages?.includes(currentPage))
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border">
      <EditorialContainer className="h-16 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onSelectNavItem(homeNav);
          }}
          className="flex items-center gap-3 text-left shrink-0 cursor-pointer group"
        >
          <img
            src={activeLogo}
            alt={`${orgName} Logo`}
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain select-none shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight whitespace-nowrap">
            {orgName}
          </span>
        </button>

        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((item) => {
            const isActive = isNavItemActive(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectNavItem(item);
                }}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-ink-muted hover:text-primary hover:border-border-strong'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDonate();
            }}
            className="btn-accent text-xs sm:text-sm px-4 sm:px-5 py-2.5 whitespace-nowrap shrink-0"
          >
            <Heart className="w-4 h-4 fill-surface/90 shrink-0" />
            <span>Support Now</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-control text-ink hover:text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </EditorialContainer>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-5 shadow-card animate-fadeIn"
        >
          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navLinks.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectNavItem(item);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-control text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-ink hover:bg-surface-subtle'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="btn-accent w-full text-sm px-4 py-3"
            >
              <Heart className="w-4 h-4 fill-surface/90" />
              <span>Support Now (Free Ad-Sponsored)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectNavItem(featuredMobileNav);
              }}
              className="w-full text-center px-4 py-2.5 rounded-control text-xs font-semibold text-primary border border-border hover:bg-canvas transition-colors cursor-pointer"
            >
              {featuredMobileNav.label}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
