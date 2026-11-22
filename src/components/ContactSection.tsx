import React, { useState } from 'react';
import { Mail, Globe, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { EditorialContainer } from './EditorialContainer';

export const ContactSection: React.FC = () => {
  const { contact, socialLinks, organization } = SITE_CONFIG;
  const activeSocials = socialLinks.filter(
    (s) => s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(contact.inquiryTopics[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const mailtoHref = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(
    `[${organization.name}] ${topic}`
  )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

  return (
    <section id="contact" className="section-editorial bg-canvas border-b border-border">
      <EditorialContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <p className="eyebrow-heading">Contact Us</p>
              <h2 className="section-title">
                Get in Touch With {organization.shortName}
              </h2>
              <p className="text-base text-ink-muted leading-relaxed max-w-[60ch]">
                Have questions about our online fund-collection phase, free ad-sponsored giving, or partnership ahead of launch? Reach out online anytime.
              </p>
            </div>

            <div className="editorial-card p-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-heading">Official Digital Email</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-heading">{contact.addressLabel}</div>
                  <div className="text-ink-muted leading-relaxed">{contact.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-heading">Availability</div>
                  <div className="text-ink-muted">{contact.operatingHours}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2">
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
                        className="px-3 py-1.5 rounded-control border border-border text-xs font-medium text-ink hover:border-primary hover:text-primary transition-colors"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Official correspondence is handled via this web portal and email during Phase 1 online fund collection.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 editorial-card p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 space-y-5 animate-fadeIn">
                <div className="w-12 h-12 rounded-card bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-heading">
                    Inquiry Ready to Send
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-[60ch]">
                    Thank you, <strong>{name}</strong>. Use the direct button below to dispatch your prepared message via your email client.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a href={mailtoHref} className="btn-primary text-sm px-5 py-2.5">
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
                    className="text-sm font-semibold text-ink-muted hover:text-heading cursor-pointer"
                  >
                    Write Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-heading">
                    Send an Online Inquiry
                  </h3>
                  <p className="text-xs text-ink-subtle mt-1">
                    All fields marked with * are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-ink mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-ink mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.org"
                      className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold text-ink mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface"
                  >
                    {contact.inquiryTopics.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-ink mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your inquiry or partnership note..."
                    className="w-full px-3.5 py-2.5 rounded-control border border-border-strong text-sm bg-surface resize-y"
                  />
                </div>

                <button type="submit" className="btn-accent text-sm px-6 py-3">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </EditorialContainer>
    </section>
  );
};
