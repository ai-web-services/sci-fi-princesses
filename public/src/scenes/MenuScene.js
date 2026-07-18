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
import { gearId, gearLabel, normalizeGearEntry } from '../game/gearProgression.js';

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
    const rootItems = [
      { label: 'Character Sheet', value: 'sheet' },
      { label: 'Party', value: 'party' },
      { label: 'Equipment', value: 'equipment' },
      { label: 'Items', value: 'items' },
      { label: 'Quest Journal', value: 'quests' },
      ...(this.parentScene === 'ExpeditionScene' ? [{ label: 'Region Overview', value: 'region' }] : []),
      { label: 'Records', value: 'records' },
      { label: 'Save', value: 'save' },
      { label: 'Options', value: 'options' },
      { label: 'Close', value: 'close' }
    ];
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 62, rootItems, {
      width: 154, lineH: 20,
      onSelect: item => this.chooseRoot(item.value),
      onCancel: () => this.close()
    });
    const party = GameState.active.map(id => {
      const rec = GameState.chars[id];
      const data = charData(id);
      return `${data ? data.name : id}  Lv${rec.level}  HP ${rec.hp}/${rec.maxHp}`;
    }).join('\n');
    this.addText(this.win.x + 190, this.win.y + 66, party || 'No active party.', {
      scale: 1, color: 0xe8e8f4, lineH: 18
    });
    this.addText(this.win.x + 190, this.win.y + 158,
      `Shards: ${GameState.shards.length}\nVisited: ${GameState.mapsVisited.length}\nPlaytime continues while exploring.`,
      { scale: 1, color: uiDimColor(), lineH: 16 });
  }

  chooseRoot(value) {
    if (value === 'close') return this.close();
    if (value === 'sheet') return this.openScene('CharacterSheetScene', { parentScene: this.parentScene, backScene: 'MenuScene' });
    if (value === 'quests') return this.openScene('QuestJournalScene', { parentScene: this.parentScene });
    if (value === 'save') return this.openScene('SaveLoadScene', {
      mode: 'save', back: 'MenuScene',
      backData: { parentScene: this.parentScene, locationName: this.locationName },
      locationName: this.locationName
    });
    if (value === 'options') return this.openScene('OptionsScene', {
      back: 'MenuScene',
      backData: { parentScene: this.parentScene, locationName: this.locationName }
    });
    if (value === 'party') return this.buildCharacterList('party');
    if (value === 'equipment') return this.buildCharacterList('equipment');
    if (value === 'items') return this.buildItems();
    if (value === 'region') return this.buildRegionOverview();
    if (value === 'records') return this.buildRecords();
  }

  buildRegionOverview() {
    this.clearView();
    this.title.setText('LUMENWILD REGION OVERVIEW');
    const expedition = this.scene.get('ExpeditionScene');
    if (!expedition?.region) return this.buildRoot();
    const mapX = this.win.x + 38, mapY = this.win.y + 58, mapW = 250, mapH = 164;
    const graphics = this.add.graphics(); this.detailObjects.push(graphics);
    graphics.fillStyle(0x0b1721, 1).fillRoundedRect(mapX, mapY, mapW, mapH, 5);
    const project = anchor => ({ x: mapX + anchor.x / expedition.region.width * mapW, y: mapY + anchor.y / expedition.region.height * mapH });
    for (const [fromId, toId] of expedition.region.edges) {
      const from = project(expedition.region.anchors[fromId]), to = project(expedition.region.anchors[toId]);
      graphics.lineStyle(2, 0x496a70, 0.75).lineBetween(from.x, from.y, to.x, to.y);
    }
    const objectiveOrder = ['landing', 'relay', 'shrine', 'miniboss', 'bossGate', 'bossArena'];
    for (const id of objectiveOrder) {
      const point = project(expedition.region.anchors[id]);
      const reached = id === 'landing' || GameState.expedition.checkpoint === 'shrine' || GameState.expedition.objective !== 'relay';
      graphics.fillStyle(reached ? 0x66e8e0 : 0x6b7184, 1).fillCircle(point.x, point.y, id === 'bossArena' ? 6 : 4);
      this.addText(point.x + 7, point.y - 4, id.replace(/([A-Z])/g, ' $1').toUpperCase(), { scale: 1, color: reached ? 0xffffff : 0x8290a0 });
    }
    const player = project({ x: expedition.px / 16, y: expedition.py / 16 });
    graphics.fillStyle(0xffd166, 1).fillStar(player.x, player.y, 4, 3, 7);
    this.addText(this.win.x + 310, this.win.y + 72, `◆ LYRA\n\n${GameState.expedition.objective.toUpperCase()}\n${GameState.expedition.checkpoint === 'shrine' ? 'Shrine checkpoint active' : 'Landing beacon active'}\n\nSeed ${expedition.region.seed}`, { scale: 1, color: 0xe8e8f4, lineH: 16, maxWidth: 110 });
    this.menu = new MenuList(this, this.win.x + 324, this.win.y + 202, [{ label: 'Back', value: 'back' }], { width: 90, onSelect: () => this.buildRoot(), onCancel: () => this.buildRoot() });
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
      width: 154, lineH: 20,
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
      .map(([slot, equipped]) => `${slot}: ${gearLabel(itemData(gearId(equipped)), equipped)}`).join('\n') || 'No equipment';
    this.addText(this.win.x + 190, this.win.y + 62,
      `${data?.name || id}\n${data?.role || ''}\nLv${rec.level}  XP ${rec.xp}\nHP ${rec.hp}/${stats.maxHp}  SP ${rec.sp}/${stats.maxSp}\nATK ${stats.atk}  MAG ${stats.mag}\nDEF ${stats.def}  RES ${stats.res}  SPD ${stats.spd}\n\n${equipment}`,
      { scale: 1, color: 0xe8e8f4, lineH: 14, maxWidth: 226 });
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
      width: 184, lineH: 18, visible: 9,
      onSelect: entry => {
        if (entry.value === 'back') return this.buildCharacterList('equipment');
        const rec = GameState.chars[characterId], item = entry.row.item;
        const slot = item.slot === 'accessory'
          ? (!rec.equipment.accessory1 ? 'accessory1' : 'accessory2')
          : item.slot;
        const old = rec.equipment[slot];
        if (!removeItem(item.id, 1)) return uiSfx('error');
        if (old) {
          const oldId = gearId(old);
          const stack = GameState.inventory.find(s => s.id === oldId);
          if (stack) stack.qty++; else GameState.inventory.push({ id: oldId, qty: 1 });
        }
        rec.equipment[slot] = normalizeGearEntry(item.id);
        refreshVitals(characterId);
        uiSfx('confirm');
        this.buildEquipment(characterId);
      },
      onCancel: () => this.buildCharacterList('equipment')
    });
    this.addText(this.win.x + 226, this.win.y + 66,
      rows.length ? 'Choose gear to equip.\nExisting gear returns to inventory.' : 'No compatible gear in inventory.',
      { scale: 1, color: uiDimColor(), lineH: 14, maxWidth: 190 });
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
      width: 184, lineH: 18, visible: 9,
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
    this.addText(this.win.x + 226, this.win.y + 66, row.item.name + '\n\n' + row.item.desc, {
      scale: 1, color: 0xe8e8f4, lineH: 13, maxWidth: 190
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
      width: 154, lineH: 20,
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
    this.addText(this.win.x + 190, this.win.y + 66, lines || 'No records discovered yet.', {
      scale: 1, color: lines ? 0xe8e8f4 : uiDimColor(), lineH: 14, maxWidth: 226
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
