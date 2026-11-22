import React, { useState, useEffect, useRef, Suspense } from 'react';
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

function getSectionTargetId(item: NavItemConfig): string {
  return item.sectionId || item.id;
}

const ALL_CONFIGURED_NAV_ITEMS: NavItemConfig[] = [
  ...SITE_CONFIG.navigation,
  ...SITE_CONFIG.footerLinks,
  ...SITE_CONFIG.legalLinks,
  ...(SITE_CONFIG.mobileFeaturedActions || []),
];

const HOME_SECTION_ANCHORS = new Set<string>([
  ...ALL_CONFIGURED_NAV_ITEMS.filter((item) => item.target === 'section').map(getSectionTargetId),
  ...SITE_CONFIG.sectionAnchors,
]);

const KNOWN_ROUTE_SEGMENTS = new Set<string>([
  ...Object.values(SITE_CONFIG.pageRoutes)
    .flatMap((route) => route.paths)
    .filter(Boolean),
  'mrs-vault',
]);

interface ResolvedLocation {
  page: AppPageRoute;
  sectionId: string | null;
}

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
    if (!KNOWN_ROUTE_SEGMENTS.has(first)) {
      return rawSegments.slice(1);
    }
  }
  return rawSegments;
}

function getAppBasePathname(): string {
  if (typeof window === 'undefined') return '/';
  const rawSegments = window.location.pathname.split('/').filter(Boolean);
  if (
    window.location.hostname.endsWith('github.io') &&
    rawSegments.length > 0 &&
    !KNOWN_ROUTE_SEGMENTS.has(rawSegments[0])
  ) {
    return `/${rawSegments[0]}/`;
  }
  return '/';
}

function findPageByPathSegments(joined: string): AppPageRoute | null {
  if (!joined) return 'home';
  const matchedPath = Object.values(SITE_CONFIG.pageRoutes).find((route) =>
    route.paths.includes(joined)
  );
  return matchedPath ? matchedPath.id : null;
}

function getQuerySectionParam(): string | null {
  if (typeof window === 'undefined' || !window.location.search) return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const val = params.get('section')?.trim();
    return val || null;
  } catch {
    return null;
  }
}

function resolveRouteFromLocation(): ResolvedLocation {
  if (typeof window === 'undefined') return { page: 'home', sectionId: null };

  const segments = getNormalizedPathSegments();
  const joinedPath = segments.join('/');
  const pathMatchedPage = findPageByPathSegments(joinedPath);
  const querySection = getQuerySectionParam();

  const hash = window.location.hash;
  if (hash && hash !== '#') {
    if (hash.startsWith('#/')) {
      const normalized = hash.replace(/\/+$/, '');
      const [rawRouteWithQuery, explicitAnchor] = normalized.split('#').filter(Boolean);
      const [routePart, hashQuery] = (rawRouteWithQuery || '').split('?');
      const cleanRouteHash = routePart ? `#${routePart}` : '#';
      const hashSectionParam = hashQuery
        ? new URLSearchParams(hashQuery).get('section')?.trim() || null
        : null;
      const targetSection = explicitAnchor || hashSectionParam || querySection || null;

      const matchedPage = (Object.values(SITE_CONFIG.pageRoutes) as Array<{
        id: ConfigPageKey;
        hash: string;
      }>).find((route) => route.hash === cleanRouteHash);

      if (matchedPage) {
        return { page: matchedPage.id, sectionId: targetSection };
      }
      if (cleanRouteHash === '#') {
        return { page: 'home', sectionId: targetSection };
      }
      return { page: 'not-found', sectionId: null };
    }

    const anchor = hash.slice(1);

    // If URL pathname already points to a dedicated sub-page (e.g. /transparency#fund-allocation)
    if (pathMatchedPage && pathMatchedPage !== 'home') {
      return { page: pathMatchedPage, sectionId: anchor };
    }

    if (HOME_SECTION_ANCHORS.has(anchor)) {
      return { page: 'home', sectionId: anchor };
    }

    const matchedByAnchor = Object.values(SITE_CONFIG.pageRoutes).find((route) =>
      route.paths.includes(anchor)
    );
    return matchedByAnchor
      ? { page: matchedByAnchor.id, sectionId: querySection }
      : { page: 'not-found', sectionId: null };
  }

  if (pathMatchedPage) {
    return { page: pathMatchedPage, sectionId: querySection };
  }
  return { page: 'not-found', sectionId: null };
}

function scrollToTargetSection(sectionId: string) {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function MainApp() {
  const initialLocation = useRef<ResolvedLocation>(resolveRouteFromLocation());
  const pendingSectionRef = useRef<string | null>(initialLocation.current.sectionId);

  const [isVaultRoute, setIsVaultRoute] = useState<boolean>(isPrivateVaultRoute);
  const [currentPage, setCurrentPage] = useState<AppPageRoute>(initialLocation.current.page);
  const [activeSection, setActiveSection] = useState<string>(
    initialLocation.current.sectionId || 'home'
  );
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateCause, setDonateCause] = useState<string>(
    'Healthcare, Education & Essential Relief'
  );

  useEffect(() => {
    const syncRoute = () => {
      setIsVaultRoute(isPrivateVaultRoute());
      const resolved = resolveRouteFromLocation();
      pendingSectionRef.current = resolved.sectionId;
      setCurrentPage(resolved.page);
      if (resolved.sectionId && resolved.page === 'home') {
        setActiveSection(resolved.sectionId);
      }
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
    const basePath = getAppBasePathname();
    const origin = window.location.origin;

    const upsertMeta = (attr: 'name' | 'property', key: string, contentValue: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    const routeMeta = SITE_CONFIG.pageRoutes[currentPage] || SITE_CONFIG.pageRoutes.home;
    const nextTitle = isVaultRoute
      ? `Owner Vault | ${baseName}`
      : currentPage === 'home'
        ? `${baseName} – ${routeMeta.titlePrefix}`
        : `${routeMeta.titlePrefix} | ${baseName}`;

    const nextDescription = isVaultRoute
      ? `${baseName} administrative configuration workspace.`
      : routeMeta.description || SITE_CONFIG.organization.heroMission;

    document.title = nextTitle;

    const cleanSlug =
      currentPage === 'home' || currentPage === 'not-found'
        ? ''
        : routeMeta.paths[0] || '';
    const canonicalPath = cleanSlug
      ? `${basePath.replace(/\/$/, '')}/${cleanSlug}`
      : basePath;
    const canonicalHref = isVaultRoute
      ? `${origin}${window.location.pathname}`
      : `${origin}${canonicalPath}`;
    const resolvedLogoUrl = new URL(
      SITE_CONFIG.organization.logoPath,
      window.location.href
    ).href;

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalHref);

    upsertMeta(
      'name',
      'robots',
      isVaultRoute || currentPage === 'not-found' ? 'noindex, nofollow' : 'index, follow'
    );
    upsertMeta('name', 'description', nextDescription);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', baseName);
    upsertMeta('property', 'og:url', canonicalHref);
    upsertMeta('property', 'og:title', nextTitle);
    upsertMeta('property', 'og:description', nextDescription);
    upsertMeta('property', 'og:image', resolvedLogoUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', nextTitle);
    upsertMeta('name', 'twitter:description', nextDescription);
    upsertMeta('name', 'twitter:image', resolvedLogoUrl);

    const schemaScript = document.getElementById('org-schema');
    if (schemaScript && schemaScript.textContent) {
      try {
        const parsed = JSON.parse(schemaScript.textContent);
        parsed.url = `${origin}${basePath}`;
        parsed.logo = resolvedLogoUrl;
        parsed.description = SITE_CONFIG.organization.heroMission;
        schemaScript.textContent = JSON.stringify(parsed);
      } catch {
        // ignore JSON-LD parse error
      }
    }
  }, [currentPage, isVaultRoute]);

  useEffect(() => {
    if (isVaultRoute || !pendingSectionRef.current) return;
    const targetSection = pendingSectionRef.current;
    const rafId = window.requestAnimationFrame(() => {
      scrollToTargetSection(targetSection);
      pendingSectionRef.current = null;
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [currentPage, isVaultRoute]);

  useEffect(() => {
    if (currentPage !== 'home' || isVaultRoute || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const sectionIds = Array.from(HOME_SECTION_ANCHORS);
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
      const basePath = getAppBasePathname();
      window.history.pushState({}, '', basePath);
    } catch {
      window.location.hash = '';
    }
    setIsVaultRoute(false);
    setCurrentPage('home');
    setActiveSection('home');
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
    const nextUrl = `${getAppBasePathname()}#${sectionId}`;

    if (currentPage !== 'home') {
      pendingSectionRef.current = sectionId;
      setCurrentPage('home');
      try {
        window.history.pushState({}, '', nextUrl);
      } catch {
        window.location.hash = sectionId;
      }
      return;
    }

    try {
      window.history.replaceState({}, '', nextUrl);
    } catch {
      window.location.hash = sectionId;
    }
    scrollToTargetSection(sectionId);
  };

  const navigateToPage = (page: AppPageRoute, sectionId?: string) => {
    const routeHash = SITE_CONFIG.pageRoutes[page]?.hash || SITE_CONFIG.pageRoutes.home.hash;
    const nextUrl = `${getAppBasePathname()}${routeHash}${sectionId ? `#${sectionId}` : ''}`;

    try {
      window.history.pushState({}, '', nextUrl);
    } catch {
      window.location.hash = sectionId ? `${routeHash}#${sectionId}` : routeHash;
    }

    if (page === currentPage) {
      pendingSectionRef.current = null;
      if (sectionId) {
        scrollToTargetSection(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    pendingSectionRef.current = sectionId || null;
    setCurrentPage(page);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavItemSelect = (item: NavItemConfig) => {
    if (item.target === 'page' && item.page) {
      navigateToPage(item.page, item.sectionId);
    } else {
      navigateToSection(getSectionTargetId(item));
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
