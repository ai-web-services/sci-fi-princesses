# AGENTS.md — Stellar Princesses

**READ THIS FIRST** before doing any work in this project.

## Project Overview

Stellar Princesses is a sci-fi RPG built with **Phaser 4.2.0**, built with Vite and served as a static site. All art is procedural (no external assets). The game features turn-based combat, party management, NPC dialogue, shops, and an 8-room dungeon.

## Preloaded Skills

The following skills in `.agents/skills/` must be loaded before doing relevant work. **Always load `phaser-gamedev` first** for any game code work.

| Skill | Path | When to Load |
|-------|------|-------------|
| `phaser-gamedev` | `.agents/skills/phaser-gamedev/SKILL.md` | Any Phaser work — scenes, sprites, physics, tilemaps, input, animations. Has 6 reference files. |
| `playwright-testing` | `.agents/skills/playwright-testing/SKILL.md` | Testing, visual regression, E2E. Has 3 reference files + 2 scripts. |
| `game-design-lead` | `.agents/skills/game-design-lead/SKILL.md` | Design orchestration — delegates to 5 specialist sub-agents. Has 4 reference files + 1 template. |
| `game-designer-persona` | `.agents/skills/game-designer-persona/SKILL.md` | Mechanics, GDD, gameplay loops, economy balancing. |
| `level-designer-persona` | `.agents/skills/level-designer-persona/SKILL.md` | Level layouts, encounters, pacing. |
| `narrative-designer-persona` | `.agents/skills/narrative-designer-persona/SKILL.md` | Story, dialogue, characters, lore. |
| `technical-artist-persona` | `.agents/skills/technical-artist-persona/SKILL.md` | Shaders, VFX, performance budgets. |
| `game-audio-engineer-persona` | `.agents/skills/game-audio-engineer-persona/SKILL.md` | Sound, music, audio systems. |

### Skill Reference Files (phaser-gamedev)

Read these from `.agents/skills/phaser-gamedev/references/` before the relevant work:

| Reference | When to Read |
|-----------|-------------|
| `phaser4-migration.md` | Always — project uses Phaser 4.2.0, not 3.x |
| `core-patterns.md` | Scenes, objects, input, animations, asset loading |
| `arcade-physics.md` | Physics tuning, groups, pooling (not used currently but good reference) |
| `performance.md` | Object pooling, culling, update loop optimization |
| `spritesheets-nineslice.md` | Loading any spritesheet or building 9-slice UI |
| `tilemaps.md` | Tiled tilemaps, collision layers (currently procedural, may change) |

### Skill Reference Files (game-design-lead)

| Reference | When to Read |
|-----------|-------------|
| `phaser4-input-patterns.md` | Keyboard/gamepad input, JustDown timing, gamepad polling |
| `phaser4-sprite-patterns.md` | Procedural sprite generation, animation, sound, resolution |
| `node-dev-server.md` | Node.js dev server with live reload |
| `setup-pitfalls.md` | Binding to Telegram topic, config troubleshooting |
| `wsl-server-hosting.md` | WSL server hosting and Tailscale configuration |

## Project Structure

```
sci-fi-princesses/
├── AGENTS.md                      # This file — read first
├── GAME_DESIGN_DOC.md             # Full GDD (narrative, characters, systems)
├── TECHNICAL_DOC.md               # Architecture & implementation notes
├── package.json                   # npm run dev|build|preview
├── vite.config.js                 # Vite config (root: public/, base: ./)
├── server.js                      # Legacy Node server (deprecated)
├── serve.sh                       # Legacy dev server script (deprecated)
├── public/                        # Game source (Vite root)
│   ├── index.html                 # Entry: loads Phaser 4 CDN + import main.js
│   ├── test.html                  # Test harness page
│   └── src/
│       ├── main.js                # Phaser bootstrap, scene list, game config
│       ├── config.js              # Constants: TILE, MAP_W/H, GAME_W/H, COLORS, T (tile types)
│       ├── gameData.js            # GameData state object, gameSave/gameLoad/gameHasSave
│       ├── input.js               # getInput(), updateControllerStatus() — keyboard + gamepad
│       ├── audio.js               # AudioSys — Web Audio API BGM + SFX
│       ├── sprites.js             # generateCharacterTexture() — procedural pixel art
│       ├── textures.js            # generateTileTexture(), generateAllTextures(), getTileKey()
│       ├── townMap.js             # createTownMap(), townNPCs, townSigns, townChests, isTownSolid()
│       └── scenes/
│           ├── BootScene.js       # Texture/sprite generation, init audio
│           ├── TitleScene.js      # Title screen, new game/continue/settings
│           ├── TownScene.js       # Overworld: movement, NPCs, shops, dungeon entry
│           ├── DialogueScene.js   # Overlay: typewriter text, recruit choices
│           ├── ShopScene.js       # Overlay: buy/sell/upgrade/heal
│           ├── InventoryScene.js  # Overlay: party management, equip, items
│           ├── CombatScene.js     # Turn-based battle system
│           └── DungeonScene.js    # 8-room dungeon with enemies and combat
├── .agents/skills/                # Preloaded skills (see table above)
│   ├── phaser-gamedev/
│   ├── playwright-testing/
│   ├── game-design-lead/
│   ├── game-designer-persona/
│   ├── level-designer-persona/
│   ├── narrative-designer-persona/
│   ├── technical-artist-persona/
│   └── game-audio-engineer-persona/
├── screenshots/                   # F9 screenshot captures
└── dist/                          # Vite build output (gitignored)
```

## Key Conventions

### Module System
- All game code uses **ES modules** (`import`/`export`)
- `index.html` loads via `<script type="module">` → `src/main.js`
- Phaser 4 loaded from CDN in `index.html` (not bundled by Vite)
- All cross-file imports use relative paths with `.js` extension

### Phaser 4 Patterns
- Read `.agents/skills/phaser-gamedev/references/phaser4-migration.md` for API differences from Phaser 3
- `this.make.graphics({ x, y, add: false })` + `g.generateTexture(key, w, h)` + `g.destroy()` for procedural textures
- `this.scene.launch('Scene')` + `this.scene.pause()` for overlay scenes
- Overlay scenes call `this.scene.stop()` + `this.scene.get('Parent').scene.resume()` to return
- `Phaser.Input.Keyboard.JustDown()` and `Phaser.Input.Gamepad.JustDown()` for single-press input
- **Gamepad bug fix**: Poll gamepad ONCE per frame (cache), not in every input call. Clear `GpButtons[idx]` every frame or `JustDown` only fires once.
- `Scale.NONE` for pixel art (not `Scale.FIT`), handle canvas scaling manually via CSS
- **Phaser 4 does NOT have `Phaser.GAMES`** — game instances are not tracked globally. Don't use `Phaser.GAMES.length` to check if game is running.
- **CDN loading order**: Phaser CDN `<script>` MUST come before the game module `<script>` in HTML. Vite moves module scripts to `<head>` during build — the CDN script must also be in `<head>` before the module.
- **Top-level Phaser access**: Never access `Phaser.Input.Keyboard.KeyCodes` at module top level — the CDN may not have loaded yet when the module parses. Use lazy access via functions (see `input.js` `KC()` helper).

### Scene Architecture
- `BootScene → TitleScene → MapScene` preserves the authored hub/story path.
- `TravelScene → ExpeditionScene` provides the continuous-action Lumenwild run, with `LevelUpScene`, `CharacterSheetScene`, `RunSummaryScene`, and `LeaderboardScene` supporting progression and results.
- Dialogue, shops, forge, inventory/party field menu, quest journal, options, saves, evolution, gallery, and legacy combat remain separate overlay/workflow scenes.
- No Arcade/Matter physics used — manual tile-based collision via `isTownSolid()` / `isDungeonSolid()`
- Camera: manual repositioning each frame (not Phaser camera system)
- Tile-based maps: 16px tiles, 60×40 town map, 30×20 dungeon map

### Game State
- Single global `GameData` object in `gameData.js` (not Phaser registry)
- localStorage save/load: key `stellar_save`
- Save on: new game start, companion recruitment, shop transactions

### Code Style
- Match existing patterns: `PascalCase` for classes, `camelCase` for functions/variables
- File headers use `// ═══` banner format
- Numeric colors as hex: `0xffcc33`
- No block comments for section headers — use `// COMMENT` style

## Build & Serve

```bash
# Dev server with HMR (port 5173)
npm run dev

# Production build → dist/
npm run build

# Preview build locally (port 8090, matches Tailscale)
npm run preview
```

The `npm run preview` command serves the built `dist/` folder on port 8090, accessible via Tailscale at `http://omega2-1.tail62bd55.ts.net:8090`.

**Do NOT use the legacy `server.js` or `serve.sh`** — use Vite instead.

## Git Workflow

Commit after each incremental change with numbered version tags (v4.1, v4.2, etc.). This enables targeted revert if new features break the build.

## Agency Agents Persona Library

The project references `~/agency-agents/` which contains ~220 agent personas across 17 divisions. The game-development division has the 5 specialist personas used by the `game-design-lead` skill.

## Current Version

See the version string in `TitleScene.js`. Current action vertical-slice milestone:
`v6.0-alpha.5`. Bump when making changes.

## Known Issues

- `CombatScene` enemy sprites drawn via `this.add.graphics()` (not textured sprites)
- Some legacy companion battle sheets still use gap-fill poses for windup, signature, critical, defend, and item-use animations.
- The main worktree includes pre-existing uncommitted art and content changes; preserve them when preparing the v6 release commit.
