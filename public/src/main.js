// ═══════════════════════════════════════════════════════════════
// MAIN — Phaser 4 bootstrap
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { OptionsScene } from './scenes/OptionsScene.js';
import { SaveLoadScene } from './scenes/SaveLoadScene.js';
import { MapScene } from './scenes/MapScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { QuestJournalScene } from './scenes/QuestJournalScene.js';
import { TravelScene } from './scenes/TravelScene.js';
import { CombatScene } from './scenes/CombatScene.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { EvolutionScene } from './scenes/EvolutionScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameState } from './game/state.js';

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
  scene: [
    BootScene, TitleScene, OptionsScene, SaveLoadScene,
    MapScene, DialogueScene, QuestJournalScene, TravelScene,
    CombatScene, TutorialScene, EvolutionScene, ShopScene, MenuScene
  ]
};

// Guard against duplicate instances (Vite HMR full-reload edge cases)
if (window.__stellarGame) {
  window.__stellarGame.destroy(true);
}
window.__stellarGame = new Phaser.Game(config);

// Read-only browser-test seam: stable user-facing state without mutation hooks.
window.__stellarTest = {
  snapshot() {
    const game = window.__stellarGame;
    const map = game && game.scene.getScene('MapScene');
    return {
      activeScenes: game ? game.scene.getScenes(true).map(scene => scene.scene.key) : [],
      map: GameState ? GameState.map : null,
      position: map && map.player ? { x: map.px, y: map.py, dir: map.player.dir } : null,
      scriptRunning: !!(map && map.scriptRunning),
      modalOpen: !!(map && map.modalOpen),
      arrivalPending: !!(map && map.arrivalPending),
      flags: GameState ? Object.assign({}, GameState.flags) : {},
      quests: GameState ? JSON.parse(JSON.stringify(GameState.quests)) : {},
      mapsVisited: GameState ? GameState.mapsVisited.slice() : [],
      trackedQuestId: GameState ? GameState.trackedQuestId : null,
      tutorialsSeen: GameState ? GameState.tutorialsSeen.slice() : [],
      roster: GameState ? GameState.roster.slice() : [],
      shards: GameState ? GameState.shards.slice() : [],
      evolution: GameState && GameState.chars.lyra ? GameState.chars.lyra.evolution : 0,
      gold: GameState ? GameState.gold : 0,
      inventory: GameState ? GameState.inventory.map(item => ({ ...item })) : [],
      mapChanges: GameState ? JSON.parse(JSON.stringify(GameState.mapChanges)) : {}
    };
  }
};
