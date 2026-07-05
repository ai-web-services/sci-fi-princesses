// ═══════════════════════════════════════════════════════════════
// RELATIONSHIPS — Companion bond tracking (D15). Bond is an integer
// 0..4, sourced from story beats, banter choices, personal-quest
// stages, and a one-time battle-participation milestone. Never shown
// as a raw number — always as a named stage.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';

export const BOND_MAX = 4;
export const BOND_STAGE_NAMES = ['Stranger', 'Ally', 'Friend', 'Trusted', 'Kindred'];
const BATTLE_MILESTONE = 25;

function record(charId) {
  if (!GameState) return null;
  if (!GameState.relationships[charId]) GameState.relationships[charId] = { bond: 0, scenes: [], battles: 0 };
  const rel = GameState.relationships[charId];
  if (typeof rel.bond !== 'number') rel.bond = 0;
  if (!Array.isArray(rel.scenes)) rel.scenes = [];
  if (typeof rel.battles !== 'number') rel.battles = 0;
  return rel;
}

export function getBond(charId) {
  const rel = record(charId);
  return rel ? rel.bond : 0;
}

export function bondStageName(charId) {
  return BOND_STAGE_NAMES[Math.max(0, Math.min(BOND_MAX, getBond(charId)))];
}

// Raises bond by `amount` (default 1), clamped to BOND_MAX. Bond never
// decreases through this helper — no gift grinding, no punitive drops.
export function addBond(charId, amount = 1) {
  const rel = record(charId);
  if (!rel) return 0;
  rel.bond = Math.max(rel.bond, Math.min(BOND_MAX, rel.bond + Math.max(0, amount)));
  return rel.bond;
}

export function hasScene(charId, sceneId) {
  const rel = record(charId);
  return !!rel && rel.scenes.includes(sceneId);
}

// Marks a bond scene as seen, returns false if it was already seen
// (so callers can guard one-shot bond beats).
export function markScene(charId, sceneId) {
  const rel = record(charId);
  if (!rel || rel.scenes.includes(sceneId)) return false;
  rel.scenes.push(sceneId);
  return true;
}

// Called after every battle for each active non-Lyra companion. Converts
// to a single +1 bond bump the first time the counter crosses 25 battles.
export function noteBattleParticipation(charId) {
  const rel = record(charId);
  if (!rel) return;
  rel.battles = (rel.battles || 0) + 1;
  if (rel.battles === BATTLE_MILESTONE && !rel.scenes.includes('battle_milestone')) {
    rel.scenes.push('battle_milestone');
    addBond(charId, 1);
  }
}
