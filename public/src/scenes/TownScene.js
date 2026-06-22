// ═══════════════════════════════════════════════════════════════
// TOWN SCENE — Overworld exploration, NPCs, shops, dungeon entry
// ═══════════════════════════════════════════════════════════════

import { TILE, GAME_W, GAME_H, MAP_W, MAP_H, T } from '../config.js';
import { GameData, gameSave } from '../gameData.js';
import { getInput, updateControllerStatus } from '../input.js';
import { AudioSys } from '../audio.js';
import { getTileKey } from '../textures.js';
import { townMapData, townNPCs, townSigns, townChests, isTownSolid } from '../townMap.js';

export class TownScene extends Phaser.Scene {
  constructor() { super({ key: 'TownScene' }); }

  create() {
    this.player = { x: GameData.playerX, y: GameData.playerY, dir: GameData.playerDir, moving: false, frame: 0 };
    this.cameraX = 0;
    this.cameraY = 0;
    this.moveTimer = 0;
    this.npcSprites = [];
    this.chestSprites = [];
    this.signSprites = [];
    this.playerSprite = null;
    this.hudContainer = null;
    this.messageBox = null;
    this.messageTimer = 0;

    this.buildMap();
    this.buildNPCs();
    this.buildChests();
    this.buildSigns();
    this.buildPlayer();
    this.buildHUD();
    this.updateCamera();

    AudioSys.playBGM();
    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }

  buildMap() {
    this.mapContainer = this.add.container(0, 0);
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const key = getTileKey(townMapData[y][x]);
        const img = this.add.image(x * TILE + TILE/2, y * TILE + TILE/2, key);
        img.setCrop(0, 0, TILE, TILE);
        this.mapContainer.add(img);
      }
    }
  }

  buildNPCs() {
    townNPCs.forEach(npc => {
      const key = 'char_' + npc[2];
      const img = this.add.image(npc[0] * TILE + TILE/2, npc[1] * TILE + TILE/2, key);
      img.setOrigin(0.5, 0.8);
      img.npcData = { x: npc[0], y: npc[1], type: npc[2], name: npc[3], dialogue: npc[4], shop: npc[5], recruitable: npc[6] };
      img.nameLabel = this.add.text(npc[0] * TILE + TILE/2, npc[1] * TILE - 12, npc[3], {
        fontSize: '14px', fontFamily: 'monospace', color: '#aaaacc', backgroundColor: '#0a0a1a88', padding: { x: 2, y: 1 }
      }).setOrigin(0.5).setVisible(false);
      this.npcSprites.push(img);
    });
  }

  buildChests() {
    townChests.forEach(c => {
      const img = this.add.image(c.x * TILE + TILE/2, c.y * TILE + TILE/2, 'tile_chest');
      img.setOrigin(0.5, 0.8);
      img.chestData = c;
      this.chestSprites.push(img);
    });
  }

  buildSigns() {
    townSigns.forEach(s => {
      const img = this.add.image(s[0] * TILE + TILE/2, s[1] * TILE + TILE/2, 'tile_sign');
      img.setOrigin(0.5, 0.8);
      img.signData = { x: s[0], y: s[1], text: s[2] };
      this.signSprites.push(img);
    });
  }

  buildPlayer() {
    this.playerSprite = this.add.image(this.player.x * TILE + TILE/2, this.player.y * TILE + TILE/2, 'char_lyra');
    this.playerSprite.setOrigin(0.5, 0.8);
  }

  buildHUD() {
    this.hudContainer = this.add.container(0, 0);
    this.hudContainer.setDepth(100);

    const party = GameData.party;
    if (party.length > 0) {
      const leader = party[0];
      this.hudContainer.add(this.add.rectangle(70, 30, 140, 56, 0x0a0a1a, 0.85).setOrigin(0).setStrokeStyle(1, 0x4488ff));
      this.hudContainer.add(this.add.text(8, 8, leader.name, { fontSize: '7px', fontFamily: 'monospace', color: '#44ddff' }));
      this.hudContainer.add(this.add.text(8, 24, 'Lv.' + leader.level, { fontSize: '6px', fontFamily: 'monospace', color: '#aaaacc' }));
      this.hudContainer.add(this.add.rectangle(56, 12, 100, 8, 0x333333).setOrigin(0));
      this.hudContainer.add(this.hpFill = this.add.rectangle(56, 12, 100, 8, 0x33cc66).setOrigin(0));
      this.hudContainer.add(this.add.text(58, 10, 'HP', { fontSize: '8px', fontFamily: 'monospace', color: '#ffffff' }));
      this.hudContainer.add(this.hpText = this.add.text(154, 8, leader.hp + '/' + leader.maxHp, { fontSize: '5px', fontFamily: 'monospace', color: '#33cc66' }).setOrigin(1, 0));
      this.hudContainer.add(this.add.rectangle(56, 26, 100, 6, 0x333333).setOrigin(0));
      this.hudContainer.add(this.spFill = this.add.rectangle(56, 26, 100, 6, 0x4488ff).setOrigin(0));
      this.hudContainer.add(this.add.text(58, 24, 'SP', { fontSize: '7px', fontFamily: 'monospace', color: '#ffffff' }));
      this.hudContainer.add(this.add.text(8, 40, GameData.gold + 'g', { fontSize: '6px', fontFamily: 'monospace', color: '#ffcc33' }));
    }

    this.hudContainer.add(this.add.text(GAME_W/2, GAME_H - 16, 'WASD/Arrows:Move  Z/Space:Interact  X:Esc:Back  M/Enter:Party', {
      fontSize: '11px', fontFamily: 'monospace', color: '#666688'
    }).setOrigin(0.5));
  }

  updateHUD() {
    const party = GameData.party;
    if (party.length === 0) return;
    const leader = party[0];
    if (this.hpFill) {
      const hpPct = Math.max(0, leader.hp / leader.maxHp);
      this.hpFill.width = 100 * hpPct;
      this.hpFill.fillColor = hpPct > 0.5 ? 0x33cc66 : hpPct > 0.25 ? 0xffcc33 : 0xff3344;
    }
    if (this.spFill) this.spFill.width = 100 * Math.max(0, leader.sp / leader.maxSp);
    if (this.hpText) this.hpText.setText(leader.hp + '/' + leader.maxHp);
  }

  updateCamera() {
    this.cameraX = Phaser.Math.Clamp(this.player.x * TILE - GAME_W/2 + TILE/2, 0, MAP_W * TILE - GAME_W);
    this.cameraY = Phaser.Math.Clamp(this.player.y * TILE - GAME_H/2 + TILE/2, 0, MAP_H * TILE - GAME_H);
    this.mapContainer.setPosition(-this.cameraX, -this.cameraY);
    this.npcSprites.forEach(img => {
      img.setPosition(img.npcData.x * TILE + TILE/2 - this.cameraX, img.npcData.y * TILE + TILE/2 - this.cameraY);
      if (img.nameLabel) {
        img.nameLabel.setPosition(img.npcData.x * TILE + TILE/2 - this.cameraX, img.npcData.y * TILE - 8 - this.cameraY);
        img.nameLabel.setVisible(img.nameLabel.x > 0 && img.nameLabel.x < GAME_W && img.nameLabel.y > 0 && img.nameLabel.y < GAME_H);
      }
    });
    this.chestSprites.forEach(img => img.setPosition(img.chestData.x * TILE + TILE/2 - this.cameraX, img.chestData.y * TILE + TILE/2 - this.cameraY));
    this.signSprites.forEach(img => img.setPosition(img.signData.x * TILE + TILE/2 - this.cameraX, img.signData.y * TILE + TILE/2 - this.cameraY));
    if (this.playerSprite) {
      this.playerSprite.setPosition(this.player.x * TILE + TILE/2 - this.cameraX, this.player.y * TILE + TILE/2 - this.cameraY);
    }
  }

  showMessage(text) {
    if (this.messageBox) this.messageBox.destroy();
    this.messageBox = this.add.text(GAME_W/2, 60, text, {
      fontSize: '8px', fontFamily: 'monospace', color: '#ffffff',
      backgroundColor: '#0a0a1aee', padding: { x: 12, y: 6 }, wordWrap: { width: GAME_W - 80 }
    }).setOrigin(0.5).setDepth(150);
    this.messageTimer = 180;
  }

  update() {
    const { dx, dy, interact, cancel, menu, gp } = getInput(this);

    if (this.messageTimer > 0) {
      this.messageTimer--;
      if (this.messageTimer <= 0 && this.messageBox) { this.messageBox.destroy(); this.messageBox = null; }
    }

    if (dx !== 0 || dy !== 0) {
      this.moveTimer++;
      if (this.moveTimer >= 6) {
        this.moveTimer = 0;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!isTownSolid(nx, ny)) {
          const npc = this.npcSprites.find(n => n.npcData.x === nx && n.npcData.y === ny);
          if (!npc) { this.player.x = nx; this.player.y = ny; this.player.dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0; this.updateCamera(); }
        }
      }
      this.player.frame++;
      if (this.playerSprite) {
        const bob = Math.sin(this.player.frame * 0.3) * 1.5;
        this.playerSprite.y = this.player.y * TILE + TILE/2 - this.cameraY + bob;
      }
    } else {
      this.moveTimer = 0;
      if (this.playerSprite) this.playerSprite.y = this.player.y * TILE + TILE/2 - this.cameraY;
    }

    if (interact) {
      const ddx = [0,-1,1,0][this.player.dir];
      const ddy = [1,0,0,-1][this.player.dir];
      const tx = this.player.x + ddx;
      const ty = this.player.y + ddy;

      if (townMapData[ty] && townMapData[ty][tx] === T.PORTAL) {
        AudioSys.sfx.interact();
        this.scene.launch('DungeonScene', { returnScene: this });
        this.scene.pause();
        return;
      }

      const npc = this.npcSprites.find(n => n.npcData.x === tx && n.npcData.y === ty);
      if (npc) {
        AudioSys.sfx.interact();
        if (npc.npcData.shop && !npc.npcData.recruitable) {
          this.scene.launch('ShopScene', { shopType: npc.npcData.shop, npcName: npc.npcData.name });
          this.scene.pause();
        } else {
          this.scene.launch('DialogueScene', { npc: npc.npcData, scene: this });
          this.scene.pause();
        }
        return;
      }

      const sign = townSigns.find(s => s[0] === tx && s[1] === ty);
      if (sign) { this.scene.launch('DialogueScene', { text: sign[2], scene: this }); this.scene.pause(); return; }

      const chest = townChests.find(c => c.x === tx && c.y === ty && !c.taken);
      if (chest) { chest.taken = true; GameData.inventory.push(chest.item); this.showMessage('Found ' + chest.item.name + '!'); AudioSys.sfx.chest(); gameSave(); return; }
    }

    if (menu) { AudioSys.sfx.menu(); this.scene.launch('InventoryScene'); this.scene.pause(); }

    GameData.playerX = this.player.x;
    GameData.playerY = this.player.y;
    GameData.playerDir = this.player.dir;
    this.updateHUD();
  }
}
