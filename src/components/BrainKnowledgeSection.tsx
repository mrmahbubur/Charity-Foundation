import React, { useState } from 'react';
import { useBackendSync } from '../context/BackendSyncContext';
import { openNextSponsorLink } from '../services/adDonateService';
import {
  BookOpen,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Heart,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrainKnowledgeSection: React.FC = () => {
  const { content } = useBackendSync();
  const kb = content.knowledgeBase;
  const activeFaqs = (kb?.faqs || []).filter((f) => f.active);

  const [openFaqId, setOpenFaqId] = useState<string>(activeFaqs[0]?.id || 'faq-1');
  const [clickedFaqId, setClickedFaqId] = useState<string | null>(null);

  const handleFaqDonate = (faqId: string) => {
    openNextSponsorLink('knowledge-faq');
    setClickedFaqId(faqId);
    setTimeout(() => setClickedFaqId(null), 3500);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section id="knowledge" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Foundation Knowledge &amp; How It Works</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Everything You Should Know About Our Online Phase
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Clear answers about how M R S Charity Foundation collects community funds online at zero cost to you before launching our full-scale ground project.
          </p>
        </div>

        {/* 3 Credibility & Knowledge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Current Online Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kb?.missionBrief}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              How Your Click Helps ($0 Cost)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kb?.howItWorksSummary}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Transparent Fund Reserve
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kb?.transparencyNote}
            </p>
          </div>
        </div>

        {/* Interactive FAQ Accordion with Embedded 1-Click Support */}
        <div className="max-w-4xl mx-auto space-y-3">
          {activeFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen ? 'border-emerald-500/60 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </h4>
                  </div>
                  <span className="p-1.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => handleFaqDonate(faq.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm hover:shadow cursor-pointer inline-flex items-center gap-2"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>{faq.ctaText || 'Support Free in 1-Click'}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                      </button>

                      {clickedFaqId === faq.id && (
                        <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Free sponsor support credited!</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Action Callout */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <BookOpen className="w-4 h-4" />
              <span>Ready to Help Right Now?</span>
            </div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl">
              Every Free Click Moves Our Future Ground Project Closer
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              You never spend your own money. Open a sponsor link in one click and help feed a child today.
            </p>
          </div>
          <button
            onClick={() => openNextSponsorLink('knowledge-banner')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>1-Click Free Support</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
