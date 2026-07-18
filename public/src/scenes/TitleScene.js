// ═══════════════════════════════════════════════════════════════
// TITLE — Starfield, shattered-crown emblem, main menu.
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from '../config.js';
import { pollInput, swallowInput } from '../engine/input.js';
import { MenuList } from '../engine/ui.js';
import { PixelText } from '../art/font.js';
import { RAMP } from '../art/palette.js';
import { playSong, initAudio, resumeAudio } from '../engine/audio.js';
import { SONGS } from '../data/music.js';
import { listSaves } from '../engine/save.js';
import { newGameState } from '../game/state.js';
import { transition } from '../engine/fx.js';
import { Settings } from '../engine/settings.js';

export const VERSION = 'v6.0-alpha.5';

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); }

  create() {
    this.add.image(0, 0, 'starfield').setOrigin(0, 0);

    // emblem + title
    const emblem = this.add.image(GAME_W / 2, 50, 'crownEmblem').setScale(2.4);
    if (!Settings.reducedMotion) {
      this.tweens.add({ targets: emblem, y: 47, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const t1 = new PixelText(this, 0, 82, 'STELLAR', { scale: 3, color: RAMP.uiGold[3], align: 'center' });
    t1.x = Math.round((GAME_W - t1.textW) / 2);
    const t2 = new PixelText(this, 0, 108, 'PRINCESSES', { scale: 3, color: RAMP.uiGold[4], align: 'center' });
    t2.x = Math.round((GAME_W - t2.textW) / 2);
    const sub = new PixelText(this, 0, 139, '— The Shattered Crown —', { scale: 1, color: 0x9678e0, align: 'center' });
    sub.x = Math.round((GAME_W - sub.textW) / 2);

    // menu
    const saves = listSaves();
    const hasAnySave = saves.some(s => !s.empty);
    this.menu = new MenuList(this, GAME_W / 2 - 60, 170, [
      { label: 'New Game', value: 'new' },
      { label: 'Continue', value: 'continue', disabled: !hasAnySave },
      { label: 'Options', value: 'options' }
    ], {
      width: 120, lineH: 16,
      onSelect: (it) => this.choose(it.value)
    });

    const v = new PixelText(this, 0, GAME_H - 14, VERSION + '  ·  a science-fantasy tale', { scale: 1, color: 0x555577, align: 'center' });
    v.x = Math.round((GAME_W - v.textW) / 2);

    // debug asset viewer (ART_PRODUCTION_PLAN.md Phase 0)
    this.input.keyboard.on('keydown-G', () => this.scene.start('GalleryScene'));

    // music (starts after first gesture unlocks audio)
    this.musicStarted = false;
    swallowInput();
  }

  choose(value) {
    if (value === 'new') {
      newGameState();
      transition(this, 'MapScene', {});
    } else if (value === 'continue') {
      transition(this, 'SaveLoadScene', { mode: 'load', back: 'TitleScene' });
    } else if (value === 'options') {
      transition(this, 'OptionsScene', { back: 'TitleScene' });
    }
  }

  update(time) {
    const inp = pollInput(this, time);
    if (!this.musicStarted) {
      initAudio(); resumeAudio();
      playSong('title', SONGS.title);
      this.musicStarted = true;
    }
    this.menu.handle(inp);
  }
}
