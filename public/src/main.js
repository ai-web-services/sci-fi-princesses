// ═══════════════════════════════════════════════════════════════
// MAIN — Phaser 4 bootstrap
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { OptionsScene } from './scenes/OptionsScene.js';
import { SaveLoadScene } from './scenes/SaveLoadScene.js';
import { MapScene } from './scenes/MapScene.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  backgroundColor: '#0a0a1f',
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER
  },
  render: {
    pixelArt: true,
    roundPixels: true
  },
  input: {
    gamepads: true,
    keyboard: true
  },
  scene: [BootScene, TitleScene, OptionsScene, SaveLoadScene, MapScene]
};

// Guard against duplicate instances (Vite HMR full-reload edge cases)
if (window.__stellarGame) {
  window.__stellarGame.destroy(true);
}
window.__stellarGame = new Phaser.Game(config);
