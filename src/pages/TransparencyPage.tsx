import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { openNextSponsorLink } from '../services/adDonateService';
import { EditorialContainer } from '../components/EditorialContainer';

interface TransparencyPageProps {
  onBackHome: () => void;
  onOpenDonatePage: () => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({
  onBackHome,
  onOpenDonatePage,
}) => {
  const { transparency, registration, contact, organization } = SITE_CONFIG;

  return (
    <div className="bg-canvas min-h-screen py-12 lg:py-20">
      <EditorialContainer size="narrow" className="space-y-12">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <header className="space-y-4 border-b border-border pb-8">
          <p className="eyebrow-heading">Public Accountability &amp; Governance</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heading leading-tight">
            Financial Transparency &amp; Stewardship
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-[70ch]">
            {transparency.accountabilityStatement}
          </p>
        </header>

        <section id="fund-allocation" className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-heading">
              1. Fund Utilization Model
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-[70ch]">
              {transparency.allocationNote}
            </p>
          </div>

          <div className="editorial-card p-6 sm:p-8 space-y-6">
            <div className="w-full h-4 rounded-control overflow-hidden flex border border-border">
              {transparency.allocations.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  title={`${item.label}: ${item.percentage}%`}
                />
              ))}
            </div>

            <div className="divide-y divide-border">
              {transparency.allocations.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-[60ch]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <h3 className="font-semibold text-base text-heading">{item.label}</h3>
                    </div>
                    <p className="text-sm text-ink-muted">{item.description}</p>
                  </div>
                  <div className="font-serif text-2xl font-bold text-primary tabular-nums shrink-0">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="donor-safety" className="space-y-5">
          <h2 className="font-serif text-2xl font-bold text-heading">
            2. Donor Safety &amp; Pre-Launch Accountability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-heading">
                  Zero Personal Payments Requested
                </h3>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                This portal never processes credit cards, debit cards, mobile banking PINs, or wire transfers from general visitors. Participation happens strictly through voluntary visits to sponsor partner links.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-primary">
                <FileText className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-heading">
                  Zero Office Rent &amp; Honest Status
                </h3>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                Operating online without a physical office during Phase 1 Online Fund-Collection keeps fixed costs minimal while initial reserves accumulate. We never display fabricated awards, partner logos, or fictitious testimonials.
              </p>
            </div>
          </div>
        </section>

        <section id="official-disclosure" className="editorial-card p-6 sm:p-8 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-serif text-2xl font-bold text-heading">
              3. Status &amp; Official Disclosure
            </h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <dt className="text-ink-subtle font-medium">Organization Name</dt>
              <dd className="text-heading font-semibold mt-0.5">
                {organization.name} ({organization.projectOf})
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle font-medium">Registration Status</dt>
              <dd className="text-heading font-semibold mt-0.5">
                {registration.registrationNumber}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle font-medium">Registering Authority</dt>
              <dd className="text-heading font-semibold mt-0.5">
                {registration.registeringAuthority}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle font-medium">{contact.addressLabel}</dt>
              <dd className="text-heading font-semibold mt-0.5">{contact.address}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle font-medium">Official Digital Email</dt>
              <dd className="text-heading font-semibold mt-0.5">{contact.email}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle font-medium">Portal Availability</dt>
              <dd className="text-heading font-semibold mt-0.5">{contact.operatingHours}</dd>
            </div>
          </dl>

          <p className="text-xs text-ink-subtle pt-2 border-t border-border">
            {registration.note}
          </p>
        </section>

        <div className="bg-primary text-surface rounded-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold">Support Phase 1 Online Fund-Collection</h3>
            <p className="text-sm text-on-primary-soft">
              Contribute to our pre-launch charitable reserve at zero personal cost via a verified sponsor partner visit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openNextSponsorLink('transparency-page')}
              className="btn-accent text-sm px-5 py-3"
            >
              <Heart className="w-4 h-4 fill-surface/90" />
              <span>Support Now (Free)</span>
            </button>
            <button
              type="button"
              onClick={onOpenDonatePage}
              className="px-5 py-3 rounded-control border border-surface/30 text-sm font-semibold hover:bg-surface/10 transition-colors cursor-pointer"
            >
              How Giving Works
            </button>
          </div>
        </div>
      </EditorialContainer>
    </div>
  );
};
