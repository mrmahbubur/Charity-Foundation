import React, { useState, useEffect, Suspense } from 'react';
import { SITE_CONFIG, ConfigPageKey, NavItemConfig } from '../site.config';
import { BackendSyncProvider } from './context/BackendSyncContext';
import { Navbar, AppPageRoute } from './components/Navbar';
import { Hero } from './components/Hero';
import { MissionStrip } from './components/MissionStrip';
import { AboutSection } from './components/AboutSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ProgramsSection } from './components/ProgramsSection';
import { ImpactSection } from './components/ImpactSection';
import { TransparencySection } from './components/TransparencySection';
import { GetInvolvedSection } from './components/GetInvolvedSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { LiveSupporterWidget } from './components/LiveSupporterWidget';
import { TransparencyPage } from './pages/TransparencyPage';
import { DonatePage } from './pages/DonatePage';
import { LegalPage } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

// Code-split private owner console so public visitors never download its bundle
const LazyVaultConsole = React.lazy(() =>
  import('./components/BrainControlConsole').then((m) => ({ default: m.BrainControlConsole }))
);

const HOME_SECTION_ANCHORS = new Set([
  ...SITE_CONFIG.navigation.filter((n) => n.target === 'section').map((n) => n.id),
  ...SITE_CONFIG.sectionAnchors,
]);

const KNOWN_ROUTE_SEGMENTS = [
  ...Object.values(SITE_CONFIG.pageRoutes).flatMap((r) => r.paths).filter(Boolean),
  'mrs-vault',
];

function isPrivateVaultRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  const h = window.location.hash;
  return p === '/mrs-vault' || p.endsWith('/mrs-vault') || h === '#mrs-vault' || h === '#/mrs-vault';
}

function getNormalizedPathSegments(): string[] {
  if (typeof window === 'undefined') return [];
  const rawSegments = window.location.pathname.split('/').filter(Boolean);
  if (window.location.hostname.endsWith('github.io') && rawSegments.length > 0) {
    const first = rawSegments[0];
    if (!KNOWN_ROUTE_SEGMENTS.includes(first)) {
      return rawSegments.slice(1);
    }
  }
  return rawSegments;
}

function resolveRouteFromLocation(): AppPageRoute {
  if (typeof window === 'undefined') return 'home';

  const hash = window.location.hash;
  if (hash && hash !== '#') {
    if (hash.startsWith('#/')) {
      const normalized = hash.replace(/\/+$/, '');
      const matchedPage = (Object.values(SITE_CONFIG.pageRoutes) as Array<{ id: ConfigPageKey; hash: string }>).find(
        (route) => route.hash === normalized
      );
      if (matchedPage) return matchedPage.id;
      if (normalized === '#') return 'home';
      return 'not-found';
    }
    const anchor = hash.slice(1);
    if (HOME_SECTION_ANCHORS.has(anchor)) {
      return 'home';
    }
    const matchedByAnchor = Object.values(SITE_CONFIG.pageRoutes).find((r) =>
      r.paths.includes(anchor)
    );
    return matchedByAnchor ? matchedByAnchor.id : 'not-found';
  }

  const segments = getNormalizedPathSegments();
  if (segments.length === 0) return 'home';
  const joined = segments.join('/');
  const matchedPath = Object.values(SITE_CONFIG.pageRoutes).find((r) =>
    r.paths.includes(joined)
  );
  return matchedPath ? matchedPath.id : 'not-found';
}

function MainApp() {
  const [isVaultRoute, setIsVaultRoute] = useState<boolean>(isPrivateVaultRoute);
  const [currentPage, setCurrentPage] = useState<AppPageRoute>(resolveRouteFromLocation);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateCause, setDonateCause] = useState<string>(
    'Healthcare, Education & Essential Relief'
  );

  useEffect(() => {
    const syncRoute = () => {
      setIsVaultRoute(isPrivateVaultRoute());
      setCurrentPage(resolveRouteFromLocation());
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    const baseName = SITE_CONFIG.organization.name;
    const routeMeta = SITE_CONFIG.pageRoutes[currentPage] || SITE_CONFIG.pageRoutes.home;
    document.title =
      currentPage === 'home'
        ? `${baseName} | ${routeMeta.titlePrefix}`
        : `${routeMeta.titlePrefix} | ${baseName}`;
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 'home' || isVaultRoute || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const sectionIds = SITE_CONFIG.navigation
      .filter((item) => item.target === 'section')
      .map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [currentPage, isVaultRoute]);

  const handleExitVault = () => {
    try {
      if (window.location.pathname.endsWith('/mrs-vault')) {
        const cleaned = window.location.pathname.replace(/\/mrs-vault\/?$/, '') || '/';
        window.history.pushState({}, '', cleaned);
      } else {
        window.location.hash = '';
      }
    } catch {
      window.location.hash = '';
    }
    setIsVaultRoute(false);
    setCurrentPage('home');
  };

  if (isVaultRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-canvas" aria-busy="true" />}>
        <LazyVaultConsole onExit={handleExitVault} />
      </Suspense>
    );
  }

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      try {
        window.history.replaceState({}, '', `#${sectionId}`);
      } catch {
        window.location.hash = sectionId;
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
      return;
    }

    if (sectionId === 'home') {
      try {
        window.history.replaceState({}, '', '#home');
      } catch {
        window.location.hash = 'home';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToPage = (page: AppPageRoute) => {
    setCurrentPage(page);
    const targetHash = SITE_CONFIG.pageRoutes[page]?.hash || SITE_CONFIG.pageRoutes.home.hash;
    try {
      window.history.pushState({}, '', targetHash);
    } catch {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavItemSelect = (item: NavItemConfig) => {
    if (item.target === 'page' && item.page) {
      navigateToPage(item.page);
    } else {
      navigateToSection(item.id);
    }
  };

  const handleOpenDonate = (cause?: string) => {
    if (cause) setDonateCause(cause);
    setIsDonateModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink relative overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn-primary px-4 py-2 text-sm"
      >
        Skip to main content
      </a>

      <Navbar
        currentPage={currentPage}
        activeSection={activeSection}
        onSelectNavItem={handleNavItemSelect}
        onNavigatePage={navigateToPage}
        onOpenDonate={() => handleOpenDonate()}
      />

      <main id="main-content" className="flex-1 animate-fadeIn">
        {currentPage === 'transparency' ? (
          <TransparencyPage
            onBackHome={() => navigateToSection('home')}
            onOpenDonatePage={() => navigateToPage('donate')}
          />
        ) : currentPage === 'donate' ? (
          <DonatePage
            onBackHome={() => navigateToSection('home')}
            onOpenTransparencyPage={() => navigateToPage('transparency')}
          />
        ) : currentPage === 'privacy' ? (
          <LegalPage type="privacy" onBackHome={() => navigateToSection('home')} />
        ) : currentPage === 'terms' ? (
          <LegalPage type="terms" onBackHome={() => navigateToSection('home')} />
        ) : currentPage === 'not-found' ? (
          <NotFoundPage onBackHome={() => navigateToSection('home')} />
        ) : (
          <>
            <Hero
              onSupportNow={() => handleOpenDonate('General Humanitarian Reserve')}
              onLearnMore={() => navigateToSection('about')}
            />
            <MissionStrip />
            <AboutSection />
            <HowItWorksSection
              onSupportNow={() => handleOpenDonate('Zero-Cost Sponsor Giving')}
              onOpenDonatePage={() => navigateToPage('donate')}
            />
            <ProgramsSection onOpenDonate={(cause) => handleOpenDonate(cause)} />
            <ImpactSection />
            <TransparencySection
              onOpenTransparencyPage={() => navigateToPage('transparency')}
            />
            <GetInvolvedSection
              onOpenDonatePage={() => navigateToPage('donate')}
              onJumpToContact={() => navigateToSection('contact')}
            />
            <FaqSection />
            <ContactSection />
          </>
        )}
      </main>

      <Footer onSelectNavItem={handleNavItemSelect} />

      <DonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        defaultCause={donateCause}
        onOpenDonatePage={() => navigateToPage('donate')}
      />

      <LiveSupporterWidget />
    </div>
  );
}

export default function App() {
  return (
    <BackendSyncProvider>
      <MainApp />
    </BackendSyncProvider>
  );
}
