import React from 'react';
import { SITE_CONFIG } from '../../site.config';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center bg-canvas text-ink p-6 text-center"
        >
          <div className="max-w-md bg-surface border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
            <img
              src={SITE_CONFIG.organization.logoPath}
              alt={`${SITE_CONFIG.organization.name} Logo`}
              className="h-12 w-12 object-contain mx-auto"
            />
            <h1 className="font-serif text-xl font-bold text-slate-900">
              {SITE_CONFIG.organization.name}
            </h1>
            <p className="text-sm text-ink-muted leading-relaxed">
              Something interrupted rendering this view. Please reload the page to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold cursor-pointer transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
