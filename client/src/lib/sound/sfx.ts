/**
 * Noor Journey Sound Effects (SFX) Engine
 * Synthesizes rich, tactile, and kid-friendly audio feedback using the Web Audio API.
 * Requires zero external audio assets, works completely offline, and respects sound preferences.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initSoundPreference();
  }

  private initSoundPreference() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("noor_journey_state_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.prefs && typeof parsed.prefs.sound === "boolean") {
          this.enabled = parsed.prefs.sound;
        }
      }
    } catch {}
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Crisp, soft tactile button click
   */
  public click() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch {}
  }

  /**
   * Light bubble pop when selecting an option or checkbox
   */
  public select() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(750, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.07);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  /**
   * Subtle airy swoosh when switching tabs
   */
  public tab() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(680, t + 0.05);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  /**
   * Melodic major chime for correct quiz answer / positive validation
   */
  public correct() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0 },       // C5
        { f: 659.25, time: 0.08 },    // E5
        { f: 783.99, time: 0.16 },    // G5
        { f: 1046.5, time: 0.24 },    // C6
      ];

      notes.forEach(({ f, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + time);

        gain.gain.setValueAtTime(0.16, t + time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + time);
        osc.stop(t + time + 0.35);
      });
    } catch {}
  }

  /**
   * Gentle, soft alert for incorrect quiz answer
   */
  public incorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(190, t + 0.22);

      gain.gain.setValueAtTime(0.13, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch {}
  }

  /**
   * Shimmering sparkle arpeggio for XP and mission rewards
   */
  public xp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const notes = [784, 988, 1175, 1568, 1976]; // G5, B5, D6, G6, B6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + idx * 0.045);

        gain.gain.setValueAtTime(0.14, t + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.045);
        osc.stop(t + idx * 0.045 + 0.28);
      });
    } catch {}
  }

  /**
   * Wooden lock rattle when tapping a locked lesson
   */
  public lock() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // Two quick muted wooden knocks
      [0, 0.08].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(idx === 0 ? 220 : 180, t + offset);
        osc.frequency.exponentialRampToValueAtTime(90, t + offset + 0.04);

        gain.gain.setValueAtTime(0.18, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + offset);
        osc.stop(t + offset + 0.04);
      });
    } catch {}
  }

  /**
   * Triumphant fanfare when completing an entire subject roadmap
   */
  public complete() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const chord = [
        { f: 523.25, time: 0, dur: 0.5 },     // C5
        { f: 659.25, time: 0.07, dur: 0.5 },  // E5
        { f: 783.99, time: 0.14, dur: 0.5 },  // G5
        { f: 1046.5, time: 0.22, dur: 0.8 },  // C6
        { f: 1318.5, time: 0.30, dur: 1.0 },  // E6
      ];

      chord.forEach(({ f, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + time);

        gain.gain.setValueAtTime(0.16, t + time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + time);
        osc.stop(t + time + dur);
      });
    } catch {}
  }
}

export const sfx = new SoundEffectsEngine();
