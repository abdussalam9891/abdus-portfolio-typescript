"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Tracks the user's prefers-reduced-motion OS setting live (updates if the
 * user toggles it without reloading). Returns false during SSR/first paint
 * to avoid a hydration mismatch — components that gate whole animations on
 * this should treat that initial `false` as "unknown" rather than "motion
 * allowed" where it matters (see EntrySequence).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
