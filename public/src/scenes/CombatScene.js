// ═══════════════════════════════════════════════════════════════
// COMBAT — FF4-style side-view battle presentation over the
// Battle logic engine. Party right, enemies left, command window
// bottom, turn-order strip top-left. Launched over a paused
// MapScene: scene.launch('CombatScene', {enemies, backdrop, ...}).
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H, DEPTH, ELEMENT_INFO } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { drawWindow, MenuList, drawGauge } from '../engine/ui.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { Settings } from '../engine/settings.js';
import { playSong, stopSong, sfx, uiSfx } from '../engine/audio.js';
import { Battle } from '../game/battle.js';
import { SKILLS } from '../data/skills.js';
import { STATUSES } from '../data/statuses.js';
import { GameState, setWorldFlag } from '../game/state.js';
import { itemData, charData } from '../game/progression.js';
import { flash, shake } from '../engine/fx.js';
import { buildHeroBattleTexture, buildEnemyBattleTexture, buildBattleBackdrop, enemySpriteSize } from '../art/battleArt.js';
import { hasRigAction, rigAnim, rigTextureKey, RIG_FOOT_ORIGIN_Y } from '../engine/rigs.js';
import { ENEMIES } from '../data/enemies.js';
import { MUSIC_LIBRARY } from '../data/musicLibrary.js';

const CMD_Y = GAME_H - 82;           // command area top
const HERO_X = GAME_W - 82, ENEMY_X = 88;

export class CombatScene extends Phaser.Scene {
  constructor() { super({ key: 'CombatScene' }); }

  init(data) {
    this.params = data || {};
    // enemies: array of enemy ids
    this.enemyIds = this.params.enemies || ['voidling'];
    this.backdrop = this.params.backdrop || 'nova';
    this.isBoss = !!this.params.isBoss;
    this.onWin = this.params.onWin || null;       // callback key handled by MapScene
    this.canFlee = this.params.canFlee !== false;
  }

  create() {
    const defs = this.enemyIds.map(id => ENEMIES[id]).filter(Boolean);
    this.battle = new Battle({ enemies: defs, canFlee: this.canFlee, isBoss: this.isBoss, backdrop: this.backdrop });

    // backdrop
    this.add.image(0, 0, buildBattleBackdrop(this, this.backdrop)).setOrigin(0, 0);
    // command area backdrop
    this.uiGfx = this.add.graphics().setDepth(DEPTH.UI);
    drawWindow(this.uiGfx, 4, CMD_Y, 180, GAME_H - CMD_Y - 4);
    drawWindow(this.uiGfx, 188, CMD_Y, GAME_W - 192, GAME_H - CMD_Y - 4);

    this.buildSprites();
    this.statusGfx = this.add.graphics().setDepth(DEPTH.UI + 1);
    this.partyTexts = [];
    this.orderTexts = [];
    this.refreshPartyPanel();
    this.refreshOrderStrip();

    this.menus = [];             // menu stack
    this.busy = true;            // animating / not accepting input
    this.turnActor = null;
    this.floaters = [];

    playSong(this.isBoss ? 'boss' : 'battle', MUSIC_LIBRARY[this.isBoss ? 'boss' : 'battle']);
    for (const d of defs) {
      if (!GameState.bestiary[d.id]) GameState.bestiary[d.id] = {};
      GameState.bestiary[d.id].seen = true;
    }

    swallowInput();
    this.time.delayedCall(400, () => this.nextTurn());
  }

  // ── Sprites ────────────────────────────────────────────
  buildSprites() {
    this.heroSprites = new Map();
    this.enemySprites = new Map();
    const heroes = this.battle.heroes();
    heroes.forEach((c, i) => this.placeHeroSprite(c, i));
    this.battle.enemies().forEach((c, i) => {
      this.placeEnemySprite(c, i);
    });
  }

  placeHeroSprite(c, i) {
    // 48×64 battle canvases (ART_VISION §1): wider rank spacing so heroes don't stack
    const x = HERO_X + i * 18, y = 78 + i * 42;
    let img;
    if (buildHeroBattleTexture(this, c.id)) {
      img = this.add.image(x, y, 'bh_' + c.id, 'idle');
    } else {
      img = this.add.image(x, y, 'actor_' + c.id, 'side0').setFlipX(true);
    }
    img.setOrigin(0.5, 1).setDepth(DEPTH.ACTOR + i);
    this.heroSprites.set(c.key, { img, home: { x, y } });
  }

  placeEnemySprite(c, i) {
    const size = enemySpriteSize(c.id);
    const big = size.w >= 64;
    const x = big ? ENEMY_X + 20 : ENEMY_X + (i % 2) * 56;
    const y = big ? 145 : 88 + i * 32;
    let img;
    if (hasRigAction(c.id, 'idle')) {
      img = this.add.sprite(x, y, rigTextureKey(c.id, 'idle'), 0);
      img.play(rigAnim(c.id, 'idle', 'right'));
    } else if (buildEnemyBattleTexture(this, c.id)) {
      img = this.add.image(x, y, 'be_' + c.id);
    } else {
      // fallback: generated blob silhouette
      const key = 'be_fallback_' + c.id;
      if (!this.textures.exists(key)) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const p = (c.def && c.def.palette) || { primary: 0x5e3d85, glow: 0xd070e0 };
        g.fillStyle(0x241a38, 1); g.fillRect(6, 6, 28, 28);
        g.fillStyle(p.primary, 1); g.fillRect(8, 8, 24, 24);
        g.fillStyle(p.glow, 1); g.fillRect(22, 14, 6, 4);
        g.generateTexture(key, 40, 40);
        g.destroy();
      }
      img = this.add.image(x, y, key);
    }
    img.setOrigin(0.5, hasRigAction(c.id, 'idle') ? RIG_FOOT_ORIGIN_Y : 1).setDepth(DEPTH.ACTOR + 10 + i);
    if (!Settings.reducedMotion) {
      this.tweens.add({ targets: img, y: y - 2, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    this.enemySprites.set(c.key, { img, home: { x, y } });
  }

  heroPose(key, pose, ms = 500) {
    const s = this.heroSprites.get(key);
    if (!s) return;
    if (s.img.texture.key.startsWith('bh_')) {
      s.img.setFrame(pose);
      if (ms > 0 && pose !== 'idle' && pose !== 'ko' && pose !== 'victory') {
        this.time.delayedCall(ms, () => {
          const c = this.battle.byKey(key);
          if (c && c.hp > 0) s.img.setFrame('idle');
        });
      }
    }
  }

  enemyPose(key, pose = 'attack', ms = 360) {
    const actor = this.battle.byKey(key), sprite = this.enemySprites.get(key);
    if (!actor || !sprite || !hasRigAction(actor.id, pose)) return;
    sprite.img.play(rigAnim(actor.id, pose, 'right'));
    if (ms > 0) this.time.delayedCall(ms, () => {
      if (sprite.img.active && hasRigAction(actor.id, 'idle')) sprite.img.play(rigAnim(actor.id, 'idle', 'right'));
    });
  }

  // ── HUD panels ─────────────────────────────────────────
  refreshPartyPanel() {
    this.statusGfx.clear();
    for (const t of this.partyTexts) t.destroy();
    this.partyTexts = [];
    const heroes = this.battle.heroes();
    heroes.forEach((c, i) => {
      const x = 198, y = CMD_Y + 12 + i * 22;
      const active = this.turnActor && this.turnActor.key === c.key;
      const name = new PixelText(this, x, y, (active ? '▶' : ' ') + c.name, {
        scale: 1, color: c.hp <= 0 ? 0x775555 : active ? RAMP.uiGold[4] : 0xe8e8f4
      });
      name.setDepth(DEPTH.UI + 2);
      this.partyTexts.push(name);
      drawGauge(this.statusGfx, x + 72, y + 1, 68, 5, c.hp / c.stats.maxHp, RAMP.hp);
      drawGauge(this.statusGfx, x + 72, y + 9, 48, 3, c.sp / c.stats.maxSp, RAMP.sp);
      const hpT = new PixelText(this, x + 146, y, c.hp + '/' + c.stats.maxHp, { scale: 1, color: c.hp / c.stats.maxHp < 0.25 ? 0xe87a5a : 0xbbbbd4 });
      hpT.setDepth(DEPTH.UI + 2);
      this.partyTexts.push(hpT);
      // status icons (text glyphs, colorblind-safe shapes per icon class)
      const GLYPHS = { up: '↑', down: '↓', dot: '●', shield: '◆', control: '★' };
      let sx = x + 230;
      for (const st of c.statuses.slice(0, 4)) {
        const d = STATUSES[st.id];
        const glyph = d ? (GLYPHS[d.icon] || '◆') : (st.id.endsWith('Up') ? '↑' : st.id.endsWith('Down') ? '↓' : '◆');
        const icon = new PixelText(this, sx, y, glyph, { scale: 1, color: d ? d.color : 0xffffff });
        icon.setDepth(DEPTH.UI + 2);
        this.partyTexts.push(icon);
        sx += 10;
      }
    });
  }

  refreshOrderStrip() {
    for (const t of this.orderTexts) t.destroy();
    this.orderTexts = [];
    const order = this.battle.previewOrder(7);
    const label = new PixelText(this, 8, 8, 'NEXT', { scale: 1, color: 0x8888aa });
    label.setDepth(DEPTH.UI + 2);
    this.orderTexts.push(label);
    order.forEach((c, i) => {
      const t = new PixelText(this, 8 + 34 + i * 22, 8, c.name.slice(0, 2), {
        scale: 1,
        color: c.side === 'hero' ? (charData(c.id) ? charData(c.id).palette || 0x99d8ff : 0x99d8ff) : 0xe87a5a
      });
      t.setDepth(DEPTH.UI + 2);
      this.orderTexts.push(t);
    });
  }

  // ── Floating text ──────────────────────────────────────
  float(x, y, text, color = 0xffffff, big = false) {
    const t = new PixelText(this, x, y, String(text), { scale: big ? 2 : 1, color, align: 'center' });
    t.x = Math.round(x - t.textW / 2);
    t.setDepth(DEPTH.UI + 5);
    this.tweens.add({
      targets: t, y: y - 22, alpha: 0, duration: Settings.reducedMotion ? 500 : 850,
      ease: 'Cubic.easeOut', onComplete: () => t.destroy()
    });
  }

  spriteOf(key) {
    return this.heroSprites.get(key) || this.enemySprites.get(key);
  }

  posOf(key) {
    const s = this.spriteOf(key);
    return s ? { x: s.img.x, y: s.img.y - s.img.height / 2 } : { x: GAME_W / 2, y: 120 };
  }

  // element burst VFX
  burst(key, element) {
    const p = this.posOf(key);
    const info = ELEMENT_INFO[element];
    const color = info ? info.color : 0xffffff;
    for (let i = 0; i < (Settings.reducedFlash ? 4 : 9); i++) {
      const r = this.add.rectangle(p.x, p.y, 3, 3, color).setDepth(DEPTH.UI + 4);
      const a = Math.random() * Math.PI * 2, d = 10 + Math.random() * 18;
      this.tweens.add({
        targets: r, x: p.x + Math.cos(a) * d, y: p.y + Math.sin(a) * d, alpha: 0,
        duration: 320, onComplete: () => r.destroy()
      });
    }
  }

  // ── Event animation queue ──────────────────────────────
  async animateEvents(events) {
    for (const ev of events) {
      await this.animateEvent(ev);
    }
    this.refreshPartyPanel();
  }

  delay(ms) { return new Promise(res => this.time.delayedCall(ms, res)); }

  async animateEvent(ev) {
    switch (ev.type) {
      case 'skill': {
        this.showSkillBanner(ev.name);
        const actorC = this.battle.byKey(ev.actor);
        if (actorC && actorC.side === 'hero') {
          this.heroPose(ev.actor, ev.kind === 'magic' || ev.kind === 'heal' || ev.kind === 'buff' ? 'cast' : 'attack', 450);
        } else if (actorC && actorC.side === 'enemy') {
          this.enemyPose(ev.actor, 'attack', 360);
        }
        const s = this.spriteOf(ev.actor);
        if (s && !Settings.reducedMotion) {
          const dir = this.heroSprites.has(ev.actor) ? -14 : 14;
          await new Promise(res => this.tweens.add({
            targets: s.img, x: s.home.x + dir, duration: 110, yoyo: true, onComplete: res
          }));
        }
        if (ev.element) sfx(ELEMENT_INFO[ev.element] ? ev.element === 'slash' || ev.element === 'pierce' || ev.element === 'blunt' ? ev.element : ev.element : 'slash');
        else if (ev.kind === 'heal') sfx('heal');
        else if (ev.kind === 'buff') sfx('buff');
        else if (ev.kind === 'debuff') sfx('debuff');
        break;
      }
      case 'damage': {
        const p = this.posOf(ev.target);
        if (ev.miss || ev.evaded) { this.float(p.x, p.y, 'MISS', 0x8888aa); break; }
        if (ev.immune) { this.float(p.x, p.y, 'IMMUNE', 0x8888aa); break; }
        if (ev.amount === 0 && ev.absorbed) { this.float(p.x, p.y, 'ABSORB', 0x66b0e8); break; }
        this.burst(ev.target, ev.element);
        const s = this.spriteOf(ev.target);
        if (s) {
          s.img.setTintFill(0xffffff);
          this.time.delayedCall(80, () => s.img.clearTint());
          if (!Settings.reducedMotion) {
            this.tweens.add({ targets: s.img, x: s.home.x + (this.heroSprites.has(ev.target) ? 6 : -6), duration: 60, yoyo: true, repeat: 1 });
          }
        }
        const heroHit = this.heroSprites.has(ev.target);
        if (heroHit) this.heroPose(ev.target, 'hit', 350);
        this.float(p.x, p.y, ev.amount, ev.crit ? 0xffd75e : heroHit ? 0xe87a5a : 0xffffff, ev.crit);
        if (ev.crit) { sfx('blunt'); shake(this, 0.004, 120); }
        if (ev.weak) this.float(p.x + 22, p.y - 12, 'WEAK!', 0xffd75e);
        if (ev.resist) this.float(p.x + 22, p.y - 12, 'resist', 0x8888aa);
        sfx('hurt');
        await this.delay(340);
        break;
      }
      case 'dot': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y, ev.amount, ev.color || 0xbb66ee);
        await this.delay(240);
        break;
      }
      case 'heal': case 'spRestore': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y, '+' + ev.amount, ev.type === 'heal' ? 0xaad866 : 0x99d8ff);
        if (!ev.status) sfx('heal');
        await this.delay(280);
        break;
      }
      case 'revive': {
        const p = this.posOf(ev.target);
        flash(this, 0xaaffcc, 200, 0.3);
        this.float(p.x, p.y, 'REVIVED', 0xaad866);
        this.heroPose(ev.target, 'idle', 0);
        const s = this.spriteOf(ev.target);
        if (s) s.img.setAlpha(1);
        sfx('heal');
        await this.delay(400);
        break;
      }
      case 'resonance': {
        flash(this, 0xffeea0, 160, 0.35);
        this.showBigBanner('RESONANCE — ' + ev.name, 0xffd75e);
        sfx('stellar');
        await this.delay(600);
        break;
      }
      case 'status': {
        const p = this.posOf(ev.target);
        const d = STATUSES[ev.status];
        this.float(p.x, p.y - 10, (d ? d.name : ev.status).toUpperCase(), d ? d.color : 0xffffff);
        await this.delay(260);
        break;
      }
      case 'statusImmune': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y - 10, 'no effect', 0x8888aa);
        await this.delay(200);
        break;
      }
      case 'buff': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y - 10, (ev.stat + (ev.amount > 0 ? ' ↑' : ' ↓')).toUpperCase(), ev.amount > 0 ? 0xaad866 : 0xe87a5a);
        await this.delay(240);
        break;
      }
      case 'shield': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y - 10, 'SHIELD', 0x66b0e8);
        sfx('buff');
        await this.delay(240);
        break;
      }
      case 'ko': {
        const s = this.spriteOf(ev.target);
        const c = this.battle.byKey(ev.target);
        sfx('ko');
        if (s) {
          if (c && c.side === 'enemy') {
            await new Promise(res => this.tweens.add({
              targets: s.img, alpha: 0, duration: Settings.reducedMotion ? 200 : 500, onComplete: res
            }));
          } else {
            this.heroPose(ev.target, 'ko', 0);
            s.img.setAlpha(0.6);
          }
        }
        break;
      }
      case 'telegraph': {
        flash(this, 0x66b0e8, 160, 0.25);
        this.showBigBanner(ev.say || 'Something stirs...', 0x66b0e8);
        sfx('debuff');
        await this.delay(700);
        break;
      }
      case 'enrageStart': {
        flash(this, 0xff3300, 220, 0.4);
        this.showBigBanner('ENRAGE BUILDING — ' + ev.ticks + ' turns!', 0xff5522);
        sfx('boss');
        await this.delay(900);
        break;
      }
      case 'enrageTick': {
        this.showBigBanner('The rage builds... (' + ev.ticks + ')', 0xff5522);
        sfx('debuff');
        await this.delay(700);
        break;
      }
      case 'enrageCountered': {
        flash(this, 0x66ccff, 200, 0.35);
        this.showBigBanner('The enrage is broken!', 0x9fe3ff);
        sfx('confirm');
        await this.delay(700);
        break;
      }
      case 'phase': {
        shake(this, 0.006, 250);
        flash(this, 0xbb66ee, 220, 0.4);
        if (ev.say) this.showBigBanner(ev.say, 0xd070e0);
        sfx('boss');
        await this.delay(900);
        break;
      }
      case 'summon': {
        const def = ENEMIES[ev.enemyId];
        if (def) {
          const c = this.battle.addSummon(def);
          if (c) {
            this.placeEnemySprite(c, this.battle.enemies().length - 1);
            this.showBigBanner(def.name + ' emerges!', 0xd070e0);
            await this.delay(500);
          }
        }
        break;
      }
      case 'swap': {
        const s = this.heroSprites.get(ev.actor);
        if (s) {
          s.img.destroy();
          const c = this.battle.byKey(ev.actor);
          const i = parseInt(ev.actor.slice(1), 10) || 0;
          let img;
          if (buildHeroBattleTexture(this, c.id)) img = this.add.image(s.home.x, s.home.y, 'bh_' + c.id, 'idle');
          else img = this.add.image(s.home.x, s.home.y, 'actor_' + c.id, 'side0').setFlipX(true);
          img.setOrigin(0.5, 1).setDepth(DEPTH.ACTOR + i);
          s.img = img;
        }
        await this.delay(300);
        break;
      }
      case 'stunned': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y, 'STUNNED', 0xffee44);
        await this.delay(350);
        break;
      }
      case 'defend': {
        const p = this.posOf(ev.actor);
        this.float(p.x, p.y, 'GUARD', 0x66b0e8);
        await this.delay(220);
        break;
      }
      case 'scan': {
        flash(this, 0x44ccb8, 150, 0.25);
        this.showBigBanner('Scan complete — records updated', 0x44ccb8);
        sfx('confirm');
        await this.delay(500);
        break;
      }
      case 'cleanse': {
        const p = this.posOf(ev.target);
        this.float(p.x, p.y - 10, 'CLEANSED', 0xaad866);
        await this.delay(220);
        break;
      }
      case 'item': {
        this.showSkillBanner(ev.name);
        await this.delay(250);
        break;
      }
      case 'duelEnd': {
        flash(this, 0xc86ad0, 200, 0.3);
        this.showBigBanner('The rest of the party moves in!', 0xc86ad0);
        sfx('boss');
        await this.delay(700);
        break;
      }
      case 'duelJoin': {
        const c = this.battle.byKey(ev.target);
        if (c) {
          const i = this.battle.heroes().findIndex(h => h.key === ev.target);
          this.placeHeroSprite(c, i < 0 ? 0 : i);
          this.float(this.posOf(ev.target).x, this.posOf(ev.target).y, c.name + ' joins!', 0xffd75e);
        }
        await this.delay(300);
        break;
      }
      default: break;
    }
  }

  showSkillBanner(text) {
    if (this.skillBanner) this.skillBanner.destroy();
    if (this.skillBannerGfx) this.skillBannerGfx.destroy();
    const t = new PixelText(this, 0, 24, text, { scale: 1, color: 0xffffff, align: 'center' });
    const w = t.textW + 24;
    const x = Math.round((GAME_W - w) / 2);
    const g = this.add.graphics().setDepth(DEPTH.UI + 3);
    drawWindow(g, x, 18, w, 18, { fillAlpha: 0.95 });
    t.x = x + 12; t.setDepth(DEPTH.UI + 4);
    this.skillBanner = t; this.skillBannerGfx = g;
    this.time.delayedCall(1100, () => {
      if (this.skillBanner === t) { t.destroy(); g.destroy(); this.skillBanner = null; this.skillBannerGfx = null; }
      else { /* replaced already */ }
    });
  }

  showBigBanner(text, color = 0xffd75e) {
    const t = new PixelText(this, 0, 150, text, { scale: 2, color, align: 'center' });
    t.x = Math.round((GAME_W - t.textW) / 2);
    t.setDepth(DEPTH.UI + 6).setAlpha(0);
    this.tweens.add({ targets: t, alpha: 1, duration: 150, hold: 900, yoyo: true, onComplete: () => t.destroy() });
  }

  // ── Turn engine ────────────────────────────────────────
  async nextTurn() {
    this.busy = true;
    const end = this.battle.checkEnd();
    if (end === 'victory') return this.victory();
    if (end === 'defeat') return this.defeat();
    if (end === 'secondwind') {
      this.showBigBanner('The party rises again!', 0xaad866);
      for (const h of this.battle.heroes()) {
        this.heroPose(h.key, 'idle', 0);
        const s = this.heroSprites.get(h.key);
        if (s) s.img.setAlpha(1);
      }
      this.refreshPartyPanel();
      await this.delay(800);
    }

    const actor = this.battle.nextTurn();
    if (!actor) return;
    this.turnActor = actor;
    this.refreshOrderStrip();
    this.refreshPartyPanel();

    const startEvents = this.battle.startTurn(actor);
    const skip = startEvents.skipTurn;
    await this.animateEvents(startEvents);

    const endAfter = this.battle.checkEnd();
    if (endAfter === 'victory') return this.victory();
    if (endAfter === 'defeat') return this.defeat();
    if (actor.hp <= 0 || skip) return this.nextTurn();

    if (actor.side === 'enemy') {
      await this.delay(300);
      const decision = this.battle.enemyDecide(actor);
      let events = [];
      if (decision && decision.telegraphing) {
        const skill = SKILLS[decision.skillId];
        events = [{ type: 'telegraph', actor: actor.key, say: (skill ? skill.name : 'Something') + ' gathers... (' + decision.ticks + ')' }];
      } else if (decision && decision.enraging) {
        events = [{ type: 'enrageTick', actor: actor.key, ticks: decision.ticks }];
      } else if (!decision || decision.defend) events = this.battle.defend(actor);
      else events = this.battle.useSkill(actor, decision.skillId, decision.targetKey);
      await this.animateEvents(events);
      return this.nextTurn();
    }

    // hero: open command menu
    this.busy = false;
    this.openCommandMenu(actor);
  }

  // ── Menus ──────────────────────────────────────────────
  clearMenus() {
    for (const m of this.menus) { m.menu.destroy(); if (m.gfx) m.gfx.destroy(); if (m.label) m.label.destroy(); }
    this.menus = [];
    this.clearTargeting();
  }

  pushMenu(items, opts) {
    const depth = this.menus.length;
    const x = 12 + depth * 8, y = CMD_Y + 10 + depth * 4;
    const menu = new MenuList(this, x, y, items, Object.assign({
      width: 154, lineH: 12, visible: 6
    }, opts));
    menu.setDepth(DEPTH.UI + 3 + depth);
    this.menus.push({ menu });
    return menu;
  }

  popMenu() {
    const m = this.menus.pop();
    if (m) { m.menu.destroy(); if (m.gfx) m.gfx.destroy(); }
  }

  // Nonlethal boss resolution (D19): an enemy def may carry a `mercy`
  // clause — { hpFrac, requires: charId, flag, text }. Returns that
  // clause once the boss is low enough and the required ally is alive.
  checkMercy() {
    for (const e of this.battle.alive('enemy')) {
      const m = e.def && e.def.mercy;
      if (!m) continue;
      if (e.hp / e.stats.maxHp > m.hpFrac) continue;
      if (m.requires) {
        const req = this.battle.heroes().find(h => h.id === m.requires);
        if (!req || req.hp <= 0) continue;
      }
      return m;
    }
    return null;
  }

  openCommandMenu(actor) {
    this.clearMenus();
    const reserve = GameState.roster.filter(id => !GameState.active.includes(id) && GameState.chars[id] && GameState.chars[id].hp > 0);
    const basic = actor.skills.find(id => SKILLS[id] && (SKILLS[id].cost || 0) === 0 && ['physical', 'magic'].includes(SKILLS[id].kind));
    const mercy = this.checkMercy();
    const items = [
      { label: 'Attack', value: 'attack', disabled: !basic },
      { label: 'Skill', value: 'skill' },
      { label: 'Item', value: 'item', disabled: !GameState.inventory.some(s => { const d = itemData(s.id); return d && d.type === 'consumable'; }) },
      { label: 'Defend', value: 'defend' },
      { label: 'Swap', value: 'swap', disabled: !reserve.length }
    ];
    if (mercy) items.push({ label: 'Talk', value: 'talk' });
    items.push({ label: 'Flee', value: 'flee', disabled: !this.battle.canFlee });
    this.pushMenu(items, {
      onSelect: (it) => this.command(actor, it.value, basic),
      onCancel: null
    });
  }

  command(actor, cmd, basicSkill) {
    switch (cmd) {
      case 'attack':
        this.selectTarget(actor, SKILLS[basicSkill], (targetKey) => this.resolveHero(actor, () => this.battle.useSkill(actor, basicSkill, targetKey)));
        break;
      case 'skill': this.openSkillMenu(actor); break;
      case 'item': this.openItemMenu(actor); break;
      case 'defend':
        this.resolveHero(actor, () => this.battle.defend(actor));
        break;
      case 'swap': this.openSwapMenu(actor); break;
      case 'talk': this.attemptMercy(); break;
      case 'flee': {
        const r = this.battle.tryFlee();
        if (r.ok) {
          this.clearMenus();
          this.busy = true;
          this.showBigBanner('Escaped!', 0x99d8ff);
          sfx('confirm');
          this.time.delayedCall(600, () => this.endBattle('fled'));
        } else {
          this.showSkillBanner(r.blocked ? 'Cannot flee this battle!' : 'Could not escape!');
          uiSfx('error');
          this.resolveHero(actor, () => []);
        }
        break;
      }
    }
  }

  attemptMercy() {
    const mercy = this.checkMercy();
    if (!mercy) { uiSfx('error'); return; }
    this.clearMenus();
    this.busy = true;
    if (mercy.flag) setWorldFlag(mercy.flag, true);
    this.battle.finish('mercy');
    stopSong(0.4);
    sfx('confirm');
    this.showBigBanner(mercy.text || 'Mercy is shown.', 0x9fe3ff);
    this.time.delayedCall(1000, () => this.endBattle('mercy'));
  }

  openSkillMenu(actor) {
    const usable = actor.skills.filter(id => SKILLS[id] && (SKILLS[id].cost || 0) > 0);
    if (!usable.length) { uiSfx('error'); return; }
    const items = usable.map(id => {
      const s = SKILLS[id];
      return { label: s.name, value: id, disabled: actor.sp < s.cost, hint: s.desc, right: s.cost + 'sp' };
    });
    const menu = this.pushMenu(items, {
      rightTexts: items.map(i => i.right),
      onSelect: (it) => {
        const skill = SKILLS[it.value];
        this.selectTarget(actor, skill, (targetKey) => this.resolveHero(actor, () => this.battle.useSkill(actor, it.value, targetKey)));
      },
      onCancel: () => this.popMenu(),
      onChange: (it) => this.showSkillBanner(SKILLS[it.value].desc)
    });
    return menu;
  }

  openItemMenu(actor) {
    const stacks = GameState.inventory.filter(s => { const d = itemData(s.id); return d && d.type === 'consumable'; });
    if (!stacks.length) { uiSfx('error'); return; }
    const items = stacks.map(s => {
      const d = itemData(s.id);
      return { label: d.name, value: s.id, right: '×' + s.qty, effect: d.effect };
    });
    this.pushMenu(items, {
      rightTexts: items.map(i => i.right),
      onSelect: (it) => {
        const d = itemData(it.value);
        const targetSide = d.effect && d.effect.revive ? 'koAlly' : 'ally';
        this.selectTargetSide(actor, targetSide, (targetKey) => this.resolveHero(actor, () => this.battle.useItem(actor, it.value, targetKey)));
      },
      onCancel: () => this.popMenu(),
      onChange: (it) => { const d = itemData(it.value); if (d) this.showSkillBanner(d.desc); }
    });
  }

  openSwapMenu(actor) {
    const reserve = GameState.roster.filter(id => !GameState.active.includes(id) && GameState.chars[id] && GameState.chars[id].hp > 0);
    const items = reserve.map(id => ({ label: id.charAt(0).toUpperCase() + id.slice(1), value: id }));
    this.pushMenu(items, {
      onSelect: (it) => this.resolveHero(actor, () => this.battle.swap(actor.key, it.value)),
      onCancel: () => this.popMenu()
    });
  }

  // ── Targeting ──────────────────────────────────────────
  selectTarget(actor, skill, cb) {
    if (!skill) return;
    if (['allEnemies', 'allAllies', 'self'].includes(skill.target)) { cb(null); return; }
    const side = skill.target === 'enemy' ? 'enemy' : skill.target === 'koAlly' ? 'koAlly' : 'ally';
    this.selectTargetSide(actor, side, cb);
  }

  selectTargetSide(actor, side, cb) {
    let pool;
    if (side === 'koAlly') pool = this.battle.heroes().filter(c => c.hp <= 0);
    else pool = this.battle.alive(side === 'enemy' ? 'enemy' : 'hero');
    if (!pool.length) { uiSfx('error'); return; }
    this.targeting = { pool, index: 0, cb };
    this.targetCursor = new PixelText(this, 0, 0, side === 'enemy' ? '▶' : '▶', { scale: 2, color: RAMP.uiGold[4] });
    this.targetCursor.setDepth(DEPTH.UI + 7);
    this.updateTargetCursor();
  }

  updateTargetCursor() {
    const t = this.targeting;
    if (!t) return;
    const c = t.pool[t.index];
    const p = this.posOf(c.key);
    this.targetCursor.x = p.x - 26;
    this.targetCursor.y = p.y - 8;
    this.showSkillBanner(c.name);
  }

  clearTargeting() {
    if (this.targetCursor) { this.targetCursor.destroy(); this.targetCursor = null; }
    this.targeting = null;
  }

  resolveHero(actor, fn) {
    this.clearMenus();
    this.busy = true;
    const events = fn();
    this.animateEvents(events).then(() => this.nextTurn());
  }

  // ── Outcomes ───────────────────────────────────────────
  async victory() {
    this.busy = true;
    this.clearMenus();
    stopSong(0.5);
    playSong('victory', MUSIC_LIBRARY.victory);
    for (const h of this.battle.alive('hero')) this.heroPose(h.key, 'victory', 0);
    const rewards = this.battle.finish('victory');
    this.showBigBanner('VICTORY!', 0xffd75e);
    await this.delay(900);
    // rewards window
    const g = this.add.graphics().setDepth(DEPTH.UI + 8);
    drawWindow(g, GAME_W / 2 - 130, 90, 260, 120, { fillAlpha: 0.97 });
    const lines = ['+' + rewards.xp + ' XP    +' + rewards.gold + ' gold'];
    for (const item of rewards.drops) {
      const d = itemData(item);
      lines.push('Found: ' + (d ? d.name : item));
    }
    for (const lu of rewards.levelUps) {
      lines.push(lu.id.charAt(0).toUpperCase() + lu.id.slice(1) + ' → Lv' + lu.level + (lu.learned.length ? '  learns ' + lu.learned.map(s => SKILLS[s] ? SKILLS[s].name : s).join(', ') : ''));
    }
    if (rewards.levelUps.length) sfx('levelup');
    const t = new PixelText(this, GAME_W / 2 - 116, 104, lines.join('\n'), { scale: 1, color: 0xe8e8f4, lineH: 14, maxWidth: 236 });
    t.setDepth(DEPTH.UI + 9);
    this.rewardDone = false;
    this.rewardCleanup = () => { g.destroy(); t.destroy(); };
    this.awaitConfirm = () => this.endBattle('victory');
  }

  async defeat() {
    this.busy = true;
    this.clearMenus();
    stopSong(0.5);
    this.showBigBanner('The party has fallen…', 0xe87a5a);
    await this.delay(1100);
    const g = this.add.graphics().setDepth(DEPTH.UI + 8);
    drawWindow(g, GAME_W / 2 - 90, 110, 180, 78, { fillAlpha: 0.97 });
    this.defeatMenu = new MenuList(this, GAME_W / 2 - 78, 122, [
      { label: 'Retry battle', value: 'retry' },
      { label: 'Load last save', value: 'load' },
      { label: 'Title screen', value: 'title' }
    ], {
      width: 160, lineH: 16,
      onSelect: (it) => {
        g.destroy(); this.defeatMenu.destroy(); this.defeatMenu = null;
        if (it.value === 'retry') {
          for (const id of GameState.active) {
            const rec = GameState.chars[id];
            if (rec) { rec.hp = rec.maxHp; rec.sp = rec.maxSp; }
          }
          this.scene.restart(this.params);
        } else if (it.value === 'load') {
          this.scene.stop('MapScene');
          stopSong(0.2);
          this.scene.start('SaveLoadScene', { mode: 'load', back: 'TitleScene' });
        } else {
          this.scene.stop('MapScene');
          stopSong(0.2);
          this.scene.start('TitleScene');
        }
      }
    });
    this.defeatMenu.setDepth(DEPTH.UI + 9);
  }

  endBattle(outcome) {
    if (this.rewardCleanup) { this.rewardCleanup(); this.rewardCleanup = null; }
    stopSong(0.3);
    const map = this.scene.get('MapScene');
    this.scene.stop();
    if (map) {
      map.events.emit('combat:end', { outcome, params: this.params });
      map.scene.resume();
    }
  }

  update(time) {
    if (this.defeatMenu) {
      const inp = pollInput(this, time);
      this.defeatMenu.handle(inp);
      return;
    }
    if (this.awaitConfirm) {
      const inp = pollInput(this, time);
      if (inp.confirmed) { const f = this.awaitConfirm; this.awaitConfirm = null; f(); }
      return;
    }
    if (this.busy) return;
    const inp = pollInput(this, time);

    if (this.targeting) {
      if (inp.leftRepeat || inp.upRepeat) {
        this.targeting.index = (this.targeting.index - 1 + this.targeting.pool.length) % this.targeting.pool.length;
        uiSfx('cursor'); this.updateTargetCursor();
      }
      if (inp.rightRepeat || inp.downRepeat) {
        this.targeting.index = (this.targeting.index + 1) % this.targeting.pool.length;
        uiSfx('cursor'); this.updateTargetCursor();
      }
      if (inp.confirmed) {
        const t = this.targeting;
        this.clearTargeting();
        uiSfx('confirm');
        t.cb(t.pool[t.index].key);
      }
      if (inp.cancelled) {
        this.clearTargeting();
        uiSfx('cancel');
      }
      return;
    }

    const top = this.menus[this.menus.length - 1];
    if (top) top.menu.handle(inp);
  }
}
