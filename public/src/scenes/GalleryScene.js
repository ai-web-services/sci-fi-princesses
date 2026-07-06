// ═══════════════════════════════════════════════════════════════
// GALLERY — Debug asset viewer (ART_PRODUCTION_PLAN.md Phase 0).
// Renders every authored asset at ×3 so a screenshot can be used
// as ART_VISION.md §12.F verification evidence. Read-only; never
// mutates game state. Entry: press 'G' on the title screen.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { drawWindow } from '../engine/ui.js';
import { buildActorTexture } from '../art/actors.js';
import { buildHeroBattleTexture, buildEnemyBattleTexture, HERO_POSES } from '../art/battleArt.js';
import { BATTLE_HEROES } from '../art/battle/heroes.js';
import { BATTLE_ENEMIES } from '../art/battle/enemies.js';
import { PORTRAITS } from '../art/portraits/index.js';
import { LYRA_SPRITE } from '../art/sprites/lyra.js';
import { ERYNN_SPRITE } from '../art/sprites/erynn.js';
import { BRIMBLE_SPRITE } from '../art/sprites/brimble.js';
import { DRAKKOR_SPRITE } from '../art/sprites/drakkor.js';
import { PIP_SPRITE } from '../art/sprites/pip.js';

const HERO_SPRITES = { lyra: LYRA_SPRITE, erynn: ERYNN_SPRITE, brimble: BRIMBLE_SPRITE, drakkor: DRAKKOR_SPRITE, pip: PIP_SPRITE };
const BOSS_IDS = ['kael', 'matriarch', 'ignis'];
const ZOOM = 3;

function items() {
  const cats = [];

  cats.push({
    name: 'Exploration Walks',
    entries: Object.keys(HERO_SPRITES).map(id => ({
      label: id,
      build: (scene) => {
        buildActorTexture(scene, HERO_SPRITES[id]);
        return scene.add.image(0, 0, 'actor_' + id, 'down0').setOrigin(0.5, 0.5);
      }
    }))
  });

  cats.push({
    name: 'Battle Poses',
    entries: Object.keys(BATTLE_HEROES).map(id => ({
      label: id,
      build: (scene) => {
        buildHeroBattleTexture(scene, id);
        const def = BATTLE_HEROES[id];
        const present = HERO_POSES.filter(p => def.poses[p]);
        const missing = HERO_POSES.filter(p => !def.poses[p]);
        return { image: scene.add.image(0, 0, 'bh_' + id, 'idle').setOrigin(0.5, 0.5), note: `poses: ${present.join(', ')}${missing.length ? '  MISSING: ' + missing.join(', ') : ''}` };
      }
    }))
  });

  cats.push({
    name: 'Portraits',
    entries: Object.keys(PORTRAITS).flatMap(id => Object.keys(PORTRAITS[id].expressions).map(expr => ({
      label: id + ' / ' + expr,
      build: (scene) => scene.add.image(0, 0, 'portrait_' + id + '_' + expr).setOrigin(0.5, 0.5)
    })))
  });

  cats.push({
    name: 'Standard Enemies',
    entries: Object.keys(BATTLE_ENEMIES).filter(id => !BOSS_IDS.includes(id)).map(id => ({
      label: id,
      build: (scene) => {
        buildEnemyBattleTexture(scene, id);
        return scene.add.image(0, 0, 'be_' + id).setOrigin(0.5, 0.5);
      }
    }))
  });

  cats.push({
    name: 'Bosses',
    entries: BOSS_IDS.filter(id => BATTLE_ENEMIES[id]).map(id => ({
      label: id,
      build: (scene) => {
        buildEnemyBattleTexture(scene, id);
        return scene.add.image(0, 0, 'be_' + id).setOrigin(0.5, 0.5);
      }
    }))
  });

  cats.push({ name: 'VFX Library', entries: [], note: 'art/vfx.js does not exist yet — Phase 2' });

  return cats;
}

export class GalleryScene extends Phaser.Scene {
  constructor() { super({ key: 'GalleryScene' }); }

  create() {
    this.cats = items();
    this.catIdx = 0;
    this.itemIdx = 0;

    this.cameras.main.setBackgroundColor(0x0a0a1f);
    const g = this.add.graphics();
    drawWindow(g, 4, 4, GAME_W - 8, 28, {});
    this.title = new PixelText(this, 12, 12, '', { scale: 1, color: RAMP.uiGold[3] });
    this.sub = new PixelText(this, 12, GAME_H - 24, '', { scale: 1, color: 0xaaaacc });
    this.footer = new PixelText(this, 12, GAME_H - 12, '←→ category   ↑↓ item   ESC back', { scale: 1, color: 0x8888aa });

    this.stage = this.add.container(GAME_W / 2, GAME_H / 2 + 4);
    this.render();
    swallowInput();
  }

  clearStage() {
    this.stage.removeAll(true);
  }

  render() {
    this.clearStage();
    const cat = this.cats[this.catIdx];
    let note = cat.note || '';
    if (cat.entries.length === 0) {
      const t = new PixelText(this, 0, 0, note || '(empty)', { scale: 1, color: 0xff8866, align: 'center' });
      t.x = -Math.round(t.textW / 2);
      this.stage.add(t);
    } else {
      const entry = cat.entries[this.itemIdx];
      const result = entry.build(this);
      const img = result && result.image ? result.image : result;
      if (result && result.note) note = result.note;
      img.setScale(ZOOM);
      this.stage.add(img);
    }
    this.title.setText(`${cat.name}  [${this.catIdx + 1}/${this.cats.length}]`);
    const label = cat.entries.length ? `${cat.entries[this.itemIdx].label}  (${this.itemIdx + 1}/${cat.entries.length})` : '';
    this.sub.setText(label + (note ? '   ' + note : ''));
  }

  update(time) {
    const inp = pollInput(this, time);
    if (inp.cancelled) { this.scene.start('TitleScene'); return; }
    let changed = false;
    if (inp.rightRepeat) { this.catIdx = (this.catIdx + 1) % this.cats.length; this.itemIdx = 0; changed = true; }
    else if (inp.leftRepeat) { this.catIdx = (this.catIdx - 1 + this.cats.length) % this.cats.length; this.itemIdx = 0; changed = true; }
    const cat = this.cats[this.catIdx];
    const n = cat.entries.length;
    if (n > 0) {
      if (inp.downRepeat) { this.itemIdx = (this.itemIdx + 1) % n; changed = true; }
      else if (inp.upRepeat) { this.itemIdx = (this.itemIdx - 1 + n) % n; changed = true; }
    }
    if (changed) this.render();
  }
}
