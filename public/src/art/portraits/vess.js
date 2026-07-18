// ═══════════════════════════════════════════════════════════════
// SILK BARONESS VESS — dialogue portrait, authored pixel art 48×56
// Bust, 3/4 view facing viewer-left. Kessari Reach smuggler-baroness.
// Veiled/masked face (only eyes visible), ornate purple/magenta
// headwrap with gold trim and jewelry, opulent silk robe collar.
// Default: imperious, composed — a duelist-queen, not a soldier.
// ═══════════════════════════════════════════════════════════════

export const VESS_MAP = {
  k: 0x0d0810,                                            // outline
  d: 0x2a1030, D: 0x4a1a58, m: 0x6b2a80, M: 0x8c3aa0, g: 0xb050c4, G: 0xd888e0, // silk wrap dark->light
  y: 0x9a7522, Y: 0xc9a132, z: 0xedcb55,                  // gold trim dark/mid/light
  w: 0xf8f8ff, e: 0x2a8ab0, E: 0x5cc8e8,                   // eye white / iris dark/light (icy teal vs veil)
  n: 0x0d0810,                                             // pupil dark
  v: 0x1c1424, V: 0x342a48,                                // veil shadow dark/mid (sheer fabric, lower face)
  b: 0x0d0810,                                             // brow-line
  c: 0x2a8ab0                                              // closed-eye crescent (iris-dark tone)
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (imperious, composed smuggler-baroness) ────────────
// Rows 0-8: ornate peaked headwrap w/ gold trim.
// Rows 9-19: hood/wrap frame around face; 12-16 eyes (only visible feature).
// Rows 18-29: sheer veil covering nose/mouth/jaw.
// Rows 30-55: shoulders, opulent purple/magenta robe collar, gold jewelry.
const NEUTRAL = [
row('......................zz.......................'), // 0
row('....................yzzzzy.....................'), // 1
row('..................yzzzzzzzzy...................'), // 2
row('................yzzzzYYYYzzzzy.................'), // 3
row('..............yzzzYYYYYYYYYYzzzy...............'), // 4
row('............kmzzYYYYYYYYYYYYYYzzmk.............'), // 5
row('..........kmmDzYYYYYYYYYYYYYYYYzDmmk...........'), // 6
row('.........kmDDDzzYYYYYYYYYYYYYYzzDDDmk..........'), // 7
row('........kmDDDDDzzzzYYYYYYYYzzzzDDDDDmk.........'), // 8
row('.......kmDDDDDDDDzzzzzzzzzzzzDDDDDDDDmk........'), // 9
row('.......kmDDDDDDDDDDDDDDDDDDDDDDDDDDDDmk........'), // 10
row('......kmMDDDDDDDDDDDDDDDDDDDDDDDDDDDDMmk.......'), // 11
row('......kmMDDDDDDkkkkkkkkkkkkkkkDDDDDDDMmk.......'), // 12
row('......kmMDDDDkeewkkkkkkkkkkeewkDDDDDMmk........'), // 13
row('......kmMDDDDkeEwkkkkkkkkkkeEwkDDDDDMmk........'), // 14
row('......kmMDDDDkbbkkkkkkkkkkkbbkDDDDDDMmk........'), // 15
row('......kmMDDDDDDkkkkkkkkkkkkkDDDDDDDDMmk........'), // 16
row('......kmMDDDDDDDDDDDDDDDDDDDDDDDDDDDDMmk.......'), // 17
row('.......kmMDDDDvvvvvvvvvvvvvvvvDDDDDMmk.........'), // 18
row('.......kmMDDDvVVVVVVVVVVVVVVVVvDDDMmk..........'), // 19
row('........kmDDvVVVVVVVVVVVVVVVVVvDDmk...........'), // 20
row('........kmDvVVVVVVVVVVVVVVVVVVVvDmk...........'), // 21
row('.........kmvVVVVVVVVVVVVVVVVVVVvmk............'), // 22
row('.........kmvVVVVVVVVVVVVVVVVVVvmk.............'), // 23
row('..........kvVVVVVVVVVVVVVVVVVvk...............'), // 24
row('..........kvVVVVVVVVVVVVVVVVvk................'), // 25
row('...........kvVVVVVVVVVVVVVVvk.................'), // 26
row('...........kvvvvvvvvvvvvvvvk..................'), // 27
row('............kvvvvvvvvvvvvk....................'), // 28
row('.............kkkkkkkkkkkk......................'), // 29
row('............kDDDDDDDDDDDDk.....................'), // 30
row('...........kDmMMMMMMMMMMMmDk...................'), // 31
row('..........kDmMGGGGGGGGGGGGMmDk.................'), // 32
row('.........kDmMGGgggggggggggGGMmDk...............'), // 33
row('........kDmMGGggzYYYYYYYzzggGGMmDk.............'), // 34
row('.......kDmMGGggzYzzzzzzzzYzggGGMmDk............'), // 35
row('......kDmMGGggzYzzzzzzzzzzYzggGGMmDk...........'), // 36
row('......kDmMGgzYzzzzzzzzzzzzzzYzgGMmDk...........'), // 37
row('.....kDmMGGgzYzzzzzzzzzzzzzzzYzgGGMmDk.........'), // 38
row('.....kDmMGgzYzzzzzzzzzzzzzzzzzYzgGMmDk.........'), // 39
row('....kDmMGGgzzzzzzzzzzzzzzzzzzzzzzgGGMmDk.......'), // 40
row('....kDmMGgggggzzzzzzzzzzzzzzzggggGMmDk.........'), // 41
row('...kDmMGGGGGGGgggggggggggggggGGGGGGMmDk........'), // 42
row('...kDmMMGGGGGGGGGGGGGGGGGGGGGGGGGGMMmDk........'), // 43
row('..kDDmMMMGGGGGGGGGGGGGGGGGGGGGGGGMMMmDDk.......'), // 44
row('..kDDDmMMMMMGGGGGGGGGGGGGGGGGMMMMMmDDDk........'), // 45
row('.kDDDDmMMMMMMMMMMMMMMMMMMMMMMMMMMMmDDDDk.......'), // 46
row('kDDDDDDmMMMMMMMMMMMMMMMMMMMMMMMMMmDDDDDDk......'), // 47
row('kDDDDDDDmMMMMMMMMMMMMMMMMMMMMMMMmDDDDDDDk......'), // 48
row('kDDDDDDDDmMMMMMMMMMMMMMMMMMMMMMmDDDDDDDDk......'), // 49
row('kyYzzzzzzzYMMMMMMMMMMMMMMMMMYzzzzzzzYzYk.......'), // 50
row('kyYYzzzzzzzzzYYYYYYYYYYYYYzzzzzzzzzYYYk........'), // 51
row('.kyYYzzzzzzzzzzzzzzzzzzzzzzzzzzzzzYYYk.........'), // 52
row('..kyYYzzzzzzzzzzzzzzzzzzzzzzzzzzYYYk...........'), // 53
row('...kkyyYYYYYYYYYYYYYYYYYYYYYYYYyykk............'), // 54
row('....................................kk.........')  // 55
];

function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPY: rare, thin satisfied smirk-line at veil edge, eyes soften
const HAPPY = withRows(NEUTRAL, {
  13: '......kmMDDDDkcEwkkkkkkkkkkcEwkDDDDDMmk........',
  14: '......kmMDDDDkeEEkkkkkkkkkkeEEkDDDDDMmk........',
  18: '.......kmMDDDDvvvGvvvvvvvvGvvvDDDDDMmk.........'
});

// ── SAD: heavy-lidded downcast eyes, veil droops slightly
const SAD = withRows(NEUTRAL, {
  13: '......kmMDDDDkbbkkkkkkkkkkkbbkDDDDDMmk.........',
  14: '......kmMDDDDkeewkkkkkkkkkkeewkDDDDDMmk........',
  15: '......kmMDDDDkbcwkkkkkkkkkkbcwkDDDDDDMmk.......',
  19: '.......kmMDDDvVVVvVVVVVVVVvVVVvDDDMmk..........'
});

// ── ANGRY: brows sharpen inward, eyes narrow to slits, veil pulled taut
const ANGRY = withRows(NEUTRAL, {
  12: '......kmMDDDDDkbkkkkkkkkkkkkbkDDDDDDMmk........',
  13: '......kmMDDDkbbnwkkkkkkkkkbnwbkDDDDDMmk........',
  14: '......kmMDDDDkneekkkkkkkkkkneekDDDDDMmk........',
  15: '......kmMDDDDDkkkkkkkkkkkkkkkDDDDDDDMmk........',
  18: '.......kmMDDDDvVvvvvvvvvvvvvVvDDDDDMmk.........'
});

// ── SURPRISED: eyes widen fully, brows lift, veil edge lifts slightly
const SURPRISED = withRows(NEUTRAL, {
  11: '......kmMDDDDDDDDDDDDDDDDDDDDDDDDDDDDMmk.......',
  12: '......kmMDDDkbkkkkkkkkkkkkkkkkkbkDDDDDMmk......',
  13: '......kmMDDDkbewwkkkkkkkkkkewwbkDDDDMmk........',
  14: '......kmMDDDkeEEwkkkkkkkkkkeEEwkDDDDMmk........',
  15: '......kmMDDDkbnnkkkkkkkkkkkbnnkDDDDDMmk........',
  16: '......kmMDDDDDkkkkkkkkkkkkkkkDDDDDDDMmk........'
});

export const VESS_PORTRAIT = {
  id: 'vess',
  w: W, h: H,
  map: VESS_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
