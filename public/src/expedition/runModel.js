// ═══ RUN MODEL — ordered objectives, carried rewards, and results.

export const RUN_OBJECTIVES = Object.freeze({
  relay: { label: 'Stabilize the Crown relay', anchor: 'relay' },
  miniboss: { label: 'Claim a charge from the Gatebound', anchor: 'miniboss' },
  bossGate: { label: 'Enter the Gate Heart', anchor: 'bossGate' },
  kael: { label: 'Defeat Void Sentinel Kael', anchor: 'bossArena' },
  shard: { label: 'Claim the first Crown Shard', anchor: 'bossArena' },
  extraction: { label: 'Return to Nova Prime', anchor: 'bossArena' },
  complete: { label: 'Expedition complete', anchor: 'landing' }
});

export function createRunState(region, restored = null, now = Date.now()) {
  if (restored && restored.seed === region.seed && restored.generatorVersion === region.generatorVersion && restored.status === 'active') {
    return {
      ...restored,
      opened: Array.isArray(restored.opened) ? restored.opened.slice() : [],
      defeated: Array.isArray(restored.defeated) ? restored.defeated.slice() : [],
      carriedLoot: Array.isArray(restored.carriedLoot) ? restored.carriedLoot.map(entry => ({ ...entry })) : []
    };
  }
  return {
    seed: region.seed,
    generatorVersion: region.generatorVersion,
    hash: region.hash,
    biome: region.biome,
    status: 'active',
    objective: 'relay',
    startedAt: now,
    opened: [],
    defeated: [],
    carriedLoot: [],
    bossesDefeated: [],
    checkpoint: 'landing'
  };
}

export function objectiveLabel(run) {
  return (RUN_OBJECTIVES[run.objective] || RUN_OBJECTIVES.relay).label;
}

export function advanceObjective(run, event) {
  const before = run.objective;
  if (before === 'relay' && event === 'relayActivated') {
    run.objective = 'miniboss';
    run.checkpoint = 'shrine';
  } else if (before === 'miniboss' && event === 'minibossDefeated') {
    run.objective = 'bossGate';
    run.gateCharge = true;
    run.shortcutOpen = true;
  } else if (before === 'bossGate' && event === 'gateEntered') {
    run.objective = 'kael';
  } else if (before === 'kael' && event === 'kaelDefeated') {
    run.objective = 'shard';
    if (!run.bossesDefeated.includes('kael')) run.bossesDefeated.push('kael');
  } else if (before === 'shard' && event === 'shardClaimed') {
    run.objective = 'extraction';
    run.shardClaimed = true;
  } else if (before === 'extraction' && event === 'returned') {
    run.objective = 'complete';
    run.status = 'victory';
  }
  return before !== run.objective;
}

export function nearAnchor(position, anchor, radiusTiles = 2.25) {
  return Math.hypot(position.x - anchor.x, position.y - anchor.y) <= radiusTiles;
}

export function canActivateRelay(run, position, region, relayThreatsAlive) {
  return run.objective === 'relay' && nearAnchor(position, region.anchors.relay) && relayThreatsAlive === 0;
}

export function canEnterBossGate(run, position, region) {
  return run.objective === 'bossGate' && !!run.gateCharge && nearAnchor(position, region.anchors.bossGate);
}

export function claimLoot(run, lootId, region) {
  if (run.opened.includes(lootId)) return null;
  const reward = region.loot.find(entry => entry.id === lootId);
  if (!reward) return null;
  run.opened.push(lootId);
  const existing = run.carriedLoot.find(entry => entry.id === reward.item);
  if (existing) existing.qty += reward.quantity;
  else run.carriedLoot.push({ id: reward.item, qty: reward.quantity });
  return { id: reward.item, qty: reward.quantity };
}

export function settleRun(run, outcome, now = Date.now()) {
  const carried = run.carriedLoot || [];
  const secured = outcome === 'defeat'
    ? carried.map(entry => ({ id: entry.id, qty: Math.floor(entry.qty / 2) })).filter(entry => entry.qty > 0)
    : carried.map(entry => ({ ...entry }));
  run.status = outcome;
  run.durationMs = Math.max(0, now - run.startedAt);
  run.securedLoot = secured;
  return secured;
}

export function mergeInventory(inventory, rewards) {
  for (const reward of rewards) {
    const existing = inventory.find(entry => entry.id === reward.id);
    if (existing) existing.qty += reward.qty;
    else inventory.push({ id: reward.id, qty: reward.qty });
  }
  return inventory;
}

export function runSummary(run, character, gameVersion) {
  return {
    runId: createRunId(),
    seed: run.seed,
    generatorVersion: run.generatorVersion,
    result: run.status,
    finalLevel: character.level,
    lifetimeXp: character.lifetimeXp || 0,
    runXp: Math.max(0, (character.lifetimeXp || 0) - (run.startLifetimeXp || 0)),
    durationMs: run.durationMs || 0,
    bossesDefeated: (run.bossesDefeated || []).slice(),
    weaponMastery: { ...(character.weaponMastery || {}) },
    timestamp: Date.now(),
    gameVersion
  };
}

function createRunId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function rankRuns(runs) {
  return runs.slice().sort((a, b) =>
    (b.lifetimeXp || 0) - (a.lifetimeXp || 0)
    || (b.finalLevel || 0) - (a.finalLevel || 0)
    || (b.bossesDefeated?.length || 0) - (a.bossesDefeated?.length || 0)
    || (a.durationMs || Infinity) - (b.durationMs || Infinity)
    || (a.timestamp || 0) - (b.timestamp || 0)
  );
}
