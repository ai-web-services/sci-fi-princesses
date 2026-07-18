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
import { ForgeScene } from './scenes/ForgeScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GalleryScene } from './scenes/GalleryScene.js';
import { ExpeditionScene } from './scenes/ExpeditionScene.js';
import { LevelUpScene } from './scenes/LevelUpScene.js';
import { RunSummaryScene } from './scenes/RunSummaryScene.js';
import { LeaderboardScene } from './scenes/LeaderboardScene.js';
import { CharacterSheetScene } from './scenes/CharacterSheetScene.js';
import { GameState, newGameState } from './game/state.js';
import { recruit } from './game/party.js';

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
    CombatScene, TutorialScene, EvolutionScene, ShopScene, ForgeScene, MenuScene, GalleryScene,
    ExpeditionScene, LevelUpScene, RunSummaryScene, LeaderboardScene, CharacterSheetScene
  ]
};

// Guard against duplicate instances (Vite HMR full-reload edge cases)
if (window.__stellarGame) {
  window.__stellarGame.destroy(true);
}
window.__stellarGame = new Phaser.Game(config);

// Read-only browser-test seam: stable user-facing state without mutation hooks.
window.__stellarTest = {
  ready: false,
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
      mapChanges: GameState ? JSON.parse(JSON.stringify(GameState.mapChanges)) : {},
      expedition: GameState && GameState.expedition ? JSON.parse(JSON.stringify(GameState.expedition)) : null,
      action: (() => {
        const scene = game && game.scene.getScene('ExpeditionScene');
        return scene && scene.scene.isActive() ? {
          player: { x: scene.px, y: scene.py },
          hp: scene.action.hp, stamina: scene.action.stamina, energy: scene.action.energy,
          weapon: scene.action.weapon, action: scene.action.action && scene.action.action.type,
          playerProjectiles: scene.playerProjectiles?.filter(projectile => projectile.body.active).length || 0,
          enemiesAlive: scene.enemies.filter(enemy => enemy.body.active).length,
          companion: scene.companion ? scene.companion.snapshot() : null,
          kael: scene.kael ? scene.kael.snapshot() : null,
          ecology: scene.enemies.filter(enemy => enemy.ecology).map(enemy => ({ id: enemy.id, kind: enemy.kind, state: enemy.state, active: enemy.body.active, dormant: enemy.ecology.dormant, defeats: enemy.ecology.defeats }))
        } : null;
      })(),
      build: GameState?.chars?.lyra ? { ...(GameState.chars.lyra.build || {}) } : {},
      level: GameState?.chars?.lyra?.level || 0
      ,equipment: GameState?.chars?.lyra ? JSON.parse(JSON.stringify(GameState.chars.lyra.equipment || {})) : {}
      ,arsenal: GameState ? JSON.parse(JSON.stringify(GameState.actionArsenal || {})) : {}
      ,runHistory: GameState ? GameState.runHistory.map(entry => ({ ...entry })) : []
    };
  },
  commands: new URLSearchParams(location.search).has('test') ? {
    startExpedition(seed = 12345, options = {}) {
      if (!GameState) newGameState();
      const companion = options.companion || (options.erynn ? 'erynn' : null);
      if (companion && ['erynn', 'brimble', 'drakkor', 'pip'].includes(companion)) {
        if (!GameState.roster.includes(companion)) recruit(companion);
        GameState.active = ['lyra', companion];
      }
      const game = window.__stellarGame;
      for (const scene of game.scene.getScenes(true)) scene.scene.stop();
      game.scene.start('ExpeditionScene', { seed });
    },
    teleportToAnchor(anchorId, offsetX = 0, offsetY = 0) {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      const anchor = scene.region.anchors[anchorId];
      if (!anchor) return false;
      scene.px = (anchor.x + offsetX) * 16 + 8; scene.py = (anchor.y + offsetY) * 16 + 8;
      scene.player.setPos(scene.px, scene.py);
      return true;
    },
    defeatTerritory(territory) {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      for (const enemy of scene.enemies.filter(entry => entry.territory === territory && entry.body.active)) scene.damageEnemy(enemy, enemy.hp + 1, { test: true });
    },
    setLyraXp(xp) {
      if (!GameState?.chars?.lyra) return false;
      GameState.chars.lyra.xp = xp;
      return true;
    },
    setActionEnergy(amount) {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      if (!scene?.action) return false;
      scene.action.energy = Math.max(0, Math.min(scene.action.maxEnergy, Number(amount) || 0));
      return true;
    },
    setActionHp(amount) {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      if (!scene?.action) return false;
      scene.action.hp = Math.max(0, Math.min(scene.action.maxHp, Number(amount) || 0));
      return true;
    },
    prepareForge() {
      if (!GameState) return false;
      GameState.gold = Math.max(GameState.gold, 5000);
      for (const [id, qty] of [['scrap_metal', 40], ['bio_gel', 4], ['void_essence', 4], ['stellar_crystal', 4], ['dragon_scale', 4], ['celestial_shard', 2]]) {
        const stack = GameState.inventory.find(item => item.id === id);
        if (stack) stack.qty = Math.max(stack.qty, qty); else GameState.inventory.push({ id, qty });
      }
      return true;
    },
    damageKael(amount, damageType = 'stellar') {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      if (!scene.kaelEnemy) return false;
      scene.damageEnemy(scene.kaelEnemy, amount, { weapon: damageType === 'pierce' ? 'lance' : 'wand', damageType });
      return true;
    },
    damageCreature(kind, amount = 1) {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      const enemy = scene.enemies.find(entry => entry.kind === kind && entry.body.active);
      if (!enemy) return false;
      scene.damageEnemy(enemy, amount, { damageType: 'slash', test: true });
      return true;
    },
    stressExpedition() {
      const scene = window.__stellarGame.scene.getScene('ExpeditionScene');
      const enemies = scene.enemies.filter(enemy => enemy.ecology).slice(0, 18);
      enemies.forEach((enemy, index) => {
        const angle = index / enemies.length * Math.PI * 2;
        enemy.body.setPosition(scene.px + Math.cos(angle) * (55 + index % 3 * 12), scene.py + Math.sin(angle) * (55 + index % 3 * 12)).setActive(true).setVisible(true);
        enemy.hp = enemy.maxHp; enemy.ecology.dormant = false;
        for (let burst = 0; burst < 5; burst++) {
          scene.showDamage(enemy, 20 + burst, { critical: burst === 4, damageType: burst % 2 ? 'dark' : 'light' });
          scene.spawnImpactParticles(enemy.body.x, enemy.body.y, burst % 2 ? 0xd070e0 : 0xfff0a6, 5);
        }
      });
      return {
        active: enemies.length, transientLabels: enemies.length * 5,
        pooledFlyouts: scene.flyoutPool.filter(label => label.busy).length, flyoutCapacity: scene.flyoutPool.length,
        pooledParticles: scene.impactParticles.filter(particle => particle.body.active).length, particleCapacity: scene.impactParticles.length
      };
    }
  } : undefined
};
