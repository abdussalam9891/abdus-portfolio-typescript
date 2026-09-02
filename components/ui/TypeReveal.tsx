"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { typeContainer, typeChar, typeDurationMs } from "@/lib/motion";

interface TypeRevealProps {
  text: string;
  reduced: boolean;
  className?: string;
  cursor?: boolean;
  /**
   * Stack an invisible copy of the full text under the animated one so the
   * block already occupies its final size while typing. Use for text that
   * wraps onto more than one line (the footer quote) — without it, each new
   * line appearing mid-type shoves the rest of the page down.
   */
  reserve?: boolean;
  onComplete?: () => void;
}

type Token =
  | { type: "space"; text: string }
  | { type: "word"; chars: { char: string; index: number }[] };

/** Splits `text` into words and the whitespace runs between them, numbering
 *  every animated character (spaces are not animated — they are invisible). */
function splitIntoWords(text: string): { tokens: Token[]; charCount: number } {
  const tokens: Token[] = [];
  let index = 0;

  for (const part of text.split(/(\s+)/)) {
    if (part === "") continue;

    if (/^\s+$/.test(part)) {
      tokens.push({ type: "space", text: part });
      continue;
    }

    tokens.push({
      type: "word",
      chars: Array.from(part).map((char) => ({ char, index: index++ })),
    });
  }

  return { tokens, charCount: index };
}

/**
 * Types `text` in left-to-right, one character at a time. Pair with
 * AnimatePresence + a `key={text}` on this component so swapping text
 * re-triggers the reveal. The cursor (if enabled) stays hidden until the
 * last character finishes, then blinks in place. Spaces are not animated —
 * they are invisible either way, and leaving them as plain text is what lets
 * lines break in the right places.
 *
 * Do not call `usePresence()` in here: it registers this component with the
 * surrounding AnimatePresence as something that must call `safeToRemove()`,
 * and since it never does, the exiting quote is never unmounted and the
 * footer goes blank after the first rotation.
 *
 * Characters are animated with a transform, so each one has to be
 * `inline-block` — which would otherwise let a line break land in the middle
 * of a word. Words are therefore grouped in `whitespace-nowrap` wrappers and
 * the spaces between them are left as plain text nodes, so wrapping happens
 * at word boundaries like normal copy.
 */
export function TypeReveal({
  text,
  reduced,
  className = "",
  cursor = true,
  reserve = false,
  onComplete,
}: TypeRevealProps) {
  const [typed, setTyped] = useState(false);
  const { tokens, charCount } = splitIntoWords(text);

  // Completion is derived from the variant timing rather than the last
  // character's onAnimationComplete: with the stagger orchestrated by the
  // parent, that callback does not reliably report the "visible" variant,
  // which left the cursor and the citation stuck at opacity 0.
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => {
      setTyped(true);
      onComplete?.();
    }, typeDurationMs(charCount));
    return () => clearTimeout(id);
    // `onComplete` is intentionally excluded: callers pass an inline arrow,
    // which would restart the timer on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, text, charCount]);

  if (reduced) {
    return (
      <span className={className}>
        {text}
        {cursor && <Cursor reduced={reduced} />}
      </span>
    );
  }

  const animated = (
    <motion.span
      className={reserve ? "col-start-1 row-start-1" : className}
      variants={typeContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {tokens.map((token, tokenIndex) =>
        // Whitespace stays a plain text node: it is invisible anyway, and it
        // is what gives the line breaker somewhere legal to break.
        token.type === "space" ? (
          token.text
        ) : (
          <span key={tokenIndex} className="inline-block whitespace-nowrap">
            {token.chars.map(({ char, index }) => (
              <motion.span
                key={index}
                className="inline-block"
                variants={typeChar}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ),
      )}
      {cursor && <Cursor reduced={reduced} show={typed} />}
    </motion.span>
  );

  if (!reserve) return animated;

  return (
    <span className={`grid ${className}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      {animated}
    </span>
  );
}

export function Cursor({
  reduced,
  show = true,
}: {
  reduced: boolean;
  show?: boolean;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 bg-accent-bright align-middle"
      animate={
        reduced
          ? { opacity: 1 }
          : show
            ? { opacity: [1, 1, 0, 0] }
            : { opacity: 0 }
      }
      transition={
        reduced || !show
          ? undefined
          : { duration: 1, repeat: Infinity, ease: "linear" }
      }
    />
  );
}
