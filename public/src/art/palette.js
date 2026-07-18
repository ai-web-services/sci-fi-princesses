// ═══════════════════════════════════════════════════════════════
// PALETTE — Color ramps with hue-shifted shading
// Every ramp runs dark → light. Shadows shift cool, highlights warm
// (or per-ramp intent). Art code indexes ramps, never raw colors.
// ═══════════════════════════════════════════════════════════════

export const RAMP = {
  // ── Skin ──────────────────────────────────────────────
  skinFair:   [0x7a4a52, 0xb87a6a, 0xe8a887, 0xffd2ac, 0xffe8cc],
  skinWarm:   [0x6a3d44, 0xa06050, 0xcc8a66, 0xefb387, 0xffd7ad],
  skinDeep:   [0x3d2531, 0x6a4038, 0x91604a, 0xb8845f, 0xd9a878],

  // ── Lyra ──────────────────────────────────────────────
  // Route P canon: Lyra's hair is warm solar gold; her outfit is a blue
  // military jacket. These replace the retired royal-violet v2 ramps.
  lyraHair:   [0x5a3512, 0xcc8833, 0xffdd44, 0xffcc33, 0xfff0a0],
  lyraDress:  [0x141a44, 0x223388, 0x3344aa, 0x5f73d0, 0xa8b8ff],
  lyraTrim:   [0x9a6a1a, 0xd9a92a, 0xffd75e, 0xffeea0, 0xfffce0],  // gold trim
  lyraCape:   [0x1a1230, 0x2e2255, 0x4a3a85, 0x6a58b5, 0x9a8ae0],
  lyraEye:    [0x14203d, 0x23527d, 0x44ddff, 0x8ceeff, 0xe7fdff],

  // ── Companions ────────────────────────────────────────
  erynnFur:   [0x2d2438, 0x4d3d55, 0x6f5a78, 0x93789c, 0xb99cc0],  // dusk-violet fur
  erynnSuit:  [0x1a2230, 0x2a3a4d, 0x3d5468, 0x567088, 0x7a92a8],
  erynnAcc:   [0x8a2a3a, 0xc24352, 0xe86a6a, 0xff9a8a, 0xffc8b0],
  brimbleSkin:[0x1f4a33, 0x2e6b44, 0x459158, 0x66b573, 0x94d998],  // pond green
  brimbleBelly:[0x9a8a4a, 0xc4b468, 0xe0d68a, 0xf2e9ad, 0xfcf6d4],
  brimbleRobe:[0x3d3020, 0x5e4a30, 0x7f6642, 0xa08655, 0xc0a870],
  drakkorScale:[0x4d1a1a, 0x7a2a22, 0xa8422a, 0xd06033, 0xf28a4a], // ember scale
  drakkorPlate:[0x2a2530, 0x453f4d, 0x635a6d, 0x847a8f, 0xa89eb3],
  drakkorHorn:[0x8a7a5a, 0xb3a37a, 0xd4c69a, 0xebe0ba, 0xfaf4d8],
  pipShell:   [0x2a3a55, 0x3d5680, 0x5578ab, 0x7a9ed0, 0xa8c8f0],  // cobalt shell
  pipCore:    [0x1a6a6a, 0x2a9a92, 0x44ccb8, 0x77eed4, 0xbafff0],  // teal glow
  pipBrass:   [0x6a4a1a, 0x9a702a, 0xc49a3d, 0xe0c060, 0xf5e090],

  // ── Common materials ──────────────────────────────────
  steel:      [0x2a2d3d, 0x454a60, 0x656c85, 0x8a91a8, 0xb5bccc],
  brass:      [0x5a4015, 0x8a6520, 0xb88f2e, 0xdcb84a, 0xf5dc7a],
  cloth:      [0x2d2233, 0x4a3a52, 0x6a5670, 0x8a7590, 0xac97b0],
  leather:    [0x2d1d14, 0x4a3222, 0x684a32, 0x876445, 0xa8825c],
  wood:       [0x2a1a10, 0x45301c, 0x604828, 0x7d6038, 0x9a7c4c],

  // ── Nova Prime (capital) ──────────────────────────────
  novaStone:  [0x232338, 0x3a3a55, 0x545475, 0x717195, 0x9292b5],  // moonstone paving
  novaWall:   [0x2d2d48, 0x454568, 0x60608c, 0x8080ac, 0xa5a5cc],
  novaGold:   [0x7a5a18, 0xa88028, 0xd0a83a, 0xeeca5e, 0xffe89a],
  novaGlass:  [0x1a3a4d, 0x2a5a75, 0x40809d, 0x60a8c4, 0x90d0e8],
  novaGrass:  [0x1d3a2a, 0x2d573a, 0x3f764a, 0x579758, 0x79b96e],
  novaBloom:  [0x8a2a5a, 0xc24582, 0xe86aa8, 0xff96c8, 0xffc8e0],

  // ── Sky / cosmos ──────────────────────────────────────
  nightSky:   [0x0a0a1f, 0x141433, 0x22224d, 0x333368, 0x4a4a88],
  nebula:     [0x2a1445, 0x45226a, 0x683a92, 0x9058b8, 0xbf80d8],
  starlight:  [0x8a8ab0, 0xb8b8d8, 0xdcdcf0, 0xf2f2fc, 0xffffff],

  // ── Void ──────────────────────────────────────────────
  voidDeep:   [0x0d0616, 0x1c0e2e, 0x2e1a4a, 0x442a66, 0x5e3d85],
  voidGlow:   [0x4d1a6a, 0x7a2a9a, 0xa844c2, 0xd070e0, 0xf0a8f5],
  voidAsh:    [0x16121d, 0x272033, 0x3b324a, 0x4f4560, 0x655a78],

  // ── UI ────────────────────────────────────────────────
  uiFrame:    [0x141026, 0x2b2350, 0x4a3d85, 0x7a68c0, 0xb8a8f0],
  uiGold:     [0x6a4d14, 0x9a7522, 0xc9a132, 0xedcb55, 0xffeda0],
  uiText:     [0x555577, 0x8888aa, 0xbbbbd4, 0xe8e8f4, 0xffffff],
  hp:         [0x5a1a22, 0x8a2a33, 0xc24545, 0xe87a5a, 0xffb080],
  sp:         [0x1a3a5a, 0x2a5a8a, 0x4488c2, 0x66b0e8, 0x99d8ff],
  xp:         [0x3a5a1a, 0x5a8a2a, 0x82b843, 0xaad866, 0xd2f099]
};

// Get css string from hex int
export function css(c) { return '#' + c.toString(16).padStart(6, '0'); }

// Darken/lighten a hex color by factor (-1..1)
export function shade(c, f) {
  let r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  if (f >= 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
  else { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}

// Blend two colors, t 0..1
export function blend(a, b, t) {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  return (Math.round(ar + (br - ar) * t) << 16) |
         (Math.round(ag + (bg - ag) * t) << 8) |
         Math.round(ab + (bb - ab) * t);
}
