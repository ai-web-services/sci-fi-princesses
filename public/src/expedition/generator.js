// ═══ EXPEDITION GENERATOR — graph first, terrain second.

import { createStreams, hash32 } from './rng.js';

export const GENERATOR_VERSION = 2;
export const EXPEDITION_W = 64;
export const EXPEDITION_H = 64;

export const CELL = Object.freeze({
  BLOCK: 0,
  GROUND: 1,
  PATH: 2,
  SHALLOW: 3,
  HAZARD: 4,
  SHRINE: 5,
  OBJECTIVE: 6,
  EXTRACTION: 7
});

const WALKABLE = new Set([CELL.GROUND, CELL.PATH, CELL.SHALLOW, CELL.SHRINE, CELL.OBJECTIVE, CELL.EXTRACTION]);

const ANCHOR_ORDER = [
  'landing', 'basin', 'territory', 'relay', 'shrine', 'miniboss', 'shortcut', 'bossGate', 'bossArena',
  'optionalAnomaly', 'optionalCache'
];

function gridOf(value) {
  return Array.from({ length: EXPEDITION_H }, () => Array(EXPEDITION_W).fill(value));
}

function inside(x, y, pad = 0) {
  return x >= pad && y >= pad && x < EXPEDITION_W - pad && y < EXPEDITION_H - pad;
}

function carveDisc(grid, cx, cy, radius, value = CELL.GROUND) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (inside(x, y, 1) && (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) grid[y][x] = value;
    }
  }
}

function carveCorridor(grid, from, to, rng, width = 3) {
  let x = from.x, y = from.y;
  const horizontalFirst = rng.chance(0.5);
  const carve = () => carveDisc(grid, x, y, Math.floor(width / 2), CELL.PATH);
  carve();
  while (x !== to.x || y !== to.y) {
    const canX = x !== to.x, canY = y !== to.y;
    const chooseX = canX && (!canY || (horizontalFirst ? rng.chance(0.72) : rng.chance(0.28)));
    if (chooseX) x += Math.sign(to.x - x);
    else y += Math.sign(to.y - y);
    carve();
  }
}

function buildAnchors(rng) {
  const jitter = (base, amount = 3) => base + rng.int(-amount, amount);
  return {
    landing: { x: jitter(8, 1), y: jitter(54, 1), radius: 5, kind: 'safe' },
    basin: { x: jitter(16), y: jitter(47), radius: 5, kind: 'passive' },
    territory: { x: jitter(23), y: jitter(38), radius: 5, kind: 'territorial' },
    relay: { x: jitter(32), y: jitter(31), radius: 6, kind: 'objective' },
    shrine: { x: jitter(42), y: jitter(37), radius: 5, kind: 'safe' },
    miniboss: { x: jitter(50), y: jitter(28), radius: 6, kind: 'miniboss' },
    shortcut: { x: jitter(43), y: jitter(50), radius: 4, kind: 'shortcut' },
    bossGate: { x: jitter(50), y: jitter(17), radius: 5, kind: 'objective' },
    bossArena: { x: jitter(36, 2), y: jitter(9, 1), radius: 9, kind: 'boss' },
    optionalAnomaly: { x: jitter(14), y: jitter(27), radius: 5, kind: 'elite' },
    optionalCache: { x: jitter(53), y: jitter(47), radius: 4, kind: 'reward' }
  };
}

function graphEdges() {
  return [
    ['landing', 'basin'], ['basin', 'territory'], ['territory', 'relay'], ['relay', 'shrine'],
    ['shrine', 'miniboss'], ['miniboss', 'bossGate'], ['bossGate', 'bossArena'],
    ['miniboss', 'shortcut'], ['shortcut', 'landing'], ['territory', 'optionalAnomaly'],
    ['optionalAnomaly', 'relay'], ['shrine', 'optionalCache'], ['optionalCache', 'shortcut']
  ];
}

function decorateTerrain(grid, anchors, rng) {
  for (let i = 0; i < 46; i++) {
    const x = rng.int(3, EXPEDITION_W - 4), y = rng.int(3, EXPEDITION_H - 4);
    const radius = rng.int(1, 3);
    for (let yy = y - radius; yy <= y + radius; yy++) {
      for (let xx = x - radius; xx <= x + radius; xx++) {
        if (!inside(xx, yy, 1) || grid[yy][xx] !== CELL.BLOCK) continue;
        grid[yy][xx] = rng.chance(0.76) ? CELL.SHALLOW : CELL.HAZARD;
      }
    }
  }
  grid[anchors.landing.y][anchors.landing.x] = CELL.EXTRACTION;
  grid[anchors.relay.y][anchors.relay.x] = CELL.OBJECTIVE;
  grid[anchors.shrine.y][anchors.shrine.x] = CELL.SHRINE;
  grid[anchors.miniboss.y][anchors.miniboss.x] = CELL.OBJECTIVE;
  grid[anchors.bossGate.y][anchors.bossGate.x] = CELL.OBJECTIVE;
  grid[anchors.bossArena.y][anchors.bossArena.x] = CELL.OBJECTIVE;
}

function habitatPoints(grid, anchors, rng) {
  const specs = [
    ['basin', 'passive', 4], ['basin', 'neutral', 3], ['territory', 'territorial', 3], ['relay', 'voidborn', 3],
    ['optionalAnomaly', 'elite', 3], ['miniboss', 'miniboss', 1]
  ];
  const points = [];
  for (const [anchorId, kind, count] of specs) {
    const anchor = anchors[anchorId];
    for (let i = 0; i < count; i++) {
      let placed = false;
      for (let tries = 0; tries < 30 && !placed; tries++) {
        const x = anchor.x + rng.int(-anchor.radius + 1, anchor.radius - 1);
        const y = anchor.y + rng.int(-anchor.radius + 1, anchor.radius - 1);
        const outsideLanding = Math.hypot(x - anchors.landing.x, y - anchors.landing.y) >= 8;
        if (inside(x, y, 2) && outsideLanding && WALKABLE.has(grid[y][x]) && Math.hypot(x - anchor.x, y - anchor.y) >= 2) {
          points.push({ x, y, territory: anchorId, kind });
          placed = true;
        }
      }
    }
  }
  return points;
}

function lootManifest(anchors, rng) {
  const table = ['scrap_metal', 'bio_gel', 'void_essence', 'stellar_crystal'];
  return ['optionalAnomaly', 'optionalCache', 'miniboss'].map((anchorId, index) => ({
    id: `cache_${index}`,
    anchorId,
    x: anchors[anchorId].x,
    y: anchors[anchorId].y,
    item: index === 2 ? 'stellar_crystal' : rng.pick(table),
    quantity: rng.int(1, index === 2 ? 2 : 3)
  }));
}

export function isWalkable(cell) { return WALKABLE.has(cell); }

export function floodReachable(grid, start) {
  const seen = new Set([`${start.x},${start.y}`]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = p.x + dx, y = p.y + dy, key = `${x},${y}`;
      if (!inside(x, y) || seen.has(key) || !isWalkable(grid[y][x])) continue;
      seen.add(key); queue.push({ x, y });
    }
  }
  return seen;
}

export function validateExpedition(region) {
  const errors = [];
  if (!region || region.width !== EXPEDITION_W || region.height !== EXPEDITION_H) errors.push('invalid dimensions');
  if (!region || region.generatorVersion !== GENERATOR_VERSION) errors.push('generator version mismatch');
  if (errors.length) return { valid: false, errors };
  const { grid, anchors } = region;
  const reached = floodReachable(grid, anchors.landing);
  for (const id of ANCHOR_ORDER) {
    const a = anchors[id];
    if (!a || !inside(a.x, a.y, 2)) errors.push(`${id}: invalid anchor`);
    else if (!reached.has(`${a.x},${a.y}`)) errors.push(`${id}: unreachable`);
  }
  for (const id of ['landing', 'relay', 'shrine', 'miniboss', 'bossGate', 'bossArena']) {
    const a = anchors[id];
    if (!a) continue;
    for (let y = a.y - 1; y <= a.y + 1; y++) for (let x = a.x - 1; x <= a.x + 1; x++) {
      if (!inside(x, y) || !isWalkable(grid[y][x])) errors.push(`${id}: blocked footprint`);
    }
  }
  const habitats = region.habitats || [];
  if (habitats.length > 22) errors.push('population cap exceeded');
  for (const p of habitats) {
    if (!inside(p.x, p.y) || !isWalkable(grid[p.y][p.x])) errors.push('invalid habitat');
    if (Math.hypot(p.x - anchors.landing.x, p.y - anchors.landing.y) < 8) errors.push('habitat inside landing safe radius');
  }
  return { valid: errors.length === 0, errors, reachableCount: reached.size };
}

function regionHash(region) {
  return hash32(JSON.stringify({
    version: region.generatorVersion,
    seed: region.seed,
    grid: region.grid,
    anchors: region.anchors,
    habitats: region.habitats,
    loot: region.loot
  })).toString(16).padStart(8, '0');
}

function generateAttempt(seed, attempt) {
  const streams = createStreams(seed, attempt);
  const grid = gridOf(CELL.BLOCK);
  const anchors = buildAnchors(streams.layout);
  for (const id of ANCHOR_ORDER) carveDisc(grid, anchors[id].x, anchors[id].y, anchors[id].radius);
  const edges = graphEdges();
  for (const [from, to] of edges) carveCorridor(grid, anchors[from], anchors[to], streams.layout, 3);
  decorateTerrain(grid, anchors, streams.terrain);
  const region = {
    generatorVersion: GENERATOR_VERSION,
    seed: seed >>> 0,
    attempt,
    biome: 'lumenwild',
    width: EXPEDITION_W,
    height: EXPEDITION_H,
    grid,
    anchors,
    edges,
    habitats: habitatPoints(grid, anchors, streams.ecology),
    loot: lootManifest(anchors, streams.loot),
    objectives: ['relay', 'miniboss', 'bossGate', 'bossArena', 'extraction']
  };
  region.hash = regionHash(region);
  return region;
}

export function generateExpedition(seed) {
  const normalizedSeed = Number(seed) >>> 0;
  for (let attempt = 0; attempt < 8; attempt++) {
    const region = generateAttempt(normalizedSeed, attempt);
    const validation = validateExpedition(region);
    if (validation.valid) return region;
  }
  throw new Error(`Expedition generation failed for seed ${normalizedSeed}`);
}
