import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SiteContentState,
  INITIAL_SITE_STATE,
  fetchBackendContent,
  sendBackendContentUpdate,
  sendBackendLogoUpdate,
  triggerBackendManualTick,
  toggleBackendAutoConfig,
  resetBackendContentToDefaults
} from '../services/backendSyncService';
import { setActiveLogo } from '../services/logoService';

interface BackendSyncContextValue {
  content: SiteContentState;
  isConnected: boolean;
  version: number;
  lastSyncTime: string;
  updateContent: (updates: Partial<SiteContentState>) => Promise<boolean>;
  updateLogo: (logoDataUrl: string) => Promise<boolean>;
  triggerTick: () => Promise<boolean>;
  toggleAutoSystem: (enabled: boolean, intervalSec?: number) => Promise<boolean>;
  resetDefaults: () => Promise<boolean>;
  reconnect: () => void;
  recentNotification: string | null;
}

const BackendSyncContext = createContext<BackendSyncContextValue | undefined>(undefined);

export const BackendSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentState>(INITIAL_SITE_STATE);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const showNotification = (msg: string) => {
    setRecentNotification(msg);
    setTimeout(() => {
      setRecentNotification(null);
    }, 4000);
  };

  // Connect to SSE stream
  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = new EventSource('/api/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      es.addEventListener('init', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.content) {
            setContent(payload.content);
            if (payload.content.foundationInfo?.logo) {
              setActiveLogo(payload.content.foundationInfo.logo);
            }
          }
          setIsConnected(true);
        } catch (err) {
          console.error('SSE init error:', err);
        }
      });

      es.addEventListener('update', (e: MessageEvent) => {
        try {
          const message = JSON.parse(e.data);
          const { type, payload } = message;

          if (type === 'FULL_SYNC') {
            setContent(payload);
            if (payload.foundationInfo?.logo) {
              setActiveLogo(payload.foundationInfo.logo);
            }
          } else if (type === 'AUTO_TICK' || type === 'MANUAL_TRIGGER') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              lastUpdated: message.lastUpdated || new Date().toISOString(),
              donationStats: {
                ...prev.donationStats,
                ...(payload.donationStats || {})
              },
              automaticSystem: {
                ...prev.automaticSystem,
                ...(payload.automaticSystem || {})
              }
            }));
          } else if (type === 'LOGO_UPDATE') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              foundationInfo: {
                ...prev.foundationInfo,
                logo: payload.logo
              }
            }));
            setActiveLogo(payload.logo);
          } else if (type === 'ANNOUNCEMENTS_UPDATE') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              announcements: payload.announcements
            }));
          } else if (type === 'URGENT_NOTICE_UPDATE') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              urgentNotice: payload.urgentNotice
            }));
          } else if (type === 'AUTO_CONFIG_UPDATE') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              automaticSystem: payload
            }));
          }
        } catch (err) {
          console.error('Error handling SSE update:', err);
        }
      });

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        // Retry connection in 3s
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
        }, 3000);
      };
    } catch (err) {
      console.warn('SSE not available, falling back to polling:', err);
      setIsConnected(false);
    }
  }, []);

  // Initial load & fallback polling
  useEffect(() => {
    // 1. Initial REST fetch
    fetchBackendContent().then((data) => {
      if (data) {
        setContent(data);
        if (data.foundationInfo?.logo) {
          setActiveLogo(data.foundationInfo.logo);
        }
      }
    });

    // 2. Connect real-time SSE stream
    connectSSE();

    // 3. Fallback poll every 8 seconds if SSE is down
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchBackendContent().then((data) => {
          if (data) {
            setContent(data);
            setIsConnected(true);
          }
        });
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectSSE, isConnected]);

  const updateContent = async (updates: Partial<SiteContentState>): Promise<boolean> => {
    const res = await sendBackendContentUpdate(updates);
    if (res.success && res.data) {
      setContent(res.data);
      return true;
    }
    return false;
  };

  const updateLogo = async (logoDataUrl: string): Promise<boolean> => {
    const res = await sendBackendLogoUpdate(logoDataUrl);
    if (res.success && res.logo) {
      setContent((prev) => ({
        ...prev,
        foundationInfo: {
          ...prev.foundationInfo,
          logo: res.logo!
        }
      }));
      setActiveLogo(res.logo);
      return true;
    }
    return false;
  };

  const triggerTick = async (): Promise<boolean> => {
    const res = await triggerBackendManualTick();
    return res.success;
  };

  const toggleAutoSystem = async (enabled: boolean, intervalSec?: number): Promise<boolean> => {
    const res = await toggleBackendAutoConfig({ enabled, intervalSec });
    if (res.success && res.automaticSystem) {
      setContent((prev) => ({
        ...prev,
        automaticSystem: res.automaticSystem!
      }));
      return true;
    }
    return false;
  };

  const resetDefaults = async (): Promise<boolean> => {
    const ok = await resetBackendContentToDefaults();
    if (ok) {
      const refreshed = await fetchBackendContent();
      if (refreshed) setContent(refreshed);
    }
    return ok;
  };

  return (
    <BackendSyncContext.Provider
      value={{
        content,
        isConnected,
        version: content.version,
        lastSyncTime: content.lastUpdated,
        updateContent,
        updateLogo,
        triggerTick,
        toggleAutoSystem,
        resetDefaults,
        reconnect: connectSSE,
        recentNotification
      }}
    >
      {children}
    </BackendSyncContext.Provider>
  );
};

export function useBackendSync() {
  const context = useContext(BackendSyncContext);
  if (!context) {
    throw new Error('useBackendSync must be used within a BackendSyncProvider');
  }
  return context;
}
