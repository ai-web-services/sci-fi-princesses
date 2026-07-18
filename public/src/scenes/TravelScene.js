// ═══════════════════════════════════════════════════════════════
// STARGATE TRAVEL — Destination status, locked-route reasons,
// and safe return to exploration.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { GameState } from '../game/state.js';
import { travelRows } from '../data/travel.js';
import { uiSfx } from '../engine/audio.js';

export class TravelScene extends Phaser.Scene {
  constructor() { super({ key: 'TravelScene' }); }

  init(data) {
    this.parentScene = (data && data.parentScene) || 'MapScene';
    this.currentMap = (data && data.currentMap) || (GameState && GameState.map);
  }

  create() {
    const shade = this.add.graphics();
    shade.fillStyle(0x060410, 0.84);
    shade.fillRect(0, 0, GAME_W, GAME_H);
    this.win = new Win(this, 36, 28, GAME_W - 72, GAME_H - 56);
    this.win.addText(18, 14, 'STARGATE NETWORK', { scale: 2, color: RAMP.uiGold[3] });
    this.win.addText(18, 38, 'Select a stable route. Locked signatures remain recorded.', {
      scale: 1, color: uiDimColor()
    });
    this.rows = travelRows(GameState, this.currentMap);
    const items = this.rows.map(row => ({
      label: (row.available ? '◆ ' : row.current ? '● ' : '○ ') + row.name,
      value: row.id,
      row,
      color: row.available ? 0xe8e8f4 : uiDimColor()
    }));
    items.push({ label: 'Return to console', value: 'cancel', row: null });
    this.menu = new MenuList(this, this.win.x + 18, this.win.y + 68, items, {
      width: this.win.w - 36,
      lineH: 18,
      visible: 4,
      onChange: item => this.showStatus(item.row),
      onSelect: item => this.choose(item),
      onCancel: () => this.close()
    });
    this.status = new PixelText(this, this.win.x + 30, this.win.y + this.win.h - 54, '', {
      scale: 1, color: RAMP.uiGold[4], maxWidth: this.win.w - 60
    });
    this.showStatus(this.menu.selected.row);
    this.win.addText(18, this.win.h - 22, 'Confirm travel · Cancel return', {
      scale: 1, color: uiDimColor()
    });
    swallowInput();
  }

  showStatus(row) {
    if (!this.status) return;
    this.status.setText(row
      ? row.region + '  ·  ' + row.reason
      : 'Close the network map and return to the relay console.');
  }

  choose(item) {
    if (item.value === 'cancel') {
      this.close();
      return;
    }
    if (!item.row || !item.row.available) {
      uiSfx('error');
      return;
    }
    if (item.row.scene) {
      uiSfx('confirm');
      const parent = this.scene.get(this.parentScene);
      if (parent && parent.scene) parent.scene.stop();
      this.scene.start(item.row.scene, {});
      return;
    }
    const parent = this.scene.get(this.parentScene);
    if (!parent || !parent.travelTo) {
      uiSfx('error');
      this.close();
      return;
    }
    uiSfx('confirm');
    parent.travelTo(item.row);
    this.scene.stop();
  }

  close() {
    uiSfx('cancel');
    swallowInput();
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) {
      parent.modalOpen = false;
      parent.scene.resume();
    }
  }

  update(time) {
    const inp = pollInput(this, time);
    if (inp.cancelled || inp.menued) {
      this.close();
      return;
    }
    if (inp.upRepeat) this.menu.move(-1);
    if (inp.downRepeat) this.menu.move(1);
    if (inp.confirmed) this.choose(this.menu.selected);
  }
}
