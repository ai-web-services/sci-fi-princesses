// ═══════════════════════════════════════════════════════════════
// LYRA SOLARI — exploration sprite, authored pixel art 32×40.
// Act 1 base form (Crown Bearer) per concept sheet: blue military
// jacket with gold trim, brown belt, dark pants, dark boots with
// gold caps, crown-shard pendant. FFIV big-head heroic chibi.
// Grids: body rows 0–34 (35 rows) + leg variants rows 35–39 (5
// rows) per direction. All rows normalized to exactly 32 chars.
// ═══════════════════════════════════════════════════════════════

const W = 32;
const norm = rows => rows.map(r => r.padEnd(W, '.').slice(0, W));

export const LYRA_MAP = {
  k: 0x1a1a2a,                              // outline (ART_VISION binding)
  h: 0xcc8833, H: 0xffdd44,                 // hair dark→light
  s: 0xddaa88, S: 0xffccaa,                 // skin shadow/base
  w: 0xf8f8ff, e: 0x44ddff,                 // eye white / iris
  d: 0x222233, D: 0x3344aa, P: 0x223388,    // jacket dark outline-shade / base / deep shade
  g: 0x553322, G: 0xd9a92a,                 // bronze / gold trim
  j: 0xaa44ff,                              // crown-shard pendant
  b: 0x111111, B: 0x2e2255,                 // pants dark
  o: 0x553322, O: 0x778899                  // boots bronze / metal cap
};

const DOWN_BODY = norm([
  '................................',
  '................................',
  '............kkkkkkkk............',
  '..........kkHHHHHHHHkk..........',
  '.........kHHHHHHHHHHHHk.........',
  '........kHHhhhhhhhhhhHHk........',
  '........kHhhhhhhhhhhhhHk........',
  '........khhssssssssshhk.........',
  '........khsSSSSSSSSSshk.........',
  '........khsSweSSSweSshk.........',
  '........khsSSSSSSSSSshk.........',
  '........khhSSSSSSSShhk..........',
  '.........khsSSssSSshk...........',
  '.........kkhSSSSShkk............',
  '..........kSSSSSSSk.............',
  '..........kgGGGGGGgk............',
  '.........kDDDDDDDDDDk...........',
  '........kDkDDDDDDDDkDk..........',
  '........kDkdDPjPddDkDk..........',
  '........kskgGGGGGGgksk..........',
  '.........kdDDDDDDDDdk...........',
  '.........kdDPPPPPPPDdk..........',
  '........kdDPPPPPPPPPDdk.........',
  '........kdDPPPPPPPPPDdk.........',
  '........kddDDDDDDDDDddk.........',
  '........kgGgGgGgGgGgGgk.........',
  '........kdddddddddddddk.........',
  '........kdDBBBBBBBBBDdk.........',
  '........kdDBBBBBBBBBDdk.........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDDBBBBBBBBBDdk........',
  '........kdDDDDDDDDDDDDdk........',
  '........kgGgGgGgGgGgGgGk........',
  '........kbbbbbbbbbbbbbbk........'
]);

const DOWN_LEGS = {
  stand: norm([
    '..........kobOk..kobOk..........',
    '..........kobOk..kobOk..........',
    '..........kobbk..kobbk..........',
    '..........kkkkk..kkkkk..........',
    '................................'
  ]),
  a: norm([
    '..........kobOk..kobOk..........',
    '.........kobOk...kkkkk..........',
    '.........kobbk...................',
    '.........kkkkk...................',
    '................................'
  ]),
  b: norm([
    '..........kobOk..kobOk..........',
    '..........kkkkk..kobOk..........',
    '..................kobbk.........',
    '..................kkkkk.........',
    '................................'
  ])
};

const UP_BODY = norm([
  '................................',
  '................................',
  '............kkkkkkkk............',
  '..........kkHHHHHHHHkk..........',
  '.........kHHHHHHHHHHHHk.........',
  '........kHHHHHHHHHHHHHHk........',
  '........kHHHHHHHHHHHHHHk........',
  '........kHHhHHHHHHhHHHHk........',
  '........kHHHHHHHHHHHHHHk........',
  '........kHHHHHHHHHHHHHHk........',
  '.........kHHHHHHHHHHHHk.........',
  '.........khhHHHHHHHhhk..........',
  '..........khhHHHHhhk............',
  '...........khhhhhhhk............',
  '..........khhhhhhhhhk...........',
  '..........kgGGGGGGgk............',
  '.........kDDDDDDDDDDk...........',
  '........kDkDDDDDDDDkDk..........',
  '........kDkDDDDDDDDDkDk.........',
  '........kskgGGGGGGgksk..........',
  '.........kdDDDDDDDDDdk..........',
  '.........kdDDDDDDDDDDdk.........',
  '........kdDDDDDDDDDDDDdk........',
  '........kdDDDDDDDDDDDDdk........',
  '........kddDDDDDDDDDddk.........',
  '........kgGgGgGgGgGgGgk.........',
  '........kdddddddddddddk.........',
  '........kdDBBBBBBBBBDdk.........',
  '........kdDBBBBBBBBBDdk.........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDDBBBBBBBBBDdk........',
  '........kdDDDDDDDDDDDDdk........',
  '........kgGgGgGgGgGgGgGk........',
  '........kbbbbbbbbbbbbbbk........'
]);

const SIDE_BODY = norm([
  '................................',
  '................................',
  '..........kkkkkkkk..............',
  '........kkHHHHHHHHkk............',
  '.......kHHHHHHHHHHHHk...........',
  '.......kHHHHHHHHggGjk...........',
  '.......kHHHHHHHhSSSsk...........',
  '.......kHHHHHHhSSSSSk...........',
  '.......kHHHHHhSSweSSk...........',
  '.......kHHHHHhSSSSSSk...........',
  '........kHHHHhsSSSsk............',
  '.........kHHHhSSSSk.............',
  '..........khhksSSSk.............',
  '...........khhkSSSk.............',
  '............kkkSSk..............',
  '...........kgGGGGgk.............',
  '...........kDDDDDDDk............',
  '...........kDDDDkDDk............',
  '...........kdDDDkDDk............',
  '...........kgGGGksk.............',
  '..........kdDDDDDDdk............',
  '..........kdDPPPPPDdk...........',
  '..........kdDPPPPPPDdk..........',
  '.........kdDPPPPPPPPDdk.........',
  '.........kdDDDDDDDDDDdk.........',
  '.........kgGgGgGgGgGgk..........',
  '.........kddddddddddddk.........',
  '.........kdDBBBBBBBBDdk.........',
  '.........kdDBBBBBBBBDdk.........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDBBBBBBBBBBDdk........',
  '........kdDDBBBBBBBBBDdk........',
  '........kdDDDDDDDDDDDDdk........',
  '........kgGgGgGgGgGgGgGk........',
  '........kbbbbbbbbbbbbbbk........'
]);

const SIDE_LEGS = {
  stand: norm([
    '............kobOk...............',
    '............kobOk...............',
    '............kobbk...............',
    '............kkkkk...............',
    '................................'
  ]),
  a: norm([
    '..........kobOk..kobOk..........',
    '.........kobOk....kobOk.........',
    '.........kobbk....kobbk.........',
    '.........kkkkk....kkkkk.........',
    '................................'
  ]),
  b: norm([
    '............kobOkobOk...........',
    '............kobOkobOk...........',
    '...........kobbkkobbk...........',
    '...........kkkkk.kkkkk..........',
    '................................'
  ])
};

export const LYRA_SPRITE = {
  id: 'lyra',
  map: LYRA_MAP,
  w: 32, h: 40,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
