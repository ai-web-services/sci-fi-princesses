// ═══════════════════════════════════════════════════════════════
// DRAKKOR ASHVEIL — Drakonid breaker, authored pixel art 32×48
// tall silhouette. FFIV-style big-head heroic chibi: sweeping
// horns, heavy charcoal plate armor, torn cape, thick tail, wide
// shoulders — tallest hero in the cast. Fire ramp glow at chest
// seam and eyes. Palette locked to ART_VISION.md §2.1 (Drakkor):
// scale reds 0xcc3333/0x853322, armor charcoals 0x3a3340/0x222233,
// fire ramp 0xffcc33/0xff8604/0xff4400, eyes 0xffcc33, outline
// 0x1a1a2a.
// Grids: body rows 0-42 + leg variants (5 rows) per direction.
// ═══════════════════════════════════════════════════════════════

export const DRAKKOR_MAP = {
  k: 0x1a1a2a,                                                    // outline (also nostril/snout dark)
  d: 0x532018, D: 0x853322, s: 0xaf4a2e, S: 0xcc3333, l: 0xe8704a, // scale dark->light
  h: 0x7a6a52, H: 0xc4b088,                                        // horn dark->light
  w: 0xf8f8ff, e: 0xffcc33,                                        // eye white / draconic iris
  P: 0x3a3340, q: 0x555064, Q: 0x746e88,                           // plate charcoal dark->light
  g: 0xffcc33,                                                     // fire/throat glow
  c: 0x4a1a24                                                      // cape
};

const DOWN_BODY = [
    '................................',
    '................................',
    '................................',
    '.......h.............h..........',
    '........h...........h...........',
    '......hhH...........Hhh.........',
    '.........................ccc....',
    '.........kkkkkkkkkkkkkkk....cc..',
    '........kSSllllllllllSSk...ccc..',
    '.......kSSllllllllllllSSk..ccc..',
    '.......kSlwe....k....ewlSk.ccc..',
    '.......kSllll........llllSk.cc..',
    '.......kSSllllllllllllSSk...cc..',
    '........kSSkkllllkkSSk......cc..',
    '.........kSSllllllSSk.......cc..',
    '.......kPPPQQQQQQQPPPk......cc..',
    '......kPPPQQQQQQQQQQQPPPk...cc..',
    '.....kPPQQQQQQQQQQQQQQQQPPk.cc..',
    '.....kPQQqqqqqqqqqqqqqqQPk..cc..',
    '.....kPQQqDDDDDDDDDDDDqQPk..cc..',
    '.....kPQQqDggggggggggDqQPk..cc..',
    '....kPQqDDsSllllllllSsDDqPk.cc..',
    '....kPQqDDsSllllllllSsDDqPk.cc..',
    '....kPQqDDsSSSSSSSSSSsDDqPk.cc..',
    '.....kPqDDsssssssssssDDqPk..cc..',
    '.....kPPDDDDDDDDDDDDDDDPPk..cc..',
    '.....kPPqqqqqqqqqqqqqqqPPk..cc..',
    '......kDDDsssssssssssDDDk...cc..',
    '......kDDssssssssssssDDk....cc..',
    '.....kkDDDDDDDDDDDDDDDDkk...cc..',
    '.....kddddddddddddddddddk...cc..',
    '.......kddD..........Dddk...cc..',
    '.......kddD..........Dddk...c...',
    '.......kDDDk........kDDDk.......',
    '.......kDDDk........kDDDk.......',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................'
  ];

const DOWN_LEGS = {
    stand: [
    '.......kDDDk........kDDDk.......',
    '.......kDDDk........kDDDk.......',
    '.......kkkkk........kkkkk.......',
    '.......kkkkk........kkkkk.......',
    '................................'
  ],
    a: [
    '......kDDDk.........kDDDk.......',
    '......kDDDk.........kkkkk.......',
    '......kkkkk.....................',
    '......kkkkk.....................',
    '................................'
  ],
    b: [
    '.......kDDDk........kDDDk.......',
    '.......kkkkk........kDDDk.......',
    '.....................kkkkk......',
    '.....................kkkkk......',
    '................................'
  ]
  };

const UP_BODY = [
    '................................',
    '................................',
    '................................',
    '.......h.............h..........',
    '........h...........h...........',
    '......hhH...........Hhh.........',
    '..cc.....................ccc....',
    '.ccc.....kkkkkkkkkkkkkkk....cc..',
    '.ccc....kSSllllllllllSSk...ccc..',
    '.ccc...kSSllllllllllllSSk..ccc..',
    '.ccc...kSlllllllllllllllSk.ccc..',
    '.ccc...kSllllllllllllllllSk.cc..',
    '.ccc...kSSllllllllllllSSk...cc..',
    '.ccc....kSSllllllllSSk......cc..',
    '.ccc.....kSSllllllSSk.......cc..',
    '.ccc...kPPPQQQQQQQPPPk......cc..',
    '..cc..kPPPQQQQQQQQQQQPPPk...cc..',
    '..cc.kPPQQQQQQQQQQQQQQQQPPk.cc..',
    '..cc.kPQQqqqqqqqqqqqqqqQPk..cc..',
    '..cc.kPQQqDDDDDDDDDDDDqQPk..cc..',
    '...cc.kPQQqDDDDDDDDDDqQPk...cc..',
    '....ckPQqDDDDDDDDDDDDDDqPk..cc..',
    '.....kPQqDDDDDDDDDDDDDDqPk..cc..',
    '.....kPQqDDDDDDDDDDDDDDqPk..cc..',
    '.....kPqDDsssssssssssDDqPk..cc..',
    '.....kPPDDDDDDDDDDDDDDDPPk..cc..',
    '.....kPPqqqqqqqqqqqqqqqPPk..cc..',
    '......kDDDsssssssssssDDDk...cc..',
    '......kDDssssssssssssDDk....cc..',
    '.....kkDDDDDDDDDDDDDDDDkk...cc..',
    '.....kddddddddddddddddddk...cc..',
    '.......kddD..........Dddk...cc..',
    '.......kddD..........Dddk...c...',
    '.......kDDDk........kDDDk.......',
    '.......kDDDk........kDDDk.......',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................'
  ];

const SIDE_BODY = [
    '................................',
    '................................',
    '................................',
    '......h.........................',
    '.......h........................',
    '.....hhH........................',
    '....................ccc.........',
    '....kkkkkkkkkkkkkkk....cc.......',
    '...kSSllllllllllSSk...ccc.......',
    '..kSSllllllllllllSSk..ccc.......',
    '..kSlwe.......k...kkSk.ccc......',
    '..kSllll.......kkllSk...cc......',
    '..kSSllllllllllllSSk....cc......',
    '...kSSkkllllkkSSk.......cc......',
    '....kSSllllllSSk........cc......',
    '..kPPPQQQQQQQPPk........cc......',
    '.kPPPQQQQQQQQQQQPPk.....cc......',
    'kPPQQQQQQQQQQQQQQQQPPk..cc......',
    'kPQQqqqqqqqqqqqqqqQPk...cc......',
    'kPQQqDDDDDDDDDDDDqQPk...cc......',
    'kPQQqDggggggggggDqQPk...cc......',
    'kPQqDDsSllllllllSsDDqPk.cc......',
    'kPQqDDsSllllllllSsDDqPk.cc......',
    'kPQqDDsSSSSSSSSSSsDDqPk.cc......',
    '.kPqDDsssssssssssDDqPk..cc......',
    '.kPPDDDDDDDDDDDDDDDPPk..cc......',
    '.kPPqqqqqqqqqqqqqqqPPk..cc......',
    '..kDDDsssssssssssDDDk...cc......',
    '..kDDssssssssssssDDk....cc......',
    '.kkDDDDDDDDDDDDDDDDkk...cc......',
    '.kddddddddddddddddddk...cc......',
    '...kddD..........Dddk...c.......',
    '...kddD..........Dddk...........',
    '...kDDDk........kDDDk...........',
    '...kDDDk........kDDDk...........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................'
  ];

const SIDE_LEGS = {
    stand: [
    '...kDDDk........kDDDk...........',
    '...kDDDk........kDDDk...........',
    '...kkkkk........kkkkk...........',
    '...kkkkk........kkkkk...........',
    '................................'
  ],
    a: [
    '..kDDDk.......kDDDk.............',
    '..kDDDk.......kkkkk.............',
    '..kkkkk.........................',
    '..kkkkk.........................',
    '................................'
  ],
    b: [
    '...kDDDk......kDDDk.............',
    '...kkkkk......kDDDk.............',
    '..............kkkkk.............',
    '..............kkkkk.............',
    '................................'
  ]
  };

export const DRAKKOR_SPRITE = {
  id: 'drakkor',
  map: DRAKKOR_MAP,
  w: 32, h: 48,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
