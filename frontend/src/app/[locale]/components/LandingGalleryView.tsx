"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  WifiOff,
  Languages,
  BookOpen,
  Activity,
  Heart,
  Eye,
  Camera,
  Layers,
  ChevronDown,
  Flower2,
  CheckCircle2,
  Calendar,
  MapPin,
  Volume2,
  Play,
} from "lucide-react";
import { useMemoraStore } from "@/lib/store/useMemoraStore";

interface LandingGalleryViewProps {
  onToggleAlbum: () => void;
}

const REMINISCENCE_MEMORIES = [
  {
    id: "bihu",
    title: "Rongali Bihu (1985) · Tezpur",
    category: "Family Reminiscence & Song",
    location: "Tezpur Courtyard, Assam",
    year: "1985",
    description: "Caregiver-approved family celebration memory with traditional dhol drum rhythms, buffalo horn pepa tunes, and joyful courtyard gathering.",
    imageUrl: "/memora-assets/Gemini_Generated_Image_xjiaitxjiaitxjia.png",
    tag: "Caregiver Approved",
    audioHint: "Rongali Bihu Dhol Rhythms (Assamese Folk)",
  },
  {
    id: "majuli",
    title: "Brahmaputra Ferry Crossing · Majuli",
    category: "River Folklore & Heritage",
    location: "Kamalabari Ghat, Majuli",
    year: "1978",
    description: "Serene morning voyage across the mighty Brahmaputra river to the sattras, accompanied by water folklore and morning river songs.",
    imageUrl: "/memora-assets/Gemini_Generated_Image_xjiaitxjiaitxjia (1).png",
    tag: "River Heritage",
    audioHint: "Brahmaputra Water Murmurs & Boat Songs",
  },
  {
    id: "courtyard",
    title: "Grandmother's Morning Tea · Dibrugarh",
    category: "Sensory Taste & Smell Recall",
    location: "Estate Veranda, Dibrugarh",
    year: "1992",
    description: "Freshly brewed CTC Assam tea served in bell-metal kansa cups alongside homemade pitha on a calm misty morning.",
    imageUrl: "/memora-assets/Gemini_Generated_Image_xjiaitxjiaitxjia (2).png",
    tag: "Sensory Anchor",
    audioHint: "Veranda Rain & Morning Birdsong",
  },
  {
    id: "handloom",
    title: "Traditional Muga Silk Loom · Sualkuchi",
    category: "Tactile Textile Memory",
    location: "Silk Village, Sualkuchi",
    year: "1988",
    description: "Rhythmic clicking of the wooden shuttle weaving sacred golden muga silk motifs with traditional floral borders.",
    imageUrl: "/memora-assets/Gemini_Generated_Image_xjiaitxjiaitxjia (4).png",
    tag: "Textile Memory",
    audioHint: "Wooden Handloom Shuttle Rhythm",
  },
];

const HERO_CULTURAL_ITEMS = [
  {
    name: "Assamese Gamosa",
    category: "Woven Textile Motif",
    imageUrl: "/memora-assets/Gemini_Generated_Image_af76u7af76u7af76.png",
  },
  {
    name: "Garden Chai Leaf",
    category: "Assam Tea Heritage",
    imageUrl: "/memora-assets/Gemini_Generated_Image_af76u7af76u7af76 (1).png",
  },
  {
    name: "Bihu Dhol Drum",
    category: "Folk Rhythm Anchor",
    imageUrl: "/memora-assets/Gemini_Generated_Image_af76u7af76u7af76 (2).png",
  },
];

export function LandingGalleryView({ onToggleAlbum }: LandingGalleryViewProps) {
  const t = useTranslations("Landing");
  const tCommon = useTranslations("Common");
  const tRoles = useTranslations("Roles");
  const { calmMode, toggleCalmMode } = useMemoraStore();
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [activeMemoryIdx, setActiveMemoryIdx] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: calmMode ? "auto" : "smooth" });
    }
  };

  const activeMemory = REMINISCENCE_MEMORIES[activeMemoryIdx];

  const handleToggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    if (!audioPlaying) {
      setTimeout(() => setAudioPlaying(false), 3000);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden transition-colors duration-500"
      style={{
        background: "var(--ink)",
        color: "var(--bg)",
        cursor: calmMode ? "none" : "auto",
      }}
    >
      {/* ── Persistent Corner HUD ── */}
      <aside
        aria-label="Experience HUD"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-2 rounded-full border shadow-xl backdrop-blur-md"
        style={{
          background: "rgba(26, 25, 23, 0.85)",
          borderColor: "rgba(230, 244, 243, 0.2)",
        }}
      >
        <button
          type="button"
          onClick={() => scrollToSection("roles-chapter")}
          className="px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
          style={{
            background: "var(--primary)",
            color: "var(--primary-ink)",
            minHeight: "44px",
          }}
          aria-label={t("chooseRole")}
        >
          {t("chooseRole")}
        </button>

        <button
          type="button"
          onClick={onToggleAlbum}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer"
          style={{
            background: "transparent",
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "var(--bg)",
            minHeight: "44px",
          }}
          aria-label={tCommon("albumMode")}
        >
          <BookOpen size={14} aria-hidden="true" />
          <span className="hidden sm:inline">{tCommon("albumMode")}</span>
        </button>

        <button
          type="button"
          onClick={toggleCalmMode}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer"
          style={{
            background: calmMode ? "var(--accent)" : "transparent",
            borderColor: calmMode ? "var(--accent-light)" : "rgba(255, 255, 255, 0.2)",
            color: calmMode ? "var(--accent-ink)" : "var(--bg)",
            minHeight: "44px",
          }}
          aria-pressed={calmMode}
          aria-label={calmMode ? tCommon("calmModeOn") : tCommon("calmModeOff")}
        >
          <Activity size={14} aria-hidden="true" />
          <span>{calmMode ? tCommon("calmModeOn") : tCommon("calmMode")}</span>
        </button>
      </aside>

      {/* ── Optional Cursor Follower on Desktop (Fine Pointer Only) ── */}
      {isFinePointer && (
        <div
          className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out hidden lg:block"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: calmMode ? 1 : 1,
          }}
        >
          <div
            className="w-10 h-10 rounded-full border flex items-center justify-center text-[10px] font-extrabold uppercase tracking-widest shadow-lg"
            style={{
              borderColor: "var(--accent)",
              background: "rgba(232, 163, 61, 0.2)",
              color: "var(--accent)",
              backdropFilter: "blur(2px)",
            }}
          >
            Explore
          </div>
        </div>
      )}

      {/* ── CHAPTER 1: The Memory Gap (Hero with Cultural Preview) ── */}
      <section
        className="relative flex flex-col justify-center items-center text-center px-4 py-12 md:py-20 border-b overflow-hidden"
        style={{ borderColor: "rgba(230, 244, 243, 0.15)" }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider"
            style={{
              borderColor: "rgba(232, 163, 61, 0.4)",
              background: "rgba(232, 163, 61, 0.1)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>{t("chapter1Title")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            {t("tagline")}
          </h1>

          <p className="text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto opacity-90">
            {t("heroDesc")}
          </p>

          {/* Interactive Cultural Anchor Ribbon */}
          <div className="pt-2 pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider block mb-3 opacity-75">
              {t("trust3")}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {HERO_CULTURAL_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2 rounded-full border bg-white/5 backdrop-blur-sm shadow-sm hover:border-[var(--accent)] transition-all"
                  style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <div className="text-left text-xs">
                    <span className="font-bold block text-white">{item.name}</span>
                    <span className="text-[10px] opacity-70 block">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("roles-chapter")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base shadow-lg transition-transform active:scale-95 cursor-pointer hover:shadow-xl"
              style={{
                background: "var(--accent)",
                color: "var(--accent-ink)",
                minHeight: "56px",
              }}
            >
              <span>{t("chooseRole")}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("memories-chapter")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm border transition-colors hover:bg-white/10 cursor-pointer"
              style={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "var(--bg)",
                minHeight: "48px",
              }}
            >
              <span>{t("chapter2Title")}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 2: Your Own Memories (Interactive Cultural Reminiscence) ── */}
      <section
        id="memories-chapter"
        className="px-4 py-16 md:py-24 max-w-6xl mx-auto border-b"
        style={{ borderColor: "rgba(230, 244, 243, 0.15)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Narrative & Navigation */}
          <div className="lg:col-span-5 space-y-4">
            <span
              className="text-xs font-bold uppercase tracking-wider block"
              style={{ color: "var(--accent)" }}
            >
              {t("chapter2Title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("chapter2Title")}
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-85">
              {t("chapter2Body")}
            </p>

            {/* Interactive Memory Thumbnails Selector */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                Click to switch memory experience:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {REMINISCENCE_MEMORIES.map((mem, idx) => (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => setActiveMemoryIdx(idx)}
                    className="flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer"
                    style={{
                      background: activeMemoryIdx === idx ? "rgba(232, 163, 61, 0.15)" : "rgba(255, 255, 255, 0.04)",
                      borderColor: activeMemoryIdx === idx ? "var(--accent)" : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold truncate block text-white">
                        {mem.title.split("·")[0]}
                      </span>
                      <span className="text-[10px] opacity-70 truncate block">
                        {mem.category.split("&")[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3">
              <Link
                href="/house"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold border transition-transform active:scale-95 no-underline shadow-sm"
                style={{
                  background: "rgba(47, 111, 107, 0.3)",
                  borderColor: "var(--primary-light)",
                  color: "var(--bg)",
                  minHeight: "48px",
                }}
              >
                <Layers size={18} aria-hidden="true" />
                <span>Visit 3D Memory House</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Featured Photographic Display */}
          <div className="lg:col-span-7">
            <div
              className="rounded-[var(--radius-card)] p-4 sm:p-6 border-2 shadow-2xl space-y-4 overflow-hidden relative"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                borderColor: "rgba(230, 244, 243, 0.2)",
              }}
            >
              {/* Photo Display with Smooth Active Transition */}
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden relative shadow-inner border border-white/10 group">
                <img
                  key={activeMemory.id}
                  src={activeMemory.imageUrl}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-black bg-[var(--accent)] shadow-md">
                    {activeMemory.tag}
                  </span>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-medium">
                    <Calendar size={13} />
                    <span>{activeMemory.year}</span>
                  </div>
                </div>

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--accent-light)]">
                    <MapPin size={13} />
                    <span>{activeMemory.location}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    {activeMemory.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                    {activeMemory.description}
                  </p>
                </div>
              </div>

              {/* Interactive Audio Hint Simulation */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
                style={{
                  background: "rgba(47, 111, 107, 0.2)",
                  borderColor: "rgba(47, 111, 107, 0.4)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                    style={{
                      background: audioPlaying ? "var(--success)" : "var(--accent)",
                      color: "var(--ink)",
                    }}
                    aria-label="Simulate audio playback"
                  >
                    {audioPlaying ? <Volume2 size={16} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                  <div>
                    <span className="font-bold block text-white">
                      {audioPlaying ? "Playing Audio Sample..." : "Cultural Audio Anchor"}
                    </span>
                    <span className="text-[11px] opacity-75 block">
                      {activeMemory.audioHint}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-[var(--accent)]">
                  Tier-1 Speech Fallback
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 3: Three Connected Roles (The Interactive Hub) ── */}
      <section
        id="roles-chapter"
        className="px-4 py-16 md:py-24 max-w-6xl w-full mx-auto border-b"
        style={{ borderColor: "rgba(230, 244, 243, 0.15)" }}
      >
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span
            className="text-xs font-bold uppercase tracking-wider block"
            style={{ color: "var(--accent)" }}
          >
              {t("chapter3Title")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            {t("chooseRole")}
          </h2>
          <p className="text-base md:text-lg opacity-85">
            {tRoles("selectRole")}
          </p>
        </div>

        {/* 3 Role Cards Grid with Authentic Photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Patient Card */}
          <Link
            href="/play"
            className="group flex flex-col justify-between rounded-[var(--radius-card)] border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl no-underline overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--primary-light)",
            }}
          >
            <div>
              {/* Photo Header */}
              <div className="w-full h-48 sm:h-52 relative overflow-hidden">
                <img
                  src="/memora-assets/patient_elder_activity.jpg"
                  alt="Elder playing calm memory activity in Assam"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-black/60 backdrop-blur-md border border-white/20"
                >
                  Patient Mode
                </span>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      background: "var(--primary)",
                      borderColor: "var(--primary-light)",
                      color: "var(--primary-ink)",
                    }}
                    aria-hidden="true"
                  >
                    <Flower2 size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    {tRoles("patientTitle")}
                  </h3>
                </div>
              </div>

              {/* Card Body & Feature Highlights */}
              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed opacity-85">
                  {tRoles("patientSubtitle")}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>64px minimum touch targets</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>No timers, completely self-paced</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>Local language audio prompts (ASR/TTS)</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-6 pt-0 mt-2 flex items-center justify-between text-sm font-bold"
              style={{ color: "var(--accent)" }}
            >
              <span>Enter Activities</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 2. Caregiver Card */}
          <Link
            href="/care"
            className="group flex flex-col justify-between rounded-[var(--radius-card)] border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl no-underline overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--accent)",
            }}
          >
            <div>
              {/* Photo Header */}
              <div className="w-full h-48 sm:h-52 relative overflow-hidden">
                <img
                  src="/memora-assets/caregiver_family_memory.jpg"
                  alt="Family caregiver sharing old photos with elder"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-black bg-[var(--accent)] font-bold shadow-md"
                >
                  Family Care
                </span>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      background: "var(--accent-dark)",
                      borderColor: "var(--accent-light)",
                      color: "var(--accent-ink)",
                    }}
                    aria-hidden="true"
                  >
                    <Heart size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    {tRoles("caregiverTitle")}
                  </h3>
                </div>
              </div>

              {/* Card Body & Feature Highlights */}
              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed opacity-85">
                  {tRoles("caregiverSubtitle")}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                    <span>Private encrypted memories vault</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                    <span>Caregiver approval of AI quiz questions</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--accent)" }} />
                    <span>14-day longitudinal trend tracking</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-6 pt-0 mt-2 flex items-center justify-between text-sm font-bold"
              style={{ color: "var(--accent)" }}
            >
              <span>Open Care Portal</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 3. ASHA Health Worker Card */}
          <Link
            href="/asha"
            className="group flex flex-col justify-between rounded-[var(--radius-card)] border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl no-underline overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--success)",
            }}
          >
            <div>
              {/* Photo Header */}
              <div className="w-full h-48 sm:h-52 relative overflow-hidden">
                <img
                  src="/memora-assets/asha_health_worker.jpg"
                  alt="ASHA worker visiting households in Assam tea garden"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <span
                  className="absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-black/60 backdrop-blur-md border border-white/20"
                >
                  Clinical Triage
                </span>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      background: "var(--success)",
                      borderColor: "var(--success-light)",
                      color: "var(--primary-ink)",
                    }}
                    aria-hidden="true"
                  >
                    <Eye size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    {tRoles("ashaTitle")}
                  </h3>
                </div>
              </div>

              {/* Card Body & Feature Highlights */}
              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed opacity-85">
                  {tRoles("ashaSubtitle")}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>Explainable triage priority ranking</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>CUSUM drift & illness suppression</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                    <span>Pure-Python clinical PDF triage export</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-6 pt-0 mt-2 flex items-center justify-between text-sm font-bold"
              style={{ color: "var(--accent)" }}
            >
              <span>Open ASHA Triage</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── CHAPTER 4: Offline & Private (DPDP 2023) ── */}
      <section
        className="px-4 py-16 md:py-20 max-w-5xl mx-auto text-center space-y-6"
      >
        <span
          className="text-xs font-bold uppercase tracking-wider block"
          style={{ color: "var(--accent)" }}
        >
          {t("chapter4Title")}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t("trust3")}
        </h2>
        <p className="text-base md:text-lg max-w-xl mx-auto opacity-85">
          {t("chapter4Body")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
          <div className="p-5 rounded-[var(--radius-md)] border border-white/10 bg-white/5 space-y-2">
            <ShieldCheck size={24} style={{ color: "var(--success)" }} />
            <h4 className="font-bold text-base">{t("trust2")}</h4>
            <p className="text-xs opacity-75">{t("trust2Desc")}</p>
          </div>

          <div className="p-5 rounded-[var(--radius-md)] border border-white/10 bg-white/5 space-y-2">
            <WifiOff size={24} style={{ color: "var(--primary-light)" }} />
            <h4 className="font-bold text-base">{t("trust1")}</h4>
            <p className="text-xs opacity-75">{t("trust1Desc")}</p>
          </div>

          <div className="p-5 rounded-[var(--radius-md)] border border-white/10 bg-white/5 space-y-2">
            <Languages size={24} style={{ color: "var(--accent)" }} />
            <h4 className="font-bold text-base">{t("trust3")}</h4>
            <p className="text-xs opacity-75">{t("heroDesc")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
