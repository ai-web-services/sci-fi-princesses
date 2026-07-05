// ═══════════════════════════════════════════════════════════════
// VALIDATE MIRELIGHT MAPS — M5 dungeon content contracts.
// ═══════════════════════════════════════════════════════════════

import { MIRELIGHT_LEGEND } from '../public/src/data/maps.js';
import { MIRELIGHT_MAPS } from '../public/src/data/maps/mirelight.js';
import { ENEMIES } from '../public/src/data/enemies.js';

const REQUIRED_MAPS = [
  'mire_landing',
  'mire_shallows',
  'mire_village',
  'mire_deeps',
  'mire_throne'
];
const SAFE_MAPS = ['mire_landing', 'mire_village', 'mire_throne'];
const errors = [];

function fail(message) {
  errors.push(message);
}

function walkScript(ops, visit) {
  for (const op of ops || []) {
    visit(op);
    if (op.if) {
      walkScript(op.then, visit);
      walkScript(op.else, visit);
    }
    if (op.choice && op.choice.results) {
      for (const branch of Object.values(op.choice.results)) walkScript(branch, visit);
    }
    if (op.battle && op.battle.winScript) walkScript(op.battle.winScript, visit);
  }
}

for (const id of REQUIRED_MAPS) {
  const map = MIRELIGHT_MAPS[id];
  if (!map) {
    fail(`missing required map "${id}"`);
    continue;
  }

  // legend contract
  for (const [ch, canonical] of Object.entries(MIRELIGHT_LEGEND)) {
    if (JSON.stringify(map.legend[ch]) !== JSON.stringify(canonical)) {
      fail(`${id} legend entry "${ch}" differs from MIRELIGHT_LEGEND`);
    }
  }

  // grid shape: all rows equal length
  const lens = new Set(map.grid.map(r => r.length));
  if (lens.size !== 1) fail(`${id} grid rows have inconsistent lengths: ${[...lens].join(',')}`);

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

  for (const exit of map.exits || []) {
    for (const cell of exit.cells) {
      const ch = cellChar(cell.x, cell.y);
      if (ch === undefined) fail(`${id}.${exit.id} exit cell out of grid bounds`);
      else if (isSolid(ch)) fail(`${id}.${exit.id} exit cell is solid "${ch}"`);
    }
    const dest = MIRELIGHT_MAPS[exit.to.map];
    if (!dest) {
      fail(`${id}.${exit.id} targets unknown map "${exit.to.map}"`);
    } else {
      const dch = dest.grid[exit.to.y] ? dest.grid[exit.to.y][exit.to.x] : undefined;
      if (dch === undefined) fail(`${id}.${exit.id} destination out of bounds in "${exit.to.map}"`);
      else if (isSolid(dch)) fail(`${id}.${exit.id} destination lands on a solid tile "${dch}" in "${exit.to.map}"`);
    }
  }
}

// ── spawn contract: mire_landing arrival point (fast travel wiring) ──
const landing = MIRELIGHT_MAPS.mire_landing;
if (landing) {
  const s = landing.spawn;
  if (!(s.x === 14 && s.y === 19 && s.dir === 'up')) {
    fail('mire_landing spawn must be exactly {x:14, y:19, dir:"up"}');
  }
}

// ── tide-gate puzzle contract: 3 levers, gated drain, single flag ──
const deeps = MIRELIGHT_MAPS.mire_deeps;
if (deeps) {
  const leverIds = ['tide_lever_1', 'tide_lever_2', 'tide_lever_3'];
  const found = new Set();
  const setcellOps = [];
  let openFlagCount = 0;

  for (const interaction of deeps.interactions || []) {
    if (leverIds.includes(interaction.id)) found.add(interaction.id);
    walkScript(interaction.script, op => {
      if (op.setcell) setcellOps.push({ interaction, mutation: op.setcell });
      if (op.flag && op.flag.key === 'mire_tide_gates_open' && op.flag.value === true) openFlagCount++;
    });
  }

  for (const id of leverIds) {
    if (!found.has(id)) fail(`mire_deeps is missing lever interaction "${id}"`);
  }

  if (setcellOps.length < 4) fail(`mire_deeps drain sequence has too few setcell mutations (${setcellOps.length}, need >= 4)`);
  for (const { interaction, mutation } of setcellOps) {
    const { x, y, ch } = mutation;
    if (!deeps.grid[y] || deeps.grid[y][x] !== '~') {
      fail(`mire_deeps.${interaction.id} setcell does not target an authored deepwater "~" cell at (${x},${y})`);
    }
    if (!deeps.legend[ch] || deeps.legend[ch].solid) {
      fail(`mire_deeps.${interaction.id} setcell replacement "${ch}" is not walkable`);
    }
  }

  // the drain flag should only fire once the sequence completes (appears 3x, once per lever's completion branch)
  if (openFlagCount < 1) fail('mire_deeps never sets flags.mire_tide_gates_open');

  // exactly 3 lever posts ('v') authored in the grid
  const leverCells = [];
  deeps.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === 'v') leverCells.push({ x, y });
  });
  if (leverCells.length !== 3) fail(`mire_deeps should have exactly 3 'v' lever tiles authored, found ${leverCells.length}`);
}

// ── Brimble's homestead room: authored empty ruin room ──
if (deeps) {
  const roomXs = [3, 4, 5, 6, 7];
  const roomYs = [15, 16, 17, 18];
  let hasRuinWall = false;
  for (const y of roomYs) {
    for (const x of roomXs) {
      const ch = deeps.grid[y][x];
      if (ch === 'u') hasRuinWall = true;
    }
  }
  if (!hasRuinWall) fail("mire_deeps Brimble's homestead room (x=3-7, y=15-18) has no 'u' ruin walls authored");
  // room must be empty of NPCs/interactions (sibling story content owns this)
  for (const npc of deeps.npcs || []) {
    if (roomXs.includes(npc.x) && roomYs.includes(npc.y)) {
      fail(`mire_deeps has an NPC "${npc.id}" inside Brimble's reserved homestead room — should remain empty`);
    }
  }
  for (const interaction of deeps.interactions || []) {
    if (roomXs.includes(interaction.x) && roomYs.includes(interaction.y)) {
      fail(`mire_deeps has an interaction "${interaction.id}" inside Brimble's reserved homestead room — should remain empty`);
    }
  }
}

// ── service NPCs in mire_village ──
const village = MIRELIGHT_MAPS.mire_village;
if (village) {
  const shopkeep = (village.npcs || []).find(n => n.id === 'mire_shopkeep');
  const healer = (village.npcs || []).find(n => n.id === 'mire_healer');
  if (!shopkeep || !shopkeep.script || shopkeep.script.shop !== 'mire_goods') {
    fail('mire_village.mire_shopkeep must have script { shop: "mire_goods" }');
  }
  if (!healer || !healer.script || !healer.script.rest || healer.script.rest.cost !== 20) {
    fail('mire_village.mire_healer must have script { rest: { cost: 20, ... } }');
  }
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

for (const id of REQUIRED_MAPS) console.log(`OK  ${id}`);
console.log('\nMirelight contracts valid.');
