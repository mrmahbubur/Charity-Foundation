import React, { useState } from 'react';
import { CHILDREN_PROFILES, FOUNDATION_INFO } from '../data/charityData';
import { ChildProfile } from '../types';
import { openNextSponsorLink } from '../services/adDonateService';
import { Heart, BookOpen, MapPin, GraduationCap, ExternalLink, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsorChildSectionProps {
  onSelectChild: (child: ChildProfile) => void;
}

export const SponsorChildSection: React.FC<SponsorChildSectionProps> = ({ onSelectChild }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  const districts = ['All', 'Donamba', 'Uganda', 'Sarvodaya', 'Reading Time', 'Bangladesh'];

  const filteredChildren = CHILDREN_PROFILES.filter((child) => {
    const matchesDistrict = selectedDistrict === 'All' || child.district.includes(selectedDistrict);
    const matchesGender = selectedGender === 'All' || child.gender === selectedGender;
    return matchesDistrict && matchesGender;
  });

  const handleSponsorClick = (child: ChildProfile) => {
    openNextSponsorLink();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // safe fallback
    }
    onSelectChild(child);
  };

  return (
    <section id="sponsor" className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-700">
            {FOUNDATION_INFO.secondaryMotto}
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Sponsor a Student's Future (100% Free via Clicks)
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            No money required from your wallet. Simply select a student scholar below and click <strong>"Free Sponsor"</strong>. Each click opens a sponsor partner in a new tab, funding their daily education, textbooks, and nutrition!
          </p>
        </div>

        {/* What Sponsorship Covers - 4 Column Feature Box */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mb-12 shadow-sm">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <span>How Your Free Ad Clicks Fund Student Welfare</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-sm">
                1
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Free Quality Schooling</div>
                <div className="text-xs text-slate-600 mt-1">
                  Tuition, trained teachers, and digital English-Bengali classroom curriculum.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
                2
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Daily Midday Meal</div>
                <div className="text-xs text-slate-600 mt-1">
                  Freshly prepared hot lunches, milk, and seasonal fruits to combat malnutrition.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-sm">
                3
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Books &amp; Stationery</div>
                <div className="text-xs text-slate-600 mt-1">
                  Free textbooks, exercise books, pencils, and seasonal school supplies.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-sm">
                4
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Healthcare &amp; Hygiene</div>
                <div className="text-xs text-slate-600 mt-1">
                  Pediatric checkups, clean drinking water access, and hygiene kits.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Chapter:
            </span>
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedDistrict === district
                    ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-700 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {district}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Category:
            </span>
            <div className="flex items-center p-1 bg-white border border-stone-200 rounded-lg text-xs font-medium">
              {['All', 'Female', 'Male'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedGender === gender ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Location & Urgent tag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{child.district}</span>
                  </div>
                  <div className="bg-amber-600 text-white font-semibold px-2 py-0.5 rounded text-[11px] shadow">
                    Free Sponsor
                  </div>
                </div>

                {/* Child Name & Dream overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-display font-bold text-xl leading-tight">{child.name}</h4>
                  <div className="text-xs text-emerald-300 font-medium mt-0.5">
                    Aspires to be a {child.dream}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-stone-100 pb-2">
                    <span>Age: <strong>{child.age} Years</strong></span>
                    <span>·</span>
                    <span>Class: <strong>{child.grade}</strong></span>
                    <span>·</span>
                    <span>Center: <strong>{child.schoolName}</strong></span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {child.story}
                  </p>

                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Interests:</span> {child.hobbies.join(', ')}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500">Zero-Cost Sponsorship</div>
                    <div className="font-display font-extrabold text-emerald-700 text-sm">
                      100% Free via Clicks
                    </div>
                  </div>

                  <button
                    onClick={() => handleSponsorClick(child)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 group"
                  >
                    <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                    <span>Free Sponsor (Click)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
