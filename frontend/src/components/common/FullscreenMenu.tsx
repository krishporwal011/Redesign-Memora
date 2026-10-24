"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { X, Sparkles, Heart, Activity, ShieldCheck, Home, Eye, Wifi, Settings, Box } from "lucide-react";
import { useMemoraStore } from "@/lib/store/useMemoraStore";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const t = useTranslations("Common");
  const tRoles = useTranslations("Roles");
  const pathname = usePathname();
  const { calmMode, toggleCalmMode } = useMemoraStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const menuLinks = [
    { href: "/", label: t("home"), icon: Home, badge: t("galleryMode") },
    { href: "/play", label: tRoles("patientTitle"), icon: Sparkles, badge: t("calmMode") },
    { href: "/care", label: tRoles("caregiverTitle"), icon: Heart, badge: t("family") },
    { href: "/asha", label: tRoles("ashaTitle"), icon: Eye, badge: t("community") },
    { href: "/house", label: t("memoryHouse"), icon: Box, badge: t("galleryMode") },
    { href: "/sync", label: t("sync"), icon: Wifi, badge: t("offline") },
    { href: "/settings", label: t("settings"), icon: Settings, badge: t("preferences") },
    { href: "/privacy", label: t("privacy"), icon: ShieldCheck, badge: t("privacy") },
  ];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("menu")}
      ref={dialogRef}
      className="fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: "rgba(15, 23, 28, 0.42)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        color: "var(--bg)",
      }}
    >
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[54vw] flex-col justify-between border-l p-4 sm:p-6 md:p-8" style={{ background: "rgba(23, 42, 46, 0.96)", borderColor: "rgba(255,255,255,0.12)" }}>
        {/* ── Top Bar inside Menu ── */}
        <div className="glass-menu-toolbar flex items-center justify-between gap-3 rounded-[var(--radius-card)] border px-4 py-3 sm:px-5" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/6DE0315E-FC3B-4C8D-BE04-76F73846572E.png"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-full border border-[var(--accent-light)] object-cover"
            />
            <div>
              <span className="text-xl font-bold tracking-tight block">{t("appName")}</span>
              <span className="text-xs uppercase tracking-wider block opacity-75">{t("regionName")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Calm mode quick toggle */}
            <button
              type="button"
              onClick={toggleCalmMode}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-colors cursor-pointer"
              style={{
                minHeight: "48px",
                background: calmMode ? "var(--primary)" : "rgba(251, 248, 243, 0.06)",
                color: "var(--bg)",
                borderColor: "rgba(251, 248, 243, 0.22)",
              }}
              aria-pressed={calmMode}
            >
              <Activity size={16} />
              <span>{t("calmMode")}: {calmMode ? t("calmModeOn") : t("calmModeOff")}</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="glass-menu-close w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: "var(--bg)", borderColor: "rgba(255,255,255,0.12)" }}
              aria-label={t("close")}
            >
              <X size={26} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Menu Links with Struck-Through Current Page ── */}
        <nav className="my-auto grid w-full max-w-5xl grid-cols-1 gap-3 py-5 sm:grid-cols-2 sm:py-7 sm:auto-rows-fr overflow-y-auto" aria-label={t("menu")}>
          {menuLinks.map((item) => {
            const isCurrent =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`glass-menu-link group flex h-full min-h-[88px] items-center justify-between gap-3 rounded-[var(--radius-card)] border px-4 py-3 sm:px-5 no-underline transition-all duration-200 ${
                  isCurrent ? "line-through opacity-50" : "opacity-95 hover:opacity-100"
                }`}
                style={{ color: "var(--bg)", borderColor: "rgba(255,255,255,0.12)" }}
                aria-current={isCurrent ? "page" : undefined}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <span className="glass-menu-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "rgba(255,255,255,0.12)" }} aria-hidden="true">
                    <Icon size={21} />
                  </span>
                  <span className="min-w-0 text-lg font-bold leading-tight sm:text-xl md:text-2xl">{item.label}</span>
                </div>
                <span className="glass-menu-badge shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider sm:px-3 sm:text-[10px]" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── Footer within Menu ── */}
        <div className="glass-menu-footer flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-card)] border px-4 py-3 text-[11px] sm:px-5 sm:text-xs" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <p>{t("menuFooterPrivacy")}</p>
          <p>{t("menuFooterRegion", { region: t("regionName") })}</p>
        </div>
      </div>
    </div>
  );
}
