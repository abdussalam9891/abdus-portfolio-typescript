"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { AMBIENT_TRACK_SRC } from "@/lib/ambient-audio";
import {
  getMutedServerSnapshot,
  getMutedSnapshot,
  setMuted,
  subscribeMuted,
} from "@/lib/ambient-mute";

/**
 * Background music, saloon.wtf style: a looping ambient track that is on by
 * default and can be silenced from anywhere on the site.
 *
 * The track is **streamed from a remote URL**, set via
 * NEXT_PUBLIC_AMBIENT_AUDIO_URL — no audio file is committed to the repo.
 * Host it on Vercel Blob / Cloudinary / Supabase Storage and point the env
 * var at it (see .env.example). With the var unset, this renders nothing, so
 * a fresh clone runs silent instead of broken.
 *
 * "On by default" is bounded by one thing we do not control: browsers refuse
 * audible playback until the visitor has interacted with the page. So there
 * are three states, not two —
 *
 *   pending → armed, waiting for the first gesture (the browser hasn't
 *             allowed sound yet). Labelled honestly rather than as "off".
 *   playing → audible.
 *   paused  → the visitor switched it off.
 *
 * We deliberately do not try to autoplay on mount for visitors the browser
 * might already trust (Chrome's media engagement heuristic): it is
 * unreliable, and it would make every such page view — including a
 * Lighthouse run — fetch the track. Waiting for a gesture keeps the audio
 * off the critical path entirely, so the homepage perf budget (CLAUDE.md) is
 * unaffected, and in practice the entry sequence's tap-to-skip is that
 * gesture.
 *
 * Muting is remembered for the visit (sessionStorage), not forever: the site
 * is meant to come up with music, so a new visit starts fresh, while a
 * visitor who muted is not re-muted on every page they open.
 */

// Loud enough to be present under the page, quiet enough that a client
// taking a call with the site open isn't ambushed.
const VOLUME = 0.32;
const FADE_IN_MS = 1400;
const FADE_OUT_MS = 500;

const BAR_DELAYS_S = [0, 0.18, 0.36, 0.12];

type Status = "pending" | "playing" | "paused";

const LABELS: Record<Status, string> = {
  pending: "Tap for sound",
  playing: "Sound on",
  paused: "Sound off",
};

export function AmbientAudio() {
  // Inlined at build time, so with no track configured the player never
  // reaches the browser at all — and neither does the footer's clearance
  // for it (lib/ambient-audio.ts).
  if (!AMBIENT_TRACK_SRC) return null;
  return <AmbientAudioPlayer src={AMBIENT_TRACK_SRC} />;
}

function AmbientAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const muted = useSyncExternalStore(
    subscribeMuted,
    getMutedSnapshot,
    getMutedServerSnapshot,
  );
  const [playing, setPlaying] = useState(false);
  // Streaming from another origin means the host can fail independently of
  // the site: if the URL 404s, the bucket is down, or the codec is
  // unsupported, the control removes itself rather than sitting there dead.
  const [unavailable, setUnavailable] = useState(false);

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio(src);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    el.addEventListener("error", () => setUnavailable(true));
    audioRef.current = el;
    return el;
  }, [src]);

  /** Ramp volume instead of cutting it — an abrupt start reads as a glitch. */
  const fadeTo = useCallback((el: HTMLAudioElement, target: number, ms: number) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const from = el.volume;
    const started = performance.now();

    const step = (now: number) => {
      const t = ms <= 0 ? 1 : Math.min(1, (now - started) / ms);
      el.volume = Math.min(1, Math.max(0, from + (target - from) * t));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }
      frameRef.current = null;
      if (target === 0) el.pause();
    };

    frameRef.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(async () => {
    const el = getAudio();
    try {
      await el.play();
    } catch {
      // Autoplay still blocked, or the stream never loaded — stay armed and
      // leave the button for the visitor to press deliberately.
      return false;
    }
    setPlaying(true);
    fadeTo(el, VOLUME, FADE_IN_MS);
    return true;
  }, [fadeTo, getAudio]);

  const stop = useCallback(() => {
    setPlaying(false);
    const el = audioRef.current;
    if (el) fadeTo(el, 0, FADE_OUT_MS);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      setMuted(true);
      return;
    }
    setMuted(false);
    void start();
  }, [playing, start, stop]);

  useEffect(() => {
    if (muted) return;

    const events = ["pointerdown", "keydown", "touchend"] as const;

    const teardown = () => {
      for (const type of events) {
        window.removeEventListener(type, onFirstGesture);
      }
    };

    const onFirstGesture = (event: Event) => {
      teardown();
      // If that first gesture *was* the toggle button, let its own click
      // handler decide — otherwise we would start the track and the click
      // would immediately stop it again.
      const target = event.target;
      if (target instanceof Element && target.closest("[data-ambient-toggle]")) {
        return;
      }
      void start();
    };

    for (const type of events) {
      window.addEventListener(type, onFirstGesture, { passive: true });
    }
    return teardown;
  }, [muted, start]);

  // Music from a tab the visitor has switched away from is just noise.
  useEffect(() => {
    if (!playing) return;

    const onVisibilityChange = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        el.pause();
      } else {
        void el.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [playing]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      audioRef.current?.pause();
    };
  }, []);

  if (unavailable) return null;

  // "pending" is the honest state before the browser has let us make sound:
  // armed and waiting for a gesture, which is not the same as switched off.
  const status: Status = muted ? "paused" : playing ? "playing" : "pending";

  return (
    <button
      type="button"
      data-ambient-toggle
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Turn music off" : "Turn music on"}
      title={playing ? "Turn music off" : "Turn music on"}
      className="group fixed bottom-5 left-5 z-40 flex h-11 items-center gap-2.5 rounded-full border border-accent/25 bg-background/70 px-4 backdrop-blur transition-colors duration-300 hover:border-accent/60 sm:bottom-6 sm:left-6"
    >
      <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
        {BAR_DELAYS_S.map((delay, i) => (
          <span
            key={i}
            className="eq-bar"
            data-playing={playing}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.14em] text-foreground/55 transition-colors duration-300 group-hover:text-accent-bright">
        {LABELS[status]}
      </span>
    </button>
  );
}
