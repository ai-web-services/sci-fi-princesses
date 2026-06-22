# STELLAR PRINCESSES — Technical Documentation
## v4.0 — Modular ES Modules + Vite

---

## Project Structure

```
sci-fi-princesses/
├── AGENTS.md                  # Coding agent instructions (read first)
├── GAME_DESIGN_DOC.md         # Full GDD (narrative, characters, systems)
├── TECHNICAL_DOC.md           # This file — architecture & implementation
├── package.json               # npm run dev|build|preview
├── vite.config.js             # Vite config (root: public/, base: ./)
├── server.js                  # Legacy Node server (deprecated, use Vite)
├── serve.sh                   # Legacy dev server script (deprecated)
├── public/                    # Game source (Vite root)
│   ├── index.html             # Entry point, loads Phaser 4 CDN + import main.js
│   └── src/
│       ├── main.js            # Phaser bootstrap, scene list, game config
│       ├── config.js          # Constants: TILE, MAP_W/H, GAME_W/H, COLORS, T (tile types)
│       ├── gameData.js        # GameData state, save/load
│       ├── input.js           # getInput(), updateControllerStatus() — keyboard + gamepad
│       ├── audio.js           # AudioSys — Web Audio API BGM + SFX
│       ├── sprites.js         # generateCharacterTexture() — procedural pixel art
│       ├── textures.js        # generateTileTexture(), generateAllTextures(), getTileKey()
│       ├── townMap.js         # createTownMap(), townNPCs, townSigns, townChests, isTownSolid()
│       └── scenes/
│           ├── BootScene.js      # Texture/sprite generation, init audio
│           ├── TitleScene.js     # Title screen, new game/continue/settings
│           ├── TownScene.js      # Overworld: movement, NPCs, shops, dungeon entry
│           ├── DialogueScene.js  # Overlay: typewriter text, recruit choices
│           ├── ShopScene.js      # Overlay: buy/sell/upgrade/heal
│           ├── InventoryScene.js # Overlay: party management, equip, items
│           ├── CombatScene.js    # Turn-based battle system
│           └── DungeonScene.js   # 8-room dungeon with enemies and combat
├── .agents/skills/            # Preloaded Hermes skills for this project
│   ├── phaser-gamedev/        # Phaser patterns + 5 reference files
│   ├── playwright-testing/    # Testing patterns + scripts
│   ├── game-design-lead/      # Design orchestration + 5 specialist personas
│   ├── game-designer-persona/
│   ├── level-designer-persona/
│   ├── narrative-designer-persona/
│   ├── technical-artist-persona/
│   └── game-audio-engineer-persona/
├── assets/                    # Empty — all art is procedural
├── screenshots/               # F9 screenshot captures
└── dist/                      # Vite build output (gitignored)
```

**Key decision**: All game code uses ES modules. No bundler needed for dev (Vite handles it). Phaser 4 loaded from CDN. The `assets/` directory is empty — all sprites and tiles are procedurally generated.

---

## Build & Serve

```bash
# Dev server with hot reload (port 5173)
npm run dev

# Production build → dist/
npm run build

# Preview build locally (port 8090, matches Tailscale)
npm run preview
```

---

## Phaser 4 Specifics

### Version & CDN
- **Phaser 4.2.0** loaded from `https://cdn.jsdelivr.net/npm/phaser@4.2.0/dist/phaser.min.js`
- No npm install of Phaser — loaded as global via script tag in `index.html`

### Phaser 4 API Patterns Used

```javascript
// Game config (in main.js)
const config = {
  type: Phaser.CANVAS,
  width: 480, height: 270,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.NO_CENTER },
  input: { gamepads: true, keyboard: true },
  scene: [BootScene, TitleScene, TownScene, ...]
};

// Scene class pattern
class MyScene extends Phaser.Scene {
  constructor() { super({ key: 'MyScene' }); }
  create() { /* setup */ }
  update() { /* per-frame */ }
}

// Procedural texture generation
const g = this.make.graphics({ x: 0, y: 0, add: false });
g.fillStyle(0xff0000, 1);
g.fillRect(0, 0, 16, 16);
g.generateTexture('myTexture', 16, 16);
g.destroy();

// Overlay scenes (pause main, launch overlay)
this.scene.launch('ShopScene', { shopType: 'weapons' });
this.scene.pause();
// In overlay, to return:
this.scene.stop();
this.scene.get('TownScene').scene.resume();

// Gamepad input — poll ONCE per frame, cache result
const gp = scene.input.gamepad.getPad(0);
// JustDown for single-press detection
Phaser.Input.Gamepad.JustDown(gp.buttons[0]);
```

### Phaser 4 Gotchas
1. `this.textures.generate()` doesn't exist in Phaser 4 — use `graphics.generateTexture(key, w, h)`
2. `graphics.generateTexture()` requires explicit width/height — won't auto-detect
3. `make.graphics({ add: false })` must pass `add: false` for off-screen texture generation
4. Graphics objects must be destroyed after use: `g.destroy()`
5. `gamepad.getPad(0)` can return undefined — always null-check

---

## Architecture

### Scene Flow
```
BootScene → TitleScene → TownScene ←→ [DialogueScene, ShopScene, InventoryScene]
                                  ↓
                           DungeonScene → CombatScene
```

### Current Implementation
| Scene | Status | Description |
|-------|--------|-------------|
| BootScene | Complete | Generates all textures, character sprites |
| TitleScene | Complete | Title screen, new game / continue |
| TownScene | Complete | Full town with movement, NPCs, shops, chests |
| DialogueScene | Complete | Typewriter text, recruit choices |
| ShopScene | Complete | Buy/Sell/Upgrade/Heal |
| InventoryScene | Complete | View, equip, drop items |
| DungeonScene | Complete | 8-room dungeon, enemy encounters |
| CombatScene | Complete | Turn-based battle (Attack/Skill/Item/Flee) |

### Game Data Model
```javascript
// gameData.js — single global state object
const GameData = {
  gold: 500,
  inventory: [],           // Array of item objects
  party: [],               // Array of character objects
  questFlags: {},          // Boolean flags for quest progress
  playerX: 29, playerY: 20, playerDir: 0,
  bossDefeated: [false, false]
};

// Character object
{
  name: 'Lyra', species: 'human', level: 1, xp: 0, xpToLevel: 100,
  hp: 80, maxHp: 80, sp: 20, maxSp: 20,
  atk: 12, def: 8, spd: 10, crit: 5,
  equipment: { weapon: null, armor: null, accessory1: null, accessory2: null, implant: null },
  skills: [{ name: 'Stellar Slash', cost: 5, type: 'damage', element: 'light', power: 1.5 }],
  evolution: 0, evolutionName: 'Princess'
}

// Item object
{
  name: 'Plasma Blade', type: 'weapon', rarity: 'Common',
  atk: 5, def: 0, heal: 0, level: 1
}
```

### Town Map System
- **Tile-based**: 60×40 grid, 16px tiles
- **21 tile types**: FLOOR, WALL, DOOR, WATER, BRIDGE, GRASS, PATH, COUNTER, SHELF, PLANT, SIGN, CHEST, GATE, PORTAL, BED, TABLE, BAR, STAIRS, VOID, ICE, LAVA
- **Buildings**: Crown Spire, Weapon Shop, Armor Shop, Tavern, Healer's Hall, Material Shop, Stargate Dock, Training Ground, Gardens
- **11 NPCs**: including 2 recruitable companions (Erynn the cat person, Pip the robot)
- **8 signs**, **2 chests**

### Input System
- **Keyboard**: WASD/Arrows (move), Z/Space (interact), X/Esc (cancel), Enter (menu)
- **Gamepad**: Left stick/D-pad (move), A (interact), B (cancel), X (inventory), Y (party), Start (pause)
- **Cached polling**: Gamepad polled ONCE per frame, result cached — prevents duplicate input and GpButtons stale state bugs
- `getInput(scene)` in `input.js` returns `{ dx, dy, interact, cancel, menu, gp }`

### Rendering
- **Internal resolution**: 480×270 (16:9, pixel-art friendly)
- **Scaling**: CSS canvas scaling with pixelated rendering (`image-rendering: pixelated`)
- **Integer canvas scaling**: `Math.floor(Math.min(maxW/480, maxH/270))` for crisp pixels
- **Camera**: Manual repositioning each frame (not Phaser camera system)
- All sprites repositioned each frame based on camera offset

### Sprite Generation
All sprites are procedurally generated via `Phaser.Graphics`:

1. **Tile textures**: 21 tile types generated in `BootScene.create()` via `generateTileTexture()`
2. **Character textures**: 12 character sprites generated via `generateCharacterTexture()`
   - Species variants: human, cat (ears + tail), frog (bulging eyes), dragon (horns + tail), robot (single eye + antenna)
   - Each character has unique hair, eye, skin, and outfit colors
   - 16×20 base size at 2× pixel scale = 32×40 texture

### Save System
- **localStorage** key: `stellar_save`
- **Auto-save on**: new game start, companion recruitment, shop transactions
- **Load**: automatic on title screen if save exists

---

## Known Issues & TODO

### Bugs
- Inventory "Drop" action sets `this.mode = 'list'` instead of `'inventory'` (typo in InventoryScene.js line 200)
- CombatScene/DungeonScene enemies drawn as graphics primitives (no sprite textures)
- No animation system — sprites are static

### Missing Features (by GDD Step)
**Step 1 (Town)**: Complete
**Step 2 (Overworld + Plot)**: Partial — dungeon exists but no overworld zones
**Step 3 (Boss Battle)**: Partial — CombatScene works but no multi-phase bosses
**Step 4+**: Party evolutions, additional zones, endgame content

### Future Architecture Needs
- Overworld scene with zone transitions
- Boss multi-phase encounter system
- Cutscene system for story progression
- Particle effects system
- Sprite animation system
- Audio system improvements (currently basic Web Audio oscillators)
