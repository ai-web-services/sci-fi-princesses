// ═══════════════════════════════════════════════════════════════
// VALIDATE NOVA MAP PACKAGE — M4 district/content contract.
// The shared validator owns cell reachability; this check owns the
// Nova package's completeness, ambient cast, and reciprocal graph.
// ═══════════════════════════════════════════════════════════════

import {
  NOVA_MAPS,
  NOVA_PLAZA_EXIT_CONTRACTS
} from '../public/src/data/maps/nova.js';

const REQUIRED = [
  'nova_market',
  'nova_residential',
  'nova_palace',
  'nova_tavern',
  'nova_shop_weapons',
  'nova_shop_armor',
  'nova_shop_materials',
  'nova_healers_hall',
  'nova_gardens'
];
const AMBIENT_ACTORS = new Set(['citizen_m', 'citizen_f', 'guard']);
const PLAZA_SEAMS = new Map([
  ['nova_market', 'market_to_plaza'],
  ['nova_residential', 'residential_to_plaza'],
  ['nova_gardens', 'gardens_to_plaza']
]);
const errors = [];

function fail(message) {
  errors.push(message);
}

for (const id of REQUIRED) {
  const map = NOVA_MAPS[id];
  if (!map) {
    fail(`missing required map "${id}"`);
    continue;
  }
  if (map.id !== id) fail(`${id}: map.id is "${map.id}"`);
  if (map.region !== 'Nova Prime') fail(`${id}: unexpected region "${map.region}"`);
  if (map.tileset !== 'nova') fail(`${id}: unexpected tileset "${map.tileset}"`);
  if (!Array.isArray(map.grid) || !map.grid.length) fail(`${id}: grid is empty`);
  for (const npc of map.npcs || []) {
    if (!AMBIENT_ACTORS.has(npc.actor)) {
      fail(`${id}.${npc.id}: actor "${npc.actor}" is not ambient`);
    }
  }
  if ((map.triggers || []).length) fail(`${id}: story trigger authored in spatial package`);
  if ((map.interactions || []).length) fail(`${id}: story/service interaction authored in spatial package`);
}

for (const map of Object.values(NOVA_MAPS)) {
  for (const exit of map.exits || []) {
    const targetId = exit.to && exit.to.map;
    if (targetId === 'nova_plaza') continue;
    const target = NOVA_MAPS[targetId];
    if (!target) {
      fail(`${map.id}.${exit.id}: target "${targetId}" is outside Nova package`);
      continue;
    }
    const returnExit = (target.exits || []).find(candidate =>
      candidate.to && candidate.to.map === map.id);
    if (!returnExit) {
      fail(`${map.id}.${exit.id}: ${targetId} has no reciprocal exit`);
    }
  }
}

for (const [mapId, exitId] of PLAZA_SEAMS) {
  const map = NOVA_MAPS[mapId];
  const exit = map && (map.exits || []).find(candidate => candidate.id === exitId);
  if (!exit || exit.to.map !== 'nova_plaza') {
    fail(`${mapId}: missing plaza seam "${exitId}"`);
  }
}

for (const mapId of PLAZA_SEAMS.keys()) {
  const contract = NOVA_PLAZA_EXIT_CONTRACTS.find(exit =>
    exit.to && exit.to.map === mapId);
  if (!contract) fail(`nova_plaza: missing outbound contract for "${mapId}"`);
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

console.log(`OK  ${REQUIRED.length} Nova maps present`);
console.log('OK  internal district/service links are reciprocal');
console.log('OK  ambient-only spatial content');
console.log('OK  plaza seams: market, residential, gardens');
