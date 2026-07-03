# Stellar Princesses — Implementation Plan & PRD Traceability

**Status:** Living document. Updated at every milestone. This is the durable state for the
full-vision build effort defined in `goal.md` against `PRD.md`.

---

## 1. Baseline Audit: Prototype vs PRD (2026-07-02, v4.3)

The repo at v4.3 contains a ~1,900-line Phaser 4.2 prototype:

| Area | Current state | PRD requirement | Verdict |
|---|---|---|---|
| Campaign | One town, one 8-room dungeon, 1 flat boss flag | Full arc: Fall → Gathering → Complication → Fracture → Reckoning → Decision → Epilogue (§6.3) | **Rebuild** |
| Companions | Erynn + Pip recruitable via single dialogue; no arcs/quests/evolutions | 4 companions with intros, personal quests, relationships, evolutions, endings (§7.2–7.4) | **Rebuild** |
| World | 60×40 town map, 30×20 dungeon | Multiple distinct regions + changing Nova Prime + final threshold (§8) | **Rebuild** |
| Combat | Minimal turn-based menu (Attack/Skill/Item/Flee), no statuses/weakness/synergy/phases | Strategic party combat: synergy, weaknesses, statuses, multi-phase bosses, scan, swap (§10) | **Rebuild** |
| Progression | XP/level + flat item stats | Evolutions, buildcraft, equipment identity, crafting, economy (§11) | **Rebuild** |
| Art | Procedural rect-primitive sprites/tiles at 480×270 | Premium hi-res 2D pixel art, FF4 grammar, 2026 remaster; explicit exclusion of "raw procedural primitives" (§17) | **Rebuild** |
| Audio | Basic Web Audio oscillator BGM/SFX | Regional themes, motifs, escalation, signature SFX (§18) | **Extend heavily** |
| Save | Single localStorage key, save on few events | Slots, autosave+manual, corruption protection, reorientation (§19) | **Rebuild** |
| UI/UX | Fixed-keys, no settings, no journal/map/records | Full views list (§14.2), onboarding, remapping, accessibility (§14–16) | **Rebuild** |
| Infra | Vite + Phaser 4 CDN, ES modules, WSL dev, integer-scaled canvas | Stable, offline-capable, performant (§21) | **Keep** |

**Decision:** retain the toolchain (Vite, Phaser 4.2 CDN, ES modules, pixel-perfect canvas
scaling, WSL serving), rewrite the game itself on a data-driven architecture.

## 2. Product Decisions (resolving PRD §25 open questions)

Recorded here per goal execution rule 3. Decisions favor coherence and keep future options open.

- **D1 Resolution/presentation:** 640×360 internal, 16px tiles, integer scaling (×3 = 1080p),
  widescreen-composed. Exploration sprites 32×40 hi-detail pixel art; combat sprites larger
  (≈48×64); portraits ≈80×96 authored pixel art; bosses largest. Detail hierarchy per §17.3.
- **D2 Art pipeline:** authored procedural pixel art — pixel-string grids + palette ramps +
  hue-shifted shading + selective dithering + outline rules, generated to textures at boot.
  No smoothing, no primitives-as-final-art. All art authored in code (offline, no binary assets),
  which also keeps the game fully self-contained.
- **D3 World structure:** hub-and-spoke — Nova Prime hub + Stargate network to regions;
  region unlock via story; fast travel via Stargate once a region's gate is restored.
- **D4 Regions (6):** Nova Prime (capital, changing hub) · Shattered Stargate (Act 1 dungeon) ·
  Mirelight Deeps (drowned Anura world) · Ashfall Dominion (Drakonid ash realm) ·
  Kessari Reach (Felidae trade colony) · The Silent Archive (Construct ruins) ·
  Void Threshold (final frontier where reality fails).
- **D5 Shards (6):** each shard = story event + Lyra power stage + a distinct "memory of the
  Crown" revealing its origin piecemeal. Shards: Gate, Tide, Ember, Whisper, Logic, Throne.
- **D6 Crown truth:** the Crown is a Voidborn artifact — a "wound-seal" forged by the first
  sovereign from a captured Void intelligence; the Sovereignty's protection was extraction.
  The Voidborn incursion is the sealed intelligence's fragments seeking reunion. Corruption is
  communication without consent; it can be healed where a mind remains. This grounds the
  Complication and the final Decision.
- **D7 Endings:** one final choice with four resolutions — **Restore** (rebuild the Crown as it
  was), **Reform** (rule with the Crown, changed covenant), **Share** (dissolve authority into a
  council of cultures), **Release** (free the Void intelligence, end the Crown). Epilogue is
  modular: ending choice × companion arc states × regional outcomes × Nova Prime growth.
- **D8 Combat model:** deliberate turn-based with visible timeline (speed-ordered ticks);
  actions: Attack, Skill (SP), Defend, Item, Swap, Scan. Party of 3 active + reserve (reserve
  gains XP, can be swapped in-battle). Resonance: paired-element/skill-tag combos discovered in
  play and recorded. Boss phases scripted with telegraphs. Difficulty: Story/Adventurer/Veteran
  presets + modular assists, adjustable anytime.
- **D9 Relationships:** bond levels driven by story beats, banter choices, personal quests,
  battle participation; expressed via scenes, resonance bonuses, epilogue variants. Friendship
  focus; no romance in base campaign (respects §7.4 constraints; leaves space open).
- **D10 Save:** 3 manual slots + rotating autosave slot; versioned schema with migration;
  checksummed writes with fallback copy. localStorage.
- **D11 Music:** procedural-synth compositions (Web Audio) with authored note sequences —
  motif system (Crown theme, Lyra theme, Void theme) reused across regional/boss tracks.
- **D12 Text-only voice** (no VO); all meaning in text with speaker portraits.
- **D13 Sequential versions** continue v4.4, v4.5, … per repo convention.

## 3. Milestones (vertical slices)

| # | Milestone | Target PRD sections | Status |
|---|---|---|---|
| M0 | Audit + this plan | §goal rules 1–3 | **done** |
| M1 | Engine foundation: save/settings/input/audio/UI kit/art pipeline, Title+Options+SaveLoad | §14–16, §17.2–17.3, §19 | **done (v4.5)** |
| M2 | Exploration core: MapScene, dialogue/cutscenes, quests/journal, travel | §8.6, §9, §12.1, §14.4 | **done (v4.7)** |
| M3 | Combat core: timeline, skills, statuses, weaknesses, resonance, boss framework | §10 | **done (v4.8)** |
| M4 | Act 1 slice: prologue, Nova Prime, tutorial, Pip+Erynn, Stargate dungeon, Kael, Shard 1, Evolution 1 | §6.3 (Fall/First Claim), §13, §14.3 | pending |
| M5 | Mirelight Deeps + Brimble + relationship/companion-quest systems + Drowned Matriarch | §7.2–7.4, §8.4 | pending |
| M6 | Ashfall Dominion + Drakkor + Ash Tyrant Ignis | §8.4, §10.8 | pending |
| M7 | Kessari Reach + Erynn arc + Shard 4 | §7.3, §8.4 | pending |
| M8 | The Silent Archive + Pip arc + Crown revelation | §6.3 (Complication), §8.3 | pending |
| M9 | Act 3: Fracture, Void Threshold, final boss, Decision, endings + epilogues | §6.3, §6.5, §12.4 | pending |
| M10 | Companion evolutions + personal quest completion + Nova Prime growth stages | §11.3, §13.1, §17.10 | pending |
| M11 | Accessibility/difficulty/onboarding/records completeness | §14.3, §16, §14.2 | pending |
| M12 | Presentation polish: themes/motifs, VFX, cinematics, environmental animation | §17.6–17.11, §18 | pending |
| M13 | Full validation + PRD compliance audit (evidence per §26 criterion) | §21, §22, §26 | pending |

Milestone order may interleave; each commit is a verified, playable state.

## 4. Architecture (target)

```
public/src/
├── main.js                  # bootstrap, scene registry
├── config.js                # resolution, tile size, constants
├── engine/                  # game-agnostic systems
│   ├── save.js              # slots, autosave, migration, checksum
│   ├── settings.js          # options + accessibility + difficulty store
│   ├── input.js             # remappable kb+gamepad action mapping
│   ├── audio/               # synth engine, song player, sfx, motifs
│   ├── ui.js                # window frames, menus, focus, text, portraits
│   └── fx.js                # screen fx, particles, transitions (accessible)
├── art/                     # pixel-art pipeline
│   ├── palette.js           # ramps, hue-shift shading
│   ├── pixelfont? (bitmap text via Phaser text w/ crisp font)
│   ├── sprites/             # authored pixel-string character sheets
│   ├── tiles/               # tile renderers per region tileset
│   ├── portraits/           # authored portrait art + expressions
│   └── vfx.js               # combat/spell effect art
├── data/                    # all content, data-driven
│   ├── characters.js  skills.js  enemies.js  items.js  shops.js
│   ├── quests.js  dialogue/  maps/  regions.js  bosses.js  endings.js
├── game/                    # state
│   ├── state.js             # runtime GameState, flags, party, inventory
│   ├── party.js  progression.js  relationships.js  economy.js
└── scenes/
    ├── BootScene TitleScene OptionsScene SaveLoadScene
    ├── MapScene (generic exploration) CutsceneScene DialogueScene
    ├── CombatScene EvolutionScene
    ├── MenuScene (party/equip/items/quests/records/map)
    ├── ShopScene EndingScene CreditsScene
```

## 5. Verification protocol (per increment)

1. `npm run build` must succeed (WSL).
2. Boot smoke test in browser (dev server or preview) — console clean.
3. Playwright/scripted checks where available (`.agents/skills/playwright-testing`).
4. Visual inspection of representative screens (screenshots).
5. Save→load round-trip when schema changes (with migration).
6. Commit `vX.Y: <summary>` only after the above pass.

## 6. Progress log

- **2026-07-02** — M0 complete: audit + plan written (this file). Next: M1.
- **2026-07-02 — v4.5 / M1 complete:** Replaced the prototype foundation with a
  640×360 Phaser 4 shell providing versioned/checksummed save slots and autosave
  fallback, persistent settings, remappable keyboard/gamepad actions, synth audio,
  reusable UI/focus primitives, and the authored pixel-art/font/tile/actor pipeline.
  Production build and browser smoke/visual checks passed. M2 started next.
- **2026-07-02 — v4.6 / M2 in progress:** Added authored companion and Nova Prime
  NPC actor sheets, map NPC collision/interaction, a data-driven script runner for
  dialogue, choices, movement, state mutations, rewards, recruitment, quest updates,
  and transitions, plus the dialogue overlay and persistent party/inventory/quest
  helpers. Added the first Nova Prime conversation and leadership choice as an
  exploration-system proof. Production build and sprite-schema validation passed.
  Headless browser validation confirmed title-to-map startup, collision-based
  movement, dialogue advancement, choice selection, clean overlay shutdown, and a
  console-clean runtime; the representative choice screen was visually inspected.
- **2026-07-02 — v4.7 / M2 complete:** Completed the exploration foundation with
  validated map exits, one-shot arrival triggers, discovered-map tracking, safe
  destination-state commits, autosave reorientation, the Stargate destination
  interface, and an active/completed quest journal. Added the authored Starfall
  Plaza → Stargate Dock → Shattered Gate loop and a four-stage leadership quest
  that changes the relay state. Schema v2 migrates v4.6 saves without losing
  progress. Map/sprite validators, production build, save migration/corruption
  fallback checks, and a browser playthrough through quest completion passed with
  no console errors; journal, travel, and arrival screens were visually inspected.
- **2026-07-03 — v4.8 \ M3 complete:** Combat core delivered: CTB turn timeline with
  preview strip, FF4-style side-view CombatScene (command/skill/item/swap/target menus,
  gauges, floating damage, element bursts, boss-phase banners), pure-logic battle engine
  (weakness/resist/immune, crits, statuses, buffs, shields, thorns, resonance combos with
  discovery records, enemy AI profiles, boss phases, difficulty modifiers, flee/defend/swap,
  rewards with XP curve + level-up skill learning), random-encounter + scripted-battle
  wiring, defeat recovery menu. Parallel-authored content landed: characters/enemies/items
  data (validated), hero battle poses, 19 enemy battle sprites, 25 portrait expressions,
  15-song music library. Build + all validators + browser battle playtest passed.
  Polish backlog: Erynn/Drakkor/Lyra portrait faces, Kael sprite shading.
