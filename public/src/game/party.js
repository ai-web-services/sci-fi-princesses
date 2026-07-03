// ═══════════════════════════════════════════════════════════════
// PARTY — Roster membership helpers. Detailed character growth is
// layered onto these persistent records by progression systems.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';

const BASE = {
  erynn: { hp: 82, sp: 58, skills: ['erynn_claw', 'shadow_pounce'] },
  brimble: { hp: 145, sp: 44, skills: ['brimble_slam', 'tidal_shield'] },
  drakkor: { hp: 132, sp: 40, skills: ['drakkor_cleave', 'inferno_breath'] },
  pip: { hp: 88, sp: 70, skills: ['pip_zap', 'nano_swarm'] }
};

export function recruit(id) {
  if (!GameState || !id || GameState.roster.includes(id)) return false;
  const base = BASE[id] || { hp: 90, sp: 40, skills: [] };
  GameState.roster.push(id);
  if (GameState.active.length < 3) GameState.active.push(id);
  GameState.chars[id] = {
    level: 1, xp: 0, hp: base.hp, maxHp: base.hp, sp: base.sp, maxSp: base.sp,
    equipment: {}, skillsKnown: base.skills.slice(), evolution: 0, build: {}
  };
  GameState.relationships[id] = { bond: 0, scenes: [] };
  return true;
}
