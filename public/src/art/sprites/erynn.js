// ═══════════════════════════════════════════════════════════════
// ERYNN VEXX — Felidae scout, authored pixel art 32×48 (taller
// silhouette per concept sheet / ART_VISION §1). Act 1 base form
// (Shadow Scout): dark charcoal bodysuit, crimson chest straps,
// tall pointed ears, digitigrade bent-leg stance, tail. FFIV
// big-head heroic chibi, low-crouch readiness in the silhouette.
// Grids: body rows 0–42 (43 rows) + leg variants rows 43–47 (5
// rows) per direction. All rows normalized to exactly 32 chars.
// ═══════════════════════════════════════════════════════════════

const W = 32;
const norm = rows => rows.map(r => r.padEnd(W, '.').slice(0, W));

export const ERYNN_MAP = {
  k: 0x1a1a2a,                              // outline (ART_VISION binding)
  f: 0x853322, F: 0xcc7744,                 // fur dark→light
  w: 0xf8f8ff, e: 0xffcc33,                 // eye white / amber iris
  n: 0x111111,                              // nose/inner-ear dark
  u: 0x222233, U: 0x2a2233, s: 0x3a3344, S: 0x4a4358, // suit dark outline / base / lighter
  r: 0x8a2233, R: 0xcc3333,                 // crimson straps dark/light
  t: 0x853322,                              // tail (fur tone)
  l: 0xcc7744, M: 0xcc7744                  // ear-tuft highlight (fur light, alias)
};

const DOWN_BODY = norm([
  '................................',
  '........f..............f.......',
  '.......ff.f...........f.ff.....',
  '......fFF..f.........f..FFf....',
  '......fFll..f.......f..llFf....',
  '.......fFMl.f......f.lMFf......',
  '........kkkkkkkkkkkk...........',
  '.......kFFFFFFFFFFFFk..........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFnFFFFFFFFnFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFweFFFFFFweFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '.......kFFFFFFFFFFFFk..........',
  '........kkFFFFFFFFkk...........',
  '.........kFFFFFFFFk............',
  '.........kFFFFFFFFk............',
  '..........kUUUUUUk.............',
  '.........kUsssssssUk...........',
  '........kUsSSSSSSSSsUk.........',
  '........kUsSrRRRRRrSsUk........',
  '........kUsSSrRRRrSSsUk........',
  '........kUsSSSSSSSSsUk.........',
  '.........kUsSSSSSSSsUk.........',
  '.........kUUsSSSSSsUUk.........',
  '........kUUUsSSSSsUUUk.........',
  '........kUUUsSSSSsUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kSsSssssssSsSk.........',
  '........kuuuuuuuuuuuuk.........',
  '........kUUUUUUUUUUUUk.........',
  '........kuUUUUUUUUUUuk.........',
  '........kuUUUUUUUUUUuk.........',
  '........kuuuuuuuuuuuuk.........',
  '........kUUUUUUUUUUUUk.........',
  '........kuuuuuuuuuuuuk.........',
  '................................',
  '................................'
]);

const DOWN_LEGS = {
  stand: norm([
    '..........kuUk..kuUk............',
    '..........kuUk..kuUk............',
    '..........kuuk..kuuk............',
    '..........kkkk..kkkk............',
    '................................'
  ]),
  a: norm([
    '..........kuUk..kuUk............',
    '.........kuUk...kkkk............',
    '.........kuuk....................',
    '.........kkkk....................',
    '................................'
  ]),
  b: norm([
    '..........kuUk..kuUk............',
    '..........kkkk..kuUk............',
    '..................kuuk...........',
    '..................kkkk...........',
    '................................'
  ])
};

const UP_BODY = norm([
  '................................',
  '........f..............f.......',
  '.......ff.f...........f.ff.....',
  '......fFF..f.........f..FFf....',
  '......fFll..f.......f..llFf....',
  '.......fFMl.f......f.lMFf......',
  '........kkkkkkkkkkkk...........',
  '.......kFFFFFFFFFFFFk..........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '......kFFFFFFFFFFFFFFk.........',
  '.......kFFFFFFFFFFFFk..........',
  '........kkFFFFFFFFkk...........',
  '.........kFFFFFFFFk............',
  '.........kFFFFFFFFk............',
  '..........kUUUUUUk.............',
  '.........kUsssssssUk...........',
  '........kUsSSSSSSSSsUk.........',
  '........kUsSSSSSSSSsUk.........',
  '........kUsSSSSSSSSsUk.........',
  '........kUsSSSSSSSSsUk.........',
  '.........kUsSSSSSSSsUk.........',
  '.........kUUsSSSSSsUUk.........',
  '........kUUUsSSSSsUUUk.........',
  '........kUUUsSSSSsUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kUUUUsSSsUUUUk.........',
  '........kSsSssssssSsSk.........',
  '........kuuuuuuuuuuuuk.........',
  '........kUUUUUUUUUUUUk.........',
  '........kuUUUUUUUUUUuk.........',
  '........kuUUUUUUUUUUuk.........',
  '........kuuuuuuuuuuuuk.........',
  '........kUUUUUUUUUUUUk.........',
  '........kuuuuuuuuuuuuk.........',
  '................................',
  '................................'
]);

const SIDE_BODY = norm([
  '................................',
  '......f.....................f..',
  '.....ff.f...................f.f',
  '....fFF..f.................f..F',
  '....fFll..f................f..l',
  '.....fFMl.f................f.lM',
  '......kkkkkkkkkkkk..............',
  '.....kFFFFFFFFFFFFk.............',
  '....kFFFFFFFFFFFFFFk............',
  '....kFFFFFFFFFFFFnFFk...........',
  '....kFFFFFFFFFFFFFFk............',
  '....kFFweFFFFFFFFFFk............',
  '....kFFFFFFFFFFFFFFk............',
  '.....kFFFFFFFFFFFFk.............',
  '......kkFFFFFFFFkk..............',
  '.......kFFFFFFFFk...............',
  '.......kFFFFFFFFk...............',
  '........kUUUUUUk................',
  '.......kUsssssssUk..............',
  '......kUsSSSSSSSSsUk............',
  '......kUsSrRRRRRrSsUk...........',
  '......kUsSSrRRRrSSsUk...........',
  '......kUsSSSSSSSSsUk............',
  '.......kUsSSSSSSSsUk............',
  '.......kUUsSSSSSsUUk............',
  '......kUUUsSSSSsUUUk............',
  '......kUUUsSSSSsUUUk............',
  '......kUUUUsSSsUUUUk...........t',
  '......kUUUUsSSsUUUUk..........tt',
  '......kUUUUsSSsUUUUk.........tFt',
  '......kUUUUsSSsUUUUk........tFFt',
  '......kUUUUsSSsUUUUk.......tFFf.',
  '......kUUUUsSSsUUUUk......tFFf..',
  '......kSsSssssssSsSk....ttFFf...',
  '......kuuuuuuuuuuuuk...tFFf.....',
  '......kUUUUUUUUUUUUk..fFf.......',
  '......kuUUUUUUUUUUuk.fFf........',
  '......kuUUUUUUUUUUuk.ff.........',
  '......kuuuuuuuuuuuuk............',
  '......kUUUUUUUUUUUUk............',
  '......kuuuuuuuuuuuuk............',
  '................................',
  '................................'
]);

const SIDE_LEGS = {
  stand: norm([
    '..........kuUk...................',
    '..........kuUk...................',
    '..........kuuk...................',
    '..........kkkk...................',
    '................................'
  ]),
  a: norm([
    '.........kuUk.kuUk...............',
    '........kuUk...kuUk..............',
    '........kuuk...kuukk.............',
    '........kkkk...kkkkk.............',
    '................................'
  ]),
  b: norm([
    '..........kuUkuUk................',
    '..........kuUkuUk................',
    '.........kuukkuukk...............',
    '.........kkkk.kkkk...............',
    '................................'
  ])
};

export const ERYNN_SPRITE = {
  id: 'erynn',
  map: ERYNN_MAP,
  w: 32, h: 48,
  down: { body: DOWN_BODY, legs: DOWN_LEGS },
  up:   { body: UP_BODY,   legs: DOWN_LEGS },
  side: { body: SIDE_BODY, legs: SIDE_LEGS }
};
