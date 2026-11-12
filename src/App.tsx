import React, { useState } from 'react';
import { Currency, ChildProfile } from './types';
import { BackendSyncProvider, useBackendSync } from './context/BackendSyncContext';
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
import { FutureProjectSection } from './components/FutureProjectSection';
import { DonationModal } from './components/DonationModal';
import { SponsorChildModal } from './components/SponsorChildModal';
import { LiveSupporterWidget } from './components/LiveSupporterWidget';
import { Footer } from './components/Footer';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // Dynamic donation modal state
  const [donateCause, setDonateCause] = useState<string>('General Humanitarian & Child Education Fund');
  const [donateAmount, setDonateAmount] = useState<number>(2500);
  const [donateCurrency, setDonateCurrency] = useState<Currency>('BDT');
  const [donateFrequency, setDonateFrequency] = useState<'one-time' | 'monthly'>('monthly');

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
      {/* Top Navbar adhering to the strict Top Bar Contract */}
      <Navbar
        onOpenDonate={() => handleOpenDonate()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Continuous Announcement Slideshow Bar Running All The Time Under Headbar */}
      <AnnouncementSlideshowBar onDonationClick={() => {}} />

      <main className="flex-1">
        {/* Hero Section */}
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

        {/* Official Roadmap & Vision: A Future Project of M R S */}
        <FutureProjectSection onOpenDonate={() => handleOpenDonate()} />
      </main>

      {/* Authority Footer */}
      <Footer
        onOpenDonate={() => handleOpenDonate()}
      />

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

      {/* Automatic Click-to-Supporter Live Tracking HUD */}
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
