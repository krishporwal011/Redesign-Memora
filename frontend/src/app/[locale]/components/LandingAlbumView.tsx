"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Brain,
  Flower2,
  Heart,
  Languages,
  Leaf,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  WifiOff,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface LandingAlbumViewProps {
  onToggleGallery?: () => void;
}

const photos = {
  elder: "/memora-assets/patient_elder_activity.jpg",
  family: "/memora-assets/caregiver_family_memory.jpg",
  community: "/memora-assets/asha_health_worker.jpg",
};

export function LandingAlbumView({ onToggleGallery }: LandingAlbumViewProps) {
  const t = useTranslations("Landing");
  const tCommon = useTranslations("Common");
  const tRoles = useTranslations("Roles");

  const roleCards = [
    {
      href: "/play",
      title: tRoles("patientTitle"),
      description: tRoles("patientSubtitle"),
      image: photos.elder,
      icon: Flower2,
      iconColor: "var(--primary)",
      iconBackground: "var(--primary-light)",
    },
    {
      href: "/care",
      title: tRoles("caregiverTitle"),
      description: tRoles("caregiverSubtitle"),
      image: photos.family,
      icon: Heart,
      iconColor: "var(--accent-dark)",
      iconBackground: "var(--accent-light)",
    },
    {
      href: "/asha",
      title: tRoles("ashaTitle"),
      description: tRoles("ashaSubtitle"),
      image: photos.community,
      icon: Stethoscope,
      iconColor: "var(--success)",
      iconBackground: "var(--success-light)",
    },
  ];

  const steps = [
    { title: tRoles("patientTitle"), description: t("chapter1Body"), icon: Brain },
    { title: tRoles("caregiverTitle"), description: t("chapter2Body"), icon: Heart },
    { title: tRoles("ashaTitle"), description: t("chapter3Body"), icon: Stethoscope },
  ];

  const trustPoints = [
    { title: t("trust1"), description: t("trust1Desc"), icon: WifiOff },
    { title: t("trust2"), description: t("trust2Desc"), icon: ShieldCheck },
    { title: t("trust3"), description: t("trust3Desc"), icon: Languages },
  ];

  return (
    <div className="w-full flex-1" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <section aria-labelledby="hero-heading" className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 py-8 sm:py-10 lg:min-h-[530px] lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:py-12">
          <div className="max-w-2xl py-2 lg:py-8">
            <div
              className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
              style={{
                background: "var(--primary-light)",
                borderColor: "var(--border-soft)",
                color: "var(--primary-dark)",
              }}
            >
              <Leaf size={18} aria-hidden="true" />
              <span>{t("trust3")}</span>
            </div>

            <h1
              id="hero-heading"
              className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "var(--primary-dark)" }}
            >
              {tCommon("appName")}
            </h1>
            <p className="mt-4 text-2xl font-bold leading-snug sm:text-3xl" style={{ color: "var(--ink)" }}>
              {t("tagline")}
            </p>
            <p className="mt-4 max-w-xl text-lg leading-7" style={{ color: "var(--ink-soft)" }}>
              {t("heroDesc")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#roles-section"
                className="inline-flex min-h-14 items-center gap-3 rounded-full px-6 text-base font-bold no-underline shadow-sm transition-colors hover:brightness-95"
                style={{ background: "var(--primary)", color: "var(--primary-ink)" }}
              >
                <span>{t("getStarted")}</span>
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-14 items-center gap-3 rounded-full border px-5 text-base font-semibold no-underline transition-colors hover:bg-[var(--surface)]"
                style={{ borderColor: "var(--border)", color: "var(--ink)" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--surface)", color: "var(--primary)" }}>
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <span>{t("howItWorks")}</span>
              </a>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--radius-card)] border-2 shadow-sm sm:min-h-[390px] lg:min-h-[450px]" style={{ borderColor: "var(--border)" }}>
            <Image
              src={photos.elder}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--ink) 50%, transparent), transparent 58%)" }} />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex items-center gap-3 rounded-2xl border p-2.5 shadow-sm backdrop-blur-sm sm:p-3" style={{ background: "var(--surface)", borderColor: "var(--border-soft)" }}>
                <div className="relative h-14 w-16 overflow-hidden rounded-xl sm:h-16 sm:w-20">
                  <Image src={photos.family} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="pr-1">
                  <Heart size={18} style={{ color: "var(--accent-dark)" }} aria-hidden="true" />
                  <span className="mt-1 block text-xs font-bold sm:text-sm" style={{ color: "var(--ink)" }}>{tRoles("caregiverTitle")}</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border shadow-sm sm:h-14 sm:w-14" style={{ background: "var(--accent-light)", borderColor: "var(--accent)", color: "var(--primary-dark)" }}>
                <Brain size={25} aria-hidden="true" />
              </div>
            </div>
            <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm sm:right-6 sm:top-6 sm:h-14 sm:w-14" style={{ background: "var(--surface)", borderColor: "var(--border-soft)", color: "var(--primary)" }}>
              <Leaf size={25} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="roles-section"
        aria-labelledby="roles-heading"
        className="scroll-mt-24 mx-auto my-8 w-[calc(100%-2rem)] max-w-[1440px] rounded-[var(--radius-card)] border-2 px-4 pb-8 pt-7 sm:my-10 sm:w-[calc(100%-3rem)] sm:px-6 sm:pb-10 sm:pt-8 lg:px-8 lg:pt-10"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div className="flex items-center gap-4">
              <span className="h-1 w-12 rounded-full" style={{ background: "var(--primary)" }} aria-hidden="true" />
              <h2 id="roles-heading" className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--ink)" }}>
                {t("chooseRole")}
              </h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--ink-muted)" }}>
              {tRoles("selectRole")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {roleCards.map((role) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.href}
                  href={role.href}
                  className="group flex min-h-full flex-col overflow-hidden rounded-[var(--radius-card)] border-2 p-3 no-underline shadow-sm transition-shadow hover:shadow-md"
                  style={{ background: "var(--bg)", borderColor: "var(--border)" }}
                >
                  <div className="relative h-48 overflow-hidden rounded-[var(--radius-md)] sm:h-56">
                    <Image
                      src={role.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-start gap-3 px-2 pb-2 pt-4 sm:px-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: role.iconBackground, color: role.iconColor }}>
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-extrabold leading-snug sm:text-xl" style={{ color: "var(--ink)" }}>{role.title}</span>
                      <span className="mt-1 block text-base leading-6 sm:text-lg" style={{ color: "var(--ink-soft)" }}>{role.description}</span>
                    </span>
                    <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors group-hover:bg-[var(--primary-light)]" style={{ color: "var(--primary)", borderColor: "var(--border)" }}>
                      <ArrowRight size={20} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <Sparkles size={21} aria-hidden="true" />
            </span>
            <h2 id="how-heading" className="text-3xl font-extrabold sm:text-4xl" style={{ color: "var(--ink)" }}>{t("howItWorks")}</h2>
          </div>

          <div className="rounded-[var(--radius-card)] border bg-white p-4 shadow-sm sm:p-5" style={{ borderColor: "var(--border)" }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="rounded-[var(--radius-card)] bg-transparent p-3 sm:p-5"
                    style={{ border: "none" }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: "var(--primary-light)", borderColor: "var(--primary)", color: "var(--primary)" }}>
                        <Icon size={23} aria-hidden="true" />
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-extrabold" style={{ background: "var(--primary-light)", borderColor: "var(--primary)", color: "var(--primary-dark)" }}>0{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>{step.title}</h3>
                    <p className="mt-2 text-base leading-7 sm:text-lg" style={{ color: "var(--ink-soft)" }}>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="#roles-section" className="inline-flex min-h-14 items-center gap-3 rounded-full px-7 text-base font-bold no-underline shadow-sm transition-colors hover:brightness-95" style={{ background: "var(--primary)", color: "var(--primary-ink)" }}>
              <span>{t("getStarted")}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section aria-label={t("chooseRole")} className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 rounded-[var(--radius-card)] border-2 p-4 sm:grid-cols-3 sm:p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="flex items-center gap-3 rounded-[var(--radius-md)] p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-bold" style={{ color: "var(--ink)" }}>{point.title}</span>
                  <span className="mt-0.5 block text-base leading-6" style={{ color: "var(--ink-soft)" }}>{point.description}</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-7" style={{ color: "var(--ink-muted)" }}>
          {tCommon("disclaimer")}
        </p>
      </section>

      {onToggleGallery && (
        <div className="flex justify-center px-4 pb-10">
          <button
            type="button"
            onClick={onToggleGallery}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors hover:bg-[var(--surface)]"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--ink-soft)" }}
          >
            <Sparkles size={17} aria-hidden="true" />
            <span>{tCommon("switchToGallery")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
