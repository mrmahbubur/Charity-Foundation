import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>(SITE_CONFIG.faqs[0]?.id || 'faq-1');

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
            Frequently Asked Questions
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
            Clear Answers About Our Mission &amp; Giving Model
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch] mx-auto">
            Plain-language explanations covering how zero-cost support works, fund allocation, registration records, and how to participate.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
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
                  <span className="font-serif text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0F3D3E] transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0F3D3E]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className="pb-5 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed max-w-[70ch]"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
