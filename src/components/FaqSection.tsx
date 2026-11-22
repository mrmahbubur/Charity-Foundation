import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from './EditorialContainer';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>(SITE_CONFIG.faqs[0]?.id || 'faq-1');

  return (
    <section id="faq" className="section-editorial bg-surface border-b border-border">
      <EditorialContainer size="narrow" className="space-y-10">
        <div className="space-y-3 text-center">
          <p className="eyebrow-heading">Frequently Asked Questions</p>
          <h2 className="section-title">
            Clear Answers About Our Mission &amp; Giving Model
          </h2>
          <p className="text-base text-ink-muted leading-relaxed max-w-[65ch] mx-auto">
            Plain-language explanations covering how zero-cost support works, fund allocation, project stage, and how to participate.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {SITE_CONFIG.faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            return (
              <div key={faq.id} className="py-1">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full py-5 text-left flex items-center justify-between gap-6 cursor-pointer group"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-heading group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-ink-subtle shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className="pb-5 pr-8 text-sm sm:text-base text-ink-muted leading-relaxed max-w-[70ch] animate-fadeIn"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </EditorialContainer>
    </section>
  );
};
