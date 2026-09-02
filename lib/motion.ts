import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants. Import these everywhere instead of
 * hand-rolling variants per component (see CLAUDE.md coding conventions).
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Crossfade for swapping content in place (e.g. the active preview image in
 * WorkShowcase). Pair with AnimatePresence mode="wait" and a per-item key.
 */
export const crossFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * For chrome that appears and disappears in place — the nav's back button,
 * which is only there off the home page. A short horizontal slide: header
 * controls shouldn't travel the way `fadeUp` does.
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Typewriter reveal: parent orchestrates a left-to-right per-character
 * stagger on enter and a quick reverse-order stagger on exit. Used by
 * TypeReveal (components/ui/TypeReveal.tsx) — don't hand-roll elsewhere.
 */
const TYPE_STAGGER_S = 0.035;
const TYPE_DELAY_S = 0.05;
const TYPE_CHAR_DURATION_S = 0.25;

export const typeContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TYPE_STAGGER_S,
      delayChildren: TYPE_DELAY_S,
    },
  },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

export const typeChar: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TYPE_CHAR_DURATION_S, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, x: 6, transition: { duration: 0.15 } },
};

/**
 * How long `typeContainer` + `typeChar` take to reveal `charCount`
 * characters. Derived from the variants above so callers that need to know
 * when typing lands (TypeReveal's completion, the footer's quote rotation)
 * stay in sync if the timing is retuned.
 */
export function typeDurationMs(charCount: number) {
  const seconds =
    TYPE_DELAY_S +
    Math.max(0, charCount - 1) * TYPE_STAGGER_S +
    TYPE_CHAR_DURATION_S;
  return seconds * 1000;
}
