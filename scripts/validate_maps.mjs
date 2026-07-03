// ═══════════════════════════════════════════════════════════════
// VALIDATE MAPS — Structural and reachability checks for authored
// exploration maps, exits, triggers, interactions, and arrivals.
// ═══════════════════════════════════════════════════════════════

import { MAPS } from '../public/src/data/maps.js';
import { TRAVEL_DESTINATIONS } from '../public/src/data/travel.js';

const errors = [];
const key = (x, y) => `${x},${y}`;

function fail(map, message) {
  errors.push(`${map.id}: ${message}`);
}

function inBounds(map, x, y) {
  return y >= 0 && y < map.grid.length && x >= 0 && x < map.grid[0].length;
}

function walkable(map, x, y) {
  if (!inBounds(map, x, y)) return false;
  const entry = map.legend[map.grid[y][x]];
  if (!entry || entry.solid) return false;
  return !(map.npcs || []).some(npc => npc.x === x && npc.y === y);
}

function reachable(map, start) {
  const seen = new Set();
  const queue = [start];
  while (queue.length) {
    const p = queue.shift();
    const id = key(p.x, p.y);
    if (seen.has(id) || !walkable(map, p.x, p.y)) continue;
    seen.add(id);
    queue.push(
      { x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y },
      { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 }
    );
  }
  return seen;
}

const arrivals = new Map(Object.keys(MAPS).map(id => [id, []]));
for (const source of Object.values(MAPS)) {
  for (const exit of source.exits || []) {
    if (exit.to && arrivals.has(exit.to.map)) {
      arrivals.get(exit.to.map).push({
        x: exit.to.x, y: exit.to.y, source: `${source.id}.${exit.id}`
      });
    }
  }
}
for (const destination of TRAVEL_DESTINATIONS) {
  if (!destination.map) continue;
  if (!MAPS[destination.map]) {
    errors.push(`travel.${destination.id}: targets unknown map "${destination.map}"`);
    continue;
  }
  if (!destination.entry) {
    errors.push(`travel.${destination.id}: missing arrival entry`);
    continue;
  }
  arrivals.get(destination.map).push({
    x: destination.entry.x, y: destination.entry.y, source: `travel.${destination.id}`
  });
}

for (const map of Object.values(MAPS)) {
  const width = map.grid[0].length;
  map.grid.forEach((row, y) => {
    if (row.length !== width) fail(map, `row ${y} width ${row.length}, expected ${width}`);
    for (const ch of row) if (!map.legend[ch]) fail(map, `row ${y} uses unknown legend "${ch}"`);
  });
  if (!walkable(map, map.spawn.x, map.spawn.y)) fail(map, 'spawn is not walkable');

  const ids = new Set();
  for (const group of ['exits', 'triggers', 'interactions']) {
    for (const def of map[group] || []) {
      if (!def.id) fail(map, `${group} entry missing id`);
      if (ids.has(def.id)) fail(map, `duplicate authored id "${def.id}"`);
      ids.add(def.id);
      const cells = def.cells || [{ x: def.x, y: def.y }];
      for (const cell of cells) {
        if (!inBounds(map, cell.x, cell.y)) fail(map, `${def.id} cell is out of bounds`);
        if (group !== 'interactions' && !walkable(map, cell.x, cell.y)) {
          fail(map, `${def.id} cell ${key(cell.x, cell.y)} is not walkable`);
        }
      }
    }
  }

  for (const exit of map.exits || []) {
    const target = exit.to && MAPS[exit.to.map];
    if (!target) {
      fail(map, `${exit.id} targets unknown map`);
      continue;
    }
    if (!walkable(target, exit.to.x, exit.to.y)) fail(map, `${exit.id} arrival is not walkable`);
    const arrivalIsExit = (target.exits || []).some(other =>
      (other.cells || []).some(cell => cell.x === exit.to.x && cell.y === exit.to.y));
    if (arrivalIsExit) fail(map, `${exit.id} arrival overlaps a target exit`);
  }

  const starts = [{ ...map.spawn, source: 'spawn' }, ...arrivals.get(map.id)];
  for (const start of starts) {
    if (!walkable(map, start.x, start.y)) {
      fail(map, `${start.source} arrival is not walkable`);
      continue;
    }
    const seen = reachable(map, start);
    for (const exit of map.exits || []) {
      for (const cell of exit.cells || []) {
        if (!seen.has(key(cell.x, cell.y))) {
          fail(map, `${exit.id} cannot be reached from ${start.source}`);
        }
      }
    }
    for (const interaction of map.interactions || []) {
      const adjacent = [
        [interaction.x + 1, interaction.y], [interaction.x - 1, interaction.y],
        [interaction.x, interaction.y + 1], [interaction.x, interaction.y - 1]
      ].some(([x, y]) => seen.has(key(x, y)));
      if (!adjacent) fail(map, `${interaction.id} has no reachable side from ${start.source}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}

for (const map of Object.values(MAPS)) console.log(`OK  ${map.id}`);
console.log('\nAll maps valid and reachable.');
