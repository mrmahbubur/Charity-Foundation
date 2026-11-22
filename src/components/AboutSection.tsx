import React from 'react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from './EditorialContainer';

export const AboutSection: React.FC = () => {
  const { organization, registration, contact } = SITE_CONFIG;

  return (
    <section id="about" className="section-editorial bg-surface border-b border-border">
      <EditorialContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[320px] lg:min-h-[460px] rounded-card overflow-hidden bg-surface-subtle border border-border">
              <img
                src={SITE_CONFIG.images.about}
                alt="Students holding storybooks outdoors at a rural community learning hub"
                loading="lazy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-ink-subtle mt-3 italic">
              Education, primary healthcare, and essential relief guide our roadmap as online reserves grow ahead of physical field launch.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <p className="eyebrow-heading">
                About Us · {organization.projectOf}
              </p>
              <h2 className="section-title">
                An Online Fund-Collection Initiative Preparing Future Humanitarian Impact
              </h2>
            </div>

            <div className="space-y-4 text-base text-ink-muted leading-relaxed max-w-[70ch]">
              <p>
                <strong>{organization.name}</strong> is a future humanitarian project of{' '}
                <strong>M R S</strong>, created to prepare meaningful support across healthcare,
                education, and everyday essential necessities for families facing poverty.
              </p>
              <p>
                Right now, we are in <strong>Phase 1 Online Fund-Collection</strong> and
                operate wholly on the web with <strong>no physical office address yet</strong>. Staying
                online keeps overhead close to zero so collected reserves go toward our future launch
                instead of office rent.
              </p>
              <p>
                Instead of asking visitors for money or payment cards, we use an{' '}
                <strong>ad-sponsored free giving model</strong>. When you click a support link,
                verified commercial sponsors compensate that visit, steadily building our charitable
                fund at <strong>zero cost to you</strong>.
              </p>
            </div>

            <div className="bg-canvas border border-border rounded-card p-6 space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-serif text-base font-bold text-heading">
                  Foundation Status &amp; Presence Overview
                </h3>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-ink-subtle font-medium">Project Status</dt>
                  <dd className="text-heading font-semibold mt-0.5">
                    {registration.entityStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle font-medium">Registration Status</dt>
                  <dd className="text-heading font-semibold mt-0.5">
                    {registration.registrationNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle font-medium">{contact.addressLabel}</dt>
                  <dd className="text-heading font-semibold mt-0.5">{contact.address}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle font-medium">Official Digital Contact</dt>
                  <dd className="text-heading font-semibold mt-0.5">{contact.email}</dd>
                </div>
              </dl>

              <p className="text-xs text-ink-subtle leading-relaxed pt-2 border-t border-border">
                {registration.note}
              </p>
            </div>
          </div>
        </div>
      </EditorialContainer>
    </section>
  );
};
