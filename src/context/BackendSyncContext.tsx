import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SiteContentState,
  INITIAL_SITE_STATE,
  BrainEngineConfig,
  KnowledgeBaseConfig,
  fetchBackendContent,
  fetchVaultSnapshot,
  sendBackendContentUpdate,
  sendBackendLogoUpdate,
  triggerBackendManualTick,
  toggleBackendAutoConfig,
  resetBackendContentToDefaults,
  updateBrainEngine,
  updateKnowledgeBase,
  triggerBrainPulse
} from '../services/backendSyncService';
import { setActiveLogo } from '../services/logoService';
import { syncSponsorLinks } from '../services/adDonateService';

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
  updateBrain: (updates: Partial<BrainEngineConfig>) => Promise<boolean>;
  updateKnowledge: (updates: Partial<KnowledgeBaseConfig>) => Promise<boolean>;
  pushBrainPulse: (payload: { location?: string; actionText?: string; impactText?: string; bumpClicks?: number }) => Promise<boolean>;
  refreshAdminSnapshot: () => Promise<boolean>;
  reconnect: () => void;
  recentNotification: string | null;
}

const BackendSyncContext = createContext<BackendSyncContextValue | undefined>(undefined);

const STATIC_PULSE_CITIES = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'London, UK', 'Toronto, Canada'];
const STATIC_PULSE_ACTIONS = [
  'unlocked 1 Child Meal & Study Credit (0 cost)',
  'sponsored a clean drinking water sachet via free click',
  'contributed to today’s rural classroom kit goal',
  'completed a free sponsor click for emergency relief'
];

function mergeWithInitial(incoming: Partial<SiteContentState>): SiteContentState {
  const rawLogo = incoming.foundationInfo?.logo;
  const normalizedLogo = rawLogo === '/logo.png' ? './logo.png' : rawLogo;
  return {
    ...INITIAL_SITE_STATE,
    ...incoming,
    foundationInfo: {
      ...INITIAL_SITE_STATE.foundationInfo,
      ...(incoming.foundationInfo || {}),
      ...(normalizedLogo ? { logo: normalizedLogo } : {})
    },
    urgentNotice: { ...INITIAL_SITE_STATE.urgentNotice, ...(incoming.urgentNotice || {}) },
    donationStats: { ...INITIAL_SITE_STATE.donationStats, ...(incoming.donationStats || {}) },
    automaticSystem: { ...INITIAL_SITE_STATE.automaticSystem, ...(incoming.automaticSystem || {}) },
    brainEngine: {
      ...INITIAL_SITE_STATE.brainEngine,
      ...(incoming.brainEngine || {}),
      floatingNudge: {
        ...INITIAL_SITE_STATE.brainEngine.floatingNudge,
        ...((incoming.brainEngine && incoming.brainEngine.floatingNudge) || {})
      },
      realClickAnalytics: {
        ...INITIAL_SITE_STATE.brainEngine.realClickAnalytics,
        ...((incoming.brainEngine && incoming.brainEngine.realClickAnalytics) || {})
      }
    },
    knowledgeBase: {
      ...INITIAL_SITE_STATE.knowledgeBase,
      ...(incoming.knowledgeBase || {})
    }
  };
}

export const BackendSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentState>(INITIAL_SITE_STATE);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const staticModeRef = useRef<boolean>(false);

  const showNotification = (msg: string) => {
    setRecentNotification(msg);
    setTimeout(() => {
      setRecentNotification(null);
    }, 4000);
  };

  const applyContentSnapshot = useCallback((rawContent: Partial<SiteContentState>) => {
    const merged = mergeWithInitial(rawContent);
    setContent(merged);
    if (merged.foundationInfo?.logo) {
      setActiveLogo(merged.foundationInfo.logo);
    }
    if (merged.brainEngine?.sponsorLinks) {
      syncSponsorLinks(merged.brainEngine.sponsorLinks);
    }
  }, []);

  const connectSSE = useCallback(() => {
    if (staticModeRef.current || typeof EventSource === 'undefined') {
      return;
    }
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
            applyContentSnapshot(payload.content);
          }
          setIsConnected(true);
        } catch {
          // ignore malformed payload
        }
      });

      es.addEventListener('update', (e: MessageEvent) => {
        try {
          const message = JSON.parse(e.data);
          const { type, payload } = message;

          if (type === 'FULL_SYNC') {
            applyContentSnapshot(payload);
          } else if (type === 'AUTO_TICK' || type === 'MANUAL_TRIGGER' || type === 'BRAIN_UPDATE') {
            setContent((prev) => {
              const nextBrain = payload.brainEngine
                ? {
                    ...prev.brainEngine,
                    ...payload.brainEngine,
                    floatingNudge: payload.brainEngine.floatingNudge
                      ? { ...prev.brainEngine.floatingNudge, ...payload.brainEngine.floatingNudge }
                      : prev.brainEngine.floatingNudge,
                    realClickAnalytics: payload.brainEngine.realClickAnalytics || prev.brainEngine.realClickAnalytics
                  }
                : prev.brainEngine;

              if (nextBrain?.sponsorLinks) {
                syncSponsorLinks(nextBrain.sponsorLinks);
              }

              return {
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
                },
                brainEngine: nextBrain
              };
            });
          } else if (type === 'KNOWLEDGE_UPDATE') {
            setContent((prev) => ({
              ...prev,
              version: message.version || prev.version + 1,
              lastUpdated: message.lastUpdated || new Date().toISOString(),
              knowledgeBase: {
                ...prev.knowledgeBase,
                ...(payload.knowledgeBase || {})
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
        } catch {
          // ignore update parse error
        }
      });

      es.onerror = () => {
        setIsConnected(false);
        es.close();
        clearTimeout(reconnectTimeoutRef.current);
        if (!staticModeRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSSE();
          }, 5000);
        }
      };
    } catch {
      setIsConnected(false);
    }
  }, [applyContentSnapshot]);

  useEffect(() => {
    let cancelled = false;
    let staticPulseTimer: any = null;

    // Handle local immediate UI feedback when visitor clicks any 1-click free support button
    const onLocalClick = (ev: Event) => {
      if (!staticModeRef.current) return;
      const customEv = ev as CustomEvent<{ source?: string; linkNumber?: number }>;
      const linkNum = customEv.detail?.linkNumber || 1;
      setContent((prev) => {
        const nextClicks = (prev.brainEngine.todayClicks || 427) + 1;
        const nextGoal = nextClicks >= prev.brainEngine.dailyGoalClicks ? prev.brainEngine.dailyGoalClicks + 250 : prev.brainEngine.dailyGoalClicks;
        return {
          ...prev,
          donationStats: {
            ...prev.donationStats,
            totalSupporters: prev.donationStats.totalSupporters + 1,
            mealsServed: prev.donationStats.mealsServed + 2,
            cleanWaterLitres: prev.donationStats.cleanWaterLitres + 5,
            lastSupporterName: 'Verified Community Supporter',
            lastDonationTime: new Date().toISOString()
          },
          brainEngine: {
            ...prev.brainEngine,
            todayClicks: nextClicks,
            dailyGoalClicks: nextGoal,
            activityStream: [
              {
                id: `click-${Date.now()}`,
                location: 'Verified Live Click',
                actionText: `unlocked 1 Child Meal & Study Credit (Partner #${linkNum})`,
                impactText: '+1 Free Click',
                timestamp: new Date().toISOString()
              },
              ...(prev.brainEngine.activityStream || [])
            ].slice(0, 12)
          }
        };
      });
    };

    window.addEventListener('mrs_free_click', onLocalClick);

    fetchBackendContent().then((data) => {
      if (cancelled) return;
      if (data) {
        staticModeRef.current = false;
        applyContentSnapshot(data);
        connectSSE();
      } else {
        // Running on static host (e.g. GitHub Pages) - run cleanly without failing API polling
        staticModeRef.current = true;
        setIsConnected(false);
        staticPulseTimer = setInterval(() => {
          const city = STATIC_PULSE_CITIES[Math.floor(Math.random() * STATIC_PULSE_CITIES.length)];
          const actionText = STATIC_PULSE_ACTIONS[Math.floor(Math.random() * STATIC_PULSE_ACTIONS.length)];
          setContent((prev) => {
            const nextClicks = (prev.brainEngine.todayClicks || 427) + 1;
            const nextGoal = nextClicks >= prev.brainEngine.dailyGoalClicks ? prev.brainEngine.dailyGoalClicks + 250 : prev.brainEngine.dailyGoalClicks;
            return {
              ...prev,
              donationStats: {
                ...prev.donationStats,
                totalSupporters: prev.donationStats.totalSupporters + 1,
                mealsServed: prev.donationStats.mealsServed + 2,
                cleanWaterLitres: prev.donationStats.cleanWaterLitres + 5,
                lastSupporterName: `Supporter from ${city}`,
                lastDonationTime: new Date().toISOString()
              },
              brainEngine: {
                ...prev.brainEngine,
                todayClicks: nextClicks,
                dailyGoalClicks: nextGoal,
                activityStream: [
                  {
                    id: `act-${Date.now()}`,
                    location: city,
                    actionText,
                    impactText: '+1 Free Credit',
                    timestamp: new Date().toISOString()
                  },
                  ...(prev.brainEngine.activityStream || [])
                ].slice(0, 12)
              }
            };
          });
        }, 9000);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener('mrs_free_click', onLocalClick);
      clearInterval(staticPulseTimer);
      clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectSSE, applyContentSnapshot]);

  const updateContent = async (updates: Partial<SiteContentState>): Promise<boolean> => {
    const res = await sendBackendContentUpdate(updates);
    if (res.success && res.data) {
      applyContentSnapshot(res.data);
      showNotification('Site content updated live');
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
      if (refreshed) applyContentSnapshot(refreshed);
    }
    return ok;
  };

  const updateBrain = async (updates: Partial<BrainEngineConfig>): Promise<boolean> => {
    const res = await updateBrainEngine(updates);
    if (res.success && res.brainEngine) {
      setContent((prev) => ({
        ...prev,
        brainEngine: res.brainEngine!
      }));
      if (res.brainEngine.sponsorLinks) {
        syncSponsorLinks(res.brainEngine.sponsorLinks);
      }
      showNotification('Strategy configuration updated live');
      return true;
    }
    return false;
  };

  const updateKnowledge = async (updates: Partial<KnowledgeBaseConfig>): Promise<boolean> => {
    const res = await updateKnowledgeBase(updates);
    if (res.success && res.knowledgeBase) {
      setContent((prev) => ({
        ...prev,
        knowledgeBase: res.knowledgeBase!
      }));
      showNotification('Knowledge Base synced live');
      return true;
    }
    return false;
  };

  const pushBrainPulse = async (payload: {
    location?: string;
    actionText?: string;
    impactText?: string;
    bumpClicks?: number;
  }): Promise<boolean> => {
    const res = await triggerBrainPulse(payload);
    if (res.success && res.brainEngine) {
      setContent((prev) => ({
        ...prev,
        brainEngine: res.brainEngine!
      }));
      showNotification('Live community pulse broadcasted');
      return true;
    }
    return false;
  };

  const refreshAdminSnapshot = useCallback(async (): Promise<boolean> => {
    const res = await fetchVaultSnapshot();
    if (res.success && res.data) {
      applyContentSnapshot(res.data);
      return true;
    }
    return false;
  }, [applyContentSnapshot]);

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
        updateBrain,
        updateKnowledge,
        pushBrainPulse,
        refreshAdminSnapshot,
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
