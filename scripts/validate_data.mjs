// ═══════════════════════════════════════════════════════════════
// VALIDATE DATA — Structural and cross-reference checks for the
// character, enemy, and item data registries against skills.js and
// statuses.js.
// ═══════════════════════════════════════════════════════════════

import { SKILLS } from '../public/src/data/skills.js';
import { STATUSES } from '../public/src/data/statuses.js';
import { CHARACTERS, xpForLevel, LEVEL_CAP } from '../public/src/data/characters.js';
import { ENEMIES } from '../public/src/data/enemies.js';
import { ITEMS } from '../public/src/data/items.js';

const errors = [];
function fail(message) { errors.push(message); }

const STARTING_SKILLS = [
  'lyra_strike', 'stellar_slash', 'guiding_light',
  'erynn_claw', 'shadow_pounce',
  'brimble_slam', 'tidal_shield',
  'drakkor_cleave', 'inferno_breath',
  'pip_zap', 'nano_swarm'
];

// ── Starting kit skills exist ──────────────────────────────
for (const id of STARTING_SKILLS) {
  if (!SKILLS[id]) fail(`starting skill "${id}" missing from SKILLS`);
}

// ── Characters ──────────────────────────────────────────────
const characterIds = Object.keys(CHARACTERS);
for (const char of Object.values(CHARACTERS)) {
  for (const [level, ids] of Object.entries(char.skillsByLevel || {})) {
    for (const id of ids) {
      if (!SKILLS[id]) fail(`${char.id}: skillsByLevel[${level}] references unknown skill "${id}"`);
    }
  }
  for (const evo of char.evolutions || []) {
    for (const id of evo.unlockSkills || []) {
      if (!SKILLS[id]) fail(`${char.id}: evolution "${evo.name}" references unknown skill "${id}"`);
    }
  }
}

// ── Enemies ─────────────────────────────────────────────────
for (const enemy of Object.values(ENEMIES)) {
  for (const id of enemy.skills || []) {
    if (!SKILLS[id]) fail(`${enemy.id}: skills references unknown skill "${id}"`);
  }
  for (const phase of enemy.phases || []) {
    for (const id of phase.addSkills || []) {
      if (!SKILLS[id]) fail(`${enemy.id}: phase (hpFrac ${phase.hpFrac}) references unknown skill "${id}"`);
    }
  }
  for (const drop of enemy.drops || []) {
    if (!ITEMS[drop.item]) fail(`${enemy.id}: drop references unknown item "${drop.item}"`);
  }
}

// ── Items ───────────────────────────────────────────────────
for (const item of Object.values(ITEMS)) {
  if (!(item.price > 0)) fail(`${item.id}: price must be > 0 (got ${item.price})`);
  if (item.type === 'weapon' && item.usableBy) {
    for (const id of item.usableBy) {
      if (!characterIds.includes(id)) fail(`${item.id}: usableBy references unknown character "${id}"`);
    }
  }
}

// ── Sanity: xpForLevel curve is monotonic non-decreasing to LEVEL_CAP ──
let prev = -1;
for (let lvl = 1; lvl <= LEVEL_CAP; lvl++) {
  const xp = xpForLevel(lvl);
  if (xp < prev) fail(`xpForLevel(${lvl}) = ${xp} is less than xpForLevel(${lvl - 1}) = ${prev}`);
  prev = xp;
}

// ── Report ──────────────────────────────────────────────────
if (errors.length) {
  console.error(errors.map(e => `FAIL ${e}`).join('\n'));
  console.error(`\n${errors.length} validation error(s).`);
  process.exit(1);
}

console.log(`OK  ${Object.keys(CHARACTERS).length} characters`);
console.log(`OK  ${Object.keys(ENEMIES).length} enemies`);
console.log(`OK  ${Object.keys(ITEMS).length} items`);
console.log(`OK  ${Object.keys(SKILLS).length} skills, ${Object.keys(STATUSES).length} statuses (referenced, unmodified)`);
console.log(`OK  LEVEL_CAP = ${LEVEL_CAP}, xpForLevel(2..5) = ${[2, 3, 4, 5].map(xpForLevel).join(', ')}`);
console.log('\nAll data valid.');
