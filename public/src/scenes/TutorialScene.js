// ═══════════════════════════════════════════════════════════════
// TUTORIAL — Accessible one-time onboarding card.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H, DEPTH } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState } from '../game/state.js';
import { TUTORIALS } from '../data/tutorials.js';
import { uiSfx } from '../engine/audio.js';

export class TutorialScene extends Phaser.Scene {
  constructor() { super({ key: 'TutorialScene' }); }

  init(data) {
    this.tutorialId = data.id;
    this.parentScene = data.parentScene || 'MapScene';
    this.resolve = data.resolve || (() => {});
  }

  create() {
    const def = TUTORIALS[this.tutorialId] || {
      title: 'TUTORIAL', body: 'Tutorial details are unavailable.', hint: ''
    };
    const shade = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05030c, 0.78)
      .setDepth(DEPTH.UI);
    this.win = new Win(this, 48, 42, GAME_W - 96, 186, { depth: DEPTH.UI + 1 });
    this.win.addText(20, 18, def.title, { scale: 2, color: RAMP.uiGold[3] });
    this.win.addText(20, 58, def.body, {
      scale: 1, color: 0xe8e8f4, maxWidth: this.win.w - 40, lineH: 12
    });
    if (def.hint) this.win.addText(20, 124, def.hint, {
      scale: 1, color: uiDimColor(), maxWidth: this.win.w - 40, lineH: 11
    });
    this.win.addText(20, 158, 'Confirm / Cancel close', { scale: 1, color: RAMP.uiGold[4] });
    shade.setInteractive();
    swallowInput();
  }

  close() {
    if (GameState && !GameState.tutorialsSeen.includes(this.tutorialId)) {
      GameState.tutorialsSeen.push(this.tutorialId);
    }
    const done = this.resolve;
    this.resolve = () => {};
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) parent.scene.resume();
    done();
    swallowInput();
  }

  update(time) {
    const inp = pollInput(this, time);
    if (inp.confirmed || inp.cancelled || inp.menued) this.close();
  }
}
