"use client";

import { useCallback, useEffect, useState } from "react";

const FEATURES = [
  {
    title: "4× faster than typing",
    description:
      "After 150 years of the same keyboard, voice that actually works is finally here. Speak naturally and let GhostWriter handle the rest.",
    visual: (
      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/5">
            <span className="text-xs text-white/50">Keyboard</span>
            <span className="mt-1 text-2xl font-semibold text-white">
              45 <span className="text-sm font-normal text-white/50">wpm</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-28 w-36 flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/15">
            <span className="text-xs text-accent/70">GhostWriter</span>
            <span className="mt-1 text-2xl font-semibold text-white">
              220 <span className="text-sm font-normal text-white/50">wpm</span>
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "AI auto edits",
    description:
      "Speak naturally and GhostWriter transcribes and edits your voice instantly. Rambled thoughts become clear, perfectly formatted text.",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs leading-relaxed text-white/40 line-through">
            uh yeah so I think we should probably um reach out to Jenny from
            legal...
          </p>
        </div>
        <div className="flex items-center justify-center">
          <svg
            className="h-5 w-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/10 p-3">
          <p className="text-xs leading-relaxed text-white/90">
            Let&apos;s reach out to Jenny from Legal — she may have mentioned
            the NDA isn&apos;t finalized yet.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Personal dictionary",
    description:
      "GhostWriter automatically learns your unique words — names, jargon, abbreviations — and adds them to your personal dictionary.",
    visual: (
      <div className="space-y-2">
        {["Victor", "GhostWriter", "SaaS", "Convex", "TypeScript"].map(
          (word) => (
            <div
              key={word}
              className="flex items-center rounded-full border border-white/10 bg-accent/15 px-4 py-1.5"
            >
              <span className="text-sm font-medium text-white">{word}</span>
            </div>
          ),
        )}
      </div>
    ),
  },
  {
    title: "Snippet library",
    description:
      "Create voice shortcuts for the things you say over and over. Speak a cue and get the full formatted text instantly.",
    visual: (
      <div className="space-y-2">
        {[
          { name: "Calendar", preview: "Book a 30-minute call here…" },
          { name: "Support intro", preview: "Hi! Thanks for reaching out…" },
          { name: "Elevator pitch", preview: "GhostWriter turns speech into…" },
        ].map((s) => (
          <div
            key={s.name}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <p className="text-sm font-medium text-white">{s.name}</p>
            <p className="mt-0.5 text-xs text-white/40">{s.preview}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Different tones for each app",
    description:
      "GhostWriter automatically adjusts tone based on the app you're using. Sound like you — not a robot.",
    visual: (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full border border-white/15 bg-white/5 px-5 py-2">
          <span className="text-sm text-white/80">🎙️ &quot;hello&quot;</span>
        </div>
        <svg
          className="h-10 w-10 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
        <div className="flex gap-3">
          {[
            { app: "📧", label: "Hello." },
            { app: "💬", label: "Hey!" },
            { app: "📝", label: "Dear…" },
          ].map((t) => (
            <div
              key={t.app}
              className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5"
            >
              <span className="text-lg">{t.app}</span>
              <span className="text-xs text-white/60">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "100+ languages",
    description:
      "GhostWriter automatically detects and transcribes in your language, letting you move between them — just like you do.",
    visual: (
      <div className="flex flex-wrap justify-center gap-3">
        {[
          "🇺🇸",
          "🇬🇧",
          "🇫🇷",
          "🇩🇪",
          "🇪🇸",
          "🇮🇹",
          "🇧🇷",
          "🇯🇵",
          "🇰🇷",
          "🇮🇳",
          "🇩🇰",
          "🇷🇺",
        ].map((flag, i) => (
          <span
            key={i}
            className="text-2xl transition-transform hover:scale-125"
          >
            {flag}
          </span>
        ))}
      </div>
    ),
  },
];

export function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % FEATURES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const feature = FEATURES[active];

  return (
    <div
      className="flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Feature card */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-6">
        {/* Visual */}
        <div className="mb-6 flex min-h-45 items-center justify-center">
          {feature.visual}
        </div>

        {/* Text */}
        <h3 className="mb-2 text-center text-xl font-semibold text-white">
          {feature.title}
        </h3>
        <p className="max-w-xs text-center text-sm leading-relaxed text-white/60">
          {feature.description}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 pb-6">
        {FEATURES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-6 bg-accent"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
