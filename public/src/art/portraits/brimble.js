// ═══════════════════════════════════════════════════════════════
// BRIMBLE TOADSWORTH — dialogue portrait, authored pixel art 48×56
// Bust, 3/4 view facing viewer-left. Anura frog person, wide head,
// pond-green skin, cream belly/chin, large gold eyes set high,
// brown robe collar. Default: serene.
// Palette matches public/src/art/sprites/brimble.js (BRIMBLE_MAP).
// ═══════════════════════════════════════════════════════════════

export const BRIMBLE_MAP = {
  k: 0x14201a,                                          // outline
  g: 0x1f4a33, G: 0x2e6b44, m: 0x459158, M: 0x66b573, l: 0x94d998, // skin dark→light
  c: 0x9a8a4a, C: 0xc4b468, b: 0xe0d68a, B: 0xf2e9ad,   // cream belly/chin ramp
  w: 0xf8f8ff, y: 0xb3892a, Y: 0xe8c060,                // eye white / gold iris dark/light
  n: 0x14201a,                                          // pupil dark
  r: 0x3d3020, R: 0x5e4a30, o: 0x7f6642, O: 0xa08655, p: 0xc0a870, // robe dark→light
  t: 0x2a9a92                                           // throat glow teal
};

const W = 48, H = 56;
function row(str) { return str.padEnd(W, '.').slice(0, W); }

// ── NEUTRAL (serene) ───────────────────────────────────────────
// Wide low-set head fills rows 4-30 (eyes bulge high on top of head
// rows 4-14), wide mouth, robe collar rows 31-55.
const NEUTRAL = [
row('................................................'), // 0
row('................................................'), // 1
row('.......kkkkkkkkkk..........kkkkkkkkk...........'), // 2
row('......kMMMllllMMMk........kMMllllMMk...........'), // 3
row('.....kMwwwwwwwwwwMk......kMwwwwwwwMk...........'), // 4
row('....kMwwwYYYYYYwwwMk....kMwwwYYYwwwMk...........'), // 5
row('....kMwwYYnnYYnYYwwMk...kMwwYYnnYYwwMk..........'), // 6
row('....kMwwYYnnYYnYYwwMk...kMwwYYnnYYwwMk..........'), // 7
row('....kMwwwYYYYYYYwwwMk...kMwwwYYYYwwwMk..........'), // 8
row('.....kMwwwwwwwwwwwMk.....kMwwwwwwwwMk...........'), // 9
row('......kMMmmmmmmmMMk.......kMMmmmmmMk............'), // 10
row('.......kMmllllllmMk........kMmllllmMk...........'), // 11
row('.......kGMmllllllmMGk......kGMmlllmMGk..........'), // 12
row('......kGGMmlllllllmMGGk...kGGMmllllmMGGk........'), // 13
row('......kGGGMmmmmmmmMGGGk...kGGGMmmmmMGGGk........'), // 14
row('.....kGGGGMMMMMMMMMGGGGkkkGGGGMMMMMMMGGGGk......'), // 15
row('.....kGGGGGMMMMMMMMMGGGGGGGGGMMMMMMMMGGGGGk.....'), // 16
row('.....kGGGGGGMMMMMMMMMGGGGGGGMMMMMMMMGGGGGGk.....'), // 17
row('.....kGGGGGGGMlllllllMMMMMlllllllMGGGGGGGk......'), // 18
row('......kGGGGGGMlllllllllllllllllllMGGGGGGk.......'), // 19
row('......kGGGGGGGMllllllllllllllllllMGGGGGk........'), // 20
row('.......kGGGGGGMllllllllllllllllllMGGGGk.........'), // 21
row('........kGGGGGMllllttttttllllllMGGGGk...........'), // 22
row('.........kGGGGMlllltttttttlllllMGGGk............'), // 23
row('..........kGGGMllllltttttllllllMGk..............'), // 24
row('...........kGGMlllllllllllllllMGk...............'), // 25
row('............kGMllllllllllllllMGk................'), // 26
row('.............kGMMMMMMMMMMMMMGk..................'), // 27
row('..............kGGGGGGGGGGGGGk...................'), // 28
row('...............kGGGGGGGGGGGk....................'), // 29
row('................kGGGGGGGGGk.....................'), // 30
row('...............kbBBBBBBBBBbk....................'), // 31
row('..............kbBCCCCCCCCCBbk...................'), // 32
row('.............kbBCCCCCCCCCCCBbk..................'), // 33
row('............kbBCCCCCCCCCCCCCBbk.................'), // 34
row('...........kbBCCCCCCCCCCCCCCCBbk................'), // 35
row('..........kbBBCCCCCCCCCCCCCCCBBbk...............'), // 36
row('.........kbBBbbbbbbbbbbbbbbbbBBbk...............'), // 37
row('........korOOppppppppppppppppOOrok.............'), // 38
row('.......korOOppppppppppppppppppOOrok............'), // 39
row('......korOOppppppppppppppppppppOOrok...........'), // 40
row('.....korOOOppppppppppppppppppppOOOrok..........'), // 41
row('....korROOOOppppppppppppppppppOOOORrok.........'), // 42
row('...korRROOOOOppppppppppppppppOOOOORRrok........'), // 43
row('..korRRROOOOOOOppppppppppppppOOOOOORRRrok......'), // 44
row('.korRRRRoooooooooooooooooooooooooRRRRrok.......'), // 45
row('korRRRRRrrrrrrrrrrrrrrrrrrrrrrrrRRRRRrok........'), // 46
row('kGGRRRRRRrrrrrrrrrrrrrrrrrrrrrrRRRRRRGGk........'), // 47
row('kMGGGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGMk.........'), // 48
row('kMMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGMMk..........'), // 49
row('.kMMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGMMk...........'), // 50
row('..kkMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMkk............'), // 51
row('...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.............'), // 52
row('................................................'), // 53
row('................................................'), // 54
row('................................................')  // 55
];

function withRows(base, overrides) {
  const g = base.map(r => r);
  for (const [idx, str] of Object.entries(overrides)) g[idx] = row(str);
  return g;
}

// ── HAPPY: eyes curve into contented crescents, wide mouth grin
const HAPPY = withRows(NEUTRAL, {
  6: '....kMwwccccccccwwMk...kMwwccccccwwMk..........',
  7: '....kMwwwccccccwwwMk...kMwwwccccwwwMk...........',
  22: '........kGGGGGMlllttttttllllllMGGGGk...........',
  23: '.........kGGGGMlrrrrrrrrrrrrrlMGGGk............',
  24: '..........kGGGMlrrrrrrrrrrrrrlMGk..............',
  25: '...........kGGMllrrrrrrrrrrrlllMGk..............',
  26: '............kGMlllrrrrrrrrrlllMGk................'
});

// ── SAD: eyes droop half-closed, mouth turns down, chin lowers
const SAD = withRows(NEUTRAL, {
  6: '....kMwwYYmmYYmYYwwMk...kMwwYYmmYYwwMk..........',
  7: '....kMwwwYmmYYmmYwwwMk..kMwwwYmmYYwwwMk.........',
  22: '........kGGGGGMlllllttttllllllMGGGGk...........',
  23: '.........kGGGGMllllltttttlllllMGGGk............',
  24: '..........kGGGMlllllllllllllllMGk..............',
  25: '...........kGGMlrrrrrrrrrrrrrlMGk...............',
  26: '............kGMrrrrrrrrrrrrrrrMGk................',
  27: '.............kGMMlllllllllllMGk..................'
});

// ── ANGRY: brow ridges lower and furrow, mouth wide flat grimace
const ANGRY = withRows(NEUTRAL, {
  15: '.....kGGGGrrrrrrrrrGGGGkkkGGGGrrrrrrrrGGGGk......',
  16: '.....kGGGGGrrrrrrrrrGGGGGGGGGrrrrrrrrGGGGGk.....',
  22: '........kGGGGGMllnnttttnnllllMGGGGk...........',
  23: '.........kGGGGMlllnttttntlllllMGGGk............',
  25: '...........kGGMRRRRRRRRRRRRRRRMGk...............',
  26: '............kGMRRRRRRRRRRRRRRMGk................',
  27: '.............kGMMbbbbbbbbbbbMGk..................'
});

// ── SURPRISED: eyes bulge wider/rounder, mouth opens into small "o"
const SURPRISED = withRows(NEUTRAL, {
  4: '.....kMwwwwwwwwwwwwMk...kMwwwwwwwwwMk...........',
  5: '....kMwwwwYYYYYYwwwwMk..kMwwwwYYYwwwwMk.........',
  6: '....kMwwYYnnYYnYYwwMk...kMwwYYnnYYwwMk..........',
  22: '........kGGGGGMlllltttttlllllllMGGGGk...........',
  23: '.........kGGGGMllll.ttt.lllllllMGGGk............',
  24: '..........kGGGMlll.tttt.llllllMGk..............',
  25: '...........kGGMll.tttt.lllllMGk...............',
  26: '............kGMl.tttt.lllllMGk................'
});

export const BRIMBLE_PORTRAIT = {
  id: 'brimble',
  w: W, h: H,
  map: BRIMBLE_MAP,
  expressions: {
    neutral: NEUTRAL,
    happy: HAPPY,
    sad: SAD,
    angry: ANGRY,
    surprised: SURPRISED
  }
};
