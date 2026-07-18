// ═══ VOID SENTINEL KAEL — deterministic real-time boss director.

import { createRng, streamSeed } from './rng.js';

export const KAEL_MAX_HP = 620;
export const KAEL_MAX_ARMOR = 120;

const WARNINGS = Object.freeze({
  slash: 750,
  pulse: 900,
  summon: 1200,
  rift: 800,
  beam: 2400
});

function pointLineDistance(point, from, to) {
  const vx = to.x - from.x, vy = to.y - from.y;
  const lengthSq = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((point.x - from.x) * vx + (point.y - from.y) * vy) / lengthSq));
  return Math.hypot(point.x - (from.x + vx * t), point.y - (from.y + vy * t));
}

export class KaelController {
  constructor(seed, x, y) {
    this.rng = createRng(streamSeed(seed, 'kael'));
    this.x = x; this.y = y;
    this.hp = KAEL_MAX_HP;
    this.maxHp = KAEL_MAX_HP;
    this.armor = KAEL_MAX_ARMOR;
    this.maxArmor = KAEL_MAX_ARMOR;
    this.phase = 1;
    this.enraged = false;
    this.current = null;
    this.cooldownMs = 1300;
    this.stunMs = 0;
    this.breakLockMs = 0;
    this.rifts = [];
    this.summons = 0;
    this.patternIndex = 0;
    this.dead = false;
  }

  hit(amount, damageType = 'slash', armorBreak = 1) {
    if (this.dead || this.stunMs < -1000) return { damage: 0, armor: 0 };
    const weakness = damageType === 'stellar' ? 1.25 : damageType === 'void' ? 0.5 : 1;
    const enrageVulnerability = this.enraged ? 1.25 : 1;
    const armorReduction = this.armor > 0 ? 0.7 : 1;
    const damage = Math.max(1, Math.round(amount * weakness * enrageVulnerability * armorReduction));
    const armorDamage = this.breakLockMs <= 0 ? Math.round(amount * armorBreak * (damageType === 'pierce' ? 2 : 0.35)) : 0;
    this.hp = Math.max(0, this.hp - damage);
    this.armor = Math.max(0, this.armor - armorDamage);
    if (this.armor <= 0 && this.breakLockMs <= 0) {
      this.stunMs = 2200;
      this.breakLockMs = 12000;
      this.current = null;
    }
    if (this.phase === 1 && this.hp <= this.maxHp * 0.5) {
      this.phase = 2;
      this.current = { type: 'transition', stage: 'warning', timerMs: 1500, totalMs: 1500 };
      this.rifts = [];
      this.stunMs = 0;
    }
    if (!this.enraged && this.hp <= this.maxHp * 0.1) this.enraged = true;
    if (this.hp <= 0) { this.dead = true; this.current = null; this.rifts = []; }
    return { damage, armor: armorDamage, broken: this.stunMs > 0, phase: this.phase, enraged: this.enraged, dead: this.dead };
  }

  choosePattern() {
    let pool = this.phase === 1 ? ['slash', 'pulse', 'summon'] : ['slash', 'pulse', 'rift', 'beam'];
    if (this.enraged) pool = ['slash', 'pulse', 'beam'];
    if (this.summons >= 2) pool = pool.filter(type => type !== 'summon');
    if (this.rifts.length >= 4) pool = pool.filter(type => type !== 'rift');
    const type = pool[this.patternIndex++ % pool.length];
    return type;
  }

  begin(type, player) {
    const direction = { x: player.x - this.x, y: player.y - this.y };
    const length = Math.max(1, Math.hypot(direction.x, direction.y));
    direction.x /= length; direction.y /= length;
    this.current = {
      type, stage: 'warning', timerMs: WARNINGS[type], totalMs: WARNINGS[type], direction,
      target: { x: player.x, y: player.y }, locked: false
    };
  }

  update(deltaMs, context) {
    const dt = Math.min(50, Math.max(0, deltaMs));
    const events = [];
    this.breakLockMs = Math.max(0, this.breakLockMs - dt);
    if (this.breakLockMs <= 0 && this.armor <= 0) this.armor = this.maxArmor;
    for (const rift of this.rifts) {
      rift.timerMs -= dt;
      rift.tickMs = Math.max(0, rift.tickMs - dt);
      if (rift.timerMs > 0 && rift.tickMs <= 0 && Math.hypot(context.player.x - rift.x, context.player.y - rift.y) < rift.radius) {
        rift.tickMs = 450; events.push({ type: 'damage', amount: 8, source: 'rift' });
      }
    }
    this.rifts = this.rifts.filter(rift => rift.timerMs > 0);
    if (this.dead) return events;
    if (this.stunMs > 0) { this.stunMs = Math.max(0, this.stunMs - dt); return events; }
    if (!this.current) {
      this.cooldownMs -= dt;
      if (this.cooldownMs <= 0) this.begin(this.choosePattern(), context.player);
      return events;
    }
    const attack = this.current;
    attack.timerMs -= dt;
    if (attack.type === 'beam' && !attack.locked && attack.timerMs > 1000) {
      const dx = context.player.x - this.x, dy = context.player.y - this.y, length = Math.max(1, Math.hypot(dx, dy));
      attack.direction = { x: dx / length, y: dy / length };
      attack.target = { x: context.player.x, y: context.player.y };
    } else if (attack.type === 'beam') attack.locked = true;
    if (attack.timerMs > 0) return events;
    if (attack.type === 'transition') {
      events.push({ type: 'phase', phase: 2 });
    } else if (attack.type === 'slash') {
      const dx = context.player.x - this.x, dy = context.player.y - this.y, distance = Math.hypot(dx, dy);
      const dot = distance ? dx / distance * attack.direction.x + dy / distance * attack.direction.y : 1;
      if (distance < 54 && dot > Math.cos(0.62)) events.push({ type: 'damage', amount: 22, source: 'slash' });
    } else if (attack.type === 'pulse') {
      if (Math.hypot(context.player.x - this.x, context.player.y - this.y) < 58) events.push({ type: 'damage', amount: 18, source: 'pulse' });
    } else if (attack.type === 'summon') {
      this.summons = Math.min(2, this.summons + 2); events.push({ type: 'summon', count: 2 });
    } else if (attack.type === 'rift') {
      const tooCloseToCenter = Math.hypot(attack.target.x - this.x, attack.target.y - this.y) < 22;
      const x = tooCloseToCenter ? attack.target.x + 26 : attack.target.x;
      const y = attack.target.y;
      this.rifts.push({ x, y, radius: 18, timerMs: 6000, tickMs: 0 });
      if (this.rifts.length > 4) this.rifts.shift();
      events.push({ type: 'rift', x, y });
    } else if (attack.type === 'beam') {
      const end = { x: this.x + attack.direction.x * 360, y: this.y + attack.direction.y * 360 };
      const inBeam = pointLineDistance(context.player, { x: this.x, y: this.y }, end) < 13;
      if (inBeam && !context.beamBlocked({ x: this.x, y: this.y }, end, context.player)) events.push({ type: 'damage', amount: 28, source: 'beam' });
    }
    this.current = null;
    this.cooldownMs = this.enraged ? 560 : this.phase === 2 ? 760 : 980;
    return events;
  }

  telegraph() {
    return this.current ? { ...this.current, x: this.x, y: this.y } : null;
  }

  snapshot() {
    return {
      hp: this.hp, maxHp: this.maxHp, armor: this.armor, maxArmor: this.maxArmor,
      phase: this.phase, enraged: this.enraged, action: this.current?.type || null,
      warningMs: this.current?.timerMs || 0, rifts: this.rifts.map(rift => ({ ...rift })), dead: this.dead
    };
  }
}
