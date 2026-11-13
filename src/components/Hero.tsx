import React, { useState } from 'react';
import { HERO_IMAGE } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { useBackendSync } from '../context/BackendSyncContext';
import { Heart, BookOpen, ShieldCheck, ExternalLink, GraduationCap, Stethoscope, Gift, AlertTriangle, Zap, CheckCircle2, Target, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroProps {
  onOpenDonate: () => void;
  onSelectSponsor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDonate, onSelectSponsor }) => {
  const { content } = useBackendSync();
  const [clickFeedback, setClickFeedback] = useState<string | null>(null);

  const handleFreeDonateClick = (source = 'hero-cta') => {
    const res = openNextSponsorLink(source);
    setClickFeedback(`Thank you! Partner link #${res.linkNumber} opened — 1 free credit unlocked. Click again anytime for another link!`);
    setTimeout(() => setClickFeedback(null), 4500);
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.3 },
      });
    } catch {
      // safe fallback
    }
    onOpenDonate();
  };

  const activeLogo = content.foundationInfo.logo === '/logo.png' ? './logo.png' : (content.foundationInfo.logo || './logo.png');
  const parentOrg = content.foundationInfo.parentOrg || 'A Future Project of M R S';
  const motto = content.foundationInfo.motto || 'Poverty Ends With Us';
  const secondaryMotto = content.foundationInfo.secondaryMotto || 'Humanity United Against Poverty';
  const totalSupporters = content.donationStats.totalSupporters || 18450;
  const urgent = content.urgentNotice;
  const brain = content.brainEngine;

  const dailyGoal = Math.max(1, brain?.dailyGoalClicks || 500);
  const todayClicks = brain?.todayClicks || 427;
  const remaining = Math.max(1, dailyGoal - todayClicks);
  const progressPercent = Math.min(99, Math.max(8, Math.round((todayClicks / dailyGoal) * 100)));
  const dynamicHeadline = (brain?.activeHeadline || 'Only {remaining} Free Clicks Left to Complete Today’s Rural Aid Goal')
    .replace('{remaining}', remaining.toLocaleString());
  const latestActivity = brain?.activityStream && brain.activityStream.length > 0 ? brain.activityStream[0] : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Urgent Crisis Response Banner */}
        {urgent && urgent.enabled && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40 rounded-xl p-3 sm:p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-amber-300 text-xs uppercase tracking-wider">{urgent.badge}</span>
                  <span className="text-slate-300 text-xs hidden sm:inline">· Active Community Appeal</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{urgent.headline}</div>
                <p className="text-xs text-slate-300">{urgent.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleFreeDonateClick('urgent-banner')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{urgent.ctaText || 'Provide Free Relief'}</span>
            </button>
          </div>
        )}

        {/* Split Hero: 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Column 1: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 space-y-5">
            {/* Prominent Official Organization Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white p-2 rounded-2xl shadow-xl shadow-emerald-950/40 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <img
                  src={activeLogo}
                  alt="Official MRS Charity Foundation Logo"
                  className="max-h-full max-w-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-sm border border-emerald-800/80 rounded-full py-1 px-3 text-xs font-bold text-amber-300 shadow-sm">
                  <span className="text-amber-400 font-semibold">{parentOrg}</span>
                  <span className="text-emerald-500" aria-hidden="true">·</span>
                  <span className="text-white">{motto}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-300">
                  Online Fund-Collection Phase · "{secondaryMotto}"
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Transforming Lives Through Education, Healthcare &amp; Essential Necessities
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              M R S Charity Foundation is currently an active <strong>online-based initiative</strong> collecting preliminary funds for an upcoming major humanitarian <strong>ground project of M R S</strong>. Every 1-click visit opens a verified sponsor partner at <strong>100% zero cost</strong> to you.
            </p>

            {/* Live Community Goal Milestone Card */}
            {brain?.enabled && (
              <div className="bg-slate-800/75 border border-emerald-500/35 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Today’s Community Aid Batch</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-300 tabular-nums">
                    {todayClicks.toLocaleString()} / {dailyGoal.toLocaleString()} Free Clicks ({progressPercent}%)
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-3 bg-slate-950/90 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-sm sm:text-base font-extrabold text-white">
                    {dynamicHeadline}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {brain.activeSubtext}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => handleFreeDonateClick('hero-milestone')}
                    className="w-full sm:w-auto justify-center text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-4 sm:px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-xs sm:text-sm sm:whitespace-nowrap"
                  >
                    <Heart className="w-4 h-4 fill-slate-950 shrink-0" />
                    <span>{brain.activeCtaLabel || 'Unlock Free Meal & Study Aid (1-Click)'}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </button>

                  {latestActivity && (
                    <div className="w-full sm:w-auto flex items-center gap-2 text-[11px] text-emerald-200 bg-emerald-950/70 px-3 py-1.5 rounded-lg border border-emerald-700/40 min-w-0">
                      <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                      <span className="truncate">
                        <strong className="text-amber-300">{latestActivity.location}:</strong> {latestActivity.actionText}
                      </span>
                    </div>
                  )}
                </div>

                {clickFeedback && (
                  <div className="bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{clickFeedback}</span>
                  </div>
                )}
              </div>
            )}

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => handleFreeDonateClick('hero-primary')}
                className="w-full sm:w-auto justify-center text-center bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 sm:px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-700/25 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-sm sm:text-base sm:whitespace-nowrap group"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
                <span>Click to Donate (100% Free · No Money Needed)</span>
                <ExternalLink className="w-4 h-4 text-emerald-200 shrink-0" />
              </button>

              <button
                onClick={() => onSelectSponsor()}
                className="w-full sm:w-auto justify-center text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-sm sm:text-base sm:whitespace-nowrap"
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Sponsor a Student (Free Clicks)</span>
              </button>
            </div>

            {/* Trust Highlights - Zero Fake Contact Info */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Free Quality Education</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Healthcare &amp; Clean Water</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Essential Food &amp; Relief</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Cash or Card Needed</span>
              </div>
            </div>
          </div>

          {/* Column 2: Visual Card with Authentic Humanitarian Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={HERO_IMAGE}
                alt="Children in community learning center supported by M R S Charity Foundation"
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* In-photo Badge Overlay without personal names */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-slate-200">
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-amber-400 font-bold mb-1">
                  <span>M R S Community Learning Initiative</span>
                  <span className="shrink-0">Donamba · Uganda</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  "Offering education, nutrition, and essential necessities to empower children and break the generational cycle of poverty."
                </p>
                <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                  Motto: "Poverty Ends With Us"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Full-Width KPI strip below Hero Split with Live Supporters Counter */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
          {/* Real-time Supporter KPI */}
          <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-emerald-500/30">
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 tabular-nums flex items-center justify-center gap-1.5">
              <span>{totalSupporters.toLocaleString()}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-sm font-semibold text-emerald-300">Live Supporters</div>
            <div className="text-xs text-slate-400">Updates live on every click</div>
          </div>

          <div className="space-y-1 p-3">
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 tabular-nums">
              4,850+
            </div>
            <div className="text-sm font-semibold text-slate-200">Children Educated Daily</div>
            <div className="text-xs text-slate-400">Community learning centers</div>
          </div>

          <div className="space-y-1 p-3">
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 tabular-nums">
              85,000+
            </div>
            <div className="text-sm font-semibold text-slate-200">Families Assisted</div>
            <div className="text-xs text-slate-400">Healthcare, food &amp; relief</div>
          </div>

          <div className="space-y-1 p-3">
            <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-400 tabular-nums">
              340+
            </div>
            <div className="text-sm font-semibold text-slate-200">Clean Water Wells</div>
            <div className="text-xs text-slate-400">Safe pure drinking access</div>
          </div>
        </div>
      </div>
    </section>
  );
};
