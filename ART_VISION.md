# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — ARTISTIC VISION v2.0 ("FFIV Remaster Grammar")
# ═══════════════════════════════════════════════════════════════

**Status:** Binding art bible. Supersedes `prompts/art-direction.md` for all NEW art.
Every produced asset is tested against §12 (Acceptance Criteria) before it ships.
Aligned with PLAN.md decisions D1 (resolution/sizing), D2 (authored procedural pixel
art pipeline), D14–D24 (content scope). Source concept art:
`assets/sprites/{lyra-solari,erynn-vexx,brimble-toadsworth,darkkor-ashveil}-concept.png`.

---

## 0. The Vision in One Paragraph

Stellar Princesses looks like a lost SNES-era Square RPG — **Final Fantasy IV's visual
grammar transplanted to a sci-fi fairytale**: small, big-headed heroes with enormous
expressive dignity; side-view battles where the party stands in a right-side rank facing
left toward enemies; bosses that dwarf the party and fill the left half of the screen;
spells that are choreographed light-shows built from simple layered primitives (flashes,
rings, bolts, palette cycling); and a world rendered in jewel-toned 16-color character
palettes over darker, desaturated environments so characters always pop. Everything is
crisp, outlined, integer-scaled pixel art. Nothing is smooth, nothing is gradient,
nothing is "programmer art." The emotional register is *wonder with an undertow of
grief* — golden light against void-purple darkness, mirroring Lyra's arc from sheltered
princess to Celestial Ascendant.

### Art Pillars (test every asset against these)

1. **FFIV Grammar** — side-view battle staging, fixed pose vocabularies, boss scale
   hierarchy, flash-and-palette spell language.
2. **Characters Are Jewels** — saturated 16-color character palettes on desaturated
   environments; the eye finds the party instantly on any screen.
3. **Light vs. Void** — the global color story: golds/cyans (Crown, hope) vs.
   purple-blacks (Voidborn, grief). Every region palette sits somewhere on this axis.
4. **Readable at a Glance** — every mechanic has a distinct visual (element colors,
   status icons, telegraph language). A muted-audio player can play by sight alone.
5. **Authored, Not Approximated** — per D2, all art is authored pixel data generated to
   textures at boot. No AI-noise, no blur, no rect-primitive placeholders in shipped art.

---

## 1. Global Technical Canon

| Property | Value | Notes |
|---|---|---|
| Internal resolution | 640×360 | D1; integer scale ×3 → 1080p |
| Tile size | 16×16 px | exploration maps |
| Exploration character canvas | 32×40 px (Lyra, Brimble, Pip, NPCs), 32×48 px (Erynn, Drakkor — tall silhouettes per concept sheets) | feet anchored to bottom-center; sorted by y |
| Battle hero canvas | 48×64 px | side-view, faces LEFT |
| Battle enemy canvas (standard) | 48×48 px | faces RIGHT |
| Battle enemy canvas (large) | 80×80 px | mini-boss tier |
| Battle boss canvas | 128×128 px (arena bosses), 192×160 px (final boss P2/P3) | FFIV boss presence: boss height ≥ 2× hero height |
| Portraits | 80×96 px | bust, 3/4 view, per-expression |
| Chibi/UI icon | 32×32 px | per concept sheets |
| Item/skill icons | 16×16 px | drawn on 16 grid, 1px outline |
| Element/status glyphs | 8×8 px | shape-coded AND color-coded (D24 colorblind rule) |
| Colors per character sprite | ≤16 (incl. transparent) | palettes defined in §2 |
| Outline | 1px, `#1a1a2a`, all exterior edges | interior "selout" (darker local color) allowed |
| Shading | 2-step hue-shifted ramps (shadow shifts toward purple, highlight toward warm) | never pure black/white shading |
| Light source | upper-left, always | exploration AND battle |
| Anti-aliasing | none; nearest-neighbor scaling only | |
| Animation timing | frames specified in ticks of 1/60s; all animation delta-driven | |

**Facing convention (battle):** heroes stand on the RIGHT third of the screen in a
vertical rank (up to 3 active), sprites face LEFT. Enemies occupy the LEFT half, facing
RIGHT. All hero battle art is authored facing LEFT only — no mirroring needed. All enemy
battle art is authored facing RIGHT only.

---

## 2. Color Bible

### 2.1 Master character palettes (from concept sheets — canonical)

Each character has a locked 16-color palette. Producers must use these hexes exactly.

**Lyra** — skin `#ffccaa`/`#ddaa88`, hair `#ffdd44`/`#cc8833`, eyes `#44ddff`, outfit
`#3344aa`/`#223388`, accent `#aa44ff`, metal `#778899`, bronze `#553322`, energy
`#ffcc33`/`#ffffff`, darks `#222233`/`#111111`/`#1a1a2a`, outline `#1a1a2a`.

**Erynn** — fur warm brown `#cc7744`/`#853322`, suit near-black `#2a2233`/`#3a3344` with
crimson straps `#cc3333`, eyes amber `#ffcc33`, ember accents `#ff8604`/`#ff4400`
(Act 2+), phantom purple `#aa44ff`/`#c9a0ff` (Act 3), plus shared darks/outline.

**Brimble** — skin greens `#c4aa66`→`#44ff44` throat glow, armor steels
`#778899`/`#553322`, water blues `#44ddff`/`#3344aa`, leather browns, shared darks.

**Drakkor** — scale reds `#cc3333`/`#853322`, armor charcoals `#3a3340`/`#222233`, fire
`#ffa0d4`→ use `#ffcc33`/`#ff8604`/`#ff4400` ramp, eyes `#ffcc33`, shared darks.

**Pip** (no concept sheet yet — fill-the-gap design, §13): chassis white-steel
`#ccd4e0`/`#778899`, single eye `#44ddff` (shifts `#ffcc33` when Omega Core), accent ring
`#aa44ff`, thruster glow `#ffcc33`, shared darks.

### 2.2 Element colors (never deviate — used by spells, icons, damage text, weakness UI)

| Element | Core | Glow | Glyph shape (8×8) |
|---|---|---|---|
| Slash | `#ccd4e0` | `#ffffff` | diagonal blade |
| Pierce | `#aabbcc` | `#ffffff` | arrow tip |
| Blunt | `#cc9966` | `#ffcc33` | starburst |
| Fire | `#ff4400` | `#ffcc33` | flame teardrop |
| Ice | `#44ddff` | `#ffffff` | hex crystal |
| Lightning | `#ffdd44` | `#ffffff` | zigzag bolt |
| Water | `#3388ff` | `#44ddff` | wave crest |
| Dark/Void | `#aa44ff` | `#1a0a2a` | hollow circle |
| Light | `#ffcc33` | `#ffffff` | 4-point star |
| Heal | `#44ff88` | `#ffffff` | plus sign |

### 2.3 Region atmosphere palettes (environments sit 20–30% below character saturation)

| Region | Base tones | Accent | Sky/void backdrop |
|---|---|---|---|
| Nova Prime | cool blue-gray stone, warm window golds | crown gold | deep indigo starfield |
| Shattered Stargate | violet-black voidstone | cyan crystal | rift purple, drifting motes |
| Mirelight Deeps | murky teal-greens | bioluminescent cyan/green | fog banks |
| Ashfall Dominion | charcoal + rust | lava orange ramp | ember-lit smoke sky |
| Kessari Reach | sandstone ochre | awning crimson + lantern gold | dusty amber dusk |
| Silent Archive | slate blue-gray | hologram cyan, data-pulse white | sterile darkness |
| Void Threshold | desaturating everything | glitch magenta/cyan fringe | reality tears (white noise pixels) |

---

## 3. Playable Characters — Full Sprite Specification

Every hero requires **three visual stages** (Base / Partial / Evolved) per the concept
sheets. Stage swaps are palette + overlay changes on the same silhouette where possible
(Erynn and Drakkor Act-3 forms are full redraws — see sheets).

### 3.1 Exploration sheets (per character, per stage)

4 directions × 4 frames (idle, step1, idle, step2) = 16 frames, plus:

| Extra pose | Frames | Use |
|---|---|---|
| Interact/reach | 1 per direction (4) | chests, levers, NPCs |
| Surprised | 1 (down) | encounter start, story beats |
| Sad/kneel | 1 (down) | grief scenes (Brimble homestead, Fracture) |
| Sleep/rest | 1 | inn, campfire scenes |
| Victory wave | 1 (down) | quest completion beat |

Walk cycle timing: 8 ticks/frame at normal speed (7.5 fps), classic FFIV cadence.

### 3.2 Battle sheets — the FFIV pose vocabulary (per character, per stage)

48×64 canvas, facing left. **This is the heart of the redesign.** Every hero implements
this exact pose set:

| # | Pose | Frames | Timing (ticks/frame) | Description |
|---|---|---|---|---|
| B1 | Idle/ready | 2 | 30/30 | weight shift breathing loop, weapon held |
| B2 | Step-forward | 2 | 8/8 | advance one body-length before acting (FFIV walk-up) |
| B3 | Attack windup | 1 | 10 | weapon raised |
| B4 | Attack strike | 2 | 6/6 | swing + follow-through; contact flash on frame 2 |
| B5 | Cast/chant | 2 | 20/20 loop | arms raised, palm glow (element-tinted overlay) |
| B6 | Skill signature | 2 | character-specific | see per-character table below |
| B7 | Hurt/flinch | 1 | 12 | knocked back 4px, eyes shut |
| B8 | Critical (HP<25%) | 2 | 40/40 loop | hunched, slow breathing — replaces B1 |
| B9 | KO | 1 | — | collapsed on ground (FFIV: face-down, weapon dropped) |
| B10 | Defend | 1 | held | guard stance, shield/arms up |
| B11 | Victory | 2 | 20/20, then hold | signature flourish, plays once at fanfare |
| B12 | Item use | 1 | 20 | kneel-and-raise-item |

Total: 17 frames/stage. With 3 stages × 5 heroes ≈ 255 battle frames (Erynn/Drakkor Act-3
redraws included; Partial stages may reuse Base frames with palette/overlay deltas —
producers must document which frames are deltas).

### 3.3 Per-character signature reads

| Character | Silhouette key | B4 attack | B6 signature skill pose | B11 victory |
|---|---|---|---|---|
| **Lyra** | long golden hair mass, saber + off-hand shard glow | saber diagonal slash | Crown raised overhead, halo ring appears (Stellar Command) | saber spun, sheathed, hair settle |
| **Erynn** | tall ears + low crouch + tail counterbalance | double claw rake (X-cross) | vanish crouch → afterimage silhouette (Shadow Pounce) | flips knife, smirks, tail flick |
| **Brimble** | round dome + tower shield held FORWARD (tank reads as wall) | shield bash | throat sac inflates + water ring rises (Tidal Shield) | belly laugh, shield planted |
| **Drakkor** | horns + cape + tail; tallest hero | two-hand greataxe overhead chop | rears back, chest glows, breath cone (Inferno Breath) | roars, small flame puff |
| **Pip** | hovering sphere, bob animation is its idle (±2px sine) | eye-laser zap | opens panels, nano-swarm particles orbit (Nano Swarm) | happy spin + sparkle |

Pip exception: all Pip poses are hover variants; no step-forward (glides), KO = powered
down on ground with dim eye.

### 3.4 Portraits (80×96)

Per character: **base + 6 expressions** (neutral, happy, angry, sad, shocked, resolute)
× each visual stage where the face changes (Lyra ×3, Erynn ×2, Drakkor ×2, Brimble ×2,
Pip ×2 via eye-iconography). Expressions change eyes/brows/mouth only — hair, lighting,
costume identical within a stage. Existing v4.8 portrait set is retained where it passes
§12; the M12 backlog faces (Erynn/Drakkor/Lyra) are redrawn under this spec.

---

## 4. Enemies — Roster Art Specification

All enemies: single authored side-view sprite facing RIGHT + a 3-frame animation budget:
**idle loop (2 frames, 30 ticks each)** + **attack accent (1 frame)**. Hurt = 2-tick
white-palette flash + 4px knockback (engine effect, no frame). Death = dissolve (§7.4).
FFIV precedent: enemies are mostly static portraits with palette life — we add one idle
alternate frame for modern feel.

### 4.1 Size tiers

| Tier | Canvas | Examples |
|---|---|---|
| Small | 32×32 | voidling, gate_wisp, mire_croaker, custodian_drone |
| Standard | 48×48 | shade, corrupted_sentry, bog_lurker, ember_hound, dust_stalker, null_walker |
| Large | 80×80 | void_maw, shard_golem, tide_witch, archive_titan, unmade_knight |
| Boss | 128×128 | Kael, Matriarch, Ignis, Vess, Archivist Prime |
| Final | 192×160 | The Unbound Crown (P2 Void Amalgam, P3 The Wound) |

### 4.2 Palette-swap discipline (FFIV tradition, used deliberately)

Each region may reuse ≤2 silhouettes from earlier regions with full palette re-ramps and
one silhouette edit (new head/weapon/appendage). Swaps must be documented in the asset
manifest (`art/manifest.md`, §11). Never palette-swap a boss.

### 4.3 The five bosses — art + animation contracts

Bosses get the **FFIV boss treatment**: dominating scale, mostly stationary, animated
through sub-part motion, palette cycling, and screen effects rather than full redraws.

Per boss, required frames/parts:

| Asset | Count | Notes |
|---|---|---|
| Idle composite | body + 2–4 animated sub-parts (2 frames each) | e.g. breathing chest, drifting tendrils |
| Attack accents | 1 frame per named attack (see below) | |
| Phase-shift state | 1 palette re-ramp + 1 overlay per phase | phase banner accompanies |
| Hurt | palette flash (engine) | |
| Death sequence | dissolve + core-collapse (§7.4 boss variant) | |

**Void Sentinel Kael (Shattered Stargate)** — 128×128. Corrupted knight fused into gate
debris; cyan gate-glass shards embedded in void-black armor, one arm a blade of rift
energy. Sub-parts: cape drift, rift-arm flicker. Attacks: *Void Slash* (rift-arm raise
accent + red telegraph line), *Dark Pulse* (crouch accent + expanding void ring),
*Annihilation Beam* (3s charge glow accent → full-width beam). Phase 2: armor cracks
overlay, purple veins palette-cycle.

**Drowned Matriarch (Mirelight)** — 128×128. Bloated regal amphibian queen, coral crown,
lantern lure. Sub-parts: lure sway, gill pulse, water-line shimmer at her base. Attacks:
*Summon* (mouth-open accent), *Undertow* (rears up; arena water-rise overlay is an
environment effect layer). Mercy state: lure dims, posture slumps (1 accent frame — the
"Talk" prompt visual cue).

**Ash Tyrant Ignis (Ashfall)** — 128×128 wide-format dragon. Armor plates are separate
overlay sprites (3 plates) that visibly shatter when `sunder` breaks them — each plate
has intact/cracked/gone states. Sub-parts: wing ember drift, molten chest glow cycle.
Attacks: breath cone accent, tail sweep accent, P3 enrage = full-body fire palette cycle
+ countdown numerals over head.

**Silk Baroness Vess (Kessari)** — 96×112 (duelist boss — closer to hero scale ×2,
elegance over bulk). Felidae noble, blade-fan, silk veils (2 drift sub-parts). Clone
decoys = 40%-opacity palette ghosts of the same sprite. Attacks: fan-flick accent,
duel-lunge accent.

**Archivist Prime (Archive)** — 128×128. Monolithic construct of rotating data-slabs
around a core eye; firewall = orbiting elemental glyph ring (uses §2.2 glyphs, currently
active element enlarged). Attacks: slab-slam accent, beam-array accent. Revelation
interleave: core eye shifts from cyan → gold as dialogue lands.

**The Unbound Crown (Void Threshold)** — three bodies:
P1 *Crown Sovereign* 64×80 — dark mirror of Ascendant Lyra (reuses her silhouette
language, inverted palette: gold→void purple). P2 *Void Amalgam* 192×160 — fused echoes
of all four prior bosses (recognizable parts: Kael's blade-arm, Matriarch's lure, Ignis
plate, Vess veil) orbiting a wound-core. P3 *The Wound* 192×160 — abstract: a torn
hole in reality, edge pixels glitch-cycling, inside is the starfield inverted; the four
ending choices render as four orbiting light-motes (gold/cyan/green/violet).

---

## 5. Spell, Skill & Resonance VFX — Choreography Specification

FFIV spell language = **layered primitives**: (1) caster glow, (2) projectile/shape,
(3) impact flash, (4) screen effect, (5) damage number. All VFX are built from these
five layers in `art/vfx.js`. Standard cast flow (total ≈ 60–90 ticks):

```
[B5 chant 20t] → [element glow swells on caster 10t] → [shape travels/appears 15–30t]
→ [impact: 2t white flash on target + effect burst 10t] → [damage number rises 30t]
```

### 5.1 Core effect library (build once, parameterize by element color)

| Effect | Visual | Frames/lifetime | Used by |
|---|---|---|---|
| `bolt` | 3-segment jagged bolt from sky | 8t strike + 6t linger | lightning skills |
| `projectile` | 12×12 elemental orb + 3-dot trail | 15–25t travel | fire/ice/dark casts |
| `cone` | expanding wedge from caster mouth/hand, 3 growth frames | 18t | Inferno Breath |
| `ring` | expanding circle outline, 4 radii | 16t | Dark Pulse, AoE bursts |
| `rain` | 6–10 falling shards | 30t | ice/light multi-target |
| `beam` | full-width horizontal beam, 2-frame flicker | 20t | Annihilation Beam, laser |
| `shield_dome` | translucent half-dome, 2-frame shimmer loop | until consumed | Tidal Shield, barriers |
| `sparkle_rise` | 8 pixels floating up + fade | 24t | heals, buffs |
| `swarm` | 12 orbiting motes converging | 30t | Nano Swarm |
| `afterimage` | caster silhouette at 50%→25%→0% opacity, 3 ghosts | 18t | Shadow Pounce, evasion |
| `slash_arc` | white crescent, 3 frames | 9t | physical crits |
| `screen_flash` | full-screen element-tint at 30% | 4t | big spells (reduced-flash mode: border pulse instead) |
| `screen_shake` | ±3px, 8t decay | — | blunt/boss hits |
| `palette_cycle` | target palette rotates through ramp | variable | burns, enrage, void corruption |

### 5.2 Signature skill choreography (hero ultimates — each must feel like an FFIV summon-lite, 90–150 ticks)

| Skill | Choreography |
|---|---|
| **Stellar Command** (Lyra) | screen dims 20% → gold halo `ring` over party → `sparkle_rise` on each ally → stat-up arrows |
| **Nova Burst** (Lyra) | chant → screen_flash gold → `rain` of 4-point stars across all enemies → triple impact flashes |
| **Divine Judgment** (Lyra ult) | full letterbox → star backdrop overlay → descending `beam` pillar per enemy → white-out → damage |
| **Shadow Pounce / Queen's Gambit** (Erynn) | `afterimage` dash across screen → appear behind target → `slash_arc` ×2 (Gambit: 3 ghosts each strike independently) |
| **Tidal Shield / Sovereign Tide** (Brimble) | `shield_dome` water-tint over party (Tide: + `sparkle_rise` green regen ticks each turn) |
| **Inferno Breath / Extinction Flare** (Drakkor) | B6 rear-back → `cone` fire, 3 growth stages (Flare: cone + `screen_flash` + lingering `palette_cycle` molten on targets) |
| **Nano Swarm / Genesis Loop** (Pip) | `swarm` cyan motes to all allies → green plus-glyphs (Genesis: KO ally silhouette re-lights frame by frame — the resurrection read) |

### 5.3 Resonance combos (discovery moments — must feel celebratory)

Trigger visual: both contributors' element glows arc toward mid-screen, collide in a
2-tick white flash, then the combo effect plays bigger than either component. First-ever
discovery adds: time-stop 30t, "RESONANCE — <name>" banner in gold UI script, record
scratch SFX hook. E.g. *Steam Explosion* = fire cone + water ring → white steam billows
(6-frame cloud) + blind glyphs on enemies.

### 5.4 Telegraph language (bosses; D19/v5.1 system)

- **Line AoE:** pulsing red 2px line on arena floor, 1.5s, 2-frame blink accelerating.
- **Arena-wide:** screen edge pulses element color + countdown pips over boss head.
- **Add summon:** purple portal swirls (16t) before minion fade-in.
Telegraphs always render UNDER sprites, are shape+color coded, and respect reduced-flash.

---

## 6. Items, Equipment & Icon Art

### 6.1 Icon grammar (16×16, 1px outline, 3-color + shine convention)

| Family | Silhouette rule |
|---|---|
| Weapons | diagonal, blade/muzzle pointing up-right; type readable (saber, claw, shield, axe, emitter) |
| Armor | frontal torso shape; weight class by bulk |
| Accessories | ring = circle, amulet = drop on chain, implant = chip with pins |
| Consumables | flask silhouettes; contents = element color |
| Materials | scrap = plate stack, gel = blob, essence = wisp in vial, crystal = shard, scale = fan shape |
| Key/story | unique per item; Crown Shards = 6 distinct crystal cuts, one per shard name |

### 6.2 Rarity rendering (D22/GDD)

Rarity = **border + corner glint** on the icon slot (not the icon itself):
white / green / blue / purple / gold frames; Crown Relic = animated 4-color prismatic
border cycle (8t/step). Epic+ items get a 2-frame idle sparkle in inventory.

### 6.3 In-world pickups

Chest (closed/opening/open, 3 frames + gold light `sparkle_rise`), floating item glint
(2-frame twinkle), material nodes per region (crystal cluster, gel pod, scrap pile —
2-frame shimmer). Item-get: icon rises 12px above hero + `sparkle_rise` + jingle hook.

---

## 7. Game-Flow Choreography (mechanics → art moments)

### 7.1 Encounter transition
FFIV-style shatter: screen freezes → splits into 8×8 tile shards that scatter outward
(12t) → battle backdrop slides in → heroes slide in from right in rank order → boss
battles instead: fade to black 20t → boss name banner → boss fades in first, alone.

### 7.2 Battle backdrop spec
Per region: 640×200 painted-pixel backdrop (parallax-free, FFIV flat stage), floor band
where combatants stand, 1 ambient animation layer (drifting motes / heat shimmer /
water caustics / data pulses, 2–4 frame loop).

### 7.3 Turn flow reads
Active hero steps forward (B2) + white selection corner-brackets; timeline strip icons
use the 32×32 chibis; target selection = blinking hand cursor (2 frames, FFIV homage).

### 7.4 Death/dissolve
Standard enemy: 20t vertical scanline dissolve into element-colored pixels that fall.
Boss: 60t sequence — palette cycles to white → cracks overlay → core flash →
`screen_flash` → shards + `ring`. Never reuse standard dissolve on a boss.

### 7.5 Victory
Fanfare → heroes play B11 in stagger (0/10/20t offsets) → results panel slides up:
XP ticks up numerically, level-up = gold `ring` on chibi + "LEVEL UP!" script,
loot icons pop in one by one (6t apart).

### 7.6 Evolution scenes (EvolutionScene — the biggest art moments in the game)
90–150 ticks, letterboxed: character alone on void-black → old-form sprite rises,
palette drains to white → shard/sigil orbits in (`swarm`) → white-out `screen_flash` →
new-form sprite descends with new palette + 3 `ring` bursts → name reveal
("STARFORGED") in gold script → return. Each of the 8 evolutions (Lyra ×3, companions
×1 each… Lyra Crown Bearer already shipped) uses this template with per-character
sigil, element tint, and silhouette morph (2 in-between frames old→new).

### 7.7 Shard "Memory of the Crown" cutscenes (D14)
Distinct visual treatment: sepia-void palette (all colors remapped to gold/purple duotone),
film-grain pixel flicker layer, letterbox, portraits rendered as silhouettes with glowing
eyes. This treatment is a shader-free palette remap — build once in fx.js, reuse ×6.

### 7.8 Exploration ambience (M12 contract)
Per region, minimum: 1 water/fluid shimmer OR heat/particle drift, 1 flag/banner/foliage
sway (2-frame), 1 light pulse (windows, crystals, holograms). Nova Prime adds stage 0–3
growth deltas (D20): rubble → scaffolds → banners → restored spire glow.

### 7.9 Void corruption motif (global)
Anything void-touched gets: purple `palette_cycle` on its outline pixels only + 1–2
glitch frames (row displacement ±1px) every ~3s. Applies to corrupted NPCs, tiles,
Void Threshold terrain, and the Fracture scene UI itself.

---

## 8. UI Art Direction

- **Window frames:** FFIV blue — deep `#223388`→`#3344aa` vertical dither gradient fill,
  double border (outer `#ffffff` 1px, inner `#778899` 1px), rounded 2px corners. 9-slice.
- **Font:** existing crisp pixel font; gold `#ffcc33` for emphasis/names, white body text.
- **Gauges:** HP green→amber→red stepped (not gradient); SP cyan; CTB timeline strip
  with chibi tokens; boss HP = wide top bar with phase notches.
- **Damage numbers:** white (normal), gold+larger (crit), purple (weakness hit — with
  "WEAK!" tag), gray (resist), green (heal); arc up-and-fall like FFIV.
- **Menus:** portrait-led layouts; equipment compare arrows (green up/red down);
  bestiary/records use enemy sprites at 1× with scan-fill silhouettes for unknowns.
- **Title screen:** logo (pixel wordmark, crown-over-star sigil), starfield with
  slow parallax, Crown Shard glints cycling; menu in standard windows.

---

## 9. NPC & World Cast

- **Named NPCs** (Reyes, Zara, Torvin, Elara, Corvus, + regional named cast): unique
  32×40 sheets, 4-dir × 2-frame idle-shuffle minimum (walk cycles only for NPCs that
  patrol), 1 portrait each (neutral only; ±1 extra expression for story-heavy NPCs).
- **Ambient citizens:** 6 body archetypes × region palette swaps (documented), including
  Felidae/Anura/Drakonid/Construct civilians so regions read as their species' home.
- **Species silhouette rules:** Felidae = ears+tail+digitigrade; Anura = dome+wide stance;
  Drakonid = horns+tail+bulk; Construct = geometric, glow accents. A player must identify
  species from silhouette alone at 1×.

---

## 10. Production Sizing Summary (the full shopping list)

| Category | Count (approx) | Spec section |
|---|---|---|
| Hero exploration sheets | 5 chars × 3 stages × (16 walk + 8 extra) | §3.1 |
| Hero battle sheets | 5 × 3 stages × 17 poses | §3.2 |
| Portraits | ~5 × 2–3 stages × 7 expressions | §3.4 |
| Chibi icons | 5 × 3 stages | §1 |
| Standard enemies | ~30 existing + 15 new (D18) × 3 frames | §4 |
| Bosses | 5 arena + 3-body final × contracts | §4.3 |
| VFX library | 14 core effects + 7 signatures + resonances | §5 |
| Icons | ~120 items/skills/statuses/elements | §6 |
| Battle backdrops | 7 regions + arenas | §7.2 |
| Tilesets | 7 regions (4 exist, refresh pass) + ambience layers | §7.8 |
| UI kit | frames, gauges, cursors, banners, title | §8 |
| NPCs | ~12 named + 6 archetypes × palettes | §9 |
| Cinematic templates | evolution, shard memory, encounter, death, victory | §7 |

Priority order: **(1)** hero battle sheets Base stage → **(2)** VFX core library →
**(3)** boss contracts for shipped bosses (Kael, Matriarch) → **(4)** UI kit refresh →
**(5)** remaining per-milestone (M6–M9 regions bring their own rosters) →
**(6)** evolution/cinematic templates → **(7)** ambience & polish (M12).

---

## 11. Handoff Protocol for Content-Author Agents

1. Every asset is authored as pixel-string grids in `public/src/art/` per D2 (no binary
   assets), palette refs by name from `art/palette.js` — never inline hexes.
2. Before starting a packet, the author reads THIS file §1–2 + the relevant section,
   and the concept PNG for the character (if any).
3. Each packet ships with a manifest entry in `art/manifest.md`: asset id → spec section
   → frame list → palette used → any documented reuse/swap.
4. Validators (`scripts/`): frame dimensions match §1 canon; palette ≤16 and ⊆ declared
   palette; outline color present on silhouette perimeter; animation registries complete
   (every pose id in §3.2 exists per hero stage).
5. Authors own new files only; integrator wires scenes/registries (PLAN.md §9 rules).

---

## 12. Acceptance Criteria (test every asset — this is the "definition of done")

**A. Technical** — canvas size per §1; ≤16 colors from declared palette; 1px `#1a1a2a`
outline; transparent background; no AA/gradients; nearest-neighbor clean at ×3.

**B. Grammar** — heroes face left / enemies face right in battle; light from upper-left;
all §3.2 poses present; walk cycles 4-frame with return-to-idle; boss ≥2× hero height on
screen; element colors match §2.2 exactly.

**C. Readability** — character identifiable from silhouette at 1× on darkest region
backdrop; species readable per §9; every mechanic state (weakness, status, telegraph,
rarity) distinguishable with color removed (shape coding).

**D. Choreography** — every skill resolves through the §5 cast flow; timings within ±20%
of spec; reduced-flash mode has a defined fallback for every `screen_flash` use;
evolution/shard/death sequences use their templates, never ad-hoc.

**E. Cohesion** — asset uses region atmosphere palette (§2.3); characters read more
saturated than their environment; no shipped rect-primitive or unoutlined art.

**F. Verification evidence** — screenshot at ×3 in-engine on the target scene, attached
to the commit; validators pass; manifest entry exists.

An asset failing any category returns to its author with the failing criterion cited.

---

## 13. Gaps Filled (visionary additions beyond the ask)

- **Pip concept design** (§2.1) — no concept sheet existed; palette + silhouette defined
  here. A Pip concept sheet matching the other four should be produced first.
- **Vess & Archivist Prime & Unbound Crown visual designs** (§4.3) — bosses had names
  and mechanics but no look; now specified, including the P2 "fused echoes" callback
  which rewards the whole campaign visually.
- **Ending motes motif** (§4.3 final boss) — the four endings get colors (Restore=gold,
  Reform=cyan, Share=green, Release=violet) reused in EndingScene slides for coherence.
- **Void corruption motif** (§7.9) — one reusable treatment unifies the antagonist's
  visual identity across all seven regions.
- **Shard-memory duotone** (§7.7) — gives the six Crown memories a signature look that
  players will recognize instantly (and it's cheap: one palette remap).
- **Colorblind shape-coding** (§2.2, §12.C) — extends D24 into the art spec itself.
- **Talk/mercy visual cue** (§4.3 Matriarch) — the mercy mechanic gets a readable
  "boss is yielding" pose so the Talk command discovery is fair.
