import React, { useState, useEffect } from 'react';
import { useBackendSync } from '../context/BackendSyncContext';
import { DEFAULT_SPONSOR_LINKS, resetSponsorLinkRotation } from '../services/adDonateService';
import {
  BrainEngineConfig,
  KnowledgeBaseConfig,
  KnowledgeFaqItem,
  loginVault,
  verifyVaultSession,
  clearVaultToken,
  rotateVaultKey
} from '../services/backendSyncService';
import {
  Brain,
  BookOpen,
  Link2,
  Radio,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  CheckCircle2,
  Activity,
  BarChart3,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Lock,
  KeyRound,
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface BrainControlConsoleProps {
  onExit: () => void;
}

type ConsoleTab = 'brain' | 'knowledge' | 'ads' | 'pulse';

const PERSUASION_PRESETS: Record<
  BrainEngineConfig['persuasionMode'],
  { headline: string; subtext: string; cta: string; nudgeHeadline: string; nudgeBadge: string }
> = {
  'goal-gradient': {
    headline: 'Only {remaining} Free Clicks Left to Complete Today’s Rural Aid Goal',
    subtext: 'Zero money needed from your pocket—one quick click unlocks sponsor-funded meals and school kits for children.',
    cta: 'Unlock Free Meal & Study Aid (1-Click)',
    nudgeHeadline: 'Help Finish Today’s Rural School & Meal Batch',
    nudgeBadge: 'Daily Milestone · Almost Complete'
  },
  empathy: {
    headline: 'One Free Click Gives a Child a Warm Meal & School Notebook Today',
    subtext: 'You spend $0—verified sponsor partners cover the full aid contribution whenever you open a partner link.',
    cta: 'Gift a Child’s Meal for Free (1-Click)',
    nudgeHeadline: 'Turn 2 Seconds Into a Student’s Hot Meal',
    nudgeBadge: 'Humanity First · Zero Cost'
  },
  urgency: {
    headline: 'Urgent Relief Batch Needs {remaining} More Free Community Clicks',
    subtext: 'Emergency nutrition & clean water packs are queued for families. Help complete today’s quota immediately at $0 cost.',
    cta: 'Send Urgent Free Relief (1-Click)',
    nudgeHeadline: 'Rapid Response Batch Closing Soon',
    nudgeBadge: 'Urgent Relief · Action Needed'
  },
  'social-proof': {
    headline: 'Thousands Are Giving for Free Today — {remaining} Clicks to Next Milestone',
    subtext: 'Join supporters across Bangladesh and worldwide unlocking real humanitarian funds with simple zero-cost clicks.',
    cta: 'Join & Add Your Free Click (+1)',
    nudgeHeadline: 'Community Momentum Is Surging Right Now',
    nudgeBadge: 'Live Community Drive'
  }
};

export const BrainControlConsole: React.FC<BrainControlConsoleProps> = ({ onExit }) => {
  const {
    content,
    isConnected,
    version,
    updateBrain,
    updateKnowledge,
    updateContent,
    pushBrainPulse,
    toggleAutoSystem,
    resetDefaults,
    refreshAdminSnapshot
  } = useBackendSync();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphraseInput, setPassphraseInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Key rotation state
  const [currentKeyInput, setCurrentKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [keyStatusMsg, setKeyStatusMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ConsoleTab>('brain');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Local editable drafts synced with backend state
  const [brainDraft, setBrainDraft] = useState<BrainEngineConfig>(content.brainEngine);
  const [kbDraft, setKbDraft] = useState<KnowledgeBaseConfig>(content.knowledgeBase);
  const [linksText, setLinksText] = useState<string>((content.brainEngine?.sponsorLinks || DEFAULT_SPONSOR_LINKS).join('\n'));
  const [intervalSec, setIntervalSec] = useState<number>(content.automaticSystem.supporterIncrementIntervalSec || 8);
  const [autoEnabled, setAutoEnabled] = useState<boolean>(content.automaticSystem.enabled);

  // Urgent banner draft
  const [urgentDraft, setUrgentDraft] = useState(content.urgentNotice);

  // Custom Pulse form
  const [pulseLocation, setPulseLocation] = useState('Dhaka');
  const [pulseAction, setPulseAction] = useState('unlocked 1 Child Meal & Study Credit (0 cost)');
  const [pulseImpact, setPulseImpact] = useState('+1 Free Support Click');
  const [pulseClicks, setPulseClicks] = useState(1);

  useEffect(() => {
    let mounted = true;
    verifyVaultSession().then(async (valid) => {
      if (!mounted) return;
      setIsAuthenticated(valid);
      setAuthChecked(true);
      if (valid) {
        await refreshAdminSnapshot();
      }
    });
    return () => {
      mounted = false;
    };
  }, [refreshAdminSnapshot]);

  useEffect(() => {
    setBrainDraft(content.brainEngine);
    setKbDraft(content.knowledgeBase);
    if (content.brainEngine?.sponsorLinks?.length) {
      setLinksText(content.brainEngine.sponsorLinks.join('\n'));
    }
    setIntervalSec(content.automaticSystem.supporterIncrementIntervalSec || 8);
    setAutoEnabled(content.automaticSystem.enabled);
    setUrgentDraft(content.urgentNotice);
  }, [content.version]);

  const handleVaultLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphraseInput.trim() || isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    const res = await loginVault(passphraseInput.trim());
    setIsLoggingIn(false);
    if (res.success) {
      setPassphraseInput('');
      setIsAuthenticated(true);
      await refreshAdminSnapshot();
    } else {
      setAuthError(res.error || 'Access denied');
    }
  };

  const handleVaultLogout = () => {
    clearVaultToken();
    setIsAuthenticated(false);
  };

  const handleRotateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyStatusMsg(null);
    const res = await rotateVaultKey(currentKeyInput, newKeyInput);
    if (res.success) {
      setCurrentKeyInput('');
      setNewKeyInput('');
      setKeyStatusMsg('Access key rotated cleanly across server vault.');
    } else {
      setKeyStatusMsg(res.error || 'Could not rotate access key.');
    }
  };

  const flashStatus = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const applyPreset = (mode: BrainEngineConfig['persuasionMode']) => {
    const preset = PERSUASION_PRESETS[mode];
    setBrainDraft((prev) => ({
      ...prev,
      persuasionMode: mode,
      activeHeadline: preset.headline,
      activeSubtext: preset.subtext,
      activeCtaLabel: preset.cta,
      floatingNudge: {
        ...prev.floatingNudge,
        badge: preset.nudgeBadge,
        headline: preset.nudgeHeadline
      }
    }));
  };

  const handleSaveBrain = async () => {
    const okBrain = await updateBrain(brainDraft);
    const okAuto = await toggleAutoSystem(autoEnabled, intervalSec);
    if (okBrain && okAuto) {
      flashStatus('Backend Brain Engine & live pacing updated across all active visitors!');
    } else {
      flashStatus('Failed to update Brain Engine. Check server connection.');
    }
  };

  const handleSaveKnowledge = async () => {
    const ok = await updateKnowledge(kbDraft);
    if (ok) {
      flashStatus('Knowledge Base & FAQs synced live to public portal!');
    } else {
      flashStatus('Failed to update Knowledge Base.');
    }
  };

  const handleSaveLinks = async () => {
    const parsed = linksText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http'));
    if (parsed.length === 0) {
      flashStatus('Please keep at least one valid https:// sponsor link.');
      return;
    }
    const ok = await updateBrain({ sponsorLinks: parsed });
    if (ok) {
      flashStatus(`Saved ${parsed.length} rotating sponsor links live to all visitors!`);
    }
  };

  const handleRestoreDefaultLinks = async () => {
    setLinksText(DEFAULT_SPONSOR_LINKS.join('\n'));
    resetSponsorLinkRotation();
    const ok = await updateBrain({ sponsorLinks: DEFAULT_SPONSOR_LINKS });
    if (ok) {
      flashStatus('Restored the 10 verified uplcm.com sponsor links and reset rotation.');
    }
  };

  const handleSendPulse = async () => {
    const ok = await pushBrainPulse({
      location: pulseLocation,
      actionText: pulseAction,
      impactText: pulseImpact,
      bumpClicks: pulseClicks
    });
    if (ok) {
      flashStatus(`Live activity pulse from "${pulseLocation}" broadcasted to all viewers!`);
    }
  };

  const handleSaveUrgentNotice = async () => {
    const ok = await updateContent({ urgentNotice: urgentDraft });
    if (ok) {
      flashStatus('Urgent Appeal Banner synced live!');
    }
  };

  const addFaqItem = () => {
    const newItem: KnowledgeFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'General',
      question: 'New Foundation Question',
      answer: 'Write your clear, trustworthy answer here.',
      ctaText: '1-Click Free Support',
      active: true
    };
    setKbDraft((prev) => ({ ...prev, faqs: [...(prev.faqs || []), newItem] }));
  };

  const updateFaqField = (id: string, field: keyof KnowledgeFaqItem, value: any) => {
    setKbDraft((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).map((f) => (f.id === id ? { ...f, [field]: value } : f))
    }));
  };

  const deleteFaqItem = (id: string) => {
    setKbDraft((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((f) => f.id !== id)
    }));
  };

  const analytics = content.brainEngine?.realClickAnalytics || {
    totalRealClicks: 0,
    lastRealClickAt: '',
    clicksBySection: {}
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
        <div className="text-xs text-slate-400 font-mono">Verifying secure session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <button
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return</span>
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-xl text-white">
              Restricted Access Verification
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your private owner access key to unlock foundation orchestration controls.
            </p>
          </div>

          <form onSubmit={handleVaultLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Owner Access Key
              </label>
              <input
                type="password"
                autoFocus
                value={passphraseInput}
                onChange={(e) => setPassphraseInput(e.target.value)}
                placeholder="Enter private key..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            {authError && (
              <div className="bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verifying...' : 'Unlock Controls'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Console Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                <span>M R S Private Brain &amp; Knowledge Vault</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {isConnected ? 'Encrypted Session · Live' : 'Reconnecting'}
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Owner console for persuasion strategy, daily goals, knowledge FAQs &amp; ad rotation (v{version})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleVaultLogout}
              className="bg-slate-800 hover:bg-rose-950/70 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 hover:border-rose-500/40 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Vault</span>
            </button>
            <button
              onClick={onExit}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Site</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Global Status Banner */}
        {statusBanner && (
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}

        {/* Quick Live KPI Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Today’s Goal Progress</div>
            <div className="text-2xl font-extrabold text-amber-400 tabular-nums mt-1">
              {content.brainEngine.todayClicks} / {content.brainEngine.dailyGoalClicks}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Mode: {content.brainEngine.persuasionMode}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Real Ad Link Clicks</div>
            <div className="text-2xl font-extrabold text-emerald-400 tabular-nums mt-1">
              {analytics.totalRealClicks}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {analytics.lastRealClickAt ? `Last: ${new Date(analytics.lastRealClickAt).toLocaleTimeString()}` : 'Waiting for clicks'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Active Sponsor Links</div>
            <div className="text-2xl font-extrabold text-white tabular-nums mt-1">
              {(content.brainEngine.sponsorLinks || DEFAULT_SPONSOR_LINKS).length} Links
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Sequential rotation active</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Published FAQs</div>
            <div className="text-2xl font-extrabold text-white tabular-nums mt-1">
              {(content.knowledgeBase.faqs || []).filter((f) => f.active).length} Active
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Live synced to public Knowledge Hub</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'brain' as ConsoleTab, label: 'Brain & Persuasion', icon: Brain },
            { id: 'knowledge' as ConsoleTab, label: 'Knowledge Base & FAQs', icon: BookOpen },
            { id: 'ads' as ConsoleTab, label: 'Ad Links & Telemetry', icon: Link2 },
            { id: 'pulse' as ConsoleTab, label: 'Live Pulse & Broadcast', icon: Radio }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BRAIN & PERSUASION */}
        {activeTab === 'brain' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Psychological Framing &amp; Daily Goal Engine</span>
                </h2>
                <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brainDraft.enabled}
                    onChange={(e) => setBrainDraft({ ...brainDraft, enabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span>Brain Persuasion Active</span>
                </label>
              </div>

              {/* Preset Strategy Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Persuasion Mode Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['goal-gradient', 'empathy', 'urgency', 'social-proof'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => applyPreset(mode)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize border cursor-pointer transition-all ${
                        brainDraft.persuasionMode === mode
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {mode.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Today’s Completed Clicks</label>
                  <input
                    type="number"
                    value={brainDraft.todayClicks}
                    onChange={(e) => setBrainDraft({ ...brainDraft, todayClicks: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Goal Target</label>
                  <input
                    type="number"
                    value={brainDraft.dailyGoalClicks}
                    onChange={(e) => setBrainDraft({ ...brainDraft, dailyGoalClicks: Number(e.target.value) || 500 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Milestone Headline (supports {'{remaining}'} placeholder)
                </label>
                <input
                  type="text"
                  value={brainDraft.activeHeadline}
                  onChange={(e) => setBrainDraft({ ...brainDraft, activeHeadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Supporting Copy</label>
                <textarea
                  rows={2}
                  value={brainDraft.activeSubtext}
                  onChange={(e) => setBrainDraft({ ...brainDraft, activeSubtext: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary 1-Click CTA Button Text</label>
                <input
                  type="text"
                  value={brainDraft.activeCtaLabel}
                  onChange={(e) => setBrainDraft({ ...brainDraft, activeCtaLabel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                onClick={handleSaveBrain}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Push Brain Strategy Live</span>
              </button>
            </div>

            {/* Smart Floating Nudge & Pacing Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">Smart Floating Nudge Bar</h3>
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brainDraft.floatingNudge.enabled}
                      onChange={(e) =>
                        setBrainDraft({
                          ...brainDraft,
                          floatingNudge: { ...brainDraft.floatingNudge, enabled: e.target.checked }
                        })
                      }
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Appear Delay (seconds)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={brainDraft.floatingNudge.delaySeconds}
                    onChange={(e) =>
                      setBrainDraft({
                        ...brainDraft,
                        floatingNudge: { ...brainDraft.floatingNudge, delaySeconds: Number(e.target.value) || 6 }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nudge Headline</label>
                  <input
                    type="text"
                    value={brainDraft.floatingNudge.headline}
                    onChange={(e) =>
                      setBrainDraft({
                        ...brainDraft,
                        floatingNudge: { ...brainDraft.floatingNudge, headline: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nudge Message</label>
                  <textarea
                    rows={2}
                    value={brainDraft.floatingNudge.message}
                    onChange={(e) =>
                      setBrainDraft({
                        ...brainDraft,
                        floatingNudge: { ...brainDraft.floatingNudge, message: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nudge Button Text</label>
                  <input
                    type="text"
                    value={brainDraft.floatingNudge.ctaLabel}
                    onChange={(e) =>
                      setBrainDraft({
                        ...brainDraft,
                        floatingNudge: { ...brainDraft.floatingNudge, ctaLabel: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-bold text-base text-white">Live Momentum Pacing</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Auto-Pulse Activity Worker</span>
                  <input
                    type="checkbox"
                    checked={autoEnabled}
                    onChange={(e) => setAutoEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pulse Interval (seconds): {intervalSec}s
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={45}
                    value={intervalSec}
                    onChange={(e) => setIntervalSec(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <button
                  onClick={handleSaveBrain}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer border border-slate-700"
                >
                  Apply Pacing &amp; Nudge Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE & FAQS */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display font-bold text-lg text-white">
                  Foundation Knowledge Narratives
                </h2>
                <button
                  onClick={handleSaveKnowledge}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Sync Knowledge Base Live</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Online Mission Brief</label>
                  <textarea
                    rows={4}
                    value={kbDraft.missionBrief}
                    onChange={(e) => setKbDraft({ ...kbDraft, missionBrief: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">How Zero-Cost Giving Works</label>
                  <textarea
                    rows={4}
                    value={kbDraft.howItWorksSummary}
                    onChange={(e) => setKbDraft({ ...kbDraft, howItWorksSummary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transparency &amp; Reserve Note</label>
                  <textarea
                    rows={4}
                    value={kbDraft.transparencyNote}
                    onChange={(e) => setKbDraft({ ...kbDraft, transparencyNote: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display font-bold text-base text-white">
                  Interactive FAQ Entries ({(kbDraft.faqs || []).length})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addFaqItem}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                  <button
                    onClick={handleSaveKnowledge}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish FAQs</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(kbDraft.faqs || []).map((faq) => (
                  <div key={faq.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={faq.category}
                          onChange={(e) => updateFaqField(faq.id, 'category', e.target.value)}
                          placeholder="Category"
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold"
                        />
                        <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={faq.active}
                            onChange={(e) => updateFaqField(faq.id, 'active', e.target.checked)}
                            className="accent-emerald-500"
                          />
                          <span>Visible on site</span>
                        </label>
                      </div>
                      <button
                        onClick={() => deleteFaqItem(faq.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/50 cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaqField(faq.id, 'question', e.target.value)}
                      placeholder="Question"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white"
                    />

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaqField(faq.id, 'answer', e.target.value)}
                      placeholder="Answer"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                    />

                    <input
                      type="text"
                      value={faq.ctaText}
                      onChange={(e) => updateFaqField(faq.id, 'ctaText', e.target.value)}
                      placeholder="1-Click CTA button label inside this FAQ"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AD LINKS & TELEMETRY */}
        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Rotating Sponsor Ad Links (1 per line)
                </h2>
                <button
                  onClick={handleRestoreDefaultLinks}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default 10 Links</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Every visitor click rotates sequentially to the next link below so each click opens a fresh URL.
              </p>

              <textarea
                rows={12}
                value={linksText}
                onChange={(e) => setLinksText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-300 leading-relaxed"
              />

              <button
                onClick={handleSaveLinks}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Sync Sponsor Links Live</span>
              </button>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span>Real Click Performance by Section</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tracks every genuine visitor click on ad-support buttons across the website in real time.
              </p>

              <div className="space-y-2.5">
                {Object.keys(analytics.clicksBySection || {}).length === 0 ? (
                  <div className="text-xs text-slate-500 bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                    No clicks recorded yet this session. Click any Donate / 1-Click Support button on the site to see live telemetry!
                  </div>
                ) : (
                  Object.entries(analytics.clicksBySection).map(([section, count]) => (
                    <div
                      key={section}
                      className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs"
                    >
                      <span className="font-mono text-slate-200">{section}</span>
                      <span className="font-bold text-emerald-400 tabular-nums">{count} clicks</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE PULSE & BROADCAST */}
        {activeTab === 'pulse' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Broadcast Custom Live Community Pulse</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Immediately pushes a realistic supporter pulse across Hero, Live Community Impact widget, and milestone progress for all connected visitors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Supporter City / Region</label>
                    <input
                      type="text"
                      value={pulseLocation}
                      onChange={(e) => setPulseLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Clicks Bump (+)</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={pulseClicks}
                      onChange={(e) => setPulseClicks(Number(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Action Description</label>
                  <input
                    type="text"
                    value={pulseAction}
                    onChange={(e) => setPulseAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  onClick={handleSendPulse}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4" />
                  <span>Broadcast Live Pulse Now</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Top Urgent Relief Appeal Banner</span>
                  </h3>
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={urgentDraft.enabled}
                      onChange={(e) => setUrgentDraft({ ...urgentDraft, enabled: e.target.checked })}
                      className="accent-emerald-500"
                    />
                    <span>Show on Hero</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={urgentDraft.headline}
                  onChange={(e) => setUrgentDraft({ ...urgentDraft, headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={urgentDraft.description}
                  onChange={(e) => setUrgentDraft({ ...urgentDraft, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <button
                  onClick={handleSaveUrgentNotice}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer border border-slate-700"
                >
                  Update Urgent Appeal Banner
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Live Viewer Activity Stream</span>
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(content.brainEngine.activityStream || []).map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-amber-300">{item.location}:</span>{' '}
                        <span className="text-slate-300">{item.actionText}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 shrink-0">{item.impactText}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">Recent Event Log</h3>
                  <button
                    onClick={resetDefaults}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All to Defaults</span>
                  </button>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {(content.automaticSystem.updateLog || []).slice(0, 12).map((log) => (
                    <div key={log.id} className="bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-400 font-mono">
                        <span>{log.action}</span>
                        <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300 mt-0.5">{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Vault Security &amp; Access Key Rotation</span>
                </h3>
                <form onSubmit={handleRotateKey} className="space-y-2.5">
                  <input
                    type="password"
                    value={currentKeyInput}
                    onChange={(e) => setCurrentKeyInput(e.target.value)}
                    placeholder="Current access key"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="New access key (min 8 characters)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  {keyStatusMsg && (
                    <div className="text-xs text-amber-300 font-semibold">{keyStatusMsg}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2 rounded-xl text-xs border border-slate-700 cursor-pointer"
                  >
                    Rotate Access Key
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
