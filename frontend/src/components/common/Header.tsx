"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, Link, usePathname } from "@/i18n/routing";
import { Menu, Activity, Globe, ChevronDown } from "lucide-react";
import { useMemoraStore } from "@/lib/store/useMemoraStore";
import { FullscreenMenu } from "./FullscreenMenu";

const LOCALES = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "हि", full: "हिन्दी" },
  { code: "as", label: "অস", full: "অসমীয়া" },
  { code: "bn", label: "বাং", full: "বাংলা" },
  { code: "brx", label: "बड़", full: "बड़ो" },
  { code: "mni", label: "ꯃꯩ", full: "ꯃꯩꯇꯩꯂꯣꯟ" },
  { code: "gu", label: "ગુ", full: "ગુજરાતી" },
  { code: "kn", label: "ಕನ", full: "ಕನ್ನಡ" },
  { code: "ml", label: "മ", full: "മലയാളം" },
  { code: "mr", label: "मर", full: "मराठी" },
  { code: "or", label: "ଓ", full: "ଓଡ଼ିଆ" },
  { code: "pa", label: "ਪੰ", full: "ਪੰਜਾਬੀ" },
  { code: "ta", label: "த", full: "தமிழ்" },
  { code: "te", label: "తె", full: "తెలుగు" },
  { code: "ur", label: "ارد", full: "اردو" },
] as const;

export function Header() {
  const t = useTranslations("Common");
  const tRoles = useTranslations("Roles");
  const locale = useLocale();
  const pathname = usePathname();
  const { calmMode, toggleCalmMode } = useMemoraStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const isPatientRoute = pathname.includes("/play");
  const isCalmHome = pathname === "/" && calmMode;

  const handleLocaleChange = (newLocale: (typeof LOCALES)[number]["code"]) => {
    setIsLanguageMenuOpen(false);
    const target = getPathname({ locale: newLocale, href: pathname });
    window.location.assign(`${target}${window.location.search}${window.location.hash}`);
  };

  useEffect(() => {
    if (!isLanguageMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLanguageMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isLanguageMenuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b"
        style={{
          background: "var(--primary)",
          borderColor: "var(--primary-dark)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 py-2 md:py-2.5 flex items-center justify-between gap-3">
          {/* ── Brand / Logo Mark ── */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline shrink-0"
            aria-label={`${t("appName")} — ${t("home")}`}
          >
            <Image
              src="/icons/6DE0315E-FC3B-4C8D-BE04-76F73846572E.png"
              alt=""
              width={48}
              height={48}
              priority
              className="h-10 w-10 shrink-0 rounded-full border-2 border-[var(--accent-light)] object-cover"
            />
            <div>
              <span
                className="text-lg md:text-xl font-extrabold tracking-tight leading-none block"
                style={{ color: isCalmHome ? "var(--ink)" : "var(--primary-ink)" }}
              >
                {t("appName")}
              </span>
              <span
                className="text-[10px] font-semibold tracking-widest uppercase block leading-tight mt-0.5"
                style={{ color: "var(--primary-ink)", opacity: 0.92 }}
              >
                {t("regionName")}
              </span>
            </div>
          </Link>

          {isCalmHome && (
            <nav aria-label={t("home")} className="hidden 2xl:flex items-center gap-2">
              {[
                { href: "/", label: t("home") },
                { href: "/play", label: tRoles("patientTitle") },
                { href: "/care", label: tRoles("caregiverTitle") },
                { href: "/asha", label: tRoles("ashaTitle") },
              ].map((item) => {
                const isCurrent = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className="min-h-12 inline-flex items-center rounded-full px-4 text-sm font-semibold no-underline transition-colors hover:bg-[var(--primary-light)]"
                    style={{
                      color: "var(--primary-ink)",
                      background: isCurrent ? "rgba(255,255,255,0.12)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Controls (Language + Calm Toggle + Menu) ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher — 48px touch targets */}
            <nav aria-label={t("language")} className="flex items-center">
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((open) => !open)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border px-3 sm:px-4 text-xs sm:text-sm font-bold transition-colors hover:bg-white/10 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.28)",
                    color: "var(--primary-ink)",
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isLanguageMenuOpen}
                  aria-controls="language-options"
                >
                  <Globe size={17} aria-hidden="true" />
                  <span>{t("language")}</span>
                  <ChevronDown size={15} aria-hidden="true" />
                </button>

                {isLanguageMenuOpen && (
                  <div
                    id="language-options"
                    role="group"
                    aria-label={t("language")}
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-[var(--radius-card)] border p-2 shadow-lg"
                    style={{
                      background: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {LOCALES.map((loc) => {
                      const isActive = locale === loc.code;
                      return (
                        <button
                          key={loc.code}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleLocaleChange(loc.code)}
                          className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-semibold transition-colors hover:bg-[var(--surface-2)] cursor-pointer"
                          style={{
                            color: isActive ? "var(--primary)" : "var(--ink)",
                            background: isActive ? "var(--primary-light)" : "transparent",
                          }}
                        >
                          <span>{loc.full}</span>
                          {isActive && <span className="text-xs font-bold">{loc.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Calm Mode Toggle (min 48px target, icon + text) */}
            <button
              type="button"
              onClick={toggleCalmMode}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 rounded-full border text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
              style={{
                minHeight: "48px",
                background: calmMode ? (isCalmHome ? "var(--accent-light)" : "var(--accent)") : "var(--primary)",
                color: calmMode ? (isCalmHome ? "var(--ink)" : "var(--accent-ink)") : "var(--primary-ink)",
                borderColor: calmMode ? "var(--accent)" : "var(--primary-light)",
              }}
              aria-pressed={calmMode}
              aria-label={calmMode ? t("calmModeOn") : t("calmModeOff")}
            >
              <Activity size={16} aria-hidden="true" />
              <span>{calmMode ? t("calmModeOn") : t("calmMode")}</span>
            </button>

            {/* Showcase Fullscreen Menu Toggle (min 48px target) */}
            {!isPatientRoute && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-colors hover:bg-white/10 cursor-pointer"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.28)",
                  color: "var(--primary-ink)",
                  background: "rgba(255,255,255,0.04)",
                }}
                aria-label={t("menu")}
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Fullscreen Showcase Menu */}
      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
