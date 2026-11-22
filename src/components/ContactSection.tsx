import React, { useState } from 'react';
import { Mail, Globe, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

export const ContactSection: React.FC = () => {
  const { contact, socialLinks, organization } = SITE_CONFIG;
  const activeSocials = socialLinks.filter(
    (s) => s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const mailtoHref = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(
    `[M R S Charity Foundation] ${topic}`
  )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#FAFAF8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Digital Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#0F3D3E]">
                Contact Us
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight text-balance">
                Get in Touch With {organization.shortName}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-[60ch]">
                Have questions about our online fund-collection phase, free ad-sponsored giving, or partnership ahead of launch? Reach out online anytime.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0F3D3E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Official Digital Email</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#0F3D3E] hover:underline break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#0F3D3E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">{contact.addressLabel}</div>
                  <div className="text-slate-600 leading-relaxed">{contact.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#0F3D3E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Availability</div>
                  <div className="text-slate-600">{contact.operatingHours}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Digital Presence
                </div>
                {activeSocials.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {activeSocials.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#0F3D3E] hover:text-[#0F3D3E] transition-colors"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official correspondence is handled via this web portal and email during Phase 1 online fund collection.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Accessible Working Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="py-8 space-y-5">
                <div className="w-12 h-12 rounded-xl bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Inquiry Ready to Send
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[60ch]">
                    Thank you, <strong>{name}</strong>. Use the direct button below to dispatch your prepared message via your email client.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 bg-[#0F3D3E] hover:bg-[#0A2C2D] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setMessage('');
                      setSubmitted(false);
                    }}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Write Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Send an Online Inquiry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All fields marked with * are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.org"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Organizational Partnership">Organizational Partnership</option>
                    <option value="Sponsor Collaboration">Sponsor Collaboration</option>
                    <option value="Volunteer Coordination">Volunteer Coordination</option>
                    <option value="Transparency & Future Launch Question">Transparency &amp; Future Launch Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your inquiry or partnership note..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
