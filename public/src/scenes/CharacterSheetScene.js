// ═══ CHARACTER SHEET — transparent action-RPG progression inspection.

import { GAME_W, GAME_H } from '../config.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Win, uiDimColor } from '../engine/ui.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState } from '../game/state.js';
import { charData, itemData, statBreakdown, xpForLevel } from '../game/progression.js';
import { bondStageName } from '../game/relationships.js';
import { SKILLS } from '../data/skills.js';
import { affixLabels, gearId, gearLabel, normalizeGearEntry } from '../game/gearProgression.js';

const PAGES = ['OVERVIEW', 'STATS', 'LOADOUT', 'BUILD'];
const RARITY_COLORS = {
  common: 0xb8bec9, uncommon: 0x66d995, rare: 0x55aaff,
  epic: 0xc176f2, legendary: 0xffb347, crownRelic: 0xffe46b
};

export class CharacterSheetScene extends Phaser.Scene {
  constructor() { super({ key: 'CharacterSheetScene' }); }
  init(data) {
    this.parentScene = data.parentScene || 'MapScene';
    this.backScene = data.backScene || 'MenuScene';
    this.characterIndex = Math.max(0, GameState.roster.indexOf(data.characterId || GameState.active[0] || 'lyra'));
    this.pageIndex = 0;
  }

  create() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x04030b, 0.94);
    this.win = new Win(this, 12, 10, GAME_W - 24, GAME_H - 20);
    this.dynamic = [];
    this.render();
    swallowInput();
  }

  clearDynamic() { for (const object of this.dynamic) object.destroy(); this.dynamic = []; }
  text(x, y, value, options = {}) {
    const object = new PixelText(this, x, y, String(value), options);
    this.dynamic.push(object); return object;
  }

  render() {
    this.clearDynamic();
    const id = GameState.roster[this.characterIndex] || 'lyra';
    const rec = GameState.chars[id], data = charData(id), breakdown = statBreakdown(id);
    const page = PAGES[this.pageIndex];
    this.text(28, 22, data?.name?.toUpperCase() || id.toUpperCase(), { scale: 2, color: RAMP.uiGold[4] });
    const pageText = this.text(0, 25, `◀ ${page} ▶`, { scale: 1, color: 0x66e8e0 });
    pageText.x = GAME_W - 28 - pageText.textW;
    this.text(28, 48, `${data?.species || 'Unknown'} · ${data?.role || ''}`, { scale: 1, color: uiDimColor() });
    if (page === 'OVERVIEW') this.overview(id, rec, data, breakdown);
    else if (page === 'STATS') this.stats(breakdown);
    else if (page === 'LOADOUT') this.loadout(rec);
    else this.build(id, rec, breakdown);
    this.text(28, 246, '←/→ page · ↑/↓ hero · Cancel back', { scale: 1, color: uiDimColor() });
  }

  overview(id, rec, data, breakdown) {
    if (this.textures.exists(`actor_${id}`)) this.dynamic.push(this.add.image(68, 145, `actor_${id}`, 'down0').setScale(2.5).setOrigin(0.5, 1));
    const next = xpForLevel(rec.level + 1);
    const action = id === 'lyra' ? GameState.action : null;
    const evolution = breakdown?.evolutionName || 'Base Form';
    const relationship = id === 'lyra' ? 'Crown-bonded protagonist' : `${bondStageName(id)} · ${(GameState.relationships[id]?.battles || 0)} battles`;
    this.text(118, 76,
      `LEVEL ${rec.level}     XP ${rec.xp}/${next || 'MAX'}\n` +
      `HP ${rec.hp}/${breakdown.final.maxHp}     CROWN ${action?.energy ?? rec.sp}/${action?.maxEnergy ?? breakdown.final.maxSp}\n` +
      `STAMINA ${action?.stamina ?? '—'}/${action?.maxStamina ?? '—'}\n\n` +
      `EVOLUTION  ${evolution}\nRELATIONSHIP  ${relationship}\n\n${data?.desc || ''}`,
      { scale: 1, color: 0xe8e8f4, maxWidth: 326, lineH: 14 });
  }

  stats(breakdown) {
    const b = breakdown.baseAtLevel, g = breakdown.gear, f = breakdown.final;
    const row = (label, key, y) => this.text(34, y,
      `${label.padEnd(5)} ${String(f[key]).padStart(4)}   = level ${String(b[key]).padStart(3)}  + gear ${String(g[key]).padStart(3)}`,
      { scale: 1, color: 0xe8e8f4 });
    row('HP', 'maxHp', 76); row('CROWN', 'maxSp', 94); row('ATK', 'atk', 112);
    row('MAG', 'mag', 130); row('DEF', 'def', 148); row('RES', 'res', 166); row('SPD', 'spd', 184);
    this.text(300, 76, `CRIT ${f.crit}%\nEVADE ${Math.round(f.evade * 100)}%`, { scale: 1, color: RAMP.uiGold[3], lineH: 16 });
    this.text(34, 210, `Species: ${breakdown.speciesEffects.join(' · ')}\nEvolution multiplier: ×${breakdown.evolutionMult.toFixed(2)} (applied before gear)`,
      { scale: 1, color: uiDimColor(), maxWidth: 408, lineH: 12 });
  }

  loadout(rec) {
    let y = 76;
    if (GameState.actionArsenal && rec === GameState.chars.lyra) {
      for (const family of ['blade', 'lance', 'wand']) {
        const equipped = GameState.actionArsenal[family], gear = normalizeGearEntry(equipped);
        const item = itemData(gearId(gear)); if (!item) continue;
        const rarity = gear.transcended ? 'crownRelic' : item.rarity;
        this.text(34, y, `${family.toUpperCase().padEnd(8)} ${gearLabel(item, gear)}`, { scale: 1, color: RARITY_COLORS[rarity] || 0xe8e8f4 });
        y += 17;
      }
    }
    for (const [slot, equipped] of Object.entries(rec.equipment || {})) {
      if (slot === 'weapon' && rec === GameState.chars.lyra) continue;
      const gear = normalizeGearEntry(equipped);
      const item = itemData(gearId(gear)); if (!item) continue;
      const rarity = gear.transcended ? 'crownRelic' : item.rarity || 'common';
      this.text(34, y, `${slot.toUpperCase().padEnd(8)} ${gearLabel(item, gear)}`, { scale: 1, color: RARITY_COLORS[rarity] || 0xe8e8f4 });
      y += 17;
      const affixes = affixLabels(gear);
      if (affixes.length) { this.text(58, y, affixes.join(' · '), { scale: 1, color: uiDimColor() }); y += 16; }
    }
    const skillY = Math.max(154, y + 5);
    this.text(34, skillY, 'ACTIVE SKILLS', { scale: 1, color: RAMP.uiGold[3] });
    const skills = (rec.skillsKnown || []).map(id => SKILLS[id]?.name || id).join(' · ') || 'None';
    this.text(34, skillY + 18, skills, { scale: 1, color: 0xe8e8f4, maxWidth: 408, lineH: 13 });
    const passives = Object.entries(statBreakdown(GameState.roster[this.characterIndex]).final.passives || {})
      .map(([key, value]) => `${key}: ${typeof value === 'number' ? value : 'active'}`).join(' · ') || 'No equipment passives';
    this.text(34, 218, `PASSIVES  ${passives}`, { scale: 1, color: uiDimColor(), maxWidth: 408 });
  }

  build(id, rec, breakdown) {
    const mastery = rec.weaponMastery || {};
    const modifiers = Object.keys(rec.build || {}).map(key => key.replace(/([A-Z])/g, ' $1')).join(' · ') || 'No run modifiers yet';
    this.text(34, 76, `WEAPON MASTERY\nBlade ${mastery.blade || 0}     Lance ${mastery.lance || 0}     Wand ${mastery.wand || 0}`,
      { scale: 1, color: 0xe8e8f4, lineH: 16 });
    this.text(34, 126, `RUN BUILD\n${modifiers}`, { scale: 1, color: RAMP.uiGold[3], maxWidth: 408, lineH: 15 });
    this.text(34, 174, `SPECIES EFFECTS\n${breakdown.speciesEffects.join(' · ')}`, { scale: 1, color: 0xe8e8f4, maxWidth: 408, lineH: 14 });
    if (id !== 'lyra') this.text(34, 218, `BOND  ${bondStageName(id)}`, { scale: 1, color: 0x66e8e0 });
  }

  close() { this.scene.start(this.backScene, { parentScene: this.parentScene }); }
  update(time) {
    const input = pollInput(this, time);
    if (input.pageLd || input.leftRepeat) { this.pageIndex = (this.pageIndex + PAGES.length - 1) % PAGES.length; this.render(); }
    else if (input.pageRd || input.rightRepeat) { this.pageIndex = (this.pageIndex + 1) % PAGES.length; this.render(); }
    else if (input.upRepeat || input.downRepeat) {
      const direction = input.upRepeat ? -1 : 1;
      this.characterIndex = (this.characterIndex + direction + GameState.roster.length) % GameState.roster.length; this.render();
    } else if (input.cancelled || input.menued) this.close();
  }
}
