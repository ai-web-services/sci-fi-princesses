// ═══════════════════════════════════════════════════════════════
// MUSIC LIBRARY — Regional, combat, and story songs for the synth
// engine (see engine/audio.js for the player, data/music.js for the
// Crown motif reference: SONG_TITLE / SONG_NOVA).
//
// Motif discipline:
//  - Crown/Lyra motif: rising figure E-C-D-E-G-A (transposed freely).
//    Woven into nova_restored, victory, evolution, credits.
//  - Void motif: its darkening/inversion, descending E-G-F#-E-C-B or
//    chromatic descent. Woven into void, boss, final, tension.
// ═══════════════════════════════════════════════════════════════

// ── Mirelight: drowned Anura marshworld ────────────────
// Slow 6/8 feel (1.5/0.75 beat groupings), D dorian, watery & melancholy.
export const SONG_MIRELIGHT = {
  tempo: 72,
  loop: true,
  channels: [
    { // melody — sine, water-glass tone
      wave: 'sine', vol: 0.11,
      notes: [
        ['D4', 1.5], ['F4', 0.75], ['E4', 0.75], ['D4', 1.5], ['C4', 1.5],
        ['A3', 1.5], ['C4', 0.75], ['D4', 0.75], ['E4', 3],
        ['F4', 1.5], ['G4', 0.75], ['F4', 0.75], ['E4', 1.5], ['D4', 1.5],
        ['C4', 1.5], ['A3', 0.75], ['C4', 0.75], ['D4', 3]
      ]
    },
    { // harmony pad — triangle, low vol, sustained dorian chords
      wave: 'triangle', vol: 0.055,
      notes: [
        ['D3', 6], ['C3', 6], ['A2', 6], ['G2', 6]
      ]
    },
    { // bass — triangle
      wave: 'triangle', vol: 0.14,
      notes: [
        ['D2', 3], ['A2', 3], ['C2', 3], ['G2', 3],
        ['A2', 3], ['D2', 3], ['G2', 1.5], ['F2', 1.5], ['A2', 3]
      ]
    },
    { // water shimmer — soft square arpeggio, staccato
      wave: 'square', vol: 0.035, staccato: true,
      notes: [
        ['D4', 0.75], ['A4', 0.75], ['D5', 0.75], ['A4', 0.75], ['F4', 0.75], ['A4', 0.75], ['D5', 0.75], ['A4', 0.75],
        ['C4', 0.75], ['A4', 0.75], ['C5', 0.75], ['A4', 0.75], ['G4', 0.75], ['B4', 0.75], ['D5', 0.75], ['B4', 0.75],
        ['A3', 0.75], ['D4', 0.75], ['F4', 0.75], ['D4', 0.75], ['G3', 0.75], ['D4', 0.75], ['G4', 0.75], ['D4', 0.75],
        ['A3', 0.75], ['C4', 0.75], ['E4', 0.75], ['C4', 0.75], ['A3', 0.75], ['D4', 0.75], ['A4', 0.75], ['D4', 0.75]
      ]
    }
  ]
};

// ── Ashfall: Drakonid ash realm ────────────────────────
// Phrygian, low brassy sawtooth, slow war-drums (noise), proud & grieving.
export const SONG_ASHFALL = {
  tempo: 84,
  loop: true,
  channels: [
    { // melody — sawtooth, brassy, E phrygian (E F G A B C D)
      wave: 'sawtooth', vol: 0.10,
      notes: [
        ['E4', 2], ['F4', 1], ['E4', 1], ['C4', 2], ['B3', 2],
        ['E4', 2], ['F4', 1], ['G4', 1], ['B4', 2], ['A4', 2],
        ['G4', 2], ['F4', 1], ['E4', 1], ['D4', 2], ['C4', 2],
        ['B3', 2], ['C4', 1], ['E4', 1], ['E4', 4]
      ]
    },
    { // harmony pad — low sawtooth-free triangle, grieving sustain
      wave: 'triangle', vol: 0.06,
      notes: [
        ['E3', 4], ['C3', 4], ['B2', 4], ['A2', 4], ['E3', 4], ['B2', 4]
      ]
    },
    { // bass — triangle, low proud pulse
      wave: 'triangle', vol: 0.16,
      notes: [
        ['E2', 2], ['E2', 2], ['C2', 2], ['C2', 2],
        ['B1', 2], ['B1', 2], ['A1', 2], ['A1', 2],
        ['E2', 2], ['E2', 2], ['B1', 2], ['B1', 2]
      ]
    },
    { // war-drums — noise percussion, slow
      wave: 'noise', vol: 0.055,
      notes: [
        ['C3', 0.5], ['-', 1.5], ['C3', 0.5], ['-', 1.5],
        ['C3', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 1.5],
        ['C3', 0.5], ['-', 1.5], ['C3', 0.5], ['-', 1.5],
        ['C3', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 1.5],
        ['C3', 0.5], ['-', 1.5], ['C3', 0.5], ['-', 1.5]
      ]
    }
  ]
};

// ── Kessari: Felidae trade colony ──────────────────────
// Sly, syncopated, minor-swing feel, plucky staccato.
export const SONG_KESSARI = {
  tempo: 118,
  loop: true,
  channels: [
    { // melody — square, plucky staccato, A minor swing
      wave: 'square', vol: 0.10, staccato: true,
      notes: [
        ['-', 0.5], ['A4', 0.5], ['C5', 1], ['-', 0.5], ['B4', 0.5], ['A4', 1],
        ['-', 0.5], ['E4', 0.5], ['G4', 1], ['-', 0.5], ['A4', 0.5], ['E4', 1],
        ['-', 0.5], ['A4', 0.5], ['C5', 1], ['-', 0.5], ['D5', 0.5], ['C5', 1],
        ['-', 0.5], ['B4', 0.5], ['A4', 1], ['-', 0.5], ['G4', 0.5], ['A4', 2]
      ]
    },
    { // harmony — triangle, syncopated stabs, low vol
      wave: 'triangle', vol: 0.05, staccato: true,
      notes: [
        ['-', 1], ['C4', 0.5], ['-', 0.5], ['E4', 1], ['-', 1],
        ['-', 1], ['A3', 0.5], ['-', 0.5], ['C4', 1], ['-', 1],
        ['-', 1], ['C4', 0.5], ['-', 0.5], ['E4', 1], ['-', 1],
        ['-', 1], ['G3', 0.5], ['-', 0.5], ['A3', 1], ['-', 1]
      ]
    },
    { // bass — triangle, sly walking swing
      wave: 'triangle', vol: 0.15,
      notes: [
        ['A2', 1], ['-', 0.5], ['A2', 0.5], ['E2', 1], ['-', 0.5], ['E2', 0.5],
        ['C2', 1], ['-', 0.5], ['C2', 0.5], ['G2', 1], ['-', 0.5], ['G2', 0.5],
        ['A2', 1], ['-', 0.5], ['A2', 0.5], ['D2', 1], ['-', 0.5], ['D2', 0.5],
        ['E2', 1], ['-', 0.5], ['E2', 0.5], ['A2', 2]
      ]
    }
  ]
};

// ── Archive: machine archive (Pip's origin) ────────────
// Precise arpeggiated patterns, airy sine lead, mysterious wonder.
export const SONG_ARCHIVE = {
  tempo: 104,
  loop: true,
  channels: [
    { // lead — airy sine, sparse, mysterious
      wave: 'sine', vol: 0.09,
      notes: [
        ['-', 2], ['E5', 2], ['G5', 1], ['E5', 1], ['-', 2], ['D5', 2],
        ['-', 2], ['C5', 2], ['E5', 1], ['D5', 1], ['-', 2], ['B4', 2]
      ]
    },
    { // precise arpeggio — square, low vol, machine-precise
      wave: 'square', vol: 0.045, staccato: true,
      notes: [
        ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E4', 0.5], ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E4', 0.5],
        ['A3', 0.5], ['C4', 0.5], ['E4', 0.5], ['C4', 0.5], ['A3', 0.5], ['C4', 0.5], ['E4', 0.5], ['C4', 0.5],
        ['G3', 0.5], ['B3', 0.5], ['D4', 0.5], ['B3', 0.5], ['G3', 0.5], ['B3', 0.5], ['D4', 0.5], ['B3', 0.5],
        ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E4', 0.5], ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E4', 0.5]
      ]
    },
    { // pad — triangle, distant hum
      wave: 'triangle', vol: 0.04,
      notes: [
        ['C3', 8], ['A2', 8], ['G2', 8], ['C3', 8]
      ]
    },
    { // bass — triangle, precise pulse
      wave: 'triangle', vol: 0.13,
      notes: [
        ['C2', 2], ['C2', 2], ['A1', 2], ['A1', 2],
        ['G1', 2], ['G1', 2], ['C2', 2], ['C2', 2]
      ]
    }
  ]
};

// ── Void: reality-failing frontier ─────────────────────
// Unsettling, sparse, Void motif, dissonant tritones, slow.
export const SONG_VOID = {
  tempo: 64,
  loop: true,
  channels: [
    { // melody — Void motif: descending E-G-F#-E-C-B, sine, sparse
      wave: 'sine', vol: 0.09,
      notes: [
        ['E5', 3], ['-', 1], ['G4', 2], ['-', 1], ['F#4', 3], ['-', 1],
        ['E4', 3], ['-', 1], ['C4', 2], ['-', 1], ['B3', 4]
      ]
    },
    { // dissonant pad — triangle, tritone drone
      wave: 'triangle', vol: 0.05,
      notes: [
        ['C3', 4], ['F#3', 4], ['B2', 4], ['F3', 4], ['C3', 4], ['F#3', 4]
      ]
    },
    { // bass — triangle, slow unstable pulse
      wave: 'triangle', vol: 0.14,
      notes: [
        ['C2', 6], ['F#2', 6], ['B1', 6], ['F2', 6]
      ]
    },
    { // noise texture — unstable static, very sparse
      wave: 'noise', vol: 0.04,
      notes: [
        ['-', 3], ['F#2', 0.5], ['-', 2.5], ['-', 4], ['C2', 0.5], ['-', 1.5],
        ['-', 3], ['F#2', 0.5], ['-', 2.5], ['-', 4], ['C2', 0.5], ['-', 1.5]
      ]
    }
  ]
};

// ── Battle: standard combat ────────────────────────────
// Driving 148bpm, urgent minor, noise percussion, 32 beats.
export const SONG_BATTLE = {
  tempo: 148,
  loop: true,
  channels: [
    { // melody — square, urgent, D minor
      wave: 'square', vol: 0.11,
      notes: [
        ['D5', 1], ['F5', 1], ['A4', 1], ['D5', 1], ['C5', 1], ['A4', 1], ['F4', 1], ['G4', 1],
        ['D5', 1], ['F5', 1], ['A4', 1], ['D5', 1], ['E5', 1], ['D5', 1], ['C5', 1], ['A4', 1],
        ['Bb4', 1], ['D5', 1], ['F5', 1], ['Bb4', 1], ['A4', 1], ['F4', 1], ['D4', 1], ['E4', 1],
        ['F4', 1], ['A4', 1], ['D5', 1], ['C5', 1], ['A4', 1], ['F4', 1], ['D4', 2]
      ]
    },
    { // harmony — triangle, driving stabs
      wave: 'triangle', vol: 0.06, staccato: true,
      notes: [
        ['D4', 0.5], ['-', 0.5], ['D4', 0.5], ['-', 0.5], ['F4', 0.5], ['-', 0.5], ['F4', 0.5], ['-', 0.5],
        ['Bb3', 0.5], ['-', 0.5], ['Bb3', 0.5], ['-', 0.5], ['C4', 0.5], ['-', 0.5], ['C4', 0.5], ['-', 0.5],
        ['D4', 0.5], ['-', 0.5], ['D4', 0.5], ['-', 0.5], ['F4', 0.5], ['-', 0.5], ['F4', 0.5], ['-', 0.5],
        ['A3', 0.5], ['-', 0.5], ['A3', 0.5], ['-', 0.5], ['D4', 1], ['-', 1]
      ]
    },
    { // bass — triangle, driving eighths
      wave: 'triangle', vol: 0.17,
      notes: [
        ['D2', 0.5], ['D2', 0.5], ['D2', 0.5], ['D2', 0.5], ['F2', 0.5], ['F2', 0.5], ['G2', 0.5], ['G2', 0.5],
        ['D2', 0.5], ['D2', 0.5], ['D2', 0.5], ['D2', 0.5], ['C2', 0.5], ['C2', 0.5], ['A1', 0.5], ['A1', 0.5],
        ['Bb1', 0.5], ['Bb1', 0.5], ['Bb1', 0.5], ['Bb1', 0.5], ['F1', 0.5], ['F1', 0.5], ['E1', 0.5], ['E1', 0.5],
        ['F1', 0.5], ['F1', 0.5], ['A1', 0.5], ['A1', 0.5], ['D2', 0.5], ['D2', 0.5], ['D2', 1]
      ]
    },
    { // noise percussion — kick/hat pattern
      wave: 'noise', vol: 0.05,
      notes: [
        ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25], ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25],
        ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25], ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25],
        ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25], ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25],
        ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25], ['C3', 0.25], ['-', 0.25], ['C6', 0.25], ['-', 0.25]
      ]
    }
  ]
};

// ── Boss: boss combat ──────────────────────────────────
// Heavier, Void motif fragments, 120-140bpm.
export const SONG_BOSS = {
  tempo: 132,
  loop: true,
  channels: [
    { // melody — sawtooth, heavy, Void motif fragments (descending)
      wave: 'sawtooth', vol: 0.11,
      notes: [
        ['E5', 2], ['-', 0.5], ['E5', 1.5], ['G4', 2], ['F#4', 2],
        ['E4', 2], ['-', 0.5], ['C4', 1.5], ['B3', 2], ['B3', 2],
        ['E5', 2], ['-', 0.5], ['E5', 1.5], ['G4', 2], ['F#4', 2],
        ['E4', 2], ['D4', 2], ['C4', 2], ['B3', 4]
      ]
    },
    { // harmony — triangle, heavy dissonant pad
      wave: 'triangle', vol: 0.07,
      notes: [
        ['C3', 4], ['F#3', 4], ['B2', 4], ['E3', 4], ['C3', 4], ['B2', 4]
      ]
    },
    { // bass — triangle, heavy pulse
      wave: 'triangle', vol: 0.18,
      notes: [
        ['E1', 1], ['E1', 1], ['E2', 1], ['E1', 1], ['C2', 1], ['C1', 1], ['C2', 1], ['C1', 1],
        ['B1', 1], ['B1', 1], ['B2', 1], ['B1', 1], ['F#1', 1], ['F#2', 1], ['F#1', 1], ['E1', 1],
        ['E1', 1], ['E1', 1], ['E2', 1], ['E1', 1], ['C2', 1], ['C1', 1], ['C2', 1], ['C1', 1]
      ]
    },
    { // war-drums — noise percussion, heavy
      wave: 'noise', vol: 0.06,
      notes: [
        ['C2', 0.5], ['-', 0.5], ['C5', 0.5], ['-', 0.5], ['C2', 0.5], ['C2', 0.5], ['C5', 0.5], ['-', 0.5],
        ['C2', 0.5], ['-', 0.5], ['C5', 0.5], ['-', 0.5], ['C2', 0.5], ['C2', 0.5], ['C5', 0.5], ['-', 0.5],
        ['C2', 0.5], ['-', 0.5], ['C5', 0.5], ['-', 0.5], ['C2', 0.5], ['C2', 0.5], ['C5', 0.5], ['-', 0.5]
      ]
    }
  ]
};

// ── Final: final confrontation ─────────────────────────
// Crown motif AND Void motif in counterpoint, dramatic, 32 beats.
export const SONG_FINAL = {
  tempo: 126,
  loop: true,
  channels: [
    { // melody — square, Crown motif (rising E-C-D-E-G-A transposed)
      wave: 'square', vol: 0.11,
      notes: [
        ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['G4', 2], ['A4', 2],
        ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['G4', 2], ['A4', 2],
        ['A4', 1], ['G4', 1], ['E4', 1], ['D4', 1], ['C4', 2], ['E4', 2],
        ['D4', 1], ['C4', 1], ['A3', 1], ['G3', 1], ['A3', 4]
      ]
    },
    { // counter-melody — sine, Void motif (descending E-G-F#-E-C-B, transposed low)
      wave: 'sine', vol: 0.08,
      notes: [
        ['E5', 2], ['G4', 2], ['F#4', 2], ['E4', 2],
        ['E5', 2], ['G4', 2], ['F#4', 2], ['E4', 2],
        ['C5', 2], ['B4', 2], ['A4', 2], ['G4', 2],
        ['C5', 1], ['B4', 1], ['A4', 1], ['G4', 1], ['E4', 4]
      ]
    },
    { // bass — triangle, dramatic pulse
      wave: 'triangle', vol: 0.17,
      notes: [
        ['A1', 2], ['A1', 2], ['E1', 2], ['E1', 2],
        ['A1', 2], ['A1', 2], ['E1', 2], ['E1', 2],
        ['F1', 2], ['F1', 2], ['C2', 2], ['C2', 2],
        ['G1', 2], ['G1', 2], ['A1', 4]
      ]
    },
    { // percussion — noise, dramatic drive
      wave: 'noise', vol: 0.05,
      notes: [
        ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5],
        ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5],
        ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5], ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5],
        ['C3', 0.5], ['-', 0.5], ['C6', 0.5], ['-', 0.5], ['C3', 2]
      ]
    }
  ]
};

// ── Victory: non-loop fanfare built on Crown motif ─────
export const SONG_VICTORY = {
  tempo: 132,
  loop: false,
  channels: [
    {
      wave: 'square', vol: 0.16,
      notes: [
        ['E5', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 0.5], ['G5', 1], ['A5', 2], ['G5', 1], ['A5', 1.5], ['-', 0.5]
      ]
    },
    {
      wave: 'triangle', vol: 0.1,
      notes: [
        ['C4', 1], ['E4', 1], ['A4', 2], ['E4', 2], ['C4', 2]
      ]
    },
    {
      wave: 'triangle', vol: 0.15,
      notes: [
        ['A2', 2], ['F2', 2], ['C2', 2], ['A2', 2]
      ]
    }
  ]
};

// ── Evolution: non-loop transformation cue ─────────────
// Rising, radiant, Crown motif ascending octaves.
export const SONG_EVOLUTION = {
  tempo: 100,
  loop: false,
  channels: [
    {
      wave: 'sine', vol: 0.14,
      notes: [
        ['E3', 0.75], ['C3', 0.75], ['D3', 0.75], ['E3', 0.75],
        ['E4', 0.75], ['C4', 0.75], ['D4', 0.75], ['E4', 0.75],
        ['E5', 1], ['C5', 1], ['D5', 1], ['E5', 1], ['G5', 2]
      ]
    },
    {
      wave: 'triangle', vol: 0.08,
      notes: [
        ['C3', 3], ['A3', 3], ['C4', 3], ['E4', 3]
      ]
    }
  ]
};

// ── Tavern: cozy waltz ─────────────────────────────────
// 3/4 via 1.5-beat groupings, warm.
export const SONG_TAVERN = {
  tempo: 108,
  loop: true,
  channels: [
    { // melody — triangle, warm
      wave: 'triangle', vol: 0.12,
      notes: [
        ['G4', 1.5], ['A4', 0.75], ['B4', 0.75], ['C5', 1.5], ['B4', 1.5],
        ['A4', 1.5], ['G4', 0.75], ['A4', 0.75], ['B4', 3],
        ['C5', 1.5], ['B4', 0.75], ['A4', 0.75], ['G4', 1.5], ['E4', 1.5],
        ['D4', 1.5], ['G4', 0.75], ['A4', 0.75], ['G4', 3]
      ]
    },
    { // waltz oom-pah — square, staccato
      wave: 'square', vol: 0.045, staccato: true,
      notes: [
        ['G2', 0.5], ['D3', 0.5], ['D3', 0.5], ['G2', 0.5], ['D3', 0.5], ['D3', 0.5],
        ['C3', 0.5], ['E3', 0.5], ['E3', 0.5], ['G2', 0.5], ['B3', 0.5], ['B3', 0.5],
        ['C3', 0.5], ['E3', 0.5], ['E3', 0.5], ['G2', 0.5], ['D3', 0.5], ['D3', 0.5],
        ['G2', 0.5], ['B2', 0.5], ['B2', 0.5], ['C3', 0.5], ['E3', 0.5], ['E3', 0.5],
        ['G2', 0.5], ['D3', 0.5], ['D3', 0.5], ['G2', 0.5], ['D3', 0.5], ['D3', 0.5]
      ]
    },
    { // bass — triangle
      wave: 'triangle', vol: 0.13,
      notes: [
        ['G2', 3], ['C2', 3], ['G2', 3], ['C2', 3],
        ['G2', 3], ['D2', 3], ['G2', 3], ['G2', 3]
      ]
    }
  ]
};

// ── Sad: grief scene ────────────────────────────────────
// Sparse sine melody, slow.
export const SONG_SAD = {
  tempo: 66,
  loop: true,
  channels: [
    {
      wave: 'sine', vol: 0.09,
      notes: [
        ['A4', 2], ['-', 1], ['G4', 2], ['-', 1], ['E4', 3], ['-', 1],
        ['D4', 2], ['-', 1], ['C4', 2], ['-', 1], ['A3', 4]
      ]
    },
    {
      wave: 'triangle', vol: 0.05,
      notes: [
        ['A2', 8], ['F2', 8], ['C2', 4], ['G2', 4]
      ]
    }
  ]
};

// ── Tension: cutscene danger ────────────────────────────
// Low ostinato, sparse.
export const SONG_TENSION = {
  tempo: 88,
  loop: true,
  channels: [
    { // low ostinato — triangle
      wave: 'triangle', vol: 0.12,
      notes: [
        ['C2', 0.5], ['-', 0.5], ['C2', 0.5], ['-', 0.5], ['C2', 0.5], ['-', 0.5], ['C2', 0.5], ['-', 0.5],
        ['Db2', 0.5], ['-', 0.5], ['Db2', 0.5], ['-', 0.5], ['C2', 0.5], ['-', 0.5], ['C2', 0.5], ['-', 0.5]
      ]
    },
    { // sparse dissonant accent — sine
      wave: 'sine', vol: 0.05,
      notes: [
        ['-', 3], ['F#4', 1], ['-', 3], ['G4', 1],
        ['-', 3], ['F4', 1], ['-', 3], ['E4', 1]
      ]
    },
    { // faint noise texture
      wave: 'noise', vol: 0.03,
      notes: [
        ['-', 7], ['C3', 1], ['-', 7], ['C3', 1]
      ]
    }
  ]
};

// ── Nova Restored: Nova Prime after recovery ───────────
// SONG_NOVA's chords but brighter major, fuller, Crown motif in melody.
export const SONG_NOVA_RESTORED = {
  tempo: 92,
  loop: true,
  channels: [
    { // melody — square, Crown motif woven in, bright major
      wave: 'square', vol: 0.10,
      notes: [
        ['C5', 1], ['A4', 1], ['B4', 1], ['C5', 1], ['E5', 2], ['-', 1],
        ['B4', 2], ['D5', 2], ['C5', 3], ['-', 1],
        ['A4', 1], ['F4', 1], ['G4', 1], ['A4', 1], ['C5', 2], ['B4', 2],
        ['A4', 6], ['-', 2]
      ]
    },
    { // harmony pad — triangle, fuller
      wave: 'triangle', vol: 0.09,
      notes: [
        ['A3', 4], ['G3', 4], ['F3', 4], ['G3', 4],
        ['A3', 4], ['G3', 4], ['E3', 4], ['E3', 4]
      ]
    },
    { // counter/arpeggio — triangle, brighter than SONG_NOVA original
      wave: 'triangle', vol: 0.06,
      notes: [
        ['E4', 2], ['C4', 2], ['D4', 2], ['B3', 2],
        ['C4', 2], ['A3', 2], ['B3', 2], ['G3', 2],
        ['A3', 2], ['E4', 2], ['G3', 2], ['D4', 2],
        ['E4', 4], ['B3', 4]
      ]
    },
    { // bass — triangle
      wave: 'triangle', vol: 0.15,
      notes: [
        ['A2', 4], ['G2', 4], ['F2', 4], ['G2', 4],
        ['A2', 4], ['G2', 4], ['E2', 4], ['E2', 4]
      ]
    }
  ]
};

// ── Credits: long-form medley ───────────────────────────
// Crown motif, then Mirelight fragment, then triumphant close. 56 beats.
export const SONG_CREDITS = {
  tempo: 100,
  loop: true,
  channels: [
    { // melody — sine, three-part medley
      wave: 'sine', vol: 0.11,
      notes: [
        // Crown motif statement
        ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['G4', 2], ['A4', 2],
        ['E4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['G4', 2], ['A4', 2],
        // Mirelight fragment (dorian, watery)
        ['D4', 1.5], ['F4', 0.75], ['E4', 0.75], ['D4', 1.5], ['C4', 1.5],
        ['A3', 1.5], ['C4', 0.75], ['D4', 0.75], ['E4', 3],
        // Triumphant close — Crown motif ascending
        ['E4', 1], ['G4', 1], ['A4', 1], ['C5', 1], ['E5', 2], ['G5', 2],
        ['A5', 4], ['-', 4]
      ]
    },
    { // harmony pad — triangle
      wave: 'triangle', vol: 0.07,
      notes: [
        ['A3', 4], ['F3', 4], ['D3', 4], ['C3', 4],
        ['A3', 4], ['F3', 4], ['C4', 4], ['G3', 4],
        ['A3', 8], ['C4', 8]
      ]
    },
    { // bass — triangle
      wave: 'triangle', vol: 0.15,
      notes: [
        ['A2', 2], ['A2', 2], ['F2', 2], ['F2', 2], ['D2', 2], ['D2', 2], ['C2', 2], ['C2', 2],
        ['D2', 3], ['A1', 3], ['C2', 3], ['E2', 3],
        ['F2', 2], ['G2', 2], ['A2', 4], ['A2', 4]
      ]
    },
    { // shimmer arpeggio — square, staccato, low vol
      wave: 'square', vol: 0.035, staccato: true,
      notes: [
        ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['C5', 0.5], ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['C5', 0.5],
        ['F4', 0.5], ['A4', 0.5], ['C5', 0.5], ['A4', 0.5], ['F4', 0.5], ['A4', 0.5], ['C5', 0.5], ['A4', 0.5],
        ['D4', 0.75], ['A4', 0.75], ['D5', 0.75], ['A4', 0.75], ['F4', 0.75], ['A4', 0.75], ['D5', 0.75], ['A4', 0.75],
        ['C4', 0.75], ['A4', 0.75], ['C5', 0.75], ['A4', 0.75], ['G4', 0.75], ['B4', 0.75], ['D5', 0.75], ['B4', 0.75],
        ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['G5', 0.5],
        ['A4', 1], ['C5', 1], ['E5', 1], ['A5', 1], ['A4', 4]
      ]
    }
  ]
};

export const MUSIC_LIBRARY = {
  mirelight: SONG_MIRELIGHT,
  ashfall: SONG_ASHFALL,
  kessari: SONG_KESSARI,
  archive: SONG_ARCHIVE,
  void: SONG_VOID,
  battle: SONG_BATTLE,
  boss: SONG_BOSS,
  final: SONG_FINAL,
  victory: SONG_VICTORY,
  evolution: SONG_EVOLUTION,
  tavern: SONG_TAVERN,
  sad: SONG_SAD,
  tension: SONG_TENSION,
  nova_restored: SONG_NOVA_RESTORED,
  credits: SONG_CREDITS
};
