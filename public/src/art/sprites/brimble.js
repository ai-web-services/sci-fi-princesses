// ═══════════════════════════════════════════════════════════════
// BRIMBLE TOADSWORTH — Anura guardian, authored pixel art 32×40.
// FFIV-style big-head heroic chibi: round dome head, wide stance,
// tower shield read as a wall, bulging top-eyes, bioluminescent
// throat-sac glow, steel-armored torso over leather robe/sash.
// Palette locked to ART_VISION.md §2.1 (Brimble): skin greens
// 0xc4aa66 base -> 0x44ff44 throat glow, armor steels
// 0x778899/0x553322, water blues 0x44ddff/0x3344aa, leather browns,
// darks 0x222233/0x111111, outline 0x1a1a2a.
// Grids: body rows 0-34 + leg variants (5 rows) per direction.
// ═══════════════════════════════════════════════════════════════

export const BRIMBLE_MAP = {
  k: 0x1a1a2a,                                        // outline
  G: 0x8f7a3e, M: 0xc4aa66, l: 0xe0cf94,               // skin dark->mid->light (base #c4aa66)
  t: 0x44ff44,                                         // throat glow (bright)
  w: 0xf8f8ff, e: 0x111111,                            // eye white / pupil
  s: 0x445566, S: 0x778899,                            // armor steel dark->light
  R: 0x553322, O: 0x9c7a52,                            // leather brown dark->light
  B: 0x3344aa, C: 0x44ddff,                            // water blue dark->light
  d: 0x222233                                          // darks
};

const DOWN_BODY = [
    '................................',
    '................................',
    '................................',
    '................................',
    '..........kkkkkkkkkkkk..........',
    '.........kMMMllllllMMMk.........',
    '........kMMllllllllllMMk........',
    '.......kMMwek......kewMMk.......',
    '.......kMlek......kelMk.........',
    '.......kMMllllllllllMMk.........',
    '......kGMMllllllllllMMGk........',
    '......kGMMMllllllllMMMGk........',
    '......kGMMt..tttt..tMMGk........',
    '......kGGMMMMMMMMMMMMGGk........',
    '.....kGGGMMkkkkkkkkMGGGk........',
    '.....kGGGMMkkkkkkkkMGGGk........',
    '....kGGGGMMllllllllMGGGGk.......',
    '....kGsssssssssssssssGk.........',
    '...kGsSSSSSSSSSSSSSSSsGk........',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSORRRRRRRRRROSSSsGk.....',
    '...kGsSSSORROOO..OORROSSSsGk....',
    '...kGsSSSOROOOOOOOOOROSSSsGk....',
    '...kGsSSSOROOOOOOOOOROSSSsGk....',
    '...kGsSSSORROOOOOOORROSSSsGk....',
    '...kGsSSSORRRRRRRRRROSSSsGk.....',
    '...kGsSSSSOOOOOOOOOOSSSsGk......',
    '....kGssSSSSSSSSSSSSssGk........',
    '....kGGssssssssssssssGGk........',
    '.....kGGGssssssssssGGGk.........',
    '.....kMGGGGGGGGGGGGGGMk.........',
    'R....kMMGGGGGGGGGGGGMMk....R....',
    'R....kkMMMMMMMMMMMMMMkk....R....',
    'R......kMMMk......kMMMk....R....',
    '.......kGGGk......kGGGk.........'
  ];

const DOWN_LEGS = {
    stand: [
    '.......kMMMk......kMMMk.........',
    '.......kGGGk......kGGGk.........',
    '.......kkkkkk....kkkkkk.........',
    '.......kkkkkk....kkkkkk.........',
    '................................'
  ],
    a: [
    '......kMMMk.......kMMMk.........',
    '......kGGGk.......kGGGk.........',
    '......kkkkkkk....kkkkkk.........',
    '......kkkkkkk....kkkkkk.........',
    '................................'
  ],
    b: [
    '.......kMMMk......kMMMk.........',
    '.......kGGGk......kGGGk.........',
    '......kkkkkkk....kkkkkkk........',
    '......kkkkkkk....kkkkkkk........',
    '................................'
  ]
  };

const UP_BODY = [
    '................................',
    '................................',
    '................................',
    '................................',
    '..........kkkkkkkkkkkk..........',
    '.........kMMMMMMMMMMMk..........',
    '........kMMMMMMMMMMMMMk.........',
    '.......kMMMMMMMMMMMMMMk.........',
    '.......kMMllllllllllMk..........',
    '.......kMMllllllllllMMk.........',
    '......kGMMllllllllllMMGk........',
    '......kGMMMllllllllMMMGk........',
    '......kGMMMMMMMMMMMMMGk.........',
    '......kGGMMMMMMMMMMMMGGk........',
    '.....kGGGMMkkkkkkkkMGGGk........',
    '.....kGGGMMkkkkkkkkMGGGk........',
    '....kGGGGMMllllllllMGGGGk.......',
    '....kGsssssssssssssssGk.........',
    '...kGsSSSSSSSSSSSSSSSsGk........',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSOOOOOOOOOOSSSsGk.......',
    '...kGsSSSSOOOOOOOOOOSSSsGk......',
    '....kGssSSSSSSSSSSSSssGk........',
    '....kGGssssssssssssssGGk........',
    '.....kGGGssssssssssGGGk.........',
    '.....kMGGGGGGGGGGGGGGMk.........',
    '.....kMMGGGGGGGGGGGGMMk.........',
    '.....kkMMMMMMMMMMMMMMkk.........',
    '.......kMMMk......kMMMk.........',
    '.......kGGGk......kGGGk.........'
  ];

const SIDE_BODY = [
    '................................',
    '................................',
    '................................',
    '................................',
    '.........kkkkkkkkkkkk...........',
    '........kMMMllllllMMk...........',
    '.......kMMllllllllMMk...........',
    '......kMMwek.......kMMk.........',
    '......kMlek........klMMk........',
    '......kMMllllllllllllMk.........',
    '.....kGMMllllllllllllMGk........',
    '.....kGMMMllllllllllMMGk........',
    '.....kGMMt...tttt...tMGk........',
    '.....kGGMMMMMMMMMMMMMGGk........',
    '....kGGGMMkkkkkkkkkkMGGGk.......',
    '....kGGGMMkkkkkkkkkkMGGGk.......',
    '...kGGGGMMllllllllllMGGGGk......',
    '...kGsssssssssssssssssGk........',
    '..kGsSSSSSSSSSSSSSSSSSSsGk......',
    '..kGsSSSOOOOOOOOOOOOOSSSsGk.....',
    '..kGsSSSORRRRRRRRRRRROSSSsGk....',
    '..kGsSSSORROOO....OORROSSSsGk...',
    '..kGsSSSOROOOOOOOOOOOROSSSsGk...',
    '..kGsSSSOROOOOOOOOOOOROSSSsGk...',
    '..kGsSSSORROOOOOOOOORROSSSsGk...',
    '..kGsSSSORRRRRRRRRRRROSSSsGk....',
    '..kGsSSSSOOOOOOOOOOOOOSSSsGk....',
    '...kGssSSSSSSSSSSSSSSSssGk......',
    '...kGGssssssssssssssssGGk.......',
    '....kGGGssssssssssssGGGk........',
    '....kMGGGGGGGGGGGGGGGMk.........',
    '....kMMGGGGGGGGGGGGGMMk.........',
    '....kkMMMMMMMMMMMMMMMkk.........',
    '......kMMMk........kMMMk........',
    '................................'
  ];

const SIDE_LEGS = {
    stand: [
    '......kMMMk........kMMMk........',
    '......kGGGk........kGGGk........',
    '......kkkkkk......kkkkkk........',
    '......kkkkkk......kkkkkk........',
    '................................'
  ],
    a: [
    '.....kMMMk.........kMMMk........',
    '.....kGGGk.........kGGGk........',
    '.....kkkkkkk......kkkkkk........',
    '.....kkkkkkk......kkkkkk........',
    '................................'
  ],
    b: [
    '......kMMMk........kMMMk........',
    '......kGGGk........kGGGk........',
    '.....kkkkkkk......kkkkkkk.......',
    '.....kkkkkkk......kkkkkkk.......',
    '................................'
  ]
  };

export const BRIMBLE_SPRITE = {
  id: 'brimble',
  map: BRIMBLE_MAP,
  w: 32, h: 40,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
