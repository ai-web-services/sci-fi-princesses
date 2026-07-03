// ═══════════════════════════════════════════════════════════════
// DRAKKOR ASHVEIL — Drakonid breaker, authored pixel art 24×32
// Tall and bulky, ember-orange scales, pale sweeping horns, heavy
// dark plate armor on shoulders/chest, thick tail, snout in side
// view, small wing stubs on back (up view). Widest shoulders of
// the cast.
// Grids: body rows 0–26 + leg variants rows 27–31 per direction.
// ═══════════════════════════════════════════════════════════════

export const DRAKKOR_MAP = {
  k: 0x1a1010,                    // outline (deep scale-black)
  d: 0x4d1a1a, D: 0x7a2a22, s: 0xa8422a, S: 0xd06033, l: 0xf28a4a, // scale dark→light
  h: 0x8a7a5a, H: 0xd4c69a, j: 0xfaf4d8,                            // horn dark/mid/light
  w: 0xf8f8ff, e: 0xffd166,        // eye white / draconic iris
  p: 0x2a2530, P: 0x453f4d, q: 0x635a6d, Q: 0x847a8f, x: 0xa89eb3,  // plate dark→light
  n: 0x1a1010                      // nostril / snout dark
};

const DOWN_BODY = [
  '......h......h.........',
  '.......h....h..........',
  '.....hhH....Hhh.........',
  '....kkkkkkkkkkkkk......',
  '...kSSllllllllSSk......',
  '..kSSllllllllllSSk.....',
  '..kSlwe..k..ewlSk......',
  '..kSllll....llllSk.....',
  '..kSSllllllllSSk.......',
  '...kSSnnllnnSSk........',
  '....kSSllllSSk.........',
  '...kPPPQQQQQPPPk.......',
  '..kPPPQQQQQQQQQPPPk....',
  '.kPPQQQQQQQQQQQQQQPPk..',
  '.kPQQxxxxxxxxxxxxQPk..',
  '.kPQQxDDDDDDDDDDxQPk..',
  '.kPQQxDssssssssDxQPk..',
  '.kPQxDDsSllllSsDDxPk..',
  '.kPQxDDsSllllSsDDxPk..',
  '.kPQxDDsSSSSSSsDDxPk..',
  '..kPxDDsssssssDDxPk...',
  '..kPPDDDDDDDDDDDPPk...',
  '..kPPqqqqqqqqqqqPPk...',
  '...kDDDsssssssDDDk....',
  '...kDDssssssssDDk.....',
  '..kkDDDDDDDDDDDDkk....',
  '..kddddddddddddddk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const DOWN_LEGS = {
  stand: [
    '.......kDDDk..kDDDk.....',
    '.......kddDk..kddDk.....',
    '.......kkkkk..kkkkk.....',
    '.......kkkkk..kkkkk.....',
    '........................'
  ],
  a: [
    '......kDDDk...kDDDk.....',
    '......kddDk...kkkkk.....',
    '......kkkkk.............',
    '......kkkkk.............',
    '........................'
  ],
  b: [
    '.......kDDDk..kDDDk.....',
    '.......kkkkk..kddDk.....',
    '..............kkkkk.....',
    '..............kkkkk.....',
    '........................'
  ]
};

const UP_BODY = [
  '......h......h.........',
  '.......h....h..........',
  '.....hhH....Hhh.........',
  '....kkkkkkkkkkkkk......',
  '...kSSllllllllSSk......',
  '..kSSllllllllllSSk.....',
  '..kSlllllllllllSSk.....',
  '..kSllllllllllllSk.....',
  '..kSSllllllllSSk.......',
  '...kSSllllllSSk........',
  '....kSSllllSSk.........',
  '...kPPPQQQQQPPPk.......',
  '..pPPPQQQQQQQQQPPPq....',
  '.pPPQQQQQQQQQQQQQQPPq..',
  '.pPQQxxxxxxxxxxxxQPq..',
  '.pPQQxDDDDDDDDDDxQPq..',
  '.pPQQxDDDDDDDDDDxQPq..',
  '.kPQxDDDDDDDDDDDDxPk..',
  '.kPQxDDDDDDDDDDDDxPk..',
  '.kPQxDDDDDDDDDDDDxPk..',
  '..kPxDDDDDDDDDDDxPk...',
  '..kPPDDDDDDDDDDDPPk...',
  '..kPPqqqqqqqqqqqPPk...',
  '...kDDDsssssssDDDk....',
  '...kDDssssssssDDk.....',
  '..kkDDDDDDDDDDDDkk....',
  '..kddddddddddddddk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_BODY = [
  '.....h..................',
  '......h.................',
  '....hhH.................',
  '...kkkkkkkkk............',
  '..kSSlllllSSk...........',
  '.kSSllllllllSk..........',
  '.kSlwe.....nnSk.........',
  '.kSllll....llnSk........',
  '.kSSllllllllSSk.........',
  '..kSSnnllnnSSk..........',
  '...kSSllllSSk..........d',
  '..kPPPQQQQQPPk........dD',
  '.kPPPQQQQQQQQPPk.....dDs',
  'kPPQQQQQQQQQQQQPk...sDss',
  'kPQQxxxxxxxxxxxQPk.sSss.',
  'kPQQxDDDDDDDDDxQPk.Ss...',
  'kPQQxDssssssssDxQPks....',
  'kPQxDDsSllllSsDDxPk.....',
  'kPQxDDsSllllSsDDxPk.....',
  'kPQxDDsSSSSSSsDDxPk.....',
  '.kPxDDsssssssDDxPk.....',
  '.kPPDDDDDDDDDDDPPk.....',
  '.kPPqqqqqqqqqqqPPk.....',
  '..kDDDsssssssDDDk......',
  '..kDDssssssssDDk.......',
  '.kkDDDDDDDDDDDDkk......',
  '.kddddddddddddddk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_LEGS = {
  stand: [
    '..........kDDDk.........',
    '..........kddDk.........',
    '..........kkkkkk........',
    '..........kkkkkk........',
    '........................'
  ],
  a: [
    '.........kDDDk.kDDDk....',
    '........kddDk...kddDk...',
    '........kkkkk...kkkkkk..',
    '........kkkkk...kkkkkk..',
    '........................'
  ],
  b: [
    '..........kDDDkDDDk.....',
    '..........kddDkddDk.....',
    '.........kkkkkkkkkkk....',
    '.........kkkkk.kkkkk....',
    '........................'
  ]
};

export const DRAKKOR_SPRITE = {
  id: 'drakkor',
  map: DRAKKOR_MAP,
  w: 24, h: 32,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
