// ═══════════════════════════════════════════════════════════════
// BATTLE ART — Bakes combat sprites (heroes/enemies) and paints
// regional battle backdrops. Hero/enemy grid data is authored in
// art/battle/*.js; this module tolerates their absence by falling
// back to exploration sprites so combat stays testable.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { drawGrid, rng } from './pixel.js';
import { RAMP, blend } from './palette.js';

import { BATTLE_HEROES } from './battle/heroes.js';
import { BATTLE_ENEMIES } from './battle/enemies.js';

export async function loadBattleArt() { /* art is statically imported now */ }

// Base 7 (shipped) + ART_VISION.md §3.2 B2/B3/B6/B8/B10/B12 gap-fill poses.
// Missing per-hero entries fall back to 'idle' (see buildHeroBattleTexture) so this
// list can grow ahead of full per-hero authoring without breaking existing heroes.
export const HERO_POSES = [
  'idle', 'step', 'attack', 'cast', 'hit', 'ko', 'victory',
  'windup', 'signature', 'critical', 'defend', 'itemUse'
];

// Bake hero battle textures: bh_<id> with pose frames. Returns true if authored art used.
export function buildHeroBattleTexture(scene, id) {
  const key = 'bh_' + id;
  if (scene.textures.exists(key)) return true;
  const def = BATTLE_HEROES && BATTLE_HEROES[id];
  if (!def) return false;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  HERO_POSES.forEach((pose, i) => {
    const grid = def.poses[pose] || def.poses.idle;
    drawGrid(g, grid, def.map, i * def.w, 0, 1);
  });
  g.generateTexture(key, def.w * HERO_POSES.length, def.h);
  g.destroy();
  const tex = scene.textures.get(key);
  HERO_POSES.forEach((pose, i) => tex.add(pose, 0, i * def.w, 0, def.w, def.h));
  return true;
}

export function buildEnemyBattleTexture(scene, id) {
  const key = 'be_' + id;
  if (scene.textures.exists(key)) return true;
  const def = BATTLE_ENEMIES && BATTLE_ENEMIES[id];
  if (!def) return false;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  drawGrid(g, def.grid, def.map, 0, 0, 1);
  g.generateTexture(key, def.w, def.h);
  g.destroy();
  return true;
}

export function enemySpriteSize(id) {
  const def = BATTLE_ENEMIES && BATTLE_ENEMIES[id];
  return def ? { w: def.w, h: def.h } : { w: 40, h: 40 };
}

// ── Battle backdrops ───────────────────────────────────
// Painted 640×200 panorama above the command area.
const BG_H = 232;

const BACKDROPS = {
  nova: (g, r) => {
    // night sky over damaged capital skyline
    for (let i = 0; i < 6; i++) {
      g.fillStyle(blend(RAMP.nightSky[0], RAMP.nightSky[3], i / 6), 1);
      g.fillRect(0, Math.floor(BG_H * i / 6) - 40, GAME_W, Math.ceil(BG_H / 6) + 1);
    }
    for (let i = 0; i < 90; i++) {
      g.fillStyle(RAMP.starlight[Math.floor(r() * 3) + 1], 1);
      g.fillRect(Math.floor(r() * GAME_W), Math.floor(r() * BG_H * 0.6), 1, 1);
    }
    // skyline silhouettes
    for (let x = 0; x < GAME_W;) {
      const w = 30 + Math.floor(r() * 50);
      const h = 40 + Math.floor(r() * 70);
      g.fillStyle(RAMP.novaWall[0], 1);
      g.fillRect(x, BG_H - 60 - h, w, h);
      g.fillStyle(RAMP.novaWall[1], 1);
      g.fillRect(x, BG_H - 60 - h, 3, h);
      // lit windows
      for (let k = 0; k < 6; k++) {
        if (r() < 0.5) {
          g.fillStyle(RAMP.novaGold[3], 1);
          g.fillRect(x + 4 + Math.floor(r() * (w - 8)), BG_H - 60 - h + 6 + Math.floor(r() * (h - 12)), 2, 2);
        }
      }
      x += w + 4;
    }
    // plaza ground
    g.fillStyle(RAMP.novaStone[1], 1); g.fillRect(0, BG_H - 60, GAME_W, 60);
    g.fillStyle(RAMP.novaStone[2], 1); g.fillRect(0, BG_H - 60, GAME_W, 3);
    for (let i = 0; i < 20; i++) {
      g.fillStyle(RAMP.novaStone[0], 1);
      g.fillRect(Math.floor(r() * GAME_W), BG_H - 54 + Math.floor(r() * 50), 14 + Math.floor(r() * 20), 1);
    }
  },
  stargate: (g, r) => {
    for (let i = 0; i < 6; i++) {
      g.fillStyle(blend(RAMP.voidDeep[0], RAMP.voidDeep[3], i / 6), 1);
      g.fillRect(0, Math.floor(BG_H * i / 6) - 30, GAME_W, Math.ceil(BG_H / 6) + 1);
    }
    // fractured gate ring in the distance
    const cx = GAME_W / 2, cy = 90, rad = 70;
    for (let a = 0; a < Math.PI * 2; a += 0.05) {
      if (r() < 0.85) {
        const x = Math.round(cx + Math.cos(a) * rad), y = Math.round(cy + Math.sin(a) * rad * 0.8);
        g.fillStyle(a > 1.2 && a < 2.0 ? RAMP.voidGlow[2] : RAMP.novaGold[1], 1);
        g.fillRect(x, y, 3, 3);
      }
    }
    // void cracks in the air
    for (let i = 0; i < 8; i++) {
      let x = Math.floor(r() * GAME_W), y = Math.floor(r() * 120);
      g.fillStyle(RAMP.voidGlow[3], 0.8);
      for (let s = 0; s < 10; s++) {
        g.fillRect(x, y, 1, 2);
        x += Math.floor(r() * 5) - 2; y += 2;
      }
    }
    g.fillStyle(RAMP.voidAsh[1], 1); g.fillRect(0, BG_H - 56, GAME_W, 56);
    g.fillStyle(RAMP.voidAsh[2], 1); g.fillRect(0, BG_H - 56, GAME_W, 3);
    for (let i = 0; i < 26; i++) {
      g.fillStyle(r() < 0.3 ? RAMP.voidGlow[1] : RAMP.voidAsh[0], 1);
      g.fillRect(Math.floor(r() * GAME_W), BG_H - 50 + Math.floor(r() * 44), 8 + Math.floor(r() * 16), 1);
    }
  },
  mire: (g, r) => {
    for (let i = 0; i < 6; i++) {
      g.fillStyle(blend(0x0c2018, 0x1d4a3a, i / 6), 1);
      g.fillRect(0, Math.floor(BG_H * i / 6) - 30, GAME_W, Math.ceil(BG_H / 6) + 1);
    }
    // hanging bio-lights
    for (let i = 0; i < 40; i++) {
      g.fillStyle(i % 3 ? 0x44ccb8 : 0x94d998, 0.9);
      g.fillRect(Math.floor(r() * GAME_W), Math.floor(r() * 120), 1, 1 + Math.floor(r() * 2));
    }
    // water ground with reflections
    g.fillStyle(0x123528, 1); g.fillRect(0, BG_H - 60, GAME_W, 60);
    for (let i = 0; i < 30; i++) {
      g.fillStyle(blend(0x1d4a3a, 0x44ccb8, r() * 0.5), 0.8);
      g.fillRect(Math.floor(r() * GAME_W), BG_H - 55 + Math.floor(r() * 48), 10 + Math.floor(r() * 24), 1);
    }
  },
  ashfall: (g, r) => {
    for (let i = 0; i < 6; i++) {
      g.fillStyle(blend(0x1a0d0d, 0x4d2018, i / 6), 1);
      g.fillRect(0, Math.floor(BG_H * i / 6) - 30, GAME_W, Math.ceil(BG_H / 6) + 1);
    }
    // distant volcano glow
    g.fillStyle(0xa8422a, 0.9);
    for (let x = 200; x < 440; x++) {
      const h = 60 - Math.abs(x - 320) * 0.4 + r() * 4;
      if (h > 0) g.fillRect(x, Math.round(150 - h), 1, Math.round(h));
    }
    g.fillStyle(0xf28a4a, 1); g.fillRect(314, 88, 12, 3);
    // drifting embers
    for (let i = 0; i < 30; i++) {
      g.fillStyle(r() < 0.5 ? 0xf28a4a : 0xd06033, 1);
      g.fillRect(Math.floor(r() * GAME_W), Math.floor(r() * 140), 1, 1);
    }
    g.fillStyle(0x272033, 1); g.fillRect(0, BG_H - 58, GAME_W, 58);
    for (let i = 0; i < 24; i++) {
      g.fillStyle(r() < 0.25 ? 0xa8422a : 0x16121d, 1);
      g.fillRect(Math.floor(r() * GAME_W), BG_H - 52 + Math.floor(r() * 46), 10 + Math.floor(r() * 18), 1);
    }
  },
  kessari: (g, r) => {
    // warm sandstone trade-port skyline at dusk
    for (let i = 0; i < 6; i++) {
      g.fillStyle(blend(0x3a1a2a, 0xe8a04a, i / 6), 1);
      g.fillRect(0, Math.floor(BG_H * i / 6) - 30, GAME_W, Math.ceil(BG_H / 6) + 1);
    }
    // low dusk sun
    g.fillStyle(0xffd166, 0.9);
    g.fillRect(300, 70, 40, 40);
    g.fillStyle(0xffe89a, 0.9);
    g.fillRect(310, 80, 20, 20);
    // sandstone bazaar skyline silhouettes with domed roofs and awnings
    for (let x = 0; x < GAME_W;) {
      const w = 26 + Math.floor(r() * 46);
      const h = 34 + Math.floor(r() * 60);
      g.fillStyle(0x6b4a2a, 1);
      g.fillRect(x, BG_H - 58 - h, w, h);
      g.fillStyle(0x8c6b3c, 1);
      g.fillRect(x, BG_H - 58 - h, 3, h);
      // domed roof cap
      g.fillStyle(0x9a7522, 1);
      g.fillRect(x + Math.floor(w * 0.25), BG_H - 58 - h - 6, Math.floor(w * 0.5), 6);
      // striped awning band partway down
      if (r() < 0.7) {
        g.fillStyle(r() < 0.5 ? 0xa8422a : 0xd4a83a, 1);
        g.fillRect(x, BG_H - 58 - Math.floor(h * 0.5), w, 4);
      }
      // lit windows
      for (let k = 0; k < 5; k++) {
        if (r() < 0.45) {
          g.fillStyle(0xffd166, 1);
          g.fillRect(x + 4 + Math.floor(r() * (w - 8)), BG_H - 58 - h + 6 + Math.floor(r() * (h - 12)), 2, 2);
        }
      }
      x += w + 4;
    }
    // hazy dust/heat drift in the air
    for (let i = 0; i < 24; i++) {
      g.fillStyle(0xe8d9a8, 0.4);
      g.fillRect(Math.floor(r() * GAME_W), Math.floor(r() * 130) + 20, 2 + Math.floor(r() * 8), 1);
    }
    // sandy ground band with texture flecks
    g.fillStyle(0x9a7548, 1); g.fillRect(0, BG_H - 56, GAME_W, 56);
    g.fillStyle(0x8c6b3c, 1); g.fillRect(0, BG_H - 56, GAME_W, 3);
    for (let i = 0; i < 28; i++) {
      g.fillStyle(r() < 0.3 ? 0xceb87e : 0x6b5836, 1);
      g.fillRect(Math.floor(r() * GAME_W), BG_H - 50 + Math.floor(r() * 44), 8 + Math.floor(r() * 18), 1);
    }
  }
};

export function buildBattleBackdrop(scene, id) {
  const key = 'bbg_' + id;
  if (scene.textures.exists(key)) return key;
  const painter = BACKDROPS[id] || BACKDROPS.nova;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  painter(g, rng(id.length * 977 + 5));
  g.generateTexture(key, GAME_W, BG_H);
  g.destroy();
  return key;
}
