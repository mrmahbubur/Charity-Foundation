import React, { useState, useEffect, Suspense } from 'react';
import { Currency, ChildProfile } from './types';
import { BackendSyncProvider } from './context/BackendSyncContext';
import { Navbar } from './components/Navbar';
import { AnnouncementSlideshowBar } from './components/AnnouncementSlideshowBar';
import { Hero } from './components/Hero';
import { QuickDonationStrip } from './components/QuickDonationStrip';
import { SponsorChildSection } from './components/SponsorChildSection';
import { ProgramsSection } from './components/ProgramsSection';
import { ImpactAuditSection } from './components/ImpactAuditSection';
import { VolunteerSection } from './components/VolunteerSection';
import { StoriesSection } from './components/StoriesSection';
import { LatestPostsSection } from './components/LatestPostsSection';
import { BrainKnowledgeSection } from './components/BrainKnowledgeSection';
import { FutureProjectSection } from './components/FutureProjectSection';
import { DonationModal } from './components/DonationModal';
import { SponsorChildModal } from './components/SponsorChildModal';
import { LiveSupporterWidget } from './components/LiveSupporterWidget';
import { SmartEngagementBar } from './components/SmartEngagementBar';
import { Footer } from './components/Footer';

// Code-split private console so public site visitors never download its UI bundle
const LazyVaultConsole = React.lazy(() =>
  import('./components/BrainControlConsole').then((m) => ({ default: m.BrainControlConsole }))
);

function isPrivateVaultRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname;
  const h = window.location.hash;
  return (
    p === '/mrs-vault' ||
    p.startsWith('/mrs-vault/') ||
    h === '#mrs-vault' ||
    p === '/brain' ||
    p.startsWith('/brain/') ||
    h === '#brain'
  );
}

function MainApp() {
  const [isVaultRoute, setIsVaultRoute] = useState<boolean>(isPrivateVaultRoute);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  const [donateCause, setDonateCause] = useState<string>('General Humanitarian & Child Education Fund');
  const [donateAmount, setDonateAmount] = useState<number>(2500);
  const [donateCurrency, setDonateCurrency] = useState<Currency>('BDT');
  const [donateFrequency, setDonateFrequency] = useState<'one-time' | 'monthly'>('monthly');

  useEffect(() => {
    const syncRoute = () => setIsVaultRoute(isPrivateVaultRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleExitVault = () => {
    try {
      if (window.location.pathname.startsWith('/brain') || window.location.pathname.startsWith('/mrs-vault')) {
        window.history.pushState({}, '', '/');
      } else {
        window.location.hash = '';
      }
    } catch {
      window.location.hash = '';
    }
    setIsVaultRoute(false);
  };

  if (isVaultRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <LazyVaultConsole onExit={handleExitVault} />
      </Suspense>
    );
  }

  const handleOpenDonate = (
    cause?: string,
    defaultAmount?: number,
    currency?: Currency,
    frequency?: 'one-time' | 'monthly'
  ) => {
    if (cause) setDonateCause(cause);
    if (defaultAmount) setDonateAmount(defaultAmount);
    if (currency) setDonateCurrency(currency);
    if (frequency) setDonateFrequency(frequency);
    setIsDonateModalOpen(true);
  };

  const handleSelectSponsorFromHero = () => {
    const element = document.getElementById('sponsor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA] text-slate-900 selection:bg-amber-100 selection:text-amber-900 relative overflow-x-clip">
      <Navbar
        onOpenDonate={() => handleOpenDonate()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <AnnouncementSlideshowBar onDonationClick={() => {}} />

      <main className="flex-1">
        <Hero
          onOpenDonate={() => handleOpenDonate()}
          onSelectSponsor={handleSelectSponsorFromHero}
        />

        <QuickDonationStrip onOpenDonate={handleOpenDonate} />

        <SponsorChildSection onSelectChild={(child) => setSelectedChild(child)} />

        <ProgramsSection onOpenDonate={handleOpenDonate} />

        <ImpactAuditSection />

        <VolunteerSection />

        <StoriesSection />

        <LatestPostsSection onOpenDonate={() => handleOpenDonate()} />

        <BrainKnowledgeSection />

        <FutureProjectSection onOpenDonate={() => handleOpenDonate()} />
      </main>

      <Footer onOpenDonate={() => handleOpenDonate()} />

      <DonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        defaultCause={donateCause}
        defaultAmount={donateAmount}
        defaultCurrency={donateCurrency}
        defaultFrequency={donateFrequency}
      />

      <SponsorChildModal
        child={selectedChild}
        onClose={() => setSelectedChild(null)}
      />

      <SmartEngagementBar />

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
