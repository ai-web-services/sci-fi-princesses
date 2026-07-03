// ═══════════════════════════════════════════════════════════════
// BRIMBLE TOADSWORTH — Anura guardian, authored pixel art 24×32
// Stocky and wide, big round head, wide mouth, bulging top-eyes,
// pond-green skin, cream belly, earth-brown robe/sash, short
// powerful legs, bioluminescent throat-sac glow. Short+wide
// silhouette: body sits low, leaving empty rows at the top.
// Grids: body rows 0–26 + leg variants rows 27–31 per direction.
// ═══════════════════════════════════════════════════════════════

export const BRIMBLE_MAP = {
  k: 0x14201a,                    // outline (deep green-black)
  g: 0x1f4a33, G: 0x2e6b44, m: 0x459158, M: 0x66b573, l: 0x94d998, // skin dark→light
  b: 0x9a8a4a, B: 0xc4b468, c: 0xe0d68a, C: 0xf2e9ad,               // belly ramp
  w: 0xf8f8ff, e: 0x14201a,        // eye white / pupil
  r: 0x3d3020, R: 0x5e4a30, o: 0x7f6642, O: 0xa08655, p: 0xc0a870,  // robe dark→light
  t: 0x2a9a92                      // throat glow (teal)
};

const DOWN_BODY = [
  '........................',
  '........................',
  '........................',
  '.......kkkkkkkkk........',
  '......kMMllllMMk........',
  '.....kMwek....kewMk.....',
  '.....kMwek....kewMk.....',
  '.....kMMllllllllMk......',
  '....kGMMllllllllMGk.....',
  '....kGMMMllllllMMGk.....',
  '....kGMMt..tt..tMGk.....',
  '....kGGMMMMMMMMMGGk.....',
  '...kGGGMMkkkkkkMGGGk....',
  '...kGGGMMkkkkkkMGGGk....',
  '..kGGGGMMllllllMGGGGk...',
  '..kGoooooooooooooooGk..',
  '.kGRoOOppppppppOOoRGk..',
  '.kGRoOObBCCCCBBOoORGk..',
  '.kGRoOOBCCCCCCBBOoRGk..',
  '.kGRoOOBCCCCCCBOOoRGk..',
  '.kGRRoOOBBBBBBOOoRRGk..',
  '.kGRRRoooooooooRRRGk..',
  '..kGGRRRrrrrrRRRGGk....',
  '..kGGGGGRRRRRGGGGGk....',
  '..kMGGGGGGGGGGGGMk.....',
  '..kMMGGGGGGGGGGMMk.....',
  '..kkMMMMMMMMMMMMkk.....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const DOWN_LEGS = {
  stand: [
    '.......kMMMk..kMMMk.....',
    '.......kGGGk..kGGGk.....',
    '.......kkkkkk.kkkkk.....',
    '.......kkkkkkkkkkkk.....',
    '........................'
  ],
  a: [
    '......kMMMk...kMMMk.....',
    '......kGGGk...kGGGk.....',
    '......kkkkkk..kkkkkk....',
    '......kkkkkk..kkkkkk....',
    '........................'
  ],
  b: [
    '.......kMMMk..kMMMk.....',
    '.......kGGGk..kGGGk.....',
    '......kkkkkkk.kkkkk.....',
    '......kkkkkkk.kkkkk.....',
    '........................'
  ]
};

const UP_BODY = [
  '........................',
  '........................',
  '........................',
  '.......kkkkkkkkk........',
  '......kMMMMMMMMk........',
  '.....kMMMMMMMMMMk.......',
  '.....kMMMMMMMMMMk.......',
  '.....kMMllllllMMk.......',
  '....kGMMllllllMMGk......',
  '....kGMMMllllMMMGk......',
  '....kGMMMMMMMMMMGk......',
  '....kGGMMMMMMMMGGk......',
  '...kGGGMMkkkkMMGGGk.....',
  '...kGGGMMkkkkMMGGGk.....',
  '..kGGGGMMllllMMGGGGk....',
  '..kGoooooooooooooooGk..',
  '.kGRoOOppppppppOOoRGk..',
  '.kGRoOOppppppppOOoRGk..',
  '.kGRoOOppppppppOOoRGk..',
  '.kGRoOOppppppppOOoRGk..',
  '.kGRRoOOppppppOOoRRGk..',
  '.kGRRRoooooooooRRRGk..',
  '..kGGRRRrrrrrRRRGGk....',
  '..kGGGGGRRRRRGGGGGk....',
  '..kMGGGGGGGGGGGGMk.....',
  '..kMMGGGGGGGGGGMMk.....',
  '..kkMMMMMMMMMMMMkk.....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_BODY = [
  '........................',
  '........................',
  '........................',
  '......kkkkkkkkkk.......',
  '.....kMMMMMMMMMk.......',
  '....kMMMMMMMMMMk.......',
  '....kMwekMMMMMMMk......',
  '....kMMllMMMMMMk.......',
  '...kGMMllllllMGk.......',
  '...kGMMMlllllMGk.......',
  '...kGMMt...ttMGk.......',
  '...kGGMMMMMMMGGk.......',
  '..kGGGMMkkkkMGGGk......',
  '..kGGGMMkkkkMGGGk......',
  '.kGGGGMMllllMGGGGk.....',
  '.kGooooooooooooGk......',
  'kGRoOOppppppOOoRGk.....',
  'kGRoOOBCCCCBBOoRGk.....',
  'kGRoOOBCCCCCBOOoRGk....',
  'kGRoOOBCCCCCBOOoRGk....',
  'kGRRoOOBBBBBOOoRRGk....',
  'kGRRRoooooooooRRRGk....',
  '.kGGRRRrrrrrRRRGGk.....',
  '.kGGGGGRRRRRGGGGGk.....',
  '.kMGGGGGGGGGGGGMk......',
  '.kMMGGGGGGGGGGMMk......',
  '.kkMMMMMMMMMMMMkk......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_LEGS = {
  stand: [
    '......kMMMk...kMMMk.....',
    '......kGGGk...kGGGk.....',
    '......kkkkkk..kkkkkk....',
    '......kkkkkk..kkkkkk....',
    '........................'
  ],
  a: [
    '.....kMMMk....kMMMk.....',
    '.....kGGGk....kGGGk.....',
    '.....kkkkkk...kkkkkk....',
    '.....kkkkkkk..kkkkkk....',
    '........................'
  ],
  b: [
    '......kMMMk...kMMMk.....',
    '......kGGGk...kGGGk.....',
    '.....kkkkkkk..kkkkk.....',
    '.....kkkkkkk..kkkkk.....',
    '........................'
  ]
};

export const BRIMBLE_SPRITE = {
  id: 'brimble',
  map: BRIMBLE_MAP,
  w: 24, h: 32,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
