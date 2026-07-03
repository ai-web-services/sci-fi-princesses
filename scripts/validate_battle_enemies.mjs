// ═══════════════════════════════════════════════════════════════
// VALIDATE BATTLE ENEMIES — checks authored enemy battle sprite defs
// for shape correctness: grid height matches h, every row length
// matches w, and every non-'.' character is present in the map.
// ═══════════════════════════════════════════════════════════════

import { BATTLE_ENEMIES } from '../public/src/art/battle/enemies.js';

const EXPECTED_COUNT = 19;

function validateEnemy(enemy) {
  const errors = [];
  if (!enemy || typeof enemy !== 'object') {
    return ['enemy def missing or not an object'];
  }
  const { id, w, h, map, grid } = enemy;
  if (!id) errors.push('missing id');
  if (!map || typeof map !== 'object') errors.push('missing map');
  if (typeof w !== 'number') errors.push(`missing/invalid w (${w})`);
  if (typeof h !== 'number') errors.push(`missing/invalid h (${h})`);

  if (!Array.isArray(grid)) {
    errors.push('grid is not an array');
    return errors;
  }
  if (grid.length !== h) {
    errors.push(`grid height ${grid.length}, expected h=${h}`);
  }
  grid.forEach((row, i) => {
    if (typeof row !== 'string') {
      errors.push(`row[${i}] is not a string (${typeof row})`);
      return;
    }
    if (row.length !== w) {
      errors.push(`row[${i}] length ${row.length}, expected w=${w} -> "${row}"`);
    }
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      if (!map || !(ch in map)) {
        errors.push(`row[${i}] char "${ch}" at index ${x} not in map -> "${row}"`);
      }
    }
  });

  return errors;
}

function report(id, enemy) {
  const errors = validateEnemy(enemy);
  if (errors.length === 0) {
    console.log(`OK  ${id}`);
    return true;
  }
  console.log(`FAIL ${id}`);
  for (const e of errors) console.log(`     - ${e}`);
  return false;
}

let allOk = true;

if (!BATTLE_ENEMIES || typeof BATTLE_ENEMIES !== 'object') {
  console.log('FAIL BATTLE_ENEMIES: missing or not an object');
  process.exit(1);
}

const ids = Object.keys(BATTLE_ENEMIES);
for (const id of ids) {
  if (!report(id, BATTLE_ENEMIES[id])) allOk = false;
}

console.log(`\nTotal enemies: ${ids.length} (expected ${EXPECTED_COUNT})`);
if (ids.length !== EXPECTED_COUNT) {
  console.log(`FAIL count mismatch: got ${ids.length}, expected ${EXPECTED_COUNT}`);
  allOk = false;
}

if (!allOk) {
  console.log('\nValidation FAILED');
  process.exit(1);
} else {
  console.log('\nAll battle enemies valid.');
}
