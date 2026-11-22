import React, { useState } from 'react';
import { Heart, Users, Handshake, Share2, Check, ArrowRight, Send } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { openNextSponsorLink } from '../services/adDonateService';

interface GetInvolvedSectionProps {
  onOpenDonatePage: () => void;
  onJumpToContact: () => void;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  onOpenDonatePage,
  onJumpToContact,
}) => {
  const focusAreas = SITE_CONFIG.getInvolved.volunteerFocusAreas;
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerRegion, setVolunteerRegion] = useState('');
  const [volunteerFocus, setVolunteerFocus] = useState(focusAreas[0]);
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
    } catch {
      // clipboard fallback
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <section id="get-involved" className="py-16 lg:py-24 bg-canvas border-b border-border">
      <div className="container-editorial space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="eyebrow-heading">Get Involved</p>
          <h2 className="section-title">Four Meaningful Ways You Can Help Today</h2>
          <p className="text-base text-ink-muted leading-relaxed max-w-[65ch]">
            Every form of participation—whether contributing free sponsor clicks, volunteering your time, partnering as an organization, or sharing our mission—helps build long-term community capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-accent-tint text-accent flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-heading">
                Give at Zero Cost
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Open a verified sponsor partner link in one click so sponsors contribute on your behalf—no money needed.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => openNextSponsorLink('get-involved')}
                className="btn-accent w-full text-sm px-4 py-2.5"
              >
                Support Now (Free)
              </button>
              <button
                type="button"
                onClick={onOpenDonatePage}
                className="w-full text-xs font-semibold text-primary hover:underline py-1 cursor-pointer"
              >
                How giving works &rarr;
              </button>
            </div>
          </div>

          <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-heading">
                Volunteer Network
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Express interest in upcoming local field coordination, student mentoring, or community outreach.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setVolunteerRegistered(false);
                setShowVolunteerForm((prev) => !prev);
              }}
              className="w-full border border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm px-4 py-2.5 rounded-control transition-colors cursor-pointer"
            >
              {showVolunteerForm ? 'Hide Form' : 'Join Volunteer List'}
            </button>
          </div>

          <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-heading">
                Partner With Us
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Ethical sponsors, educators, and community organizers can collaborate cleanly on upcoming field initiatives.
              </p>
            </div>
            <button
              type="button"
              onClick={onJumpToContact}
              className="w-full border border-border-strong text-ink hover:bg-surface-subtle font-semibold text-sm px-4 py-2.5 rounded-control transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <span>Discuss Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-heading">
                Spread the Word
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Invite classmates, colleagues, or family to participate in free daily sponsor-backed giving.
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareCopy}
              className="w-full border border-border-strong text-ink hover:bg-surface-subtle font-semibold text-sm px-4 py-2.5 rounded-control transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-primary" />
                  <span>Portal Link Copied</span>
                </>
              ) : (
                <span>Copy Portal Link</span>
              )}
            </button>
          </div>
        </div>

        {showVolunteerForm && (
          <div className="editorial-card p-6 sm:p-8 max-w-2xl animate-fadeIn">
            {volunteerRegistered ? (
              <div className="space-y-3">
                <h4 className="font-serif text-xl font-bold text-primary">
                  Volunteer Interest Recorded
                </h4>
                <p className="text-sm text-ink-muted leading-relaxed">
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
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-heading">
                    Volunteer Interest Registration
                  </h4>
                  <p className="text-xs text-ink-subtle mt-1">
                    Provide your display name and preferred focus area ahead of future launch coordination.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gi-name" className="block text-xs font-semibold text-ink mb-1">
                      Full Name / Display Name *
                    </label>
                    <input
                      id="gi-name"
                      type="text"
                      required
                      value={volunteerName}
                      onChange={(e) => setVolunteerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                    />
                  </div>
                  <div>
                    <label htmlFor="gi-region" className="block text-xs font-semibold text-ink mb-1">
                      City / Country
                    </label>
                    <input
                      id="gi-region"
                      type="text"
                      value={volunteerRegion}
                      onChange={(e) => setVolunteerRegion(e.target.value)}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gi-focus" className="block text-xs font-semibold text-ink mb-1">
                    Preferred Contribution Area
                  </label>
                  <select
                    id="gi-focus"
                    value={volunteerFocus}
                    onChange={(e) => setVolunteerFocus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                  >
                    {focusAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary text-sm px-5 py-2.5">
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
