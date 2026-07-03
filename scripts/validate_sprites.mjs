// ═══════════════════════════════════════════════════════════════
// VALIDATE SPRITES — checks authored sprite grid defs for shape
// correctness: row width 24, body 27 rows, legs variants 5 rows
// each, and every non-'.' character present in the sprite's map.
// ═══════════════════════════════════════════════════════════════

import { ERYNN_SPRITE } from '../public/src/art/sprites/erynn.js';
import { BRIMBLE_SPRITE } from '../public/src/art/sprites/brimble.js';
import { DRAKKOR_SPRITE } from '../public/src/art/sprites/drakkor.js';
import { PIP_SPRITE } from '../public/src/art/sprites/pip.js';
import { NPC_SPRITES } from '../public/src/art/sprites/npcs.js';

const ROW_LEN = 24;
const BODY_ROWS = 27;
const LEGS_ROWS = 5;

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

function validateDir(dirName, dirDef, map, spriteId, errors) {
  const label = `${spriteId}.${dirName}`;
  const body = dirDef.body;
  if (!Array.isArray(body)) {
    errors.push(`${label}.body: not an array`);
  } else {
    if (body.length !== BODY_ROWS) {
      errors.push(`${label}.body: ${body.length} rows, expected ${BODY_ROWS}`);
    }
    body.forEach((row, i) => {
      validateRow(row, `${label}.body[${i}]`, errors);
      validateChars(row, map, `${label}.body[${i}]`, errors);
    });
  }

  const legs = dirDef.legs;
  if (!legs || typeof legs !== 'object') {
    errors.push(`${label}.legs: missing`);
    return;
  }
  ['stand', 'a', 'b'].forEach(variant => {
    const rows = legs[variant];
    const vlabel = `${label}.legs.${variant}`;
    if (!Array.isArray(rows)) {
      errors.push(`${vlabel}: not an array`);
      return;
    }
    if (rows.length !== LEGS_ROWS) {
      errors.push(`${vlabel}: ${rows.length} rows, expected ${LEGS_ROWS}`);
    }
    rows.forEach((row, i) => {
      validateRow(row, `${vlabel}[${i}]`, errors);
      validateChars(row, map, `${vlabel}[${i}]`, errors);
    });
  });
}

function validateSprite(sprite) {
  const errors = [];
  if (!sprite || typeof sprite !== 'object') {
    return ['sprite def missing or not an object'];
  }
  const { id, map, w, h } = sprite;
  if (!id) errors.push('missing id');
  if (!map || typeof map !== 'object') errors.push('missing map');
  if (w !== 24) errors.push(`w=${w}, expected 24`);
  if (h !== 32) errors.push(`h=${h}, expected 32`);

  ['down', 'up', 'side'].forEach(dir => {
    const dirDef = sprite[dir];
    if (!dirDef) {
      errors.push(`missing direction "${dir}"`);
      return;
    }
    validateDir(dir, dirDef, map || {}, id || '?', errors);
  });

  return errors;
}

function report(sprite) {
  const id = sprite && sprite.id ? sprite.id : '(unknown)';
  const errors = validateSprite(sprite);
  if (errors.length === 0) {
    console.log(`OK  ${id}`);
    return true;
  }
  console.log(`FAIL ${id}`);
  for (const e of errors) console.log(`     - ${e}`);
  return false;
}

let allOk = true;

for (const sprite of [ERYNN_SPRITE, BRIMBLE_SPRITE, DRAKKOR_SPRITE, PIP_SPRITE]) {
  if (!report(sprite)) allOk = false;
}

if (!Array.isArray(NPC_SPRITES)) {
  console.log('FAIL NPC_SPRITES: not an array');
  allOk = false;
} else {
  for (const sprite of NPC_SPRITES) {
    if (!report(sprite)) allOk = false;
  }
}

if (!allOk) {
  console.log('\nValidation FAILED');
  process.exit(1);
} else {
  console.log('\nAll sprites valid.');
}
