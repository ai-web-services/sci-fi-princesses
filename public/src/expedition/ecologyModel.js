// ═══ ECOLOGY MODEL — deterministic behavior and pooled population lifecycle.

export const ECOLOGY_LIMITS = Object.freeze({
  activeBudget: 18,
  spawnDistance: 190,
  despawnDistance: 420,
  respawnMinMs: 14000,
  respawnMaxMs: 26000
});

export function createEcologyState(point, index, rng) {
  const respawnable = ['passive', 'neutral', 'territorial', 'voidborn', 'elite'].includes(point.kind)
    && point.territory !== 'relay';
  return {
    homeX: point.x * 16 + 8, homeY: point.y * 16 + 8,
    spawnIndex: index, respawnable, dormant: false, respawnMs: 0,
    behavior: initialBehavior(point.kind),
    wanderAngle: rng() * Math.PI * 2, wanderMs: rng.int(700, 2200),
    provoked: false, defeats: 0
  };
}

export function provokeCreature(enemy) {
  if (!enemy?.ecology) return;
  enemy.ecology.provoked = true;
  if (enemy.kind === 'passive') enemy.state = 'flee';
  else if (enemy.kind === 'neutral') enemy.state = 'retaliate';
}

export function retireCreature(enemy, rng) {
  const ecology = enemy?.ecology;
  if (!ecology || !ecology.respawnable) return false;
  ecology.dormant = true;
  ecology.defeats++;
  ecology.provoked = false;
  ecology.respawnMs = rng.int(ECOLOGY_LIMITS.respawnMinMs, ECOLOGY_LIMITS.respawnMaxMs)
    + (enemy.kind === 'elite' ? 12000 : 0);
  enemy.state = initialBehavior(enemy.kind);
  return true;
}

export function stepEcology(enemy, deltaMs, context) {
  const ecology = enemy?.ecology;
  if (!ecology) return null;
  const distance = Math.hypot(context.playerX - enemy.body.x, context.playerY - enemy.body.y);
  if (enemy.body.active && ecology.respawnable && distance > ECOLOGY_LIMITS.despawnDistance && !context.onScreen(enemy.body.x, enemy.body.y)) {
    ecology.dormant = true;
    ecology.respawnMs = Math.min(ecology.respawnMs || 1800, 1800);
    return { type: 'despawn' };
  }
  if (enemy.body.active || !ecology.respawnable || !ecology.dormant) return null;
  ecology.respawnMs = Math.max(0, ecology.respawnMs - deltaMs);
  const homeDistance = Math.hypot(context.playerX - ecology.homeX, context.playerY - ecology.homeY);
  if (ecology.respawnMs > 0 || homeDistance < ECOLOGY_LIMITS.spawnDistance || context.onScreen(ecology.homeX, ecology.homeY) || context.activeCount >= ECOLOGY_LIMITS.activeBudget) return null;
  ecology.dormant = false;
  ecology.wanderMs = context.rng.int(700, 2200);
  ecology.wanderAngle = context.rng() * Math.PI * 2;
  return { type: 'respawn', x: ecology.homeX, y: ecology.homeY };
}

export function updateWander(enemy, deltaMs, canOccupy, rng) {
  const ecology = enemy.ecology;
  ecology.wanderMs -= deltaMs;
  if (ecology.wanderMs <= 0) {
    ecology.wanderMs = rng.int(800, 2400);
    ecology.wanderAngle = rng() * Math.PI * 2;
    if (enemy.kind === 'passive') {
      const activity = rng();
      enemy.state = activity < 0.16 ? 'sleep' : activity < 0.34 ? 'gather' : activity < 0.58 ? 'graze' : 'wander';
    } else enemy.state = rng.chance(0.28) ? 'idle' : 'wander';
  }
  if (enemy.state !== 'wander') return;
  const speed = enemy.kind === 'passive' ? 9 : 11;
  const nx = enemy.body.x + Math.cos(ecology.wanderAngle) * speed * deltaMs / 1000;
  const ny = enemy.body.y + Math.sin(ecology.wanderAngle) * speed * deltaMs / 1000;
  if (canOccupy(nx, ny) && Math.hypot(nx - ecology.homeX, ny - ecology.homeY) < 52) enemy.body.setPosition(nx, ny);
  else ecology.wanderAngle += Math.PI * 0.7;
}

function initialBehavior(kind) {
  if (kind === 'passive') return 'graze';
  if (kind === 'neutral') return 'idle';
  if (kind === 'territorial') return 'guard';
  if (kind === 'elite') return 'flank';
  return 'pursue';
}
