import React, { useState } from 'react';
import { VOLUNTEER_RELIEF_IMAGE, FOUNDATION_INFO } from '../data/charityData';
import { openNextSponsorLink } from '../services/adDonateService';
import { Users, Heart, CheckCircle2, Shield, Sparkles, Send, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VolunteerSection: React.FC = () => {
  const [formData, setFormData] = useState({
    alias: '',
    chapter: 'Central Chapter',
    interestArea: 'Education & Child Mentoring',
    availability: 'Flexible / Online',
  });

  const [submitted, setSubmitted] = useState(false);
  const [volunteerId, setVolunteerId] = useState('');

  const chapters = [
    'Central Chapter', 'Eastern Chapter', 'Northern River Chapter',
    'Southern Coastal Chapter', 'Hill Tracts Chapter', 'Digital Ambassador'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alias) return;

    const generatedId = `MRS-VOL-${Math.floor(100000 + Math.random() * 900000)}`;
    setVolunteerId(generatedId);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleSupportClick = () => {
    openNextSponsorLink();
  };

  return (
    <section id="volunteer" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative & Visual Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-widest font-bold text-emerald-700">
              {FOUNDATION_INFO.secondaryMotto}
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
              Join the Movement Against Poverty
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              M R S Charity Foundation unites passionate youth and compassionate individuals across communities. Whether as a digital supporter clicking to donate or a local field volunteer, every effort counts.
            </p>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={VOLUNTEER_RELIEF_IMAGE}
                alt="Volunteers supporting M R S Charity Foundation initiatives"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-semibold text-amber-300">Community Action:</span> Over 16,200 volunteer network members across relief and teaching initiatives.
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero financial barrier — 100% voluntary humanitarian service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Engage in digital advocacy and community educational outreach</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct community support to eliminate child poverty</span>
              </div>
            </div>
          </div>

          {/* Registration Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-[#FCFCFA] p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-slate-900">
                      Welcome Volunteer Supporter!
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                      Your supporter enrollment for <strong>{formData.chapter}</strong> is confirmed.
                    </p>
                  </div>

                  {/* Generated Volunteer Badge */}
                  <div className="bg-white max-w-sm mx-auto p-6 rounded-2xl border-2 border-dashed border-emerald-500 shadow-sm text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase">Volunteer Pass</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{volunteerId}</span>
                    </div>
                    <div className="text-base font-bold text-slate-900">{formData.alias}</div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>Chapter: <strong>{formData.chapter}</strong></div>
                      <div>Pillar: <strong>{formData.interestArea}</strong></div>
                      <div>Motto: <strong>Poverty Ends With Us</strong></div>
                    </div>
                    <div className="pt-2 text-[11px] text-emerald-700 font-medium">
                      Status: Active Volunteer Supporter
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSupportClick}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Click to Free Donate for Your Chapter</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      Volunteer Supporter Enrollment
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Join our humanitarian network. No contact numbers or personal private information needed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Supporter Handle / Display Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VolunteerSupporter26"
                        value={formData.alias}
                        onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Regional Chapter *
                      </label>
                      <select
                        value={formData.chapter}
                        onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {chapters.map((ch) => (
                          <option key={ch} value={ch}>{ch}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Area of Interest
                    </label>
                    <select
                      value={formData.interestArea}
                      onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Education & Child Mentoring">Education &amp; Child Mentoring</option>
                      <option value="Healthcare & Clean Water">Healthcare &amp; Clean Water Support</option>
                      <option value="Essential Necessities & Food Relief">Essential Necessities &amp; Relief Distribution</option>
                      <option value="Digital Click-to-Donate Ambassador">Digital Click-to-Donate Ambassador</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Get Supporter Pass</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
