// ═══════════════════════════════════════════════════════════════
// LYRA SOLARI — exploration sprite, authored pixel art 24×32
// Act 1 royal dress: starlight-gold hair, tiara with astral gem,
// violet gown with gold filigree belt and hem.
// Grids: body rows 0–26 + leg variants rows 27–31 per direction.
// ═══════════════════════════════════════════════════════════════

export const LYRA_MAP = {
  k: 0x241a38,                    // outline
  h: 0xc7772a, H: 0xf2a93b, Y: 0xffd166,   // hair dark→light
  s: 0xe8a887, S: 0xffd2ac,       // skin shadow/base
  w: 0xf8f8ff, e: 0x3a7fd4,       // eye white / iris
  d: 0x45327d, D: 0x6a4fb3, P: 0x9678e0,   // dress dark→light
  g: 0xd9a92a, G: 0xffeea0,       // gold trim
  j: 0x66e8e0,                    // tiara gem
  b: 0x2e2255, B: 0x4a3a85        // boots
};

const DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYHHHHHHHHYYk.....',
  '.....kYHgGGjjGGgHYk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHsSweSSweSsHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHHSSSSSSSSHHk.....',
  '......khsSSssSSshk......',
  '.......kksSSSSskk.......',
  '........kSSSSSSk........',
  '.......kgGGGGGGgk.......',
  '......kDDDDDDDDDDk......',
  '.....kDkDDDDDDDDkDk.....',
  '.....kDkdDDddDDdkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDDDDDDDDdk......',
  '.....kdDDPPPPPPDDdk.....',
  '....kdDDPPPPPPPPDDdk....',
  '....kdDDPPPPPPPPDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kgGgGgGgGgGgGgGk....',
  '....kddddddddddddddk....'
];

const DOWN_LEGS = {
  stand: [
    '........kbBk..kbBk......',
    '........kbBk..kbBk......',
    '........kbbk..kbbk......',
    '........kkkk..kkkk......',
    '........................'
  ],
  a: [
    '........kbBk..kbBk......',
    '........kbBk..kkkk......',
    '........kbbk............',
    '........kkkk............',
    '........................'
  ],
  b: [
    '........kbBk..kbBk......',
    '........kkkk..kbBk......',
    '..............kbbk......',
    '..............kkkk......',
    '........................'
  ]
};

const UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYYYYYYYYYYYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHhHHhhHHhHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYYHHHHHHHHYYk.....',
  '......kYHHHHHHHHYk......',
  '.......khhHHHHhhk.......',
  '.......kkHHHHHHkk.......',
  '........kHHHHHHk........',
  '.......kDDDDDDDDk.......',
  '......kDDDDDDDDDDk......',
  '.....kDkDDDDDDDDkDk.....',
  '.....kDkDDDDDDDDkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDDDDDDDDdk......',
  '.....kdDDDDDDDDDDdk.....',
  '....kdDDDDDDDDDDDDdk....',
  '....kdDDDDDDDDDDDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kgGgGgGgGgGgGgGk....',
  '....kddddddddddddddk....'
];

const SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '......kYHHHHHHgGjk......',
  '......kYHHHHHhSSsk......',
  '......kYHHHHhSSSSk......',
  '......kYHHHHhSweSk......',
  '......kYHHHHhSSSSk......',
  '......kYYHHHhsSSsk......',
  '.......kYHHHhSSSk.......',
  '........kkHHksSk........',
  '.........kHHkSSk........',
  '..........kkkSSk........',
  '........kgGGGGgk........',
  '........kDDDDDDk........',
  '........kDDDDkDk........',
  '........kdDDDkDk........',
  '........kgGGGksk........',
  '........kdDDDDdk........',
  '.......kdDDPPDDdk.......',
  '.......kdDPPPPDdk.......',
  '......kdDPPPPPPDdk......',
  '......kdDDDDDDDDdk......',
  '......kgGgGgGgGgGk......',
  '......kddddddddddk......'
];

const SIDE_LEGS = {
  stand: [
    '..........kbBk..........',
    '..........kbBk..........',
    '..........kbbkk.........',
    '..........kkkkk.........',
    '........................'
  ],
  a: [
    '.........kbBk.kbBk......',
    '........kbBk...kbBk.....',
    '........kbbk...kbbkk....',
    '........kkkk...kkkkk....',
    '........................'
  ],
  b: [
    '..........kbBkbBk.......',
    '..........kbBkbBk.......',
    '.........kbbkkbbkk......',
    '.........kkkk.kkkk......',
    '........................'
  ]
};

export const LYRA_SPRITE = {
  id: 'lyra',
  map: LYRA_MAP,
  w: 24, h: 32,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
