// ═══ LEVEL UP — deterministic three-choice action build reward.

import { GAME_W, GAME_H, DEPTH } from '../config.js';
import { RAMP } from '../art/palette.js';
import { PixelText } from '../art/font.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { uiSfx, sfx } from '../engine/audio.js';
import { flash } from '../engine/fx.js';
import { levelChoices, applyBuildChoice } from '../expedition/buildChoices.js';
import { GameState } from '../game/state.js';

export class LevelUpScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelUpScene' }); }

  init(data) {
    this.parentScene = data.parentScene || 'ExpeditionScene';
    this.seed = data.seed >>> 0;
    this.level = data.level || GameState.chars.lyra.level;
    this.action = data.action;
    this.resolve = data.resolve || (() => {});
  }

  create() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05030c, 0.86).setDepth(DEPTH.UI);
    const winW = Math.min(520, GAME_W - 48), winH = Math.min(286, GAME_H - 48);
    this.win = new Win(this, (GAME_W - winW) / 2, (GAME_H - winH) / 2, winW, winH, { depth: DEPTH.UI + 1 });
    this.win.addText(20, 16, `LEVEL ${this.level}`, { scale: 3, color: RAMP.uiGold[4] });
    this.win.addText(20, 48, 'Choose how Lyra changes. This choice persists.', { scale: 1, color: 0xe8e8f4 });
    const lyra = GameState.chars.lyra;
    this.choices = levelChoices(this.seed, this.level, lyra.build, GameState.roster.includes('erynn'));
    this.menu = new MenuList(this, this.win.x + 20, this.win.y + 76, this.choices.map(choice => ({
      label: choice.name, value: choice.id, choice
    })), {
      width: this.win.w - 40,
      lineH: 32,
      visible: 3,
      onChange: item => this.showChoice(item.choice),
      onSelect: item => this.choose(item.choice)
    });
    this.menu.setDepth(DEPTH.UI + 4);
    this.detail = new PixelText(this, this.win.x + 32, this.win.y + this.win.h - 54, '', {
      scale: 1, color: uiDimColor(), maxWidth: this.win.w - 64, lineH: 11
    }).setDepth(DEPTH.UI + 4);
    this.showChoice(this.choices[0]);
    this.win.addText(20, this.win.h - 18, 'Confirm choose · permanent', { scale: 1, color: RAMP.uiGold[3] });
    flash(this, 0xffe8a8, 180, 0.28);
    sfx('levelup');
    swallowInput();
  }

  showChoice(choice) { if (this.detail && choice) this.detail.setText(choice.desc); }

  choose(choice) {
    if (!choice || !applyBuildChoice(choice.id, GameState.chars.lyra, this.action)) return;
    uiSfx('confirm');
    this.action.hp = Math.min(this.action.maxHp, this.action.hp + Math.round(this.action.maxHp * 0.25));
    this.action.stamina = this.action.maxStamina;
    this.action.energy = Math.min(this.action.maxEnergy, this.action.energy + Math.round(this.action.maxEnergy * 0.25));
    const done = this.resolve;
    this.resolve = () => {};
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) parent.scene.resume();
    done(choice.id);
    swallowInput();
  }

  update(time) {
    const input = pollInput(this, time);
    if (input.upRepeat) this.menu.move(-1);
    if (input.downRepeat) this.menu.move(1);
    if (input.confirmed) this.choose(this.menu.selected.choice);
  }
}
