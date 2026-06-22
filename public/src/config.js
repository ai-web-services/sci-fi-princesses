// ═══════════════════════════════════════════════════════════════
// CONFIG — Constants, tile types, colors
// ═══════════════════════════════════════════════════════════════

export const TILE = 16;
export const MAP_W = 60;
export const MAP_H = 40;
export const GAME_W = 480;
export const GAME_H = 270;

export const COLORS = {
  floor1: 0x2a2a4a, floor2: 0x252545, wall1: 0x444466, wall2: 0x3a3a5a,
  wood: 0x664422, wood2: 0x553311, gold: 0xffaa00,
  water1: 0x2244aa, water2: 0x1a33aa,
  grass1: 0x225533, grass2: 0x1a4428,
  path1: 0x554433, path2: 0x4a3a2a,
  void1: 0x1a0a2a, void2: 0x0a0a1a,
  ice1: 0xaaccff, ice2: 0x88aadd,
  lava1: 0xff4400, lava2: 0xcc2200,
  skin: 0xffccaa, skin2: 0xddaa88,
  hair1: 0xffdd44, hair2: 0xcc8833, hair3: 0x333333, hair4: 0xff6633,
  eye1: 0x44ddff, eye2: 0xff4444, eye3: 0x44ff44, eye4: 0xffaa00,
  purple: 0xaa44ff, blue: 0x3344aa, red: 0xff3344, green: 0x33cc66,
  darkRed: 0x881122, darkGreen: 0x116633, brown: 0x886644,
  white: 0xffffff, gray: 0x666688, lightGray: 0xaaaacc,
  yellow: 0xffcc33, orange: 0xff8833, pink: 0xff66aa,
  robot: 0x8899aa, robotEye: 0x44ffff,
  frog: 0x44aa66, dragon: 0xcc3333, catEar: 0xff8866,
  metal: 0x778899, darkBrown: 0x553322
};

// Tile types
export const T = {
  FLOOR: 0, WALL: 1, DOOR: 2, WATER: 3, BRIDGE: 4,
  GRASS: 5, PATH: 6, COUNTER: 7, SHELF: 8, PLANT: 9,
  SIGN: 10, CHEST: 11, GATE: 12, PORTAL: 13, BED: 14,
  TABLE: 15, BAR: 16, STAIRS: 17, VOID: 18, ICE: 19, LAVA: 20
};
