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
    },
    // ── interiors ──
    floorWood: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.wood[2]);
      px(g, RAMP.wood[1], 0, 3, T, 1);
      px(g, RAMP.wood[1], 0, 7, T, 1);
      px(g, RAMP.wood[1], 0, 11, T, 1);
      px(g, RAMP.wood[1], 0, 15, T, 1);
      px(g, RAMP.wood[3], 0, 0, T, 1);
      const off = Math.floor(r() * 12);
      px(g, RAMP.wood[1], off, 0, 1, 3);
      px(g, RAMP.wood[1], (off + 8) % 16, 4, 1, 3);
      px(g, RAMP.wood[1], (off + 4) % 16, 8, 1, 3);
      if (r() < 0.3) px(g, RAMP.wood[3], 2 + Math.floor(r() * 10), 5 + Math.floor(r() * 8), 3, 1);
    },
    carpet: (g, seed) => {
      base(g, 0x5a2440);
      px(g, 0x7a3456, 1, 1, 14, 14);
      px(g, RAMP.novaGold[1], 2, 2, 12, 1);
      px(g, RAMP.novaGold[1], 2, 13, 12, 1);
      px(g, RAMP.novaGold[1], 2, 2, 1, 12);
      px(g, RAMP.novaGold[1], 13, 2, 1, 12);
      if (seed % 3 === 0) { px(g, RAMP.novaGold[2], 7, 7, 2, 2); }
    },
    wallInner: (g, seed) => {
      const r = rng(seed);
      base(g, 0x4a3a55);
      px(g, 0x5c4a68, 0, 0, T, 2);
      px(g, 0x3a2d44, 0, 6, T, 1);
      px(g, 0x3a2d44, 0, 12, T, 1);
      px(g, 0x2d2333, 0, 15, T, 1);
      if (r() < 0.35) px(g, RAMP.novaGold[1], 3 + Math.floor(r() * 9), 8, 2, 2);
    },
    shelf: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.wood[1]);
      px(g, RAMP.wood[2], 1, 1, 14, 14);
      px(g, RAMP.wood[0], 1, 5, 14, 1);
      px(g, RAMP.wood[0], 1, 10, 14, 1);
      for (const y of [2, 6, 11]) {
        for (let i = 0; i < 4; i++) {
          if (r() < 0.7) {
            const colors = [0x8ab0d0, 0xc26a5a, 0x8a5aa8, 0x6aa86a, RAMP.brass[3]];
            px(g, colors[Math.floor(r() * colors.length)], 2 + i * 3 + Math.floor(r() * 2), y, 2, 3);
          }
        }
      }
    },
    bed: (g) => {
      base(g, RAMP.wood[1]);
      px(g, RAMP.wood[2], 0, 0, T, 2);
      px(g, 0x8898c0, 1, 2, 14, 13);
      px(g, 0xa8b8e0, 1, 2, 14, 4);
      px(g, 0xf0f0fa, 2, 3, 5, 2);
      px(g, 0x6878a0, 1, 14, 14, 1);
    },
    table: (g) => {
      TILESETS.nova.floorWood(g, 3);
      px(g, RAMP.wood[3], 2, 3, 12, 9);
      px(g, RAMP.wood[4], 2, 3, 12, 2);
      px(g, RAMP.wood[1], 3, 12, 2, 3);
      px(g, RAMP.wood[1], 11, 12, 2, 3);
    },
    stool: (g) => {
      TILESETS.nova.floorWood(g, 5);
      px(g, RAMP.wood[3], 5, 6, 6, 4);
      px(g, RAMP.wood[1], 5, 10, 1, 4);
      px(g, RAMP.wood[1], 10, 10, 1, 4);
    }
  },

  // ── SHATTERED STARGATE — void-fractured gate complex ──
  stargate: {
    floor: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.voidAsh[2]);
      px(g, RAMP.voidAsh[1], 0, 7, T, 1);
      px(g, RAMP.voidAsh[1], 0, 15, T, 1);
      const off = (seed % 2) ? 4 : 11;
      px(g, RAMP.voidAsh[1], off, 0, 1, 7);
      px(g, RAMP.voidAsh[1], (off + 7) % 16, 8, 1, 7);
      px(g, RAMP.voidAsh[3], 0, 0, T, 1);
      if (r() < 0.25) { // void fracture glint
        px(g, RAMP.voidGlow[2], 2 + Math.floor(r() * 11), 2 + Math.floor(r() * 11), 1, 2 + Math.floor(r() * 2));
      }
      if (r() < 0.2) px(g, RAMP.voidAsh[0], 3 + Math.floor(r() * 9), 3 + Math.floor(r() * 9), 3, 1);
    },
    wall: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.voidAsh[1]);
      px(g, RAMP.voidAsh[3], 0, 0, T, 2);
      px(g, RAMP.voidAsh[2], 0, 2, T, 4);
      px(g, RAMP.voidAsh[0], 0, 10, T, 1);
      px(g, RAMP.voidAsh[0], 0, 15, T, 1);
      const vx = 2 + Math.floor(r() * 4) * 4;
      px(g, RAMP.voidAsh[0], vx, 2, 1, 8);
      if (r() < 0.3) px(g, RAMP.voidGlow[1], vx, 5 + Math.floor(r() * 4), 1, 2);
    },
    voidpit: (g, seed) => {
      const r = rng(seed);
      base(g, RAMP.voidDeep[0]);
      for (let i = 0; i < 5; i++) {
        px(g, RAMP.voidDeep[1], Math.floor(r() * 14), Math.floor(r() * 14), 2, 1);
      }
      if (r() < 0.4) px(g, RAMP.voidGlow[1], 3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 1, 1);
    },
    crystal: (g, seed) => {
      TILESETS.stargate.floor(g, seed);
      const r = rng(seed + 3);
      const cx = 5 + Math.floor(r() * 4);
      px(g, RAMP.voidGlow[1], cx, 4, 5, 10);
      px(g, RAMP.voidGlow[2], cx + 1, 2, 3, 12);
      px(g, RAMP.voidGlow[3], cx + 2, 1, 1, 13);
      px(g, RAMP.voidGlow[4], cx + 2, 2, 1, 3);
      px(g, RAMP.voidDeep[1], cx - 1, 13, 7, 2);
    },
    debris: (g, seed) => {
      const r = rng(seed);
      TILESETS.stargate.floor(g, seed);
      for (let i = 0; i < 6; i++) {
        const c = r() < 0.3 ? RAMP.novaGold[1] : RAMP.voidAsh[Math.floor(r() * 2)];
        px(g, c, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 12), 2 + Math.floor(r() * 3), 1 + Math.floor(r() * 2));
      }
    },
    bridge: (g, seed) => {
      base(g, RAMP.voidDeep[0]);
      px(g, RAMP.steel[2], 1, 0, 14, T);
      px(g, RAMP.steel[3], 1, 0, 14, 1);
      px(g, RAMP.steel[1], 1, 5, 14, 1);
      px(g, RAMP.steel[1], 1, 10, 14, 1);
      px(g, RAMP.steel[0], 1, 15, 14, 1);
      px(g, RAMP.steel[0], 1, 0, 1, T);
      px(g, RAMP.steel[0], 14, 0, 1, T);
    },
    console: (g) => {
      TILESETS.stargate.floor(g, 7);
      px(g, RAMP.steel[1], 2, 5, 12, 9);
      px(g, RAMP.steel[2], 2, 5, 12, 3);
      px(g, RAMP.novaGlass[3], 4, 6, 8, 2);
      px(g, RAMP.novaGold[2], 4, 10, 2, 1);
      px(g, 0xc24552, 8, 10, 2, 1);
      px(g, RAMP.novaGlass[2], 11, 10, 1, 1);
    },
    pedestal: (g) => {
      TILESETS.stargate.floor(g, 11);
      px(g, RAMP.novaWall[2], 4, 6, 8, 8);
      px(g, RAMP.novaWall[3], 4, 6, 8, 2);
      px(g, RAMP.novaGold[2], 5, 5, 6, 1);
      px(g, RAMP.novaGold[3], 6, 3, 4, 2);
    },
    barrier: (g, seed) => {
      TILESETS.stargate.floor(g, seed);
      const r = rng(seed + 9);
      for (let y = 0; y < 16; y += 2) {
        px(g, RAMP.voidGlow[2], 6, y, 1, 1);
        px(g, RAMP.voidGlow[3], 9, y + 1, 1, 1);
      }
      px(g, RAMP.voidGlow[1], 7, 0, 2, T);
      if (r() < 0.5) px(g, RAMP.voidGlow[4], 7, Math.floor(r() * 14), 2, 2);
    },
    ringChunk: (g, seed) => {
      TILESETS.stargate.floor(g, seed);
      const r = rng(seed + 13);
      px(g, RAMP.novaGold[1], 3, 4, 10, 8);
      px(g, RAMP.novaGold[2], 3, 4, 10, 3);
      px(g, RAMP.novaGold[0], 3, 10, 10, 2);
      px(g, RAMP.voidGlow[2], 5 + Math.floor(r() * 5), 6, 1, 5);
      px(g, RAMP.voidAsh[0], 3, 12, 10, 1);
    }
  },

  // ── MIRELIGHT DEEPS — drowned marsh world ──────────────
  mirelight: {
    // bog mud floor — dark loam with wet sheen and root fibers
    mud: (g, seed) => {
      const r = rng(seed);
      base(g, 0x3a2d1f);
      px(g, 0x2c2115, 0, 7, T, 1);
      px(g, 0x2c2115, 0, 15, T, 1);
      const off = (seed % 2) ? 4 : 10;
      px(g, 0x2c2115, off, 0, 1, 7);
      px(g, 0x2c2115, (off + 8) % 16, 8, 1, 7);
      px(g, 0x4c3c28, 0, 0, T, 1);
      for (let i = 0; i < 4; i++) {
        if (r() < 0.5) px(g, 0x241a10, 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 2), 1);
      }
      if (r() < 0.3) px(g, 0x5a4a30, 3 + Math.floor(r() * 9), 3 + Math.floor(r() * 9), 2, 1); // wet sheen
    },
    // brackish shallows — pale murky water, ripple lines
    shallows: (g, seed) => {
      const r = rng(seed);
      base(g, 0x2e4038);
      px(g, 0x263630, 0, 0, T, 3);
      for (let i = 0; i < 3; i++) {
        px(g, 0x3c5a4e, Math.floor(r() * 10), 3 + i * 4 + Math.floor(r() * 2), 4 + Math.floor(r() * 6), 1);
      }
      if (r() < 0.4) px(g, 0x5a8a76, 2 + Math.floor(r() * 10), 2 + Math.floor(r() * 10), 2, 1);
      px(g, 0x1e2c26, 0, 15, T, 1);
    },
    // deep black water — near-black with faint bioluminescent glints
    deepwater: (g, seed) => {
      const r = rng(seed);
      base(g, 0x0a1614);
      px(g, 0x0e1e1a, 0, 0, T, 6);
      for (let i = 0; i < 3; i++) {
        if (r() < 0.6) px(g, 0x2a9a92, Math.floor(r() * 14), Math.floor(r() * 14), 1, 1);
      }
      if (r() < 0.3) px(g, 0x44ccb8, 6 + Math.floor(r() * 4), 6 + Math.floor(r() * 4), 1, 1);
      px(g, 0x060e0c, 0, 15, T, 1);
    },
    // marsh wall — waterlogged rotted stone/root mass, solid
    mireWall: (g, seed) => {
      const r = rng(seed);
      base(g, 0x293a30);
      px(g, 0x1e2c24, 0, 0, T, 2);
      px(g, 0x152018, 0, 6, T, 1);
      px(g, 0x152018, 0, 12, T, 1);
      px(g, 0x0e1610, 0, 15, T, 1);
      const vx = 3 + Math.floor(r() * 3) * 4;
      px(g, 0x152018, vx, 3, 1, 10);
      if (r() < 0.35) px(g, 0x3d5b47, 2 + Math.floor(r() * 11), 4 + Math.floor(r() * 8), 2, 1); // moss patch
    },
    // reed clumps over mud
    reed: (g, seed) => {
      const r = rng(seed);
      TILESETS.mirelight.mud(g, seed);
      for (let i = 0; i < 5; i++) {
        const x = 2 + Math.floor(r() * 12);
        const h = 6 + Math.floor(r() * 6);
        px(g, 0x3f764a, x, 14 - h, 1, h);
        px(g, 0x579758, x, 14 - h, 1, 2);
      }
      if (r() < 0.3) px(g, 0x94d998, 3 + Math.floor(r() * 9), 4 + Math.floor(r() * 4), 1, 1);
    },
    // lilypad floating on shallows
    lilypad: (g, seed) => {
      TILESETS.mirelight.shallows(g, seed);
      const r = rng(seed + 5);
      const cx = 5 + Math.floor(r() * 4), cy = 5 + Math.floor(r() * 4);
      px(g, 0x2f6b3a, cx, cy, 6, 5);
      px(g, 0x3f8a4a, cx, cy, 6, 2);
      px(g, 0x1e4a28, cx + 2, cy + 2, 2, 1);
      if (r() < 0.4) px(g, 0xc26a8a, cx + 2, cy - 1, 2, 1); // bloom
    },
    // void-corrupted coral growth, solid
    coral: (g, seed) => {
      const r = rng(seed);
      TILESETS.mirelight.mud(g, seed);
      px(g, 0x2e1a3a, 4, 3, 8, 11);
      px(g, 0x452a55, 5, 2, 6, 3);
      px(g, 0x6a3d78, 6, 1, 2, 3);
      px(g, 0x6a3d78, 9, 2, 2, 4);
      if (r() < 0.5) px(g, 0xa844c2, 6 + Math.floor(r() * 4), 3 + Math.floor(r() * 4), 1, 1);
      px(g, 0x1e1028, 4, 13, 8, 1);
    },
    // rotted plank bridge over water
    bridge: (g, seed) => {
      const r = rng(seed);
      base(g, 0x2c2115);
      px(g, RAMP.wood[2], 0, 1, T, 13);
      px(g, RAMP.wood[3], 0, 1, T, 2);
      px(g, RAMP.wood[1], 0, 6, T, 1);
      px(g, RAMP.wood[1], 0, 11, T, 1);
      px(g, 0x1c140c, 0, 0, T, 1);
      px(g, 0x1c140c, 0, 14, T, 2);
      if (r() < 0.3) px(g, 0x0e1610, 3 + Math.floor(r() * 9), 3 + Math.floor(r() * 6), 2, 1); // rot hole
    },
    // drowned-ruin rubble, solid
    ruin: (g, seed) => {
      const r = rng(seed);
      TILESETS.mirelight.mud(g, seed);
      for (let i = 0; i < 6; i++) {
        const c = [0x4a4a52, 0x3a3a42, 0x5c5c66][Math.floor(r() * 3)];
        px(g, c, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 12), 2 + Math.floor(r() * 3), 2 + Math.floor(r() * 2));
      }
      if (r() < 0.3) px(g, 0x2f6b3a, 2 + Math.floor(r() * 9), 2 + Math.floor(r() * 9), 2, 1); // moss creeping over stone
      px(g, 0x232328, 3, 13, 9, 1);
    },
    // corroded tide-lever mechanism, solid
    tideLever: (g) => {
      TILESETS.mirelight.mud(g, 3);
      px(g, 0x3a4a4a, 6, 2, 4, 12);
      px(g, 0x5a6e6e, 7, 2, 2, 12);
      px(g, 0x2a9a92, 7, 3, 2, 2);
      px(g, RAMP.brass[2], 4, 9, 8, 2);
      px(g, RAMP.brass[1], 4, 9, 8, 1);
      px(g, 0x1e2626, 6, 13, 4, 2);
    },
    // mossy throne stone for boss arena, solid
    throneStone: (g, seed) => {
      const r = rng(seed);
      base(g, 0x3d4a42);
      px(g, 0x2e3a34, 0, 0, T, 2);
      px(g, 0x2e3a34, 0, 13, T, 3);
      px(g, 0x4d5c52, 0, 2, T, 1);
      for (let i = 0; i < 4; i++) {
        if (r() < 0.6) px(g, 0x3f764a, 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 13), 2, 1); // moss
      }
      if (r() < 0.3) px(g, 0x44ccb8, 6 + Math.floor(r() * 4), 6 + Math.floor(r() * 4), 1, 1); // faint glow vein
      px(g, 0x232b26, 3, 12, 10, 1);
    }
  },

  // ── ASHFALL DOMINION — scorched volcanic Drakonid homeland ──
  ashfall: {
    // ash-grey wall — cracked volcanic rock, solid
    ashWall: (g, seed) => {
      const r = rng(seed);
      base(g, 0x3a3530);
      px(g, 0x2a2622, 0, 0, T, 2);
      px(g, 0x241f1c, 0, 6, T, 1);
      px(g, 0x241f1c, 0, 12, T, 1);
      px(g, 0x181513, 0, 15, T, 1);
      const vx = 3 + Math.floor(r() * 3) * 4;
      px(g, 0x241f1c, vx, 3, 1, 10);
      if (r() < 0.35) px(g, RAMP.drakkorScale[3], 2 + Math.floor(r() * 11), 4 + Math.floor(r() * 8), 2, 1); // ember crack glow
    },
    // ash floor — pale grey volcanic dust, soft footing
    ash: (g, seed) => {
      const r = rng(seed);
      base(g, 0x5a5450);
      px(g, 0x4d473f, 0, 7, T, 1);
      px(g, 0x4d473f, 0, 15, T, 1);
      const off = (seed % 2) ? 4 : 10;
      px(g, 0x4d473f, off, 0, 1, 7);
      px(g, 0x4d473f, (off + 8) % 16, 8, 1, 7);
      px(g, 0x6e6660, 0, 0, T, 1);
      for (let i = 0; i < 4; i++) {
        if (r() < 0.5) px(g, 0x726a62, 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 2), 1);
      }
      if (r() < 0.3) px(g, 0x83786e, 3 + Math.floor(r() * 9), 3 + Math.floor(r() * 9), 2, 1); // pale drift
    },
    // cinder floor — darker charred ground, scattered soot flecks
    cinder: (g, seed) => {
      const r = rng(seed);
      base(g, 0x3f3a36);
      px(g, 0x332e2a, 0, 0, T, 3);
      for (let i = 0; i < 3; i++) {
        px(g, 0x2b2622, Math.floor(r() * 10), 3 + i * 4 + Math.floor(r() * 2), 4 + Math.floor(r() * 6), 1);
      }
      if (r() < 0.4) px(g, RAMP.drakkorScale[2], 2 + Math.floor(r() * 10), 2 + Math.floor(r() * 10), 1, 1); // stray ember fleck
      px(g, 0x211d1a, 0, 15, T, 1);
    },
    // ember tile — glowing hazard, walkable, radiant orange cracks
    ember: (g, seed) => {
      const r = rng(seed);
      TILESETS.ashfall.cinder(g, seed);
      px(g, RAMP.drakkorScale[1], 3, 8, 10, 2);
      px(g, RAMP.drakkorScale[2], 4, 8, 8, 1);
      px(g, RAMP.drakkorScale[3], 6, 7, 4, 1);
      px(g, RAMP.drakkorScale[4], 7, 7, 2, 1);
      if (r() < 0.5) px(g, RAMP.drakkorScale[4], 5 + Math.floor(r() * 6), 9, 1, 1); // bright glint
      px(g, 0x1c1815, 0, 15, T, 1);
    },
    // cooled ember — same crack pattern but dim, ashen, safe
    emberCooled: (g, seed) => {
      const r = rng(seed);
      TILESETS.ashfall.cinder(g, seed);
      px(g, 0x4a3a30, 3, 8, 10, 2);
      px(g, 0x5c4a3c, 4, 8, 8, 1);
      px(g, 0x342a24, 6, 7, 4, 1);
      if (r() < 0.4) px(g, 0x6a5648, 5 + Math.floor(r() * 6), 9, 1, 1);
    },
    // magma-slag blockage, solid — dark obsidian ridge with hot seams
    slag: (g, seed) => {
      const r = rng(seed);
      base(g, 0x1c1816);
      px(g, 0x110d0c, 0, 0, T, 2);
      for (let i = 0; i < 5; i++) {
        const c = [0x241f1c, 0x2c2622, 0x140f0d][Math.floor(r() * 3)];
        px(g, c, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 12), 2 + Math.floor(r() * 3), 2 + Math.floor(r() * 2));
      }
      px(g, RAMP.drakkorScale[2], 3, 9, 9, 1); // molten seam
      px(g, RAMP.drakkorScale[3], 5, 9, 4, 1);
      if (r() < 0.4) px(g, RAMP.drakkorScale[4], 6 + Math.floor(r() * 4), 9, 1, 1);
      px(g, 0x0c0908, 0, 15, T, 1);
    },
    // geyser vent — decorative steam, walkable
    geyser: (g, seed) => {
      const r = rng(seed);
      TILESETS.ashfall.ash(g, seed);
      px(g, 0x2c2723, 5, 10, 6, 4);
      px(g, 0x1c1815, 6, 11, 4, 3);
      px(g, 0xc8c0b6, 6, 4, 4, 6); // steam plume
      px(g, 0xe4ded6, 7, 2, 2, 4);
      if (r() < 0.5) px(g, 0xf2eee8, 7 + Math.floor(r() * 2), 1, 1, 2);
    },
    // vent valve post — puzzle interactive, solid
    ventValve: (g) => {
      TILESETS.ashfall.ash(g, 3);
      px(g, 0x453f3a, 6, 2, 4, 12);
      px(g, 0x635a52, 7, 2, 2, 12);
      px(g, RAMP.drakkorScale[2], 7, 3, 2, 2);
      px(g, RAMP.brass[2], 4, 9, 8, 2);
      px(g, RAMP.brass[1], 4, 9, 8, 1);
      px(g, 0x1e1a17, 6, 13, 4, 2);
    },
    // Drakonid banner post — crimson/bronze standard, solid, decorative
    bannerPost: (g) => {
      TILESETS.ashfall.ash(g, 4);
      px(g, RAMP.wood[1], 7, 4, 2, 12); // pole
      px(g, RAMP.wood[2], 7, 4, 1, 12);
      px(g, RAMP.drakkorScale[1], 3, 2, 9, 7); // crimson banner cloth
      px(g, RAMP.drakkorScale[2], 3, 2, 9, 2);
      px(g, RAMP.drakkorHorn[2], 5, 4, 5, 2); // bronze emblem band
      px(g, RAMP.drakkorHorn[1], 3, 8, 9, 1);
      px(g, 0x1e1a17, 6, 15, 4, 1);
    },
    // ruined Drakonid hold walls, solid — scorched masonry rubble
    ruinedHold: (g, seed) => {
      const r = rng(seed);
      TILESETS.ashfall.ash(g, seed);
      for (let i = 0; i < 6; i++) {
        const c = [0x5a5148, 0x453f38, 0x6c635a][Math.floor(r() * 3)];
        px(g, c, 1 + Math.floor(r() * 12), 1 + Math.floor(r() * 12), 2 + Math.floor(r() * 3), 2 + Math.floor(r() * 2));
      }
      if (r() < 0.3) px(g, RAMP.drakkorScale[2], 2 + Math.floor(r() * 9), 2 + Math.floor(r() * 9), 2, 1); // scorch mark
      px(g, 0x2a2622, 3, 13, 9, 1);
    },
    // throne-ash dais — dark scorched stone for boss arena, solid
    throneAsh: (g, seed) => {
      const r = rng(seed);
      base(g, 0x453d38);
      px(g, 0x342e2a, 0, 0, T, 2);
      px(g, 0x342e2a, 0, 13, T, 3);
      px(g, 0x5c5148, 0, 2, T, 1);
      for (let i = 0; i < 4; i++) {
        if (r() < 0.6) px(g, RAMP.drakkorScale[2], 1 + Math.floor(r() * 13), 1 + Math.floor(r() * 13), 2, 1); // ember vein
      }
      if (r() < 0.3) px(g, RAMP.drakkorScale[4], 6 + Math.floor(r() * 4), 6 + Math.floor(r() * 4), 1, 1); // glow fleck
      px(g, 0x282320, 3, 12, 10, 1);
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
