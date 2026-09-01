"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useReducedMotion } from "@/lib/reduced-motion";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Reads the <html> class as an external store (like useReducedMotion)
 * instead of state+effect — the inline head script (lib/theme.ts) sets the
 * real class before hydration, and a MutationObserver keeps this in sync
 * whenever toggle() below flips it.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduced = useReducedMotion();

  function toggle() {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:border-foreground/40"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduced ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{
            duration: reduced ? 0.01 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
