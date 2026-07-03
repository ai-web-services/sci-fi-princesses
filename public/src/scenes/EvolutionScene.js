// ═══════════════════════════════════════════════════════════════
// EVOLUTION — Character transformation milestone presentation.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H, DEPTH } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { evolve, charData } from '../game/progression.js';
import { sfx } from '../engine/audio.js';
import { flash } from '../engine/fx.js';
import { Settings } from '../engine/settings.js';
import { SKILLS } from '../data/skills.js';

export class EvolutionScene extends Phaser.Scene {
  constructor() { super({ key: 'EvolutionScene' }); }

  init(data) {
    this.characterId = data.characterId || 'lyra';
    this.parentScene = data.parentScene || 'MapScene';
    this.resolve = data.resolve || (() => {});
  }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0, 0).setTint(0x9988ff);
    const result = evolve(this.characterId);
    this.result = result;
    if (!result) {
      this.scene.stop();
      const parent = this.scene.get(this.parentScene);
      if (parent && parent.scene) parent.scene.resume();
      this.resolve(null);
      return;
    }
    const data = charData(this.characterId);
    const name = data ? data.name : this.characterId;
    const stage = result.stage.name;
    const actor = this.add.image(GAME_W / 2, 210, 'actor_' + this.characterId, 'down0')
      .setScale(4).setOrigin(0.5, 1).setDepth(DEPTH.UI + 1);
    this.add.rectangle(GAME_W / 2, 214, 150, 12, 0xffd75e, 0.18).setDepth(DEPTH.UI);
    const title = new PixelText(this, 0, 48, name.toUpperCase(), {
      scale: 2, color: RAMP.uiGold[4], align: 'center'
    });
    title.x = Math.round((GAME_W - title.textW) / 2);
    const form = new PixelText(this, 0, 82, stage.toUpperCase(), {
      scale: 3, color: 0xffffff, align: 'center'
    });
    form.x = Math.round((GAME_W - form.textW) / 2);
    const learned = result.learned.length
      ? 'New ability: ' + result.learned.map(id => SKILLS[id]?.name || id).join(', ')
      : 'Stellar power answers resolve.';
    const detail = new PixelText(this, 0, 246, learned, {
      scale: 1, color: 0xc8b8ff, align: 'center'
    });
    detail.x = Math.round((GAME_W - detail.textW) / 2);
    const prompt = new PixelText(this, 0, 320, 'Confirm to continue', {
      scale: 1, color: RAMP.uiGold[3], align: 'center'
    });
    prompt.x = Math.round((GAME_W - prompt.textW) / 2);
    if (!Settings.reducedMotion) {
      this.tweens.add({ targets: actor, scale: 4.25, duration: 900, yoyo: true, repeat: -1 });
    }
    sfx('evolve');
    flash(this, 0xffffff, 300, 0.7);
    this.ready = false;
    this.time.delayedCall(900, () => { this.ready = true; });
    swallowInput();
  }

  close() {
    const done = this.resolve;
    this.resolve = () => {};
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) parent.scene.resume();
    done(this.result);
    swallowInput();
  }

  update(time) {
    if (!this.ready) return;
    const inp = pollInput(this, time);
    if (inp.confirmed) this.close();
  }
}
