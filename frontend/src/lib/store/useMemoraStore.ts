"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type DisplayMode = "gallery" | "album";
export type FontSizePreference = "medium" | "large" | "xlarge";
export type VoiceLanguage = "auto" | "en" | "hi" | "as" | "bn" | "brx" | "mni" | "gu" | "kn" | "ml" | "mr" | "or" | "pa" | "ta" | "te" | "ur";

export interface MemoraState {
  calmMode: boolean;
  displayMode: DisplayMode;
  fontSize: FontSizePreference;
  highContrast: boolean;
  audioAssistance: boolean;
  voiceLanguage: VoiceLanguage;
  toggleCalmMode: () => void;
  setCalmMode: (calm: boolean) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setFontSize: (size: FontSizePreference) => void;
  setHighContrast: (high: boolean) => void;
  setAudioAssistance: (audio: boolean) => void;
  setVoiceLanguage: (language: VoiceLanguage) => void;
  resetPreferences: () => void;
}

function getInitialCalmMode(): boolean {
  if (typeof window === "undefined") return false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSaveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const isLowMemory = typeof (navigator as unknown as { deviceMemory?: number }).deviceMemory === "number" &&
    (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4;

  return prefersReducedMotion || isSaveData || isLowMemory;
}

const memoryStorage = {
  getItem: (_name: string) => null,
  setItem: (_name: string, _value: string) => {},
  removeItem: (_name: string) => {},
};

export const useMemoraStore = create<MemoraState>()(
  persist(
    (set) => ({
      calmMode: getInitialCalmMode(),
      displayMode: getInitialCalmMode() ? "album" : "gallery",
      fontSize: "medium",
      highContrast: false,
      audioAssistance: true,
      voiceLanguage: "auto",

      toggleCalmMode: () =>
        set((state) => {
          const nextCalm = !state.calmMode;
          return {
            calmMode: nextCalm,
            displayMode: nextCalm ? "album" : "gallery",
          };
        }),

      setCalmMode: (calm: boolean) =>
        set(() => ({
          calmMode: calm,
          displayMode: calm ? "album" : "gallery",
        })),

      setDisplayMode: (mode: DisplayMode) =>
        set((state) => ({
          displayMode: mode,
          calmMode: mode === "album" ? state.calmMode : false,
        })),

      setFontSize: (fontSize: FontSizePreference) => set({ fontSize }),
      setHighContrast: (highContrast: boolean) => set({ highContrast }),
      setAudioAssistance: (audioAssistance: boolean) => set({ audioAssistance }),
      setVoiceLanguage: (voiceLanguage: VoiceLanguage) => set({ voiceLanguage }),
      resetPreferences: () => {
        const calmMode = getInitialCalmMode();
        set({
          calmMode,
          displayMode: calmMode ? "album" : "gallery",
          fontSize: "medium",
          highContrast: false,
          audioAssistance: true,
          voiceLanguage: "auto",
        });
      },
    }),
    {
      name: "memora-user-preferences",
      storage: createJSONStorage(() => (typeof window !== "undefined" && window.localStorage ? window.localStorage : memoryStorage)),
    }
  )
);
