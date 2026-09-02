"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SESSION_KEY = "entry-sequence-played";

// Native-script spellings verified against the physicist's Wikipedia
// interlanguage links (same name, cross-checked per script/language).
interface LocalizedName {
  text: string;
  lang: string;
  rtl?: boolean;
}

const NAME_SEQUENCE: LocalizedName[] = [
  { text: "Abdus Salam", lang: "en" },
  { text: "अब्दुस सलाम", lang: "hi" },
  { text: "আবদুস সালাম", lang: "bn" },
  { text: "عبد السلام", lang: "ur", rtl: true },
  { text: "அப்துஸ் சலாம்", lang: "ta" },
  { text: "అబ్దుస్ సలం", lang: "te" },
];

/**
 * One-time scripted intro, GSAP-only (per CLAUDE.md — GSAP is reserved for
 * this, everything else uses Framer Motion). Renders identically on server
 * and first client paint (avoids a hydration mismatch), then a
 * useLayoutEffect resolves session/reduced-motion state and hides itself
 * synchronously before the browser paints, so returning visitors and
 * reduced-motion users never see it flash in.
 *
 * GSAP itself is dynamically imported rather than statically — this
 * component lives in the root layout (every route), so a static import
 * would ship GSAP's JS in the critical bundle for every page view even
 * when the animation never plays (returning visitors, reduced motion,
 * every route besides the homepage's first paint).
 */
export function EntrySequence() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "true";
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "true");
      setVisible(false);
    };

    if (alreadyPlayed || prefersReduced) {
      finish();
      return;
    }

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>(".entry-word");
        gsap.set(words, { opacity: 0, scale: 0.7, yPercent: 40 });

        const tl = gsap.timeline({ onComplete: finish });

        words.forEach((word, i) => {
          const isLast = i === words.length - 1;
          tl.to(word, {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            duration: 0.32,
            ease: "back.out(1.8)",
          });
          if (!isLast) {
            tl.to(
              word,
              {
                opacity: 0,
                scale: 1.15,
                duration: 0.22,
                ease: "power3.in",
              },
              "+=0.22"
            );
          }
        });

        tl.to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 0.6,
            ease: "power4.inOut",
          },
          "+=0.35"
        );

        skipRef.current = () => tl.progress(1);
      }, containerRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="entry-overlay fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
      onClick={() => skipRef.current()}
    >
      {/* Same ambient green as the page behind it, so the overlay lifting
          away reads as a reveal rather than a hard cut between two grounds. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 30rem at 50% 50%, rgb(34 197 94 / 0.18), transparent 65%)",
        }}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          skipRef.current();
        }}
        className="absolute top-6 right-6 text-sm uppercase tracking-wide text-accent-bright/80 transition-colors duration-300 hover:text-accent-bright"
      >
        Skip
      </button>
      <div className="relative h-16 w-full max-w-2xl px-6 md:h-24">
        {NAME_SEQUENCE.map(({ text, lang, rtl }, i) => (
          <span
            key={i}
            lang={lang}
            dir={rtl ? "rtl" : "ltr"}
            className="entry-word text-gradient-accent absolute inset-0 flex items-center justify-center whitespace-nowrap text-3xl font-semibold md:text-5xl"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
