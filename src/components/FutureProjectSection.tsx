import React from 'react';
import { FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { useBackendSync } from '../context/BackendSyncContext';
import {
  Compass,
  Heart,
  ExternalLink,
  BookOpen,
  Utensils,
  Droplets,
  Scissors,
  Home,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FutureProjectSectionProps {
  onOpenDonate?: () => void;
}

export const FutureProjectSection: React.FC<FutureProjectSectionProps> = ({ onOpenDonate }) => {
  const { content } = useBackendSync();
  const info = content.foundationInfo;
  const activeLogo = info.logo === '/logo.png' ? './logo.png' : (info.logo || './logo.png');
  const goalIcons = [
    BookOpen,
    Utensils,
    Droplets,
    Scissors,
    Home,
    ShieldCheck,
  ];

  const handleSupportFutureProject = (e: React.MouseEvent) => {
    e.preventDefault();
    openNextSponsorLink('future-project');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
    if (onOpenDonate) onOpenDonate();
  };

  return (
    <section id="future-project" className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Official Logo */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center">
              <img
                src={activeLogo}
                alt="MRS Charity Foundation Logo"
                className="max-h-full max-w-full object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official Mission &amp; Goals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            The Mission of {info.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-amber-700">
            <span className="bg-amber-100 px-2.5 py-0.5 rounded-full">{info.parentOrg}</span>
            <span>·</span>
            <span>"{info.motto}"</span>
            <span>·</span>
            <span>"{info.secondaryMotto}"</span>
          </div>

          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {info.name} is currently an <strong>online-based humanitarian initiative</strong> actively collecting funds and rallying community support. A <strong>major flagship ground project</strong> is coming from M R S to establish permanent rural schools, clean water wells, and hunger relief centers. You can empower this vision today with <strong>zero money required</strong> — simply click below to generate verified sponsor contributions!
          </p>
        </div>

        {/* 6 Core Goals Grid from the Post */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FOUNDATION_INFO.coreGoals.map((g, idx) => {
            const Icon = goalIcons[idx] || HeartHandshake;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      GOAL #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {g.goal}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {g.detail}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <button
                    onClick={handleSupportFutureProject}
                    className="w-full bg-slate-900 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Click to Fund This Goal (Free)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Project Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Upcoming Humanitarian Initiative</span>
            </div>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
              Support the Future Project of M R S
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Every single click on our free support buttons opens a sponsor link in a new tab, generating partner funding that goes directly into fulfilling these 6 foundational goals.
            </p>
          </div>

          <button
            onClick={handleSupportFutureProject}
            className="w-full md:w-auto justify-center text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 sm:whitespace-nowrap shrink-0 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>Click to Donate (100% Free · No Money Needed)</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
