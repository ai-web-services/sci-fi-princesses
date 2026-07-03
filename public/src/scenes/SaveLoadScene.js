// ═══════════════════════════════════════════════════════════════
// SAVE/LOAD — Slot list with metadata, overwrite confirmation,
// corruption-safe reads. mode: 'load' | 'save'
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { Win, MenuList } from '../engine/ui.js';
import { RAMP } from '../art/palette.js';
import { listSaves, SLOTS, AUTO_SLOT } from '../engine/save.js';
import { loadFromSlot, saveToSlot, formatPlaytime } from '../game/state.js';
import { chapterLabel } from '../data/story.js';
import { transition } from '../engine/fx.js';
import { uiSfx } from '../engine/audio.js';
import { PixelText } from '../art/font.js';

export class SaveLoadScene extends Phaser.Scene {
  constructor() { super({ key: 'SaveLoadScene' }); }

  init(data) {
    this.mode = (data && data.mode) || 'load';
    this.backScene = (data && data.back) || 'TitleScene';
    this.backData = (data && data.backData) || {};
    this.locationName = (data && data.locationName) || '';
  }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0, 0).setAlpha(0.5);
    this.win = new Win(this, GAME_W / 2 - 210, 24, 420, GAME_H - 48);
    this.win.addText(14, 12, this.mode === 'load' ? 'LOAD GAME' : 'SAVE GAME', { scale: 2, color: RAMP.uiGold[3] });
    this.confirming = null;
    this.buildMenu();
    swallowInput();
  }

  slotLabel(s) {
    const name = s.slot === AUTO_SLOT ? 'Auto' : 'Slot ' + (parseInt(s.slot, 10) + 1);
    if (s.empty) return name + '   — empty —';
    const m = s.meta || {};
    return name + '   ' + chapterLabel(m.chapter) + ' · ' + (m.location || '?') +
      ' · Lv' + (m.level || 1) + ' · ' + formatPlaytime(m.playtime || 0) + ' · ★' + (m.shards || 0);
  }

  buildMenu() {
    if (this.menu) { this.menu.destroy(); this.menu = null; }
    const saves = listSaves();
    const items = saves.map(s => {
      const isAuto = s.slot === AUTO_SLOT;
      return {
        label: this.slotLabel(s),
        value: s.slot,
        empty: s.empty,
        disabled: (this.mode === 'load' && s.empty) || (this.mode === 'save' && isAuto)
      };
    });
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 14, this.win.y + 44, items, {
      width: 390, lineH: 22, visible: 6,
      onSelect: (it) => this.choose(it),
      onCancel: () => this.goBack()
    });
  }

  choose(it) {
    if (it.value === 'back') { this.goBack(); return; }
    if (this.mode === 'load') {
      if (loadFromSlot(it.value)) {
        uiSfx('confirm');
        transition(this, 'MapScene', {});
      } else {
        uiSfx('error');
      }
    } else {
      if (!it.empty && !this.confirming) {
        this.askOverwrite(it);
        return;
      }
      this.doSave(it.value);
    }
  }

  askOverwrite(it) {
    this.confirming = it;
    this.menu.destroy(); this.menu = null;
    this.confirmWin = new Win(this, GAME_W / 2 - 130, GAME_H / 2 - 40, 260, 80);
    this.confirmWin.addText(14, 12, 'Overwrite this save?', { scale: 1 });
    this.confirmMenu = new MenuList(this, this.confirmWin.x + 14, this.confirmWin.y + 34, [
      { label: 'No, keep it', value: 'no' },
      { label: 'Yes, overwrite', value: 'yes' }
    ], {
      width: 220, lineH: 16,
      onSelect: (c) => {
        const target = this.confirming;
        this.closeConfirm();
        if (c.value === 'yes') this.doSave(target.value);
      },
      onCancel: () => this.closeConfirm()
    });
  }

  closeConfirm() {
    this.confirming = null;
    if (this.confirmWin) { this.confirmWin.destroy(); this.confirmWin = null; }
    if (this.confirmMenu) { this.confirmMenu.destroy(); this.confirmMenu = null; }
    this.buildMenu();
  }

  doSave(slot) {
    const ok = saveToSlot(slot, this.locationName);
    if (ok) {
      uiSfx('save');
      const note = new PixelText(this, 0, this.win.y + this.win.h - 24, 'Game saved.', { scale: 1, color: RAMP.xp[3], align: 'center' });
      note.x = Math.round((GAME_W - note.textW) / 2);
      this.time.delayedCall(700, () => this.goBack());
      this.buildMenu();
    } else {
      uiSfx('error');
    }
  }

  goBack() {
    transition(this, this.backScene, this.backData);
  }

  update(time) {
    const inp = pollInput(this, time);
    if (this.confirmMenu) { this.confirmMenu.handle(inp); return; }
    if (this.menu) this.menu.handle(inp);
  }
}
