# STELLAR PRINCESSES — Technical Documentation
## v6.0-alpha.5 — Action-RPG Release Candidate

- `expedition/rng.js` provides stable 32-bit seeds and independent named streams for
  layout, terrain, ecology, encounters, loot, and cosmetic effects.
- `expedition/generator.js` creates 64×64 Lumenwild regions from an anchor graph, carves
  three-tile corridors, adds terrain only after routes are locked, places bounded habitat
  populations, and validates every required objective and safe footprint.
- `ExpeditionScene` is intentionally separate from `MapScene`: the hub retains its
  authored grid/script contracts while expeditions use frame-rate-independent continuous
  movement, manual radius collision, action resources, telegraphed ecology, and camera
  follow. Phaser physics are not enabled for this milestone.
- `actionModel.js` owns weapon timings, combos, stamina, dodge invulnerability, facing,
  three energy-spending Crown techniques, and resource regeneration as testable state transitions.
  Blade and Lance resolve spatial arcs directly; Wand primary attacks allocate from a fixed
  ten-bolt player pool and share the same seeded damage, affinity, gear, mastery, and Crown-energy
  resolution path as melee. The browser smoke test asserts an actual bolt enters the active pool.
- `runModel.js` owns the ordered relay → Gatebound → gate → Kael → shard → return
  objective contract, duplicate-safe cache rewards, checkpoints, and carried/secured loot.
- `buildChoices.js` provides deterministic three-choice level rewards; `LevelUpScene`
  applies weapon, movement, survivability, Crown, and Erynn upgrades without leaving the run.
- `fieldCompanion.js` implements the single-active-companion contract for Erynn, Brimble,
  Drakkor, and Pip with distinct command profiles, follow/flank/evade logic, ranged spacing,
  marks, area attacks, and projectile guarding. Expedition enemies carry explicit affinities;
  ranged Voidborn draw aim warnings and reuse a fixed 12-shot projectile pool. The region
  overview projects the generated anchor graph and player position without duplicating map state.
  `kaelController.js` owns Kael's phase director, breakable armor,
  telegraphs, shade/rift caps, cover-aware beam, transition, and enrage behavior.
- `RunSummaryScene` and `LeaderboardScene` present run evidence and rank by lifetime XP,
  final level, bosses, then duration. `sites/leaderboard` is a separately buildable Sites
  service with D1 persistence and ChatGPT-authenticated submissions; the game keeps a
  privacy-safe local/offline fallback.
- Accessibility settings now independently control shake, flash intensity, particle
  reduction, damage numbers, and hit stop while preserving the existing remappable input.
- `CharacterSheetScene` provides four controller-navigable pages for overview, transparent
  derived-stat formulas, rarity-colored loadout/skills, and action build/mastery/species/bond
  state. `statBreakdown()` shares the authoritative effective-stat calculation and fixes
  fractional critical-chance content so combat and presentation consistently use percent.
- Save schema 6 migrates legacy equipment strings into instance records and initializes a
  persistent Blade/Lance/Wand action arsenal. `gearProgression.js` owns +1–+10 scaling,
  deterministic affixes at +3/+6/+9, mutually exclusive material infusions, +10 Celestial
  transcendence, labels, costs, and derived stats. The Forge exposes these paths with
  material/gold previews and confirmation, and enhanced action gear changes expedition
  damage across Dark, Light, Fire, Ice, and Lightning infusions. Critical hits now use the seeded combat stream and drive
  accessible damage numbers, impact flash/shake, and bounded hit stop.
- Generator version 2 splits the basin into passive and neutral populations.
  `ecologyModel.js` owns provocation, flee/retaliate state, home-bounded wandering,
  passive sleep/gather/graze activity cycling,
  off-screen despawn, cooldown-based invisible respawn, and the 18-body active budget;
  `ExpeditionScene` reuses the original Phaser bodies rather than allocating replacements.
  Territorial detection is local, elites flank, and relay/miniboss objectives never
  repopulate. `npm run test:performance` measures the 480×270 renderer with the full
  creature budget plus 85 simultaneous reward flyouts.
- `PixelText` reuses its glyph images when content changes. Expedition feedback is bounded by
  a 32-entry damage/XP flyout pool and a 48-entry, camera-culled impact-particle pool; reduced
  particles lowers each burst before allocation. Enemy shots use 12 pooled bodies and Wand
  attacks use 10, so the stress path creates no unbounded combat feedback objects.
- The expedition HUD exposes health, stamina, Crown energy, current XP/next-level progress,
  weapon, full action controls, and active-companion cooldown at the 480×270 shipping viewport.
- The Sites score contract now requires a UUIDv4 run id, the current game version,
  bounded level/XP/mastery/duration/boss counts, a coherent Victory result, and a
  sanitized build/objective. D1 enforces per-user run uniqueness and indexes a 12/hour
  authenticated rate limit. Legacy rows migrate through a table-copy migration without
  inventing public identity. The client has explicit success, sign-in, duplicate,
  rate-limited, and offline outcomes; cross-origin static play hands the score to an
  authenticated top-level `/submit` relay while keeping local history authoritative.
- Sites access is public for leaderboard reads (`GET /api/runs`), while score writes remain
  gated by the platform-provided ChatGPT identity headers. The production probe verifies an
  anonymous 200 JSON ranking response and an unauthenticated 401 JSON submission response.
- Save schema 5 migrates existing slots with action resources, lifetime XP, mastery,
  expedition records, and local run history without discarding old fields.
- `npm run validate:expeditions` exercises 1,000 seeds for determinism, reachability,
  anchor footprints, population caps, and variation. `npm run test:expedition` drives
  movement, all three weapons, dodge, Erynn commands, ordered objectives, build selection,
  Kael phase two, Crown Shard evolution, return-state mutation, run summaries, local/shared
  leaderboard presentation, console-error capture, and screenshots in Chromium.
- `npm run validate:input` exercises every mapped standard-gamepad action, D-pad buttons,
  analog movement, and stick deadzone without accessing Phaser globals at module load time.

The application now runs at the 480×270 shipping resolution with integer CSS scaling.
Title, exploration, action combat, turn-based combat, dialogue, travel, commerce, journal,
save/options, tutorial, gallery, level-up, evolution, summary, and leaderboard layouts are
covered by the browser viewport suite and captured under `screenshots/viewport/`.

## v5.0 — Act I Vertical Slice

> The detailed v4.0 prototype inventory later in this document is retained as
> historical context. The current implementation was rebuilt in v4.5 and now uses
> the architecture below.

### Current Runtime

- 480×270 internal resolution with integer CSS scaling and crisp pixel rendering.
- Phaser 4.2.0 from the pinned CDN, loaded before the Vite-built ES module.
- Scene flow: `BootScene → TitleScene → MapScene`, with combat, dialogue, travel,
  quest journal, tutorial, evolution, shop, unified menu, options, and save/load
  overlays/workflows.
- `engine/`: versioned/checksummed save slots, persistent accessibility/settings,
  remappable keyboard/gamepad input, synth music/SFX, UI primitives, transitions,
  and the data-driven script runner.
- `art/`: authored pixel-grid actors, font, tiles, palette ramps, and texture baking.
- `game/`: persistent state plus battle, party, progression, inventory, and quest helpers.
- `data/`: 17 reachable maps, Act I story content, quests, shops, music, characters,
  skills, statuses, enemies, items, encounters, and bosses.

### Exploration and Dialogue Contract

`MapScene` owns collision, grid movement, NPC actors, interaction, map music, and
script execution. It also resolves exits after movement completes, runs idempotent
one-shot triggers, tracks discovered maps, and opens journal/travel overlays.
Script operations may show dialogue/choices/tutorials, mutate flags, quests, and map
cells, grant resources, recruit or evolve characters, launch combat/shops, move actors,
autosave, run effects, rest the party, or teleport.
While a script is active, `DialogueScene` exclusively polls input so shared
edge-triggered actions cannot be consumed twice. Persistent quest transitions reject
stage/status regression unless a caller explicitly opts in.

### Validation

Run `npm run build`, `npm run validate:sprites`, `npm run validate:maps`,
`npm run validate:nova`, `npm run validate:stargate`, and `npm run validate:act1`.
Map validation checks rectangular grids, legend coverage, unique authored IDs,
walkable arrivals, non-bouncing exits, target existence, and required reachability.
Act I validation additionally checks placements, script operations, content references,
shop inventories, quest completeness, and the single authoritative Kael battle.

---

## Project Structure

The tree and prototype notes below are retained as historical v4.0 context. The current
runtime structure is defined by `public/src/{engine,art,data,game,scenes}` and the current
scene registry in `public/src/main.js`.

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
