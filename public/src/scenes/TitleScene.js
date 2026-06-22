// ═══════════════════════════════════════════════════════════════
// TITLE SCENE — Title screen, new game / continue / settings
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { GameData, gameHasSave, gameLoad, gameSave } from '../gameData.js';
import { getInput, updateControllerStatus } from '../input.js';
import { AudioSys } from '../audio.js';
import { townMapData, townChests, createTownMap, resetTownMap } from '../townMap.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); this.hasSave = false; }

  create() {
    this.hasSave = gameHasSave();
    this.mode = 'title';
    this.cursor = 0;

    this.titleText = this.add.text(GAME_W/2, 80, 'STELLAR PRINCESSES', { fontSize: '18px', fontFamily: 'monospace', color: '#ffcc33' }).setOrigin(0.5);
    this.add.text(GAME_W/2, 120, '— A Sci-Fi RPG —', { fontSize: '10px', fontFamily: 'monospace', color: '#aa44ff' }).setOrigin(0.5);

    this.spriteY = 240;
    this.charKeys = ['char_lyra', 'char_eryx', 'char_brimble', 'char_drakkor', 'char_pip'];
    this.charLabels = ['Lyra', 'Eryx', 'Brimble', 'Drakkor', 'Pip'];
    this.titleSprites = [];
    this.charKeys.forEach((key, i) => {
      const spr = this.add.image(120 + i * 160, this.spriteY, key).setScale(2).setOrigin(0.5, 0.8);
      this.titleSprites.push(spr);
    });

    this.promptText = this.add.text(GAME_W/2, 380, 'Press Z / SPACE / ENTER', { fontSize: '10px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);
    this.tweens.add({ targets: this.promptText, alpha: 0.2, duration: 800, yoyo: true, repeat: -1 });

    this.add.text(GAME_W/2, GAME_H - 20, 'v3.5 — Phaser 4.2', { fontSize: '7px', fontFamily: 'monospace', color: '#444466' }).setOrigin(0.5);

    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }

  showMenu() {
    this.mode = 'menu';
    this.cursor = 0;
    this.titleSprites.forEach(s => s.setVisible(false));

    const opts = this.hasSave ? ['New Game', 'Continue', 'Settings'] : ['New Game', 'Settings'];
    this.menuTexts = [];
    opts.forEach((o, i) => {
      const isSel = i === this.cursor;
      const txt = this.add.text(GAME_W/2, 220 + i * 44, (isSel ? '▸ ' : '  ') + o, { fontSize: '12px', fontFamily: 'monospace', color: isSel ? '#ffffff' : '#aaaaaa' }).setOrigin(0.5).setDepth(50);
      this.menuTexts.push(txt);
    });
    this.promptText.setVisible(false);
  }

  startGame(isNew) {
    if (!isNew && this.hasSave) {
      gameLoad();
    } else {
      GameData.party = [{name:'Lyra',species:'human',level:1,xp:0,xpToLevel:100,hp:80,maxHp:80,sp:20,maxSp:20,atk:12,def:8,spd:10,crit:5,equipment:{weapon:null,armor:null,accessory1:null,accessory2:null,implant:null},skills:[{name:'Stellar Slash',cost:5,type:'damage',element:'light',power:1.5}],evolution:0,evolutionName:'Princess'}];
      GameData.inventory = [
        {name:'Plasma Blade',type:'weapon',rarity:'Common',atk:5,level:1},
        {name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1},
        {name:'Nano Patch',type:'consumable',rarity:'Common',heal:30,level:1},
        {name:'Scrap Metal',type:'material',rarity:'Common',level:1},
      ];
      GameData.gold = 500;
      GameData.questFlags = {};
      GameData.playerX = 29;
      GameData.playerY = 20;
      GameData.playerDir = 0;
      resetTownMap();
      townChests.forEach(c => c.taken = false);
      gameSave();
    }
    this.scene.start('TownScene');
  }

  update() {
    const { dy, interact, cancel, menu } = getInput(this);

    if (this.mode === 'title') {
      this.titleSprites.forEach((spr, i) => {
        const t = (this.time && this.time.now) ? this.time.now : Date.now();
        spr.y = this.spriteY + Math.sin(t * 0.003 + i * 0.8) * 3;
      });
    }

    if (this.mode === 'title') {
      if (interact) {
        AudioSys.sfx.interact();
        if (this.hasSave) { this.showMenu(); } else { this.startGame(true); }
      }
      if (cancel && this.hasSave) { this.startGame(false); }
    } else if (this.mode === 'menu') {
      const opts = this.hasSave ? ['New Game', 'Continue', 'Settings'] : ['New Game', 'Settings'];
      if (dy < 0 && this.cursor > 0) this.cursor--;
      if (dy > 0 && this.cursor < opts.length - 1) this.cursor++;
      opts.forEach((o, i) => {
        const isSel = i === this.cursor;
        if (this.menuTexts[i]) {
          this.menuTexts[i].setText((isSel ? '▸ ' : '  ') + opts[i]);
          this.menuTexts[i].setColor(isSel ? '#ffffff' : '#aaaaaa');
        }
      });
      if (cancel) {
        this.mode = 'title';
        this.menuTexts.forEach(t => t.destroy());
        this.menuTexts = [];
        this.titleSprites.forEach(s => s.setVisible(true));
        this.promptText.setVisible(true);
      }
      if (interact) {
        AudioSys.sfx.interact();
        if (opts[this.cursor] === 'New Game') this.startGame(true);
        else if (opts[this.cursor] === 'Continue') this.startGame(false);
      }
    }
  }
}
