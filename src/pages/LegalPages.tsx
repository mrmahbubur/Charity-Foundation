import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBackHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBackHome }) => {
  const { organization, contact, registration } = SITE_CONFIG;

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D3E] hover:underline underline-offset-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {type === 'privacy' ? (
          <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <header className="space-y-2 border-b border-slate-200 pb-6">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
                Legal Disclosure
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500">
                Effective Year: {organization.copyrightYear} · {organization.name} ({organization.projectOf})
              </p>
            </header>

            <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-[70ch]">
              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  1. Information We Collect
                </h2>
                <p>
                  This website operates as an online-only informational and free ad-sponsored support portal during our pre-launch fund-collection phase. We do <strong>not</strong> collect credit card numbers, banking credentials, or financial payment records from visitors.
                </p>
                <p>
                  When you click support buttons, your browser stores simple non-identifying counters in local storage (such as your current sponsor-link rotation index and click tally) purely to rotate sponsor links smoothly across clicks.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  2. Voluntary Forms &amp; Inquiries
                </h2>
                <p>
                  If you choose to fill out our Contact form or Volunteer Interest form, any information you enter is prepared locally for your confirmation or email transmission to our official digital address ({contact.email}). We do not sell, rent, or trade supporter information.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  3. Third-Party Sponsor Links
                </h2>
                <p>
                  Clicking zero-cost donate buttons opens verified commercial sponsor pages in a new browser tab (`target="_blank"` with `rel="noopener noreferrer"`). Once you navigate to a third-party sponsor destination, that external site operates under its own privacy policy and cookie notices.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  4. Contact for Privacy Questions
                </h2>
                <p>
                  Questions regarding privacy practices or project status ({registration.registrationNumber}) may be directed online to{' '}
                  <a href={`mailto:${contact.email}`} className="text-[#0F3D3E] font-semibold underline">
                    {contact.email}
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>
        ) : (
          <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <header className="space-y-2 border-b border-slate-200 pb-6">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
                Legal Disclosure
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Terms of Use
              </h1>
              <p className="text-xs text-slate-500">
                Effective Year: {organization.copyrightYear} · {organization.name} ({organization.projectOf})
              </p>
            </header>

            <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-[70ch]">
              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  1. Scope &amp; Future Project Notice
                </h2>
                <p>
                  {organization.name} ({organization.projectOf}) provides this portal during its active online fund-collection stage ahead of establishing future ground operations in healthcare, education, and essential necessities. The organization currently maintains no physical office address.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  2. Genuine Human Participation
                </h2>
                <p>
                  Visitors must not use automated bots, click scripts, or deceptive traffic tools on sponsor links. Automated activity violates external sponsor terms and can jeopardize reserve contributions.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  3. External Links &amp; Accuracy Notice
                </h2>
                <p>
                  Program outlines and allocation ratios represent our current pre-launch plan and will be updated with verified field records as ground operations open. External websites linked via sponsor buttons are operated independently.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  4. Copyright &amp; Attribution
                </h2>
                <p>
                  &copy; {organization.copyrightYear} {organization.name}. {organization.projectOf}. All rights reserved. For permission requests or official digital correspondence, contact {contact.email}.
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
