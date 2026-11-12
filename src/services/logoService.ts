import { useState, useEffect } from 'react';
import { SITE_LOGO } from '../data/charityData';

const STORAGE_KEY = 'mrs_charity_site_logo';
const LOGO_EVENT = 'mrs_charity_logo_change';

export function getActiveLogo(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return SITE_LOGO;
}

export function setActiveLogo(newLogoDataUrl: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, newLogoDataUrl);
    window.dispatchEvent(new CustomEvent(LOGO_EVENT, { detail: newLogoDataUrl }));
  } catch (e) {
    console.error('Failed to save logo to localStorage', e);
  }
}

export function resetActiveLogo(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(LOGO_EVENT, { detail: SITE_LOGO }));
  } catch (e) {
    // Ignore
  }
}

export function useSiteLogo(): { logo: string; updateLogo: (url: string) => void; resetLogo: () => void } {
  const [logo, setLogo] = useState<string>(getActiveLogo());

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setLogo(customEvent.detail || getActiveLogo());
    };

    window.addEventListener(LOGO_EVENT, handler);
    return () => window.removeEventListener(LOGO_EVENT, handler);
  }, []);

  return {
    logo,
    updateLogo: setActiveLogo,
    resetLogo: resetActiveLogo,
  };
}
