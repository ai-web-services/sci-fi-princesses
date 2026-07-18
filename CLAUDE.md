# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stellar Princesses is a sci-fi RPG built with **Phaser 4.2.0**, bundled by Vite, served as a static site. All art is procedural pixel art generated in code (no binary/external assets). The project is mid-rebuild from a small prototype (v4.3) into the full PRD-scoped campaign — see `goal.md` (the standing execution mandate) and `PRD.md` (authoritative spec). `PLAN.md` is the living implementation plan/traceability doc and is the best entry point for "what's the current state and what's next."

Read `PLAN.md` first to orient. `AGENTS.md` and `TECHNICAL_DOC.md` still contain useful Phaser 4 gotchas and conventions but their "Project Structure" trees describe the old v4.0 prototype (`TownScene`/`DungeonScene`/`InventoryScene`) — the structure below reflects current reality.

## Preloaded Skills

Load these from `.agents/skills/<name>/SKILL.md` before relevant work. **Always load `phaser-gamedev` first for any game code work.**

| Skill | When to Load |
|-------|-------------|
| `phaser-gamedev` | Any Phaser work — scenes, sprites, physics, input, animations. Read `references/phaser4-migration.md` too (project uses Phaser 4.2, not 3.x). |
| `playwright-testing` | Testing, visual regression, E2E, canvas/game determinism. |
| `game-design-lead` | Design orchestration — delegates to 5 specialist sub-agents below. |
| `game-designer-persona` / `level-designer-persona` / `narrative-designer-persona` / `technical-artist-persona` / `game-audio-engineer-persona` | Mechanics/GDD, level layouts, story/dialogue, shaders/VFX, audio respectively. |

## Build & Serve

```bash
npm run dev       # Vite dev server, HMR, http://127.0.0.1:5173
npm run build     # production build -> dist/ (emptyOutDir)
npm run preview   # serve dist/ on http://127.0.0.1:8090 (matches Tailscale)
```

Do **not** use the legacy `server.js` or `serve.sh` — both deprecated in favor of Vite.

### Validators

```bash
npm run validate:sprites
npm run validate:battle
npm run validate:maps
npm run validate:nova
npm run validate:stargate
npm run validate:act1
```

Additional validator scripts exist under `scripts/` but aren't yet wired into `package.json` — run directly with node, e.g. `node scripts/validate_ashfall.mjs`, `node scripts/validate_mirelight.mjs`, `node scripts/validate_data.mjs`, `node scripts/validate_portraits.mjs`, `node scripts/validate_battle_enemies.mjs`. Map validators check rectangular grids, legend coverage, unique authored IDs, walkable arrivals, non-bouncing exits, and target/reachability existence. `validate_act1.mjs` additionally checks placements, script ops, content references, shop inventories, quest completeness, and the single authoritative boss battle for that act.

There is no unit/E2E test runner wired up yet; `main.js` exposes a read-only `window.__stellarTest.snapshot()` seam (active scenes, map/position, flags, quests, roster, gold, inventory, etc.) intended for Playwright-style browser assertions per the `playwright-testing` skill.

## Architecture

### Module system
ES modules throughout (`import`/`export`). `public/index.html` loads the pinned Phaser 4.2.0 CDN script *before* the module script (order matters — Vite must not reorder this on build), then `<script type="module" src="src/main.js">`. Phaser is a CDN global, not an npm dependency. All cross-file imports use relative paths with explicit `.js` extensions.

### Directory layout (`public/src/`)
```
main.js            Phaser bootstrap: scene registry, game config, window.__stellarTest seam
config.js          Constants: GAME_W/H, tile size, etc.
scenes/            One file per Phaser Scene (see registry below)
engine/            Reusable systems independent of any one scene:
  save.js            versioned/checksummed save slots (writeSave/readSave, AUTO_SLOT)
  script.js          data-driven cutscene/interaction runner — see op reference below
  input.js           keyboard + gamepad, remappable
  audio.js           synth music/SFX
  ui.js              UI primitives
  fx.js              screen fx: fade/flash/shake
  settings.js        persistent accessibility/settings
game/              Persistent game logic over GameState:
  state.js           GameState shape, newGameState(), save/load/autosave, flag helpers
  party.js, inventory.js, quests.js, relationships.js, progression.js, battle.js
data/              Pure content/data definitions: maps/, characters, enemies, items, skills,
                   statuses, shops, quests, story/storyContent, music/musicLibrary, travel,
                   resonance, tutorials
art/               Authored procedural pixel art: palette ramps, font, tiles, actors, portraits/,
                   sprites/, battle/ (baked to textures at boot, not loaded from files)
```

### Scene registry (`main.js`)
`BootScene, TitleScene, OptionsScene, SaveLoadScene, MapScene, DialogueScene, QuestJournalScene, TravelScene, CombatScene, TutorialScene, EvolutionScene, ShopScene, MenuScene, GalleryScene`

`MapScene` is the exploration hub: collision, grid movement, NPC actors, interaction, per-map music, script execution, exit resolution after movement, idempotent one-shot triggers, discovered-map tracking, and launching journal/travel overlays. Overlay scenes (`DialogueScene`, `ShopScene`, `MenuScene`, etc.) are launched on top via `this.scene.launch('X')` + `this.scene.pause()` on the parent, and return via `this.scene.stop()` + `this.scene.get('Parent').scene.resume()`.

While a script (see below) is running, `DialogueScene` exclusively polls input so a single edge-triggered press can't be consumed twice by two scenes at once.

### GameState (`game/state.js`)
Single in-memory object (`GameState`), not the Phaser registry. Holds roster/active party, per-character `chars[id]` progression (level/xp/hp/sp/equipment/skillsKnown/evolution/build), gold, inventory (`[{id, qty}]`), `flags` (general story bools), `world` (D21 consequence-flag namespace read by dialogue/epilogue), `decisions`, `quests` (`questId -> {stage, status}`), `relationships` (`charId -> {bond, scenes, battles}`), `shards`, `novaStage`, current `map`/`x`/`y`/`dir`, and records (`bestiary`, `lore`, `tutorialsSeen`, `resonancesFound`, `mapsVisited`, `unlockedDestinations`, `trackedQuestId`, `mapChanges`). `normalizeGameState()` backfills fields for older saves — extend it, not the callers, when adding new persisted fields. Quest stage/status transitions reject regression unless a caller explicitly opts in.

### Script runner (`engine/script.js`)
Content (dialogue, quests, cutscenes) is authored as arrays of ops (`{ say }`, `{ choice }`, `{ move }`, `{ battle }`, `{ flag }`, `{ world }`, `{ bond }`, `{ give }`, `{ teleport }`, `{ quest }`, `{ recruit }`, `{ evolve }`, `{ tutorial }`, `{ shop }`, `{ rest }`, `{ autosave }`, `{ setcell }`, `{ if }`, escape-hatch `{ run }`, etc. — full list is the comment header of `engine/script.js`) run against a `MapScene` via `runScript(scene, ops, ctx)`. New narrative content should be expressed as ops, not bespoke scene code, unless the op vocabulary genuinely can't express it.

### Save system
Slot-based via `engine/save.js` (`writeSave`/`readSave`, `AUTO_SLOT` for autosave), versioned/checksummed. Autosave triggers are chosen per content (companion recruitment, quest milestones, etc.) — see `{ autosave }` script op.

## Phaser 4 conventions (see `phaser4-migration.md` for full detail)

- Procedural textures: `this.make.graphics({ add: false })` → draw → `g.generateTexture(key, w, h)` → `g.destroy()`. There is no `this.textures.generate()` in Phaser 4, and `generateTexture` needs explicit width/height.
- `Phaser.Input.Keyboard.JustDown()` / `Phaser.Input.Gamepad.JustDown()` for single-press detection.
- **Gamepad**: poll `gamepad.getPad(0)` once per frame and cache it; polling per-input-call causes stale `JustDown` state. Always null-check — the pad can be undefined.
- `Scale.NONE` for pixel art, not `Scale.FIT`; canvas scaling/pixelation handled manually via CSS/config (`render: { pixelArt: true, roundPixels: true }`).
- `Phaser.GAMES` does not exist in Phaser 4 — don't use it to detect a running instance. `main.js` instead guards against duplicate instances via `window.__stellarGame`.
- Never touch `Phaser.Input.Keyboard.KeyCodes` (or other CDN-global Phaser APIs) at module top level — the CDN script may not have executed yet when the module parses. Access lazily inside functions.
- CDN `<script>` for Phaser must load before the module script in the built HTML — verify this still holds after any `vite.config.js` or `index.html` change.

## Code style

- `PascalCase` for classes, `camelCase` for functions/variables.
- File headers use a `// ═══...` banner; section comments are single-line `// COMMENT`, not block comments.
- Numeric colors as hex literals (`0xffcc33`).

## Git workflow

Commit after each incremental change using sequential numbered version tags (e.g. v5.1, v5.2 — continue from whatever the current version is, found in `TitleScene.js`'s `VERSION` export). This enables targeted revert if a change regresses the build. Never commit a broken or partially-validated state — build + relevant validators should pass first.

## Working per `goal.md`

This repo is being driven toward full PRD completion autonomously per `goal.md`. Before non-trivial work, check `PLAN.md` for the current milestone (`M<n>`), its dependencies, and its "Verify" requirements — each milestone lists its own validation bar (specific validators, screenshot checks, save-migration checks, etc.). Update `PLAN.md` when decisions or scope change; it is the durable source of truth across sessions, not this file.
