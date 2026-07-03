// ═══════════════════════════════════════════════════════════════
// DRAKKOR ASHVEIL — dialogue portrait, authored pixel art 48×56
// Bust, 3/4 view facing viewer-left. Drakonid, ember-orange scales,
// pale swept-back horns, strong snout, gold slit eyes, dark plate
// pauldrons. Default: proud stern.
// Palette matches public/src/art/sprites/drakkor.js (DRAKKOR_MAP).
// ═══════════════════════════════════════════════════════════════

export const DRAKKOR_MAP = {
  k: 0x1a1010,                                          // outline
  d: 0x4d1a1a, D: 0x7a2a22, s: 0xa8422a, S: 0xd06033, l: 0xf28a4a, // scale dark→light
  h: 0x8a7a5a, H: 0xd4c69a, j: 0xfaf4d8,                 // horn dark/mid/light
  w: 0xf8f8ff, e: 0xb3852a, E: 0xffd166,                 // eye white / draconic iris dark/light
  n: 0x1a1010,                                           // nostril/pupil dark
  p: 0x2a2530, P: 0x453f4d, q: 0x635a6d, Q: 0x847a8f, x: 0xa89eb3, // plate dark→light
  b: 0x1a1010,                                           // brow-line / lash (outline tone)
  c: 0xb3852a                                            // closed-eye crescent line (iris-dark tone)
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (proud stern) ──────────────────────────────────────
// Rows 0-8 swept horns, 6-32 head/snout, 33-55 pauldrons/chest.
const NEUTRAL = [
row('...............hH.......Hh......................'), // 0
row('.............hHH...........HHh..................'), // 1
row('..........hHHj...............jHHh...............'), // 2
row('.......hHHj.......................jHHh..........'), // 3
row('....hHHj...........................jHHh.........'), // 4
row('..hHj.................................jHh.......'), // 5
row('.hj.......kkkkkkkkkkkkkkkkkkk...........jh......'), // 6
row('..k....kkSSllllllllllllllSSkk...........k.......'), // 7
row('..k..kSSlllllllllllllllllllSSk..................'), // 8
row('.....kSllllllllllllllllllllllSk.................'), // 9
row('....kSlllwe...............ewllSk................'), // 10
row('....kSllwEE...............EEwllSk...............'), // 11
row('....kSllwEEn...............nEEwllSk.............'), // 12
row('....kSlllbb...............bbllSk................'), // 13
row('.....kSllllllllllllllllllllSk...................'), // 14
row('.....kSSllllllllllllllllllSSk...................'), // 15
row('......kSSlllllllllllllllSSk.....................'), // 16
row('.......kSSllllllllllllSSk.......................'), // 17
row('........kSSllnnllnnllSSk........................'), // 18
row('.........kSSlllllllllSSk........................'), // 19
row('..........kSSlllllllSSk.........................'), // 20
row('...........kSSllllSSSk..........................'), // 21
row('............kSSllSSk............................'), // 22
row('.............kSSSSk.............................'), // 23
row('.............kDDDDk.............................'), // 24
row('............kDssssDk............................'), // 25
row('...........kDsSSSSsDk...........................'), // 26
row('..........kDsSllllSsDk..........................'), // 27
row('..........kDsSllllSsDk..........................'), // 28
row('...........kDsSSSSsDk...........................'), // 29
row('............kDDssDDk............................'), // 30
row('.............kDDDDk.............................'), // 31
row('..............kDDk..............................'), // 32
row('.............kDDDDk.............................'), // 33
row('............kPPQQQQPPk..........................'), // 34
row('...........kPPQQQQQQQQPPk.......................'), // 35
row('..........kPPQQxxxxxxQQPPk......................'), // 36
row('.........kPPQQxDDDDDDxQQPPk.....................'), // 37
row('........kPPQQxDDssssDDxQQPPk....................'), // 38
row('.......kPPQQxDDsSllllSsDDxQQPPk.................'), // 39
row('......kPPQQxDDsSllllllSsDDxQQPPk................'), // 40
row('.....kPPQQxDDsSSllllllSSsDDxQQPPk...............'), // 41
row('....kPPQQxDDsSSSllllllSSSsDDxQQPPk..............'), // 42
row('...kPPQQxDDsSSSSllllllSSSSsDDxQQPPk.............'), // 43
row('..kPPQQxDDsSSSSSllllllSSSSSsDDxQQPPk............'), // 44
row('.kPPQQxDDsSSSSSSllllllSSSSSSsDDxQQPPk...........'), // 45
row('kPPQQxDDsSSSSSSSllllllSSSSSSSsDDxQQPPk..........'), // 46
row('kPQQxDDsSSSSSSSSllllllSSSSSSSSsDDxQQPk..........'), // 47
row('kPQxDDsSSSSSSSSSllllllSSSSSSSSSsDDxQPk..........'), // 48
row('kQxDDssssssssssssssssssssssssssssDDxQk..........'), // 49
row('kQxDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDxQk..........'), // 50
row('kQQqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqQQk..........'), // 51
row('.kQQQqqqqqqqqqqqqqqqqqqqqqqqqqqqqQQQk...........'), // 52
row('..kppppppppppppppppppppppppppppppppk............'), // 53
row('...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk............'), // 54
row('................................................')  // 55
];

function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPY: rare toothy pride-grin, eyes narrow with satisfaction
const HAPPY = withRows(NEUTRAL, {
  10: '....kSlllcE...............Ecllsk................',
  11: '....kSllcEE...............EEcllSk...............',
  12: '....kSllcEEn...............nEEcllSk.............',
  18: '........kSSllHHllnnllHHllSSk....................',
  19: '.........kSSlllHHHHHHHllllSSk...................',
  20: '..........kSSlllllllllSSk.......................',
  21: '...........kSSllllllSSSk........................'
});

// ── SAD: rare — heavy-lidded eyes, snout droops, head lowers slightly
const SAD = withRows(NEUTRAL, {
  10: '.....kSlllwd...............dwllSk...............',
  11: '.....kSllwdd...............ddwllSk..............',
  12: '.....kSllwddn...............nddwllSk............',
  13: '.....kSlllbb...............bbllSk...............',
  18: '........kSSlldnnlldnnllSSk......................',
  19: '.........kSSlllllllllSSk........................',
  20: '..........kSSlllllllSSk.........................',
  21: '...........kSSlllSSSk...........................'
});

// ── ANGRY: brow scales lower and sharpen, eyes slit tight, snout snarl
const ANGRY = withRows(NEUTRAL, {
  7: '..k...kkDDllllllllllllllDDkk............k.......',
  8: '..k..kDDlllllllllllllllllllDDk..................',
  10: '....kSlllne...............enllSk................',
  11: '....kSllnEE...............EEnllSk...............',
  12: '....kSllnEEn...............nEEnllSk.............',
  18: '........kSSlldnnDDnndllSSk......................',
  19: '.........kSSlDDDDDDDDDlllSSk....................',
  20: '..........kSSllDDDDDDDllSSk.....................',
  21: '...........kSSlDDDDDlSSSk.......................'
});

// ── SURPRISED: eyes widen fully round, brow scales raise, jaw drops
const SURPRISED = withRows(NEUTRAL, {
  6: '.hj.......kkkkkkkkkkkkkkkkkkk...........jh......',
  9: '.....kSllllllllllllllllllllllSk.................',
  10: '....kSlllwEE...............EEwllSk..............',
  11: '....kSllwEEE...............EEEwllSk.............',
  12: '....kSllwEEEn...............nEEEwllSk...........',
  18: '........kSSllnnllnnllSSk........................',
  19: '.........kSSlllllllllSSk........................',
  20: '..........kSSlnnnnnnnSSk........................',
  21: '...........kSSlnnnnSSSk.........................',
  22: '............kSSlnnSSk...........................',
  23: '.............kSSnnk.............................'
});

export const DRAKKOR_PORTRAIT = {
  id: 'drakkor',
  w: W, h: H,
  map: DRAKKOR_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
