// ═══════════════════════════════════════════════════════════════
// INVENTORY SCENE — Overlay for party management, items, equip
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { GameData } from '../gameData.js';
import { getInput } from '../input.js';

export class InventoryScene extends Phaser.Scene {
  constructor() { super({ key: 'InventoryScene' }); }

  create() {
    this.mode = 'party';
    this.cursor = 0;
    this.charIndex = 0;
    this.slotIndex = 0;
    this._itemIdx = 0;
    this.contentTexts = [];
    this.tabTexts = [];

    this.bg = this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W - 16, GAME_H - 16, 0x050514, 0.96).setDepth(200);
    this.bg.setStrokeStyle(2, 0x4488ff);

    this.tabParty = this.add.text(20, 14, 'PARTY', { fontSize: '8px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(201);
    this.tabInv = this.add.text(90, 14, 'ITEMS', { fontSize: '8px', fontFamily: 'monospace', color: '#666688' }).setDepth(201);
    this.add.text(GAME_W - 20, 14, GameData.gold + 'g', { fontSize: '8px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(201).setOrigin(1, 0);
    this.add.rectangle(GAME_W/2, 30, GAME_W - 36, 1, 0x4488ff, 0.5).setDepth(201);

    this.updateContent();
  }

  updateContent() {
    this.contentTexts.forEach(t => t.destroy());
    this.contentTexts = [];

    this.tabParty.setColor(this.mode === 'party' ? '#44ddff' : '#666688');
    this.tabInv.setColor(this.mode === 'inventory' || this.mode === 'itemAction' || this.mode === 'pickChar' ? '#44ddff' : '#666688');

    if (this.mode === 'party') this.renderParty();
    else if (this.mode === 'inventory') this.renderInventory();
    else if (this.mode === 'itemAction') this.renderItemAction();
    else if (this.mode === 'pickChar') this.renderPickChar();
    else if (this.mode === 'equip') this.renderEquip();
  }

  renderParty() {
    const party = GameData.party;
    if (party.length === 0) {
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2, 'No party members', { fontSize: '12px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      return;
    }

    party.forEach((c, i) => {
      const isSel = i === this.charIndex;
      const y = 50 + i * 56;
      const bg = this.add.rectangle(GAME_W/2, y, GAME_W - 40, 50, isSel ? 0x1a1a3a : 0x0a0a1a, 0.9).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);

      const charKey = 'char_' + (c.species === 'human' ? 'lyra' : c.species === 'cat' ? 'eryx' : c.species === 'frog' ? 'brimble' : c.species === 'dragon' ? 'drakkor' : c.species === 'robot' ? 'pip' : 'townie1');
      const spr = this.add.image(30, y, charKey).setDepth(202).setScale(0.8);
      this.contentTexts.push(spr);

      this.contentTexts.push(this.add.text(48, y - 8, c.name + '  Lv.' + c.level, { fontSize: '7px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));

      const hpPct = c.maxHp > 0 ? c.hp / c.maxHp : 0;
      this.contentTexts.push(this.add.rectangle(48, y + 6, 80, 5, 0x333333).setDepth(202));
      this.contentTexts.push(this.add.rectangle(48, y + 6, 80 * hpPct, 5, hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344).setDepth(202));
      this.contentTexts.push(this.add.text(130, y + 4, 'HP ' + c.hp + '/' + c.maxHp, { fontSize: '5px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(202));

      this.contentTexts.push(this.add.text(170, y - 6, 'ATK:' + c.atk, { fontSize: '11px', fontFamily: 'monospace', color: '#ff8833' }).setDepth(202));
      this.contentTexts.push(this.add.text(230, y - 6, 'DEF:' + c.def, { fontSize: '11px', fontFamily: 'monospace', color: '#4488ff' }).setDepth(202));
      this.contentTexts.push(this.add.text(170, y + 6, 'SPD:' + c.spd, { fontSize: '11px', fontFamily: 'monospace', color: '#44ff44' }).setDepth(202));
      this.contentTexts.push(this.add.text(230, y + 6, 'CRIT:' + c.crit + '%', { fontSize: '11px', fontFamily: 'monospace', color: '#ffcc33' }).setDepth(202));

      const eq = c.equipment;
      const weaponName = eq.weapon ? eq.weapon.name : '-';
      const armorName = eq.armor ? eq.armor.name : '-';
      this.contentTexts.push(this.add.text(300, y - 6, 'W:' + weaponName, { fontSize: '5px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(202));
      this.contentTexts.push(this.add.text(300, y + 6, 'A:' + armorName, { fontSize: '5px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(202));

      if (isSel) {
        this.contentTexts.push(this.add.text(18, 40 + i * 44, '>', { fontSize: '18px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(202));
      }
    });

    this.contentTexts.push(this.add.text(GAME_W/2, GAME_H - 20, '↑↓:Select  Z/Enter:Details  X/Esc:Close  Q:Items', { fontSize: '14px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
  }

  renderInventory() {
    const inv = GameData.inventory;
    if (inv.length === 0) {
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2, 'Inventory is empty', { fontSize: '12px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      this.contentTexts.push(this.add.text(GAME_W/2, GAME_H/2 + 16, 'Q:Party  X/Esc:Close', { fontSize: '14px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
      return;
    }

    inv.forEach((item, i) => {
      const isSel = i === this.cursor;
      const y = 36 + i * 18;
      if (y > GAME_H - 24) return;
      const bg = this.add.rectangle(GAME_W/2, y, GAME_W - 36, 16, isSel ? 0x1a1a3a : 0x000000, 0).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);

      const typeColors = {weapon: '#ff8833', armor: '#4488ff', consumable: '#44ff44', material: '#aaaacc', accessory: '#ff66aa', implant: '#44ffff'};
      this.contentTexts.push(this.add.text(20, y - 1, item.type.toUpperCase(), { fontSize: '12px', fontFamily: 'monospace', color: typeColors[item.type] || '#aaaacc' }).setDepth(202));
      this.contentTexts.push(this.add.text(70, y - 1, (isSel ? '> ' : '  ') + item.name + (item.level > 1 ? ' +' + item.level : ''), { fontSize: '9px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));

      let stats = '';
      if (item.atk) stats += 'ATK+' + item.atk + ' ';
      if (item.def) stats += 'DEF+' + item.def + ' ';
      if (item.heal) stats += 'HEAL+' + item.heal + ' ';
      if (stats) this.contentTexts.push(this.add.text(200, y - 1, stats, { fontSize: '14px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(202));

      const rarityColors = {Common: '#aaaacc', Uncommon: '#44ff44', Rare: '#4488ff', Epic: '#aa44ff', Legendary: '#ffcc33'};
      if (item.rarity) this.contentTexts.push(this.add.text(280, y - 1, item.rarity, { fontSize: '14px', fontFamily: 'monospace', color: rarityColors[item.rarity] || '#aaaacc' }).setDepth(202));
    });

    this.contentTexts.push(this.add.text(GAME_W/2, GAME_H - 20, '↑↓:Select  Z/Enter:Use/Equip  X/Esc:Close  Q:Party', { fontSize: '14px', fontFamily: 'monospace', color: '#666688' }).setDepth(201).setOrigin(0.5));
  }

  renderItemAction() {
    const item = GameData.inventory[this._itemIdx];
    if (!item) { this.mode = 'inventory'; this.updateContent(); return; }

    this.contentTexts.push(this.add.text(GAME_W/2, 40, item.name, { fontSize: '12px', fontFamily: 'monospace', color: '#ffffff' }).setDepth(201).setOrigin(0.5));
    this.contentTexts.push(this.add.text(GAME_W/2, 56, item.type.toUpperCase() + (item.rarity ? ' — ' + item.rarity : ''), { fontSize: '9px', fontFamily: 'monospace', color: '#aaaacc' }).setDepth(201).setOrigin(0.5));

    let statsY = 72;
    if (item.atk) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Attack: +' + item.atk, { fontSize: '9px', fontFamily: 'monospace', color: '#ff8833' }).setDepth(201).setOrigin(0.5)); statsY += 14; }
    if (item.def) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Defense: +' + item.def, { fontSize: '9px', fontFamily: 'monospace', color: '#4488ff' }).setDepth(201).setOrigin(0.5)); statsY += 14; }
    if (item.heal) { this.contentTexts.push(this.add.text(GAME_W/2, statsY, 'Heal: +' + item.heal + ' HP', { fontSize: '9px', fontFamily: 'monospace', color: '#44ff44' }).setDepth(201).setOrigin(0.5)); statsY += 14; }

    statsY += 10;
    const actions = ['Equip', 'Drop', 'Cancel'];
    actions.forEach((a, i) => {
      const isSel = i === this.cursor;
      const bg = this.add.rectangle(GAME_W/2, statsY + i * 20, 80, 16, isSel ? 0x1a1a3a : 0x000000, 0).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      this.contentTexts.push(this.add.text(GAME_W/2, statsY + i * 20 - 1, (isSel ? '> ' : '  ') + a, { fontSize: '9px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(202).setOrigin(0.5));
    });
  }

  renderPickChar() {
    this.contentTexts.push(this.add.text(GAME_W/2, 36, 'Equip to who?', { fontSize: '18px', fontFamily: 'monospace', color: '#ffffff' }).setDepth(201).setOrigin(0.5));
    GameData.party.forEach((c, i) => {
      const isSel = i === this.cursor;
      const bg = this.add.rectangle(GAME_W/2, 56 + i * 24, GAME_W - 50, 20, isSel ? 0x1a1a3a : 0x0a0a1a, 0.8).setDepth(201);
      if (isSel) bg.setStrokeStyle(1, 0x44ddff);
      this.contentTexts.push(bg);
      this.contentTexts.push(this.add.text(30, 50 + i * 24, (isSel ? '> ' : '  ') + c.name + ' Lv.' + c.level, { fontSize: '9px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#dddddd' }).setDepth(202));
    });
  }

  update() {
    const { dx, dy, interact, cancel } = getInput(this);
    const gp = this.input.gamepad ? this.input.gamepad.getPad(0) : null;
    const kb = this.input.keyboard;
    const tabPressed = (kb && kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown && Phaser.Input.Keyboard.JustDown(kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q))) ||
                       (gp && gp.buttons[4] && Phaser.Input.Gamepad.JustDown(gp.buttons[4]));
    if (tabPressed && (this.mode === 'party' || this.mode === 'inventory')) {
      this.mode = this.mode === 'party' ? 'inventory' : 'party';
      this.cursor = 0;
      this.updateContent();
    }

    if (this.mode === 'party') {
      if (dy < 0 && this.charIndex > 0) this.charIndex--;
      if (dy > 0 && this.charIndex < GameData.party.length - 1) this.charIndex++;
      if (cancel) { this.scene.stop(); this.scene.get('TownScene').scene.resume(); }
      if (interact) { this.mode = 'equip'; this.cursor = 0; }
      this.updateContent();
    } else if (this.mode === 'inventory') {
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < GameData.inventory.length - 1) this.cursor++;
      if (cancel) { this.scene.stop(); this.scene.get('TownScene').scene.resume(); }
      if (interact && GameData.inventory[this.cursor]) { this.mode = 'itemAction'; this._itemIdx = this.cursor; this.cursor = 0; }
      this.updateContent();
    } else if (this.mode === 'itemAction') {
      const actions = ['Equip', 'Drop', 'Cancel'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < actions.length - 1) this.cursor++;
      if (cancel) { this.mode = 'inventory'; this.cursor = this._itemIdx; }
      if (interact) {
        const act = actions[this.cursor];
        const item = GameData.inventory[this._itemIdx];
        if (act === 'Equip') {
          if (item && (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory' || item.type === 'implant')) {
            this.mode = 'pickChar'; this.cursor = 0;
          } else if (item && item.type === 'consumable' && item.heal) {
            const leader = GameData.party[0];
            if (leader) leader.hp = Math.min(leader.maxHp, leader.hp + item.heal);
            GameData.inventory.splice(this._itemIdx, 1);
            this.mode = 'inventory'; this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1));
          }
        } else if (act === 'Drop') {
          GameData.inventory.splice(this._itemIdx, 1);
          this.mode = 'list'; this.cursor = Math.min(this.cursor, Math.max(0, GameData.inventory.length - 1));
        } else { this.mode = 'inventory'; this.cursor = this._itemIdx; }
      }
      this.updateContent();
    } else if (this.mode === 'pickChar') {
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < GameData.party.length - 1) this.cursor++;
      if (cancel) { this.mode = 'itemAction'; this.cursor = 0; }
      if (interact) {
        const ch = GameData.party[this.cursor];
        const item = GameData.inventory[this._itemIdx];
        if (ch && item) {
          const slot = item.type === 'weapon' ? 'weapon' : item.type === 'armor' ? 'armor' : item.type === 'accessory' ? (ch.equipment.accessory1 ? 'accessory2' : 'accessory1') : item.type === 'implant' ? 'implant' : null;
          if (slot) { const old = ch.equipment[slot]; ch.equipment[slot] = item; GameData.inventory.splice(this._itemIdx, 1); if (old) GameData.inventory.push(old); }
        }
        this.mode = 'inventory'; this.cursor = 0;
      }
      this.updateContent();
    } else if (this.mode === 'equip') {
      if (dy < 0 && this.slotIndex > 0) this.slotIndex--;
      if (dy > 0 && this.slotIndex < 4) this.slotIndex++;
      if (dx < 0 && this.charIndex > 0) this.charIndex--;
      if (dx > 0 && this.charIndex < GameData.party.length - 1) this.charIndex++;
      if (cancel) { this.mode = 'party'; }
      if (interact) {
        const ch = GameData.party[this.charIndex];
        const slots = ['weapon', 'armor', 'accessory1', 'accessory2', 'implant'];
        const slot = slots[this.slotIndex];
        if (ch.equipment[slot]) { GameData.inventory.push(ch.equipment[slot]); ch.equipment[slot] = null; }
      }
      this.renderParty();
      const ch = GameData.party[this.charIndex];
      if (ch) {
        const slots = ['Weapon', 'Armor', 'Acc 1', 'Acc 2', 'Implant'];
        slots.forEach((s, i) => {
          const isSel = i === this.slotIndex;
          const slotKey = ['weapon', 'armor', 'accessory1', 'accessory2', 'implant'][i];
          const item = ch.equipment[slotKey];
          this.contentTexts.push(this.add.text(300, 50 + i * 16, (isSel ? '> ' : '  ') + s + ': ' + (item ? item.name : '-'), { fontSize: '14px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(202));
        });
      }
    }
  }
}
