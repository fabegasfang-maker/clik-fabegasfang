/**
 * Lightweight Web Audio API synthesizer for tactile coffee grinder clicks.
 * Generates an authentic mechanical detent "tick" without external audio files.
 */
class ClickAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playClick(pitchMultiplier: number = 1.0) {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sharp mechanical click impulse
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * pitchMultiplier, now);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio autoplay policy fallback - fail silently
    }
  }
}

export const clickAudio = new ClickAudioEngine();
