"use client";

import React, { useEffect, useState } from "react";
import { getPathname, Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Globe, Type, Sun, Activity, Volume2, Check, Keyboard, BookOpen, RotateCcw, Save, Play, X } from "lucide-react";
import { useMemoraStore, type FontSizePreference, type VoiceLanguage } from "@/lib/store/useMemoraStore";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSpeechLanguageTag, speakLongText } from "@/lib/accessibility-speech";

const LOCALES = [
  { code: "en", label: "English", script: "Latin (English)" },
  { code: "hi", label: "हिन्दी", script: "Devanagari (Hindi)" },
  { code: "as", label: "অসমীয়া", script: "Bengali-Assamese (Assamese)" },
  { code: "bn", label: "বাংলা", script: "Bengali (Bengali)" },
  { code: "brx", label: "बड़ो", script: "Devanagari (Bodo)" },
  { code: "mni", label: "ꯃꯩꯇꯩꯂꯣꯟ", script: "Meetei Mayek (Manipuri)" },
  { code: "gu", label: "ગુજરાતી", script: "Gujarati (Gujarati)" },
  { code: "kn", label: "ಕನ್ನಡ", script: "Kannada (Kannada)" },
  { code: "ml", label: "മലയാളം", script: "Malayalam (Malayalam)" },
  { code: "mr", label: "मराठी", script: "Devanagari (Marathi)" },
  { code: "or", label: "ଓଡ଼ିଆ", script: "Oriya (Odia)" },
  { code: "pa", label: "ਪੰਜਾਬੀ", script: "Gurmukhi (Punjabi)" },
  { code: "ta", label: "தமிழ்", script: "Tamil (Tamil)" },
  { code: "te", label: "తెలుగు", script: "Telugu (Telugu)" },
  { code: "ur", label: "اردو", script: "Arabic (Urdu)" },
] as const;

const VOICE_TEST_SAMPLES: Record<Exclude<VoiceLanguage, "auto">, string> = {
  en: "Voice assistance is ready.",
  hi: "आवाज़ सहायता तैयार है।",
  as: "কণ্ঠ সহায়তা সাজু।",
  bn: "কণ্ঠ সহায়তা প্রস্তুত।",
  brx: "रावसोल मदद थियार।",
  mni: "ꯍꯥꯏꯕ ꯃꯇꯦꯡ ꯁꯤꯖꯅꯕꯅꯤ।",
  gu: "વોઇસ સહાય તૈયાર છે.",
  kn: "ಧ್ವನಿ ಸಹಾಯ ಸಿದ್ಧವಾಗಿದೆ.",
  ml: "വോയ്‌സ് സഹായം തയ്യാറാണ്.",
  mr: "व्हॉयस सहाय्य तयार आहे.",
  or: "ଭୋଇସ ସହାୟତା ପ୍ରସ୍ତୁତ।",
  pa: "ਆਵਾਜ਼ ਸਹਾਇਤਾ ਤਿਆਰ ਹੈ।",
  ta: "குரல் உதவி தயார்.",
  te: "వాయిస్ సహాయం సిద్ధంగా ఉంది.",
  ur: "صوتی معاونت تیار ہے۔",
};

function PreferenceSwitch({
  checked,
  onChange,
  label,
  onText,
  offText,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  onText: string;
  offText: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 px-3 font-bold text-sm transition-transform active:scale-95"
      style={{
        color: checked ? "var(--primary-ink)" : "var(--ink-soft)",
        background: checked ? "var(--primary)" : "var(--surface-2)",
        borderColor: checked ? "var(--primary-dark)" : "var(--border)",
      }}
    >
      <span className="min-w-8 text-center">{checked ? onText : offText}</span>
      <span className="relative h-7 w-12 rounded-full border" style={{ background: checked ? "var(--primary-dark)" : "var(--surface)", borderColor: checked ? "var(--primary-ink)" : "var(--border)" }} aria-hidden="true">
        <span className="absolute top-0.5 h-5 w-5 rounded-full transition-[left]" style={{ left: checked ? "calc(100% - 22px)" : "2px", background: checked ? "var(--primary-ink)" : "var(--ink-muted)" }} />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const locale = useLocale();
  const t = useTranslations("Common");
  const tSettings = useTranslations("Settings");
  const pathname = usePathname();
  const [voiceStatus, setVoiceStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [isReadingPage, setIsReadingPage] = useState(false);

  const {
    calmMode,
    toggleCalmMode,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    audioAssistance,
    setAudioAssistance,
    voiceLanguage,
    setVoiceLanguage,
    resetPreferences,
  } = useMemoraStore();

  const handleLanguageChange = (newLocale: (typeof LOCALES)[number]["code"]) => {
    const target = getPathname({ locale: newLocale, href: pathname });
    window.location.assign(`${target}${window.location.search}${window.location.hash}`);
  };

  useEffect(() => {
    if (!audioAssistance) setVoiceStatus("");
  }, [audioAssistance]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShortcutsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const testVoice = () => {
    if (!audioAssistance) return;
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceStatus(t("voiceUnavailable"));
      return;
    }

    window.speechSynthesis.cancel();
    const sampleText = voiceLanguage === "auto" ? t("voiceSample") : VOICE_TEST_SAMPLES[voiceLanguage];
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = getSpeechLanguageTag(voiceLanguage, locale);
    utterance.rate = 0.88;
    utterance.onstart = () => setVoiceStatus(t("voicePlaying"));
    utterance.onend = () => setVoiceStatus("");
    utterance.onerror = () => setVoiceStatus(t("voiceUnavailable"));
    window.speechSynthesis.speak(utterance);
  };

  const readPageAloud = () => {
    if (!audioAssistance) return;
    if (isReadingPage) {
      window.speechSynthesis.cancel();
      setIsReadingPage(false);
      return;
    }
    const pageText = document.querySelector("main")?.innerText?.replace(/\s+/g, " ").trim() ?? "";
    const didStart = speakLongText(pageText, getSpeechLanguageTag(voiceLanguage, locale), () => setIsReadingPage(false));
    setIsReadingPage(didStart);
    if (!didStart) setVoiceStatus(t("voiceUnavailable"));
  };

  const savePreferences = () => {
    try {
      const version = useMemoraStore.persist.getOptions().version ?? 0;
      window.localStorage.setItem(
        "memora-user-preferences",
        JSON.stringify({ state: useMemoraStore.getState(), version }),
      );
      setSaveStatus(tSettings("saved"));
    } catch {
      setSaveStatus(tSettings("saveUnavailable"));
    }
  };

  const resetAllPreferences = () => {
    window.speechSynthesis?.cancel();
    resetPreferences();
    setIsReadingPage(false);
    setVoiceStatus("");
    setSaveStatus(tSettings("resetDone"));
  };

  const updatePreference = (update: () => void) => {
    update();
    setSaveStatus("");
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:px-6 space-y-5">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-semibold px-4 py-2.5 rounded-full border no-underline transition-colors hover:bg-[var(--surface-2)]"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--primary)",
            minHeight: "44px",
          }}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>{tSettings("backHome")}</span>
        </Link>

        <span className="text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider text-[var(--ink-soft)] bg-[var(--surface-2)] border-[var(--border)]">
          {tSettings("preferences")}
        </span>
      </div>

      {/* ── Section Header ── */}
      <SectionHeader
        eyebrow={tSettings("eyebrow")}
        title={tSettings("title")}
        description={tSettings("description")}
      />

      <div className="space-y-6">
        {/* 1. Language Preference */}
        <section
          className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 space-y-4 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("languageTitle")}</h3>
              <p className="text-xs md:text-sm text-[var(--ink-soft)]">
                {tSettings("languageDescription")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {LOCALES.map((loc) => {
              const isActive = locale === loc.code;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => handleLanguageChange(loc.code)}
                  className="p-4 rounded-[var(--radius-md)] border-2 flex items-center justify-between text-left transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: isActive ? "var(--primary-light)" : "var(--surface-2)",
                    borderColor: isActive ? "var(--primary)" : "var(--border-soft)",
                    color: "var(--ink)",
                    minHeight: "56px",
                  }}
                  aria-pressed={isActive}
                >
                  <div>
                    <span className="font-extrabold text-base block">{loc.label}</span>
                    <span className="text-xs text-[var(--ink-soft)]">{loc.script}</span>
                  </div>
                  {isActive && <Check size={18} style={{ color: "var(--primary)" }} />}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Font Size Scaling */}
        <section
          className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 space-y-4 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent-light)] text-[var(--accent-dark)] border border-[var(--accent)]">
              <Type size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("textSizeTitle")}</h3>
              <p className="text-xs md:text-sm text-[var(--ink-soft)]">
                {tSettings("textSizeDescription")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {(["medium", "large", "xlarge"] as FontSizePreference[]).map((size) => {
              const isActive = fontSize === size;
              const labels: Record<FontSizePreference, string> = {
                medium: tSettings("textStandard"),
                large: tSettings("textLarge"),
                xlarge: tSettings("textXLarge"),
              };
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updatePreference(() => setFontSize(size))}
                  className="p-4 rounded-[var(--radius-md)] border-2 text-center font-bold text-sm transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: isActive ? "var(--accent-light)" : "var(--surface-2)",
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    color: isActive ? "var(--accent-dark)" : "var(--ink)",
                    minHeight: "52px",
                  }}
                  aria-pressed={isActive}
                >
                  {labels[size]}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Calm Mode Toggle */}
        <section
          className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 flex items-center justify-between gap-4 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("calmTitle")}</h3>
              <p className="text-xs md:text-sm text-[var(--ink-soft)]">
                {tSettings("calmDescription")}
              </p>
            </div>
          </div>

          <PreferenceSwitch checked={calmMode} onChange={() => updatePreference(toggleCalmMode)} label={tSettings("calmTitle")} onText={tSettings("calmOn")} offText={tSettings("calmOff")} />
        </section>

        {/* 4. High Contrast Mode */}
        <section
          className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 flex items-center justify-between gap-4 shadow-sm"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--border)]">
              <Sun size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("contrastTitle")}</h3>
              <p className="text-xs md:text-sm text-[var(--ink-soft)]">
                {tSettings("contrastDescription")}
              </p>
            </div>
          </div>

          <PreferenceSwitch checked={highContrast} onChange={() => updatePreference(() => setHighContrast(!highContrast))} label={tSettings("contrastTitle")} onText={tSettings("enabled")} offText={tSettings("disabled")} />
        </section>

        {/* 5. Audio Assistance */}
        <section
          className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 flex flex-col gap-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]">
              <Volume2 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("voiceTitle")}</h3>
              <p className="text-xs md:text-sm text-[var(--ink-soft)]">
                {tSettings("voiceDescription")}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <label className="sr-only" htmlFor="voice-language">{tSettings("voiceLanguage")}</label>
            <select
              id="voice-language"
              value={voiceLanguage}
              onChange={(event) => updatePreference(() => setVoiceLanguage(event.target.value as VoiceLanguage))}
              className="min-h-12 w-full max-w-[260px] min-w-[220px] rounded-full border-2 px-4 text-sm font-semibold"
              style={{ background: "var(--surface)", color: "var(--ink)", borderColor: "var(--border)" }}
            >
              <option value="auto">{tSettings("matchSiteLanguage")} ({locale.toUpperCase()})</option>
              {LOCALES.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
            </select>
            <button
              type="button"
              onClick={testVoice}
              disabled={!audioAssistance}
              className="px-4 py-2.5 rounded-full font-bold text-sm border transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--surface-2)",
                color: "var(--ink)",
                borderColor: "var(--border)",
                minHeight: "48px",
              }}
            >
              <Play size={16} aria-hidden="true" /> {t("testVoice")}
            </button>
            <PreferenceSwitch checked={audioAssistance} onChange={() => updatePreference(() => setAudioAssistance(!audioAssistance))} label={tSettings("voiceTitle")} onText={tSettings("active")} offText={tSettings("muted")} />
          </div>
        </section>
        {voiceStatus && <p role="status" aria-live="polite" className="text-sm" style={{ color: "var(--ink-soft)" }}>{voiceStatus}</p>}

        <section className="rounded-[var(--radius-card)] p-4 sm:p-5 border-2 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent-light)] text-[var(--accent-dark)] border border-[var(--accent)]"><Keyboard size={20} /></div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{tSettings("helpfulShortcuts")}</h3>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{tSettings("shortcutDescription")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={readPageAloud} disabled={!audioAssistance} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold disabled:opacity-50" style={{ background: "var(--surface-2)", color: "var(--ink)", borderColor: "var(--border)" }}>
                <BookOpen size={17} aria-hidden="true" /> {isReadingPage ? tSettings("stopReading") : tSettings("readPageAloud")}
              </button>
              <button type="button" onClick={() => setShortcutsOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold" style={{ background: "var(--surface-2)", color: "var(--ink)", borderColor: "var(--border)" }}>
                <Keyboard size={17} aria-hidden="true" /> {tSettings("keyboardShortcuts")}
              </button>
              <button type="button" onClick={resetAllPreferences} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold" style={{ background: "var(--surface-2)", color: "var(--ink)", borderColor: "var(--border)" }}>
                <RotateCcw size={17} aria-hidden="true" /> {tSettings("resetPreferences")}
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start">
          <button type="button" onClick={savePreferences} className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold shadow-sm" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
            <Save size={18} aria-hidden="true" /> {tSettings("savePreferences")}
          </button>
          <button type="button" onClick={resetAllPreferences} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-6 font-bold" style={{ background: "var(--surface)", color: "var(--ink)", borderColor: "var(--border)" }}>
            <RotateCcw size={18} aria-hidden="true" /> {tSettings("resetDefaults")}
          </button>
          {saveStatus && <span role="status" aria-live="polite" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>{saveStatus}</span>}
        </div>
      </div>

      {shortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShortcutsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="shortcut-title" className="w-full max-w-lg rounded-[var(--radius-card)] border-2 p-5 shadow-lg sm:p-7" style={{ background: "var(--surface)", color: "var(--ink)", borderColor: "var(--border)" }}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="shortcut-title" className="text-2xl font-bold">{tSettings("shortcutDialogTitle")}</h2>
              <button type="button" onClick={() => setShortcutsOpen(false)} aria-label={t("close")} className="flex h-11 w-11 items-center justify-center rounded-full border" style={{ borderColor: "var(--border)" }}><X size={21} /></button>
            </div>
            <dl className="space-y-3">
              {(["shortcutFocus", "shortcutActivate", "shortcutClose", "shortcutHouse"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-soft)", background: "var(--surface-2)" }}>
                  <dt className="font-semibold">{tSettings(key)}</dt>
                  <dd className="text-sm" style={{ color: "var(--ink-soft)" }}>{tSettings(`${key}Help`)}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
