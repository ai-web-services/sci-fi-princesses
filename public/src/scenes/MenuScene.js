// ═══════════════════════════════════════════════════════════════
// MAIN MENU — Party, equipment, items, journal, records, save,
// and options from one pause-safe overlay.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState } from '../game/state.js';
import { itemData, charData, effectiveStats, refreshVitals } from '../game/progression.js';
import { removeItem } from '../game/inventory.js';
import { uiSfx } from '../engine/audio.js';
import { ENEMIES } from '../data/enemies.js';
import { RESONANCES } from '../data/resonance.js';
import { bondStageName } from '../game/relationships.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  init(data) {
    this.parentScene = data.parentScene || 'MapScene';
    this.locationName = data.locationName || GameState.map;
  }

  create() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05030c, 0.88);
    this.win = new Win(this, 16, 12, GAME_W - 32, GAME_H - 24);
    this.title = this.win.addText(16, 12, 'ROYAL FIELD MENU', { scale: 2, color: RAMP.uiGold[3] });
    this.gold = this.win.addText(this.win.w - 120, 16, 'Gold: ' + GameState.gold, {
      scale: 1, color: RAMP.uiGold[4]
    });
    this.detailObjects = [];
    this.buildRoot();
    swallowInput();
  }

  clearView() {
    if (this.menu) { this.menu.destroy(); this.menu = null; }
    for (const object of this.detailObjects) object.destroy();
    this.detailObjects = [];
  }

  addText(x, y, text, opts = {}) {
    const t = new PixelText(this, x, y, text, opts);
    this.detailObjects.push(t);
    return t;
  }

  buildRoot() {
    this.clearView();
    this.title.setText('ROYAL FIELD MENU');
    this.gold.setText('Gold: ' + GameState.gold);
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, [
      { label: 'Party', value: 'party' },
      { label: 'Equipment', value: 'equipment' },
      { label: 'Items', value: 'items' },
      { label: 'Quest Journal', value: 'quests' },
      { label: 'Records', value: 'records' },
      { label: 'Save', value: 'save' },
      { label: 'Options', value: 'options' },
      { label: 'Close', value: 'close' }
    ], {
      width: 190, lineH: 24,
      onSelect: item => this.chooseRoot(item.value),
      onCancel: () => this.close()
    });
    const party = GameState.active.map(id => {
      const rec = GameState.chars[id];
      const data = charData(id);
      return `${data ? data.name : id}  Lv${rec.level}  HP ${rec.hp}/${rec.maxHp}`;
    }).join('\n');
    this.addText(this.win.x + 250, this.win.y + 72, party || 'No active party.', {
      scale: 1, color: 0xe8e8f4, lineH: 18
    });
    this.addText(this.win.x + 250, this.win.y + 182,
      `Shards: ${GameState.shards.length}\nVisited: ${GameState.mapsVisited.length}\nPlaytime continues while exploring.`,
      { scale: 1, color: uiDimColor(), lineH: 16 });
  }

  chooseRoot(value) {
    if (value === 'close') return this.close();
    if (value === 'quests') return this.openScene('QuestJournalScene', { parentScene: this.parentScene });
    if (value === 'save') return this.openScene('SaveLoadScene', {
      mode: 'save', back: 'MapScene',
      backData: { mapId: GameState.map, entry: { x: GameState.x, y: GameState.y, dir: GameState.dir } },
      locationName: this.locationName
    });
    if (value === 'options') return this.openScene('OptionsScene', {
      back: 'MapScene',
      backData: { mapId: GameState.map, entry: { x: GameState.x, y: GameState.y, dir: GameState.dir } }
    });
    if (value === 'party') return this.buildCharacterList('party');
    if (value === 'equipment') return this.buildCharacterList('equipment');
    if (value === 'items') return this.buildItems();
    if (value === 'records') return this.buildRecords();
  }

  openScene(key, data) {
    this.scene.stop();
    this.scene.launch(key, data);
  }

  buildCharacterList(mode) {
    this.clearView();
    this.title.setText(mode === 'party' ? 'PARTY FORMATION' : 'EQUIPMENT');
    const items = GameState.roster.map(id => {
      const data = charData(id);
      return { label: (GameState.active.includes(id) ? '◆ ' : '○ ') + (data ? data.name : id), value: id };
    });
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, items, {
      width: 220, lineH: 22,
      onChange: item => item.value !== 'back' && this.showCharacter(item.value),
      onSelect: item => {
        if (item.value === 'back') this.buildRoot();
        else if (mode === 'party') this.toggleActive(item.value);
        else this.buildEquipment(item.value);
      },
      onCancel: () => this.buildRoot()
    });
    if (this.menu.selected.value !== 'back') this.showCharacter(this.menu.selected.value);
  }

  showCharacter(id) {
    for (const object of this.detailObjects) object.destroy();
    this.detailObjects = [];
    const data = charData(id), rec = GameState.chars[id], stats = effectiveStats(id);
    const equipment = Object.entries(rec.equipment || {})
      .map(([slot, item]) => `${slot}: ${itemData(item)?.name || item}`).join('\n') || 'No equipment';
    this.addText(this.win.x + 270, this.win.y + 66,
      `${data?.name || id}\n${data?.role || ''}\nLv${rec.level}  XP ${rec.xp}\nHP ${rec.hp}/${stats.maxHp}  SP ${rec.sp}/${stats.maxSp}\nATK ${stats.atk}  MAG ${stats.mag}\nDEF ${stats.def}  RES ${stats.res}  SPD ${stats.spd}\n\n${equipment}`,
      { scale: 1, color: 0xe8e8f4, lineH: 16, maxWidth: 310 });
  }

  toggleActive(id) {
    const index = GameState.active.indexOf(id);
    if (index >= 0) {
      if (GameState.active.length <= 1) return uiSfx('error');
      GameState.active.splice(index, 1);
    } else {
      if (GameState.active.length >= 3) return uiSfx('error');
      GameState.active.push(id);
    }
    uiSfx('confirm');
    this.buildCharacterList('party');
  }

  buildEquipment(characterId) {
    this.clearView();
    const data = charData(characterId);
    this.title.setText('EQUIP — ' + (data ? data.name : characterId));
    const rows = GameState.inventory.map(stack => {
      const item = itemData(stack.id);
      const equippable = item && ['weapon', 'armor', 'accessory'].includes(item.type);
      const allowed = equippable && (!item.usableBy || item.usableBy.includes(characterId));
      return allowed ? { stack, item } : null;
    }).filter(Boolean);
    const items = rows.map(row => ({ label: row.item.name + '  x' + row.stack.qty, value: row.stack.id, row }));
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, items, {
      width: 270, lineH: 20, visible: 12,
      onSelect: entry => {
        if (entry.value === 'back') return this.buildCharacterList('equipment');
        const rec = GameState.chars[characterId], item = entry.row.item;
        const slot = item.slot === 'accessory'
          ? (!rec.equipment.accessory1 ? 'accessory1' : 'accessory2')
          : item.slot;
        const old = rec.equipment[slot];
        if (!removeItem(item.id, 1)) return uiSfx('error');
        if (old) {
          const stack = GameState.inventory.find(s => s.id === old);
          if (stack) stack.qty++; else GameState.inventory.push({ id: old, qty: 1 });
        }
        rec.equipment[slot] = item.id;
        refreshVitals(characterId);
        uiSfx('confirm');
        this.buildEquipment(characterId);
      },
      onCancel: () => this.buildCharacterList('equipment')
    });
    this.addText(this.win.x + 330, this.win.y + 72,
      rows.length ? 'Choose gear to equip.\nExisting gear returns to inventory.' : 'No compatible gear in inventory.',
      { scale: 1, color: uiDimColor(), lineH: 16, maxWidth: 250 });
  }

  buildItems() {
    this.clearView();
    this.title.setText('ITEMS');
    const rows = GameState.inventory.map(stack => ({ stack, item: itemData(stack.id) })).filter(row => row.item);
    const items = rows.map(row => {
      const effect = row.item.effect || {};
      const fieldUsable = !!(effect.heal || effect.healFrac || effect.sp || effect.revive);
      const suffix = row.item.type === 'consumable' && !fieldUsable ? ' [Battle]' : '';
      return { label: `${row.item.name}${suffix}  x${row.stack.qty}`, value: row.stack.id, row, fieldUsable };
    });
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, items, {
      width: 280, lineH: 20, visible: 12,
      onChange: item => this.showItem(item.row),
      onSelect: entry => {
        if (entry.value === 'back') return this.buildRoot();
        if (entry.row.item.type !== 'consumable' || !entry.fieldUsable) return uiSfx('error');
        this.useItem(entry.row);
      },
      onCancel: () => this.buildRoot()
    });
    this.showItem(this.menu.selected.row);
  }

  showItem(row) {
    for (const object of this.detailObjects) object.destroy();
    this.detailObjects = [];
    if (!row) return;
    this.addText(this.win.x + 330, this.win.y + 72, row.item.name + '\n\n' + row.item.desc, {
      scale: 1, color: 0xe8e8f4, lineH: 14, maxWidth: 250
    });
  }

  useItem(row) {
    const targetId = GameState.active[0], rec = GameState.chars[targetId], effect = row.item.effect || {};
    let used = false;
    if (effect.heal || effect.healFrac) {
      const amount = effect.heal || Math.round(rec.maxHp * effect.healFrac);
      if (rec.hp < rec.maxHp && rec.hp > 0) { rec.hp = Math.min(rec.maxHp, rec.hp + amount); used = true; }
    } else if (effect.sp) {
      if (rec.sp < rec.maxSp) { rec.sp = Math.min(rec.maxSp, rec.sp + effect.sp); used = true; }
    } else if (effect.revive && rec.hp <= 0) {
      rec.hp = Math.max(1, Math.round(rec.maxHp * effect.revive)); used = true;
    }
    if (!used || !removeItem(row.item.id, 1)) return uiSfx('error');
    uiSfx('confirm');
    this.buildItems();
  }

  buildRecords() {
    this.clearView();
    this.title.setText('RECORDS');
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, [
      { label: 'Bestiary', value: 'bestiary' },
      { label: 'Resonance', value: 'resonance' },
      { label: 'Bonds', value: 'bonds' },
      { label: 'Lore', value: 'lore' },
      { label: 'Back', value: 'back' }
    ], {
      width: 190, lineH: 24,
      onChange: item => this.showRecord(item.value),
      onSelect: item => item.value === 'back' && this.buildRoot(),
      onCancel: () => this.buildRoot()
    });
    this.showRecord('bestiary');
  }

  showRecord(type) {
    for (const object of this.detailObjects) object.destroy();
    this.detailObjects = [];
    let lines;
    if (type === 'bestiary') {
      lines = Object.keys(GameState.bestiary).map(id => `◆ ${ENEMIES[id]?.name || readableId(id)}`).join('\n');
    } else if (type === 'resonance') {
      lines = GameState.resonancesFound.map(id => {
        const record = RESONANCES.find(entry => entry.id === id);
        return `◆ ${record?.name || readableId(id)}`;
      }).join('\n');
    } else if (type === 'bonds') {
      lines = GameState.roster.filter(id => id !== 'lyra').map(id => {
        const data = charData(id);
        return `◆ ${data ? data.name : readableId(id)} — ${bondStageName(id)}`;
      }).join('\n');
    } else if (type === 'lore') {
      lines = GameState.lore.map(id => `◆ ${readableId(id)}`).join('\n');
    }
    else return;
    this.addText(this.win.x + 250, this.win.y + 70, lines || 'No records discovered yet.', {
      scale: 1, color: lines ? 0xe8e8f4 : uiDimColor(), lineH: 16, maxWidth: 330
    });
  }

  close() {
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent && parent.scene) {
      parent.modalOpen = false;
      parent.scene.resume();
    }
    swallowInput();
  }

  update(time) {
    const inp = pollInput(this, time);
    if (inp.menued || inp.cancelled && !this.menu) return this.close();
    if (this.menu) this.menu.handle(inp);
  }
}

function readableId(id) {
  return String(id).replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
