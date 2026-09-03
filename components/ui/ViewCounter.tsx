"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { FiEye } from "react-icons/fi";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Marks a browsing session as already counted. sessionStorage, like the
 * entry sequence's gate: one visitor reading six case studies is one visit,
 * but coming back tomorrow counts again.
 */
const COUNTED_KEY = "visit-counted";

const format = (total: number) => total.toLocaleString("en-US");

/**
 * Total visits to the site, counted for real (see lib/views.ts). Renders
 * nothing at all until the number is in hand — and stays empty if the store
 * isn't configured or is unreachable, since a made-up figure is worse than
 * no figure (CLAUDE.md).
 */
export function ViewCounter() {
  const reduced = useReducedMotion();
  const [visits, setVisits] = useState<number | null>(null);

  const count = useMotionValue(0);
  const display = useTransform(count, (value) => format(Math.round(value)));

  useEffect(() => {
    let cancelled = false;

    let counted = true;
    try {
      counted = sessionStorage.getItem(COUNTED_KEY) === "true";
    } catch {
      // Storage disabled — read the total rather than risk counting this
      // visitor again on every page load.
    }

    fetch("/api/views", { method: counted ? "GET" : "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { visits?: unknown } | null) => {
        if (cancelled) return;
        const total = body?.visits;
        if (typeof total !== "number") return;

        if (!counted) {
          try {
            sessionStorage.setItem(COUNTED_KEY, "true");
          } catch {
            // Not persisted; the worst case is a recount on the next load.
          }
        }
        setVisits(total);
      })
      .catch(() => {
        // Offline or the store is down: leave the counter unrendered.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (visits === null) return;
    if (reduced) {
      count.set(visits);
      return;
    }
    // Roll up to the real number rather than snapping to it — the same
    // easing the shared variants use.
    const controls = animate(count, visits, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [visits, reduced, count]);

  return (
    // The height is reserved so the footer doesn't shift when the number
    // lands (or never does).
    <p className="flex min-h-5 items-center justify-center gap-2">
      {visits !== null && (
        <motion.span
          className="inline-flex items-center gap-1.5"
          title="Total visits"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FiEye aria-hidden className="text-accent-bright/70" />
          {/* The digits tick during the count-up, so give assistive tech the
              settled number instead of the animation. */}
          <span className="sr-only">{format(visits)} total visits</span>
          <motion.span aria-hidden className="tabular-nums">
            {display}
          </motion.span>
        </motion.span>
      )}
    </p>
  );
}
