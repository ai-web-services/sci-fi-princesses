// ═══════════════════════════════════════════════════════════════
// FORGE — D22 crafting service (unlocked at novaStage 2). Consumes
// regional materials + gold for top-tier equipment and each
// companion's signature relic. Reuses ShopScene's window/list layout.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, MenuList, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState, autoSave } from '../game/state.js';
import { addItem, removeItem, spendGold } from '../game/inventory.js';
import { itemData } from '../game/progression.js';
import { RECIPES } from '../data/recipes.js';
import { uiSfx } from '../engine/audio.js';
import {
  INFUSIONS, affixLabels, enhanceGear, enhancementCost, gearId, gearLabel,
  infusionCost, infuseGear, normalizeGearEntry, transcendCost, transcendGear
} from '../game/gearProgression.js';

function ownedQty(id) {
  const stack = GameState.inventory.find(s => s.id === id);
  return stack ? stack.qty : 0;
}

export class ForgeScene extends Phaser.Scene {
  constructor() { super({ key: 'ForgeScene' }); }

  init(data) {
    this.parentScene = data.parentScene || 'MapScene';
    this.resolve = data.resolve || (() => {});
  }

  create() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05030c, 0.86);
    this.win = new Win(this, 28, 20, GAME_W - 56, GAME_H - 40);
    this.win.addText(18, 14, 'THE FORGE', { scale: 2, color: RAMP.uiGold[3] });
    this.win.addText(18, 40, 'Craft top-tier gear from campaign trophies', { scale: 1, color: uiDimColor() });
    this.goldText = this.win.addText(this.win.w - 140, 18, '', { scale: 1, color: RAMP.uiGold[4] });
    this.notice = null;
    this.buildRoot();
    swallowInput();
  }

  refreshGold() { this.goldText.setText('Gold: ' + GameState.gold); }

  clearMenu() {
    if (this.menu) { this.menu.destroy(); this.menu = null; }
    if (this.detail) { this.detail.destroy(); this.detail = null; }
    if (this.confirmWin) { this.confirmWin.destroy(); this.confirmWin = null; }
    if (this.confirmMenu) { this.confirmMenu.destroy(); this.confirmMenu = null; }
  }

  canCraft(recipe) {
    if (GameState.gold < recipe.gold) return false;
    return recipe.materials.every(m => ownedQty(m.id) >= m.qty);
  }

  weaponFamily() { return GameState.action?.weapon || 'blade'; }
  equippedWeapon() { return normalizeGearEntry(GameState.actionArsenal?.[this.weaponFamily()]); }
  canPay(cost) {
    return !!cost && GameState.gold >= cost.gold && cost.materials.every(material => ownedQty(material.id) >= material.qty);
  }
  pay(cost) {
    if (!this.canPay(cost) || !spendGold(cost.gold)) return false;
    for (const material of cost.materials) removeItem(material.id, material.qty);
    return true;
  }

  buildRoot() {
    this.clearMenu();
    this.refreshGold();
    const recipes = Object.values(RECIPES);
    const gear = this.equippedWeapon();
    const nextCost = enhancementCost(gear);
    const finalCost = transcendCost(gear);
    const items = [
      { label: nextCost ? `Enhance ${gearLabel(itemData(gearId(gear)), gear)}` : gear?.transcended ? 'Weapon Transcended' : 'Transcend +10 Weapon', value: nextCost ? 'enhance' : 'transcend', gearAction: true, disabled: !this.canPay(nextCost || finalCost) },
      { label: 'Infuse Equipped Weapon', value: 'infuse', gearAction: true, disabled: !gear },
      ...recipes.map(r => ({
      label: r.name, value: r.id, recipe: r,
      disabled: !this.canCraft(r)
      }))
    ];
    items.push({ label: 'Leave', value: 'leave' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 74, items, {
      width: 184, lineH: 20, visible: 8,
      onChange: item => item.gearAction ? this.showGearDetail(item.value) : this.showDetail(item.recipe),
      onSelect: item => {
        if (item.value === 'leave') this.close();
        else if (item.value === 'infuse') this.buildInfusions();
        else if (item.gearAction) this.askGearConfirm(item.value);
        else this.askConfirm(item.recipe);
      },
      onCancel: () => this.close()
    });
    if (this.menu.selected.gearAction) this.showGearDetail(this.menu.selected.value);
    else this.showDetail(this.menu.selected.recipe);
  }

  showGearDetail(action) {
    if (this.detail) this.detail.destroy();
    const gear = this.equippedWeapon();
    const item = itemData(gearId(gear));
    if (!gear || !item) return;
    this.detail = new Win(this, this.win.x + 216, this.win.y + 68, this.win.w - 232, 146);
    this.detail.addText(14, 14, gearLabel(item, gear), { scale: 1, color: RAMP.uiGold[4], maxWidth: this.detail.w - 28 });
    const cost = action === 'enhance' ? enhancementCost(gear) : action === 'transcend' ? transcendCost(gear) : null;
    const affixes = affixLabels(gear);
    const materials = cost?.materials.map(material => `${itemData(material.id)?.name || material.id} ${ownedQty(material.id)}/${material.qty}`).join('\n') || 'Choose an elemental material.';
    this.detail.addText(14, 42, `${gear.enhancement}/10 enhancement\n${gear.infusion ? INFUSIONS[gear.infusion].name + ' infusion' : 'No infusion'}\n${affixes.join(' · ') || 'Affixes unlock at +3/+6/+9'}`, { scale: 1, color: 0xe8e8f4, maxWidth: this.detail.w - 28, lineH: 12 });
    this.detail.addText(14, 104, `${materials}${cost ? `\n${cost.gold} gold` : ''}`, { scale: 1, color: uiDimColor(), maxWidth: this.detail.w - 28, lineH: 12 });
  }

  buildInfusions() {
    this.clearMenu();
    const gear = this.equippedWeapon();
    const items = Object.entries(INFUSIONS).map(([type, infusion]) => ({
      label: `${infusion.name} · ${itemData(infusion.material)?.name || infusion.material}`,
      value: type, cost: infusionCost(type), disabled: !this.canPay(infusionCost(type))
    }));
    items.push({ label: 'Back', value: 'back' });
    this.menu = new MenuList(this, this.win.x + 22, this.win.y + 74, items, {
      width: 184, lineH: 20, visible: 8,
      onChange: item => item.value !== 'back' && this.showInfusionDetail(gear, item.value),
      onSelect: item => item.value === 'back' ? this.buildRoot() : this.askGearConfirm('infuse', item.value),
      onCancel: () => this.buildRoot()
    });
    if (this.menu.selected.value !== 'back') this.showInfusionDetail(gear, this.menu.selected.value);
  }

  showInfusionDetail(gear, type) {
    if (this.detail) this.detail.destroy();
    const infusion = INFUSIONS[type], cost = infusionCost(type);
    this.detail = new Win(this, this.win.x + 216, this.win.y + 68, this.win.w - 232, 146);
    this.detail.addText(14, 14, `${infusion.name} Infusion`, { scale: 1, color: RAMP.uiGold[4] });
    this.detail.addText(14, 40, `${infusion.damageType ? infusion.damageType.toUpperCase() + ' damage' : 'Vital reinforcement'}\n+${infusion.bonus} ${infusion.stat.toUpperCase()}\nReplaces the current infusion.`, { scale: 1, color: 0xe8e8f4, maxWidth: this.detail.w - 28, lineH: 13 });
    this.detail.addText(14, 100, `${itemData(cost.materials[0].id)?.name} ${ownedQty(cost.materials[0].id)}/1\n${cost.gold} gold`, { scale: 1, color: uiDimColor(), lineH: 12 });
  }

  askGearConfirm(action, infusionType = null) {
    const gear = this.equippedWeapon();
    const cost = action === 'enhance' ? enhancementCost(gear) : action === 'transcend' ? transcendCost(gear) : infusionCost(infusionType);
    if (!this.canPay(cost)) { uiSfx('error'); return; }
    this.menu.setVisible(false);
    this.confirmWin = new Win(this, GAME_W / 2 - 145, GAME_H / 2 - 52, 290, 104);
    const verb = action === 'infuse' ? `Apply ${INFUSIONS[infusionType].name} infusion?` : action === 'transcend' ? 'Transcend this +10 weapon?' : `Enhance weapon to +${gear.enhancement + 1}?`;
    this.confirmWin.addText(16, 14, verb, { scale: 1, maxWidth: 258 });
    this.confirmMenu = new MenuList(this, this.confirmWin.x + 16, this.confirmWin.y + 56, [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], { width: 250, lineH: 18, onSelect: item => item.value === 'yes' ? this.applyGearAction(action, infusionType, cost) : this.closeConfirm(), onCancel: () => this.closeConfirm() });
  }

  applyGearAction(action, infusionType, cost) {
    if (!this.pay(cost)) { uiSfx('error'); this.closeConfirm(); return; }
    const current = this.equippedWeapon();
    const next = action === 'enhance' ? enhanceGear(current) : action === 'transcend' ? transcendGear(current) : infuseGear(current, infusionType);
    if (!next) { uiSfx('error'); return; }
    GameState.actionArsenal[this.weaponFamily()] = next;
    uiSfx('confirm'); autoSave('The Forge'); this.closeConfirm(); this.buildRoot();
  }

  showDetail(recipe) {
    if (this.detail) this.detail.destroy();
    if (!recipe) return;
    this.detail = new Win(this, this.win.x + 216, this.win.y + 68, this.win.w - 232, 146);
    const result = itemData(recipe.result);
    this.detail.addText(14, 14, result ? result.name : recipe.name, { scale: 1, color: RAMP.uiGold[4] });
    this.detail.addText(14, 38, recipe.desc, { scale: 1, color: 0xe8e8f4, maxWidth: this.detail.w - 28, lineH: 11 });
    const matLines = recipe.materials.map(m => {
      const data = itemData(m.id);
      const owned = ownedQty(m.id);
      return `${data ? data.name : m.id}  ${owned}/${m.qty}`;
    }).join('\n');
    this.detail.addText(14, 76, 'Materials:\n' + matLines, {
      scale: 1, color: uiDimColor(), lineH: 13
    });
    this.detail.addText(14, 92 + recipe.materials.length * 13, 'Cost: ' + recipe.gold + ' gold', {
      scale: 1, color: uiDimColor()
    });
  }

  askConfirm(recipe) {
    if (!this.canCraft(recipe)) { uiSfx('error'); return; }
    this.menu.setVisible(false);
    const result = itemData(recipe.result);
    this.confirmWin = new Win(this, GAME_W / 2 - 145, GAME_H / 2 - 52, 290, 104);
    this.confirmWin.addText(16, 14, 'Craft ' + (result ? result.name : recipe.name) + ' for ' + recipe.gold + 'g?', {
      scale: 1, maxWidth: 258
    });
    this.confirmMenu = new MenuList(this, this.confirmWin.x + 16, this.confirmWin.y + 56, [
      { label: 'No', value: 'no' }, { label: 'Yes', value: 'yes' }
    ], {
      width: 250, lineH: 18,
      onSelect: item => item.value === 'yes' ? this.craft(recipe) : this.closeConfirm(),
      onCancel: () => this.closeConfirm()
    });
  }

  closeConfirm() {
    if (this.confirmWin) this.confirmWin.destroy();
    if (this.confirmMenu) this.confirmMenu.destroy();
    this.confirmWin = null; this.confirmMenu = null;
    if (this.menu) this.menu.setVisible(true);
  }

  craft(recipe) {
    if (!this.canCraft(recipe)) { uiSfx('error'); this.closeConfirm(); return; }
    if (!spendGold(recipe.gold)) { uiSfx('error'); this.closeConfirm(); return; }
    for (const m of recipe.materials) removeItem(m.id, m.qty);
    addItem(recipe.result, 1);
    uiSfx('confirm');
    autoSave('The Forge');
    this.closeConfirm();
    this.buildRoot();
  }

  close() {
    autoSave('The Forge');
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
