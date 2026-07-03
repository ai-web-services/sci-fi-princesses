// ═══════════════════════════════════════════════════════════════
// PIP — dialogue portrait, authored pixel art 48×56
// Bust framing of a hovering construct: cobalt round shell, ONE BIG
// teal glowing eye, brass antenna. Expressions are conveyed entirely
// through eye aperture/shape + antenna angle (no face otherwise).
// Default: calm round eye, antenna upright.
// Palette matches public/src/art/sprites/pip.js (PIP_MAP).
// ═══════════════════════════════════════════════════════════════

export const PIP_MAP = {
  k: 0x18202e,                                          // outline
  b: 0x2a3a55, B: 0x3d5680, s: 0x5578ab, S: 0x7a9ed0, l: 0xa8c8f0, // shell dark→light
  c: 0x1a6a6a, C: 0x2a9a92, e: 0x44ccb8, E: 0x77eed4, w: 0xbafff0, // core teal glow dark→light
  a: 0x6a4a1a, A: 0x9a702a, r: 0xc49a3d, R: 0xe0c060    // brass antenna/fins
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (calm, upright antenna, round steady eye) ──────────
// Rows 0-9 antenna, 10-45 shell body (big round bust filling frame),
// 46-55 lower hover-glow shoulders/fins.
const NEUTRAL = [
row('........................rR......................'), // 0
row('........................rR......................'), // 1
row('........................Ra......................'), // 2
row('.........................a......................'), // 3
row('.........................k......................'), // 4
row('.........................k......................'), // 5
row('.........................k......................'), // 6
row('........................kk......................'), // 7
row('...................kkkkkkkkkkk..................'), // 8
row('................kkbBBBBBBBBBbkk.................'), // 9
row('..............kbBBssssssssssBBbk................'), // 10
row('............kbBBssSSSSSSSSSSssBBbk..............'), // 11
row('...........kbBsSSSSSSSSSSSSSSSSsBbk.............'), // 12
row('..........kbBsSSllllllllllllllSSsBbk............'), // 13
row('.........kbBsSSlllllllllllllllllSSsBbk..........'), // 14
row('........kaBsSSllllllllllllllllllllSsBAk.........'), // 15
row('........kABsSllllcccccccccllllllSsBAk...........'), // 16
row('.......kABsSlllccCCCCCCCCCccllllSsBAk...........'), // 17
row('.......kABsSllcCCeeeeeeeeeCCcllllSsBAk..........'), // 18
row('.......kABsSllcCeeEEEEEEEEeeCclllSsBAk..........'), // 19
row('.......kABsSlcCeeEEwwwwwwEEeeCcllSsBAk..........'), // 20
row('.......kABsSlcCeeEwwwwwwwwEeeCcllSsBAk..........'), // 21
row('.......kABsSlcCeeEwwwwwwwwEeeCcllSsBAk..........'), // 22
row('.......kABsSlcCeeEwwwwwwwwEeeCcllSsBAk..........'), // 23
row('.......kABsSlcCeeEEwwwwwwEEeeCcllSsBAk..........'), // 24
row('.......kABsSllcCeeEEEEEEEEeeCcllllSsBAk.........'), // 25
row('.......kABsSllcCCeeeeeeeeeCCcllllSsBAk..........'), // 26
row('........kABsSllccCCCCCCCCCcllllllSsBAk..........'), // 27
row('........kaBsSllllcccccccccllllllllSsBak.........'), // 28
row('.........kbBsSllllllllllllllllllllSsBbk.........'), // 29
row('..........kbBsSSlllllllllllllllllSSsBbk.........'), // 30
row('...........kbBsSSSlllllllllllllSSsBbk...........'), // 31
row('............kbBsSSSSSllllllSSSSsBbk.............'), // 32
row('.............kbBssSSSSSSSSSSssBbk...............'), // 33
row('..............kbBBssssssssssBBbk................'), // 34
row('...............kkbBBBBBBBBBbkk..................'), // 35
row('..................kkkkkkkkkkk...................'), // 36
row('...................kbbbbbbbk....................'), // 37
row('...................kBBBBBBBk....................'), // 38
row('....................kssssk......................'), // 39
row('....................kssssk......................'), // 40
row('...................kBBBBBBk.....................'), // 41
row('..................kbBBBBBBbk....................'), // 42
row('.................kbBssssssBbk...................'), // 43
row('................kbBsSSSSSSsBbk..................'), // 44
row('...............kbBsSSSSSSSSsBbk.................'), // 45
row('..............kbBsSeeeeeeeeSsBbk................'), // 46
row('.............kbBsSeEEEEEEEEesSbk................'), // 47
row('.............kBsSeEwwwwwwwwEesSk................'), // 48
row('.............kBsSeEwwwwwwwwEesSk................'), // 49
row('.............kBsSeEEEEEEEEEeesSk................'), // 50
row('..............kBsSeeeeeeeeeesSk.................'), // 51
row('...............kBBsssssssssBBk..................'), // 52
row('................kBBBBBBBBBBBk...................'), // 53
row('.................kkkkkkkkkkk....................'), // 54
row('................................................')  // 55
];

function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPY: antenna tilts jaunty, eye becomes bright upward crescent
const HAPPY = withRows(NEUTRAL, {
  0: '.......................rR.......................',
  1: '......................rR........................',
  2: '.....................Ra.........................',
  3: '....................a...........................',
  4: '....................k...........................',
  5: '.....................k..........................',
  6: '......................k.........................',
  7: '......................kk........................',
  17: '.......kABsSlllccCCCCCCCCCccllllSsBAk...........',
  18: '.......kABsSllcCCeeeeeeeeeCCcllllSsBAk..........',
  19: '.......kABsSlcCEEEEEEEEEEEECcllllSsBAk..........',
  20: '.......kABsSlcCwwwwwwwwwwwwCcllSsBAk............',
  21: '.......kABsSlccCeeeeeeeeeeCcllllSsBAk...........',
  22: '.......kABsSllcCCCeeeeeeCCCcllllllSsBAk.........',
  23: '.......kABsSlllcCCCCCCCCCcllllllllSsBAk.........',
  24: '.......kABsSllllccccccccclllllllllSsBAk.........'
});

// ── SAD: antenna droops low, eye dims and narrows into low sagging arc
const SAD = withRows(NEUTRAL, {
  0: '................................................',
  1: '................................................',
  2: '................................................',
  3: '................................................',
  4: '........................k.......................',
  5: '.......................rk.......................',
  6: '.......................Ra.......................',
  7: '......................kak.......................',
  18: '.......kABsSllcCCbccccccccbCCcllllSsBAk.........',
  19: '.......kABsSlcCbbccccccccccbbCcllSsBAk..........',
  20: '.......kABsSlcCbbbbcccccccbbbbCcllSsBAk.........',
  21: '.......kABsSlcCcbbbeeeeeeebbbcCcllSsBAk.........',
  22: '.......kABsSlcCcbbeeEEEEEEebbcCcllSsBAk.........',
  23: '........kABsSlcCbbeeeEEEEEebbcCcllSsBAk........',
  24: '.........kABsSllcCbeeeeeeebCclllllSsBAk........',
  25: '..........kABsSlllcCbbbbbbCcllllllSsBAk........'
});

// ── ANGRY: antenna snaps rigid/sharp-angled, eye narrows to a hard slit
const ANGRY = withRows(NEUTRAL, {
  0: '........................rk......................',
  1: '........................Rk......................',
  2: '........................ak......................',
  3: '........................kk......................',
  4: '........................k.......................',
  17: '.......kABsSlllccCCCCCCCCCccllllSsBAk...........',
  18: '.......kABsSllcCCCCCCCCCCCCCcllllSsBAk..........',
  19: '.......kABsSlcCCCCCCCCCCCCCCCcllllSsBAk.........',
  20: '.......kABsSlcCCeeeeeeeeeeeCCcllSsBAk...........',
  21: '.......kABsSlcCeeEEEEEEEEEEeCcllllSsBAk.........',
  22: '.......kABsSlcCeeEEEEEEEEEEeCcllllSsBAk.........',
  23: '.......kABsSlcCCeeeeeeeeeeeCCcllllSsBAk.........',
  24: '.......kABsSllcCCCCCCCCCCCCCcllllllSsBAk.......',
  25: '.......kABsSlllccCCCCCCCCCccllllllSsBAk........'
});

// ── SURPRISED: antenna snaps upright + wide, eye blows wide open and bright
const SURPRISED = withRows(NEUTRAL, {
  0: '........................rR......................',
  1: '........................rR......................',
  2: '........................Ra......................',
  3: '........................Ra......................',
  4: '........................a.......................',
  5: '........................k.......................',
  6: '........................k.......................',
  7: '........................kk......................',
  15: '........kaBsSSllllllllllllllllllllSsBAk.........',
  16: '........kABsSllllccccccccccclllllSsBAk..........',
  17: '.......kABsSlllcCCEEEEEEEEECCcllllSsBAk.........',
  18: '.......kABsSllcCEEwwwwwwwwwwEECcllSsBAk.........',
  19: '.......kABsSlcCEwwwwwwwwwwwwwEECcllSsBAk........',
  20: '.......kABsSlcCEwwwwwwwwwwwwwEECcllSsBAk........',
  21: '.......kABsSlcCEwwwwwwwwwwwwwEECcllSsBAk........',
  22: '.......kABsSlcCEwwwwwwwwwwwwwEECcllSsBAk........',
  23: '.......kABsSlcCEwwwwwwwwwwwwwEECcllSsBAk........',
  24: '.......kABsSlcCEEwwwwwwwwwwwwEECcllSsBAk........',
  25: '.......kABsSllcCEEwwwwwwwwwwEECcllllSsBAk.......',
  26: '.......kABsSllcCCEEEEEEEEEEEECcllllSsBAk........',
  27: '........kABsSllcCCCCCCCCCCCCcllllllSsBAk........'
});

export const PIP_PORTRAIT = {
  id: 'pip',
  w: W, h: H,
  map: PIP_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
