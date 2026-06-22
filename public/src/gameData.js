// ═══════════════════════════════════════════════════════════════
// GAME DATA — State, save/load
// ═══════════════════════════════════════════════════════════════

export const GameData = {
  gold: 50000,
  inventory: [],
  party: [],
  questFlags: {},
  playerX: 29, playerY: 20, playerDir: 0,
  bossDefeated: [false, false]
};

export function gameSave() {
  try { localStorage.setItem('stellar_save', JSON.stringify(GameData)); } catch(e) {}
}

export function gameLoad() {
  try {
    const raw = localStorage.getItem('stellar_save');
    if (!raw) return false;
    const d = JSON.parse(raw);
    Object.assign(GameData, d);
    return true;
  } catch(e) { return false; }
}

export function gameHasSave() {
  try { return !!localStorage.getItem('stellar_save'); } catch(e) { return false; }
}
