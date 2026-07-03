// ═══════════════════════════════════════════════════════════════
// PIXEL — Authored pixel-grid rendering pipeline
//
// Art is authored as arrays of strings ("grids"). Each character
// indexes a color in a char→color map; '.' and ' ' are transparent.
// Grids are drawn to Phaser Graphics and baked to textures once at
// boot. Nearest-neighbor discipline: every pixel is placed by hand
// or by deterministic authored rules — no smoothing, no scaling of
// raster data.
// ═══════════════════════════════════════════════════════════════

// Draw a grid onto a Graphics object at (ox, oy), 1 grid cell = px pixels.
export function drawGrid(g, grid, map, ox = 0, oy = 0, px = 1, flipX = false) {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[flipX ? row.length - 1 - x : x];
      if (ch === '.' || ch === ' ') continue;
      const c = map[ch];
      if (c === undefined) continue;
      g.fillStyle(c, 1);
      g.fillRect(ox + x * px, oy + y * px, px, px);
    }
  }
}

// Bake a single grid to a texture.
export function gridTexture(scene, key, grid, map, px = 1) {
  if (scene.textures.exists(key)) return;
  const w = Math.max(...grid.map(r => r.length)) * px;
  const h = grid.length * px;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  drawGrid(g, grid, map, 0, 0, px);
  g.generateTexture(key, w, h);
  g.destroy();
}

// Bake layered composition to texture. layers: [{grid, map, x, y, px, flipX}]
export function composeTexture(scene, key, w, h, layers) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  for (const L of layers) {
    drawGrid(g, L.grid, L.map, L.x || 0, L.y || 0, L.px || 1, !!L.flipX);
  }
  g.generateTexture(key, w, h);
  g.destroy();
}

// Bake using a painter callback: fn(g) draws with Graphics API.
export function paintTexture(scene, key, w, h, fn) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

// Mirror a grid horizontally (returns new grid).
export function mirror(grid) {
  return grid.map(r => r.split('').reverse().join(''));
}

// Stack grids vertically (same width assumed).
export function stack(...grids) {
  return [].concat(...grids);
}

// Replace characters in a grid via {from: to} table (costume variants).
export function recolorGrid(grid, table) {
  return grid.map(r => r.split('').map(ch => table[ch] || ch).join(''));
}

// Deterministic PRNG for authored-noise (tile variation) — mulberry32.
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fill a rect with 2-color ordered dither (checker) — used sparingly.
export function dither(g, x, y, w, h, c1, c2) {
  g.fillStyle(c1, 1);
  g.fillRect(x, y, w, h);
  g.fillStyle(c2, 1);
  for (let yy = 0; yy < h; yy++) {
    for (let xx = (yy % 2); xx < w; xx += 2) {
      g.fillRect(x + xx, y + yy, 1, 1);
    }
  }
}

// px-rect helper
export function pr(g, c, x, y, w = 1, h = 1) {
  g.fillStyle(c, 1);
  g.fillRect(x, y, w, h);
}
