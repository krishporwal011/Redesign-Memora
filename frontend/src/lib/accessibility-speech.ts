import type { VoiceLanguage } from "@/lib/store/useMemoraStore";

const SPEECH_TAGS: Record<Exclude<VoiceLanguage, "auto">, string> = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  brx: "brx-IN",
  mni: "mni-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  or: "or-IN",
  pa: "pa-IN",
  ta: "ta-IN",
  te: "te-IN",
  ur: "ur-IN",
};

export function getSpeechLanguageTag(
  preference: VoiceLanguage,
  pageLocale = "en",
): string {
  if (preference !== "auto") return SPEECH_TAGS[preference];
  return SPEECH_TAGS[pageLocale as Exclude<VoiceLanguage, "auto">] ?? "en-IN";
}

export function speakLongText(text: string, language: string, onEnd?: () => void): boolean {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return false;
  }

  window.speechSynthesis.cancel();
  const chunks = text.match(/[^.!?।]+[.!?।]*/gu) ?? [text];
  const utterances: SpeechSynthesisUtterance[] = [];
  let chunk = "";

  for (const sentence of chunks) {
    const words = sentence.trim().split(/\s+/);
    for (const word of words) {
      const next = `${chunk} ${word}`.trim();
      if (next.length > 220 && chunk) {
        utterances.push(new SpeechSynthesisUtterance(chunk));
        chunk = word;
      } else {
        chunk = next;
      }
    }
  }
  if (chunk) utterances.push(new SpeechSynthesisUtterance(chunk));

  utterances.forEach((utterance, index) => {
    utterance.lang = language;
    utterance.rate = 0.88;
    if (index === utterances.length - 1 && onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  });
  return utterances.length > 0;
}
