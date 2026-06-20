# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — SCI-FI RPG
# Game Design Document (GDD) v1.0
# ═══════════════════════════════════════════════════════════════

## DESIGN PILLARS
1. **Sci-Fi Princess Power Fantasy** — Start as sheltered royalty, evolve into battle-hardened gods
2. **Meaningful Companions** — Diverse species party members (cat/frog/dragon people) with personality
3. **Rewarding RPG Progression** — Deep itemization, equipment upgrades, material crafting
4. **Challenging Boss Fights** — Bosses that demand strategy, not just stats
5. **Home Base as Heart** — Zelda-style town with shops, NPCs, and warmth

## NARRATIVE FRAMEWORK

### Central Thematic Question
"What does power cost, and who do you become when you claim it?"

### Setting
The Stellar Sovereignty — a vast interstellar empire ruled by the Celestial Crown, an ancient
artifact that grants god-like abilities to its bearer. Princess Lyra Solari is the heir, but
the Crown has been shattered in an attack by the Voidborn — eldritch entities from beyond
the dimensional rift. Shards of the Crown are scattered across the frontier. Lyra must
gather allies, reclaim the shards, and evolve from a sheltered princess into the warrior
emperor the galaxy needs.

### Act Structure
- **Act 1: The Fall (0-30 min)** — Home base tutorial, first evolution, first boss
- **Act 2: The Gathering (30min-3hrs)** — Recruit party, explore zones, upgrade gear
- **Act 3: The Reckoning (3hrs+)** — Final Voidborn confrontation, galaxy's fate

### Emotional Arc
Innocence → Grief → Determination → Power → Sacrifice → Ascension

## CHARACTER DESIGN

### Protagonist: Lyra Solari (Human / Humanoid)
- **Archetype**: Princess → Warrior → Ascendant
- **Core Wound**: Sheltered her whole life; never fought; feels powerless
- **Desire**: Restore the Crown and prove herself worthy
- **Need**: Accept that true power comes from those who stand beside you, not the Crown

### Party Members (Recruitable)

#### Erynn "Eryx" Vexx — Cat Person (Felidae)
- **Species**: Felidae — tall, digitigrade legs, retractable claws, large expressive ears
- **Role**: Scout / DPS (high speed, critical hits, evasion)
- **Voice**: Sarcastic, guarded, lonely. Uses short sentences. Never talks about her past before the 3rd area.
- **Core Wound**: Outcast from her colony for refusing to kill a prisoner
- **Ability**: "Shadow Pounce" — teleports to target, guaranteed crit
- **Evolution**: "Phantom Queen" — leaves afterimages that attack independently

#### Brimble Toadsworth — Frog Person (Anura)
- **Species**: Anura — stocky, wide mouth, powerful legs, bioluminescent throat sac
- **Role**: Tank / Support (high HP, healing, area control)
- **Voice**: Gentle, philosophical, uses deliberate pauses. Calls everyone "friend."
- **Core Wound**: His village was consumed by void-touched waters; he was the sole survivor
- **Ability**: "Tidal Shield" — creates a water barrier that absorbs damage and heals allies inside
- **Evolution**: "Leviathan Sovereign" — summons massive water constructs

#### Drakkor Ashveil — Dragon Person (Drakonid)
- **Species**: Drakonid — scaled, horned, smoldering breath, powerful tail
- **Role**: Heavy DPS / Breaker (armor destruction, fire damage, intimidation)
- **Voice**: Formal, archaic speech. Refers to self in third person. Hides fear behind pride.
- **Core Wound**: Last of his clutch; believes he failed to protect them
- **Ability**: "Inferno Breath" — cone AoE, applies burn DoT
- **Evolution**: "Elder Wyrm" — transforms into dragon form temporarily

#### Pip — Robot Companion (Construct)
- **Species**: Small hovering drone with a single expressive eye
- **Role**: Healer / Buffer (repair, buffs, debuffs)
- **Voice**: Cheerful, literal, curious about organic emotions. Beeps translated to text.
- **Core Wound**: Doesn't know who built them or why
- **Ability**: "Nano Swarm" — AoE heal over time
- **Evolution**: "Omega Core" — can resurrect fallen party members once per battle

## SPECIES SYSTEM
Each species has unique passive traits:
- **Felidae**: +20% evasion, +15% crit rate, -10% max HP
- **Anura**: +30% max HP, +20% healing received, -15% speed
- **Drakonid**: +25% physical damage, +15% fire resistance, -20% magic resistance
- **Human (Lyra)**: Balanced stats, +10% all resistances, unique evolution path
- **Construct (Pip)**: Immune to poison/bleed, -25% healing received, +30% buff duration

## EVOLUTION SYSTEM

### Evolution Trigger
Lyra evolves by reclaiming Crown Shards. The first shard is obtained after the first boss
battle (~20-30 minutes in). Evolution is a gameplay + narrative event.

### Evolution Tiers
1. **Crown Bearer** (after 1st shard) — Unlocks "Stellar Command" (party-wide buff)
2. **Starforged** (after 3rd shard) — Unlocks "Nova Burst" (massive AoE damage)
3. **Celestial Ascendant** (after all shards) — Unlocks "Divine Judgment" (ultimate ability)

### Party Member Evolution
Each companion evolves after completing their personal quest line, which involves:
- Reaching a relationship threshold (through dialogue choices and battle participation)
- Finding a personal artifact in a side dungeon
- A dedicated evolution boss fight

## ITEMIZATION SYSTEM

### Equipment Slots (per character)
1. **Weapon** — Primary damage stat
2. **Armor** — Defense + HP
3. **Accessory 1** — Special effect (ring, amulet, etc.)
4. **Accessory 2** — Special effect (charm, implant, etc.)
5. **Implant** — Species-specific augment

### Item Rarity
- **Common** (white) — Base stats only
- **Uncommon** (green) — +1 substat
- **Rare** (blue) — +2 substats
- **Epic** (purple) — +3 substats + special effect
- **Legendary** (gold) — +4 substats + unique ability
- **Crown Relic** (prismatic) — Evolves with the player, scales infinitely

### Upgrade System
Items are upgraded using materials found in the world:
- **Enhancement Kits** (+1 to +10) — Increases base stats
- **Material Fusion** — Adds/changes substats (e.g., "Void Essence" adds dark damage)
- **Transcendence** (at +10) — Requires rare material, unlocks hidden potential

### Material Types
- **Scrap Metal** — Common, weapon upgrades
- **Bio Gel** — Common, armor upgrades
- **Void Essence** — Uncommon, adds dark damage
- **Stellar Crystal** — Rare, adds light damage
- **Dragon Scale** — Rare, fire resistance + damage
- **Celestial Shard** — Legendary, transcendence material

## COMBAT SYSTEM

### Turn-Based with Active Time Battle (ATB) Elements
- Each character has an ATB gauge that fills based on speed
- When full, player chooses action: Attack, Skill, Item, Defend, Swap
- Enemies also use ATB — creates urgency
- "Overdrive" mode: when ATB is full, holding a button charges a more powerful version

### Action Types
- **Attack** — Basic damage, generates SP (Skill Points)
- **Skill** — Costs SP, unique abilities per character
- **Item** — Consumables (healing, buffs, revival)
- **Defend** — Reduces incoming damage by 50%, fills ATB faster
- **Swap** — Switch active party member (3 active, 1 reserve)

### Combo System
Certain skill combinations trigger "Resonance" attacks:
- Fire (Drakkor) + Water (Brimble) = Steam Explosion (AoE blind)
- Claw (Erynn) + Buff (Pip) = Precision Strike (armor ignore)
- Any 3 skills in sequence = "Harmony Chain" (bonus damage)

### Weakness System
- **Physical**: Slash, Pierce, Blunt
- **Elemental**: Fire, Ice, Lightning, Dark, Light
- Each enemy has weaknesses/resistances shown after first scan or hit

## BOSS BATTLE DESIGN

### Boss Philosophy (per Level Designer profile)
- Every boss has: entry read time, multiple tactical approaches, fallback position
- Difficulty is spatial first (pattern recognition), then stat scaling
- Bosses telegraph attacks — no unfair one-shots without warning
- Each boss teaches a mechanic the player needs for the next area

### Boss 1: Void Sentinel Kael (First Boss — ~20-30 min)
**Location**: Stellar Gate (exit from home base town)
**Narrative**: A corrupted guardian of the gate, consumed by void energy

**Phase 1 (100%-50% HP)**:
- "Void Slash" — Telegraphed by red line on ground, 1.5s warning
- "Dark Pulse" — AoE around Kael, dodge by moving away
- "Summon Shade" — Spawns 2 minions; kill them to prevent empowerment

**Phase 2 (50%-0% HP)**:
- Gains "Void Rift" — Creates persistent damage zones on ground
- "Annihilation Beam" — Charges for 3s, massive line AoE; hide behind cover
- Enrages at 10%: faster ATB, but takes 25% more damage

**Tactical Approaches**:
1. Aggressive: Burst down before enrage, use Lyra's buffs
2. Defensive: Brimble tanks, Pip heals, chip damage
3. Technical: Exploit light weakness with crafted light items

**Reward**: First Crown Shard → Lyra's first evolution

### Boss 2: The Drowned Matriarch (Area 2)
- Water-themed, requires Brimble's evolved abilities
- Floods the arena progressively; player must manage rising water level

### Boss 3: Ash Tyrant Ignis (Area 3)
- Dragon-themed, Drakkor's personal trial
- Requires breaking armor plates to expose weak point

## HOME BASE: NOVA PRIME CITY

### Layout (Zelda-style hub)
```
[Residential Quarter] — [Central Plaza] — [Market Street]
        |                    |                    |
   [Lyra's Quarters]   [Crown Spire]     [Weapon Shop]
   [Barracks]           [Healer's Hall]    [Armor Shop]
   [Training Ground]    [Pip's Lab]        [Material Shop]
        |                    |                    |
   [Stargate Dock] — [Garden of Stars] — [Tavern "The Nebula"]
```

### NPCs
- **Commander Reyes** — Quest giver, military advisor, tough love mentor
- **Merchant Zara** — Runs the Material Shop, gossip source
- **Blacksmith Torvin** — Weapon upgrades, gruff but caring
- **Dr. Elara** — Healer's Hall, provides lore about the Voidborn
- **Old Man Corvus** — Tavern keeper, knows legends about the Crown
- **Various townsfolk** — Ambient dialogue, side quests

### Shops
- **"Edge of Tomorrow"** (Weapons) — Sells weapons, weapon enhancement kits
- **"Aegis Outfitters"** (Armor) — Sells armor, armor enhancement kits
- **"Void & Spark"** (Materials) — Sells crafting materials, rare drops
- **"The Nebula"** (Tavern) — Restores HP/SP, hear rumors, recruit companions

## CONTROLS

### Keyboard
- **WASD / Arrow Keys** — Move
- **Z / Space** — Interact / Confirm
- **X / Escape** — Cancel / Menu
- **C** — Open inventory
- **Tab** — Switch party member (in combat)
- **1-4** — Quick skill select (in combat)

### Gamepad (Standard Layout)
- **Left Stick / D-Pad** — Move
- **A / Cross** — Interact / Confirm
- **B / Circle** — Cancel / Menu
- **X / Square** — Inventory
- **Y / Triangle** — Party menu
- **LB/RB** — Cycle party member (in combat)
- **LT/RT** — Quick skill 1/2
- **Start** — Pause menu
- **Back/Select** — Map

## TECHNICAL ARCHITECTURE

### Rendering
- HTML5 Canvas 2D, pixel-perfect rendering
- 320×224 internal resolution (SNES-style), scaled to 960×640
- Sprite-based with palette-swapped variants for species
- Particle system for effects (no WebGL dependency)

### Game Loop
- Fixed timestep (60 FPS target)
- State machine: Title → Town → Overworld → Combat → Boss → Cutscene
- Auto-save at key transitions

### Audio
- Web Audio API for synthesized SFX (chiptune style)
- Procedural music using oscillators (no external files needed)
- Adaptive music system: exploration → tension → combat → boss

### Save System
- LocalStorage for save data
- 3 save slots
- Auto-save after boss victories and evolution events

## PROGRESSION CURVE

### XP to Level
| Level | XP Required | Cumulative | Unlock |
|-------|-------------|------------|--------|
| 1     | 0           | 0          | Start  |
| 2     | 100         | 100        | —      |
| 3     | 150         | 250        | —      |
| 4     | 225         | 475        | New skill (Lyra) |
| 5     | 340         | 815        | —      |
| 6     | 510         | 1325       | —      |
| 7     | 765         | 2090       | New skill |
| 8     | 1150        | 3240       | —      |
| 9     | 1725        | 4965       | —      |
| 10    | 2590        | 7555       | Evolution tier 2 |

### Economy Flow
- **Sources**: Enemy drops, quest rewards, shop selling, exploration chests
- **Sinks**: Equipment purchases, upgrade materials, consumables, inn rest
- **Target**: Player should always be able to afford upgrades within 1-2 areas of earning them

## DEVELOPMENT ROADMAP

### Step 1: Town (v1.0) — WALK AROUND + NPC INTERACTION
- [x] Tile-based town map with collision
- [x] Player movement (keyboard + gamepad)
- [x] NPC placement and interaction system
- [x] Dialogue system with choices
- [x] Shop system (buy/sell)
- [x] Home base buildings (all functional)
- [x] Save/load system

### Step 2: Overworld + Plot (v1.1) — LEAVE TOWN, GAMEPLAY MECHANICS
- [x] Overworld map with zones
- [x] Random encounter system
- [x] Turn-based combat system
- [x] Party management
- [x] Equipment/inventory system
- [x] Item upgrade system
- [x] Quest system
- [x] Narrative progression

### Step 3: Boss Battle (v1.2) — CHALLENGING BOSS FIGHT
- [x] Boss encounter system
- [x] Boss 1: Void Sentinel Kael
- [x] Boss mechanics (phases, telegraphs, patterns)
- [x] Evolution trigger after boss
- [x] Evolution visual + gameplay effects

### Future Steps
- Step 4: Full party recruitment (all 4 companions)
- Step 5: Companion evolution quests
- Step 6: Additional zones and bosses
- Step 7: Endgame content
