// ═══════════════════════════════════════════════════════════════
// PROGRESSION — Effective stats from character data + level +
// equipment + evolution; XP awards, level-ups, skill learning.
// Tolerates missing data modules during development.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';

let CHARACTERS = {}, ITEMS = {}, xpForLevelFn = null, LEVEL_CAP = 20;
export async function loadProgressionData() {
  try {
    const c = await import('../data/characters.js');
    CHARACTERS = c.CHARACTERS || {};
    xpForLevelFn = c.xpForLevel || null;
    LEVEL_CAP = c.LEVEL_CAP || 20;
  } catch (e) { /* not yet authored */ }
  try {
    const i = await import('../data/items.js');
    ITEMS = i.ITEMS || {};
  } catch (e) { /* not yet authored */ }
}
export function charData(id) { return CHARACTERS[id] || null; }
export function itemData(id) { return ITEMS[id] || null; }
export function allItems() { return ITEMS; }
export function allCharacters() { return CHARACTERS; }

export function xpForLevel(level) {
  if (xpForLevelFn) return xpForLevelFn(level);
  // fallback: GDD curve approximation
  let xp = 100;
  for (let l = 2; l < level; l++) xp = Math.round(xp * 1.5);
  return level <= 1 ? 0 : xp;
}

// Effective combat stats for a party member.
export function effectiveStats(id) {
  const rec = GameState.chars[id];
  const data = CHARACTERS[id];
  const level = rec ? rec.level : 1;
  const base = data ? data.base : { hp: 90, sp: 40, atk: 10, mag: 10, def: 8, res: 8, spd: 10, crit: 5 };
  const growth = data ? data.growth : { hp: 8, sp: 3, atk: 2, mag: 2, def: 1.5, res: 1.5, spd: 1 };
  const stats = {
    maxHp: Math.round(base.hp + growth.hp * (level - 1)),
    maxSp: Math.round(base.sp + growth.sp * (level - 1)),
    atk: Math.round(base.atk + growth.atk * (level - 1)),
    mag: Math.round(base.mag + growth.mag * (level - 1)),
    def: Math.round(base.def + growth.def * (level - 1)),
    res: Math.round(base.res + growth.res * (level - 1)),
    spd: Math.round(base.spd + growth.spd * (level - 1)),
    crit: base.crit || 5,
    evade: 0.03,
    passives: {}
  };
  // species traits
  const traits = data && data.traits ? data.traits : {};
  if (traits.evade) stats.evade += traits.evade;
  if (traits.critBonus) stats.crit += Math.round(traits.critBonus * 100);
  if (traits.hpMult) stats.maxHp = Math.round(stats.maxHp * traits.hpMult);
  if (traits.physBonus) stats.atk = Math.round(stats.atk * (1 + traits.physBonus));
  // evolution multiplier
  if (rec && rec.evolution > 0 && data && data.evolutions) {
    for (let s = 0; s < rec.evolution && s < data.evolutions.length; s++) {
      const mult = data.evolutions[s].statMult || 1.15;
      stats.atk = Math.round(stats.atk * mult);
      stats.mag = Math.round(stats.mag * mult);
      stats.def = Math.round(stats.def * mult);
      stats.res = Math.round(stats.res * mult);
      stats.maxHp = Math.round(stats.maxHp * mult);
      stats.maxSp = Math.round(stats.maxSp * mult);
    }
  }
  // Tide Shard power bump (D14/D19): a stat bump short of a full
  // evolution stage, granted on claiming the Mirelight Deeps shard.
  if (id === 'lyra' && GameState.flags && GameState.flags.lyra_tide_attuned) {
    stats.atk = Math.round(stats.atk * 1.06);
    stats.mag = Math.round(stats.mag * 1.06);
    stats.maxSp = Math.round(stats.maxSp * 1.08);
  }
  // equipment
  if (rec && rec.equipment) {
    for (const slot of Object.keys(rec.equipment)) {
      const it = ITEMS[rec.equipment[slot]];
      if (!it) continue;
      const s = it.stats || {};
      stats.atk += s.atk || 0; stats.mag += s.mag || 0;
      stats.def += s.def || 0; stats.res += s.res || 0;
      stats.spd += s.spd || 0; stats.crit += s.crit || 0;
      stats.maxHp += s.hp || 0; stats.maxSp += s.sp || 0;
      if (it.passive) {
        for (const k of Object.keys(it.passive)) {
          if (k === 'evade') stats.evade += it.passive.evade;
          else if (k === 'critBonus') stats.crit += it.passive.critBonus;
          else if (k === 'elementResist') {
            stats.passives.elementResist = Object.assign(stats.passives.elementResist || {}, it.passive.elementResist);
          } else stats.passives[k] = (stats.passives[k] || 0) + it.passive[k];
        }
      }
    }
  }
  return stats;
}

// Clamp current hp/sp to new maxima (call after level/equip changes)
export function refreshVitals(id) {
  const rec = GameState.chars[id];
  if (!rec) return;
  const s = effectiveStats(id);
  rec.maxHp = s.maxHp; rec.maxSp = s.maxSp;
  rec.hp = Math.min(rec.hp, rec.maxHp);
  rec.sp = Math.min(rec.sp, rec.maxSp);
}

// Award XP; returns array of level-up events {id, level, learned:[skillIds]}
export function awardXp(ids, amount) {
  const events = [];
  for (const id of ids) {
    const rec = GameState.chars[id];
    if (!rec || rec.hp <= 0 && !GameState.active.includes(id)) { /* KO'd reserves still learn */ }
    if (!rec) continue;
    rec.xp += amount;
    while (rec.level < LEVEL_CAP && rec.xp >= xpForLevel(rec.level + 1)) {
      rec.xp -= xpForLevel(rec.level + 1);
      rec.level++;
      const learned = [];
      const data = CHARACTERS[id];
      if (data && data.skillsByLevel && data.skillsByLevel[rec.level]) {
        for (const sk of data.skillsByLevel[rec.level]) {
          if (!rec.skillsKnown.includes(sk)) { rec.skillsKnown.push(sk); learned.push(sk); }
        }
      }
      const before = { hp: rec.maxHp, sp: rec.maxSp };
      refreshVitals(id);
      // level up restores the gained hp/sp
      rec.hp = Math.min(rec.maxHp, rec.hp + Math.max(0, rec.maxHp - before.hp));
      rec.sp = Math.min(rec.maxSp, rec.sp + Math.max(0, rec.maxSp - before.sp));
      events.push({ id, level: rec.level, learned });
    }
  }
  return events;
}

// Apply an evolution stage; returns unlocked skills.
export function evolve(id) {
  const rec = GameState.chars[id];
  const data = CHARACTERS[id];
  if (!rec || !data || !data.evolutions) return null;
  if (rec.evolution >= data.evolutions.length) return null;
  const stage = data.evolutions[rec.evolution];
  rec.evolution++;
  const learned = [];
  for (const sk of stage.unlockSkills || []) {
    if (!rec.skillsKnown.includes(sk)) { rec.skillsKnown.push(sk); learned.push(sk); }
  }
  refreshVitals(id);
  rec.hp = rec.maxHp; rec.sp = rec.maxSp;   // evolution fully restores
  return { stage, learned };
}
