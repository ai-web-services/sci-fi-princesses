// ═══════════════════════════════════════════════════════════════
// LYRA SOLARI — dialogue portrait, authored pixel art 48×56
// Bust (head+shoulders), 3/4 view facing viewer-left. Starlight-gold
// hair, tiara w/ teal gem, blue eyes, violet gown shoulders w/ gold
// trim, fair skin. Default: determined-kind.
// Palette matches public/src/art/sprites/lyra.js (LYRA_MAP).
// ═══════════════════════════════════════════════════════════════

export const LYRA_MAP = {
  k: 0x241a38,                                        // outline
  h: 0xc7772a, H: 0xf2a93b, y: 0xffd166, Y: 0xffefa8,  // hair dark→light
  s: 0x7a4a52, S: 0xe8a887, f: 0xffd2ac, F: 0xffe8cc,  // skin shadow/base/high
  w: 0xf8f8ff, e: 0x3a7fd4, E: 0x66aef0,               // eye white / iris dark/light
  d: 0x45327d, D: 0x6a4fb3, p: 0x9678e0, P: 0xc7b2ff,  // dress dark→light
  g: 0xd9a92a, G: 0xffeea0,                            // gold trim
  j: 0x66e8e0, J: 0xbafff0,                            // tiara gem dark/light
  r: 0xb87a6a,                                         // blush / lip
  b: 0x241a38,                                         // pupil / brow / lash line (outline tone)
  c: 0x3a7fd4                                          // closed-eye crescent line (iris-dark tone)
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (determined-kind) ─────────────────────────────────
// Rows 0-13 hair crown/tiara, 14-17 upper hair frame, 18-38 face,
// 39-55 neck/shoulders/gown.
const NEUTRAL = [
row('................kkkkkkkk......................'), // 0
row('..............kkhhhhhhhhkk.....................'), // 1
row('.............khhHHHHHHHHHhhk...................'), // 2
row('............khHHHHHHHHHHHHhk...................'), // 3
row('...........khHHHyyyyyyyHHHhhk..................'), // 4
row('..........khHHyyyYYYYYyyyHHhhk.................'), // 5
row('.........khHHyyYYYGGGYYYyyHHhk.................'), // 6
row('.........khHyyYYGjJJJjGYYyyHhk.................'), // 7
row('.........khHyyYYGjJJJjGYYyyHhk.................'), // 8
row('.........khHyyYYYGGGYYYyyHHhk..................'), // 9
row('.........khHHyyyyyyyyyyyHHhkk..................'), // 10
row('........kkhHHHyyyyyyyyHHHhkk...................'), // 11
row('.......khhHHHHHHHHHHHHHHhhk....................'), // 12
row('......khhHHHHHHHHHHHHHHHHhhk...................'), // 13
row('.....khhHHHHhk........khHHhhk..................'), // 14
row('.....khHHHhk............khHHhk.................'), // 15
row('.....khHHhk...............khHhk................'), // 16
row('.....khHhk..................khhk...............'), // 17
row('.....khHk....kkkkkkkkkk......khhk..............'), // 18
row('.....khHk..kkbbbbbbbbbbkk......khk.............'), // 19
row('.....khHk.kbffffffffffffbk......khk............'), // 20
row('.....khHk.kbfffFFFFFFFFfbk......kHhk...........'), // 21
row('.....khHkkbffFFFFFFFFFFFfbk.....kHHhk..........'), // 22
row('.....khHhbfffFFFFFFFFFFFFbk.....kHHHhk.........'), // 23
row('.....khHHbffbbFFFFbbFFFFFbk.....kHHHhk.........'), // 24
row('.....khHhbfbwwebb..bewwbFFbk.....khHHhk........'), // 25
row('......khhbfbweEbb..bEewbFFbk.....khHhk.........'), // 26
row('.......khbfbbbbb....bbbbFbk......khhk..........'), // 27
row('.......khbfFFFFrrrrFFFFFbk......kkk............'), // 28
row('.......khbfFFFF....FFFFFbk.....................'), // 29
row('........kbFFFbbbbbbbFFFbk......................'), // 30
row('........kbFFFbrrrrrbFFbk.......................'), // 31
row('.........kbFFFbbbbbFFbk........................'), // 32
row('..........kbFFFFFFFFbk.........................'), // 33
row('...........kbFFFFFFbk..........................'), // 34
row('............kbbbbbbk...........................'), // 35
row('.............kffffk............................'), // 36
row('.............kffffk............................'), // 37
row('............kffffffk...........................'), // 38
row('...........kfffffffk...........................'), // 39
row('..........kgGGGGGGGgk..........................'), // 40
row('.........kgGGGGGGGGGgk.........................'), // 41
row('........kdDDDDDDDDDDDdk........................'), // 42
row('.......kdDDppppppppDDdk........................'), // 43
row('......kdDDppPPPPPPppDDdk.......................'), // 44
row('.....kdDDppPPPPPPPPppDDdk......................'), // 45
row('....kdDDppPPPPPPPPPPppDDdk.....................'), // 46
row('...kdDDppPPPPPPPPPPPPppDDdk....................'), // 47
row('..kdDDppPPPPPPPPPPPPPPppDDdk...................'), // 48
row('.kgGDppPPPPPPPPPPPPPPPPppDGgk..................'), // 49
row('kgGDppPPPPPPPPPPPPPPPPPPppDGgk.................'), // 50
row('kgGDppPPPPPPPPPPPPPPPPPPPPpDGgk................'), // 51
row('kgGDDppppppppppppppppppppppDGgk................'), // 52
row('.kgGDDDDDDDDDDDDDDDDDDDDDDDGgk.................'), // 53
row('..kgGgGgGgGgGgGgGgGgGgGgGgGgk..................'), // 54
row('...kkkkkkkkkkkkkkkkkkkkkkkkk...................')  // 55
];

// setRow: full-row replacement keyed by index, avoids offset math.
function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPY: eyes soften to crescents, open smiling mouth ───────
const HAPPY = withRows(NEUTRAL, {
  25: '.....khHhbfbccebb..becebFFbk.....khHHhk........',
  26: '......khhbfbcceebb..beeccbFFbk...khHhk.........',
  27: '.......khbfbbbbb....bbbbFbk......khhk..........',
  28: '.......khbfFFFFrrrrrrFFFFbk.....kkk............',
  29: '.......khbfFFrrrrrrrrrrFFbk....................',
  30: '........kbFFbrrrrrrrrrrbFbk....................',
  31: '........kbFbbrrrrrrrrbbFbk.....................',
  32: '.........kbFbbbbbbbbbFbk.......................',
  33: '..........kbFFFFFFFFbk.........................'
});

// ── SAD: brows angled down-in, eyes half-lidded, downturned mouth
const SAD = withRows(NEUTRAL, {
  24: '.....khHHbffbbFFFbbFFFFFbk.....kHHHhk..........',
  25: '.....khHhbfbwwbb....bewbFFbk.....khHHhk........',
  26: '......khhbfbbeb......ebbFFbk.....khHhk.........',
  27: '.......khbfbbbb......bbbbFbk.....khhk..........',
  28: '.......khbfFFFF......FFFFFbk....kkk............',
  29: '.......khbfFFFb.rrrr.bFFFbk....................',
  30: '........kbFFFbrrrrrrrbFFbk.....................',
  31: '........kbFFbrrrrrrrrrbFbk.....................',
  32: '.........kbFbbbbbbbbbFbk.......................'
});

// ── ANGRY: sharp v-brows, narrowed eyes, tight flat mouth ──────
const ANGRY = withRows(NEUTRAL, {
  23: '.....khHhbfffbbbFFFFFbbFFFbk.....kHHHhk........',
  24: '.....khHHbffbkbbFFFFbbkbFFbk.....kHHHhk........',
  25: '.....khHhbfbwebb....bewbFFbk.....khHHhk........',
  26: '......khhbfbbbb......bbbbFbk.....khHhk.........',
  27: '.......khbfbbbb......bbbbFbk.....khhk..........',
  28: '.......khbfFFFFbbbbbbFFFFFbk....kkk............',
  29: '.......khbfFFFFrrrrrrFFFFbk....................',
  30: '........kbFFFbbbbbbbbFFbk......................',
  31: '........kbFFFbrrrrrbFFbk.......................'
});

// ── SURPRISED: brows raised, eyes wide round, small open "o" mouth
const SURPRISED = withRows(NEUTRAL, {
  22: '.....khHkkbffFFFFFFFFFFFfbk.....kHHhk..........',
  23: '.....khHhbfffbbFFFFbbFFFFFbk.....kHHHhk........',
  24: '.....khHHbffbwwEbb..bEwwbFFbk....kHHHhk........',
  25: '.....khHhbfbwwEEbb..bEEwwbFFbk...khHHhk........',
  26: '......khhbfbbwwbb....bwwbbFFbk...khHhk.........',
  27: '.......khbfbbbbb......bbbbFbk....khhk..........',
  28: '.......khbfFFFF.rrrr.FFFFFbk....kkk............',
  29: '.......khbfFFF.rrrrrr.FFFbk....................',
  30: '........kbFFb.rrrrrr.bFFbk.....................',
  31: '........kbFFbb.rrrr.bbFFbk.....................',
  32: '.........kbFbbbbbbbbbFbk.......................'
});

export const LYRA_PORTRAIT = {
  id: 'lyra',
  w: W, h: H,
  map: LYRA_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
