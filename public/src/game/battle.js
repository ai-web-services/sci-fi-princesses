// ═══════════════════════════════════════════════════════════════
// BATTLE — Combat logic engine (no rendering). CTB turn timeline,
// damage/heal/status resolution, resonance combos, enemy AI, boss
// phases, difficulty modifiers, rewards. CombatScene consumes the
// event lists this produces and animates them.
// ═══════════════════════════════════════════════════════════════

import { GameState } from './state.js';
import { SKILLS } from '../data/skills.js';
import { STATUSES } from '../data/statuses.js';
import { resonanceFor } from '../data/resonance.js';
import { effectiveStats, itemData, awardXp } from './progression.js';
import { difficultyValues } from '../engine/settings.js';
import { removeItem } from './inventory.js';

const BASE_TURN = 1000;
const rand = () => Math.random();

function statusDef(id) { return STATUSES[id] || null; }

export class Battle {
  // enemies: array of enemy data objects (from data/enemies.js), may repeat
  constructor({ enemies, canFlee = true, isBoss = false, backdrop = 'nova' }) {
    this.diff = difficultyValues();
    this.canFlee = canFlee && !isBoss;
    this.isBoss = isBoss;
    this.backdrop = backdrop;
    this.combatants = [];
    this.round = 0;
    this.log = [];
    this.usedRevive = false;
    this.buildHeroes();
    this.buildEnemies(enemies);
  }

  buildHeroes() {
    GameState.active.forEach((id, i) => {
      const rec = GameState.chars[id];
      if (!rec) return;
      const stats = effectiveStats(id);
      this.combatants.push({
        key: 'h' + i, side: 'hero', id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        stats, hp: Math.min(rec.hp, stats.maxHp), sp: Math.min(rec.sp, stats.maxSp),
        statuses: [], primed: new Map(), defending: false,
        skills: rec.skillsKnown.slice(),
        weak: [], resist: [], immune: (stats.passives && stats.passives.immunities) || [],
        next: BASE_TURN / Math.max(1, stats.spd) * (0.9 + rand() * 0.2)
      });
    });
  }

  buildEnemies(enemies) {
    enemies.forEach((def, i) => {
      const hp = Math.round(def.hp * this.diff.enemyHp);
      this.combatants.push({
        key: 'e' + i, side: 'enemy', id: def.id,
        name: def.name + (enemies.filter(e => e.id === def.id).length > 1 ? ' ' + String.fromCharCode(65 + enemies.slice(0, i).filter(e => e.id === def.id).length) : ''),
        def,
        stats: { maxHp: hp, maxSp: 999, atk: def.atk, mag: def.mag, def: def.def, res: def.res, spd: def.spd, crit: 5, evade: 0.03, passives: {} },
        hp, sp: 999,
        statuses: [], primed: new Map(), defending: false,
        skills: def.skills.slice(),
        weak: def.weak || [], resist: def.resist || [], immune: def.immune || [],
        ai: def.ai || 'aggressive',
        phases: (def.phases || []).slice(), phaseIndex: 0,
        next: BASE_TURN / Math.max(1, def.spd) * (0.9 + rand() * 0.2)
      });
    });
  }

  heroes() { return this.combatants.filter(c => c.side === 'hero'); }
  enemies() { return this.combatants.filter(c => c.side === 'enemy'); }
  alive(side) { return this.combatants.filter(c => c.side === side && c.hp > 0); }
  byKey(key) { return this.combatants.find(c => c.key === key); }

  effSpd(c) {
    let spd = c.stats.spd;
    for (const st of c.statuses) {
      const d = statusDef(st.id);
      if (d && d.statMods && d.statMods.spd) spd = Math.round(spd * (1 + d.statMods.spd));
    }
    return Math.max(1, spd);
  }

  statMult(c, stat) {
    let m = 1;
    for (const st of c.statuses) {
      const d = statusDef(st.id);
      if (d && d.statMods && d.statMods[stat]) m *= 1 + d.statMods[stat];
      if (st.mods && st.mods[stat]) m *= 1 + st.mods[stat];
    }
    return m;
  }

  hasStatus(c, id) { return c.statuses.some(s => s.id === id); }

  // ── Turn timeline ──────────────────────────────────────
  nextTurn() {
    const alive = this.combatants.filter(c => c.hp > 0);
    if (!alive.length) return null;
    alive.sort((a, b) => a.next - b.next);
    const actor = alive[0];
    const t = actor.next;
    for (const c of alive) c.next -= t;
    actor.next = BASE_TURN / this.effSpd(actor);
    actor.defending = false;
    return actor;
  }

  previewOrder(n = 7) {
    const sim = this.combatants.filter(c => c.hp > 0).map(c => ({ c, next: c.next }));
    const out = [];
    for (let i = 0; i < n && sim.length; i++) {
      sim.sort((a, b) => a.next - b.next);
      const s = sim[0];
      out.push(s.c);
      const t = s.next;
      for (const x of sim) x.next -= t;
      s.next = BASE_TURN / this.effSpd(s.c);
    }
    return out;
  }

  // ── Turn-start effects. Returns events. ───────────────
  startTurn(actor) {
    const events = [];
    // decay primed tags
    for (const [tag, turns] of [...actor.primed]) {
      if (turns <= 1) actor.primed.delete(tag);
      else actor.primed.set(tag, turns - 1);
    }
    // statuses
    for (const st of [...actor.statuses]) {
      const d = statusDef(st.id);
      if (!d) continue;
      if (d.dotFrac) {
        const dmg = Math.max(1, Math.round(actor.stats.maxHp * d.dotFrac));
        actor.hp = Math.max(0, actor.hp - dmg);
        events.push({ type: 'dot', target: actor.key, status: st.id, amount: dmg, color: d.color });
        if (actor.hp <= 0) { events.push({ type: 'ko', target: actor.key }); }
      }
      if (d.regenFrac) {
        const heal = Math.round(actor.stats.maxHp * d.regenFrac);
        actor.hp = Math.min(actor.stats.maxHp, actor.hp + heal);
        events.push({ type: 'heal', target: actor.key, amount: heal, status: st.id });
      }
      st.turns--;
      if (st.turns <= 0) {
        actor.statuses.splice(actor.statuses.indexOf(st), 1);
        events.push({ type: 'statusEnd', target: actor.key, status: st.id });
      }
    }
    // stun check
    if (this.hasStatus(actor, 'stun')) {
      events.push({ type: 'stunned', target: actor.key });
      events.skipTurn = true;
    }
    // hero SP trickle
    if (actor.side === 'hero' && actor.hp > 0) {
      const regen = Math.round(3 * (this.diff.spRegen || 1)) + ((actor.stats.passives && actor.stats.passives.spRegen) || 0);
      actor.sp = Math.min(actor.stats.maxSp, actor.sp + regen);
    }
    return events;
  }

  // ── Damage math ────────────────────────────────────────
  elementFactor(target, element, attacker) {
    if (!element) return { mult: 1 };
    if (target.immune.includes(element)) return { mult: 0, immune: true };
    let mult = 1;
    if (target.weak.includes(element)) mult = 1.5;
    else if (target.resist.includes(element)) mult = 0.6;
    const er = target.stats.passives && target.stats.passives.elementResist;
    if (er && er[element] !== undefined) mult *= er[element];
    return { mult, weak: mult > 1, resist: mult < 1 };
  }

  computeDamage(attacker, target, skill, opts = {}) {
    const physical = skill.kind === 'physical';
    const atkStat = physical ? attacker.stats.atk * this.statMult(attacker, 'atk')
      : attacker.stats.mag * this.statMult(attacker, 'mag');
    let defStat = physical ? target.stats.def * this.statMult(target, 'def')
      : target.stats.res * this.statMult(target, 'res');
    if (opts.ignoreDef) defStat = 0;
    const ef = this.elementFactor(target, skill.element, attacker);
    if (ef.immune) return { amount: 0, immune: true };
    let dmg = atkStat * (skill.power || 1) * (100 / (100 + defStat));
    dmg *= 0.9 + rand() * 0.2;
    dmg *= ef.mult;
    if (attacker.side === 'enemy') dmg *= this.diff.enemyDmg;
    // crit
    let crit = false;
    const critChance = (attacker.stats.crit || 5) / 100 + (skill.critChance || 0);
    if (opts.forceCrit || rand() < critChance) {
      crit = true;
      dmg *= skill.crit || 1.5;
    }
    // blind accuracy
    if (this.hasStatus(attacker, 'blind') && physical && rand() < 0.4) {
      return { amount: 0, miss: true };
    }
    // evade
    if (!opts.noEvade && rand() < (target.stats.evade || 0)) {
      return { amount: 0, evaded: true };
    }
    // defending
    if (target.defending) dmg *= 0.5;
    // shield absorb
    const shield = target.statuses.find(s => s.id === 'shield');
    let amount = Math.max(1, Math.round(dmg));
    if (shield && shield.absorb > 0) {
      const soaked = Math.min(shield.absorb, amount);
      shield.absorb -= soaked;
      amount -= soaked;
      if (shield.absorb <= 0) target.statuses.splice(target.statuses.indexOf(shield), 1);
      if (amount <= 0) return { amount: 0, absorbed: soaked, weak: ef.weak, resist: ef.resist };
    }
    return { amount, crit, weak: ef.weak, resist: ef.resist };
  }

  applyStatus(target, statusId, turns, extra = {}) {
    if (target.immune.includes(statusId)) return { immune: true };
    const d = statusDef(statusId);
    if (!d) return null;
    const existing = target.statuses.find(s => s.id === statusId);
    if (existing) { existing.turns = Math.max(existing.turns, turns); return { refreshed: true }; }
    target.statuses.push(Object.assign({ id: statusId, turns }, extra));
    return { applied: true };
  }

  targetsFor(skill, actor, targetKey) {
    const foes = this.alive(actor.side === 'hero' ? 'enemy' : 'hero');
    const allies = this.alive(actor.side);
    switch (skill.target) {
      case 'enemy': { const t = this.byKey(targetKey); return t && t.hp > 0 ? [t] : foes.slice(0, 1); }
      case 'allEnemies': return foes;
      case 'ally': { const t = this.byKey(targetKey); return t && t.hp > 0 ? [t] : allies.slice(0, 1); }
      case 'allAllies': return allies;
      case 'self': return [actor];
      case 'koAlly': {
        const t = this.byKey(targetKey);
        if (t && t.hp <= 0) return [t];
        const ko = this.combatants.find(c => c.side === actor.side && c.hp <= 0);
        return ko ? [ko] : [];
      }
      default: return foes.slice(0, 1);
    }
  }

  // ── Perform a skill/attack. Returns events. ───────────
  useSkill(actor, skillId, targetKey) {
    const skill = SKILLS[skillId];
    const events = [];
    if (!skill) return events;
    if (actor.sp < (skill.cost || 0)) return [{ type: 'noSp' }];
    actor.sp -= skill.cost || 0;
    // basic attacks build SP
    if ((skill.cost || 0) === 0 && actor.side === 'hero') {
      actor.sp = Math.min(actor.stats.maxSp, actor.sp + Math.round(6 * (this.diff.spRegen || 1)));
    }
    events.push({ type: 'skill', actor: actor.key, skill: skillId, name: skill.name, kind: skill.kind, element: skill.element });

    const targets = this.targetsFor(skill, actor, targetKey);
    for (const target of targets) {
      const hits = skill.hits || 1;
      for (let h = 0; h < hits; h++) {
        if (target.hp <= 0 && skill.target !== 'koAlly') break;
        if (skill.kind === 'physical' || skill.kind === 'magic') {
          // resonance check
          let opts = {};
          let resonance = null;
          if (actor.side === 'hero' && skill.tags) {
            resonance = resonanceFor(target.primed, skill.tags);
          }
          if (skill.id === 'shadow_pounce') opts.forceCrit = true;
          const r = this.computeDamage(actor, target, skill, opts);
          let amount = r.amount;
          if (resonance && amount > 0) {
            amount = Math.round(amount * resonance.bonus);
            events.push({ type: 'resonance', name: resonance.name, id: resonance.id, target: target.key });
            if (!GameState.resonancesFound.includes(resonance.id)) GameState.resonancesFound.push(resonance.id);
            if (resonance.effect && resonance.effect.status && rand() < (resonance.effect.chance || 1)) {
              const sr = this.applyStatus(target, resonance.effect.status, resonance.effect.turns || 2);
              if (sr && sr.applied) events.push({ type: 'status', target: target.key, status: resonance.effect.status });
            }
          }
          target.hp = Math.max(0, target.hp - amount);
          events.push(Object.assign({ type: 'damage', target: target.key, amount, element: skill.element }, r, { amount }));
          // prime tags after resolution
          if (actor.side === 'hero' && skill.tags) {
            for (const tag of skill.tags) target.primed.set(tag, 3);
          }
          // thorns
          const thorns = target.stats.passives && target.stats.passives.thorns;
          if (thorns && amount > 0 && skill.kind === 'physical' && actor.hp > 0) {
            const td = Math.max(1, Math.round(amount * thorns));
            actor.hp = Math.max(0, actor.hp - td);
            events.push({ type: 'damage', target: actor.key, amount: td, thorns: true });
            if (actor.hp <= 0) events.push({ type: 'ko', target: actor.key });
          }
          if (target.hp <= 0) {
            events.push({ type: 'ko', target: target.key });
            this.notePhase(target, events);
            if (target.side === 'enemy') this.recordBestiary(target.id, 'defeated');
          } else {
            this.notePhase(target, events);
          }
          // skill status rider
          if (skill.status && target.hp > 0 && rand() < (skill.status.chance || 1)) {
            const sr = this.applyStatus(target, skill.status.id, skill.status.turns || 3);
            if (sr && sr.applied) events.push({ type: 'status', target: target.key, status: skill.status.id });
            else if (sr && sr.immune) events.push({ type: 'statusImmune', target: target.key, status: skill.status.id });
          }
        } else if (skill.kind === 'heal') {
          if (skill.revive && target.hp <= 0) {
            const frac = typeof skill.revive === 'number' ? skill.revive : 0.5;
            target.hp = Math.round(target.stats.maxHp * frac);
            events.push({ type: 'revive', target: target.key, amount: target.hp });
          } else if (target.hp > 0) {
            const healer = actor.stats.mag * this.statMult(actor, 'mag');
            let heal = Math.round(healer * (skill.power || 1) * (0.95 + rand() * 0.1));
            const hr = target.stats.passives && target.stats.passives.healReceived;
            if (hr) heal = Math.round(heal * (1 + hr));
            target.hp = Math.min(target.stats.maxHp, target.hp + heal);
            events.push({ type: 'heal', target: target.key, amount: heal });
          }
          if (skill.status && target.hp > 0) {
            const sr = this.applyStatus(target, skill.status.id, skill.status.turns || 3);
            if (sr && sr.applied) events.push({ type: 'status', target: target.key, status: skill.status.id, friendly: true });
          }
          if (skill.cleanse && target.hp > 0) {
            const bad = target.statuses.filter(s => {
              const d = statusDef(s.id);
              return d ? ['dot', 'down', 'control'].includes(d.icon) : (s.id.endsWith('Down'));
            });
            for (const s of bad) target.statuses.splice(target.statuses.indexOf(s), 1);
            if (bad.length) events.push({ type: 'cleanse', target: target.key });
          }
          // heal skills may carry a shield rider (e.g. Tidal Shield)
          if (skill.shield && target.hp > 0) {
            this.applyStatus(target, 'shield', skill.shieldTurns || 3, { absorb: Math.round(actor.stats.mag * this.statMult(actor, 'mag') * skill.shield * 4) });
            events.push({ type: 'shield', target: target.key });
          }
        } else if (skill.kind === 'buff' || skill.kind === 'debuff') {
          if (skill.buff) {
            const st = { id: skill.buff.stat + (skill.buff.amount > 0 ? 'Up' : 'Down'), turns: skill.buff.turns || 3, mods: { [skill.buff.stat]: skill.buff.amount } };
            const existing = target.statuses.find(s => s.id === st.id);
            if (existing) existing.turns = Math.max(existing.turns, st.turns);
            else target.statuses.push(st);
            events.push({ type: 'buff', target: target.key, stat: skill.buff.stat, amount: skill.buff.amount });
          }
          if (skill.status && target.hp > 0 && rand() < (skill.status.chance || 1)) {
            const sr = this.applyStatus(target, skill.status.id, skill.status.turns || 3);
            if (sr && sr.applied) events.push({ type: 'status', target: target.key, status: skill.status.id, friendly: skill.kind === 'buff' });
          }
          if (skill.shield) {
            this.applyStatus(target, 'shield', skill.shieldTurns || 3, { absorb: Math.round(actor.stats.mag * this.statMult(actor, 'mag') * skill.shield * 4) });
            events.push({ type: 'shield', target: target.key });
          }
          if (actor.side === 'hero' && skill.tags) {
            for (const tag of skill.tags) target.primed.set(tag, 3);
          }
        } else if (skill.kind === 'utility') {
          if (skill.id === 'scan') {
            for (const foe of this.alive('enemy')) this.recordBestiary(foe.id, 'scanned');
            events.push({ type: 'scan' });
          }
          if (skill.id === 'summon_shade') {
            events.push({ type: 'summon', enemyId: 'shade' });
          }
        }
      }
    }
    return events;
  }

  notePhase(target, events) {
    if (target.side !== 'enemy' || !target.phases || !target.phases.length) return;
    const frac = target.hp / target.stats.maxHp;
    while (target.phaseIndex < target.phases.length && frac <= target.phases[target.phaseIndex].hpFrac) {
      const phase = target.phases[target.phaseIndex];
      target.phaseIndex++;
      for (const sk of phase.addSkills || []) {
        if (!target.skills.includes(sk)) target.skills.push(sk);
      }
      if (phase.statMult) {
        target.stats.atk = Math.round(target.stats.atk * phase.statMult);
        target.stats.spd = Math.round(target.stats.spd * phase.statMult);
      }
      events.push({ type: 'phase', target: target.key, say: phase.say });
    }
  }

  recordBestiary(id, field) {
    if (!GameState.bestiary[id]) GameState.bestiary[id] = {};
    GameState.bestiary[id][field] = true;
  }

  useItem(actor, itemId, targetKey) {
    const it = itemData(itemId);
    const events = [{ type: 'item', actor: actor.key, item: itemId, name: it ? it.name : itemId }];
    if (!it || !it.effect) return events;
    if (!removeItem(itemId, 1)) return [{ type: 'noItem' }];
    const target = this.byKey(targetKey) || actor;
    const e = it.effect;
    if (e.revive && target.hp <= 0) {
      target.hp = Math.round(target.stats.maxHp * (typeof e.revive === 'number' ? e.revive : 0.5));
      events.push({ type: 'revive', target: target.key, amount: target.hp });
    }
    if (e.heal && target.hp > 0) {
      const heal = e.heal;
      target.hp = Math.min(target.stats.maxHp, target.hp + heal);
      events.push({ type: 'heal', target: target.key, amount: heal });
    }
    if (e.healFrac && target.hp > 0) {
      const heal = Math.round(target.stats.maxHp * e.healFrac);
      target.hp = Math.min(target.stats.maxHp, target.hp + heal);
      events.push({ type: 'heal', target: target.key, amount: heal });
    }
    if (e.sp && target.hp > 0) {
      target.sp = Math.min(target.stats.maxSp, target.sp + e.sp);
      events.push({ type: 'spRestore', target: target.key, amount: e.sp });
    }
    if (e.cure) {
      const cures = Array.isArray(e.cure) ? e.cure : [e.cure];
      target.statuses = target.statuses.filter(s => !cures.includes(s.id));
      events.push({ type: 'cleanse', target: target.key });
    }
    return events;
  }

  defend(actor) {
    actor.defending = true;
    actor.next *= 0.6;   // defending shortens time to next turn
    return [{ type: 'defend', actor: actor.key }];
  }

  swap(actorKey, benchId) {
    const actor = this.byKey(actorKey);
    if (!actor || actor.side !== 'hero') return [];
    const rec = GameState.chars[benchId];
    if (!rec) return [];
    // persist outgoing vitals
    this.persistHero(actor);
    const idx = GameState.active.indexOf(actor.id);
    if (idx >= 0) GameState.active[idx] = benchId;
    const stats = effectiveStats(benchId);
    Object.assign(actor, {
      id: benchId,
      name: benchId.charAt(0).toUpperCase() + benchId.slice(1),
      stats, hp: Math.min(rec.hp, stats.maxHp), sp: Math.min(rec.sp, stats.maxSp),
      statuses: [], defending: false,
      skills: rec.skillsKnown.slice(),
      immune: (stats.passives && stats.passives.immunities) || []
    });
    return [{ type: 'swap', actor: actor.key, incoming: benchId }];
  }

  tryFlee() {
    if (!this.canFlee) return { ok: false, blocked: true };
    const heroSpd = this.alive('hero').reduce((s, c) => s + this.effSpd(c), 0) / Math.max(1, this.alive('hero').length);
    const foeSpd = this.alive('enemy').reduce((s, c) => s + this.effSpd(c), 0) / Math.max(1, this.alive('enemy').length);
    const chance = Math.max(0.25, Math.min(0.95, 0.5 + (heroSpd - foeSpd) * 0.04));
    return { ok: rand() < chance };
  }

  addSummon(enemyDef) {
    if (this.alive('enemy').length >= 5) return null;
    const hp = Math.round(enemyDef.hp * this.diff.enemyHp);
    const c = {
      key: 'e' + this.combatants.filter(x => x.side === 'enemy').length + '_s' + this.round,
      side: 'enemy', id: enemyDef.id, name: enemyDef.name, def: enemyDef,
      stats: { maxHp: hp, maxSp: 999, atk: enemyDef.atk, mag: enemyDef.mag, def: enemyDef.def, res: enemyDef.res, spd: enemyDef.spd, crit: 5, evade: 0.03, passives: {} },
      hp, sp: 999, statuses: [], primed: new Map(), defending: false,
      skills: enemyDef.skills.slice(), weak: enemyDef.weak || [], resist: enemyDef.resist || [],
      immune: enemyDef.immune || [], ai: enemyDef.ai || 'aggressive',
      phases: [], phaseIndex: 0,
      next: BASE_TURN / Math.max(1, enemyDef.spd)
    };
    this.combatants.push(c);
    return c;
  }

  // ── Enemy AI: choose {skillId, targetKey} ──────────────
  enemyDecide(actor) {
    const heroes = this.alive('hero');
    const allies = this.alive('enemy');
    if (!heroes.length) return null;
    const usable = actor.skills.filter(id => SKILLS[id]);
    const attackSkills = usable.filter(id => ['physical', 'magic'].includes(SKILLS[id].kind));
    const supportSkills = usable.filter(id => ['heal', 'buff'].includes(SKILLS[id].kind));
    const debuffSkills = usable.filter(id => SKILLS[id].kind === 'debuff');
    const summons = usable.filter(id => SKILLS[id].id === 'summon_shade');
    const weakest = heroes.slice().sort((a, b) => a.hp - b.hp)[0];
    const randomHero = heroes[Math.floor(rand() * heroes.length)];

    if (actor.ai === 'support' && supportSkills.length) {
      const hurt = allies.find(a => a.hp / a.stats.maxHp < 0.5);
      if (hurt) {
        const heal = supportSkills.find(id => SKILLS[id].kind === 'heal');
        if (heal) return { skillId: heal, targetKey: hurt.key };
      }
    }
    if (summons.length && allies.length < 3 && rand() < 0.5) {
      return { skillId: summons[0], targetKey: null };
    }
    if (actor.ai === 'defensive' && actor.hp / actor.stats.maxHp < 0.35 && rand() < 0.4) {
      return { defend: true };
    }
    if (debuffSkills.length && rand() < 0.3) {
      return { skillId: debuffSkills[Math.floor(rand() * debuffSkills.length)], targetKey: randomHero.key };
    }
    if (attackSkills.length) {
      // aggressive picks strongest vs weakest hero; wild is random
      if (actor.ai === 'wild') {
        return { skillId: attackSkills[Math.floor(rand() * attackSkills.length)], targetKey: randomHero.key };
      }
      const best = attackSkills.slice().sort((a, b) => (SKILLS[b].power || 1) - (SKILLS[a].power || 1))[0];
      return { skillId: best, targetKey: actor.ai === 'aggressive' ? weakest.key : randomHero.key };
    }
    return { defend: true };
  }

  // ── End conditions & rewards ───────────────────────────
  checkEnd() {
    if (!this.alive('enemy').length) return 'victory';
    if (!this.alive('hero').length) {
      if (this.diff.reviveOnDefeat && !this.usedRevive) {
        this.usedRevive = true;
        for (const h of this.heroes()) {
          h.hp = Math.round(h.stats.maxHp * 0.5);
          h.statuses = [];
        }
        return 'secondwind';
      }
      return 'defeat';
    }
    return null;
  }

  persistHero(c) {
    const rec = GameState.chars[c.id];
    if (!rec) return;
    rec.hp = Math.max(c.hp, c.hp <= 0 ? 1 : c.hp);   // KO'd heroes leave battle at 1 hp
    rec.sp = c.sp;
  }

  finish(outcome) {
    for (const h of this.heroes()) this.persistHero(h);
    if (outcome !== 'victory') return null;
    const defs = this.enemies().map(c => c.def);
    const xp = defs.reduce((s, d) => s + (d.xp || 0), 0);
    const gold = defs.reduce((s, d) => s + (d.gold || 0), 0);
    const drops = [];
    for (const d of defs) {
      for (const drop of d.drops || []) {
        if (rand() < drop.chance) drops.push(drop.item);
      }
    }
    // active get full xp, reserves half
    const reserve = GameState.roster.filter(id => !GameState.active.includes(id));
    const levelUps = awardXp(GameState.active, xp)
      .concat(awardXp(reserve, Math.round(xp / 2)));
    GameState.gold += gold;
    // bond: shared victory
    for (const id of GameState.active) {
      if (id !== 'lyra' && GameState.relationships[id]) GameState.relationships[id].battles = (GameState.relationships[id].battles || 0) + 1;
    }
    return { xp, gold, drops, levelUps };
  }
}
