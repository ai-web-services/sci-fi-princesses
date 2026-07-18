// ═══ FIELD COMPANION — one active ally, four distinct combat roles.

import { ActorSprite } from '../art/actors.js';
import { DEPTH } from '../config.js';

const FOLLOW_DISTANCE = 30;
const WARP_DISTANCE = 112;
const ENGAGE_DISTANCE = 108;

export const COMPANION_ROLES = Object.freeze({
  erynn: { name: 'Erynn', role: 'Ambusher', command: 'Pounce', cooldown: 10000, damage: 26, passiveDamage: 10, range: 92, mark: true, damageType: 'slash' },
  brimble: { name: 'Brimble', role: 'Guardian/Medic', command: 'Bulwark', cooldown: 12000, damage: 14, passiveDamage: 7, range: 70, area: 42, guardMs: 4200, healFraction: 0.18, damageType: 'blunt' },
  drakkor: { name: 'Drakkor', role: 'Fire Breaker', command: 'Star Roar', cooldown: 11000, damage: 22, passiveDamage: 12, range: 76, area: 52, breakMs: 5000, damageType: 'fire' },
  pip: { name: 'Pip', role: 'Scanner/Support', command: 'Prism Scan', cooldown: 8500, damage: 16, passiveDamage: 8, range: 132, area: 42, scanMs: 6000, healFraction: 0.1, damageType: 'lightning' }
});

export class FieldCompanion {
  constructor(scene, id, x, y) {
    this.scene = scene;
    this.id = COMPANION_ROLES[id] ? id : 'erynn';
    this.profile = COMPANION_ROLES[this.id];
    this.actor = new ActorSprite(scene, this.id, x - 18, y + 14, { useRig: false }).setDepth(DEPTH.ACTOR - 1);
    this.x = x - 18; this.y = y + 14;
    this.cooldownMs = 0; this.attackMs = 0; this.guardMs = 0;
    this.target = null; this.commandFlashMs = 0; this.state = 'follow';
  }

  chooseTarget(enemies, px, py) {
    let best = null, bestScore = Infinity;
    for (const enemy of enemies) {
      if (!enemy.body.active || enemy.kind === 'passive') continue;
      const distance = Math.hypot(enemy.body.x - px, enemy.body.y - py);
      if (distance < bestScore && distance <= this.profile.range) { best = enemy; bestScore = distance; }
    }
    return best;
  }

  command(enemies, px, py, onHit) {
    if (this.cooldownMs > 0) return false;
    const target = this.chooseTarget(enemies, px, py);
    if (!target) return false;
    this.target = target;
    const affected = this.profile.area
      ? enemies.filter(enemy => enemy.body.active && enemy.kind !== 'passive' && Math.hypot(enemy.body.x - target.body.x, enemy.body.y - target.body.y) <= this.profile.area)
      : [target];
    for (const enemy of affected) onHit(enemy, this.profile.damage, {
      companion: this.id, damageType: this.profile.damageType || 'blunt', critical: this.id === 'erynn',
      mark: this.profile.mark, breakMs: this.profile.breakMs, scanMs: this.profile.scanMs
    });
    if (this.profile.guardMs) this.guardMs = this.profile.guardMs;
    if (this.profile.healFraction) {
      const amount = Math.max(1, Math.round(this.scene.action.maxHp * this.profile.healFraction));
      this.scene.action.hp = Math.min(this.scene.action.maxHp, this.scene.action.hp + amount);
      const scan = this.profile.scanMs ? ` · scan: ${affected.map(enemy => enemy.weakness || 'neutral').join('/')}` : '';
      this.scene.notice(`${this.profile.name.toUpperCase()} ${this.profile.command.toUpperCase()}  ·  +${amount} HP${scan}`);
    } else if (this.profile.breakMs) this.scene.notice('DRAKKOR STAR ROAR  ·  armor broken · Fire damage');
    const dx = target.body.x - px, dy = target.body.y - py, length = Math.max(1, Math.hypot(dx, dy));
    this.x = target.body.x + dx / length * 14; this.y = target.body.y + dy / length * 14;
    this.actor.setPos(this.x, this.y);
    this.cooldownMs = this.profile.cooldown; this.attackMs = 260; this.commandFlashMs = 420; this.state = this.profile.command.toLowerCase();
    return true;
  }

  update(delta, enemies, px, py, telegraphing = false, onHit = () => {}) {
    const dt = Math.min(50, delta);
    this.cooldownMs = Math.max(0, this.cooldownMs - dt); this.guardMs = Math.max(0, this.guardMs - dt);
    this.commandFlashMs = Math.max(0, this.commandFlashMs - dt); this.attackMs = Math.max(0, this.attackMs - dt);
    if (this.target && !this.target.body.active) this.target = null;
    if (this.attackMs > 0) { this.actor.update(dt, false); return; }
    const playerDistance = Math.hypot(px - this.x, py - this.y);
    if (playerDistance > WARP_DISTANCE) { this.x = px - 18; this.y = py + 14; this.state = 'recall'; }
    else {
      this.target = this.target || this.chooseTarget(enemies, px, py);
      if (telegraphing && this.target) {
        const dx = px - this.target.body.x, dy = py - this.target.body.y, length = Math.max(1, Math.hypot(dx, dy));
        this.x += dx / length * 86 * dt / 1000; this.y += dy / length * 86 * dt / 1000; this.state = 'evade';
      } else if (this.target && Math.hypot(this.target.body.x - this.x, this.target.body.y - this.y) < ENGAGE_DISTANCE) {
        const dx = this.target.body.x - this.x, dy = this.target.body.y - this.y, distance = Math.max(1, Math.hypot(dx, dy));
        if (distance > (this.id === 'pip' ? 62 : 20)) { this.x += dx / distance * 72 * dt / 1000; this.y += dy / distance * 72 * dt / 1000; this.state = 'flank'; }
        else if (this.cooldownMs <= 0) { onHit(this.target, this.profile.passiveDamage, { companion: this.id, damageType: this.profile.damageType || 'blunt' }); this.cooldownMs = 1100; this.state = 'strike'; }
      } else if (playerDistance > FOLLOW_DISTANCE) {
        const dx = px - this.x, dy = py - this.y, distance = Math.max(1, playerDistance);
        this.x += dx / distance * 78 * dt / 1000; this.y += dy / distance * 78 * dt / 1000; this.state = 'follow';
      } else this.state = 'guard';
    }
    this.actor.setPos(this.x, this.y);
    const dx = (this.target ? this.target.body.x : px) - this.x, dy = (this.target ? this.target.body.y : py) - this.y;
    this.actor.face(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'));
    this.actor.update(dt, ['follow', 'flank', 'evade'].includes(this.state));
  }

  snapshot() { return { id: this.id, role: this.profile.role, command: this.profile.command, x: this.x, y: this.y, state: this.state, cooldownMs: this.cooldownMs, guardMs: this.guardMs, targetId: this.target?.id || null }; }
  destroy() { this.actor.destroy(); }
}

export class ErynnFieldCompanion extends FieldCompanion {
  constructor(scene, x, y) { super(scene, 'erynn', x, y); }
}
