// ═══ ACTION MODEL — frame-rate-independent player combat state.

export const WEAPON_ORDER = ['blade', 'lance', 'wand'];

export const WEAPONS = Object.freeze({
  blade: {
    name: 'Plasma Blade', damageType: 'slash', stamina: [8, 9, 12],
    damage: [1.0, 1.18, 1.55], reach: [27, 29, 32], arc: 0.95,
    activeMs: [105, 115, 145], recoveryMs: [120, 135, 210], moveScale: [0.75, 0.68, 0.5]
  },
  lance: {
    name: 'Stellar Lance', damageType: 'pierce', stamina: [11, 14, 20],
    damage: [1.2, 0.92, 1.9], reach: [42, 37, 52], arc: 0.38,
    activeMs: [125, 155, 180], recoveryMs: [190, 220, 310], moveScale: [0.55, 0.48, 0.25]
  },
  wand: {
    name: 'Crown Wand', damageType: 'light', stamina: [7],
    damage: [0.78], reach: [132], arc: 0.22,
    activeMs: [80], recoveryMs: [240], moveScale: [0.8]
  }
});

export const WEAPON_SKILLS = Object.freeze({
  blade: { name: 'Crown Counter', energy: 12, multiplier: 1.7, reach: 38, arc: 1.45, activeMs: 220, recoveryMs: 180, invulnerableMs: 210 },
  lance: { name: 'Comet Charge', energy: 16, multiplier: 2.15, reach: 34, arc: 0.42, activeMs: 300, recoveryMs: 240, dashSpeed: 178 },
  wand: { name: 'Nova Field', energy: 20, multiplier: 1.55, reach: 68, arc: Math.PI, activeMs: 260, recoveryMs: 280, omni: true }
});

export function createActionState(saved = {}) {
  return {
    hp: saved.hp ?? saved.maxHp ?? 110,
    maxHp: saved.maxHp ?? 110,
    stamina: saved.stamina ?? saved.maxStamina ?? 100,
    maxStamina: saved.maxStamina ?? 100,
    energy: saved.sp ?? saved.energy ?? 0,
    maxEnergy: saved.maxSp ?? saved.maxEnergy ?? 48,
    weapon: WEAPONS[saved.weapon] ? saved.weapon : 'blade',
    combo: 0,
    comboWindowMs: 0,
    action: null,
    invulnerableMs: 0,
    regenDelayMs: 0,
    facing: { x: 0, y: 1 }
    ,wandHits: 0
  };
}

export function normalizedVector(x, y, fallback = { x: 0, y: 1 }) {
  const length = Math.hypot(x, y);
  return length > 0.001 ? { x: x / length, y: y / length } : { ...fallback };
}

export function switchWeapon(state, direction) {
  if (state.action && state.action.phase === 'active') return false;
  const index = WEAPON_ORDER.indexOf(state.weapon);
  state.weapon = WEAPON_ORDER[(index + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length];
  state.combo = 0;
  state.comboWindowMs = 0;
  return true;
}

export function startAttack(state) {
  if (state.action) return null;
  const weapon = WEAPONS[state.weapon];
  const combo = state.weapon === 'wand' ? 0 : (state.combo % weapon.damage.length);
  const cost = weapon.stamina[combo];
  if (state.stamina < cost) return null;
  state.stamina -= cost;
  state.regenDelayMs = 650;
  state.action = {
    type: 'attack', weapon: state.weapon, combo, phase: 'active', elapsedMs: 0,
    activeMs: weapon.activeMs[combo], recoveryMs: weapon.recoveryMs[combo], hitIds: new Set()
  };
  return state.action;
}

export function startDodge(state, direction) {
  if (state.action || state.stamina < 24) return null;
  state.stamina -= 24;
  state.regenDelayMs = 900;
  state.invulnerableMs = 130;
  state.action = { type: 'dodge', phase: 'active', elapsedMs: 0, activeMs: 250, recoveryMs: 110, direction: normalizedVector(direction.x, direction.y, state.facing), hitIds: new Set() };
  return state.action;
}

export function startWeaponSkill(state) {
  if (state.action) return null;
  const skill = WEAPON_SKILLS[state.weapon];
  if (!skill || state.energy < skill.energy) return null;
  state.energy -= skill.energy;
  state.regenDelayMs = 700;
  state.invulnerableMs = Math.max(state.invulnerableMs, skill.invulnerableMs || 0);
  state.action = {
    type: 'skill', weapon: state.weapon, combo: 0, phase: 'active', elapsedMs: 0,
    activeMs: skill.activeMs, recoveryMs: skill.recoveryMs,
    direction: { ...state.facing }, hitIds: new Set()
  };
  return state.action;
}

export function updateActionState(state, deltaMs) {
  const dt = Math.min(50, Math.max(0, deltaMs));
  state.invulnerableMs = Math.max(0, state.invulnerableMs - dt);
  state.comboWindowMs = Math.max(0, state.comboWindowMs - dt);
  state.regenDelayMs = Math.max(0, state.regenDelayMs - dt);
  if (!state.action && state.regenDelayMs <= 0) state.stamina = Math.min(state.maxStamina, state.stamina + 28 * dt / 1000);
  const action = state.action;
  if (!action) {
    if (state.comboWindowMs <= 0) state.combo = 0;
    return null;
  }
  action.elapsedMs += dt;
  if (action.phase === 'active' && action.elapsedMs >= action.activeMs) {
    action.phase = 'recovery';
    action.elapsedMs = 0;
  } else if (action.phase === 'recovery' && action.elapsedMs >= action.recoveryMs) {
    if (action.type === 'attack') {
      const weapon = WEAPONS[action.weapon];
      state.combo = (action.combo + 1) % weapon.damage.length;
      state.comboWindowMs = action.weapon === 'wand' ? 0 : 420;
    }
    state.action = null;
  }
  return state.action;
}

export function attackSpec(state) {
  const action = state.action;
  if (!action || !['attack', 'skill'].includes(action.type) || action.phase !== 'active') return null;
  if (action.type === 'skill') {
    const skill = WEAPON_SKILLS[action.weapon];
    return { weapon: action.weapon, damageType: WEAPONS[action.weapon].damageType, multiplier: skill.multiplier, reach: skill.reach, arc: skill.arc, omni: !!skill.omni, skill: skill.name, hitIds: action.hitIds };
  }
  const weapon = WEAPONS[action.weapon];
  return {
    weapon: action.weapon,
    damageType: weapon.damageType,
    combo: action.combo,
    multiplier: weapon.damage[action.combo],
    reach: weapon.reach[action.combo],
    arc: weapon.arc,
    hitIds: action.hitIds
  };
}
