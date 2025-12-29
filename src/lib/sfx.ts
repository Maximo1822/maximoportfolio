// Simple UI sound effects (no external assets)

let audioCtx: AudioContext | null = null;

export const playUiClick = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;

    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") {
      // Best-effort resume; some browsers require a user gesture (this is called from clicks).
      void audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // No-op: audio is non-critical.
  }
};
