// ═══════════════════════════════════════════════════════════════
// COMBAT SCENE — Turn-based battle system
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { GameData, gameSave } from '../gameData.js';
import { getInput } from '../input.js';
import { AudioSys } from '../audio.js';

export class CombatScene extends Phaser.Scene {
  constructor() { super({ key: 'CombatScene' }); }

  create(data) {
    this.enemies = data.enemies || [];
    this.party = GameData.party;
    this.turn = 0;
    this.cursor = 0;
    this.mode = 'main';
    this.selectedSkill = null;
    this.selectedItem = null;
    this.selectedTarget = 0;
    this.combatLog = [];
    this.animating = false;
    this.outcome = null;

    AudioSys.stopBGM();

    this.add.rectangle(GAME_W/2, GAME_H/2, GAME_W, GAME_H, 0x0a0520, 1).setDepth(300);
    this.add.rectangle(GAME_W/2, GAME_H/2 - 20, GAME_W - 20, GAME_H - 60, 0x1a0a3a, 0.9).setDepth(301).setStrokeStyle(2, 0x4488ff);

    this.enemySprites = [];
    this.partySprites = [];
    this.combatTexts = [];

    this.renderCombat();
  }

  log(msg) {
    this.combatLog.push(msg);
    if (this.combatLog.length > 3) this.combatLog.shift();
  }

  renderCombat() {
    this.combatTexts.forEach(t => t.destroy());
    this.combatTexts = [];
    this.enemySprites.forEach(s => s.destroy());
    this.enemySprites = [];
    this.partySprites.forEach(s => s.destroy());
    this.partySprites = [];

    const startLogY = 8;
    this.combatLog.forEach((msg, i) => {
      this.combatTexts.push(this.add.text(10, startLogY + i * 10, msg, { fontSize: '14px', fontFamily: 'monospace', color: '#cccccc' }).setDepth(302));
    });

    this.enemies.forEach((e, i) => {
      if (e.hp <= 0) return;
      const x = GAME_W - 60 - i * 50;
      const y = 70;
      const g = this.add.graphics().setDepth(302);
      g.fillStyle(e.color || 0xff3344, 1);
      g.fillRect(x - 10, y - 15, 20, 25);
      g.fillStyle(0xffffff, 1);
      g.fillRect(x - 5, y - 10, 3, 3);
      g.fillRect(x + 2, y - 10, 3, 3);
      g.fillStyle(0xff0000, 1);
      g.fillRect(x - 4, y - 9, 1, 1);
      g.fillRect(x + 3, y - 9, 1, 1);
      this.enemySprites.push(g);
      const hpPct = e.hp / e.maxHp;
      this.combatTexts.push(this.add.rectangle(x, y + 12, 20, 3, 0x333333).setDepth(302));
      this.combatTexts.push(this.add.rectangle(x, y + 12, 20 * hpPct, 3, hpPct > 0.5 ? 0x33cc66 : 0xff3344).setDepth(302));
      this.combatTexts.push(this.add.text(x, y + 18, e.name, { fontSize: '12px', fontFamily: 'monospace', color: '#ff8888' }).setDepth(302).setOrigin(0.5));
    });

    this.party.forEach((c, i) => {
      const x = 50 + i * 50;
      const y = GAME_H - 50;
      const charKey = 'char_' + (c.species === 'human' ? 'lyra' : c.species === 'cat' ? 'eryx' : c.species === 'frog' ? 'brimble' : c.species === 'dragon' ? 'drakkor' : c.species === 'robot' ? 'pip' : 'townie1');
      const spr = this.add.image(x, y, charKey).setDepth(302).setScale(0.7);
      this.partySprites.push(spr);
      const hpPct = c.maxHp > 0 ? c.hp / c.maxHp : 0;
      this.combatTexts.push(this.add.rectangle(x, y + 18, 24, 3, 0x333333).setDepth(302));
      this.combatTexts.push(this.add.rectangle(x, y + 18, 24 * hpPct, 3, hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344).setDepth(302));
      this.combatTexts.push(this.add.text(x, y + 24, c.name, { fontSize: '12px', fontFamily: 'monospace', color: '#44ddff' }).setDepth(302).setOrigin(0.5));
    });

    if (this.mode === 'main') {
      const opts = ['Attack', 'Skill', 'Item', 'Flee'];
      opts.forEach((o, i) => {
        const isSel = i === this.cursor;
        this.combatTexts.push(this.add.text(10 + (i % 2) * 80, GAME_H - 30 + Math.floor(i / 2) * 14, (isSel ? '> ' : '  ') + o, { fontSize: '9px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(302));
      });
    } else if (this.mode === 'attack' || this.mode === 'skill' || this.mode === 'item') {
      const alive = this.enemies.filter(e => e.hp > 0);
      alive.forEach((e, i) => {
        const isSel = i === this.selectedTarget;
        this.combatTexts.push(this.add.text(10, GAME_H - 30 + i * 14, (isSel ? '> ' : '  ') + e.name + ' HP:' + e.hp + '/' + e.maxHp, { fontSize: '8px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setDepth(302));
      });
      this.combatTexts.push(this.add.text(10, GAME_H - 10, 'X/Esc: Back', { fontSize: '14px', fontFamily: 'monospace', color: '#666688' }).setDepth(302));
    }
  }

  update() {
    if (this.animating || this.outcome) {
      if (this.outcome) {
        const { cancel, interact } = getInput(this);
        if (cancel || interact) {
          if (this.outcome === 'victory') {
            const xpGain = this.enemies.reduce((s, e) => s + (e.xp || 20), 0);
            const goldGain = this.enemies.reduce((s, e) => s + (e.gold || 10), 0);
            GameData.gold += goldGain;
            this.party.forEach(c => {
              c.xp = (c.xp || 0) + xpGain;
              if (c.xp >= c.xpToLevel) {
                c.xp -= c.xpToLevel;
                c.level++;
                c.maxHp += 10; c.hp = c.maxHp; c.atk += 2; c.def += 1;
                c.xpToLevel = Math.floor(c.xpToLevel * 1.3);
              }
            });
            gameSave();
          }
          AudioSys.playBGM();
          this.scene.stop();
          if (this.returnScene) {
            this.returnScene.scene.resume();
            if (this.returnScene.showMessage) {
              if (this.outcome === 'victory') this.returnScene.showMessage('Victory! Gained ' + this.enemies.reduce((s, e) => s + (e.xp || 20), 0) + ' XP!');
              else if (this.outcome === 'fled') this.returnScene.showMessage('Escaped safely.');
              else this.returnScene.showMessage('Defeated...');
            }
          }
        }
      }
      return;
    }

    const { dy, interact, cancel } = getInput(this);

    if (this.mode === 'main') {
      const opts = ['Attack', 'Skill', 'Item', 'Flee'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < opts.length - 1) this.cursor++;
      if (cancel) { AudioSys.playBGM(); this.scene.stop(); if (this.returnScene) this.returnScene.scene.resume(); }
      if (interact) {
        const opt = opts[this.cursor];
        if (opt === 'Attack') { this.mode = 'attack'; this.selectedTarget = 0; }
        else if (opt === 'Skill') { this.mode = 'skill'; this.selectedTarget = 0; }
        else if (opt === 'Item') { this.mode = 'item'; this.selectedTarget = 0; }
        else if (opt === 'Flee') { this.outcome = 'fled'; this.log('Fled from battle!'); this.renderCombat(); }
      }
      this.renderCombat();
    } else if (this.mode === 'attack' || this.mode === 'skill' || this.mode === 'item') {
      const alive = this.enemies.filter(e => e.hp > 0);
      if (dy < 0 && this.selectedTarget > 0) this.selectedTarget--;
      if (dy > 0 && this.selectedTarget < alive.length - 1) this.selectedTarget++;
      if (cancel) { this.mode = 'main'; this.cursor = 0; }
      if (interact) {
        const target = alive[this.selectedTarget];
        if (target) {
          const attacker = this.party[0];
          let damage = 0;
          if (this.mode === 'attack') {
            damage = Math.max(1, attacker.atk - (target.def || 0) + Math.floor(Math.random() * 5));
            target.hp -= damage;
            this.log(attacker.name + ' attacks ' + target.name + ' for ' + damage + '!');
            AudioSys.sfx.hurt();
          } else if (this.mode === 'skill') {
            if (attacker.sp >= 5) {
              attacker.sp -= 5;
              damage = Math.max(1, Math.floor(attacker.atk * 1.5) - (target.def || 0) + Math.floor(Math.random() * 8));
              target.hp -= damage;
              this.log(attacker.name + ' uses Stellar Slash on ' + target.name + ' for ' + damage + '!');
              AudioSys.sfx.hurt();
            } else this.log('Not enough SP!');
          } else if (this.mode === 'item') {
            const consumable = GameData.inventory.find(i => i.type === 'consumable' && i.heal);
            if (consumable) {
              attacker.hp = Math.min(attacker.maxHp, attacker.hp + consumable.heal);
              GameData.inventory.splice(GameData.inventory.indexOf(consumable), 1);
              this.log(attacker.name + ' uses ' + consumable.name + '!');
              AudioSys.sfx.heal();
            } else this.log('No consumables!');
          }

          if (this.enemies.every(e => e.hp <= 0)) { this.outcome = 'victory'; this.log('Victory!'); AudioSys.sfx.victory(); this.renderCombat(); return; }

          this.enemyTurn();

          if (this.party.every(c => c.hp <= 0)) { this.outcome = 'defeat'; this.log('Defeated...'); this.renderCombat(); return; }

          this.mode = 'main'; this.cursor = 0;
        }
      }
      this.renderCombat();
    }
  }

  enemyTurn() {
    const aliveParty = this.party.filter(c => c.hp > 0);
    if (aliveParty.length === 0) return;
    this.enemies.forEach(e => {
      if (e.hp <= 0) return;
      const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
      const damage = Math.max(1, (e.atk || 10) - target.def + Math.floor(Math.random() * 4));
      target.hp -= damage;
      this.log(e.name + ' attacks ' + target.name + ' for ' + damage + '!');
      AudioSys.sfx.hurt();
    });
  }
}
