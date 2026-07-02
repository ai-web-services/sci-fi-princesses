// ═══════════════════════════════════════════════════════════════
// BOOT SCENE — Texture/sprite generation, init audio
// ═══════════════════════════════════════════════════════════════

import { COLORS } from '../config.js';
import { generateAllTextures } from '../textures.js';
import { generateCharacterTexture } from '../sprites.js';
import { AudioSys } from '../audio.js';
import walkSheetUrl from '../sprites/lyra_walk/walk-cycle-32x40.png';
import idleUrl from '../sprites/lyra_walk/lyra-idle.png';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.spritesheet('lyra_walk', walkSheetUrl, {
      frameWidth: 32,
      frameHeight: 40
    });
    this.load.image('char_lyra', idleUrl);
  }

  create() {
    generateAllTextures(this);

    this.anims.create({
      key: 'lyra_walk_anim',
      frames: this.anims.generateFrameNumbers('lyra_walk', { start: 0, end: 24 }),
      frameRate: 12,
      repeat: -1
    });

    // Generate character textures (skip char_lyra — already loaded)
    const chars = [
      ['char_eryx', 'cat', COLORS.hair2, COLORS.eye3, COLORS.skin, COLORS.purple],
      ['char_brimble', 'frog', null, COLORS.eye3, COLORS.frog, COLORS.darkGreen],
      ['char_drakkor', 'dragon', null, COLORS.eye4, COLORS.dragon, COLORS.darkRed],
      ['char_pip', 'robot', null, null, COLORS.robot, COLORS.metal],
      ['char_merchant', 'human', COLORS.hair3, COLORS.eye4, COLORS.skin2, COLORS.brown],
      ['char_blacksmith', 'human', COLORS.hair3, COLORS.eye2, COLORS.skin2, COLORS.gray],
      ['char_healer', 'human', COLORS.hair1, COLORS.eye3, COLORS.skin, COLORS.white],
      ['char_commander', 'human', COLORS.hair3, COLORS.eye2, COLORS.skin2, COLORS.blue],
      ['char_tavernkeeper', 'human', COLORS.hair3, COLORS.eye4, COLORS.skin2, COLORS.darkBrown],
      ['char_townie1', 'human', COLORS.hair4, COLORS.eye1, COLORS.skin, COLORS.green],
      ['char_townie2', 'human', COLORS.hair2, COLORS.eye2, COLORS.skin2, COLORS.pink],
    ];
    chars.forEach(([key, species, hair, eye, skin, outfit]) => {
      generateCharacterTexture(this, key, species, hair, eye, skin, outfit);
    });

    AudioSys.init();

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';

    this.scene.start('TitleScene');
  }
}
