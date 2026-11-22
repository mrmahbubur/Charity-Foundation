import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../../site.config';

interface NotFoundPageProps {
  onBackHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackHome }) => {
  return (
    <div className="bg-canvas min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-surface rounded-xl border border-slate-200 p-8 text-center shadow-sm space-y-5">
        <img
          src={SITE_CONFIG.organization.logoPath}
          alt={`${SITE_CONFIG.organization.name} Logo`}
          className="h-14 w-14 object-contain mx-auto"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            Error 404
          </p>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            The page or section you requested could not be found. Return to the {SITE_CONFIG.organization.name} homepage to continue exploring.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
