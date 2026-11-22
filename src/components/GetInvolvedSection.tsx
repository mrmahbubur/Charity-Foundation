import React, { useState } from 'react';
import { Heart, Users, Handshake, Share2, Check, ArrowRight, Send } from 'lucide-react';
import { openNextSponsorLink } from '../services/adDonateService';

interface GetInvolvedSectionProps {
  onOpenDonatePage: () => void;
  onJumpToContact: () => void;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  onOpenDonatePage,
  onJumpToContact,
}) => {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerRegion, setVolunteerRegion] = useState('');
  const [volunteerFocus, setVolunteerFocus] = useState('Education & Reading Support');
  const [volunteerRegistered, setVolunteerRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName.trim()) return;
    setVolunteerRegistered(true);
  };

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <section id="get-involved" className="py-16 lg:py-24 bg-[#FAFAF8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
            Get Involved
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
            Four Meaningful Ways You Can Help Today
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-[65ch]">
            Every form of participation—whether contributing free sponsor clicks, volunteering your time, partnering as an organization, or sharing our mission—helps build long-term community capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Donate / Support Free */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Give at Zero Cost
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Open a verified sponsor partner link in one click so sponsors contribute on your behalf—no money needed.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => openNextSponsorLink('get-involved')}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Support Now (Free)
              </button>
              <button
                type="button"
                onClick={onOpenDonatePage}
                className="w-full text-xs font-semibold text-[#0F3D3E] hover:underline py-1 cursor-pointer"
              >
                How giving works &rarr;
              </button>
            </div>
          </div>

          {/* 2. Volunteer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Volunteer Network
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Express interest in upcoming local field coordination, student mentoring, or community outreach.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setVolunteerRegistered(false);
                setShowVolunteerForm((prev) => !prev);
              }}
              className="w-full border border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {showVolunteerForm ? 'Hide Form' : 'Join Volunteer List'}
            </button>
          </div>

          {/* 3. Partner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Partner With Us
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ethical sponsors, educators, and community organizers can collaborate cleanly on upcoming field initiatives.
              </p>
            </div>
            <button
              type="button"
              onClick={onJumpToContact}
              className="w-full border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <span>Discuss Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Spread the Word */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Spread the Word
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Invite classmates, colleagues, or family to participate in free daily sponsor-backed giving.
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareCopy}
              className="w-full border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#0F3D3E]" />
                  <span>Portal Link Copied</span>
                </>
              ) : (
                <span>Copy Portal Link</span>
              )}
            </button>
          </div>
        </div>

        {/* Inline Accessible Volunteer Interest Panel */}
        {showVolunteerForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl">
            {volunteerRegistered ? (
              <div className="space-y-3">
                <h4 className="font-serif text-xl font-bold text-[#0F3D3E]">
                  Volunteer Interest Recorded
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Thank you, <strong>{volunteerName}</strong>. Your interest in{' '}
                  <strong>{volunteerFocus}</strong> has been noted for our upcoming community mobilization updates.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setVolunteerName('');
                    setVolunteerRegion('');
                    setVolunteerRegistered(false);
                  }}
                  className="text-xs font-semibold text-[#0F3D3E] hover:underline cursor-pointer"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-slate-900">
                    Volunteer Interest Registration
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide your display name and preferred focus area. Reach out via our Contact form anytime for direct follow-up.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gi-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name / Display Name *
                    </label>
                    <input
                      id="gi-name"
                      type="text"
                      required
                      value={volunteerName}
                      onChange={(e) => setVolunteerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="gi-region" className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Country
                    </label>
                    <input
                      id="gi-region"
                      type="text"
                      value={volunteerRegion}
                      onChange={(e) => setVolunteerRegion(e.target.value)}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gi-focus" className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Contribution Area
                  </label>
                  <select
                    id="gi-focus"
                    value={volunteerFocus}
                    onChange={(e) => setVolunteerFocus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Education & Reading Support">Education &amp; Reading Support</option>
                    <option value="Primary Healthcare Outreach">Primary Healthcare Outreach</option>
                    <option value="Essential Food & Water Distribution">Essential Food &amp; Water Distribution</option>
                    <option value="Community Awareness & Digital Advocacy">Community Awareness &amp; Digital Advocacy</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#0F3D3E] hover:bg-[#0A2C2D] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Volunteer Interest</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
