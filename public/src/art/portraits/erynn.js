// ═══════════════════════════════════════════════════════════════
// ERYNN "ERYX" VEXX — dialogue portrait, authored pixel art 48×56
// Bust, 3/4 view facing viewer-left. Felidae woman, dusk-violet fur,
// LARGE upright cat ears (pink-red inner), slit-pupil amber eyes,
// red scarf, blue-steel suit collar. Default: guarded smirk.
// Palette matches public/src/art/sprites/erynn.js (ERYNN_MAP).
// ═══════════════════════════════════════════════════════════════

export const ERYNN_MAP = {
  k: 0x201828,                                         // outline
  f: 0x2d2438, F: 0x4d3d55, m: 0x6f5a78, M: 0x93789c, l: 0xb99cc0, // fur dark→light
  n: 0x1a2230,                                          // inner-ear/nose dark
  i: 0x8a2a3a, I: 0xc24352,                             // inner ear pink-red dark/light
  w: 0xf8f8ff, e: 0xb3852a, E: 0xe8c060,                // eye white / amber iris dark/light
  u: 0x1a2230, U: 0x2a3a4d, s: 0x3d5468, S: 0x567088, x: 0x7a92a8, // suit dark→light
  X: 0x1a2230,                                           // boot dark (reuses suit-dark tone)
  r: 0x8a2a3a, R: 0xc24352, a: 0xe86a6a,                 // scarf accent
  b: 0x201828,                                           // brow-line / lash (outline tone)
  c: 0xe8c060, C: 0xb3852a                               // closed-eye crescent line (amber ramp)
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (guarded smirk) ────────────────────────────────────
// Rows 0-17 tall ears, 6-24 head/fur, 25-38 face, 39-55 scarf/shoulders.
const NEUTRAL = [
row('........kkk.................kkk................'), // 0
row('.......kffk.................kffk...............'), // 1
row('.......kfik.................kifk...............'), // 2
row('......kfiIk.................kIifk..............'), // 3
row('......kfiIk.................kIifk..............'), // 4
row('.....kfiIIk.................kIIifk.............'), // 5
row('.....kfiIIk.................kIIifk.............'), // 6
row('.....kfIIIkk...............kkIIIfk.............'), // 7
row('......kIIIkkk.............kkkIIIk..............'), // 8
row('......kfIIkk.kkkkkkkkkkkkk.kkIIfk...............'), // 9
row('.......kfkk.kFFFFFFFFFFFFk.kkfk................'), // 10
row('.......kk..kFmmMMMMMMMMmmFk..kk.................'), // 11
row('...........kFmMMllllllllMmFk....................'), // 12
row('..........kFmMlllllllllllMmFk...................'), // 13
row('..........kFmMllllllllllllMmFk..................'), // 14
row('.........kFmMlllllllllllllMmFk..................'), // 15
row('.........kFmMllllllllllllllMmFk.................'), // 16
row('.........kFmMllllllllllllllMmFk.................'), // 17
row('.........kFmMlllllllllllllMmFk..................'), // 18
row('.........kFmMMlllllllllllMMmFk..................'), // 19
row('..........kFmMMMllllllMMMmFk....................'), // 20
row('..........kFmmMMMMMMMMMMmmFk....................'), // 21
row('...........kFFmmMMMMMMmmFFk.....................'), // 22
row('............kFFmmmmmmmmFFk......................'), // 23
row('............kFmMllllllMmFk......................'), // 24
row('...........kFmMlweEllEwelMmFk...................'), // 25
row('...........kFmMlwEEllEEwlMmFk...................'), // 26
row('............kMlbbll..llbblMk....................'), // 27
row('............kMllll....llllMk....................'), // 28
row('............kMlll..nn..lllMk....................'), // 29
row('............kMllllllllllllMk....................'), // 30
row('.............kMlllllllllMk......................'), // 31
row('.............kMllrrrllMk........................'), // 32
row('..............kMlrrrlMk.........................'), // 33
row('...............kMllllMk.........................'), // 34
row('................kMMMMk..........................'), // 35
row('.................kFFk...........................'), // 36
row('.................kFFk...........................'), // 37
row('................kFFFFk..........................'), // 38
row('...............kFFFFFFk.........................'), // 39
row('..............krrrrrrrrk........................'), // 40
row('.............krRRRRRRRRrk.......................'), // 41
row('............kUUaRRRRRRaUUk......................'), // 42
row('...........kUsUUaRRRRaUUsUk.....................'), // 43
row('..........kUsSUUUaaaaUUUSsUk....................'), // 44
row('.........kUsSSUUUUUUUUUSSsUk....................'), // 45
row('........kUsSSSsUUUUUUsSSSsUk....................'), // 46
row('.......kUsSSSSSsssssssSSSSsUk...................'), // 47
row('......kUsSSSSSSSSSSSSSSSSSsUk...................'), // 48
row('.....kxUSSSSSSSSSSSSSSSSSSUxk...................'), // 49
row('....kxXUUSSSSSSSSSSSSSSSSUUXxk..................'), // 50
row('...kxXUUUSSSSSSSSSSSSSSSSUUUXxk.................'), // 51
row('..kxXXUUUUSSSSSSSSSSSSSSUUUUXXxk................'), // 52
row('.kxXXXuuuuuuuuuuuuuuuuuuuuuXXXxk................'), // 53
row('.kxXXxxxxxxxxxxxxxxxxxxxxxxXXxk.................'), // 54
row('..kkkkkkkkkkkkkkkkkkkkkkkkkkk...................')  // 55
];

function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPy: eyes bright crescents, corners of mouth lift into grin
const HAPPY = withRows(NEUTRAL, {
  25: '...........kFmMlwceCllCcewlMmFk.................',
  26: '...........kFmMlwccllccwlMmFk...................',
  27: '............kMlbbll..llbblMk....................',
  28: '............kMllll....llllMk....................',
  29: '............kMlll..nn..lllMk....................',
  30: '............kMlllrrrrrrllMk.....................',
  31: '.............kMllrrrrrrlMk......................',
  32: '.............kMlrrrrrrrlMk......................',
  33: '..............kMlrrrrrlMk........................',
  34: '...............kMlllllMk........................'
});

// ── SAD: brows droop, eyelids lowered, mouth turns down, ears lower
const SAD = withRows(NEUTRAL, {
  8: '......kIIIkkk.............kkkIIIk..............',
  9: '......kfIkkk.kkkkkkkkkkkkk.kkkIfk...............',
  25: '...........kFmMlwmEllEmwlMmFk...................',
  26: '...........kFmMlwmmllmmwlMmFk...................',
  27: '............kMlbbll..llbblMk....................',
  28: '............kMllll....llllMk....................',
  29: '............kMlll..nn..lllMk....................',
  30: '............kMllllllllllllMk....................',
  31: '.............kMlrrrlllrrMk......................',
  32: '.............kMlrrrrrrrlMk......................',
  33: '..............kMlrrrlMk.........................'
});

// ── ANGRY: brows sharp v, slit pupils narrower, bared-teeth snarl
const ANGRY = withRows(NEUTRAL, {
  24: '............kFmbllllllbmFk......................',
  25: '...........kFmMbweEllEwebMmFk...................',
  26: '...........kFmMbwEEllEEwbMmFk...................',
  27: '............kMlbbll..llbblMk....................',
  28: '............kMllll....llllMk....................',
  29: '............kMlll..nn..lllMk....................',
  30: '............kMlllrrRRrrllMk.....................',
  31: '.............kMlrRRRRRRrlMk.....................',
  32: '.............kMlRwRwRwRlMk......................',
  33: '..............kMlRRRRRlMk........................'
});

// ── SURPRISED: brows raised (ears perk higher), eyes wide round, mouth small "o"
const SURPRISED = withRows(NEUTRAL, {
  0: '........kfkk.................kkfk...............',
  1: '.......kfIk.................kIfk................',
  25: '...........kFmMlwEEllEEwlMmFk...................',
  26: '...........kFmMlwEEllEEwlMmFk...................',
  27: '............kMlwwll..llwwlMk....................',
  28: '............kMllll....llllMk....................',
  29: '............kMlll..nn..lllMk....................',
  30: '............kMllll....llllMk....................',
  31: '.............kMll.rr.llMk.......................',
  32: '.............kMl.rrrr.lMk.......................',
  33: '..............kMl.rr.lMk.........................',
  34: '...............kMllllMk.........................'
});

export const ERYNN_PORTRAIT = {
  id: 'erynn',
  w: W, h: H,
  map: ERYNN_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
