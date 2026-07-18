// ═══ SEEDED RNG — deterministic named streams for expeditions.

export function hash32(value) {
  const text = String(value);
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  return (h ^ (h >>> 16)) >>> 0;
}

export function createRng(seed) {
  let state = hash32(seed) || 0x6d2b79f5;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (min, max) => Math.floor(next() * (max - min + 1)) + min;
  next.pick = values => values[Math.floor(next() * values.length)];
  next.chance = probability => next() < probability;
  next.state = () => state;
  return next;
}

export function streamSeed(runSeed, streamName, attempt = 0) {
  return hash32(`${runSeed}:${streamName}:${attempt}`);
}

export function createStreams(runSeed, attempt = 0) {
  return {
    layout: createRng(streamSeed(runSeed, 'layout', attempt)),
    terrain: createRng(streamSeed(runSeed, 'terrain', attempt)),
    ecology: createRng(streamSeed(runSeed, 'ecology', attempt)),
    encounters: createRng(streamSeed(runSeed, 'encounters', attempt)),
    loot: createRng(streamSeed(runSeed, 'loot', attempt)),
    cosmetic: createRng(streamSeed(runSeed, 'cosmetic', attempt))
  };
}
