// ═══════════════════════════════════════════════════════════════
// QUESTS — Persistent quest stage/status helpers.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';

export function setQuest(id, patch = {}) {
  if (!GameState || !id) return null;
  const current = GameState.quests[id] || { stage: 0, status: 'active' };
  const next = Object.assign({}, patch);
  if (!patch.allowRegression) {
    if (Number.isFinite(next.stage) && next.stage < current.stage) delete next.stage;
    if ((current.status === 'done' || current.status === 'failed') && next.status === 'active') {
      delete next.status;
    }
  }
  delete next.allowRegression;
  GameState.quests[id] = Object.assign(current, next);
  return GameState.quests[id];
}

export function questState(id) {
  return GameState ? GameState.quests[id] || null : null;
}
