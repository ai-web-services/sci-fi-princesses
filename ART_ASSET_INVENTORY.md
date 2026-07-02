# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — Art Asset Inventory
# ═══════════════════════════════════════════════════════════════

This file catalogs every visual asset the game needs, organized by
category. For each asset: what it's used for, its status (exists as
procedural code / needs generation / needs concept art), and which
prompt file to reference.

## Status Key

- **PROC** — Procedurally generated in code (sprites.js, textures.js)
- **PROMPT** — Prompt written, ready to generate
- **NEEDED** — Identified as needed, prompt not yet written
- **CONCEPT** — Needs concept art / design before pixel work

---

## 1. CHARACTERS

### 1a. Player Character

| Asset | Description | Status | Prompt File |
|-------|-------------|--------|-------------|
| Lyra walk sprite sheet | 4-dir × 4-frame walk cycle, 32×40px | PROMPT | `lyra-solari.md` |
| Lyra portrait (base) | Full-body top-down portrait, promotional | PROMPT | `lyra-solari.md` |
| Lyra portrait (evol 1) | Starforged evolution portrait | PROMPT | `lyra-solari.md` |
| Lyra portrait (evol 2) | Celestial Ascendant portrait | PROMPT | `lyra-solari.md` |
| Lyra chibi icon | 16×16 or 32×32 UI icon, top-down | PROMPT | `lyra-solari.md` |

### 1b. Companions

| Asset | Description | Status | Prompt File |
|-------|-------------|--------|-------------|
| Erynn walk sprite sheet | 4-dir × 4-frame, digitigrade silhouette | PROMPT | `erynn-vexx.md` |
| Erynn portrait (base) | Full-body top-down portrait | PROMPT | `erynn-vexx.md` |
| Erynn portrait (evol) | Phantom Queen evolution | PROMPT | `erynn-vexx.md` |
| Erynn chibi icon | UI icon | PROMPT | `erynn-vexx.md` |
| Brimble walk sprite sheet | 4-dir × 4-frame, stocky wide silhouette | PROMPT | `brimble-toadsworth.md` |
| Brimble portrait (base) | Full-body top-down portrait | PROMPT | `brimble-toadsworth.md` |
| Brimble portrait (evol) | Leviathan Sovereign evolution | PROMPT | `brimble-toadsworth.md` |
| Brimble chibi icon | UI icon | PROMPT | `brimble-toadsworth.md` |
| Drakkor walk sprite sheet | 4-dir × 4-frame, horns + tail | PROMPT | `drakkor-ashveil.md` |
| Drakkor portrait (base) | Full-body top-down portrait | PROMPT | `drakkor-ashveil.md` |
| Drakkor portrait (evol) | Elder Wyrm evolution | PROMPT | `drakkor-ashveil.md` |
| Drakkor chibi icon | UI icon | PROMPT | `drakkor-ashveil.md` |
| Pip walk sprite sheet | 4-dir × 4-frame, hovering drone, no legs | PROMPT | `pip.md` |
| Pip portrait (base) | Full-body top-down portrait | PROMPT | `pip.md` |
| Pip portrait (evol) | Omega Core evolution | PROMPT | `pip.md` |
| Pip chibi icon | UI icon | PROMPT | `pip.md` |

### 1c. NPCs (Town)

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Commander Reyes sprite | Military advisor NPC | PROC | Generic human in sprites.js |
| Merchant Zara sprite | Material shop keeper | PROC | Generic human |
| Blacksmith Torvin sprite | Weapon shop keeper | PROC | Generic human |
| Dr. Elara sprite | Healer NPC | PROC | Generic human |
| Old Corvus sprite | Tavern keeper | PROC | Generic human |
| Trainer Kade sprite | Training ground NPC | PROC | Generic human |
| Gate Guard sprite | Stargate dock NPC | PROC | Generic human |
| Citizen Milo sprite | Ambient townie | PROC | Generic human |
| Citizen Ada sprite | Ambient townie | PROC | Generic human |

**NEEDED**: Unique sprites for key NPCs (Reyes, Zara, Torvin, Corvus,
Elara) — currently all use generic human sprites. Each needs a
distinct silhouette/color for readability.

---

## 2. ENEMIES

### 2a. Dungeon Enemies

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Void Shade sprite | Basic dungeon enemy, shadow type | NEEDED | Floating dark entity, purple-black |
| Void Crawler sprite | Basic dungeon enemy, ground type | NEEDED | Insectoid void creature |
| Void Sentinel sprite | Mini-boss type | NEEDED | Armored void warrior |
| Corrupted Guardian sprite | Dungeon trap/enemy | NEEDED | Formerly friendly construct |

### 2b. Bosses

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Void Sentinel Kael sprite | Boss 1 — corrupted gate guardian | NEEDED | Tall, armored, void-corrupted, two phases |
| Drowned Matriarch sprite | Boss 2 — water-themed | NEEDED | Large aquatic entity, floods arena |
| Ash Tyrant Ignis sprite | Boss 3 — dragon-themed | NEEDED | Massive dragon, armor plates |
| Final Voidborn sprite | Final boss — eldritch entity | NEEDED | Cosmic horror, multi-phase |

**All boss sprites need**: idle, attack, hurt, phase-transition, and
defeat frames. Recommend 48×48px canvas (larger than player
characters for visual impact).

---

## 3. ENVIRONMENT — TILES

All tile textures are currently **PROC** (procedurally generated in
`textures.js`). 21 tile types exist. These are functional but basic.

| Tile | Status | Notes |
|------|--------|-------|
| Floor | PROC | Dark blue-gray, subtle edge highlights |
| Wall | PROC | Lighter blue-gray, brick-like pattern lines |
| Door | PROC | Wooden door with gold handle |
| Water | PROC | Blue with white sparkle lines |
| Bridge | PROC | Wooden plank texture |
| Grass | PROC | Green with darker patches |
| Path | PROC | Brown dirt with stone edges |
| Counter | PROC | Wooden shop counter |
| Shelf | PROC | Wooden shelf with colored item dots |
| Plant | PROC | Green stem, pink flower |
| Sign | PROC | Wooden post with gold sign board |
| Chest | PROC | Brown chest with gold trim |
| Gate | PROC | Metal gate with gold emblem |
| Portal | PROC | Purple swirl with white center |
| Bed | PROC | Wooden frame, blue blanket, white pillow |
| Table | PROC | Wooden table with leg posts |
| Bar | PROC | Dark wood with colored bottle dots |
| Stairs | PROC | Metal steps, receding perspective |
| Void | PROC | Near-black with subtle purple |
| Ice | PROC | Light blue with white sparkle cracks |
| Lava | PROC | Red-orange with bright yellow patches |

**NEEDED**: Higher-quality tile variants for key areas:
- Town floor tiles (cleaner, more sci-fi)
- Dungeon stone tiles (darker, rougher)
- Boss arena tiles (themed per boss)

---

## 4. ENVIRONMENT — BUILDINGS & PROPS

### 4a. Town Buildings (Exterior)

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Crown Spire exterior | Central palace building | NEEDED | Tallest building, spire shape, blue-gold |
| Weapon Shop exterior | Shop building | NEEDED | Weapon-shaped sign, metal aesthetic |
| Armor Shop exterior | Shop building | NEEDED | Shield-shaped sign, heavy look |
| Tavern "The Nebula" exterior | Tavern building | NEEDED | Warm lighting, neon sign |
| Healer's Hall exterior | Medical building | NEEDED | Clean white-blue, cross symbol |
| Material Shop exterior | Small shop | NEEDED | Potion/vial sign |
| Stargate Dock exterior | Dungeon entrance building | NEEDED | Large, imposing, gate visible |
| Training Ground exterior | Open training area | NEEDED | Weapon racks, training dummies |

### 4b. Dungeon Rooms

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Dungeon corridor tiles | Hallway walls/floor | NEEDED | Dark stone, torch lighting |
| Dungeon room tiles | Open room floor | NEEDED | Stone with blood/void stains |
| Boss arena tiles | Boss room floor | NEEDED | Thematic per boss |
| Treasure room tiles | Chest room | NEEDED | Cleaner, gold accents |
| Trap room tiles | Trap corridor | NEEDED | Pressure plates, spike holes |

### 4c. Props & Interactables

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Chest (open/closed) | Loot container | PROC | Single frame, needs open variant |
| Sign post | Readable sign | PROC | Static, text rendered in-game |
| Portal (active) | Teleport effect | PROC | Static, needs animation frames |
| Torch | Wall light source | NEEDED | Flickering flame animation |
| Barrel | Breakable container | NEEDED | Wooden, can contain items |
| Crate | Breakable container | NEEDED | Scratched metal |
| Save point | Checkpoint | NEEDED | Glowing crystal or terminal |

---

## 5. UI ELEMENTS

### 5a. HUD

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| HP bar | Health display | NEEDED | Green-to-red gradient bar |
| SP bar | Skill point display | NEEDED | Blue bar |
| ATB gauge | Active time battle gauge | NEEDED | Fills from left to right |
| Gold icon | Currency display | NEEDED | Gold coin, top-down |
| Minimap | Small map overlay | NEEDED | Simplified room layout |

### 5b. Menus & Overlays

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Dialogue box | Text display frame | NEEDED | Rounded rect, semi-transparent |
| Shop menu frame | Shop interface | NEEDED | Item grid, gold display |
| Inventory grid | Item management | NEEDED | Slot grid, item icons |
| Combat UI frame | Battle interface | NEEDED | Party status, enemy display |
| Title screen bg | Title background | NEEDED | Starfield with game logo |
| Game over screen | Defeat screen | NEEDED | Dark, "CONTINUE?" prompt |
| Pause menu | Pause overlay | NEEDED | Semi-transparent overlay |

### 5c. Icons

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Weapon icons (set) | Sword, gun, staff, etc. | NEEDED | 16×16 or 32×32, top-down |
| Armor icons (set) | Light, medium, heavy | NEEDED | 16×16 or 32×32, top-down |
| Accessory icons | Ring, amulet, implant | NEEDED | 16×16 or 32×32 |
| Consumable icons | Potion, patch, food | NEEDED | 16×16 or 32×32 |
| Material icons | Scrap, gel, essence, crystal | NEEDED | 16×16 or 32×32 |
| Skill icons | Per-skill unique icon | NEEDED | 16×16, matches skill element |
| Element icons | Fire, ice, lightning, dark, light | NEEDED | 8×8 or 16×16 |
| Status icons | Poison, burn, buff, debuff | NEEDED | 8×8 or 16×16 |
| Rarity borders | Common→Crown Relic frames | NEEDED | Colored borders for items |

---

## 6. VFX / PARTICLES

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Damage flash | White flash on hit | NEEDED | Full-sprite flash, 1-2 frames |
| Heal sparkle | Green/blue sparkle on heal | NEEDED | Small floating particles |
| Level up burst | Golden particle burst | NEEDED | Radial burst from character |
| Evolution transformation | Evolution sequence | NEEDED | Expanding ring + particle cloud |
| Attack slash | Melee attack effect | NEEDED | Arc slash, directional |
| Fire projectile | Fire attack | NEEDED | Orange-red fireball |
| Ice projectile | Ice attack | NEEDED | Blue-white crystal shard |
| Lightning bolt | Lightning attack | NEEDED | Jagged yellow bolt |
| Dark projectile | Dark/void attack | NEEDED | Purple-black orb |
| Light projectile | Light/holy attack | NEEDED | White-gold beam |
| Explosion | AoE impact | NEEDED | Expanding ring + particles |
| Smoke puff | Defeat/dust effect | NEEDED | Gray cloud, fades out |
| Water splash | Water ability | NEEDED | Blue splash ring |
| Shield bubble | Defensive ability | NEEDED | Translucent sphere around target |
| Teleport blur | Shadow Pounce / teleport | NEEDED | Afterimage trail |
| Portal swirl | Portal activation | NEEDED | Purple spiral animation |
| Chest open | Chest opening | NEEDED | Lid opens, gold light emits |
| Item pickup | Item collection | NEEDED | Item floats up + sparkle |
| Text damage numbers | Floating combat text | NEEDED | Numbers rise and fade |

---

## 7. CONCEPT ART (Non-Game-Ready)

These are for promotional use, design reference, or future game
assets. Not needed for the playable game.

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Game logo | "Stellar Princesses" title art | NEEDED | Pixel art logo, star/crown motif |
| Key art | Promotional banner image | NEEDED | All 5 characters, dramatic pose |
| Map illustration | Nova Prime City overview | NEEDED | Stylized top-down city map |
| Dungeon map illustration | Dungeon layout overview | NEEDED | Stylized dungeon floor plan |
| Character relationship chart | Party diagram | NEEDED | Shows connections between characters |
| Evolution comparison | Side-by-side evolution tiers | NEEDED | All 3 tiers per character |
| Item catalog visual | Equipment showcase | NEEDED | Grid of items with rarity borders |
| Boss concept art | All 4 bosses | NEEDED | Full illustration, not sprite |
| Environment concept — Town | Nova Prime City | NEEDED | Atmospheric illustration |
| Environment concept — Dungeon | Void Scar dungeon | NEEDED | Dark, atmospheric illustration |
| Environment concept — Boss arenas | 4 boss arenas | NEEDED | Thematic per boss |

---

## 8. AUDIO (Placeholder — Not Visual Art)

Listed for completeness. Currently all audio is **PROC** (Web Audio
API oscillators in `audio.js`).

| Asset | Description | Status | Notes |
|-------|-------------|--------|-------|
| Town BGM | Exploration music | PROC | Needs composed track |
| Combat BGM | Battle music | PROC | Needs composed track |
| Boss BGM | Boss battle music | PROC | Needs composed track |
| Dungeon BGM | Dungeon exploration | PROC | Needs composed track |
| Victory fanfare | Post-battle | PROC | Needs composed track |
| SFX — Attack | Melee hit | PROC | Needs recorded/synthesized |
| SFX — Magic | Spell cast | PROC | Needs recorded/synthesized |
| SFX — Menu | UI interaction | PROC | Needs recorded/synthesized |
| SFX — Footstep | Walking | PROC | Needs recorded/synthesized |
| SFX — Chest open | Loot | PROC | Needs recorded/synthesized |
| SFX — Damage | Taking hit | PROC | Needs recorded/synthesized |
| SFX — Evolution | Transformation | PROC | Needs recorded/synthesized |

---

## Priority Order

If generating assets incrementally, tackle in this order:

1. **Character sprite sheets** (all 5 characters, base form) — core gameplay
2. **UI elements** (HUD, menus, icons) — needed for all screens
3. **Enemy sprites** (basic dungeon enemies) — needed for combat
4. **VFX particles** (damage, heal, attack) — needed for combat feel
5. **Boss sprites** (all 4 bosses) — needed for boss encounters
6. **Character evolution sprites** — needed for progression
7. **NPC unique sprites** — needed for town personality
8. **Building exteriors** — needed for town visual identity
9. **Dungeon tiles** — needed for dungeon atmosphere
10. **Concept art / promotional** — needed for marketing/pitch
11. **Audio** — polish pass
