// ═══════════════════════════════════════════════════════════════
// VALIDATE ACT I — Story placement, script-op, quest, recruit,
// shop, evolution, and single-boss authority contracts.
// ═══════════════════════════════════════════════════════════════

import { MAPS } from '../public/src/data/maps.js';
import { npcsByMap, triggersByMap, interactionsByMap, quests } from '../public/src/data/act1.js';
import { CHARACTERS } from '../public/src/data/characters.js';
import { ENEMIES } from '../public/src/data/enemies.js';
import { ITEMS } from '../public/src/data/items.js';
import { SHOPS } from '../public/src/data/shops.js';

const errors = [];
const ALLOWED = new Set([
  'say', 'choice', 'face', 'move', 'wait', 'fade', 'flash', 'shake', 'music',
  'sfx', 'flag', 'give', 'teleport', 'quest', 'battle', 'setcell', 'tutorial',
  'evolve', 'shop', 'rest', 'autosave', 'recruit', 'unlock', 'banner', 'run', 'if'
]);

function fail(message) { errors.push(message); }

function walk(ops, where) {
  for (const op of ops || []) {
    const keys = Object.keys(op);
    const primary = keys.find(key => ALLOWED.has(key));
    const extras = keys.filter(key => key !== primary && !['then', 'else'].includes(key));
    if (!primary || extras.length) fail(`${where}: unsupported op ${keys.join(',')}`);
    if (op.recruit && !CHARACTERS[op.recruit]) fail(`${where}: unknown recruit ${op.recruit}`);
    if (op.evolve && !CHARACTERS[op.evolve]) fail(`${where}: unknown evolution character ${op.evolve}`);
    if (op.shop && !SHOPS[op.shop]) fail(`${where}: unknown shop ${op.shop}`);
    if (op.give && op.give.item && !ITEMS[op.give.item]) fail(`${where}: unknown item ${op.give.item}`);
    if (op.teleport && !MAPS[op.teleport.map]) fail(`${where}: unknown teleport map ${op.teleport.map}`);
    if (op.battle) {
      for (const enemy of op.battle.enemies || []) if (!ENEMIES[enemy]) fail(`${where}: unknown enemy ${enemy}`);
      walk(op.battle.winScript, `${where}.winScript`);
    }
    if (op.if) { walk(op.then, `${where}.then`); walk(op.else, `${where}.else`); }
    if (op.choice && op.choice.results) {
      for (const [key, branch] of Object.entries(op.choice.results)) walk(branch, `${where}.choice.${key}`);
    }
  }
}

let kaelBattles = 0;
for (const [kind, registry] of Object.entries({ npcsByMap, triggersByMap, interactionsByMap })) {
  for (const [mapId, placements] of Object.entries(registry)) {
    const map = MAPS[mapId];
    if (!map) { fail(`${kind}: unknown map ${mapId}`); continue; }
    for (const placement of placements) {
      const points = placement.cells || [{ x: placement.x, y: placement.y }];
      for (const point of points) {
        if (!map.grid[point.y] || point.x < 0 || point.x >= map.grid[point.y].length) {
          fail(`${mapId}.${placement.id}: placement out of bounds`);
        }
      }
      walk(placement.script, `${mapId}.${placement.id}`);
      const scan = ops => {
        for (const op of ops || []) {
          if (op.battle && op.battle.enemies?.includes('kael')) kaelBattles++;
          if (op.if) { scan(op.then); scan(op.else); }
          if (op.choice?.results) Object.values(op.choice.results).forEach(scan);
          if (op.battle?.winScript) scan(op.battle.winScript);
        }
      };
      scan(placement.script);
    }
  }
}

if (kaelBattles !== 1) fail(`expected exactly one Kael battle, found ${kaelBattles}`);
if (!quests.q_first_claim || quests.q_first_claim.stages.length < 7) fail('First Claim quest is incomplete');
if (!quests.q_fall_aftershock) fail('After the Fall quest extension is missing');

for (const [shopId, shop] of Object.entries(SHOPS)) {
  for (const item of shop.items) if (!ITEMS[item]) fail(`${shopId}: unknown stock item ${item}`);
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

console.log('OK  Act I placements and script operations');
console.log('OK  Single authoritative Kael battle');
console.log('OK  Quest, recruit, evolution, shop, enemy, and item references');
