// ═══════════════════════════════════════════════════════════════
// AUDIO — Web Audio synth engine: SFX presets + multi-channel
// song player with authored note sequences and shared motifs.
// No external files; fully offline.
// ═══════════════════════════════════════════════════════════════

import { Settings } from './settings.js';

let ctx = null;
let masterGain = null, musicGain = null, sfxGain = null, uiGain = null;

export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.connect(masterGain);
    sfxGain = ctx.createGain(); sfxGain.connect(masterGain);
    uiGain = ctx.createGain(); uiGain.connect(masterGain);
    applyVolumes();
  } catch (e) { ctx = null; }
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function applyVolumes() {
  if (!ctx) return;
  masterGain.gain.value = Settings.masterVol;
  musicGain.gain.value = Settings.musicVol;
  sfxGain.gain.value = Settings.sfxVol;
  uiGain.gain.value = Settings.uiVol;
}

// ── Note helpers ───────────────────────────────────────
// Note names: 'C4', 'A#3', 'Db5', or '-' (rest). Frequency from MIDI.
const NOTE_IDX = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
export function noteFreq(name) {
  if (!name || name === '-') return 0;
  const m = /^([A-G][#b]?)(-?\d)$/.exec(name);
  if (!m) return 0;
  const midi = NOTE_IDX[m[1]] + (parseInt(m[2], 10) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ── SFX ────────────────────────────────────────────────
// A sfx spec: array of segments {type:'osc'|'noise', wave, f0, f1, t, delay, vol, decay}
function playSpec(spec, bus) {
  if (!ctx) return;
  resumeAudio();
  const now = ctx.currentTime;
  for (const s of spec) {
    const start = now + (s.delay || 0);
    const dur = s.t || 0.1;
    const g = ctx.createGain();
    g.connect(bus);
    const vol = s.vol !== undefined ? s.vol : 0.5;
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol * (s.sustain || 0.01)), start + dur);
    if (s.type === 'noise') {
      const len = Math.ceil(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = s.filter || 'lowpass';
      filt.frequency.setValueAtTime(s.f0 || 1200, start);
      if (s.f1) filt.frequency.exponentialRampToValueAtTime(s.f1, start + dur);
      src.connect(filt); filt.connect(g);
      src.start(start); src.stop(start + dur);
    } else {
      const o = ctx.createOscillator();
      o.type = s.wave || 'square';
      o.frequency.setValueAtTime(s.f0 || 440, start);
      if (s.f1) o.frequency.exponentialRampToValueAtTime(Math.max(1, s.f1), start + dur);
      o.connect(g);
      o.start(start); o.stop(start + dur);
    }
  }
}

const SFX = {
  cursor:   [{ wave: 'square', f0: 880, f1: 660, t: 0.05, vol: 0.15 }],
  confirm:  [{ wave: 'square', f0: 660, f1: 990, t: 0.08, vol: 0.2 }],
  cancel:   [{ wave: 'square', f0: 440, f1: 220, t: 0.09, vol: 0.18 }],
  error:    [{ wave: 'square', f0: 180, f1: 140, t: 0.12, vol: 0.2 }],
  open:     [{ wave: 'triangle', f0: 520, f1: 1040, t: 0.12, vol: 0.22 }],
  close:    [{ wave: 'triangle', f0: 1040, f1: 520, t: 0.1, vol: 0.2 }],
  save:     [{ wave: 'triangle', f0: 660, f1: 660, t: 0.09, vol: 0.25 }, { wave: 'triangle', f0: 990, t: 0.14, delay: 0.09, vol: 0.25 }],
  step:     [{ type: 'noise', f0: 700, f1: 300, t: 0.05, vol: 0.05 }],
  chest:    [{ wave: 'square', f0: 523, t: 0.08, vol: 0.2 }, { wave: 'square', f0: 659, t: 0.08, delay: 0.08, vol: 0.2 }, { wave: 'square', f0: 784, t: 0.16, delay: 0.16, vol: 0.22 }],
  coin:     [{ wave: 'square', f0: 988, t: 0.05, vol: 0.18 }, { wave: 'square', f0: 1319, t: 0.12, delay: 0.05, vol: 0.18 }],
  heal:     [{ wave: 'sine', f0: 523, f1: 1046, t: 0.25, vol: 0.22 }, { wave: 'sine', f0: 784, f1: 1568, t: 0.25, delay: 0.08, vol: 0.16 }],
  hurt:     [{ type: 'noise', f0: 900, f1: 200, t: 0.15, vol: 0.3 }, { wave: 'sawtooth', f0: 220, f1: 90, t: 0.15, vol: 0.2 }],
  slash:    [{ type: 'noise', f0: 2400, f1: 500, t: 0.12, filter: 'bandpass', vol: 0.3 }],
  pierce:   [{ type: 'noise', f0: 3200, f1: 900, t: 0.08, filter: 'bandpass', vol: 0.25 }, { wave: 'square', f0: 1200, f1: 300, t: 0.07, vol: 0.12 }],
  blunt:    [{ type: 'noise', f0: 400, f1: 90, t: 0.16, vol: 0.35 }],
  fire:     [{ type: 'noise', f0: 800, f1: 2400, t: 0.3, vol: 0.3 }, { wave: 'sawtooth', f0: 140, f1: 60, t: 0.3, vol: 0.15 }],
  water:    [{ type: 'noise', f0: 1400, f1: 300, t: 0.35, vol: 0.25 }, { wave: 'sine', f0: 300, f1: 120, t: 0.3, vol: 0.15 }],
  ice:      [{ wave: 'triangle', f0: 1800, f1: 2600, t: 0.12, vol: 0.18 }, { type: 'noise', f0: 4000, f1: 6000, t: 0.15, filter: 'highpass', vol: 0.14, delay: 0.05 }],
  volt:     [{ type: 'noise', f0: 3000, f1: 5000, t: 0.18, filter: 'highpass', vol: 0.28 }, { wave: 'square', f0: 80, f1: 55, t: 0.18, vol: 0.15 }],
  stellar:  [{ wave: 'sine', f0: 880, f1: 1760, t: 0.3, vol: 0.2 }, { wave: 'sine', f0: 1320, f1: 2640, t: 0.35, delay: 0.06, vol: 0.16 }, { wave: 'triangle', f0: 440, t: 0.4, delay: 0.1, vol: 0.1 }],
  void:     [{ wave: 'sawtooth', f0: 200, f1: 50, t: 0.4, vol: 0.25 }, { type: 'noise', f0: 500, f1: 100, t: 0.4, vol: 0.18, delay: 0.05 }],
  buff:     [{ wave: 'triangle', f0: 440, f1: 880, t: 0.18, vol: 0.2 }, { wave: 'triangle', f0: 660, f1: 1320, t: 0.18, delay: 0.09, vol: 0.16 }],
  debuff:   [{ wave: 'triangle', f0: 880, f1: 440, t: 0.2, vol: 0.2 }],
  ko:       [{ wave: 'sawtooth', f0: 300, f1: 60, t: 0.5, vol: 0.3 }],
  victory:  [{ wave: 'square', f0: 523, t: 0.1, vol: 0.2 }, { wave: 'square', f0: 659, t: 0.1, delay: 0.1, vol: 0.2 }, { wave: 'square', f0: 784, t: 0.1, delay: 0.2, vol: 0.2 }, { wave: 'square', f0: 1046, t: 0.3, delay: 0.3, vol: 0.24 }],
  levelup:  [{ wave: 'square', f0: 659, t: 0.09, vol: 0.2 }, { wave: 'square', f0: 784, t: 0.09, delay: 0.09, vol: 0.2 }, { wave: 'square', f0: 988, t: 0.09, delay: 0.18, vol: 0.2 }, { wave: 'square', f0: 1319, t: 0.25, delay: 0.27, vol: 0.24 }],
  evolve:   [{ wave: 'sine', f0: 220, f1: 880, t: 0.8, vol: 0.25 }, { wave: 'sine', f0: 330, f1: 1320, t: 0.8, delay: 0.15, vol: 0.2 }, { wave: 'triangle', f0: 440, f1: 1760, t: 0.9, delay: 0.3, vol: 0.18 }, { type: 'noise', f0: 2000, f1: 6000, t: 1.0, filter: 'highpass', delay: 0.4, vol: 0.12 }],
  boss:     [{ wave: 'sawtooth', f0: 110, f1: 55, t: 0.6, vol: 0.3 }, { type: 'noise', f0: 300, f1: 80, t: 0.6, vol: 0.2, delay: 0.1 }],
  shard:    [{ wave: 'sine', f0: 1046, t: 0.12, vol: 0.2 }, { wave: 'sine', f0: 1318, t: 0.12, delay: 0.12, vol: 0.2 }, { wave: 'sine', f0: 1568, t: 0.12, delay: 0.24, vol: 0.2 }, { wave: 'sine', f0: 2093, t: 0.4, delay: 0.36, vol: 0.24 }]
};

export function sfx(name) {
  const spec = SFX[name];
  if (spec) playSpec(spec, sfxGain);
}
export function uiSfx(name) {
  const spec = SFX[name];
  if (spec) playSpec(spec, uiGain);
}

// ── Song player ────────────────────────────────────────
// A song: { tempo, loop:true, channels: [{wave, vol, notes:[[note,beats],...]}] }
// Notes play back-to-back; '-' rests. Scheduler runs ahead in small windows.

let currentSong = null;
let songTimer = null;
let currentSongId = null;

export function playSong(id, song, { fade = 0.4 } = {}) {
  if (!ctx) return;
  if (currentSongId === id) return;
  stopSong(fade);
  currentSongId = id;
  currentSong = { song, startAt: ctx.currentTime + 0.05, channels: [] };
  scheduleSong();
}

export function stopSong(fade = 0.3) {
  if (!ctx || !currentSong) { currentSongId = null; return; }
  if (songTimer) { clearInterval(songTimer); songTimer = null; }
  for (const chan of currentSong.channels) {
    try {
      chan.gain.gain.cancelScheduledValues(ctx.currentTime);
      chan.gain.gain.setValueAtTime(chan.gain.gain.value, ctx.currentTime);
      chan.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
      const g = chan.gain;
      setTimeout(() => { try { g.disconnect(); } catch (e) {} }, (fade + 0.1) * 1000);
      for (const o of chan.oscs) { try { o.stop(ctx.currentTime + fade); } catch (e) {} }
    } catch (e) { /* ignore */ }
  }
  currentSong = null;
  currentSongId = null;
}

export function playingSongId() { return currentSongId; }

function scheduleSong() {
  const cs = currentSong;
  if (!cs) return;
  const { song } = cs;
  const beatSec = 60 / (song.tempo || 120);

  // Build channel nodes and schedule note events channel by channel.
  // For simplicity and robustness we schedule the whole loop iteration,
  // then re-schedule on a timer just before it ends.
  let loopLen = 0;
  for (const ch of song.channels) {
    let len = 0;
    for (const [, beats] of ch.notes) len += beats;
    loopLen = Math.max(loopLen, len * beatSec);
  }
  if (loopLen <= 0) return;

  const iterStart = cs.startAt;
  for (const ch of song.channels) {
    const g = ctx.createGain();
    g.gain.value = ch.vol !== undefined ? ch.vol : 0.15;
    g.connect(musicGain);
    const oscs = [];
    let t = iterStart;
    for (const [note, beats] of ch.notes) {
      const dur = beats * beatSec;
      const f = noteFreq(note);
      if (f > 0) {
        if (ch.wave === 'noise') {
          const len = Math.ceil(ctx.sampleRate * dur);
          const buf = ctx.createBuffer(1, len, ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const filt = ctx.createBiquadFilter();
          filt.type = 'bandpass';
          filt.frequency.value = f * 4;
          const ng = ctx.createGain();
          ng.gain.setValueAtTime(0.8, t);
          ng.gain.exponentialRampToValueAtTime(0.01, t + dur * 0.9);
          src.connect(filt); filt.connect(ng); ng.connect(g);
          src.start(t); src.stop(t + dur);
          oscs.push(src);
        } else {
          const o = ctx.createOscillator();
          o.type = ch.wave || 'square';
          o.frequency.setValueAtTime(f, t);
          const ng = ctx.createGain();
          const a = Math.min(0.02, dur * 0.2);
          ng.gain.setValueAtTime(0, t);
          ng.gain.linearRampToValueAtTime(1, t + a);
          const rel = ch.staccato ? dur * 0.6 : dur * 0.92;
          ng.gain.setValueAtTime(1, t + rel);
          ng.gain.linearRampToValueAtTime(0, t + dur * 0.98);
          o.connect(ng); ng.connect(g);
          o.start(t); o.stop(t + dur);
          oscs.push(o);
        }
      }
      t += dur;
    }
    cs.channels.push({ gain: g, oscs });
  }

  // schedule next iteration or end
  if (song.loop !== false) {
    const nextStart = iterStart + loopLen;
    const delayMs = Math.max(50, (nextStart - ctx.currentTime - 0.25) * 1000);
    songTimer = setTimeout(() => {
      if (currentSong !== cs) return;
      // release old channel gains after they finish
      const old = cs.channels;
      setTimeout(() => { for (const c of old) { try { c.gain.disconnect(); } catch (e) {} } }, 1000);
      cs.channels = [];
      cs.startAt = nextStart;
      scheduleSong();
    }, delayMs);
  }
}
