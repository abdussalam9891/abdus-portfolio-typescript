/**
 * The site's per-visit "sound off" preference, shared by everything that can
 * make noise (the ambient track, the entry sequence's transition blips) so
 * one mute silences all of it.
 *
 * sessionStorage, not localStorage: music is part of the intended first
 * impression, so a new visit comes up with sound again, but a visitor who
 * muted stays muted for the rest of that visit (CLAUDE.md, "Background
 * audio").
 *
 * Exposed as a useSyncExternalStore-shaped store — sessionStorage can't be
 * read during SSR, so the server snapshot is the site's default ("not
 * muted") and the real value resolves on the client without a
 * setState-in-effect (the react-hooks/set-state-in-effect lint rule rejects
 * that shape).
 */

export const MUTE_KEY = "ambient-audio-muted";

const listeners = new Set<() => void>();

export function subscribeMuted(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getMutedSnapshot() {
  try {
    return sessionStorage.getItem(MUTE_KEY) === "true";
  } catch {
    // Private mode / storage disabled — default to sound.
    return false;
  }
}

export function getMutedServerSnapshot() {
  return false;
}

export function setMuted(muted: boolean) {
  try {
    if (muted) sessionStorage.setItem(MUTE_KEY, "true");
    else sessionStorage.removeItem(MUTE_KEY);
  } catch {
    // The mute just won't persist across pages.
  }
  for (const listener of listeners) listener();
}
