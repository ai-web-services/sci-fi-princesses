// ═══════════════════════════════════════════════════════════════
// ERYNN "ERYX" VEXX — Felidae scout, authored pixel art 24×32
// Tall large cat ears, dusk-violet fur, slim athletic build,
// blue-steel scout bodysuit, red accent scarf, visible tail,
// digitigrade bent-leg stance. Sleeker/narrower than Lyra.
// Grids: body rows 0–26 + leg variants rows 27–31 per direction.
// ═══════════════════════════════════════════════════════════════

export const ERYNN_MAP = {
  k: 0x201828,                    // outline (species-dark)
  f: 0x2d2438, F: 0x4d3d55, m: 0x6f5a78, M: 0x93789c, l: 0xb99cc0, // fur dark→light
  w: 0xf8f8ff, e: 0x9a5ac0,        // eye white / sharp iris
  n: 0x1a2230,                     // nose/inner ear dark
  u: 0x1a2230, U: 0x2a3a4d, s: 0x3d5468, S: 0x567088, x: 0x7a92a8,  // suit dark→light
  X: 0x1a2230,                     // boot dark (reuses suit-dark tone)
  r: 0x8a2a3a, R: 0xc24352, a: 0xe86a6a                             // scarf accent
};

const DOWN_BODY = [
  '.......f........f......',
  '......ff.f....f.ff.....',
  '.....fFF..f..f..FFf....',
  '.....fFll..ff..llFf....',
  '......fMMl.ff.lMMf.....',
  '.......kkkkkkkk........',
  '......kFllllllFk.......',
  '.....kFMMMMMMMMFk......',
  '.....kFMnMMMMnMFk......',
  '.....kFMMMMMMMMFk......',
  '.....kMMweMMMMweMk.....',
  '.....kMMMMMMMMMMMk.....',
  '......kFMMMMMMMFk......',
  '.......kkFMMMFkk.......',
  '........kFMMFk.........',
  '.......kUUUUUUk........',
  '......kUsssssssUk......',
  '.....kUsSSSSSSSsUk.....',
  '.....kUsSraaaarSsUk....',
  '.....kUsSSaaaaSSsUk....',
  '......kUsSSSSSsUk......',
  '.....kUUsSSSSSsUUk.....',
  '....kUUUsSSSSsUUUk.....',
  '....kUUUsSSSSsUUUk.....',
  '....kUUUUsSSsUUUUk.....',
  '....kxXXxxxxxxXXxk.....',
  '....kuuuuuuuuuuuuk.....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const DOWN_LEGS = {
  stand: [
    '........kuUk..kuUk......',
    '........kuUk..kuUk......',
    '........kuuk..kuuk......',
    '........kkkk..kkkk......',
    '........................'
  ],
  a: [
    '........kuUk..kuUk......',
    '.......kuUk...kkkk......',
    '.......kuuk.............',
    '.......kkkk.............',
    '........................'
  ],
  b: [
    '........kuUk..kuUk......',
    '........kkkk..kuUk......',
    '..............kuUk......',
    '..............kkkk......',
    '........................'
  ]
};

const UP_BODY = [
  '.......f........f......',
  '......ff.f....f.ff.....',
  '.....fFF..f..f..FFf....',
  '.....fFll..ff..llFf....',
  '......fMMl.ff.lMMf.....',
  '.......kkkkkkkk.........',
  '......kFllllllFk.......',
  '......kFMMMMMMFk.......',
  '......kFMMMMMMFk.......',
  '......kFMMMMMMFk.......',
  '.......kFMMMMFk........',
  '........kFMMFk.........',
  '.......kkFMMFkk........',
  '........kFMMFk.........',
  '........kFMMFk.........',
  '.......kUUUUUUk........',
  '......kUsssssssUk......',
  '.....kUsSSSSSSSsUk.....',
  '.....kUsSSSSSSSsUk.....',
  '.....kUsSSaaaaSsUk.....',
  '......kUsSSSSSsUk......',
  '.....kUUsSSSSSsUUk.....',
  '....kUUUsSSSSsUUUk.....',
  '....kUUUsSSSSsUUUk.....',
  '....kUUUUsSSsUUUUk.....',
  '....kxXXxxxxxxXXxk.....',
  '....kuuuuuuuuuuuuk.....'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_BODY = [
  '.......ff...............',
  '......fFf..f............',
  '.....fFF..ff............',
  '.....fFll.ff............',
  '......fMMlf.............',
  '......kkkkkk............',
  '.....kFllllFk...........',
  '.....kFMMMMMFk..........',
  '.....kFMMMMMnFk.........',
  '.....kFMMMMMMFk.........',
  '.....kMMMMweMMk.........',
  '......kMMMMMMk..........',
  '.......kkMMkFk..........',
  '........kMMkFk.........m',
  '.........kkkFk........mM',
  '........kUUUUk.......mMl',
  '.......kUsssUk......fMl.',
  '......kUsSSSsUk....fFl..',
  '......kUsSraSsUk..fFl...',
  '......kUsSaaSsUk.fFl....',
  '.......kUsSSsUk.kk......',
  '......kUUsSSsUUk........',
  '.....kUUUsSSsUUUk.......',
  '.....kUUUsSSsUUUk.......',
  '.....kUUUUsSsUUUUk......',
  '.....kxXXxxxxXXxk......',
  '.....kuuuuuuuuuuk.......'
].map(r => r.padEnd(24, '.').slice(0, 24));

const SIDE_LEGS = {
  stand: [
    '..........kuUk..........',
    '..........kuUk..........',
    '..........kuukk.........',
    '..........kkkkk.........',
    '........................'
  ],
  a: [
    '.........kuUk.kuUk......',
    '........kuUk...kuUk.....',
    '........kuuk...kuukk....',
    '........kkkk...kkkkk....',
    '........................'
  ],
  b: [
    '..........kuUkuUk.......',
    '..........kuUkuUk.......',
    '.........kuukkuukk......',
    '.........kkkk.kkkk......',
    '........................'
  ]
};

export const ERYNN_SPRITE = {
  id: 'erynn',
  map: ERYNN_MAP,
  w: 24, h: 32,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
