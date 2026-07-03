// ═══════════════════════════════════════════════════════════════
// SHOP — Buy/sell with explicit confirmation and persistent stock.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState, autoSave } from '../game/state.js';
import { addItem, removeItem, addGold, spendGold } from '../game/inventory.js';
import { itemData } from '../game/progression.js';
import { getShop } from '../data/shops.js';
import { uiSfx } from '../engine/audio.js';

export class ShopScene extends Phaser.Scene {
  constructor() { super({ key: 'ShopScene' }); }

  init(data) {
    this.shopId = data.shopId || 'materials';
    this.parentScene = data.parentScene || 'MapScene';
    this.resolve = data.resolve || (() => {});
  }

  create() {
    this.shop = getShop(this.shopId);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05030c, 0.86);
    this.win = new Win(this, 28, 20, GAME_W - 56, GAME_H - 40);
    this.win.addText(18, 14, this.shop ? this.shop.name : 'SHOP', {
      scale: 2, color: RAMP.uiGold[3]
    });
    this.win.addText(18, 40, this.shop ? this.shop.keeper : 'Shopkeeper', {
      scale: 1, color: uiDimColor()
    });
    this.goldText = this.win.addText(this.win.w - 140, 18, '', {
      scale: 1, color: RAMP.uiGold[4]
    });
    this.mode = 'root';
    this.notice = null;
    this.buildRoot();
    swallowInput();
  }

  refreshGold() {
    this.goldText.setText('Gold: ' + GameState.gold);
  }

  clearMenu() {
    if (this.menu) { this.menu.destroy(); this.menu = null; }
    if (this.detail) { this.detail.destroy(); this.detail = null; }
    if (this.confirmWin) { this.confirmWin.destroy(); this.confirmWin = null; }
    if (this.confirmMenu) { this.confirmMenu.destroy(); this.confirmMenu = null; }
  }

  buildRoot() {
    this.clearMenu();
    this.mode = 'root';
    this.refreshGold();
    this.menu = new MenuList(this, this.win.x + 24, this.win.y + 78, [
      { label: 'Buy', value: 'buy' },
      { label: 'Sell', value: 'sell' },
      { label: 'Leave', value: 'leave' }
    ], {
      width: 180, lineH: 24,
      onSelect: item => item.value === 'leave' ? this.close() : this.buildItems(item.value),
      onCancel: () => this.close()
    });
  }

  rowsFor(mode) {
    if (mode === 'buy') {
      return (this.shop ? this.shop.items : []).map(id => {
        const data = itemData(id);
        return data && { id, data, qty: 0, price: data.price || 0 };
      }).filter(Boolean);
    }
    return GameState.inventory.map(stack => {
      const data = itemData(stack.id);
      return data && { id: stack.id, data, qty: stack.qty, price: data.sell || 0 };
    }).filter(Boolean);
  }

  buildItems(mode) {
    this.clearMenu();
    this.mode = mode;
    this.refreshGold();
    const rows = this.rowsFor(mode);
    const items = rows.map(row => ({
      label: row.data.name + (mode === 'sell' ? '  x' + row.qty : ''),
      value: row.id, row,
      disabled: mode === 'buy' && row.price > GameState.gold
    }));
    if (!items.length) items.push({ label: mode === 'buy' ? 'No stock' : 'Nothing to sell', value: null, disabled: true });
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 74, items, {
      width: 250, lineH: 19, visible: 10,
      rightTexts: items.map(item => item.row ? item.row.price + 'g' : ''),
      onChange: item => this.showDetail(item.row),
      onSelect: item => item.value === 'back' ? this.buildRoot() : item.row && this.askConfirm(item.row),
      onCancel: () => this.buildRoot()
    });
    this.showDetail(this.menu.selected.row);
  }

  showDetail(row) {
    if (this.detail) this.detail.destroy();
    if (!row) return;
    this.detail = new Win(this, this.win.x + 300, this.win.y + 72, this.win.w - 324, 190);
    this.detail.addText(14, 14, row.data.name, { scale: 1, color: RAMP.uiGold[4] });
    this.detail.addText(14, 38, row.data.desc, {
      scale: 1, color: 0xe8e8f4, maxWidth: this.detail.w - 28, lineH: 11
    });
    this.detail.addText(14, 136, (this.mode === 'buy' ? 'Cost: ' : 'Sell: ') + row.price + ' gold', {
      scale: 1, color: uiDimColor()
    });
  }

  askConfirm(row) {
    this.menu.setVisible(false);
    this.confirmWin = new Win(this, GAME_W / 2 - 145, GAME_H / 2 - 52, 290, 104);
    const verb = this.mode === 'buy' ? 'Buy ' : 'Sell ';
    this.confirmWin.addText(16, 14, verb + row.data.name + ' for ' + row.price + 'g?', {
      scale: 1, maxWidth: 258
    });
    this.confirmMenu = new MenuList(this, this.confirmWin.x + 16, this.confirmWin.y + 56, [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], {
      width: 250, lineH: 18,
      onSelect: item => {
        if (item.value === 'yes') this.transact(row);
        else this.closeConfirm();
      },
      onCancel: () => this.closeConfirm()
    });
  }

  closeConfirm() {
    if (this.confirmWin) this.confirmWin.destroy();
    if (this.confirmMenu) this.confirmMenu.destroy();
    this.confirmWin = null; this.confirmMenu = null;
    if (this.menu) this.menu.setVisible(true);
  }

  transact(row) {
    let ok = false;
    if (this.mode === 'buy') {
      ok = spendGold(row.price);
      if (ok) addItem(row.id, 1);
    } else {
      ok = removeItem(row.id, 1);
      if (ok) addGold(row.price);
    }
    uiSfx(ok ? 'confirm' : 'error');
    this.closeConfirm();
    this.buildItems(this.mode);
  }

  close() {
    autoSave(this.shop ? this.shop.name : 'Shop');
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
    if (this.confirmMenu) this.confirmMenu.handle(inp);
    else if (this.menu) this.menu.handle(inp);
  }
}
