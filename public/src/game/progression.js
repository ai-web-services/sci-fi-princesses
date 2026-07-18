// ═══════════════════════════════════════════════════════════════
// PROGRESSION — Effective stats from character data + level +
// equipment + evolution; XP awards, level-ups, skill learning.
// Tolerates missing data modules during development.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';
import { gearId, gearPassives, gearStats } from './gearProgression.js';

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
    crit: base.crit === undefined ? 5 : (base.crit <= 1 ? base.crit * 100 : base.crit),
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
      const equipped = rec.equipment[slot];
      const it = ITEMS[gearId(equipped)];
      if (!it) continue;
      const s = gearStats(it, equipped);
      stats.atk += s.atk || 0; stats.mag += s.mag || 0;
      stats.def += s.def || 0; stats.res += s.res || 0;
      stats.spd += s.spd || 0; stats.crit += s.crit ? (s.crit <= 1 ? s.crit * 100 : s.crit) : 0;
      stats.maxHp += s.hp || 0; stats.maxSp += s.sp || 0;
      const passive = gearPassives(it, equipped);
      if (Object.keys(passive).length) {
        for (const k of Object.keys(passive)) {
          if (k === 'evade') stats.evade += passive.evade;
          else if (k === 'critBonus') stats.crit += passive.critBonus <= 1 ? passive.critBonus * 100 : passive.critBonus;
          else if (k === 'elementResist') {
            stats.passives.elementResist = Object.assign(stats.passives.elementResist || {}, passive.elementResist);
          } else if (typeof passive[k] === 'number') stats.passives[k] = (stats.passives[k] || 0) + passive[k];
          else stats.passives[k] = passive[k];
        }
      }
    }
  }
  return stats;
}

// Human-readable source model for the character sheet. The final values come
// from effectiveStats(), while these components explain how they were formed.
export function statBreakdown(id) {
  const rec = GameState.chars[id];
  const data = CHARACTERS[id];
  if (!rec || !data) return null;
  const level = rec.level || 1;
  const baseAtLevel = {
    maxHp: Math.round(data.base.hp + data.growth.hp * (level - 1)),
    maxSp: Math.round(data.base.sp + data.growth.sp * (level - 1)),
    atk: Math.round(data.base.atk + data.growth.atk * (level - 1)),
    mag: Math.round(data.base.mag + data.growth.mag * (level - 1)),
    def: Math.round(data.base.def + data.growth.def * (level - 1)),
    res: Math.round(data.base.res + data.growth.res * (level - 1)),
    spd: Math.round(data.base.spd + data.growth.spd * (level - 1))
  };
  const gear = { maxHp: 0, maxSp: 0, atk: 0, mag: 0, def: 0, res: 0, spd: 0, crit: 0 };
  for (const equipped of Object.values(rec.equipment || {})) {
    const item = ITEMS[gearId(equipped)];
    const stats = gearStats(item, equipped);
    gear.maxHp += stats.hp || 0; gear.maxSp += stats.sp || 0;
    gear.atk += stats.atk || 0; gear.mag += stats.mag || 0;
    gear.def += stats.def || 0; gear.res += stats.res || 0;
    gear.spd += stats.spd || 0; gear.crit += stats.crit ? (stats.crit <= 1 ? stats.crit * 100 : stats.crit) : 0;
  }
  const evolutionMult = (data.evolutions || []).slice(0, rec.evolution || 0)
    .reduce((total, stage) => total * (stage.statMult || 1), 1);
  return {
    final: effectiveStats(id), baseAtLevel, gear, evolutionMult,
    speciesEffects: speciesEffectLabels(data.traits || {}),
    evolutionName: rec.evolution > 0 ? data.evolutions?.[rec.evolution - 1]?.name : 'Base Form'
  };
}

function speciesEffectLabels(traits) {
  const labels = [];
  if (traits.hpMult) labels.push(`HP ×${traits.hpMult.toFixed(2)}`);
  if (traits.physBonus) labels.push(`Physical +${Math.round(traits.physBonus * 100)}%`);
  if (traits.evade) labels.push(`Evade +${Math.round(traits.evade * 100)}%`);
  if (traits.critBonus) labels.push(`Critical +${Math.round(traits.critBonus * 100)}%`);
  if (traits.healReceived) labels.push(`Healing ${traits.healReceived > 0 ? '+' : ''}${Math.round(traits.healReceived * 100)}%`);
  if (traits.fireResist) labels.push(`Fire resist +${Math.round(traits.fireResist * 100)}%`);
  if (traits.buffDuration) labels.push(`Buff duration +${Math.round(traits.buffDuration * 100)}%`);
  if (traits.immunities?.length) labels.push(`Immune: ${traits.immunities.join(', ')}`);
  return labels.length ? labels : ['Balanced physiology'];
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
