/**
 * Tiny Web Audio beeps — no asset files. Fails silently if AudioContext unavailable.
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    return new AC();
  } catch {
    return null;
  }
}

function beep(ctx: AudioContext, freq: number, duration: number, type: OscillatorType, gainVal: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainVal;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t = ctx.currentTime;
  osc.start(t);
  osc.stop(t + duration);
}

/** Short pleasant two-tone for session success. */
export function playSessionSuccessSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    beep(ctx, 523.25, 0.11, "sine", 0.07);
    setTimeout(() => {
      try {
        beep(ctx, 659.25, 0.14, "sine", 0.06);
      } catch {
        /* ignore */
      }
    }, 95);
  } catch {
    /* ignore */
  }
}

/** Soft low tone when session below pass threshold. */
export function playSessionRetrySound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    beep(ctx, 200, 0.18, "triangle", 0.055);
  } catch {
    /* ignore */
  }
}

/** Single-question correct (optional — call from game handlers). */
export function playAnswerCorrectSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    beep(ctx, 660, 0.08, "sine", 0.055);
  } catch {
    /* ignore */
  }
}

/** Single-question incorrect (optional). */
export function playAnswerWrongSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    beep(ctx, 150, 0.12, "sawtooth", 0.045);
  } catch {
    /* ignore */
  }
}
