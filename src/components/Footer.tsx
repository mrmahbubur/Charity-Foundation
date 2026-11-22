import React from 'react';
import { Globe, Mail, Clock } from 'lucide-react';
import { SITE_CONFIG, NavItemConfig } from '../../site.config';
import { useBackendSync } from '../context/BackendSyncContext';
import { EditorialContainer } from './EditorialContainer';

interface FooterProps {
  onSelectNavItem: (item: NavItemConfig) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectNavItem }) => {
  const { content } = useBackendSync();
  const activeLogo =
    content.foundationInfo.logo === '/logo.png'
      ? SITE_CONFIG.organization.logoPath
      : content.foundationInfo.logo || SITE_CONFIG.organization.logoPath;
  const { organization, registration, contact, socialLinks, footerLinks, legalLinks } =
    SITE_CONFIG;
  const activeSocials = socialLinks.filter(
    (s) => s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))
  );

  return (
    <footer className="bg-primary text-on-primary-soft border-t border-primary-dark">
      <EditorialContainer className="pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-on-primary/15">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={activeLogo}
                alt={`${organization.name} Logo`}
                className="h-11 w-11 object-contain bg-surface rounded-control p-1 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-serif text-lg font-bold text-surface leading-tight">
                  {organization.name}
                </div>
                <div className="text-xs text-accent-highlight font-medium">
                  {organization.projectOf} · {organization.tagline}
                </div>
              </div>
            </div>

            <p className="text-sm text-on-primary-muted leading-relaxed max-w-[42ch]">
              {organization.heroMission}
            </p>

            {activeSocials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-control bg-surface/10 hover:bg-surface/20 text-xs text-on-primary transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-accent-highlight" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm font-bold text-surface uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-on-primary-muted">
              {footerLinks.map((item) => (
                <li key={`${item.target}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => onSelectNavItem(item)}
                    className={`hover:text-surface transition-colors cursor-pointer ${
                      item.highlight ? 'text-accent-highlight font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-serif text-sm font-bold text-surface uppercase tracking-wider">
              Project Status &amp; Online Presence
            </h3>

            <div className="bg-surface/5 border border-on-primary/15 rounded-card p-4 space-y-2.5 text-xs sm:text-sm text-on-primary-soft">
              <div>
                <span className="text-on-primary-subtle">Status:</span>{' '}
                <strong className="text-surface">{registration.entityStatus}</strong>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-accent-highlight shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-highlight shrink-0" />
                <span>{contact.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-highlight shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-primary-muted">
          <div>
            &copy; {organization.copyrightYear} {organization.name}. {organization.projectOf}.
          </div>
          <div className="flex items-center gap-6">
            {legalLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNavItem(item)}
                className="hover:text-surface underline-offset-4 hover:underline cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </EditorialContainer>
    </footer>
  );
};
