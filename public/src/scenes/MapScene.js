// ═══════════════════════════════════════════════════════════════
// MAP SCENE — Generic data-driven exploration: authored char-grid
// maps, grid-stepped movement with smooth tweening, collision,
// camera follow. NPCs/triggers/exits expand in M2.
// ═══════════════════════════════════════════════════════════════

import { TILE, DEPTH, GAME_W, GAME_H } from '../config.js';
import { getMap } from '../data/maps.js';
import { TILESETS, setTileOffset } from '../art/tiles.js';
import { rng } from '../art/pixel.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { fadeIn } from '../engine/fx.js';
import { ActorSprite } from '../art/actors.js';
import { GameState } from '../game/state.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { runScript } from '../engine/script.js';
import { playSong } from '../engine/audio.js';
import { SONGS } from '../data/music.js';

const STEP_MS = 140;   // per-tile walk duration

export class MapScene extends Phaser.Scene {
  constructor() { super({ key: 'MapScene' }); }

  init(data) {
    this.mapId = data.mapId || (GameState ? GameState.map : 'nova_plaza');
    this.entry = data.entry || null;   // {x, y, dir} override
  }

  create() {
    this.map = getMap(this.mapId);
    this.buildGround();
    this.buildCollision();

    // player
    const spawn = this.entry || (GameState && GameState.map === this.mapId
      ? { x: GameState.x, y: GameState.y, dir: GameState.dir }
      : this.map.spawn);
    this.px = spawn.x; this.py = spawn.y;
    this.player = new ActorSprite(this, 'lyra', 0, 0);
    this.player.face(spawn.dir || 'down');
    this.placeActor(this.player, this.px, this.py);
    this.stepping = false;
    this.scriptRunning = false;
    this.buildNpcs();
    this.playMapSong(this.map.music || 'nova');

    // camera
    const worldW = this.map.grid[0].length * TILE;
    const worldH = this.map.grid.length * TILE;
    this.cameras.main.setBounds(
      Math.min(0, (worldW - GAME_W) / 2),
      Math.min(0, (worldH - GAME_H) / 2),
      Math.max(worldW, GAME_W),
      Math.max(worldH, GAME_H)
    );
    this.cameras.main.startFollow(this.player.img, true);
    this.cameras.main.roundPixels = true;

    // location banner
    this.showLocationBanner();

    swallowInput();
    fadeIn(this, 350);
  }

  buildGround() {
    const grid = this.map.grid;
    const legend = this.map.legend;
    const set = TILESETS[this.map.tileset];
    const w = grid[0].length * TILE, h = grid.length * TILE;
    const key = 'map_' + this.map.id;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      const seedBase = 1013;
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          const ch = grid[y][x];
          const entry = legend[ch];
          if (!entry) continue;
          const painter = set[entry.tile];
          if (!painter) continue;
          const variants = entry.variants || 1;
          const r = rng(seedBase + y * 331 + x * 17);
          const variant = Math.floor(r() * variants);
          setTileOffset(x * TILE, y * TILE);
          painter(g, variant * 131 + 7 + ((x * 13 + y * 7) % 5));
        }
      }
      g.generateTexture(key, w, h);
      g.destroy();
    }
    this.add.image(0, 0, key).setOrigin(0, 0).setDepth(DEPTH.GROUND);
  }

  buildCollision() {
    const grid = this.map.grid;
    const legend = this.map.legend;
    this.solid = grid.map(row => row.split('').map(ch => {
      const e = legend[ch];
      return !e || !!e.solid;
    }));
  }

  buildNpcs() {
    this.entities = new Map();
    for (const data of this.map.npcs || []) {
      const actor = new ActorSprite(this, data.actor, 0, 0);
      actor.face(data.dir || 'down');
      const entity = { id: data.id, actor, data, x: data.x, y: data.y };
      this.placeActor(actor, data.x, data.y);
      this.entities.set('npc:' + data.id, entity);
    }
  }

  getEntity(id) {
    if (id === 'player') return { actor: this.player, x: this.px, y: this.py };
    return this.entities.get(id) || null;
  }

  npcAt(tx, ty) {
    for (const entity of this.entities.values()) {
      if (entity.x === tx && entity.y === ty) return entity;
    }
    return null;
  }

  isSolid(tx, ty) {
    if (ty < 0 || ty >= this.solid.length) return true;
    if (tx < 0 || tx >= this.solid[ty].length) return true;
    return this.solid[ty][tx] || !!this.npcAt(tx, ty);
  }

  facingTile() {
    const d = this.player.dir;
    return {
      x: this.px + (d === 'left' ? -1 : d === 'right' ? 1 : 0),
      y: this.py + (d === 'up' ? -1 : d === 'down' ? 1 : 0)
    };
  }

  interact() {
    const tile = this.facingTile();
    const entity = this.npcAt(tile.x, tile.y);
    if (!entity || !entity.data.script) return false;
    const towardPlayer = this.px < entity.x ? 'left' : this.px > entity.x ? 'right'
      : this.py < entity.y ? 'up' : 'down';
    entity.actor.face(towardPlayer);
    runScript(this, entity.data.script);
    return true;
  }

  playMapSong(id) {
    const song = SONGS[id];
    if (song) playSong(id, song);
  }

  showBanner(text) {
    const t = new PixelText(this, 0, 28, text, { scale: 1, color: RAMP.uiGold[4], align: 'center' });
    t.x = Math.round((GAME_W - t.textW) / 2);
    t.setDepth(DEPTH.UI).setScrollFactor(0);
    this.tweens.add({ targets: t, alpha: 0, delay: 1800, duration: 500, onComplete: () => t.destroy() });
  }

  stepEntityAsync(entity, dir) {
    const delta = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[dir];
    if (!delta) return Promise.resolve();
    entity.actor.face(dir);
    const nx = entity.x + delta[0], ny = entity.y + delta[1];
    if (this.isSolid(nx, ny)) return Promise.resolve();
    entity.x = nx; entity.y = ny;
    return new Promise(resolve => {
      this.tweens.add({
        targets: entity.actor,
        x: nx * TILE + TILE / 2,
        y: ny * TILE + TILE - 1,
        duration: STEP_MS,
        onUpdate: () => {
          entity.actor.setPos(entity.actor.x, entity.actor.y);
          entity.actor.setDepth(DEPTH.ACTOR + entity.actor.y / TILE);
        },
        onComplete: () => {
          this.placeActor(entity.actor, nx, ny);
          resolve();
        }
      });
    });
  }

  placeActor(actor, tx, ty) {
    actor.setPos(tx * TILE + TILE / 2, ty * TILE + TILE - 1);
    actor.setDepth(DEPTH.ACTOR + ty);
  }

  showLocationBanner() {
    const label = this.map.region ? this.map.region + ' — ' + this.map.name : this.map.name;
    const t = new PixelText(this, 0, 14, label, { scale: 1, color: RAMP.uiGold[4], align: 'center' });
    t.x = Math.round((GAME_W - t.textW) / 2);
    t.setDepth(DEPTH.UI).setScrollFactor(0).setAlpha(0);
    this.tweens.add({ targets: t, alpha: 1, duration: 500, hold: 1600, yoyo: true, onComplete: () => t.destroy() });
  }

  tryStep(dx, dy, time) {
    const dir = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
    this.player.face(dir);
    if (GameState) GameState.dir = dir;
    const nx = this.px + dx, ny = this.py + dy;
    if (this.isSolid(nx, ny)) return;
    this.stepping = true;
    this.px = nx; this.py = ny;
    if (GameState) { GameState.x = nx; GameState.y = ny; GameState.map = this.mapId; }
    const targetX = nx * TILE + TILE / 2;
    const targetY = ny * TILE + TILE - 1;
    this.tweens.add({
      targets: this.player,
      x: targetX, y: targetY,
      duration: STEP_MS,
      onUpdate: () => {
        this.player.setPos(this.player.x, this.player.y);
        this.player.setDepth(DEPTH.ACTOR + this.player.y / TILE);
      },
      onComplete: () => { this.stepping = false; }
    });
  }

  update(time, delta) {
    if (GameState) GameState.playtime += delta / 1000;
    if (this.scriptRunning) {
      this.player.update(delta, false);
      for (const entity of this.entities.values()) entity.actor.update(delta, false);
      return;
    }

    const inp = pollInput(this, time);

    if (!this.stepping) {
      if (inp.confirmed && this.interact()) return;
      if (inp.dx !== 0) this.tryStep(inp.dx, 0, time);
      else if (inp.dy !== 0) this.tryStep(0, inp.dy, time);
    }
    this.player.update(delta, this.stepping);
    for (const entity of this.entities.values()) entity.actor.update(delta, false);
  }
}
