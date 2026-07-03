// ═══════════════════════════════════════════════════════════════
// TILES — Region tileset painters. Each painter draws one 16×16
// tile into a Graphics at (0,0). Variants keep large floors from
// repeating visibly. Baked once at boot per map's needs.
// Texture key: t_<set>_<name>_<v>
// ═══════════════════════════════════════════════════════════════

import { RAMP } from './palette.js';
import { rng, dither } from './pixel.js';

const T = 16;

// Painters draw in tile-local coordinates; OX/OY let a whole map be
// baked into one texture without Graphics canvas transforms.
let OX = 0, OY = 0;
export function setTileOffset(x, y) { OX = x; OY = y; }

function base(g, c) { g.fillStyle(c, 1); g.fillRect(OX, OY, T, T); }
function px(g, c, x, y, w = 1, h = 1) { g.fillStyle(c, 1); g.fillRect(OX + x, OY + y, w, h); }
function dith(g, x, y, w, h, c1, c2) { dither(g, OX + x, OY + y, w, h, c1, c2); }

// ── NOVA PRIME — moonstone capital ─────────────────────
const NS = RAMP.novaStone, NW = RAMP.novaWall, NG = RAMP.novaGold, NGr = RAMP.novaGrass;

export const TILESETS = {
  nova: {
    // polished paving with subtle seams and star flecks
    floor: (g, seed) => {
      const r = rng(seed);
      base(g, NS[2]);
      // stone seams every 8px, offset rows
      px(g, NS[1], 0, 7, T, 1);
      px(g, NS[1], 0, 15, T, 1);
      const off = (seed % 2) ? 4 : 10;
      px(g, NS[1], off, 0, 1, 7);
      px(g, NS[1], (off + 8) % 16, 8, 1, 7);
      // highlight top edges of slabs
      px(g, NS[3], 0, 0, T, 1);
      px(g, NS[3], 0, 8, T, 1);
      // occasional star fleck
      for (let i = 0; i < 3; i++) {
        if (r() < 0.25) px(g, NS[4], 2 + Math.floor(r() * 12), 2 + Math.floor(r() * 12), 1, 1);
      }
      if (r() < 0.15) px(g, NS[0], 3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 2, 1); // chip
    },
    // ornate rosette accent tile (gold diamond inlay, subtle)
    inlay: (g, seed) => {
      TILESETS.nova.floor(g, seed);
      // gold diamond outline with cardinal points
      px(g, NG[2], 7, 2, 2, 1); px(g, NG[2], 7, 13, 2, 1);
      px(g, NG[2], 2, 7, 1, 2); px(g, NG[2], 13, 7, 1, 2);
      px(g, NG[1], 5, 4, 1, 1); px(g, NG[1], 10, 4, 1, 1);
      px(g, NG[1], 4, 5, 1, 1); px(g, NG[1], 11, 5, 1, 1);
      px(g, NG[1], 4, 10, 1, 1); px(g, NG[1], 11, 10, 1, 1);
      px(g, NG[1], 5, 11, 1, 1); px(g, NG[1], 10, 11, 1, 1);
      px(g, NG[3], 7, 7, 2, 2);
    },
    // processional path (vertical) — lighter slabs, gold edge fillets
    pathV: (g, seed) => {
      const r = rng(seed);
      base(g, NS[3]);
      px(g, NS[2], 0, 7, T, 1);
      px(g, NS[2], 0, 15, T, 1);
      px(g, NS[4], 0, 0, T, 1);
      px(g, NS[4], 0, 8, T, 1);
      const off = (seed % 2) ? 5 : 11;
      px(g, NS[2], off, 0, 1, 7);
      px(g, NS[2], (off + 7) % 16, 8, 1, 7);
      // continuous gold fillets at edges
      px(g, NG[1], 1, 0, 1, T);
      px(g, NG[1], 14, 0, 1, T);
      if (r() < 0.35) px(g, NG[2], 1, Math.floor(r() * 14), 1, 2);
      if (r() < 0.35) px(g, NG[2], 14, Math.floor(r() * 14), 1, 2);
    },
    // building wall — pale violet steel with panel lines
    wall: (g, seed) => {
      const r = rng(seed);
      base(g, NW[2]);
      px(g, NW[3], 0, 0, T, 2);
      px(g, NW[1], 0, 6, T, 1);
      px(g, NW[1], 0, 12, T, 1);
      px(g, NW[0], 0, 15, T, 1);
      const vx = 3 + Math.floor(r() * 3) * 4;
      px(g, NW[1], vx, 7, 1, 5);
      if (r() < 0.3) px(g, NW[3], 2 + Math.floor(r() * 11), 8 + Math.floor(r() * 3), 2, 1);
    },
    // wall top / roofline trim
    wallTop: (g) => {
      base(g, NW[1]);
      px(g, NG[2], 0, 12, T, 2);
      px(g, NG[3], 0, 12, T, 1);
      px(g, NW[0], 0, 15, T, 1);
      px(g, NW[3], 0, 0, T, 4);
      px(g, NW[2], 0, 4, T, 8);
    },
    // damaged wall (post-attack)
    wallCracked: (g, seed) => {
      TILESETS.nova.wall(g, seed);
      const r = rng(seed + 77);
      px(g, NW[0], 4, 2, 1, 4);
      px(g, NW[0], 5, 5, 1, 3);
      px(g, NW[0], 6, 8, 1, 2);
      px(g, NW[0], 5 + Math.floor(r() * 4), 10, 1, 3);
      px(g, NW[0], 10, 3, 2, 1);
    },
    // glass window (glow)
    window: (g) => {
      base(g, NW[2]);
      px(g, NW[1], 2, 2, 12, 12);
      px(g, RAMP.novaGlass[2], 3, 3, 10, 10);
      px(g, RAMP.novaGlass[3], 3, 3, 10, 2);
      px(g, RAMP.novaGlass[4], 4, 4, 3, 1);
      px(g, NW[1], 7, 3, 1, 10);
      px(g, NW[1], 3, 8, 10, 1);
    },
    door: (g) => {
      base(g, NW[1]);
      px(g, RAMP.wood[1], 2, 1, 12, 15);
      px(g, RAMP.wood[2], 3, 2, 10, 13);
      px(g, RAMP.wood[3], 3, 2, 10, 1);
      px(g, NG[2], 11, 8, 2, 2);
      px(g, RAMP.wood[1], 7, 2, 1, 13);
    },
    grass: (g, seed) => {
      const r = rng(seed);
      base(g, NGr[2]);
      for (let i = 0; i < 14; i++) {
        const c = [NGr[1], NGr[3], NGr[2], NGr[2]][Math.floor(r() * 4)];
        px(g, c, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1 + (r() < 0.3 ? 1 : 0));
      }
      if (r() < 0.2) px(g, RAMP.novaBloom[3], 3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 1, 1);
    },
    // grass-to-paving edge (grass at top)
    grassEdgeN: (g, seed) => {
      TILESETS.nova.floor(g, seed);
      const r = rng(seed + 5);
      px(g, NGr[2], 0, 0, T, 4);
      px(g, NGr[1], 0, 4, T, 1);
      for (let x = 0; x < 16; x += 2) {
        if (r() < 0.6) px(g, NGr[2], x, 5, 1, 1);
      }
    },
    water: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.novaGlass[1]);
      px(g, RAMP.novaGlass[2], 0, 0, T, 5);
      for (let i = 0; i < 4; i++) {
        px(g, RAMP.novaGlass[3], Math.floor(r() * 12), 2 + Math.floor(r() * 11), 2 + Math.floor(r() * 3), 1);
      }
      px(g, RAMP.novaGlass[4], 2 + Math.floor(r() * 8), 1, 3, 1);
    },
    fountainRim: (g) => {
      TILESETS.nova.floor(g, 3);
      px(g, NW[3], 1, 1, 14, 14);
      px(g, NW[2], 2, 2, 12, 12);
      px(g, RAMP.novaGlass[2], 3, 3, 10, 10);
      px(g, RAMP.novaGlass[3], 3, 3, 10, 3);
      px(g, NG[2], 1, 1, 14, 1);
    },
    rubble: (g, seed) => {
      const r = rng(seed);
      TILESETS.nova.floor(g, seed);
      for (let i = 0; i < 7; i++) {
        const c = [NW[0], NW[1], NS[1]][Math.floor(r() * 3)];
        px(g, c, 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 3), 1 + Math.floor(r() * 2));
      }
      px(g, RAMP.voidAsh[2], 2 + Math.floor(r() * 9), 2 + Math.floor(r() * 9), 3, 1);
    },
    // dark void scorch (attack scar)
    scorch: (g, seed) => {
      const r = rng(seed);
      TILESETS.nova.floor(g, seed);
      dith(g, 3, 3, 10, 10, RAMP.voidAsh[1], RAMP.voidAsh[0]);
      px(g, RAMP.voidGlow[1], 6 + Math.floor(r() * 3), 6 + Math.floor(r() * 3), 2, 1);
    },
    planter: (g) => {
      TILESETS.nova.floor(g, 9);
      px(g, NW[1], 1, 3, 14, 12);
      px(g, NW[3], 1, 3, 14, 2);
      px(g, NGr[2], 3, 5, 10, 8);
      px(g, NGr[3], 3, 5, 10, 2);
      px(g, RAMP.novaBloom[3], 5, 6, 2, 2);
      px(g, RAMP.novaBloom[2], 9, 8, 2, 2);
      px(g, RAMP.novaBloom[4], 6, 9, 1, 1);
    },
    lamp: (g) => {
      TILESETS.nova.floor(g, 4);
      px(g, NW[1], 7, 3, 2, 11);
      px(g, NW[3], 7, 3, 1, 11);
      px(g, NG[3], 5, 1, 6, 3);
      px(g, NG[4], 6, 1, 4, 2);
      px(g, NW[1], 5, 13, 6, 2);
    },
    counter: (g) => {
      base(g, RAMP.wood[2]);
      px(g, RAMP.wood[3], 0, 0, T, 3);
      px(g, RAMP.wood[4], 0, 0, T, 1);
      px(g, RAMP.wood[1], 0, 12, T, 4);
      px(g, RAMP.wood[2], 2, 5, 1, 6);
      px(g, RAMP.wood[2], 9, 4, 1, 7);
    }
  }
};

// Bake a tile variant texture, returns key.
export function tileKey(scene, set, name, variant = 0) {
  const key = `t_${set}_${name}_${variant}`;
  if (!scene.textures.exists(key)) {
    const painter = TILESETS[set] && TILESETS[set][name];
    if (!painter) return null;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    setTileOffset(0, 0);
    painter(g, variant * 131 + 7);
    g.generateTexture(key, T, T);
    g.destroy();
  }
  return key;
}
