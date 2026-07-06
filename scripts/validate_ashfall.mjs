// ═══════════════════════════════════════════════════════════════
// VALIDATE ASHFALL MAPS — M6 dungeon content contracts.
// ═══════════════════════════════════════════════════════════════

import { ASHFALL_LEGEND } from '../public/src/data/maps.js';
import { ASHFALL_MAPS } from '../public/src/data/maps/ashfall.js';
import { ENEMIES } from '../public/src/data/enemies.js';

const REQUIRED_MAPS = [
  'ash_gate',
  'ash_wastes',
  'ash_hold',
  'ash_caldera',
  'ash_throne'
];
const SAFE_MAPS = ['ash_gate', 'ash_hold', 'ash_throne'];
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
    if (op.battle && op.battle.mercyScript) walkScript(op.battle.mercyScript, visit);
  }
}

for (const id of REQUIRED_MAPS) {
  const map = ASHFALL_MAPS[id];
  if (!map) {
    fail(`missing required map "${id}"`);
    continue;
  }

  // legend contract
  for (const [ch, canonical] of Object.entries(ASHFALL_LEGEND)) {
    if (JSON.stringify(map.legend[ch]) !== JSON.stringify(canonical)) {
      fail(`${id} legend entry "${ch}" differs from ASHFALL_LEGEND`);
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
    const dest = ASHFALL_MAPS[exit.to.map];
    if (!dest) {
      fail(`${id}.${exit.id} targets unknown map "${exit.to.map}"`);
    } else {
      const dch = dest.grid[exit.to.y] ? dest.grid[exit.to.y][exit.to.x] : undefined;
      if (dch === undefined) fail(`${id}.${exit.id} destination out of bounds in "${exit.to.map}"`);
      else if (isSolid(dch)) fail(`${id}.${exit.id} destination lands on a solid tile "${dch}" in "${exit.to.map}"`);
    }
  }
}

// ── spawn contract: ash_gate arrival point (fast travel wiring) ──
const gate = ASHFALL_MAPS.ash_gate;
if (gate) {
  const s = gate.spawn;
  if (!(s.x === 14 && s.y === 19 && s.dir === 'up')) {
    fail('ash_gate spawn must be exactly {x:14, y:19, dir:"up"}');
  }
}

// ── ambient hazard contract: at least one walkable 'h' ember tile with a
//    hazard field, present in ash_caldera, ticking HP unless the party moves ──
const caldera = ASHFALL_MAPS.ash_caldera;
if (caldera) {
  const hEntry = caldera.legend.h;
  if (!hEntry || hEntry.solid) fail('ash_caldera legend "h" (ember) must be walkable (solid must be falsy)');
  if (!hEntry || !hEntry.hazard || !hEntry.hazard.amount || !hEntry.hazard.interval) {
    fail('ash_caldera legend "h" (ember) must define hazard: { amount, interval }');
  }
  let emberCount = 0;
  caldera.grid.forEach(row => { for (const ch of row) if (ch === 'h') emberCount++; });
  if (emberCount < 4) fail(`ash_caldera should have several 'h' ember hazard tiles authored, found ${emberCount}`);

  // ── vent puzzle contract: 3 vents, gated slag-clear, single flag ──
  const ventIds = ['ash_vent_1', 'ash_vent_2', 'ash_vent_3'];
  const found = new Set();
  const setcellOps = [];
  let openFlagCount = 0;

  for (const interaction of caldera.interactions || []) {
    if (ventIds.includes(interaction.id)) found.add(interaction.id);
    walkScript(interaction.script, op => {
      if (op.setcell) setcellOps.push({ interaction, mutation: op.setcell });
      if (op.flag && op.flag.key === 'ash_slag_cleared' && op.flag.value === true) openFlagCount++;
    });
  }

  for (const id of ventIds) {
    if (!found.has(id)) fail(`ash_caldera is missing vent interaction "${id}"`);
  }

  if (setcellOps.length < 4) fail(`ash_caldera slag-clear sequence has too few setcell mutations (${setcellOps.length}, need >= 4)`);
  for (const { interaction, mutation } of setcellOps) {
    const { x, y, ch } = mutation;
    if (!caldera.grid[y] || caldera.grid[y][x] !== 'r') {
      fail(`ash_caldera.${interaction.id} setcell does not target an authored magma-slag "r" cell at (${x},${y})`);
    }
    if (!caldera.legend[ch] || caldera.legend[ch].solid) {
      fail(`ash_caldera.${interaction.id} setcell replacement "${ch}" is not walkable`);
    }
  }

  if (openFlagCount < 1) fail('ash_caldera never sets flags.ash_slag_cleared');

  // exactly 3 vent posts ('n') authored in the grid
  const ventCells = [];
  caldera.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === 'n') ventCells.push({ x, y });
  });
  if (ventCells.length !== 3) fail(`ash_caldera should have exactly 3 'n' vent tiles authored, found ${ventCells.length}`);

  // ── Drakkor's fortress-corner room: authored reserved room ──
  const roomXs = [22, 23, 24, 25, 26];
  const roomYs = [15, 16, 17, 18];
  let hasFortressWall = false;
  for (const y of roomYs) {
    for (const x of roomXs) {
      if (caldera.grid[y][x] === 'u') hasFortressWall = true;
    }
  }
  if (!hasFortressWall) fail("ash_caldera Drakkor's fortress room (x=22-26, y=15-18) has no 'u' ruined-hold walls authored");
  for (const npc of caldera.npcs || []) {
    if (roomXs.includes(npc.x) && roomYs.includes(npc.y)) {
      fail(`ash_caldera has an NPC "${npc.id}" inside Drakkor's reserved fortress room — should remain empty`);
    }
  }
  for (const interaction of caldera.interactions || []) {
    if (roomXs.includes(interaction.x) && roomYs.includes(interaction.y) && !ventIds.includes(interaction.id)) {
      fail(`ash_caldera has an interaction "${interaction.id}" inside Drakkor's reserved fortress room — should remain empty (sibling story content owns this)`);
    }
  }
}

// ── service NPCs in ash_hold ──
const hold = ASHFALL_MAPS.ash_hold;
if (hold) {
  const shopkeep = (hold.npcs || []).find(n => n.id === 'ash_shopkeep');
  const healer = (hold.npcs || []).find(n => n.id === 'ash_healer');
  if (!shopkeep || !shopkeep.script || shopkeep.script.shop !== 'ash_goods') {
    fail('ash_hold.ash_shopkeep must have script { shop: "ash_goods" }');
  }
  if (!healer || !healer.script || !healer.script.rest || healer.script.rest.cost !== 20) {
    fail('ash_hold.ash_healer must have script { rest: { cost: 20, ... } }');
  }
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

for (const id of REQUIRED_MAPS) console.log(`OK  ${id}`);
console.log('\nAshfall contracts valid.');
