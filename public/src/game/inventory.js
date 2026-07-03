// ═══════════════════════════════════════════════════════════════
// INVENTORY — State-safe resource mutations used by scripts,
// shops, rewards, and combat.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';

export function addItem(id, qty = 1) {
  if (!GameState || !id || qty <= 0) return false;
  const stack = GameState.inventory.find(item => item.id === id);
  if (stack) stack.qty += qty;
  else GameState.inventory.push({ id, qty });
  return true;
}

export function removeItem(id, qty = 1) {
  if (!GameState || qty <= 0) return false;
  const stack = GameState.inventory.find(item => item.id === id);
  if (!stack || stack.qty < qty) return false;
  stack.qty -= qty;
  if (stack.qty === 0) GameState.inventory.splice(GameState.inventory.indexOf(stack), 1);
  return true;
}

export function addGold(amount) {
  if (!GameState || !Number.isFinite(amount)) return false;
  GameState.gold = Math.max(0, GameState.gold + Math.floor(amount));
  return true;
}

export function spendGold(amount) {
  if (!GameState || !Number.isFinite(amount) || amount < 0 || GameState.gold < amount) return false;
  GameState.gold -= Math.floor(amount);
  return true;
}
