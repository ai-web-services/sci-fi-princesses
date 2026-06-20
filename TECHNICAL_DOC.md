# STELLAR PRINCESSES — Technical Documentation
## v3.0 — Phaser 4.2.0 Rewrite

---

## Project Structure

```
sci-fi-princesses/
├── GAME_DESIGN_DOC.md      # Full GDD (narrative, characters, systems)
├── TECHNICAL_DOC.md        # This file — architecture & implementation
├── serve.sh                # Dev server + file watcher
├── public/
│   ├── index.html          # Entry point, loads Phaser 4 CDN + game.js
│   └── game.js             # ALL game code (969 lines, single file)
├── src/                    # Old modular source (pre-Phaser, archived)
│   ├── engine/             # Canvas 2D engine (superseded)
│   ├── entities/           # Entity definitions (superseded)
│   ├── combat/             # Combat system (superseded)
│   ├── world/              # Map data (superseded)
│   ├── items/              # Item definitions (superseded)
│   ├── ui/                 # UI system (superseded)
│   └── game/               # Game state (superseded)
└── assets/                 # Empty — all art is procedural
```

**Key decision**: All game code is in a single `game.js` file. This avoids module bundler complexity and keeps the project as a simple static site. The `src/` directory is archived from the pre-Phaser canvas 2D version.

---

## Phaser 4 Specifics

### Version & CDN
- **Phaser 4.2.0** loaded from `https://cdn.jsdelivr.net/npm/phaser@4.2.0/dist/phaser.min.js`
- No build step, no npm install, no bundler

### Phaser 4 API Patterns Used

```javascript
// Game config
const config = {
  type: Phaser.CANVAS,        // Canvas 2D renderer (not WebGL)
  width: 480, height: 270,    // Internal resolution
  pixelArt: true,             // Disables anti-aliasing
  scale: {
    mode: Phaser.Scale.FIT,   // Auto-scales to fill viewport
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: { gamepads: true, keyboard: true },
  scene: [BootScene, TitleScene, TownScene, DialogueScene, ShopScene, InventoryScene]
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

// Gamepad input
const gp = scene.input.gamepad.getPad(0);
gp.buttons[0]    // A button
gp.buttons[1]    // B button
gp.buttons[12]   // D-pad up
gp.buttons[13]   // D-pad down
gp.buttons[14]   // D-pad left
gp.buttons[15]   // D-pad right
gp.axes[0]       // Left stick X (-1 to 1)
gp.axes[1]       // Left stick Y (-1 to 1)

// JustDown for single-press detection
Phaser.Input.Gamepad.JustDown(gp.buttons[0])
```

### Phaser 4 Gotchas Encountered
1. **`this.textures.generate()` doesn't exist in Phaser 4** — use `graphics.generateTexture(key, width, height)` instead
2. **`scene.scene` to access parent** — use `this.scene.get('SceneKey')` to access another scene
3. **`setCrop` on images** — needed when reusing a texture at different positions
4. **Graphics objects must be destroyed** — `g.destroy()` after `generateTexture()` to avoid memory leaks
5. **`make.graphics({ add: false })** — must pass `add: false` for off-screen texture generation

---

## Architecture

### Scene Flow
```
BootScene → TitleScene → TownScene ←→ [DialogueScene, ShopScene, InventoryScene]
                                  ↓
                           OverworldScene (planned)
                                  ↓
                           CombatScene (planned)
                                  ↓
                           BossScene (planned)
```

### Current Implementation (v3.0)
| Scene | Status | Description |
|-------|--------|-------------|
| BootScene | ✅ Complete | Generates all textures, character sprites |
| TitleScene | ✅ Complete | Title screen, new game / continue |
| TownScene | ✅ Complete | Full town with movement, NPCs, shops, chests |
| DialogueScene | ✅ Complete | Typewriter text, recruit choices |
| ShopScene | ✅ Complete | Buy/Sell/Upgrade/Heal |
| InventoryScene | ✅ Complete | View, equip, drop items |
| OverworldScene | ❌ Not started | Zone exploration |
| CombatScene | ❌ Not started | Turn-based ATB combat |
| BossScene | ❌ Not started | Boss encounters |

### Game Data Model
```javascript
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
- **Tile types**: FLOOR, WALL, DOOR, WATER, BRIDGE, GRASS, PATH, COUNTER, SHELF, PLANT, SIGN, CHEST, GATE, PORTAL, BED, TABLE, BAR, STAIRS, VOID, ICE, LAVA
- **Buildings**: Crown Spire, Weapon Shop, Armor Shop, Tavern, Healer's Hall, Material Shop, Stargate Dock, Training Ground, Gardens
- **NPCs**: 11 NPCs including 2 recruitable companions (Erynn the cat person, Pip the robot)
- **Signs**: 8 directional signs
- **Chests**: 2 lootable chests

### NPC System
```javascript
// NPC data format: [x, y, type, name, dialogueLines, shopType, recruitable]
const townNPCs = [
  [28, 16, 'townie1', 'Citizen Milo', ['Line 1', 'Line 2'], null, false],
  [7, 31, 'cat', 'Erynn "Eryx" Vexx', ['...', 'Dialogue 2'], null, true],
];
```

### Save System
- **localStorage** key: `stellar_save`
- **Auto-save on**: new game start, companion recruitment
- **Manual save**: shop transactions
- **Load**: automatic on title screen if save exists

### Input System
- **Keyboard**: WASD/Arrows (move), Z/Space (interact), X/Esc (cancel), Enter (menu)
- **Gamepad**: Left stick/D-pad (move), A (interact), B (cancel), X (inventory), Start (pause)
- **Helper function**: `getInput(scene)` returns `{ dx, dy, interact, cancel, menu, gp }`
- Uses `Phaser.Input.Keyboard.JustDown()` and `Phaser.Input.Gamepad.JustDown()` for single-press

### Rendering
- **Internal resolution**: 480×270 (16:9, SNES-era)
- **Scaling**: `Phaser.Scale.FIT` auto-scales to fill browser window
- **Pixel art**: `pixelArt: true` in config disables anti-aliasing
- **Camera**: Manual camera system in TownScene (not Phaser camera)
  - Camera follows player, clamped to map bounds
  - All sprites repositioned each frame based on camera offset

### Sprite Generation
All sprites are procedurally generated via `Phaser.Graphics`:

1. **Tile textures**: 21 tile types generated in `BootScene.create()` via `generateTileTexture()`
2. **Character textures**: 12 character sprites generated via `generateCharacterTexture()`
   - Species variants: human, cat (ears), frog (bulging eyes), dragon (horns + tail), robot (single eye + antenna)
   - Each character has unique hair, eye, skin, and outfit colors
   - 16×20 base size at 2× pixel scale = 32×40 texture

---

## Deployment

### Dev Server
```bash
cd /home/jrhol/sci-fi-princesses
bash serve.sh
```
- Serves on port 8080 (also 8090 via Tailscale)
- `serve.sh` uses `python3 -m http.server`
- `inotifywait` watches for file changes (optional)

### Tailscale Access
- **URL**: `http://omega2-1.tail62bd55.ts.net:8090`
- Tailscale serve maps port 8090 to the game server
- Accessible from any device on the tailnet

### Auto-Deploy
Currently manual refresh. The `serve.sh` script detects file changes via `inotifywait` but doesn't auto-reload the browser. Future improvement: add WebSocket-based live reload.

---

## Git History
```
146d020 v3.0: Complete Phaser 4 rewrite
4a306c3 v2.3: Fix controller input, canvas scaling, auto-save
1e9e3c1 v2.2: Fix gamepad input polling
18d0905 v2.1: Xbox controller support
c3ef334 v2.0: Modular rewrite + 1080p resolution + new content
```

---

## Known Issues & TODO

### Bugs
- Empty error message in console (Phaser 4 internal, non-blocking)
- Camera edge clamping can cause slight visual jitter at map boundaries

### Missing Features (by Step)
**Step 1 (Town)**: ✅ Complete
- Town map, NPCs, dialogue, shops, inventory, save/load all working

**Step 2 (Overworld + Plot)**: ❌ Not started
- Overworld map with zones
- Random encounter system
- Turn-based combat system
- Party management UI
- Quest system
- Narrative progression triggers

**Step 3 (Boss Battle)**: ❌ Not started
- Boss encounter system
- Boss 1: Void Sentinel Kael (designed in GDD)
- Evolution trigger after boss
- Evolution visual effects

### Future Architecture Needs
- Combat scene with ATB gauge system
- Overworld scene with zone transitions
- Cutscene/dialogue system for story progression
- Audio system (Web Audio API, chiptune)
- Particle effects system
- Animation system (currently static sprites)
