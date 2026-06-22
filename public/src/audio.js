// ═══════════════════════════════════════════════════════════════
// AUDIO — Web Audio API sound system (BGM + SFX)
// ═══════════════════════════════════════════════════════════════

export const AudioSys = {
  ctx: null,
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  },
  ensureCtx() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  playTone(freq, duration, type, vol) {
    this.ensureCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime((vol || 0.15), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (duration || 0.1));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + (duration || 0.1));
  },
  playBGM() {
    this.ensureCtx();
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    const notes = [262, 294, 330, 349, 392, 349, 330, 294];
    const bass = [131, 165, 196, 175];
    const playNext = () => {
      if (!this.bgmPlaying) return;
      const n = notes[this.bgmStep % notes.length];
      const b = bass[this.bgmStep % bass.length];
      this.playTone(n, 0.4, 'sine', 0.08);
      this.playTone(b, 0.4, 'triangle', 0.06);
      this.bgmStep++;
      this.bgmTimer = setTimeout(playNext, 500);
    };
    playNext();
  },
  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) clearTimeout(this.bgmTimer);
  },
  sfx: {
    interact() { AudioSys.playTone(600, 0.08, 'square', 0.1); AudioSys.playTone(800, 0.06, 'square', 0.08); },
    menu() { AudioSys.playTone(400, 0.05, 'square', 0.08); },
    back() { AudioSys.playTone(300, 0.08, 'square', 0.08); },
    equip() { AudioSys.playTone(500, 0.06, 'square', 0.1); AudioSys.playTone(700, 0.08, 'square', 0.08); AudioSys.playTone(900, 0.06, 'square', 0.06); },
    buy() { AudioSys.playTone(800, 0.05, 'square', 0.1); AudioSys.playTone(1000, 0.08, 'sine', 0.08); },
    heal() { AudioSys.playTone(400, 0.15, 'sine', 0.1); AudioSys.playTone(600, 0.15, 'sine', 0.08); AudioSys.playTone(800, 0.2, 'sine', 0.06); },
    hurt() { AudioSys.playTone(200, 0.15, 'sawtooth', 0.1); AudioSys.playTone(150, 0.2, 'square', 0.08); },
    victory() { AudioSys.playTone(523, 0.1, 'square', 0.1); AudioSys.playTone(659, 0.1, 'square', 0.1); AudioSys.playTone(784, 0.15, 'square', 0.1); },
    recruit() { AudioSys.playTone(440, 0.1, 'square', 0.1); AudioSys.playTone(554, 0.1, 'square', 0.1); AudioSys.playTone(659, 0.1, 'square', 0.1); AudioSys.playTone(880, 0.15, 'sine', 0.1); },
    chest() { AudioSys.playTone(600, 0.05, 'sine', 0.1); AudioSys.playTone(800, 0.05, 'sine', 0.1); AudioSys.playTone(1000, 0.05, 'sine', 0.1); },
  }
};
