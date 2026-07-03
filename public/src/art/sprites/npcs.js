// ═══════════════════════════════════════════════════════════════
// NPC SPRITES — eight human NPCs, authored pixel art 24×32, same
// shape as lyra.js but with simpler costume detail. Each has its
// own map + grids so silhouettes/palettes stay distinct.
// Grids: body rows 0–26 + leg variants rows 27–31 per direction.
// ═══════════════════════════════════════════════════════════════

// ── Commander Reyes: dark-skinned woman, silver-gray cropped hair,
//    navy military coat with gold epaulettes ─────────────────────
const REYES_MAP = {
  k: 0x1a1626,
  h: 0x8a8a98, H: 0xb8b8c4, Y: 0xdcdce4,      // hair dark→light
  s: 0x6a4038, S: 0x91604a,                    // skin shadow/base
  w: 0xf8f8ff, e: 0x3a7fd4,
  d: 0x1a2440, D: 0x2a3a60, P: 0x3f5488,       // coat dark→light
  g: 0xa88028, G: 0xeeca5e,                    // gold epaulettes/trim
  b: 0x14182a, B: 0x232a48
};

const REYES_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHhhhhhhHHk......',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....khhsssssssshhk.....',
  '.....khsSSSSSSSSshk.....',
  '.....khsSweSSweSshk.....',
  '.....khsSSSSSSSSshk.....',
  '.....khhSSSSSSSShhk.....',
  '......khsSSssSSshk......',
  '.......kksSSSSskk.......',
  '........kSSSSSSk........',
  '.......kgGGGGGGgk.......',
  '......kDDDDDDDDDDk......',
  '.....kGkDDDDDDDDkGk.....',
  '.....kDkdDDddDDdkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDDDDDDDDdk......',
  '.....kdDDPPPPPPDDdk.....',
  '....kdDDPPPPPPPPDDdk....',
  '....kdDDPPPPPPPPDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const REYES_LEGS = {
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

const REYES_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHhhhhhhHHk......',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....khhhhhhhhhhhhk.....',
  '.....khhhhhhhhhhhhk.....',
  '.....khhhhhhhhhhhhk.....',
  '.....kHhhhhhhhhhHk......',
  '......kHhhhhhhhHk.......',
  '.......khhhhhhhk........',
  '.......kkhhhhhhkk.......',
  '........khhhhhhk........',
  '.......kDDDDDDDDk.......',
  '......kDDDDDDDDDDk......',
  '.....kGkDDDDDDDDkGk.....',
  '.....kDkDDDDDDDDkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDDDDDDDDdk......',
  '.....kdDDDDDDDDDDdk.....',
  '....kdDDDDDDDDDDDDdk....',
  '....kdDDDDDDDDDDDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const REYES_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHhhhhhhHHk......',
  '......kHhhhhhhgGGk......',
  '......kHhhhhhhSSsk......',
  '......kHhhhhhSSSSk......',
  '......kHhhhhhSweSk......',
  '......kHhhhhhSSSSk......',
  '......kHHhhhhsSSsk......',
  '.......kHhhhhSSSk.......',
  '........kkhhksSk........',
  '.........khhkSSk........',
  '..........kkkSSk........',
  '........kgGGGGgk........',
  '........kDDDDDDk........',
  '........kGDDDkGk........',
  '........kdDDDkDk........',
  '........kgGGGksk........',
  '........kdDDDDdk........',
  '.......kdDDPPDDdk.......',
  '.......kdDPPPPDdk.......',
  '......kdDPPPPPPDdk......',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const REYES_SIDE_LEGS = {
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

const REYES = {
  id: 'reyes',
  map: REYES_MAP,
  w: 24, h: 32,
  down: { body: REYES_DOWN_BODY, legs: REYES_LEGS },
  up:   { body: REYES_UP_BODY,   legs: REYES_LEGS },
  side: { body: REYES_SIDE_BODY, legs: REYES_SIDE_LEGS }
};

// ── Merchant Zara: warm-skinned woman, black hair bun, teal apron
//    with coin pouch ─────────────────────────────────────────────
const ZARA_MAP = {
  k: 0x1c1614,
  h: 0x0d0a10, H: 0x241c28,                    // black hair dark/mid
  s: 0x6a3d44, S: 0xcc8a66,                    // skin shadow/base
  w: 0xf8f8ff, e: 0x3a7fd4,
  d: 0x123a3a, D: 0x1f5a58, P: 0x2e8078,       // teal apron dark→light
  g: 0x9a702a, G: 0xe0c060,                    // coin pouch gold
  b: 0x2d1d14, B: 0x4a3222
};

const ZARA_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHhhhhhhhhHHk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....khsSSSSSSSSshk.....',
  '.....khsSweSSweSshk.....',
  '.....khsSSSSSSSSshk.....',
  '.....khhSSSSSSSShhk.....',
  '......khsSSssSSshk......',
  '.......kksSSSSskk.......',
  '........kSSSSSSk........',
  '.......kdDDDDDDdk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkPgGPPgGPkDk.....',
  '.....kskPPPPPPPPksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdDPPPPPPPPDdk.....',
  '....kdDDPPPPPPPPDDdk....',
  '....kdDDPPPPPPPPDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ZARA_LEGS = {
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

const ZARA_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHk......',
  '......kHHHHHHHHHk.......',
  '.......khhhhhhhk........',
  '.......kkhhhhhhkk.......',
  '........khhhhhhk........',
  '.......kDDDDDDDDk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkPPPPPPPPkDk.....',
  '.....kskPPPPPPPPksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdPPPPPPPPPPdk.....',
  '....kdDPPPPPPPPPPDdk....',
  '....kdDPPPPPPPPPPDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ZARA_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '......kHHHHHHHggGk......',
  '......kHHhhhhhSSsk......',
  '......kHhhhhhSSSSk......',
  '......kHhhhhhSweSk......',
  '......kHhhhhhSSSSk......',
  '......kHHhhhhsSSsk......',
  '.......kHhhhhSSSk.......',
  '........kkhhksSk........',
  '.........khhkSSk........',
  '..........kkkSSk........',
  '........kdDDDDdk........',
  '........kDPPPPDk........',
  '........kDPPPkDk........',
  '........kdPgGkDk........',
  '........kdPPPksk........',
  '........kdPPPPdk........',
  '.......kdDPPPPDdk.......',
  '.......kdDPPPPPDdk......',
  '......kdDPPPPPPDdk......',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ZARA_SIDE_LEGS = {
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

const ZARA = {
  id: 'zara',
  map: ZARA_MAP,
  w: 24, h: 32,
  down: { body: ZARA_DOWN_BODY, legs: ZARA_LEGS },
  up:   { body: ZARA_UP_BODY,   legs: ZARA_LEGS },
  side: { body: ZARA_SIDE_BODY, legs: ZARA_SIDE_LEGS }
};

// ── Blacksmith Torvin: burly man, red-brown beard, leather smith
//    apron, gray shirt ────────────────────────────────────────────
const TORVIN_MAP = {
  k: 0x1c1410,
  h: 0x5e2f1a, H: 0x8a4a28, Y: 0xb8703f,        // beard/hair dark→light
  s: 0x6a3d44, S: 0xcc8a66,
  w: 0xf8f8ff, e: 0x555577,
  d: 0x2d1d14, D: 0x4a3222, P: 0x684a32,        // leather apron dark→light
  g: 0x454a60, G: 0x8a91a8,                     // gray shirt
  b: 0x1c1410, B: 0x322418
};

const TORVIN_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYHHHHHHHHYYk.....',
  '.....kYHhhhhhhhhHYk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHsSweSSweSsHk.....',
  '.....kHsSHHHHHHSsHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '......kHHHHHHHHHHk......',
  '.......kkHHHHHHkk.......',
  '........kGGGGGGk........',
  '.......kgGGGGGGGgk......',
  '......kgGGGGGGGGGgk.....',
  '.....kgkGGDDDDGGkgk.....',
  '.....kgkGDPPPPDGkgk.....',
  '.....kgkGDPPPPDGkgk.....',
  '......kgGDDDDDDGgk......',
  '.....kgGDDDDDDDDGgk.....',
  '....kgGDDDDDDDDDDGgk....',
  '....kgGDDDDDDDDDDGgk....',
  '....kggGGGGGGGGGGggk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const TORVIN_LEGS = {
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

const TORVIN_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYYYYYYYYYYYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYYHHHHHHHHYYk.....',
  '......kYHHHHHHHHYk......',
  '.......khhHHHHhhk.......',
  '.......kkHHHHHHkk.......',
  '........kGGGGGGk........',
  '.......kgGGGGGGGgk......',
  '......kgGGGGGGGGGgk.....',
  '.....kgkGGGGGGGGkgk.....',
  '.....kgkGGGGGGGGkgk.....',
  '.....kgkGGGGGGGGkgk.....',
  '......kgGGGGGGGGgk......',
  '.....kgGGGGGGGGGGgk.....',
  '....kgGGGGGGGGGGGGgk....',
  '....kgGGGGGGGGGGGGgk....',
  '....kggGGGGGGGGGGggk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const TORVIN_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '......kYHHHHHHHHhk......',
  '......kYHHHHHHHhHk......',
  '......kHhhhhhhSSsk......',
  '......kHhhhhhSSSSk......',
  '......kHhhHHHSweSk......',
  '......kHHhHHHsSSsk......',
  '.......kHHHHHsSSk.......',
  '........kkHHksSk........',
  '.........kHHkSSk........',
  '..........kkkSSk........',
  '........kgGGGGgk........',
  '........kgGGGGGgk.......',
  '........kgGDDDkgk.......',
  '........kgGDPPDkgk......',
  '........kgGDDDksgk......',
  '........kgGGGGGgk.......',
  '.......kgGGGGGGGgk......',
  '.......kgGDDDDDGgk......',
  '......kgGDDDDDDDGgk.....',
  '......kgGGGGGGGGGgk.....',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const TORVIN_SIDE_LEGS = {
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

const TORVIN = {
  id: 'torvin',
  map: TORVIN_MAP,
  w: 24, h: 32,
  down: { body: TORVIN_DOWN_BODY, legs: TORVIN_LEGS },
  up:   { body: TORVIN_UP_BODY,   legs: TORVIN_LEGS },
  side: { body: TORVIN_SIDE_BODY, legs: TORVIN_SIDE_LEGS }
};

// ── Dr. Elara: pale woman, long dark-teal hair, white/mint medical
//    coat ─────────────────────────────────────────────────────────
const ELARA_MAP = {
  k: 0x201c30,
  h: 0x123a3a, H: 0x1f5a58, Y: 0x2e8078,        // dark-teal hair dark→light
  s: 0x7a4a52, S: 0xffd2ac,
  w: 0xf8f8ff, e: 0x3a7fd4,
  d: 0x9aa8a5, D: 0xc4d0cc, P: 0xe8f2ee,        // white/mint coat dark→light
  g: 0x66b573, G: 0x94d998,                     // mint trim
  b: 0x2e2255, B: 0x4a3a85
};

const ELARA_DOWN_BODY = [
  '........................',
  '.......h........h.......',
  '.......hkkkkkk.h........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYHHHHHHHHYYk.....',
  '.....kYHhhhhhhhhHYk.....',
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
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkdPPddPPdkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdPPPPPPPPPPdk.....',
  '....kdDPPPPPPPPPPDdk....',
  '....kdDPPPPPPPPPPDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ELARA_LEGS = {
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

const ELARA_UP_BODY = [
  '........................',
  '.......h........h.......',
  '.......hkkkkkk.h........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYYYYYYYYYYYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYYHHHHHHHHYYk.....',
  '......kYHHHHHHHHYk......',
  '.......khhHHHHhhk.......',
  '.......kkHHHHHHkk.......',
  '........kHHHHHHk........',
  '.......kDDDDDDDDk.......',
  '......kDDDDDDDDDDk......',
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkPPPPPPPPkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdPPPPPPPPPPdk.....',
  '....kdDPPPPPPPPPPDdk....',
  '....kdDPPPPPPPPPPDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ELARA_SIDE_BODY = [
  '........................',
  '.......h........h.......',
  '......hkkkkkk...........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '......kYHHHHHHgGGk......',
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
  '........kDPPPkDk........',
  '........kdPPPkDk........',
  '........kgGGGksk........',
  '........kdPPPPdk........',
  '.......kdPPPPPPdk.......',
  '.......kdPPPPPPPdk......',
  '......kdDPPPPPPPDdk.....',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const ELARA_SIDE_LEGS = {
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

const ELARA = {
  id: 'elara',
  map: ELARA_MAP,
  w: 24, h: 32,
  down: { body: ELARA_DOWN_BODY, legs: ELARA_LEGS },
  up:   { body: ELARA_UP_BODY,   legs: ELARA_LEGS },
  side: { body: ELARA_SIDE_BODY, legs: ELARA_SIDE_LEGS }
};

// ── Old Man Corvus: stooped elderly man, white hair+beard, dark
//    plum innkeeper vest ─────────────────────────────────────────
const CORVUS_MAP = {
  k: 0x221c28,
  h: 0xb8b8c4, H: 0xdcdce4, Y: 0xf2f2fc,        // white hair/beard dark→light
  s: 0x6a4038, S: 0x91604a,
  w: 0xd8d8e4, e: 0x555577,
  d: 0x2d1a2e, D: 0x452a48, P: 0x5e3d63,        // dark plum vest
  g: 0x454a60, G: 0x8a91a8,                     // shirt gray
  b: 0x221c28, B: 0x3a3040
};

const CORVUS_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHhhhhhhhhHHk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHsSweSSweSsHk.....',
  '.....kHsSHHHHHHSsHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '......khHHHHHHHhk......',
  '.......kkHHHHHHkk.......',
  '........kGGGGGGk........',
  '.......kdDDDDDDdk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkGGGGGGGGkDk.....',
  '.....kDkGDPPPPDGkDk.....',
  '.....kskGPPPPPPGksk.....',
  '.......kGPPPPPPGk.......',
  '.....kdDGPPPPPPGDdk....',
  '....kdDDGPPPPPPGDDdk...',
  '....kdDDGGGGGGGGDDdk...',
  '....kddDDDDDDDDDDddk...',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CORVUS_LEGS = {
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

const CORVUS_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHk......',
  '......kHHHHHHHHHk.......',
  '.......khhhhhhhk........',
  '.......kkHHHHHHkk.......',
  '........kGGGGGGk........',
  '.......kdDDDDDDdk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkGGGGGGGGkDk.....',
  '.....kDkGGGGGGGGkDk.....',
  '.....kskGPPPPPPGksk.....',
  '.......kGPPPPPPGk.......',
  '.....kdDGPPPPPPGDdk....',
  '....kdDDGPPPPPPGDDdk...',
  '....kdDDGGGGGGGGDDdk...',
  '....kddDDDDDDDDDDddk...',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CORVUS_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '......kHHHHHHHHhHk......',
  '......kHhhhhhhHhHk......',
  '......kHhhhhhhSSsk......',
  '......kHhhhHHHSweSk.....',
  '......kHHhHHHsSSsk......',
  '......kHHHHHHsSSsk......',
  '.......kHHHHHsSSk.......',
  '........kkHHksSk........',
  '.........kHHkSSk........',
  '..........kkkSSk........',
  '........kdGGGGdk........',
  '........kDDDDDDk........',
  '........kDGGGkDk........',
  '........kdGPPkDk........',
  '........kdGPPksk........',
  '........kdGPPPdk........',
  '.......kdDGPPPPDdk......',
  '.......kdDGPPPPDdk......',
  '......kdDDGGGGGDdk......',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CORVUS_SIDE_LEGS = {
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

const CORVUS = {
  id: 'corvus',
  map: CORVUS_MAP,
  w: 24, h: 32,
  down: { body: CORVUS_DOWN_BODY, legs: CORVUS_LEGS },
  up:   { body: CORVUS_UP_BODY,   legs: CORVUS_LEGS },
  side: { body: CORVUS_SIDE_BODY, legs: CORVUS_SIDE_LEGS }
};

// ── Citizen (M): adult man, brown hair, simple blue-gray tunic ──
const CITIZEN_M_MAP = {
  k: 0x1c1a26,
  h: 0x4a3222, H: 0x684a32, Y: 0x876445,        // brown hair dark→light
  s: 0x6a3d44, S: 0xcc8a66,
  w: 0xf8f8ff, e: 0x555577,
  d: 0x2a2d3d, D: 0x454a60, P: 0x656c85,        // blue-gray tunic
  g: 0x454a60, G: 0x656c85,
  b: 0x1c1a26, B: 0x322c3c
};

const CITIZEN_M_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHhhhhhhhhHHk.....',
  '.....kHhhhhhhhhhhHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHsSweSSweSsHk.....',
  '.....kHsSSSSSSSSsHk.....',
  '.....kHHSSSSSSSSHHk.....',
  '......khsSSssSSshk......',
  '.......kksSSSSskk.......',
  '........kSSSSSSk........',
  '.......kdDDDDDDdk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkdPPddPPdkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdPPPPPPPPPPdk.....',
  '....kdDPPPPPPPPPPDdk....',
  '....kdDPPPPPPPPPPDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....',
  '........................'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_M_LEGS = {
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

const CITIZEN_M_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHHk.....',
  '.....kHHHHHHHHHHHk......',
  '......kHHHHHHHHHk.......',
  '.......khhhhhhhk........',
  '.......kkHHHHHHkk.......',
  '........kHHHHHHk........',
  '.......kDDDDDDDDk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkPPPPPPPPkDk.....',
  '.....kDkPPPPPPPPkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdPPPPPPPPdk......',
  '.....kdPPPPPPPPPPdk.....',
  '....kdDPPPPPPPPPPDdk....',
  '....kdDPPPPPPPPPPDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_M_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkHHHHHHkk.......',
  '......kHHHHHHHHHHk......',
  '......kHHHHHHHHhHk......',
  '......kHhhhhhhSSsk......',
  '......kHhhhhhSSSSk......',
  '......kHhhhhhSweSk......',
  '......kHhhhhhSSSSk......',
  '......kHHhhhhsSSsk......',
  '.......kHhhhhSSSk.......',
  '........kkHHksSk........',
  '.........kHHkSSk........',
  '..........kkkSSk........',
  '........kdGGGGdk........',
  '........kDPPPPDk........',
  '........kDPPPkDk........',
  '........kdPPPkDk........',
  '........kdPPPksk........',
  '........kdPPPPdk........',
  '.......kdPPPPPPdk.......',
  '.......kdPPPPPPPdk......',
  '......kdDPPPPPPPDdk.....',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_M_SIDE_LEGS = {
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

const CITIZEN_M = {
  id: 'citizen_m',
  map: CITIZEN_M_MAP,
  w: 24, h: 32,
  down: { body: CITIZEN_M_DOWN_BODY, legs: CITIZEN_M_LEGS },
  up:   { body: CITIZEN_M_UP_BODY,   legs: CITIZEN_M_LEGS },
  side: { body: CITIZEN_M_SIDE_BODY, legs: CITIZEN_M_SIDE_LEGS }
};

// ── Citizen (F): adult woman, auburn hair, sage-green dress ─────
const CITIZEN_F_MAP = {
  k: 0x1c1a26,
  h: 0x7a3320, H: 0xa8502e, Y: 0xcc7548,        // auburn hair dark→light
  s: 0x7a4a52, S: 0xffd2ac,
  w: 0xf8f8ff, e: 0x3a7fd4,
  d: 0x2d3a26, D: 0x466038, P: 0x66854f,        // sage-green dress
  g: 0x9a8a4a, G: 0xe0d68a,                     // sash trim
  b: 0x2e2255, B: 0x4a3a85
};

const CITIZEN_F_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYHHHHHHHHYYk.....',
  '.....kYHhhhhhhhhHYk.....',
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
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_F_LEGS = {
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

const CITIZEN_F_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '.....kYYYYYYYYYYYYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
  '.....kYHHHHHHHHHHYk.....',
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
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_F_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkYYYYYYkk.......',
  '......kYYYYYYYYYYk......',
  '......kYHHHHHHgGGk......',
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
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const CITIZEN_F_SIDE_LEGS = {
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

const CITIZEN_F = {
  id: 'citizen_f',
  map: CITIZEN_F_MAP,
  w: 24, h: 32,
  down: { body: CITIZEN_F_DOWN_BODY, legs: CITIZEN_F_LEGS },
  up:   { body: CITIZEN_F_UP_BODY,   legs: CITIZEN_F_LEGS },
  side: { body: CITIZEN_F_SIDE_BODY, legs: CITIZEN_F_SIDE_LEGS }
};

// ── Sovereignty Guard: violet-steel light armor + gold trim helmet
const GUARD_MAP = {
  k: 0x1a1730,
  h: 0x2a2450, H: 0x4a3d85,                    // helmet shadow under visor
  s: 0x6a4038, S: 0x91604a,
  w: 0xf2f2fc, e: 0x7a68c0,
  d: 0x2b2350, D: 0x4a3d85, P: 0x7a68c0, Q: 0xb8a8f0,  // violet-steel armor
  g: 0x9a7522, G: 0xedcb55,                     // gold trim
  b: 0x1a1730, B: 0x2e2650
};

const GUARD_DOWN_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkDDDDDDkk.......',
  '......kDDPPPPPPDDk......',
  '.....kDgGGGGGGGgDk......',
  '.....kDgGeeeeeeGgDk.....',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDPPHwwwwHPPDk.....',
  '.....kDPPHwewewHPPDk....',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDDPPPPPPPPDDk.....',
  '......kDPPssssPPDk......',
  '.......kkPssssPkk.......',
  '........kPssssPk........',
  '.......kgGGGGGGgk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkQPPPPPQkDk.....',
  '.....kDkQDPPPDQkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDPPPPPPDdk......',
  '.....kdDDPPPPPPDDdk.....',
  '....kdDDPPPPPPPPDDdk....',
  '....kdDDPPPPPPPPDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const GUARD_LEGS = {
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

const GUARD_UP_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkDDDDDDkk.......',
  '......kDDPPPPPPDDk......',
  '.....kDgGGGGGGGgDk......',
  '.....kDgGGGGGGGgDk......',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDPPHHHHHHPPDk.....',
  '.....kDDPPPPPPPPDDk.....',
  '......kDPPPPPPPPDk......',
  '.......kkPPPPPPkk.......',
  '........kPPPPPPk........',
  '.......kgGGGGGGgk.......',
  '......kDDPPPPPPDDk......',
  '.....kDkQPPPPPQkDk.....',
  '.....kDkQPPPPPQkDk.....',
  '.....kskgGGGGGGgksk.....',
  '......kdDPPPPPPDdk......',
  '.....kdDDPPPPPPDDdk.....',
  '....kdDDPPPPPPPPDDdk....',
  '....kdDDPPPPPPPPDDdk....',
  '....kddDDDDDDDDDDddk....',
  '....kbBbBbBbBbBbBbBk....',
  '....kbbbbbbbbbbbbbbk....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const GUARD_SIDE_BODY = [
  '........................',
  '........................',
  '.........kkkkkk.........',
  '.......kkDDDDDDkk.......',
  '......kDDPPPPPPDDk......',
  '......kDgGGGGGggDk......',
  '......kDgGHHHHHhDk......',
  '......kDPPHHHHhSsk......',
  '......kDPPHwewhSSk......',
  '......kDPPHHHHhSSk......',
  '......kDDPPPPPhsSk......',
  '.......kDPPPPPsSk.......',
  '........kkPPksSk........',
  '.........kPPksSk........',
  '..........kkksSk........',
  '........kgGGGGgk........',
  '........kDPPPPDk........',
  '........kDQPPPQk........',
  '........kdQPPPDk........',
  '........kgGGGksk........',
  '........kdPPPPdk........',
  '.......kdDPPPPDdk.......',
  '.......kdDPPPPPDdk......',
  '......kdDPPPPPPPDdk.....',
  '......kdDDDDDDDDdk......',
  '......kbBbBbBbBbBk......',
  '......kbbbbbbbbbbk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const GUARD_SIDE_LEGS = {
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

const GUARD = {
  id: 'guard',
  map: GUARD_MAP,
  w: 24, h: 32,
  down: { body: GUARD_DOWN_BODY, legs: GUARD_LEGS },
  up:   { body: GUARD_UP_BODY,   legs: GUARD_LEGS },
  side: { body: GUARD_SIDE_BODY, legs: GUARD_SIDE_LEGS }
};

export const NPC_SPRITES = [
  REYES, ZARA, TORVIN, ELARA, CORVUS, CITIZEN_M, CITIZEN_F, GUARD
];
