import React, { useState, useEffect } from 'react';
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
import { BrainControlConsole } from './components/BrainControlConsole';
import { Footer } from './components/Footer';

function isBrainConsoleRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.pathname === '/brain' ||
    window.location.pathname.startsWith('/brain/') ||
    window.location.hash === '#brain'
  );
}

function MainApp() {
  const [isBrainRoute, setIsBrainRoute] = useState<boolean>(isBrainConsoleRoute);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // Dynamic donation modal state
  const [donateCause, setDonateCause] = useState<string>('General Humanitarian & Child Education Fund');
  const [donateAmount, setDonateAmount] = useState<number>(2500);
  const [donateCurrency, setDonateCurrency] = useState<Currency>('BDT');
  const [donateFrequency, setDonateFrequency] = useState<'one-time' | 'monthly'>('monthly');

  useEffect(() => {
    const syncRoute = () => setIsBrainRoute(isBrainConsoleRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleExitBrainConsole = () => {
    try {
      if (window.location.pathname === '/brain' || window.location.pathname.startsWith('/brain/')) {
        window.history.pushState({}, '', '/');
      } else {
        window.location.hash = '';
      }
    } catch {
      window.location.hash = '';
    }
    setIsBrainRoute(false);
  };

  if (isBrainRoute) {
    return <BrainControlConsole onExit={handleExitBrainConsole} />;
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
    <div className="min-h-screen flex flex-col bg-[#FCFCFA] text-slate-900 selection:bg-amber-100 selection:text-amber-900 relative">
      {/* Top Navbar */}
      <Navbar
        onOpenDonate={() => handleOpenDonate()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Continuous Announcement Slideshow Bar */}
      <AnnouncementSlideshowBar onDonationClick={() => {}} />

      <main className="flex-1">
        {/* Hero Section with Live Community Milestone */}
        <Hero
          onOpenDonate={() => handleOpenDonate()}
          onSelectSponsor={handleSelectSponsorFromHero}
        />

        {/* Quick 1-Click Contribution Bar */}
        <QuickDonationStrip onOpenDonate={handleOpenDonate} />

        {/* Sponsor a Child Flagship Section */}
        <SponsorChildSection onSelectChild={(child) => setSelectedChild(child)} />

        {/* Core Programs & Campaigns */}
        <ProgramsSection onOpenDonate={handleOpenDonate} />

        {/* Financial Transparency & Audited Reports */}
        <ImpactAuditSection />

        {/* Volunteer for Hope Portal */}
        <VolunteerSection />

        {/* Transformation Stories & Testimonials */}
        <StoriesSection />

        {/* Latest Field Dispatches, News & Posts with Thumbnails and Snippets */}
        <LatestPostsSection onOpenDonate={() => handleOpenDonate()} />

        {/* Foundation Knowledge & FAQ Hub */}
        <BrainKnowledgeSection />

        {/* Official Roadmap & Vision: A Future Project of M R S */}
        <FutureProjectSection onOpenDonate={() => handleOpenDonate()} />
      </main>

      {/* Authority Footer */}
      <Footer onOpenDonate={() => handleOpenDonate()} />

      {/* Interactive Global Donation Modal */}
      <DonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        defaultCause={donateCause}
        defaultAmount={donateAmount}
        defaultCurrency={donateCurrency}
        defaultFrequency={donateFrequency}
      />

      {/* Child Sponsorship Dedicated Modal */}
      <SponsorChildModal
        child={selectedChild}
        onClose={() => setSelectedChild(null)}
      />

      {/* Bottom-Left Smart Milestone Nudge */}
      <SmartEngagementBar />

      {/* Bottom-Right Live Community Impact Card */}
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
