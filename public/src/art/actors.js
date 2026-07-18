// ═══════════════════════════════════════════════════════════════
// ACTORS — Bakes authored actor sprite definitions into a texture
// with named frames: <id>_<dir><frame>  (dir: down|up|side,
// frame: 0 stand, 1 stepA, 2 stepB). Left = side flipped at runtime.
// Walk cycle: [1, 0, 2, 0].
// ═══════════════════════════════════════════════════════════════

import { drawGrid } from './pixel.js';
import { hasRig, rigAnim, rigTextureKey, RIG_FOOT_ORIGIN_Y } from '../engine/rigs.js';

export const WALK_CYCLE = [1, 0, 2, 0];
export const WALK_FRAME_MS = 130;

function frameGrid(def, dir, frameIdx) {
  const d = def[dir];
  const legs = frameIdx === 1 ? d.legs.a : frameIdx === 2 ? d.legs.b : d.legs.stand;
  return d.body.concat(legs);
}

// Bake one actor definition into its own texture with 9 frames.
export function buildActorTexture(scene, def) {
  const key = 'actor_' + def.id;
  if (scene.textures.exists(key)) return key;
  const w = def.w, h = def.h;
  const dirs = ['down', 'up', 'side'];
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  dirs.forEach((dir, di) => {
    for (let f = 0; f < 3; f++) {
      drawGrid(g, frameGrid(def, dir, f), def.map, f * w, di * h, 1);
    }
  });
  g.generateTexture(key, w * 3, h * 3);
  g.destroy();
  const tex = scene.textures.get(key);
  dirs.forEach((dir, di) => {
    for (let f = 0; f < 3; f++) {
      tex.add(dir + f, 0, f * w, di * h, w, h);
    }
  });
  return key;
}

// Small soft shadow blob for under actors.
export function buildShadowTexture(scene) {
  if (scene.textures.exists('actorShadow')) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x000000, 0.35);
  g.fillRect(3, 1, 10, 3);
  g.fillRect(1, 2, 14, 1);
  g.fillStyle(0x000000, 0.2);
  g.fillRect(2, 1, 12, 3);
  g.generateTexture('actorShadow', 16, 5);
  g.destroy();
}

// ── ActorSprite ────────────────────────────────────────
// Wraps a Phaser image + shadow, handles facing and walk animation.
export class ActorSprite {
  constructor(scene, actorId, x, y, options = {}) {
    this.scene = scene;
    this.id = actorId;
    this.rig = options.useRig !== false && hasRig(actorId); // generated PNG rig takes priority unless a scene requests stable grid art
    this.key = this.rig ? rigTextureKey(actorId, 'idle') : 'actor_' + actorId;
    this.shadow = scene.add.image(x, y, 'actorShadow').setOrigin(0.5, 0.5);
    this.dir = 'down';
    this.animT = 0;
    this.moving = false;
    if (this.rig) {
      this.img = scene.add.sprite(x, y, this.key, 0).setOrigin(0.5, RIG_FOOT_ORIGIN_Y);
      this.img.play(rigAnim(actorId, 'idle', 'down'));
    } else {
      this.img = scene.add.image(x, y, this.key, 'down0').setOrigin(0.5, 1);
    }
    this.setPos(x, y);
  }

  setPos(x, y) {
    this.x = x; this.y = y;
    this.img.x = Math.round(x);
    this.img.y = Math.round(y);
    this.shadow.x = Math.round(x);
    this.shadow.y = Math.round(y) - 1;
  }

  setDepth(d) {
    this.img.setDepth(d);
    this.shadow.setDepth(d - 1);
    return this;
  }

  face(dir) {
    this.dir = dir;
    if (this.rig) { this.playRig(); return; } // rigs author left/right rows — no flipX
    this.img.setFlipX(dir === 'left');
    this.updateFrame();
  }

  playRig() {
    const key = rigAnim(this.id, this.moving ? 'walk' : 'idle', this.dir);
    const current = this.img.anims.currentAnim;
    if (!current || current.key !== key) this.img.play(key);
  }

  updateFrame() {
    const texDir = (this.dir === 'left' || this.dir === 'right') ? 'side' : this.dir;
    let frame = 0;
    if (this.moving) {
      const idx = Math.floor(this.animT / WALK_FRAME_MS) % WALK_CYCLE.length;
      frame = WALK_CYCLE[idx];
    }
    this.img.setFrame(texDir + frame);
  }

  // delta ms; moving: bool
  update(delta, moving) {
    this.moving = moving;
    if (this.rig) { this.playRig(); return; } // Phaser anims advance themselves
    if (moving) this.animT += delta;
    else this.animT = 0;
    this.updateFrame();
  }

  destroy() {
    this.img.destroy();
    this.shadow.destroy();
  }
}
