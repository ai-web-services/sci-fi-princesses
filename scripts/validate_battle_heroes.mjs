// ═══════════════════════════════════════════════════════════════
// VALIDATE BATTLE HEROES — checks authored combat sprite grid defs
// for shape correctness: row width 32, 40 rows per pose, and every
// non-'.' character present in the hero's map.
// ═══════════════════════════════════════════════════════════════

import { BATTLE_HEROES } from '../public/src/art/battle/heroes.js';

const ROW_LEN = 32;
const POSE_ROWS = 40;
const POSES = ['idle', 'step', 'attack', 'cast', 'hit', 'ko', 'victory'];

function validateRow(row, label, errors) {
  if (typeof row !== 'string') {
    errors.push(`${label}: row is not a string (${typeof row})`);
    return;
  }
  if (row.length !== ROW_LEN) {
    errors.push(`${label}: length ${row.length}, expected ${ROW_LEN} -> "${row}"`);
  }
}

function validateChars(row, map, label, errors) {
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '.') continue;
    if (!(ch in map)) {
      errors.push(`${label}: char "${ch}" at index ${i} not in map -> "${row}"`);
    }
  }
}

function validatePose(poseName, rows, map, heroId, errors) {
  const label = `${heroId}.${poseName}`;
  if (!Array.isArray(rows)) {
    errors.push(`${label}: not an array`);
    return;
  }
  if (rows.length !== POSE_ROWS) {
    errors.push(`${label}: ${rows.length} rows, expected ${POSE_ROWS}`);
  }
  rows.forEach((row, i) => {
    validateRow(row, `${label}[${i}]`, errors);
    validateChars(row, map, `${label}[${i}]`, errors);
  });
}

function validateHero(hero) {
  const errors = [];
  if (!hero || typeof hero !== 'object') {
    return ['hero def missing or not an object'];
  }
  const { id, map, w, h, poses } = hero;
  if (!id) errors.push('missing id');
  if (!map || typeof map !== 'object') errors.push('missing map');
  if (w !== 32) errors.push(`w=${w}, expected 32`);
  if (h !== 40) errors.push(`h=${h}, expected 40`);
  if (!poses || typeof poses !== 'object') {
    errors.push('missing poses');
    return errors;
  }

  POSES.forEach(poseName => {
    const rows = poses[poseName];
    if (!rows) {
      errors.push(`missing pose "${poseName}"`);
      return;
    }
    validatePose(poseName, rows, map || {}, id || '?', errors);
  });

  return errors;
}

function report(hero) {
  const id = hero && hero.id ? hero.id : '(unknown)';
  const errors = validateHero(hero);
  if (errors.length === 0) {
    console.log(`OK  ${id}`);
    return true;
  }
  console.log(`FAIL ${id}`);
  for (const e of errors) console.log(`     - ${e}`);
  return false;
}

let allOk = true;

const heroIds = ['lyra', 'erynn', 'brimble', 'drakkor', 'pip'];
for (const heroId of heroIds) {
  const hero = BATTLE_HEROES[heroId];
  if (!hero) {
    console.log(`FAIL ${heroId}: missing from BATTLE_HEROES`);
    allOk = false;
    continue;
  }
  if (!report(hero)) allOk = false;
}

if (!allOk) {
  console.log('\nValidation FAILED');
  process.exit(1);
} else {
  console.log('\nAll battle heroes valid.');
}
