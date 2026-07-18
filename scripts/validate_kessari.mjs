// ═══════════════════════════════════════════════════════════════
// VALIDATE KESSARI MAPS — M7 dungeon content contracts.
// ═══════════════════════════════════════════════════════════════

import { KESSARI_MAPS } from '../public/src/data/maps/kessari.js';
import { ENEMIES } from '../public/src/data/enemies.js';

const REQUIRED_MAPS = [
  'kess_docks',
  'kess_bazaar',
  'kess_underway',
  'kess_court',
  'kess_spire'
];
const SAFE_MAPS = ['kess_docks', 'kess_bazaar', 'kess_court', 'kess_spire'];
const errors = [];

function fail(message) {
  errors.push(message);
}

for (const id of REQUIRED_MAPS) {
  const map = KESSARI_MAPS[id];
  if (!map) {
    fail(`missing required map "${id}"`);
    continue;
  }

  // grid shape: all rows equal length
  const lens = new Set(map.grid.map(r => r.length));
  if (lens.size !== 1) fail(`${id} grid rows have inconsistent lengths: ${[...lens].join(',')}`);

  // every non-'#' char used must be a legend entry
  map.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (!map.legend[ch]) fail(`${id} row ${y} uses char "${ch}" at x=${x} not present in legend`);
    }
  });

  // safe vs encounter maps
  if (SAFE_MAPS.includes(id)) {
    if (map.encounters) fail(`${id} should be safe (no encounters) but has an encounters field`);
  } else if (!map.encounters) {
    fail(`${id} is missing encounters`);
  }

  if (map.encounters) {
    if (typeof map.encounters.backdrop !== 'string' || !map.encounters.backdrop) {
      fail(`${id} encounter backdrop is missing or not a string`);
    }
    if (!map.encounters.groups || !map.encounters.groups.length) fail(`${id} has no encounter groups`);
    for (const group of map.encounters.groups || []) {
      if (!group.length) fail(`${id} has an empty encounter group`);
      for (const enemyId of group) {
        if (!ENEMIES[enemyId]) fail(`${id} uses unknown enemy "${enemyId}"`);
      }
    }
  }

  // spawn and exits/npcs/interactions must land on walkable cells
  const cellChar = (x, y) => (map.grid[y] ? map.grid[y][x] : undefined);
  const isSolid = ch => !!(map.legend[ch] && map.legend[ch].solid);

  if (map.spawn) {
    const ch = cellChar(map.spawn.x, map.spawn.y);
    if (ch === undefined) fail(`${id} spawn is out of grid bounds`);
    else if (isSolid(ch)) fail(`${id} spawn lands on a solid tile "${ch}"`);
  }

  for (const npc of map.npcs || []) {
    const ch = cellChar(npc.x, npc.y);
    if (ch === undefined) fail(`${id}.${npc.id} npc is out of grid bounds`);
    else if (isSolid(ch)) fail(`${id}.${npc.id} npc placed on a solid tile "${ch}"`);
  }

  for (const interaction of map.interactions || []) {
    const ch = cellChar(interaction.x, interaction.y);
    if (ch === undefined) fail(`${id}.${interaction.id} interaction is out of grid bounds`);
    else if (isSolid(ch)) fail(`${id}.${interaction.id} interaction placed on a solid tile "${ch}"`);
  }

  for (const exit of map.exits || []) {
    for (const cell of exit.cells) {
      const ch = cellChar(cell.x, cell.y);
      if (ch === undefined) fail(`${id}.${exit.id} exit cell out of grid bounds`);
      else if (isSolid(ch)) fail(`${id}.${exit.id} exit cell is solid "${ch}"`);
    }
    const dest = KESSARI_MAPS[exit.to.map];
    if (!dest) {
      fail(`${id}.${exit.id} targets unknown map "${exit.to.map}"`);
    } else {
      const dch = dest.grid[exit.to.y] ? dest.grid[exit.to.y][exit.to.x] : undefined;
      if (dch === undefined) fail(`${id}.${exit.id} destination out of bounds in "${exit.to.map}"`);
      else if (isSolid(dch)) fail(`${id}.${exit.id} destination lands on a solid tile "${dch}" in "${exit.to.map}"`);
    }
  }
}

// ── spawn contract: kess_docks arrival point (fast travel wiring) ──
const docks = KESSARI_MAPS.kess_docks;
if (docks) {
  const s = docks.spawn;
  if (!(s.x === 14 && s.y === 19 && s.dir === 'up')) {
    fail('kess_docks spawn must be exactly {x:14, y:19, dir:"up"}');
  }
}

// ── evidence contract: 3 interactions in kess_underway ──
const underway = KESSARI_MAPS.kess_underway;
if (underway) {
  const evidenceIds = ['kess_evidence_1', 'kess_evidence_2', 'kess_evidence_3'];
  const found = new Set((underway.interactions || []).map(i => i.id));
  for (const id of evidenceIds) {
    if (!found.has(id)) fail(`kess_underway is missing evidence interaction "${id}"`);
  }
}

// ── service NPCs in kess_bazaar ──
const bazaar = KESSARI_MAPS.kess_bazaar;
if (bazaar) {
  const shopkeep = (bazaar.npcs || []).find(n => n.id === 'kess_shopkeep');
  const healer = (bazaar.npcs || []).find(n => n.id === 'kess_healer');
  if (!shopkeep || !shopkeep.script || shopkeep.script.shop !== 'kess_bazaar') {
    fail('kess_bazaar.kess_shopkeep must have script { shop: "kess_bazaar" }');
  }
  if (!healer || !healer.script || !healer.script.rest) {
    fail('kess_bazaar.kess_healer must have script { rest: {...} }');
  }
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

for (const id of REQUIRED_MAPS) console.log(`OK  ${id}`);
console.log('\nKessari contracts valid.');
