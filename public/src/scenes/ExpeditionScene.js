// ═══ EXPEDITION — continuous top-down action exploration.

import { GAME_W, GAME_H, TILE, DEPTH } from '../config.js';
import { ActorSprite } from '../art/actors.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { GameState, autoSave } from '../game/state.js';
import { generateExpedition, CELL, isWalkable } from '../expedition/generator.js';
import { createActionState, normalizedVector, startAttack, startDodge, startWeaponSkill, switchWeapon, updateActionState, attackSpec, WEAPONS, WEAPON_SKILLS } from '../expedition/actionModel.js';
import { createRunState, objectiveLabel, advanceObjective, canActivateRelay, canEnterBossGate, claimLoot, settleRun, mergeInventory, runSummary, nearAnchor } from '../expedition/runModel.js';
import { FieldCompanion } from '../expedition/fieldCompanion.js';
import { awardXp, effectiveStats, itemData, xpForLevel } from '../game/progression.js';
import { KaelController } from '../expedition/kaelController.js';
import { createRng, streamSeed } from '../expedition/rng.js';
import { gearId, gearPassives, gearStats } from '../game/gearProgression.js';
import { Settings } from '../engine/settings.js';
import { flash, shake } from '../engine/fx.js';
import { createEcologyState, provokeCreature, retireCreature, stepEcology, updateWander } from '../expedition/ecologyModel.js';

const MOVE_SPEED = 92;
const DODGE_SPEED = 210;

function seedNow() { return (Date.now() ^ Math.floor(performance.now() * 1000)) >>> 0; }

export class ExpeditionScene extends Phaser.Scene {
  constructor() { super({ key: 'ExpeditionScene' }); }

  init(data) {
    this.seed = (data && data.seed) ?? (GameState && GameState.expedition && GameState.expedition.seed) ?? seedNow();
  }

  create() {
    this.region = generateExpedition(this.seed);
    const lyra = GameState.chars.lyra;
    this.action = createActionState({ ...lyra, ...(GameState.action || {}) });
    this.combatRng = createRng(streamSeed(this.seed, 'player-combat'));
    this.ecologyRng = createRng(streamSeed(this.seed, 'ecology-runtime'));
    this.hitStopMs = 0;
    GameState.expedition = createRunState(this.region, GameState.expedition);
    if (typeof GameState.expedition.startLifetimeXp !== 'number') GameState.expedition.startLifetimeXp = lyra.lifetimeXp || 0;
    this.buildTerrain();
    const landing = this.region.anchors.landing;
    this.px = landing.x * TILE + TILE / 2;
    this.py = landing.y * TILE + TILE / 2;
    this.player = new ActorSprite(this, 'lyra', this.px, this.py, { useRig: false }).setDepth(DEPTH.ACTOR);
    this.enemies = this.buildPopulation();
    this.projectiles = Array.from({ length: 12 }, (_, index) => ({
      id: index, body: this.add.circle(-100, -100, 4, 0xd070e0, 1).setStrokeStyle(1, 0xffffff, 0.8).setDepth(DEPTH.ACTOR + 3).setActive(false).setVisible(false),
      vx: 0, vy: 0, lifeMs: 0
    }));
    this.playerProjectiles = Array.from({ length: 10 }, (_, index) => ({
      id: `wand_${index}`,
      body: this.add.circle(-100, -100, 3, 0xd070e0, 1).setStrokeStyle(2, 0xffffff, 0.85).setDepth(DEPTH.ACTOR + 4).setActive(false).setVisible(false),
      vx: 0, vy: 0, lifeMs: 0, spec: null
    }));
    this.impactParticles = Array.from({ length: 48 }, () => ({
      body: this.add.rectangle(-100, -100, 2, 2, 0xffffff, 1).setDepth(DEPTH.ACTOR + 6).setActive(false).setVisible(false),
      vx: 0, vy: 0, lifeMs: 0, maxLifeMs: 0
    }));
    this.lootMarkers = this.buildLootMarkers();
    const companionId = GameState.active.find(id => id !== 'lyra') || GameState.roster.find(id => id !== 'lyra');
    this.companion = companionId ? new FieldCompanion(this, companionId, this.px, this.py) : null;
    this.attackFx = this.add.graphics().setDepth(DEPTH.ACTOR + 50);
    this.telegraphs = this.add.graphics().setDepth(DEPTH.ACTOR + 40);
    this.hud = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.UI);
    this.hudText = new PixelText(this, 10, 34, '', { scale: 1, color: 0xffffff }).setScrollFactor(0).setDepth(DEPTH.UI + 1);
    this.objectiveText = new PixelText(this, GAME_W - 230, 10, objectiveLabel(GameState.expedition), { scale: 1, color: RAMP.uiGold[4] }).setScrollFactor(0).setDepth(DEPTH.UI + 1);
    this.seedText = new PixelText(this, GAME_W - 190, 24, `SEED ${this.region.seed}`, { scale: 1, color: 0x88a0b8 }).setScrollFactor(0).setDepth(DEPTH.UI + 1);
    this.noticeText = new PixelText(this, 0, GAME_H - 34, '', { scale: 1, color: 0xffffff, align: 'center' }).setScrollFactor(0).setDepth(DEPTH.UI + 2);
    this.flyoutPool = Array.from({ length: 32 }, () => {
      const label = new PixelText(this, -100, -100, '0', { scale: 1, color: 0xffffff }).setDepth(DEPTH.UI + 3).setVisible(false);
      label.busy = false;
      return label;
    });
    this.noticeUntil = 0;
    this.kael = null;
    this.kaelEnemy = null;
    this.bossPylons = [];
    this.cameras.main.setBounds(0, 0, this.region.width * TILE, this.region.height * TILE);
    this.cameras.main.startFollow(this.player.img, true, 0.14, 0.14);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setDeadzone(32, 24);
    swallowInput();
    autoSave('Lumenwild Fracture');
  }

  buildTerrain() {
    const key = `expedition_${this.region.hash}`;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      const colors = {
        [CELL.BLOCK]: 0x17283a, [CELL.GROUND]: 0x315f58, [CELL.PATH]: 0x8a7652,
        [CELL.SHALLOW]: 0x2e7891, [CELL.HAZARD]: 0x783d91, [CELL.SHRINE]: 0x54d8c0,
        [CELL.OBJECTIVE]: 0xd7b64a, [CELL.EXTRACTION]: 0x59aee8
      };
      for (let y = 0; y < this.region.height; y++) for (let x = 0; x < this.region.width; x++) {
        const cell = this.region.grid[y][x];
        g.fillStyle(colors[cell], 1); g.fillRect(x * TILE, y * TILE, TILE, TILE);
        if (cell === CELL.BLOCK) { g.fillStyle(0x203c48, 1); g.fillRect(x * TILE + 2, y * TILE + 2, 12, 4); }
        if (cell === CELL.PATH && ((x + y) % 5 === 0)) { g.fillStyle(0xa99368, 1); g.fillRect(x * TILE + 3, y * TILE + 7, 4, 2); }
        if (cell === CELL.SHALLOW) { g.fillStyle(0x55b7c5, 0.6); g.fillRect(x * TILE, y * TILE + 5, TILE, 1); }
      }
      g.generateTexture(key, this.region.width * TILE, this.region.height * TILE); g.destroy();
    }
    this.add.image(0, 0, key).setOrigin(0).setDepth(DEPTH.GROUND);
  }

  buildPopulation() {
    return this.region.habitats.map((point, index) => {
      const passive = point.kind === 'passive';
      const neutral = point.kind === 'neutral';
      const color = passive ? 0x7bd69a : neutral ? 0x66bca8 : point.kind === 'territorial' ? 0xe2a75d : point.kind === 'elite' ? 0xd46bed : 0x8d55c7;
      const body = this.add.circle(point.x * TILE + 8, point.y * TILE + 8, passive ? 6 : 8, color, 1).setDepth(DEPTH.ACTOR);
      body.setStrokeStyle(2, 0x171222, 1);
      const hp = passive ? 20 : neutral ? 34 : point.kind === 'elite' ? 90 : point.kind === 'miniboss' ? 160 : 48;
      return {
        id: `spawn_${index}`, body, kind: point.kind, territory: point.territory, hp, maxHp: hp,
        attackStyle: point.kind === 'voidborn' && index % 2 === 0 ? 'ranged' : 'melee',
        weakness: point.kind === 'territorial' ? 'pierce' : point.kind === 'neutral' ? 'blunt' : point.kind === 'elite' ? ['light', 'dark', 'lightning'][index % 3] : point.kind === 'voidborn' ? ['slash', 'fire', 'ice'][index % 3] : null,
        resistance: point.kind === 'territorial' ? 'slash' : point.kind === 'neutral' ? 'lightning' : point.kind === 'elite' ? 'dark' : point.kind === 'voidborn' ? 'light' : null,
        state: passive ? 'graze' : neutral ? 'idle' : point.kind === 'territorial' ? 'guard' : point.kind === 'elite' ? 'flank' : 'pursue',
        ecology: createEcologyState(point, index, this.ecologyRng),
        attackMs: 0, cooldownMs: 300 + index * 30, warningMs: 0, vx: 0, vy: 0
      };
    });
  }

  buildLootMarkers() {
    return this.region.loot.map(reward => {
      const opened = GameState.expedition.opened.includes(reward.id);
      const body = this.add.star(reward.x * TILE + 8, reward.y * TILE + 8, 4, 3, 7, 0xffd166, 1)
        .setStrokeStyle(1, 0xffffff, 0.9).setDepth(DEPTH.DECO + 3).setVisible(!opened);
      return { ...reward, body };
    });
  }

  canOccupy(x, y) {
    const radius = 5;
    for (const [ox, oy] of [[-radius, 0], [radius, 0], [0, -radius], [0, radius]]) {
      const tx = Math.floor((x + ox) / TILE), ty = Math.floor((y + oy) / TILE);
      if (!this.region.grid[ty] || !isWalkable(this.region.grid[ty][tx])) return false;
    }
    if (this.kaelEnemy?.body.active && Math.hypot(x - this.kaelEnemy.body.x, y - this.kaelEnemy.body.y) < 29) return false;
    if (this.bossPylons?.some(pylon => Math.hypot(x - pylon.x, y - pylon.y) < pylon.radius + radius)) return false;
    return true;
  }

  movePlayer(dx, dy) {
    const nx = this.px + dx, ny = this.py + dy;
    if (this.canOccupy(nx, this.py)) this.px = nx;
    if (this.canOccupy(this.px, ny)) this.py = ny;
    this.player.setPos(this.px, this.py);
  }

  update(time, delta) {
    const dt = Math.min(50, delta);
    if (this.hitStopMs > 0) { this.hitStopMs = Math.max(0, this.hitStopMs - dt); this.drawFeedback(); return; }
    const inp = pollInput(this, time);
    let move = normalizedVector(inp.dx, inp.dy, { x: 0, y: 0 });
    if (inp.dx || inp.dy) this.action.facing = normalizedVector(inp.dx, inp.dy, this.action.facing);
    if (inp.pageLd) switchWeapon(this.action, -1);
    if (inp.pageRd) switchWeapon(this.action, 1);
    if (inp.confirmed) startAttack(this.action);
    if (inp.cancelled) startDodge(this.action, (inp.dx || inp.dy) ? move : this.action.facing);
    if (inp.skilld && !this.interactObjective()) {
      const skill = startWeaponSkill(this.action);
      if (skill) this.notice(`${WEAPON_SKILLS[skill.weapon].name.toUpperCase()}  ·  Crown energy released`);
      else this.notice('Crown skill unavailable · build energy by striking threats');
    }
    if (inp.companiond && this.companion) {
      if (!this.companion.command(this.enemies, this.px, this.py, (enemy, damage, meta) => this.damageEnemy(enemy, damage, meta))) this.notice(`${this.companion.profile.name} needs a nearby threat or time to recover.`);
    }
    if (inp.menued) { this.openPause(); return; }
    const current = this.action.action;
    let speed = MOVE_SPEED;
    if (current && current.type === 'dodge' && current.phase === 'active') { move = current.direction; speed = DODGE_SPEED; }
    else if (current && current.type === 'skill' && current.weapon === 'lance' && current.phase === 'active') { move = current.direction; speed = WEAPON_SKILLS.lance.dashSpeed; }
    else if (current && current.type === 'attack') speed *= WEAPONS[current.weapon].moveScale[current.combo];
    this.movePlayer(move.x * speed * dt / 1000, move.y * speed * dt / 1000);
    if (current && current.type === 'dodge' && current.phase === 'active' && GameState.chars.lyra.build?.cometWake) {
      for (const enemy of this.enemies) {
        if (!enemy.body.active || current.hitIds.has(enemy.id)) continue;
        if (Math.hypot(enemy.body.x - this.px, enemy.body.y - this.py) <= 22) {
          current.hitIds.add(enemy.id);
          this.damageEnemy(enemy, 12, { damageType: 'light' });
        }
      }
    }
    this.player.face(Math.abs(this.action.facing.x) > Math.abs(this.action.facing.y) ? (this.action.facing.x < 0 ? 'left' : 'right') : (this.action.facing.y < 0 ? 'up' : 'down'));
    this.player.update(dt, Math.hypot(move.x, move.y) > 0.1);
    updateActionState(this.action, dt);
    this.updateBossActivation();
    this.updateEcologyLifecycle(dt);
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
    this.updatePlayerProjectiles(dt);
    this.updateImpactParticles(dt);
    this.updateBoss(dt);
    if (this.companion) this.companion.update(dt, this.enemies, this.px, this.py, this.enemies.some(enemy => enemy.warningMs > 0), (enemy, damage, meta) => this.damageEnemy(enemy, damage, meta));
    this.resolveAttack();
    this.drawFeedback();
    GameState.playtime += dt / 1000;
    if (this.action.hp <= 0) this.extract();
  }

  notice(message, duration = 1800) {
    this.noticeText.setText(message);
    this.noticeText.x = Math.round((GAME_W - this.noticeText.textW) / 2);
    this.noticeUntil = this.time.now + duration;
  }

  openPause() {
    if (this.levelUpOpen) return;
    this.scene.launch('MenuScene', { parentScene: 'ExpeditionScene', locationName: 'Lumenwild Fracture' });
    this.scene.pause();
    swallowInput();
  }

  interactObjective() {
    const position = { x: this.px / TILE, y: this.py / TILE };
    const run = GameState.expedition;
    const nearbyLoot = this.lootMarkers.find(marker => marker.body.visible && nearAnchor(position, marker, 2.5));
    if (nearbyLoot) {
      const reward = claimLoot(run, nearbyLoot.id, this.region);
      if (reward) { nearbyLoot.body.setVisible(false); this.notice(`FOUND  ${reward.id.replaceAll('_', ' ').toUpperCase()} ×${reward.qty}`); }
      return true;
    }
    const relayThreats = this.enemies.filter(enemy => enemy.body.active && enemy.territory === 'relay' && enemy.kind !== 'passive').length;
    if (canActivateRelay(run, position, this.region, relayThreats)) {
      advanceObjective(run, 'relayActivated');
      this.action.hp = Math.min(this.action.maxHp, this.action.hp + Math.round(this.action.maxHp * 0.2));
      this.action.stamina = this.action.maxStamina;
      this.notice('RELAY STABILIZED  ·  shrine extraction online');
      this.refreshObjective(); autoSave('Lumenwild Relay');
      return true;
    }
    if (run.objective === 'relay' && nearAnchor(position, this.region.anchors.relay)) {
      this.notice(relayThreats ? `Relay locked · ${relayThreats} Voidborn remain` : 'Press F / X-button to stabilize the relay');
      return true;
    }
    if (canEnterBossGate(run, position, this.region)) {
      advanceObjective(run, 'gateEntered');
      this.notice('THE GATE HEART OPENS  ·  Kael is waiting');
      this.refreshObjective(); autoSave('Gate Heart');
      return true;
    }
    if (run.objective === 'shard' && nearAnchor(position, this.region.anchors.bossArena, 4)) {
      if (!GameState.shards.includes('crown_shard_gate')) GameState.shards.push('crown_shard_gate');
      GameState.flags.first_crown_shard_claimed = true;
      GameState.novaStage = Math.max(GameState.novaStage, 1);
      advanceObjective(run, 'shardClaimed');
      this.refreshObjective();
      this.notice('FIRST CROWN SHARD CLAIMED  ·  Crown Bearer awakened', 2600);
      if ((GameState.chars.lyra.evolution || 0) < 1) {
        this.scene.launch('EvolutionScene', {
          characterId: 'lyra', parentScene: 'ExpeditionScene',
          resolve: () => { this.notice('CROWN BEARER  ·  return to the Gate Heart portal'); }
        });
        this.scene.pause();
      }
      autoSave('Gate Heart · Crown Shard');
      return true;
    }
    if (run.objective === 'extraction' && nearAnchor(position, this.region.anchors.bossArena, 5)) {
      this.extract();
      return true;
    }
    if (nearAnchor(position, this.region.anchors.shrine) && run.checkpoint === 'shrine') {
      this.action.hp = Math.min(this.action.maxHp, this.action.hp + Math.round(this.action.maxHp * 0.35));
      this.action.stamina = this.action.maxStamina;
      this.notice('SHRINE RESTORED  ·  wounds and stamina renewed');
      return true;
    }
    return false;
  }

  refreshObjective() { this.objectiveText.setText(objectiveLabel(GameState.expedition)); }

  updateEcologyLifecycle(dt) {
    let activeCount = this.enemies.filter(enemy => enemy.ecology && enemy.body.active).length;
    const view = this.cameras.main.worldView;
    for (const enemy of this.enemies) {
      if (!enemy.ecology) continue;
      const event = stepEcology(enemy, dt, {
        playerX: this.px, playerY: this.py, activeCount, rng: this.ecologyRng,
        onScreen: (x, y) => view.contains(x, y)
      });
      if (event?.type === 'despawn') {
        enemy.body.setActive(false).setVisible(false); activeCount--;
      } else if (event?.type === 'respawn') {
        enemy.hp = enemy.maxHp; enemy.cooldownMs = 700; enemy.warningMs = 0; enemy.attackMs = 0;
        enemy.body.setPosition(event.x, event.y).setActive(true).setVisible(true).setAlpha(1); activeCount++;
      }
    }
  }

  updateEnemies(dt) {
    this.telegraphs.clear();
    for (const enemy of this.enemies) {
      if (!enemy.body.active) continue;
      if (enemy.kind === 'boss') continue;
      if (enemy.kind === 'miniboss' && GameState.expedition.objective === 'relay') {
        enemy.body.setAlpha(0.35);
        continue;
      }
      enemy.body.setAlpha(1);
      const dx = this.px - enemy.body.x, dy = this.py - enemy.body.y, dist = Math.hypot(dx, dy);
      enemy.cooldownMs = Math.max(0, enemy.cooldownMs - dt);
      enemy.exposedMs = Math.max(0, (enemy.exposedMs || 0) - dt);
      enemy.scannedMs = Math.max(0, (enemy.scannedMs || 0) - dt);
      if (enemy.kind === 'passive') {
        if (enemy.ecology.provoked && dist < 110) { enemy.body.x -= dx / Math.max(1, dist) * 40 * dt / 1000; enemy.body.y -= dy / Math.max(1, dist) * 40 * dt / 1000; }
        else updateWander(enemy, dt, (x, y) => this.canOccupy(x, y), this.ecologyRng);
        continue;
      }
      if (enemy.kind === 'neutral' && !enemy.ecology.provoked) {
        updateWander(enemy, dt, (x, y) => this.canOccupy(x, y), this.ecologyRng);
        continue;
      }
      if (enemy.warningMs > 0) {
        enemy.warningMs -= dt;
        if (enemy.attackStyle === 'ranged') this.telegraphs.lineStyle(2, 0xffffff, 0.8).lineBetween(enemy.body.x, enemy.body.y, this.px, this.py);
        this.telegraphs.lineStyle(Settings.highContrast ? 5 : 3, 0xff4f6d, 0.95).strokeCircle(enemy.body.x, enemy.body.y, enemy.attackStyle === 'ranged' ? 12 : 16);
        if (enemy.warningMs <= 0) {
          if (enemy.attackStyle === 'ranged') { this.fireEnemyProjectile(enemy); enemy.attackMs = 0; }
          else enemy.attackMs = 180;
        }
      } else if (enemy.attackMs > 0) {
        enemy.attackMs -= dt;
        if (enemy.attackMs <= 0 && dist < 26 && this.action.invulnerableMs <= 0) {
          if (this.action.hp <= 12 && GameState.chars.lyra.build?.secondWind && !GameState.expedition.secondWindUsed) {
            this.action.hp = 1; GameState.expedition.secondWindUsed = true; this.notice('SECOND WIND  ·  the Crown refuses to yield');
          } else this.applyPlayerDamage(12);
          this.action.invulnerableMs = 500;
        }
      } else if (dist < (enemy.kind === 'territorial' ? 88 : enemy.kind === 'elite' ? 175 : enemy.kind === 'neutral' ? 115 : 150)) {
        const attackRange = enemy.attackStyle === 'ranged' ? 118 : 27;
        if (dist < attackRange && enemy.cooldownMs <= 0) { enemy.warningMs = enemy.attackStyle === 'ranged' ? 900 : 720; enemy.cooldownMs = enemy.attackStyle === 'ranged' ? 2100 : 1600; }
        else if (dist > 22) {
          const flank = enemy.kind === 'elite' ? (Math.sin(this.time.now / 360 + enemy.ecology.spawnIndex) > 0 ? 0.72 : -0.72) : 0;
          const vx = dx / dist - dy / dist * flank, vy = dy / dist + dx / dist * flank;
          const speed = (enemy.kind === 'elite' ? 34 : enemy.kind === 'neutral' ? 25 : 28) * (enemy.scannedMs > 0 ? 0.72 : 1);
          const nx = enemy.body.x + vx * speed * dt / 1000, ny = enemy.body.y + vy * speed * dt / 1000;
          if (this.canOccupy(nx, ny)) enemy.body.setPosition(nx, ny);
        }
      } else if (enemy.kind === 'territorial' || enemy.kind === 'neutral') {
        updateWander(enemy, dt, (x, y) => this.canOccupy(x, y), this.ecologyRng);
      }
    }
  }

  fireEnemyProjectile(enemy) {
    const shot = this.projectiles.find(projectile => !projectile.body.active);
    if (!shot) return;
    const dx = this.px - enemy.body.x, dy = this.py - enemy.body.y, length = Math.max(1, Math.hypot(dx, dy));
    shot.body.setPosition(enemy.body.x, enemy.body.y).setActive(true).setVisible(true);
    shot.vx = dx / length * 104; shot.vy = dy / length * 104; shot.lifeMs = 1800;
  }

  updateProjectiles(dt) {
    for (const shot of this.projectiles) {
      if (!shot.body.active) continue;
      shot.lifeMs -= dt; shot.body.x += shot.vx * dt / 1000; shot.body.y += shot.vy * dt / 1000;
      if (Math.hypot(shot.body.x - this.px, shot.body.y - this.py) < 10) {
        if (this.action.invulnerableMs <= 0) {
          this.applyPlayerDamage(11);
          this.action.invulnerableMs = 420;
          if (this.companion?.guardMs > 0) this.notice('BRIMBLE BULWARK  ·  projectile damage reduced');
        }
        shot.lifeMs = 0;
      }
      if (shot.lifeMs <= 0 || !this.canOccupy(shot.body.x, shot.body.y)) shot.body.setActive(false).setVisible(false).setPosition(-100, -100);
    }
  }

  fireWandProjectile(spec) {
    const shot = this.playerProjectiles.find(projectile => !projectile.body.active);
    if (!shot) return false;
    const direction = { ...this.action.facing };
    shot.body.setPosition(this.px + direction.x * 10, this.py + direction.y * 10 - 8).setActive(true).setVisible(true);
    shot.vx = direction.x * 190; shot.vy = direction.y * 190; shot.lifeMs = 820;
    shot.spec = { ...spec, hitIds: new Set() };
    return true;
  }

  updatePlayerProjectiles(dt) {
    for (const shot of this.playerProjectiles) {
      if (!shot.body.active) continue;
      shot.lifeMs -= dt; shot.body.x += shot.vx * dt / 1000; shot.body.y += shot.vy * dt / 1000;
      let consumed = false;
      for (const enemy of this.enemies) {
        if (!enemy.body.active || enemy.kind === 'miniboss' && GameState.expedition.objective === 'relay') continue;
        if (Math.hypot(enemy.body.x - shot.body.x, enemy.body.y - shot.body.y) <= (enemy.body.radius || 8) + 5) {
          this.hitEnemyWithSpec(enemy, shot.spec);
          consumed = true;
          break;
        }
      }
      if (consumed || shot.lifeMs <= 0 || !this.canOccupy(shot.body.x, shot.body.y + 8)) {
        shot.body.setActive(false).setVisible(false).setPosition(-100, -100); shot.spec = null;
      }
    }
  }

  spawnImpactParticles(x, y, color, requested = 5) {
    const count = Settings.reducedParticles ? Math.min(2, requested) : requested;
    let spawned = 0;
    for (let i = 0; i < count; i++) {
      const particle = this.impactParticles.find(entry => !entry.body.active);
      if (!particle) break;
      const angle = this.combatRng() * Math.PI * 2, speed = 24 + this.combatRng() * 48;
      particle.body.setPosition(x, y).setFillStyle(color, 1).setAlpha(1).setActive(true).setVisible(true);
      particle.vx = Math.cos(angle) * speed; particle.vy = Math.sin(angle) * speed;
      particle.lifeMs = particle.maxLifeMs = 180 + this.combatRng() * 220;
      spawned++;
    }
    return spawned;
  }

  updateImpactParticles(dt) {
    const view = this.cameras.main.worldView;
    for (const particle of this.impactParticles) {
      if (!particle.body.active) continue;
      particle.lifeMs -= dt;
      particle.body.x += particle.vx * dt / 1000; particle.body.y += particle.vy * dt / 1000;
      particle.vx *= 0.94; particle.vy *= 0.94;
      particle.body.setAlpha(Math.max(0, particle.lifeMs / particle.maxLifeMs));
      if (particle.lifeMs <= 0 || !view.contains(particle.body.x, particle.body.y)) particle.body.setActive(false).setVisible(false).setPosition(-100, -100);
    }
  }

  updateBossActivation() {
    if (this.kael || GameState.expedition.objective !== 'kael') return;
    const arena = this.region.anchors.bossArena;
    if (Math.hypot(this.px / TILE - arena.x, this.py / TILE - arena.y) > arena.radius) return;
    const x = arena.x * TILE + 8, y = arena.y * TILE + 8;
    this.kael = new KaelController(this.region.seed, x, y);
    const body = this.createKaelBody(x, y);
    this.kaelEnemy = { id: 'kael', body, kind: 'boss', territory: 'bossArena', hp: this.kael.hp, maxHp: this.kael.maxHp, state: 'sentinel' };
    this.enemies.push(this.kaelEnemy);
    const offsets = [[-54, -38], [54, -38], [-54, 38], [54, 38]];
    this.bossPylons = offsets.map(([dx, dy]) => ({
      x: x + dx, y: y + dy, radius: 11,
      body: this.add.rectangle(x + dx, y + dy, 18, 30, 0x344f68, 1).setStrokeStyle(2, 0x66e8e0, 0.9).setDepth(DEPTH.DECO + 5)
    }));
    this.notice('VOID SENTINEL KAEL  ·  read the shape, then answer', 2600);
  }

  createKaelBody(x, y) {
    const aura = this.add.circle(0, 1, 23, 0x4d246f, 0.3).setStrokeStyle(2, 0xd070e0, 0.75);
    const shadow = this.add.ellipse(0, 18, 30, 8, 0x090611, 0.7);
    const cloak = this.add.triangle(0, 10, -15, 18, 15, 18, 9, -8, 0x2a173f, 1).setStrokeStyle(2, 0x6d3b91, 1);
    const armor = this.add.rectangle(0, 3, 18, 24, 0x46546e, 1).setStrokeStyle(2, 0xa4bdd0, 1);
    const helm = this.add.circle(0, -13, 9, 0x273247, 1).setStrokeStyle(2, 0xd3e5ee, 1);
    const leftHorn = this.add.triangle(-8, -20, -7, 3, 0, -9, 5, 3, 0x9b62c7, 1);
    const rightHorn = this.add.triangle(8, -20, -5, 3, 0, -9, 7, 3, 0x9b62c7, 1);
    const visor = this.add.rectangle(0, -13, 12, 3, 0xff4f9d, 1);
    const core = this.add.rectangle(0, 3, 7, 7, 0xd070e0, 1).setAngle(45).setStrokeStyle(1, 0xffffff, 0.9);
    const body = this.add.container(x, y, [shadow, aura, cloak, armor, helm, leftHorn, rightHorn, visor, core]).setDepth(DEPTH.ACTOR + 4);
    body.radius = 22;
    return body;
  }

  beamBlocked(from, end, player) {
    const vx = end.x - from.x, vy = end.y - from.y, lengthSq = vx * vx + vy * vy || 1;
    const playerT = ((player.x - from.x) * vx + (player.y - from.y) * vy) / lengthSq;
    return this.bossPylons.some(pylon => {
      const t = ((pylon.x - from.x) * vx + (pylon.y - from.y) * vy) / lengthSq;
      if (t <= 0 || t >= playerT) return false;
      const bx = from.x + vx * t, by = from.y + vy * t;
      return Math.hypot(pylon.x - bx, pylon.y - by) <= pylon.radius + 5;
    });
  }

  updateBoss(dt) {
    if (!this.kael || this.kael.dead) return;
    const bossTelegraph = this.kael.telegraph();
    const bossDistance = Math.hypot(this.px - this.kael.x, this.py - this.kael.y);
    if (!bossTelegraph && this.kael.stunMs <= 0 && bossDistance > 48) {
      const speed = this.kael.enraged ? 42 : 30;
      const nx = this.kael.x + (this.px - this.kael.x) / bossDistance * speed * dt / 1000;
      const ny = this.kael.y + (this.py - this.kael.y) / bossDistance * speed * dt / 1000;
      if (this.region.grid[Math.floor(ny / TILE)] && isWalkable(this.region.grid[Math.floor(ny / TILE)][Math.floor(nx / TILE)])) {
        this.kael.x = nx; this.kael.y = ny;
        this.kaelEnemy.body.setPosition(nx, ny);
      }
    }
    const events = this.kael.update(dt, {
      player: { x: this.px, y: this.py },
      beamBlocked: (from, end, player) => this.beamBlocked(from, end, player)
    });
    for (const event of events) {
      if (event.type === 'damage' && this.action.invulnerableMs <= 0) {
        if (this.action.hp <= event.amount && GameState.chars.lyra.build?.secondWind && !GameState.expedition.secondWindUsed) {
          this.action.hp = 1; GameState.expedition.secondWindUsed = true;
        } else this.applyPlayerDamage(event.amount);
        this.action.invulnerableMs = event.source === 'beam' ? 240 : 480;
      } else if (event.type === 'summon') this.spawnBossShades(event.count);
      else if (event.type === 'phase') this.notice('PHASE II  ·  Kael tears open the Gate Heart');
    }
    this.drawBossTelegraph();
  }

  spawnBossShades(count) {
    const arena = this.region.anchors.bossArena;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.7;
      const x = (arena.x * TILE + 8) + Math.cos(angle) * 76;
      const y = (arena.y * TILE + 8) + Math.sin(angle) * 62;
      const body = this.add.circle(x, y, 7, 0x8b4fb8, 1).setStrokeStyle(2, 0x1b1028, 1).setDepth(DEPTH.ACTOR + 2);
      this.enemies.push({ id: `kael_shade_${Date.now()}_${i}`, body, kind: 'shade', territory: 'bossArena', hp: 34, maxHp: 34, state: 'pursue', attackMs: 0, cooldownMs: 500, warningMs: 0 });
    }
  }

  drawBossTelegraph() {
    if (!this.kael) return;
    for (const rift of this.kael.rifts) {
      this.telegraphs.fillStyle(0x7a2ca8, 0.42).fillCircle(rift.x, rift.y, rift.radius);
      this.telegraphs.lineStyle(2, 0xd070e0, 0.9).strokeCircle(rift.x, rift.y, rift.radius);
    }
    const attack = this.kael.telegraph();
    if (!attack) return;
    if (attack.type === 'slash') {
      this.telegraphs.lineStyle(5, 0xff4f6d, 0.75).lineBetween(attack.x, attack.y, attack.x + attack.direction.x * 56, attack.y + attack.direction.y * 56);
    } else if (attack.type === 'pulse') {
      this.telegraphs.lineStyle(4, 0xff4f6d, 0.8).strokeCircle(attack.x, attack.y, 58);
    } else if (attack.type === 'summon') {
      this.telegraphs.lineStyle(3, 0xd070e0, 0.85).strokeCircle(attack.x, attack.y, 34);
    } else if (attack.type === 'rift') {
      this.telegraphs.fillStyle(0x9a42c7, 0.35).fillCircle(attack.target.x, attack.target.y, 18);
      this.telegraphs.lineStyle(2, 0xff76e8, 0.9).strokeCircle(attack.target.x, attack.target.y, 18);
    } else if (attack.type === 'beam') {
      const endX = attack.x + attack.direction.x * 360, endY = attack.y + attack.direction.y * 360;
      this.telegraphs.lineStyle(12, 0xff355f, attack.locked ? 0.46 : 0.22).lineBetween(attack.x, attack.y, endX, endY);
      this.telegraphs.lineStyle(2, 0xffffff, 0.8).lineBetween(attack.x, attack.y, endX, endY);
    } else if (attack.type === 'transition') {
      this.telegraphs.lineStyle(5, 0xd070e0, 0.75).strokeCircle(attack.x, attack.y, 48);
    }
  }

  resolveAttack() {
    const spec = attackSpec(this.action);
    if (!spec) return;
    if (spec.weapon === 'wand' && !spec.skill) {
      if (!spec.hitIds.has('__cast__')) {
        spec.hitIds.add('__cast__');
        this.fireWandProjectile(spec);
      }
      return;
    }
    for (const enemy of this.enemies) {
      if (!enemy.body.active || spec.hitIds.has(enemy.id)) continue;
      if (enemy.kind === 'miniboss' && GameState.expedition.objective === 'relay') continue;
      const dx = enemy.body.x - this.px, dy = enemy.body.y - this.py, dist = Math.hypot(dx, dy);
      const dot = dist ? (dx / dist * this.action.facing.x + dy / dist * this.action.facing.y) : 1;
      const build = GameState.chars.lyra.build || {};
      const reach = spec.reach + (spec.weapon === 'blade' && build.bladeArc && spec.combo === 2 ? 14 : 0);
      const arc = spec.arc + (spec.weapon === 'blade' && build.bladeArc && spec.combo === 2 ? 0.45 : 0);
      if (dist <= reach + enemy.body.radius && (spec.omni || dot >= Math.cos(arc))) {
        spec.hitIds.add(enemy.id);
        this.hitEnemyWithSpec(enemy, spec);
        enemy.body.x += this.action.facing.x * (spec.weapon === 'lance' ? 12 : 5);
        enemy.body.y += this.action.facing.y * (spec.weapon === 'lance' ? 12 : 5);
      }
    }
  }

  hitEnemyWithSpec(enemy, spec) {
    const build = GameState.chars.lyra.build || {};
    const modifier = spec.weapon === 'lance' && build.lanceBreak ? 1.18 : 1;
    const playerStats = effectiveStats('lyra');
    const equipped = GameState.actionArsenal?.[spec.weapon];
    const gearItem = itemData(gearId(equipped));
    const enhanced = gearStats(gearItem, equipped), baseGear = gearStats(gearItem, null);
    const powerStat = spec.weapon === 'wand' ? 'mag' : 'atk';
    const power = playerStats[powerStat] + (enhanced[powerStat] || 0) - (baseGear[powerStat] || 0);
    const markedCrit = build.erynnMark && enemy.marked;
    const critical = markedCrit || this.combatRng.chance(Math.min(0.75, playerStats.crit / 100));
    if (markedCrit) enemy.marked = false;
    let damage = Math.round((8 + power * 0.42) * spec.multiplier * modifier * (critical ? 1.5 : 1));
    if (spec.weapon === 'wand') {
      this.action.wandHits++;
      if (build.wandEcho && this.action.wandHits % 3 === 0) damage += Math.round(damage * 0.5);
    }
    const infusedType = gearPassives(gearItem, equipped).infusedDamage;
    this.damageEnemy(enemy, damage, { weapon: spec.weapon, damageType: infusedType || spec.damageType, critical });
    this.action.energy = Math.min(this.action.maxEnergy, this.action.energy + (enemy.kind === 'passive' ? 1 : build.crownSurge ? 5 : 3));
    const mastery = GameState.chars.lyra.weaponMastery;
    mastery[spec.weapon] = (mastery[spec.weapon] || 0) + Math.max(1, Math.round(spec.multiplier));
  }

  damageEnemy(enemy, damage, meta = {}) {
    if (!enemy || !enemy.body.active) return false;
    provokeCreature(enemy);
    if (meta.breakMs) enemy.exposedMs = Math.max(enemy.exposedMs || 0, meta.breakMs);
    if (meta.scanMs) enemy.scannedMs = Math.max(enemy.scannedMs || 0, meta.scanMs);
    const affinity = meta.test ? 1 : meta.damageType === enemy.weakness ? 1.35 : meta.damageType === enemy.resistance ? 0.65 : 1;
    damage = Math.max(1, Math.round(damage * affinity * (enemy.exposedMs > 0 ? 1.2 : 1)));
    if (affinity !== 1) meta.affinity = affinity > 1 ? 'WEAK' : 'RESIST';
    this.showDamage(enemy, damage, meta);
    const impactColor = { slash: 0x66e8e0, pierce: 0xffd166, blunt: 0xe8e8f4, fire: 0xff6b45, ice: 0x84e8ff, lightning: 0xffef67, dark: 0xd070e0, light: 0xfff0a6 }[meta.damageType] || 0xffffff;
    this.spawnImpactParticles(enemy.body.x, enemy.body.y, impactColor, meta.critical ? 9 : 5);
    if (Settings.hitStop) this.hitStopMs = Math.max(this.hitStopMs, meta.critical ? 65 : 28);
    if (enemy.kind === 'boss' && this.kael) {
      const result = this.kael.hit(damage, meta.damageType, meta.weapon === 'lance' ? 1.5 : 1);
      enemy.hp = this.kael.hp;
      if (result.broken) this.notice('ARMOR BREAK  ·  Kael is exposed');
      if (result.enraged && !GameState.expedition.kaelEnrageSeen) { GameState.expedition.kaelEnrageSeen = true; this.notice('ANNIHILATION ENRAGE  ·  Kael is vulnerable'); }
      if (result.dead) this.finishKael();
      return true;
    }
    enemy.hp -= damage;
    if (meta.mark) enemy.marked = true;
    if (enemy.hp > 0) return true;
    enemy.body.setActive(false).setVisible(false);
    retireCreature(enemy, this.ecologyRng);
    if (enemy.kind === 'shade' && this.kael) this.kael.summons = Math.max(0, this.kael.summons - 1);
    if (!GameState.expedition.defeated.includes(enemy.id)) GameState.expedition.defeated.push(enemy.id);
    const xp = enemy.kind === 'miniboss' ? 60 : enemy.kind === 'elite' ? 28 : enemy.kind === 'passive' ? 3 : 15;
    GameState.chars.lyra.lifetimeXp += xp;
    this.showFlyout(enemy.body.x, enemy.body.y - 6, `+${xp} XP`, 0x70b7ff, 1);
    const events = awardXp(['lyra'], xp);
    if (enemy.kind === 'miniboss' && advanceObjective(GameState.expedition, 'minibossDefeated')) {
      this.notice('GATE CHARGE CLAIMED  ·  return shortcut opened');
      this.refreshObjective();
    }
    if (events.length) this.openLevelUp(events[0]);
    return true;
  }

  applyPlayerDamage(amount) {
    const guarded = this.companion?.guardMs > 0;
    const finalAmount = Math.max(1, Math.round(amount * (guarded ? 0.45 : 1)));
    this.action.hp = Math.max(0, this.action.hp - finalAmount);
    return finalAmount;
  }

  showDamage(enemy, damage, meta) {
    if (Settings.damageNumbers) {
      this.showFlyout(enemy.body.x, enemy.body.y - 18, `${meta.affinity ? `${meta.affinity} ` : ''}${meta.critical ? 'CRIT ' : ''}${Math.max(0, Math.round(damage))}`,
        meta.affinity === 'WEAK' ? 0x66f0b5 : meta.affinity === 'RESIST' ? 0x8fa0b8 : meta.critical ? 0xffd166 : meta.damageType === 'dark' ? 0xd070e0 : meta.damageType === 'light' ? 0xfff0a6 : 0xffffff,
        meta.critical || meta.affinity === 'WEAK' ? 2 : 1);
    }
    if (meta.critical) { shake(this, 0.006, 100); flash(this, 0xfff0b0, 70, 0.2); }
  }

  showFlyout(x, y, text, color, scale = 1) {
    const label = this.flyoutPool.find(entry => !entry.busy);
    if (!label) return false;
    label.busy = true;
    this.tweens.killTweensOf(label);
    label.opts.scale = scale;
    label.setColor(color).setText(text).setPosition(x, y).setAlpha(1).setVisible(true);
    label.x -= label.textW / 2;
    this.tweens.add({ targets: label, y: label.y - 16, alpha: 0, duration: Settings.reducedMotion ? 260 : 520, onComplete: () => { label.busy = false; label.setVisible(false); } });
    return true;
  }

  finishKael() {
    if (!this.kaelEnemy?.body.active) return;
    this.kaelEnemy.body.setActive(false).setVisible(false);
    for (const enemy of this.enemies) if (enemy.kind === 'shade') enemy.body.setActive(false).setVisible(false);
    advanceObjective(GameState.expedition, 'kaelDefeated');
    GameState.flags.kael_defeated_action = true;
    GameState.chars.lyra.lifetimeXp += 180;
    const events = awardXp(['lyra'], 180);
    this.refreshObjective();
    this.notice('VOID SENTINEL KAEL DEFEATED  ·  claim the shard', 3000);
    if (events.length) this.openLevelUp(events[0]);
  }

  openLevelUp(event) {
    if (this.levelUpOpen) return;
    this.levelUpOpen = true;
    this.scene.launch('LevelUpScene', {
      parentScene: 'ExpeditionScene', seed: this.region.seed, level: event.level, action: this.action,
      resolve: choice => { this.levelUpOpen = false; this.notice(`BUILD FORGED  ·  ${choice.replaceAll('_', ' ').toUpperCase()}`); }
    });
    this.scene.pause();
  }

  drawFeedback() {
    this.attackFx.clear();
    const spec = attackSpec(this.action);
    if (spec) {
      const endX = this.px + this.action.facing.x * spec.reach, endY = this.py + this.action.facing.y * spec.reach;
      const color = spec.weapon === 'blade' ? 0x66e8e0 : spec.weapon === 'lance' ? 0xffd166 : 0xd070e0;
      if (spec.omni) {
        this.attackFx.fillStyle(color, 0.16).fillCircle(this.px, this.py - 8, spec.reach);
        this.attackFx.lineStyle(3, color, 0.9).strokeCircle(this.px, this.py - 8, spec.reach);
      } else if (spec.weapon !== 'wand') {
        this.attackFx.lineStyle(spec.weapon === 'lance' ? 5 : 3, color, 0.9).lineBetween(this.px, this.py - 10, endX, endY - 10);
        if (spec.weapon === 'blade') this.attackFx.lineStyle(spec.skill ? 4 : 2, 0xffffff, 0.7).strokeCircle(endX, endY - 10, spec.skill ? 14 : 9);
      }
    }
    this.hud.clear();
    this.hud.fillStyle(0x080b18, 0.86).fillRoundedRect(6, 6, 196, 31, 4);
    this.hud.fillStyle(0x331d35, 1).fillRect(12, 11, 86, 5);
    this.hud.fillStyle(0xe65a77, 1).fillRect(12, 11, 86 * this.action.hp / this.action.maxHp, 5);
    this.hud.fillStyle(0x25312e, 1).fillRect(12, 19, 86, 4);
    this.hud.fillStyle(0x59d59b, 1).fillRect(12, 19, 86 * this.action.stamina / this.action.maxStamina, 4);
    this.hud.fillStyle(0x261f3d, 1).fillRect(106, 19, 50, 4);
    this.hud.fillStyle(0xb66ee8, 1).fillRect(106, 19, 50 * this.action.energy / this.action.maxEnergy, 4);
    const lyra = GameState.chars.lyra, nextXp = Math.max(1, xpForLevel(lyra.level + 1));
    this.hud.fillStyle(0x24314a, 1).fillRect(12, 27, 144, 3);
    this.hud.fillStyle(0x5fa8ff, 1).fillRect(12, 27, 144 * Math.min(1, lyra.xp / nextXp), 3);
    if (this.companion) {
      const ready = 1 - this.companion.cooldownMs / this.companion.profile.cooldown;
      this.hud.fillStyle(0x342a24, 1).fillRect(162, 19, 32, 4);
      this.hud.fillStyle(0xffd166, 1).fillRect(162, 19, 32 * Math.max(0, ready), 4);
    }
    if (this.kael && !this.kael.dead) {
      this.hud.fillStyle(0x09060f, 0.9).fillRoundedRect(GAME_W / 2 - 126, GAME_H - 25, 252, 18, 4);
      this.hud.fillStyle(0x35134c, 1).fillRect(GAME_W / 2 - 120, GAME_H - 19, 240, 5);
      this.hud.fillStyle(0xa743d4, 1).fillRect(GAME_W / 2 - 120, GAME_H - 19, 240 * this.kael.hp / this.kael.maxHp, 5);
      this.hud.fillStyle(0x283849, 1).fillRect(GAME_W / 2 - 120, GAME_H - 12, 240, 3);
      this.hud.fillStyle(0x66e8e0, 1).fillRect(GAME_W / 2 - 120, GAME_H - 12, 240 * this.kael.armor / this.kael.maxArmor, 3);
    }
    const companionPrompt = this.companion ? ` · R CMD${this.companion.cooldownMs > 0 ? ` ${Math.ceil(this.companion.cooldownMs / 1000)}s` : ''}` : '';
    this.hudText.setText(`L${lyra.level} ${lyra.xp}/${nextXp}XP · ${this.action.weapon.toUpperCase()} · Q/E · Z HIT · X DODGE · F SKILL${companionPrompt} · C MENU`);
    if (this.noticeUntil && this.time.now > this.noticeUntil) { this.noticeText.setText(''); this.noticeUntil = 0; }
  }

  requestExtraction() {
    const position = { x: this.px / TILE, y: this.py / TILE };
    const run = GameState.expedition;
    const atLanding = nearAnchor(position, this.region.anchors.landing, 3);
    const atShrine = run.checkpoint === 'shrine' && nearAnchor(position, this.region.anchors.shrine, 3);
    if (atLanding || atShrine || run.objective === 'extraction') this.extract();
    else this.notice('Extraction requires the landing beacon or stabilized shrine.');
  }

  extract() {
    GameState.action = {
      stamina: this.action.stamina, maxStamina: this.action.maxStamina,
      energy: this.action.energy, maxEnergy: this.action.maxEnergy, weapon: this.action.weapon
    };
    GameState.chars.lyra.hp = Math.max(1, this.action.hp);
    const outcome = this.action.hp <= 0 ? 'defeat' : GameState.expedition.objective === 'extraction' ? 'victory' : 'extracted';
    const secured = settleRun(GameState.expedition, outcome);
    mergeInventory(GameState.inventory, secured);
    const summary = runSummary(GameState.expedition, GameState.chars.lyra, 'v6.0-alpha.5');
    GameState.runHistory.push(summary);
    if (GameState.runHistory.length > 30) GameState.runHistory.splice(0, GameState.runHistory.length - 30);
    GameState.map = 'stargate_dock'; GameState.x = 14; GameState.y = 17; GameState.dir = 'up';
    if (outcome === 'victory') {
      GameState.flags.lumenwild_first_clear = true;
      GameState.novaStage = Math.max(GameState.novaStage, 1);
    }
    autoSave('Nova Prime');
    this.scene.start('RunSummaryScene', { summary });
  }
}
