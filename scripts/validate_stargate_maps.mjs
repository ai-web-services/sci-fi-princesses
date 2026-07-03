// ═══════════════════════════════════════════════════════════════
// VALIDATE STARGATE MAPS — M4 dungeon content contracts.
// ═══════════════════════════════════════════════════════════════

import { STARGATE_LEGEND } from '../public/src/data/maps.js';
import { STARGATE_MAPS } from '../public/src/data/maps/stargate.js';
import { ENEMIES } from '../public/src/data/enemies.js';
import { triggersByMap } from '../public/src/data/act1.js';

const REQUIRED_MAPS = [
  'gate_approach',
  'gate_hall_west',
  'gate_hall_east',
  'gate_depths',
  'gate_heart'
];
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
  const map = STARGATE_MAPS[id];
  if (!map) {
    fail(`missing required map "${id}"`);
    continue;
  }
  for (const [ch, canonical] of Object.entries(STARGATE_LEGEND)) {
    if (JSON.stringify(map.legend[ch]) !== JSON.stringify(canonical)) {
      fail(`${id} legend entry "${ch}" differs from STARGATE_LEGEND`);
    }
  }
  if (!map.encounters && id !== 'gate_heart') fail(`${id} is missing encounters`);
  if (map.encounters) {
    if (map.encounters.backdrop !== 'stargate') fail(`${id} encounter backdrop is not "stargate"`);
    if (!map.encounters.groups.length) fail(`${id} has no encounter groups`);
    for (const group of map.encounters.groups) {
      if (!group.length) fail(`${id} has an empty encounter group`);
      for (const enemyId of group) {
        if (!ENEMIES[enemyId]) fail(`${id} uses unknown enemy "${enemyId}"`);
      }
    }
  }
}

const puzzleOps = [];
for (const id of ['gate_hall_west', 'gate_hall_east']) {
  const map = STARGATE_MAPS[id];
  for (const interaction of map.interactions || []) {
    walkScript(interaction.script, op => {
      if (op.setcell) puzzleOps.push({ map, interaction, mutation: op.setcell });
    });
  }
}
if (!puzzleOps.length) fail('barrier consoles contain no setcell mutations');
for (const { map, interaction, mutation } of puzzleOps) {
  const { x, y, ch } = mutation;
  if (!map.grid[y] || map.grid[y][x] !== '|') {
    fail(`${map.id}.${interaction.id} setcell does not target an authored barrier`);
  }
  if (!map.legend[ch] || map.legend[ch].solid) {
    fail(`${map.id}.${interaction.id} setcell replacement is not walkable`);
  }
}

const heart = STARGATE_MAPS.gate_heart;
const bossTrigger = (triggersByMap.gate_heart || []).find(trigger => trigger.id === 'act1_kael_confrontation');
if (!bossTrigger) {
  fail('Act 1 story is missing its authoritative Kael trigger');
} else {
  let battleOp = null;
  walkScript(bossTrigger.script || [], op => { if (op.battle) battleOp = op; });
  const battle = battleOp && battleOp.battle;
  if (!battle || battle.enemies.length !== 1 || battle.enemies[0] !== 'kael') {
    fail('kael_boss does not launch only kael');
  }
  if (!battle || battle.isBoss !== true || battle.canFlee !== false) {
    fail('kael_boss must be a non-fleeable boss battle');
  }
  if (!battle || battle.backdrop !== 'stargate') {
    fail('kael_boss backdrop is not "stargate"');
  }
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

for (const id of REQUIRED_MAPS) console.log(`OK  ${id}`);
console.log(`\nStargate contracts valid (${puzzleOps.length} barrier mutations).`);
