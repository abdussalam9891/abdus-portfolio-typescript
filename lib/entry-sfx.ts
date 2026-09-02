import { getMutedSnapshot } from "@/lib/ambient-mute";

/**
 * The tick that plays as the entry sequence hands one spelling of the name
 * over to the next.
 *
 * Synthesised with Web Audio rather than loaded from a file, on purpose: no
 * audio asset is committed to the repo (CLAUDE.md, "Background audio"), and
 * the intro's asset weight stays exactly where it was, so the homepage perf
 * budget is untouched. It is a few oscillators and one 0.2s noise buffer —
 * nothing is fetched.
 *
 * Audibility is bounded by the same rule as the music: browsers keep an
 * AudioContext suspended until the visitor has interacted with the page, so
 * on a genuinely cold load the first blips are silent and the rest come in
 * once a gesture arms it. We do not try to route around that.
 */

// Quiet — this is punctuation under a 1.4s animation, not a notification.
const PEAK = 0.11;
const SWISH_PEAK = 0.05;

// An ascending run, one step per script, so six blips read as one phrase
// rather than six identical clicks. Roughly a major pentatonic from A4.
const STEPS_HZ = [440, 495, 587.33, 659.25, 784, 880];

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context) return context;

  const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!Ctor) return null;

  try {
    context = new Ctor();
  } catch {
    return null;
  }
  return context;
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noise) return noise;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  noise = buffer;
  return noise;
}

/**
 * Create/resume the context off the visitor's first gesture. Safe to call
 * repeatedly — after the first success it is a no-op.
 */
export function primeEntrySfx() {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
}

/** One transition tick. `step` is the index of the incoming spelling. */
export function playEntryBlip(step: number) {
  if (getMutedSnapshot()) return;

  const ctx = getContext();
  if (!ctx) return;

  // Still waiting on a gesture — ask for the context back and stay silent
  // for this blip; resume() is async, so the next one gets the sound.
  if (ctx.state !== "running") {
    void ctx.resume().catch(() => {});
    return;
  }

  const now = ctx.currentTime;
  const freq = STEPS_HZ[Math.min(step, STEPS_HZ.length - 1)];

  // Pluck: a triangle body with a sine an octave up for the attack.
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(PEAK, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  gain.connect(ctx.destination);

  for (const [type, multiplier, level] of [
    ["triangle", 1, 1],
    ["sine", 2, 0.35],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq * multiplier, now);

    const voice = ctx.createGain();
    voice.gain.setValueAtTime(level, now);

    osc.connect(voice).connect(gain);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Swish: a band-passed noise burst that sweeps up, matching the word
  // sliding across rather than just appearing.
  const source = ctx.createBufferSource();
  source.buffer = getNoise(ctx);

  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.2;
  band.frequency.setValueAtTime(900, now);
  band.frequency.exponentialRampToValueAtTime(2600, now + 0.16);

  const swishGain = ctx.createGain();
  swishGain.gain.setValueAtTime(0.0001, now);
  swishGain.gain.exponentialRampToValueAtTime(SWISH_PEAK, now + 0.02);
  swishGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  source.connect(band).connect(swishGain).connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.2);
}

/** Release the context when the sequence unmounts — it never plays again. */
export function disposeEntrySfx() {
  const ctx = context;
  context = null;
  noise = null;
  void ctx?.close().catch(() => {});
}
