import React from 'react';
import { Globe, Mail, Clock } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';
import { AppPageRoute } from './Navbar';
import { useBackendSync } from '../context/BackendSyncContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onNavigatePage: (page: AppPageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onNavigatePage,
}) => {
  const { content } = useBackendSync();
  const activeLogo =
    content.foundationInfo.logo === '/logo.png'
      ? './logo.png'
      : content.foundationInfo.logo || SITE_CONFIG.organization.logoPath;
  const { organization, registration, contact, socialLinks } = SITE_CONFIG;
  const activeSocials = socialLinks.filter(
    (s) => s.url && (s.url.startsWith('http://') || s.url.startsWith('https://'))
  );

  return (
    <footer className="bg-[#0F3D3E] text-slate-200 border-t border-[#0A2C2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Column 1: Brand & Short Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={activeLogo}
                alt={`${organization.name} Logo`}
                className="h-11 w-11 object-contain bg-white rounded-lg p-1 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-serif text-lg font-bold text-white leading-tight">
                  {organization.name}
                </div>
                <div className="text-xs text-amber-300 font-medium">
                  {organization.projectOf} · {organization.tagline}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-[42ch]">
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
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs text-slate-100 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-300" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('our-work')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Planned Programs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('transparency')}
                  className="hover:text-white text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  Full Transparency Report
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('donate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How Free Giving Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Honest Status & Online Contact */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Project Status &amp; Online Presence
            </h3>

            <div className="bg-white/5 border border-white/15 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm text-slate-200">
              <div>
                <span className="text-slate-400">Status:</span>{' '}
                <strong className="text-white">{registration.entityStatus}</strong>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{contact.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div>
            &copy; {organization.copyrightYear} {organization.name}. {organization.projectOf}.
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigatePage('privacy')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('terms')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
