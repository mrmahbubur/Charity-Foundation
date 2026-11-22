import React from 'react';
import { SITE_CONFIG } from '../../site.config';

export const AboutSection: React.FC = () => {
  const { organization, registration, contact } = SITE_CONFIG;

  return (
    <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left: Documentary Photography */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[320px] lg:min-h-[460px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={SITE_CONFIG.images.about}
                alt="Students holding storybooks outdoors at a rural community learning hub"
                loading="lazy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              Education, primary healthcare, and essential relief guide our roadmap as online reserves grow ahead of physical field launch.
            </p>
          </div>

          {/* Right: Editorial Narrative + Honest Status Disclosure */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
                About Us · {organization.projectOf}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
                An Online Fund-Collection Initiative Preparing Future Humanitarian Impact
              </h2>
            </div>

            <div className="space-y-4 text-base text-slate-600 leading-relaxed max-w-[70ch]">
              <p>
                <strong>{organization.name}</strong> is a future humanitarian project of{' '}
                <strong>M R S</strong>, created to prepare meaningful support across healthcare,
                education, and everyday essential necessities for families facing poverty.
              </p>
              <p>
                Right now, we are in our <strong>active online fund-collection phase</strong> and
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

            {/* Official Status & Presence Record */}
            <div className="bg-[#FAFAF8] border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Foundation Status &amp; Presence Overview
                </h3>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-slate-500 font-medium">Project Status</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">
                    {registration.entityStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Registration Status</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">
                    {registration.registrationNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">{contact.addressLabel}</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">{contact.address}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 font-medium">Official Digital Contact</dt>
                  <dd className="text-slate-900 font-semibold mt-0.5">{contact.email}</dd>
                </div>
              </dl>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
                {registration.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
