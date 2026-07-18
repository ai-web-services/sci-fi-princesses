// ═══════════════════════════════════════════════════════════════
// PIP — exploration sprite, authored pixel art 32×40.
// Full redraw per ART_VISION.md §2.1/§3.3 (no concept sheet — this
// file, art/portraits/pip.js, and art/battle/heroes/pip.js are the
// authoritative design). Small chassis sphere (white-steel shell),
// ONE big teal eye, thin violet accent ring at the equator, brass
// antenna nub on top. Pip has no legs: the ground band beneath the
// chassis holds a hover thruster glow that pulses in place of a
// walk cycle, with a visible transparent gap between the chassis
// underside and the glow so Pip always reads as floating.
// Grids: body rows 0–34 (35 rows, chassis + antenna, hover gap
// baked in near the bottom) + hover-glow variants (stand/a/b) rows
// 35–39 (5 rows) per direction. All rows normalized to 32 chars.
// ═══════════════════════════════════════════════════════════════

const W = 32;
const norm = rows => rows.map(r => r.padEnd(W, '.').slice(0, W));

export const PIP_MAP = {
  k: 0x1a1a2a,                                        // outline (ART_VISION binding)
  s: 0x778899, S: 0x9fb0c2, l: 0xccd4e0, L: 0xe8edf4,  // chassis white-steel dark→light
  c: 0x1f7a86, e: 0x2fa8c2, E: 0x44ddff, w: 0xaef2ff,  // single eye teal dark→light
  v: 0x6a2f9e, V: 0xaa44ff,                            // accent ring
  a: 0x6a4a1a, A: 0x9a702a, r: 0xc49a3d, R: 0xe0c060,  // antenna brass/bronze
  g: 0xb8860a, G: 0xffcc33, Y: 0xfff0b0,               // thruster glow
  d: 0x222233                                          // darks
};

// ── DOWN (front) ────────────────────────────────────────
const DOWN_BODY = norm([
  '................................',
  '................................',
  '................................',
  '...............rR..............',
  '...............Ra...............',
  '................k...............',
  '................k...............',
  '.............kkkkkkk............',
  '............kllllllk............',
  '...........klLLLLLLlk...........',
  '..........klLssssssLlk..........',
  '.........klLsSSSSSSSSLlk........',
  '.........klLsSeeeeeSsSLlk.......',
  '........klLsSeEwwwEeSsSLlk......',
  '........klLsSeEwwwEeSsSLlk......',
  '........klLsSeEwwwEeSsSLlk......',
  '........klLsSeeeeeeeSsSLlk......',
  '.........klLsSSSSSSSSLlk........',
  '.........klLssssssssLlk.........',
  '..........klLvVVVVVvLlk.........',
  '..........klvVVVVVVVvlk.........',
  '...........kvVVVVVVVvk..........',
  '...........kSlllllllSk..........',
  '............kSllllSk............',
  '.............kSllSk.............',
  '..............kkkk..............',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................'
]);

const DOWN_LEGS = {
  stand: norm([
    '................................',
    '................................',
    '..........kGGGGGGGGGk...........',
    '...........kYYYYYYYk............',
    '............kYYYYYk.............'
  ]),
  a: norm([
    '................................',
    '.........kGGGGGGGGGGGk..........',
    '..........kYYYYYYYYYk...........',
    '...........kYYYYYYYk............',
    '............kYYYYYk.............'
  ]),
  b: norm([
    '................................',
    '................................',
    '...........kGgGgGgGk............',
    '............kGYYYGk.............',
    '.............kYYYk..............'
  ])
};

// ── UP (back) ───────────────────────────────────────────
const UP_BODY = norm([
  '................................',
  '................................',
  '................................',
  '...............rR..............',
  '...............Ra...............',
  '................k...............',
  '................k...............',
  '.............kkkkkkk............',
  '............kllllllk............',
  '...........klLLLLLLlk...........',
  '..........klLssssssLlk..........',
  '.........klLsSSSSSSSSLlk........',
  '.........klLsSSSSSSSSSLlk.......',
  '........klLsSSSssSSSSSLlk.......',
  '........klLsSSSssSSSSSLlk.......',
  '........klLsSSSssSSSSSLlk.......',
  '........klLsSSSSSSSSSSLlk.......',
  '.........klLsSSSSSSSSLlk........',
  '.........klLssssssssLlk.........',
  '..........klLvVVVVVvLlk.........',
  '..........klvVVVVVVVvlk.........',
  '...........kvVVVVVVVvk..........',
  '...........kSlllllllSk..........',
  '............kSllllSk............',
  '.............kSllSk.............',
  '..............kkkk..............',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................'
]);

// ── SIDE (profile, mirrored for the opposite side by flipX) ─
const SIDE_BODY = norm([
  '................................',
  '................................',
  '................................',
  '............rR..................',
  '............Ra...................',
  '.............k...................',
  '.............k...................',
  '..........kkkkkkk................',
  '.........kllllllk................',
  '........klLLLLLLlk...............',
  '.......klLsssssLlk...............',
  '......klLsSeeeeSsLlk.............',
  '......klLsSeEwwEeSsLlk...........',
  '......klLsSeEwwEeSsLlk...........',
  '......klLsSeEwwEeSsLlk...........',
  '......klLsSeeeeeeSsLlk...........',
  '.......klLsSSSSSSSLlk............',
  '.......klLssssssssLlk............',
  '........klLvVVVVvLlk.............',
  '........klvVVVVVVvlk.............',
  '.........kvVVVVVVvk..............',
  '.........kSlllllllSk.............',
  '..........kSllllSk...............',
  '...........kSllSk................',
  '............kkkk.................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................'
]);

const SIDE_LEGS = {
  stand: norm([
    '................................',
    '.......kGGGGGGGGGk...............',
    '........kYYYYYYYk................',
    '.........kYYYYYk.................',
    '................................'
  ]),
  a: norm([
    '......kGGGGGGGGGGGk..............',
    '.......kYYYYYYYYYk...............',
    '........kYYYYYYYk................',
    '.........kYYYYYk.................',
    '................................'
  ]),
  b: norm([
    '................................',
    '........kGgGgGgGk................',
    '.........kGYYYGk.................',
    '..........kYYYk..................',
    '................................'
  ])
};

export const PIP_SPRITE = {
  id: 'pip',
  map: PIP_MAP,
  w: 32, h: 40,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
