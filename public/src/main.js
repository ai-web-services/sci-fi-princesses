// ═══════════════════════════════════════════════════════════════
// MAIN — Phaser game config and bootstrap
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { TownScene } from './scenes/TownScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { InventoryScene } from './scenes/InventoryScene.js';
import { CombatScene } from './scenes/CombatScene.js';
import { DungeonScene } from './scenes/DungeonScene.js';

const config = {
  type: Phaser.CANVAS,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.NO_CENTER
  },
  input: {
    gamepads: true,
    keyboard: true
  },
  scene: [BootScene, TitleScene, TownScene, DialogueScene, ShopScene, InventoryScene, CombatScene, DungeonScene]
};

new Phaser.Game(config);
