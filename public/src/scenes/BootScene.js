// ═══════════════════════════════════════════════════════════════
// BOOT — Loads settings, bakes fonts/sprites/shared textures,
// wires audio unlock, then starts the title.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { loadSettings } from '../engine/settings.js';
import { initAudio, resumeAudio } from '../engine/audio.js';
import { buildFont } from '../art/font.js';
import { buildActorTexture, buildShadowTexture } from '../art/actors.js';
import { LYRA_SPRITE } from '../art/sprites/lyra.js';
import { RAMP } from '../art/palette.js';
import { rng } from '../art/pixel.js';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  create() {
    loadSettings();
    buildFont(this);
    buildShadowTexture(this);
    buildActorTexture(this, LYRA_SPRITE);
    this.buildStarfield();
    this.buildCrownEmblem();

    // Audio must unlock on first user gesture
    const unlock = () => { initAudio(); resumeAudio(); };
    this.input.keyboard.once('keydown', unlock);
    this.input.once('pointerdown', unlock);
    window.addEventListener('keydown', unlock, { once: true });

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';

    this.scene.start('TitleScene');
  }

  buildStarfield() {
    if (this.textures.exists('starfield')) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const sky = RAMP.nightSky, neb = RAMP.nebula, star = RAMP.starlight;
    // vertical gradient bands
    const bands = 6;
    for (let i = 0; i < bands; i++) {
      g.fillStyle(sky[Math.min(4, Math.floor(i / bands * 3))], 1);
      g.fillRect(0, Math.floor(GAME_H * i / bands), GAME_W, Math.ceil(GAME_H / bands));
    }
    const r = rng(42);
    // nebula wisps (scattered pixel clusters)
    for (let i = 0; i < 14; i++) {
      const cx = r() * GAME_W, cy = r() * GAME_H * 0.8, rad = 14 + r() * 40;
      const c = neb[Math.floor(r() * 3)];
      g.fillStyle(c, 0.10 + r() * 0.10);
      for (let k = 0; k < 40; k++) {
        const a = r() * Math.PI * 2, d = r() * rad;
        g.fillRect(Math.round(cx + Math.cos(a) * d * 1.6), Math.round(cy + Math.sin(a) * d * 0.6), 2, 1);
      }
    }
    // stars
    for (let i = 0; i < 220; i++) {
      const x = Math.floor(r() * GAME_W), y = Math.floor(r() * GAME_H);
      const b = r();
      g.fillStyle(b > 0.92 ? star[4] : b > 0.6 ? star[2] : star[0], 1);
      g.fillRect(x, y, 1, 1);
      if (b > 0.97) { // bright cross star
        g.fillRect(x - 1, y, 3, 1);
        g.fillRect(x, y - 1, 1, 3);
      }
    }
    g.generateTexture('starfield', GAME_W, GAME_H);
    g.destroy();
  }

  buildCrownEmblem() {
    if (this.textures.exists('crownEmblem')) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const gold = RAMP.uiGold, gem = 0x66e8e0, violet = RAMP.lyraDress;
    const W = 46, H = 30;
    const p = (c, x, y, w = 1, h = 1) => { g.fillStyle(c, 1); g.fillRect(x, y, w, h); };
    // band
    p(gold[1], 6, 22, 34, 6);
    p(gold[2], 6, 22, 34, 2);
    p(gold[3], 7, 23, 32, 1);
    p(gold[0], 6, 27, 34, 1);
    // three peaks — triangles rising from the band
    for (const [cx, ph] of [[11, 10], [23, 16], [35, 10]]) {
      for (let i = 0; i < ph; i++) {
        // wide at the base (i=0), narrowing to a point at the top
        const w = Math.max(1, Math.round(9 * (1 - i / ph)));
        const ww = w % 2 === 0 ? w + 1 : w;
        p(gold[2], cx - Math.floor(ww / 2), 21 - i, ww, 1);
        p(gold[3], cx - Math.floor(ww / 2), 21 - i, 1, 1);   // left-lit edge
      }
      p(gold[4], cx, 21 - ph, 1, 2);   // tip glint
    }
    // gems
    p(gem, 22, 12, 3, 3);
    p(0xffffff, 22, 12, 1, 1);
    p(violet[3], 10, 16, 3, 3);
    p(0xffffff, 10, 16, 1, 1);
    p(violet[3], 34, 16, 3, 3);
    p(0xffffff, 34, 16, 1, 1);
    // band jewels
    for (const bx of [10, 18, 26, 34]) {
      p(0xd04570, bx, 24, 2, 2);
      p(0xffa8c0, bx, 24, 1, 1);
    }
    // fracture (the shattered Crown) — thin void crack through center peak
    p(0x2e1a4a, 23, 8, 1, 6);
    p(0x2e1a4a, 22, 14, 1, 4);
    p(RAMP.voidGlow[2], 23, 9, 1, 2);
    g.generateTexture('crownEmblem', W, H);
    g.destroy();
  }
}
