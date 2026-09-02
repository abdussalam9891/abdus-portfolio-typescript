"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  disposeEntrySfx,
  playEntryBlip,
  primeEntrySfx,
} from "@/lib/entry-sfx";

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
 * The sequence waits for a tap rather than starting on load. That is not a
 * stylistic beat: browsers keep audio suspended until the visitor has
 * interacted, so a self-starting intro can only ever play silently. Gating
 * it on one gesture is what lets the transition blips — and the ambient
 * track, which arms off the same event — actually be heard. The gate is a
 * tap anywhere, plus a Skip that leaves for the site outright, so it never
 * becomes a real barrier between a client and the contact details
 * (CLAUDE.md, "What NOT to do").
 *
 * GSAP itself is dynamically imported rather than statically — this
 * component lives in the root layout (every route), so a static import
 * would ship GSAP's JS in the critical bundle for every page view even
 * when the animation never plays (returning visitors, reduced motion,
 * every route besides the homepage's first paint).
 */
export function EntrySequence() {
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const playRef = useRef<(() => void) | null>(null);
  // A ref as well as state: the gesture handler and the GSAP callback both
  // need the current value synchronously, before a re-render lands.
  const startedRef = useRef(false);

  const enter = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    // Must happen inside the gesture handler — this is the call that
    // unlocks Web Audio for the rest of the sequence.
    primeEntrySfx();
    setStarted(true);
    // If GSAP has not finished loading, the timeline starts itself as soon
    // as it is built (it checks startedRef).
    playRef.current?.();
  }, []);

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

    // Skippable from the first frame, gate included: this leaves for the
    // site outright rather than fast-forwarding through the animation.
    skipRef.current = finish;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>(".entry-word");

        // Each spelling hands off to the next: the outgoing word slides on
        // to the left as the incoming one arrives from the right, over the
        // same beat, so it reads as one name transforming script by script
        // rather than six separate words being swapped in.
        const IN = 0.15;
        const HOLD = 0.03;
        const STEP = IN + HOLD;

        gsap.set(words, { opacity: 0, xPercent: 22, filter: "blur(8px)" });

        const tl = gsap.timeline({ paused: true, onComplete: finish });

        words.forEach((word, i) => {
          const at = STEP * i;
          tl.to(
            word,
            {
              opacity: 1,
              xPercent: 0,
              filter: "blur(0px)",
              duration: IN,
              ease: "power3.out",
              onStart: () => playEntryBlip(i),
            },
            at
          );

          if (i < words.length - 1) {
            tl.to(
              word,
              {
                opacity: 0,
                xPercent: -22,
                filter: "blur(8px)",
                duration: IN,
                ease: "power3.in",
              },
              at + STEP
            );
          }
        });

        // Wipes off to the right rather than lifting up.
        tl.to(
          containerRef.current,
          {
            xPercent: 100,
            duration: 0.35,
            ease: "power4.inOut",
          },
          "+=0.1"
        );

        playRef.current = () => tl.play();
        // Tapped while GSAP was still in flight — start straight away.
        if (startedRef.current) tl.play();
      }, containerRef);
    });

    return () => {
      cancelled = true;
      disposeEntrySfx();
      ctx?.revert();
    };
  }, []);

  // Keyboard equivalent of the tap. Escape leaves for the site; Tab is left
  // alone so the Skip button stays reachable by keyboard.
  useEffect(() => {
    if (!visible || started) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") return;
      if (event.key === "Escape") {
        skipRef.current();
        return;
      }
      enter();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enter, started, visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="entry-overlay fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
      onClick={() => (started ? skipRef.current() : enter())}
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
        className="absolute top-4 right-4 rounded-full border border-accent/30 px-3 py-2 text-xs uppercase tracking-wide text-accent-bright/80 transition-colors duration-300 hover:border-accent/60 hover:text-accent-bright sm:top-6 sm:right-6 sm:text-sm"
      >
        {started ? "Skip" : "Skip intro"}
      </button>

      <div className="relative h-12 w-full max-w-2xl px-4 sm:h-16 sm:px-6 md:h-24">
        {NAME_SEQUENCE.map(({ text, lang, rtl }, i) => (
          <span
            key={i}
            lang={lang}
            dir={rtl ? "rtl" : "ltr"}
            // Hidden before GSAP loads as well, so the gate never shows six
            // spellings stacked on top of each other.
            style={{ opacity: 0 }}
            className="entry-word text-gradient-accent absolute inset-0 flex items-center justify-center whitespace-nowrap text-2xl font-semibold sm:text-3xl md:text-5xl"
          >
            {text}
          </span>
        ))}
      </div>

      {!started && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            enter();
          }}
          className="absolute inset-x-0 bottom-[28%] mx-auto flex animate-pulse flex-col items-center gap-2 text-center"
        >
          <span className="text-gradient-accent text-lg font-semibold sm:text-xl md:text-2xl">
            Tap to enter
          </span>
          <span className="text-[0.7rem] uppercase tracking-[0.14em] text-foreground/45">
            Best with sound on
          </span>
        </button>
      )}
    </div>
  );
}
