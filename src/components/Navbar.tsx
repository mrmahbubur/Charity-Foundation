import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, ArrowRight } from 'lucide-react';
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
  const mobileFeaturedActions = SITE_CONFIG.mobileFeaturedActions || [];

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
      <EditorialContainer className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onSelectNavItem(homeNav);
          }}
          className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0 shrink cursor-pointer group"
        >
          <img
            src={activeLogo}
            alt={`${orgName} Logo`}
            className="h-9 w-9 sm:h-11 sm:w-11 object-contain select-none shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif text-sm sm:text-lg font-bold text-primary tracking-tight truncate">
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDonate();
            }}
            className="btn-accent text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 whitespace-nowrap shrink-0"
          >
            <Heart className="w-4 h-4 fill-surface/90 shrink-0" />
            <span>Support Now</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-control border transition-colors cursor-pointer shrink-0 ${
              mobileMenuOpen
                ? 'bg-primary text-surface border-primary'
                : 'bg-canvas text-ink border-border-strong hover:text-primary hover:border-primary/40 hover:bg-surface-subtle'
            }`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </EditorialContainer>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-surface border-b border-border shadow-card animate-fadeIn"
        >
          <EditorialContainer className="pt-3 pb-5 space-y-4">
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

            <div className="pt-4 border-t border-border space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonate();
                }}
                className="btn-accent w-full text-sm px-4 py-3"
              >
                <Heart className="w-4 h-4 fill-surface/90 shrink-0" />
                <span>Support Now (Free Ad-Sponsored)</span>
              </button>

              {mobileFeaturedActions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mobileFeaturedActions.map((action) => {
                    const isActionActive = isNavItemActive(action);
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSelectNavItem(action);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-control text-xs font-semibold border transition-colors cursor-pointer ${
                          isActionActive
                            ? 'bg-primary/10 text-primary border-primary/40'
                            : 'bg-canvas text-primary border-border hover:border-primary/40 hover:bg-surface-subtle'
                        }`}
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </EditorialContainer>
        </div>
      )}
    </header>
  );
};
