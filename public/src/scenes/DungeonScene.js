// ═══════════════════════════════════════════════════════════════
// DUNGEON SCENE — 8-room dungeon with enemies and combat
// ═══════════════════════════════════════════════════════════════

import { TILE, GAME_W, GAME_H, T } from '../config.js';
import { getInput, updateControllerStatus } from '../input.js';
import { AudioSys } from '../audio.js';
import { getTileKey } from '../textures.js';

export class DungeonScene extends Phaser.Scene {
  constructor() { super({ key: 'DungeonScene' }); }

  create(data) {
    this.returnScene = data.returnScene;
    this.player = { x: 5, y: 5, dir: 0 };
    this.cameraX = 0;
    this.cameraY = 0;
    this.moveTimer = 0;
    this.playerSprite = null;
    this.mapContainer = null;
    this.enemySprites = [];
    this.enemyContainer = null;
    this.dungeonMap = this.createDungeonMap();

    AudioSys.stopBGM();

    this.buildMap();
    this.buildPlayer();
    this.buildEnemies();
    this.updateCamera();

    this.time.addEvent({ delay: 100, callback: () => updateControllerStatus(this), loop: true });
  }

  createDungeonMap() {
    const W = 30, H = 20;
    const map = [];
    for (let y = 0; y < H; y++) { map[y] = []; for (let x = 0; x < W; x++) map[y][x] = T.WALL; }

    const rooms = [
      {x:2,y:2,w:6,h:6}, {x:10,y:2,w:6,h:5}, {x:18,y:2,w:7,h:6},
      {x:2,y:10,w:5,h:5}, {x:10,y:10,w:8,h:6}, {x:20,y:10,w:6,h:5},
      {x:5,y:16,w:8,h:3}, {x:16,y:15,w:6,h:4}
    ];
    rooms.forEach(r => {
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++)
          if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = T.FLOOR;
    });

    const corridors = [
      [5,5,10,5], [13,5,13,4], [21,5,21,4],
      [4,10,4,8], [10,12,8,12], [14,12,14,10],
      [22,10,22,8], [8,16,8,14], [16,16,14,16]
    ];
    corridors.forEach(c => {
      const minX = Math.min(c[0], c[2]), maxX = Math.max(c[0], c[2]);
      const minY = Math.min(c[1], c[3]), maxY = Math.max(c[1], c[3]);
      for (let y = minY; y <= maxY; y++)
        for (let x = minX; x <= maxX; x++)
          if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = T.FLOOR;
    });

    map[18][5] = T.STAIRS;
    map[2][2] = T.PORTAL;

    return { data: map, w: W, h: H };
  }

  isDungeonSolid(x, y) {
    if (x < 0 || x >= this.dungeonMap.w || y < 0 || y >= this.dungeonMap.h) return true;
    return this.dungeonMap.data[y][x] === T.WALL;
  }

  buildMap() {
    this.mapContainer = this.add.container(0, 0);
    for (let y = 0; y < this.dungeonMap.h; y++) {
      for (let x = 0; x < this.dungeonMap.w; x++) {
        const key = getTileKey(this.dungeonMap.data[y][x]);
        const img = this.add.image(x * TILE + TILE/2, y * TILE + TILE/2, key);
        img.setCrop(0, 0, TILE, TILE);
        this.mapContainer.add(img);
      }
    }
  }

  buildPlayer() {
    this.playerSprite = this.add.sprite(this.player.x * TILE + TILE/2, this.player.y * TILE + TILE/2, 'lyra_walk');
    this.playerSprite.setOrigin(0.5, 0.8);
    this.playerSprite.play('lyra_walk_anim');
    this.playerSprite.anims.setProgress(0);
    this.playerSprite.anims.pause();
  }

  buildEnemies() {
    this.enemyContainer = this.add.container(0, 0).setDepth(10);
    const enemyPositions = [
      {x:12,y:4,name:'Void Scout',hp:30,maxHp:30,atk:8,def:2,xp:25,gold:15,color:0x8844aa},
      {x:22,y:5,name:'Void Scout',hp:30,maxHp:30,atk:8,def:2,xp:25,gold:15,color:0x8844aa},
      {x:5,y:12,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
      {x:14,y:13,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
      {x:22,y:12,name:'Void Knight',hp:70,maxHp:70,atk:16,def:8,xp:80,gold:50,color:0x6622aa},
      {x:7,y:17,name:'Shadow Lurker',hp:45,maxHp:45,atk:12,def:4,xp:40,gold:25,color:0x442266},
    ];

    enemyPositions.forEach(e => {
      const g = this.add.graphics();
      g.fillStyle(e.color, 1);
      g.fillRect(-8, -12, 16, 20);
      g.fillStyle(0xffffff, 1);
      g.fillRect(-4, -8, 2, 2);
      g.fillRect(2, -8, 2, 2);
      g.fillStyle(0xff0000, 1);
      g.fillRect(-3, -7, 1, 1);
      g.fillRect(3, -7, 1, 1);
      g.setPosition(e.x * TILE + TILE/2, e.y * TILE + TILE/2);
      g.enemyData = e;
      this.enemyContainer.add(g);
      this.enemySprites.push(g);
    });
  }

  updateCamera() {
    this.cameraX = Phaser.Math.Clamp(this.player.x * TILE - GAME_W/2 + TILE/2, 0, this.dungeonMap.w * TILE - GAME_W);
    this.cameraY = Phaser.Math.Clamp(this.player.y * TILE - GAME_H/2 + TILE/2, 0, this.dungeonMap.h * TILE - GAME_H);
    this.mapContainer.setPosition(-this.cameraX, -this.cameraY);
    this.enemyContainer.setPosition(-this.cameraX, -this.cameraY);
    if (this.playerSprite) {
      this.playerSprite.setPosition(this.player.x * TILE + TILE/2 - this.cameraX, this.player.y * TILE + TILE/2 - this.cameraY);
    }
  }

  update() {
    const { dx, dy, interact, cancel } = getInput(this);

    if (dx !== 0 || dy !== 0) {
      this.moveTimer++;
      if (this.moveTimer >= 6) {
        this.moveTimer = 0;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!this.isDungeonSolid(nx, ny)) {
          if (this.dungeonMap.data[ny] && this.dungeonMap.data[ny][nx] === T.STAIRS) {
            AudioSys.playBGM(); this.scene.stop(); if (this.returnScene) this.returnScene.scene.resume(); return;
          }
          if (this.dungeonMap.data[ny] && this.dungeonMap.data[ny][nx] === T.PORTAL) {
            AudioSys.playBGM(); this.scene.stop(); if (this.returnScene) this.returnScene.scene.resume(); return;
          }
          const enemy = this.enemySprites.find(g => g.enemyData && g.enemyData.hp > 0 && g.enemyData.x === nx && g.enemyData.y === ny);
          if (enemy) {
            this.scene.launch('CombatScene', { enemies: [enemy.enemyData], returnScene: this });
            this.scene.pause();
            return;
          }
          this.player.x = nx; this.player.y = ny; this.updateCamera();
        }
      }
      if (this.playerSprite) {
        this.playerSprite.anims.resume();
        if (dx < 0) this.playerSprite.setFlipX(true);
        else if (dx > 0) this.playerSprite.setFlipX(false);
      }
    } else {
      this.moveTimer = 0;
      if (this.playerSprite) {
        this.playerSprite.anims.pause();
      }
    }

    if (cancel) { AudioSys.playBGM(); this.scene.stop(); if (this.returnScene) this.returnScene.scene.resume(); }

    if (interact) {
      const ddx = [0,-1,1,0][this.player.dir];
      const ddy = [1,0,0,-1][this.player.dir];
      const enemy = this.enemySprites.find(g => g.enemyData && g.enemyData.hp > 0 && g.enemyData.x === this.player.x + ddx && g.enemyData.y === this.player.y + ddy);
      if (enemy) { this.scene.launch('CombatScene', { enemies: [enemy.enemyData], returnScene: this }); this.scene.pause(); }
    }
  }
}
