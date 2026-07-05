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
| M4 | Act 1 slice: prologue, Nova Prime, tutorial, Pip+Erynn, Stargate dungeon, Kael, Shard 1, Evolution 1 | §6.3 (Fall/First Claim), §13, §14.3 | **done (v5.0)** |
| M5 | Mirelight Deeps + Brimble + relationship/companion-quest systems + Drowned Matriarch | §7.2–7.4, §8.4 | **done (v5.1)** |
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
- **2026-07-03 — v4.9 \ M4 infra + HANDOFF:** Added interior tiles (wood floor, carpet,
  inner walls, shelf/bed/table/stool) and the full Shattered Stargate tileset (void floor/
  walls/pits, crystals, debris, bridge, console, pedestal, barrier, ring chunks); exported
  NOVA_LEGEND + STARGATE_LEGEND; MAPS registry now merges region files
  (data/maps/nova.js, data/maps/stargate.js — currently authored-comment skeletons).
  Build + boot verified.
- **2026-07-03 — v5.0 / M4 complete:** Delivered the complete Act I vertical slice:
  Crownfall prologue, Nova Prime districts and services, contextual tutorials, Pip and
  Erynn recruitment, the multi-map Shattered Stargate dungeon and persistent barrier
  puzzle, Commander Kael confrontation, Gate Shard claim, Lyra's Crown Bearer evolution,
  and Nova debrief. Added the unified party/equipment/items/records menu, buy/sell shops,
  healer and tavern services, story-content merging, persistent map mutations, and save
  schema v3. All content validators and production build passed. Browser checks covered
  the complete story-state progression, recruit/overlay handoffs, shop transaction,
  evolution, menu flow, and map-mutation save/reload with a clean console.
- **2026-07-05 — v5.1 / M5 complete:** Delivered Mirelight Deeps and its
  supporting systems. New engine-level systems: a bond system (`game/
  relationships.js`, stages Stranger→Kindred, battle-participation
  milestone, Records "Bonds" panel), the `state.world` consequence-flag
  namespace (D21) with `{world}`/`{bond}`/`{unlock}` script ops, a
  telegraphed-attack mechanic in the battle engine (announce → countdown
  → resolve, reusable for future boss mechanics), and a boss "Talk"
  combat command driven by a data-only `mercy` clause on enemy defs.
  Content: the 5-map Mirelight region (drowned marsh tileset, tide-lever
  flood-drain puzzle, Brimble's homestead), the `q_mirelight_tide` main
  quest and `q_brimble_return` companion quest (homecoming bond beat,
  grief/keep-or-release scene), the Drowned Matriarch boss with both a
  kill and a nonlethal-mercy resolution (each claiming the Tide Shard and
  playing a Crown-memory cutscene), Lyra's Tide power bump, and a
  `mire_goods` shop. Save schema v4 (world/relationship migration from
  v3). All validators (including new `validate_mirelight.mjs`) and the
  production build passed. A live browser session drove the full loop
  end to end via the module-level test seam (arrival → village → bond
  gate → puzzle → grief choice → boss → both mercy-branch and telegraph
  logic verified directly) plus save/load and v3→v4 migration checks,
  all with a clean console.

## 7. M4 Handoff — completed in v5.0

The M4 slice was decomposed across parallel content authors and an integrating session.
The contracts below are retained as implementation history; all listed work is complete.

**Agent-ownable (new files only, validate with a node script in scripts/):**
1. `public/src/data/maps/nova.js` — flesh out NOVA_MAPS: nova_market, nova_residential, nova_palace,
   nova_tavern, nova_shop_weapons/armor/materials, nova_healers_hall, nova_gardens.
   Use NOVA_LEGEND chars only; follow nova_plaza's def shape (equal-width grid rows, spawn,
   music, npcs/exits/interactions/triggers). Ambient NPCs only (story NPCs handled separately).
   Exits must link back to nova_plaza edges (agree ids with integrator).
2. `public/src/data/maps/stargate.js` — flesh out STARGATE_MAPS: gate_approach, gate_hall_west,
   gate_hall_east, gate_depths, gate_heart. STARGATE_LEGEND chars; encounters blocks
   (groups from: voidling, shade, corrupted_sentry, void_maw, gate_wisp, shard_golem;
   backdrop 'stargate'); barrier/console puzzle (needs MapScene.setCell — integrator);
   boss trigger at gate_heart: battle op {enemies:['kael'], isBoss:true, canFlee:false}.
3. `public/src/data/act1.js` — Act 1 story: prologue cutscene (Crownfall attack on Nova Prime),
   quest chain (q_fall_aftershock exists in maps.js/quests.js — extend), Pip recruitment
   (found damaged at Stargate Dock), Erynn recruitment (met at gate_approach), Kael defeat →
   Shard of the Gate → Lyra Evolution 1 (Crown Bearer), Nova Prime reaction scenes.
   Export shape: { npcsByMap, triggersByMap, interactionsByMap, quests } — integrator wires
   a storyContent.js merge into MapScene.
**Integrator-owned (shared files):**
4. MapScene: merge story npcs/triggers/interactions from data/storyContent.js; add
   setCell(x,y,ch) (tile overlay image + solidity update) and script op {setcell}.
5. ShopScene (buy/sell vs data/shops.js — to author) + script op {shop:'weapons'}.
6. MenuScene (party/equip/use-items/records/save/options) reachable from MapScene menu key
   (currently menu key opens QuestJournalScene — rewire journal inside MenuScene).
7. EvolutionScene (bespoke transformation presentation; uses progression.evolve()).
8. Tutorial prompts (engine/tutorial.js, one-time contextual windows, reviewable).
9. End-to-end Act 1 playtest → commit v5.0. **Complete.**

**Polish backlog (M12):** Erynn/Drakkor/Lyra portrait faces; Kael battle sprite shading;
inlay tile could still read busy in long paths; victory panel layout.

---

## 8. Design decisions D14–D24 (Game Design Lead, 2026-07-05)

These resolve everything M5–M13 needs. They are binding unless PLAN.md is amended.

- **D14 Shard→region mapping:** Gate = Shattered Stargate (claimed, v5.0) · Tide = Mirelight
  Deeps · Ember = Ashfall Dominion · Whisper = Kessari Reach · Logic = The Silent Archive ·
  Throne = Void Threshold (final). Each shard claim plays a "memory of the Crown" cutscene
  (D5/D6 canon): Tide = the first sovereign finding the Void wound; Ember = the forging;
  Whisper = the captured intelligence's voice; Logic = the Constructs' role as jailers;
  Throne = the extraction covenant revealed in full (triggers the Fracture).
- **D15 Bond system:** per-companion bond integer 0–4 stored in `state.bonds`. Sources:
  scripted story beats (+1 at fixed points), banter choices (some choices +1, never −),
  personal-quest stage completion (+1 each), and a battle-participation counter that converts
  to +1 once per game at 25 battles. No gift grinding. Bond is *visible* in Records as a
  named stage (Stranger/Ally/Friend/Trusted/Kindred), never a raw number (PRD §7.4). Gates:
  bond ≥2 unlocks personal quest stage 2; bond ≥3 unlocks stage 3 (the decisive trial +
  evolution). Bond ≥3 also unlocks that companion's unique resonance pair with Lyra.
- **D16 Companion quest template (all four):** 3 stages. **S1 Wound** — a Nova Prime or
  regional scene surfaces the companion's history (unlocked on recruitment + first region
  visit). **S2 Return** — a dedicated quest map in their home region confronting the past
  (unlocked bond ≥2 + region cleared). **S3 Trial** — a scripted decisive battle/choice that
  tests their stated belief (bond ≥3 + Act 2 complete for Erynn/Pip; region climax for
  Brimble/Drakkor). S3 ends with the companion evolution and sets an arc-state flag
  `arc_<name>: 'resolved'|'transformed'` consumed by epilogues (D7).
- **D17 Companion evolutions:** Erynn → **Phantom Queen** (evasion → guaranteed-crit ripostes,
  new skill `queens_gambit`), Brimble → **Leviathan Sovereign** (shields scale into party-wide
  regen, new skill `sovereign_tide`), Drakkor → **Elder Wyrm** (breaks apply `molten` DoT, new
  skill `extinction_flare`), Pip → **Omega Core** (revive once per battle passively, new skill
  `genesis_loop`). Each is an EvolutionScene presentation + new battle sprite pose + stat/skill
  changes in characters.js. Lyra: Crown Bearer (done) → **Starforged** after Shard 4 (Whisper)
  → **Celestial Ascendant** at the Void Threshold gate (Act 3 opener).
- **D18 New enemy rosters** (ids to add in enemies.js; reuse stat/AI schema):
  Kessari: `dust_stalker, gutter_blade, smuggler_enforcer, void_hound, silk_assassin`;
  Archive: `custodian_drone, logic_wraith, data_specter, failed_prototype, archive_titan`;
  Void Threshold: `null_walker, void_choir, unmade_knight, entropy_bloom, crown_echo`.
  Each region set teaches one lesson (PRD §10.7): Kessari = evasion/debuffs, Archive =
  shields/scan-dependency, Void = status immunity + resonance-mandatory HP pools.
- **D19 Remaining bosses:** M5 **Drowned Matriarch** (`matriarch`, exists): 2 phases; P1
  summons `drowned_one` adds, P2 "Undertow" arena flood telegraphed 2 ticks ahead (Defend or
  Brimble `tidal_shield` negates); nonlethal resolution — reduce to ≤25% HP with Brimble alive
  and a Talk prompt offers mercy (sets `mirelight_mercy`). M6 **Ash Tyrant Ignis** (`ignis`,
  exists): 3 phases; armor `sunder`-breakable, P3 enrage countdown answered by Drakkor
  `wyrms_roar`. M7 **Silk Baroness Vess** (new `vess`): duel-opening (Erynn solo 3 ticks),
  clone decoys dispelled by `scan`. M8 **Archivist Prime** (new `archivist_prime`): rotating
  elemental firewall (weakness cycles each phase, Scan reveals), mid-fight Crown-revelation
  dialogue interleave. M9 final: **The Unbound Crown** (new `unbound_crown`), 3 phases —
  P1 Crown Sovereign (mirror of Lyra's skills), P2 Void Amalgam (uses defeated-boss echoes),
  P3 The Wound (survival + dialogue; the four ending choices are made *inside* P3).
- **D20 Nova Prime growth stages:** `state.novaStage` 0–3. Stage 1 after M5 (Anura refugees:
  gardens rebuilt, healer upgraded), stage 2 after M7 (Kessari trade: market expands, **Forge**
  crafting service opens), stage 3 after M8 (Construct engineers: palace + stargate plaza
  restored, `nova_restored` music). Implementation: per-stage map-mutation lists + NPC adds
  on the existing persistent-mutation system; ambient dialogue variants keyed on novaStage.
- **D21 Consequence flags:** single namespace `state.world` (string→value) written by regional
  climaxes (`mirelight_mercy`, `ashfall_heir`, `kessari_verdict`, `archive_fate`), arc states
  (D16), and the ending. All dialogue/epilogue variation reads only these flags — no derived
  inference — so authors can grep every consumer.
- **D22 Crafting (Forge):** unlocks Nova stage 2. Recipes = `data/recipes.js`; consume regional
  materials (already dropping as items) → produce top-tier equipment and each companion's
  signature relic. No RNG, no farming walls: every recipe's materials are guaranteed drops
  from named encounters listed in the recipe description.
- **D23 Act 3 structure (M9):** Throne memory at the Archive triggers the **Fracture** — a
  Nova Prime crisis scene where each companion challenges Lyra (content varies by bond/arc
  flags), one leaves temporarily (lowest-bond companion; returns at the gate). Void Threshold
  region: 3 maps (Failing Fields → Choir Spire → The Wound) with reality-glitch tiles (damage
  floor unless Celestial Ascendant), no shops — preparation pressure per PRD §6.3. Final boss
  per D19; ending choice per D7; epilogue = EndingScene slideshow assembled from D21 flags
  (ending × 4 arc states × 4 regional flags × novaStage) + CreditsScene.
- **D24 Difficulty/assist completeness (M11):** assists (toggleable anytime, Options →
  Assists): battle speed ×1.5, auto-guard at low HP, encounter-rate −50%, damage-taken −25%,
  retry-with-full-HP on defeat. After 3 defeats to the same boss, a non-shaming assist prompt
  appears once. Accessibility: text-size step, reduced-flash mode (fx.js already gated),
  hold-to-confirm off, colorblind-safe weakness icons (shape + color).

## 9. Milestone handoff specs (M5–M13)

Execution rules for every milestone: work from these specs without re-deriving design;
follow §4 architecture and §5 verification; content authors own **new files only** and must
pass `scripts/` validators; the integrator owns shared files (MapScene, state.js, MenuScene,
etc.); commit `vX.Y` per D13 only after verification passes; append a §6 progress-log entry
and mark the milestone row in §3. Parallel-author pattern: same as M4 (map file + story file
+ art/music additions can run concurrently; integrator merges).

### M5 — Mirelight Deeps (target v5.1–v5.2)

Systems (integrator, build first — every later milestone reuses them):
1. **Bond system** (`game/relationships.js`): D15 exactly — `getBond/addBond`, stage names,
   battle-participation counter hooked into CombatScene rewards; Records panel row per
   companion. Save schema v4 (migrate: default bonds from recruitment flags).
2. **Companion-quest framework**: quests.js entries with `personal: '<charId>'` + unlock
   predicates over bond/flags; journal groups them under "Companions".
3. **World flags**: `state.world` (D21) + script ops `{world:{key:val}}` and conditional
   script blocks keyed on world flags (extend the existing script runner's condition support).

Content (agent-ownable):
4. `data/maps/mirelight.js` — 5 maps: `mire_landing` (arrival, safe), `mire_shallows`
   (encounters), `mire_village` (Anura survivors, shop+healer variants), `mire_deeps`
   (dungeon: tide-gate puzzle — pull 3 tide levers to drain path, uses setCell), `mire_throne`
   (Matriarch arena). New tileset `art/tiles/` mirelight legend: water/deepwater/lilypad/
   reed/mud/coral/tide-lever/drowned-ruin chars. Encounters: mire_croaker, drowned_one,
   bog_lurker, tide_witch, coral_crab, void_eel (all exist). Music: `mirelight` (exists).
5. `data/act2_mirelight.js` — story: arrival scene, village plight (void tide rising),
   Brimble homecoming (bond +1 beat), quest chain `q_mirelight_tide` (4 stages: reach village
   → scout deeps → open tide gates → face Matriarch), Matriarch mercy/kill branch writing
   `world.mirelight_mercy`, Tide Shard claim + Crown memory cutscene, Nova debrief +
   novaStage 1 mutation list. Brimble S1 scene (D16) in the village.
6. Brimble personal quest S2 (`q_brimble_return`): his drowned homestead map corner in
   mire_deeps, a grief scene with a keep/release choice for a family relic.

Integrator: Matriarch boss per D19 (Talk prompt = new combat command appearing only when
mercy conditions met), novaStage mutation applier, Shard 2 → Lyra power bump (no evolution).
Verify: full region playthrough both Matriarch branches, bond gates, save v4 migration.

### M6 — Ashfall Dominion (target v5.3)

Content: `data/maps/ashfall.js` — 5 maps (`ash_gate`, `ash_wastes`, `ash_hold` village of
last Drakonids, `ash_caldera` dungeon with heat hazard: standing on ember tiles ticks HP
unless moving, cooled by `setCell` vents puzzle, `ash_throne` arena). Enemies exist
(ember_hound, ash_revenant, magma_beetle, drake_whelp). Music `ashfall` (exists).
`data/act2_ashfall.js` — Drakonid succession conflict (elder vs young claimant), Drakkor
S1+S2 (`q_drakkor_return`: the fortress where his charges died), Ignis 3-phase fight per
D19, `world.ashfall_heir` choice (back elder or claimant), Ember Shard + memory, Drakkor
bond beats. Drakkor S3 Trial can trigger here if bond ≥3: solo-open scripted battle vs
`ash_revenant` trio guarding his old banner → **Elder Wyrm** evolution.
Integrator: hazard-tile support in MapScene (damage-tick tiles + immunity flags), enrage
countdown + counter-skill hook in battle engine. Verify per §5 + both heir branches.

### M7 — Kessari Reach (target v5.4)

Content: `data/maps/kessari.js` — 5 maps (`kess_docks`, `kess_bazaar` trade hub with the
game's best shops, `kess_underway` smuggler tunnels, `kess_court` Felidae law court,
`kess_spire` Vess arena). **New art**: kessari tileset (sandstone/awning/lantern/crate/
tunnel chars), 5 new enemy battle sprites (D18 Kessari set), `vess` boss sprite + portrait.
Music `kessari` (exists). `data/act2_kessari.js` — Erynn's exile backstory made concrete:
the officer she defied now runs Kessari law; quest chain exposes that Vess's smuggling ring
trades void-touched relics; court verdict choice `world.kessari_verdict` (expose the officer
publicly or quietly). Erynn S1–S3 (`q_erynn_return`; S3 duel-opening Vess fight per D19 →
**Phantom Queen**). Whisper Shard + memory → **Lyra Starforged** evolution (second
EvolutionScene, new Lyra sprites/portrait stage). novaStage 2 + Forge unlock (D20/D22):
integrator builds ForgeScene (recipe list UI reusing ShopScene layout) + `data/recipes.js`.
Verify: recipes craft correctly, evolutions persist through save/load.

### M8 — The Silent Archive (target v5.5)

Content: `data/maps/archive.js` — 4 maps (`archive_gate`, `archive_stacks` — rotating-bridge
puzzle via setCell, `archive_core`, `archive_sanctum` arena). New art: archive tileset
(datawall/conduit/hologram/dormant-construct chars), 5 Archive enemy sprites (D18),
`archivist_prime` sprite. Music `archive` (exists). `data/act3_archive.js` — Pip's origin:
the Archive built the Crown's jailer-constructs; Pip S1–S3 (`q_pip_origin`; S3 choice —
restore factory memory or stay self-made → **Omega Core** either way, flavor differs),
Archivist Prime fight per D19 with mid-fight revelation dialogue, Logic Shard + memory =
**the Crown revelation** (D6 truth stated plainly), `world.archive_fate` (preserve or open
the Archive to all cultures). Ends on the Throne-memory hook that launches M9's Fracture.
Integrator: weakness-cycling boss support; dialogue-interleave in CombatScene (pause timeline,
run script lines, resume). Verify per §5 + revelation sequence screenshots.

### M9 — Act 3: Fracture, Void Threshold, endings (target v5.6–v5.7)

Per D23. Content: Fracture crisis scene set (per-companion confrontation variants over
bond+arc flags), `data/maps/void.js` (3 maps, glitch-tile hazard, no services), D18 Void
enemy set + sprites, `unbound_crown` 3-phase boss + sprites, `data/endings.js` — 4 ending
scripts + epilogue slide matrix over D21 flags (author all combinations as composable
paragraphs, not enumerated wholes: base ending text + arc-state inserts + regional inserts +
novaStage insert). Music: `void`, `final`, `credits` (exist). **Lyra Celestial Ascendant**
evolution at the gate. Integrator: P3 in-battle ending choice (menu inside combat), EndingScene
(slideshow) + CreditsScene, point of no return with mandatory save prompt (PRD §19), post-
credits "return to pre-finale save" flow. Verify: all four endings reachable (scripted
save-state harness), epilogue variation spot-checks (≥6 flag combos), no soft-locks.

### M10 — Companion completion + Nova growth (target v5.8)

Sweep milestone: any D16 S1–S3 stage not shipped in M5–M8 lands here (Brimble S3 Trial,
any missed banter beats), inactive-companion presence (PRD §7.3: reserve companions get
Nova Prime idle scenes per act + comment lines at regional climaxes), companion↔companion
relationship scenes (minimum: Erynn+Pip, Brimble+Drakkor, one group scene per act), novaStage
3 content (D20) including a Nova Prime crisis event (PRD §8.5: void surge on the plaza —
defend it in one scripted battle). Verify: every companion reaches evolution + resolved arc
in one playthrough; Records shows all bonds/arcs.

### M11 — Accessibility, difficulty, onboarding, records (target v5.9)

Per D24: assist toggles + defeat-prompt; accessibility options; verify remapping covers every
action incl. combat Talk. Records completeness (PRD §14.2): bestiary (scan-fills), resonance
list, memory-of-the-Crown replay, decision log (reads D21 flags), playtime/battle stats.
Onboarding audit: every mechanic introduced by a tutorial prompt exactly once, reviewable in
Records. Reorientation: loading any save shows a "Previously…" summary from quest state
(PRD §19). Verify: options persist, assists apply mid-battle, fresh-player path never sees
an unexplained mechanic (scripted playthrough checklist).

### M12 — Presentation polish (target v6.0)

Work the standing polish backlog (§7 end) + PRD §17.6–17.11/§18: portrait-face fixes
(Erynn/Drakkor/Lyra), Kael sprite shading, victory panel, environmental animation passes
per region (water shimmer, ash drift, bazaar banners, datawall pulses, void glitch),
cutscene letterboxing + shard-memory visual treatment, motif audit (Crown/Lyra/Void motifs
present in each region/boss track per D11 — extend musicLibrary where missing), signature
SFX for shard claim/evolution/resonance discovery. No mechanics changes. Verify: visual
inspection screenshots per region + before/after pairs in the commit message.

### M13 — Full validation + PRD compliance audit (target v6.1)

1. Full playthrough (assisted-speed) start→credits on Adventurer; second abbreviated run
   exercising alternate flags (mercy/heir/verdict/fate inverted, different ending).
2. All validators + build + save-migration chain v1→current.
3. Performance: steady 60fps map+combat in Chromium on the WSL host; boot <3s.
4. Write `COMPLIANCE.md`: table of every PRD §2–§22 requirement → evidence (file/screenshot/
   log) → status, per §26. Anything unmet gets fixed or logged as an explicit accepted gap.
5. Final commit + tag.

Dependency notes for schedulers: M5 systems (bond/world-flags/personal-quest framework)
block M6–M10 story content; M6/M7/M8 region content is mutually independent (parallelizable
after M5 systems land); M9 needs M8's revelation; M10 needs M5–M9; M11–M13 sequential last.
