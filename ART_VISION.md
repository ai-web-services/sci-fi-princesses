# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — ARTISTIC VISION v3.0 ("Reference-Anchored Chibi")
# ═══════════════════════════════════════════════════════════════

**Status:** Binding art bible. Supersedes ART_VISION v2.0 ("FFIV Remaster Grammar")
entirely. v2.0's technical canon (≤16 colors, uniform 1px `#1a1a2a` outline, 4-frame
walks, 32×40 canvases) is retired — audits showed it cannot produce the target look.

**Canonical reference:** the Craftpix "Free Swordsman 1–3 Level Pixel Top-Down Sprite
Character" pack (`C:\Users\jrhol\Downloads\craftpix-net-180537-free-swordsman-*.zip`).
Every stylistic rule in §1 was measured from that pack's actual pixels. When this doc
is ambiguous, open the pack in the Gallery comparison view and match the reference.
A proven Lyra pilot frame in this style exists (see ART_PRODUCTION_PLAN.md Phase B).

Carried forward unchanged from v2.0: story palette identities (§2), element colors
(§2.2), region atmospheres (§2.3), VFX choreography language (§5), icon grammar (§6),
UI direction (§8), species silhouette rules (§9). What changed is *how characters are
drawn and animated* (§1, §3) and the acceptance criteria (§12).

---

## 0. The Vision in One Paragraph

Stellar Princesses looks like a modern premium top-down pixel RPG: small, two-heads-tall
chibi heroes with enormous expressive eyes and identity-defining hair/ear/horn
silhouettes, drawn with soft hue-shifted color ramps and *selout* edges (each material
outlined in a dark version of its own hue — never a uniform black line), animated at
6–8 frames per action so movement feels fluid, with translucent smear-arcs on every
melee swing and a soft alpha shadow grounding every actor. The world keeps the v2.0
color story — jewel-toned characters over desaturated environments, gold/cyan hope
against void-purple grief — but renders it in this warmer, rounder, higher-frame-count
grammar. The emotional register is unchanged: *wonder with an undertow of grief*.

### Art Pillars (test every asset against these)

1. **Match the Reference** — the Craftpix pack is ground truth for proportion, ramp
   depth, edge treatment, and animation feel. Side-by-side comparison is part of
   acceptance, not a suggestion.
2. **Selout, Never Coloring-Book** — no uniform exterior outline. Each material edges
   itself in its own darkest ramp step. This one rule is most of the style.
3. **Silhouette Is Identity** — hair mass, ears, horns, dome, chassis: exaggerated to
   half the sprite. A player names the character from a black silhouette at 1×.
4. **Fluidity Over Frame Thrift** — 6–8 frames per action, smear frames on attacks,
   1px secondary motion (hair bob, tail sway) on idles. Frame count is the budget we
   protect, not the one we cut.
5. **Characters Are Jewels / Light vs. Void** — retained from v2.0: saturated character
   palettes over environments 20–30% less saturated; the gold-vs-void color story.
6. **Layered, Not Monolithic** — every character is authored as composited part layers
   (body/head/weapon/swing/shadow) so stages, gear, and species variants are layer and
   palette swaps, not redraws.

---

## 1. Global Technical Canon (measured from the reference pack)

| Property | Value | Notes |
|---|---|---|
| Internal resolution | 480×270 | shipping viewport; integer scale ×4 → 1080p |
| Tile size | 16×16 px | unchanged |
| Character cell | **64×64 px, all characters** | uniform; char occupies ~26–34px height inside it; feet anchored 4px above cell bottom; generous margin so swings/hair never clip |
| On-screen character height | ~26–34 px (≈2 tiles) | heroes ~30px; tall heroes (Erynn, Drakkor) 32–34px; small (Pip) ~24px |
| Proportions | **2 heads tall**; head+hair = ~50% of height | limbs are 2–3px stubs; hands are 2×2 blobs |
| Battle rendering | same 64×64 rigs rendered at ×2 integer | one rig serves exploration AND battle (see §3.4) |
| Boss canvases | 128×128 / 192×160 | unchanged from v2.0 §4 |
| Portraits | 80×96 px | unchanged spec, but redrawn faces must match §3.2 eye construction |
| Colors per character | **≤32** | measured ~28 on reference; every material gets a ramp |
| Ramps | **3–4 steps per material, hue-shifted** | shadows shift toward purple/red-brown, highlights toward warm; never straight darkening |
| Edges | **selout only** — darkest ramp step of each material forms its edge | NO uniform black outline anywhere on sprites; uniform dark outline permitted only on 16×16 UI icons |
| Drop shadow | soft alpha ellipse (~25% black), separate engine layer | the ONE permitted alpha-blend; anchored per-frame under feet |
| Eyes | 3–4px tall: dark lash/brow pixel row, 1px white sclera, 2px saturated iris | no nose; mouth only on portraits and emotes |
| Light source | upper-left, always | unchanged |
| Anti-aliasing | none in sprite pixels (shadow layer excepted) | nearest-neighbor scaling only |
| Animation rate | ~10–12 fps (5–6 ticks/frame) | delta-driven |
| Sheet layout | 8 frame columns × 4 direction rows (front/back/side-L/side-R) | sides authored separately, never mirrored — weapons stay in the correct hand |

---

## 2. Color Bible

### 2.1 Master character palettes

Character color *identities* carry over from v2.0 §2.1 (they match the concept sheets),
but each named color now expands into a 3–4 step hue-shifted ramp within the 32-color
budget. Ramps are defined once in `art/palette.js` and referenced by name.

Ramp construction rule, using Lyra's hair as the worked example:
`hairEdge #5a3512 → hairShade #cc8833 → hairBase #ffdd44 → hairLight #ffcc33/#fff0a0`.
Shadow steps rotate hue toward purple/red-brown; highlight steps rotate toward warm
yellow. Apply the same construction to every v2.0 material color:

- **Lyra** — skin `#ffccaa` ramp, gold hair ramp above, jacket `#3344aa`/`#223388` ramp
  with edge `#141a44`, gold trim `#ffcc33`, iris `#44ddff`, accent `#aa44ff`.
- **Erynn** — fur `#cc7744`/`#853322` ramp, near-black suit `#2a2233`/`#3a3344`, crimson
  straps `#cc3333`, amber eyes `#ffcc33`, ember `#ff8604`/`#ff4400` (Act 2+), phantom
  purple `#aa44ff`/`#c9a0ff` (Act 3).
- **Brimble** — skin greens `#c4aa66`→`#44ff44` throat, steel `#778899`, water blues
  `#44ddff`/`#3344aa`, leather browns.
- **Drakkor** — scale reds `#cc3333`/`#853322`, charcoal armor `#3a3340`/`#222233`,
  fire ramp `#ffcc33`/`#ff8604`/`#ff4400`, amber eyes.
- **Pip** — white-steel `#ccd4e0`/`#778899`, cyan eye `#44ddff` (gold when Omega Core),
  violet ring `#aa44ff`, thruster gold.

### 2.2 Element colors — unchanged from v2.0 (core/glow/8×8 glyph shapes):
Slash `#ccd4e0`, Pierce `#aabbcc`, Blunt `#cc9966`, Fire `#ff4400`, Ice `#44ddff`,
Lightning `#ffdd44`, Water `#3388ff`, Dark/Void `#aa44ff`, Light `#ffcc33`,
Heal `#44ff88` — with the same glyph shape-coding (colorblind rule D24).

### 2.3 Region atmosphere palettes — unchanged from v2.0 §2.3 (Nova Prime blue-gray/
gold, Stargate voidstone/cyan, Mirelight teal/biolume, Ashfall charcoal/lava, Kessari
ochre/crimson, Archive slate/holo-cyan, Void Threshold desaturation/glitch).
Environments stay 20–30% below character saturation.

---

## 3. Characters — Sprite Specification

### 3.1 Layered part construction (preferred, not required — see §11.3)

Where the source (asset pack or generator) provides them, characters keep **separate
part layers**, composited at load time:

| Layer | Contents |
|---|---|
| `body` | torso, limbs, costume |
| `head` | face, hair/ears/horns — the identity mass |
| `weapon_front` | weapon when in front of the body this frame |
| `weapon_back` | weapon when behind the body this frame |
| `swing` | translucent smear-arc frames (attack actions only) |
| `shadow` | engine-generated alpha ellipse (not hand-drawn) |

Why: evolution stages (Base/Partial/Evolved) become layer + palette swaps on the same
body animation; NPC archetypes become head/palette swaps; the swing layer doubles as
melee VFX, tinted per element.

### 3.2 Construction rules (per §1, restated as a checklist for authors)

- 2 heads tall; head+hair ≥ 45% of total height.
- Hair/ears/horns exaggerated into THE silhouette read (Lyra: huge gold hair mass with
  side-swept bangs; Erynn: tall ears + tail; Brimble: dome + wide stance; Drakkor:
  horns + bulk; Pip: hovering sphere).
- Eyes per §1: lash row, white pixel, 2px iris in character eye color. Eyes and hair
  carry all personality; no nose/mouth on sprites.
- Selout edges per material; interior detail via ramp steps, not lines.
- Costume detail budget: 2–3 read-at-1× elements max (Lyra: gold center trim + belt).

### 3.3 Animation contract (per character, per stage)

All actions × **4 authored directions** (front, back, side-left, side-right):

| Action | Frames | Notes |
|---|---|---|
| Idle | 4–6 | 1px torso/hair bob; tail/ear secondary motion |
| Walk | 6 | full stride cycle |
| Run | 8 | lean-forward pose, hair whip |
| Attack | 6–8 | 1–2 **smear frames** where the weapon becomes a translucent arc (swing layer), element-tintable |
| Cast/chant | 6 | palm glow overlay, element-tinted |
| Hurt | 3–4 | 4px knockback, eyes shut |
| KO/death | 6 | collapse; Pip = power-down, dim eye |
| Victory | 6 | signature flourish (plays once) |
| Interact | 2 | reach pose |

≈ 45–50 frames × 4 directions per stage, but layered authoring + the engine shadow +
palette-swap stages mean the *drawn* pixel volume is far lower than the frame count
implies. Partial stages reuse Base body animation with gear-layer deltas (document
deltas in the manifest).

### 3.4 Battle presentation (replaces v2.0's separate 48×64 battle sheets)

**One rig per character.** Battle scenes render the same 64×64 exploration rigs at ×2
integer scale, using the side-facing rows (heroes use side-left = facing left; enemies
side-right). The v2.0 FFIV staging survives — heroes in a right-side rank, enemies
left, bosses at dominating scale — but there is no separate battle sprite production
line. Battle-only actions (cast, victory, KO) are part of the single rig's contract
(§3.3). This halves hero production and guarantees exploration/battle art can never
drift apart.

### 3.5 Signature reads (unchanged intent from v2.0 §3.3, now expressed in-rig)

| Character | Attack read | Signature/cast read | Victory |
|---|---|---|---|
| Lyra | saber smear-arc slash | crown raised, gold halo ring | saber spin, hair settle |
| Erynn | double claw smear (X) | vanish + afterimages | knife flip, tail flick |
| Brimble | shield bash | throat inflate + water ring | belly laugh, shield plant |
| Drakkor | greataxe overhead smear | rear back, breath cone | roar, flame puff |
| Pip | eye-laser zap | panels open, nano-swarm | happy spin + sparkle |

### 3.6 Portraits (80×96)

Spec unchanged from v2.0 §3.4 (6 expressions × stages where the face changes), but
all NEW/redrawn portraits use §1 ramp + selout rules and the big-eye construction so
portraits and sprites read as the same person.

---

## 4. Enemies & Bosses

- **Standard enemies** move to the same 64×64 rig grammar: idle 4 frames + attack
  accent 2 frames + hurt flash (engine) + death dissolve (engine), side-right facing
  authored (exploration-visible enemies also get front/back rows). Size tiers within
  the cell: Small ~20px, Standard ~30px, Large gets a 96×96 cell (~56px).
- **Palette-swap discipline** unchanged (≤2 silhouette reuses per region, documented,
  never bosses).
- **Bosses** — v2.0 §4.3 contracts carry over intact (Kael, Matriarch, Ignis shipped;
  Vess, Archivist Prime, Unbound Crown designs as previously specified), with one
  amendment: redraw/patch passes apply §1 ramp + selout rules. Boss sub-part animation,
  phase overlays, telegraph language (§5.4 of v2.0) all still binding.

---

## 5. VFX

v2.0 §5 remains binding in full (14-primitive library, cast-flow choreography,
signature-skill choreographies, resonance celebration, telegraph language) with two
additions:

- **`smear_arc`** joins the primitive library: 3–4 crescent frames, white core +
  element-glow edge, translucent; used by all melee attacks via the swing layer.
- All impact/glow primitives may use alpha translucency (the reference pack does);
  the "no gradients" rule applies to *sprite* pixels, not VFX overlays.

## 6. Items & Icons — unchanged from v2.0 §6 (16×16, uniform dark outline permitted
here, rarity borders, pickup treatments).

## 7. Game-Flow Choreography — unchanged from v2.0 §7 (encounter shatter, backdrop
spec, turn-flow reads, death/dissolve, victory stagger, evolution template, shard
duotone, region ambience, void corruption motif).

## 8. UI — unchanged from v2.0 §8.

## 9. NPC & World Cast

Unchanged rules (named NPCs, 6 civilian archetypes × region palettes, species
silhouette identification at 1×) — but NPCs now use the same 64×64 layered rigs, which
makes archetype × palette × head-swap variants nearly free. Named NPC minimum: idle
4 frames × 4 directions; walk cycles only for patrollers.

---

## 10. Production Sizing Summary

| Category | Volume | Spec |
|---|---|---|
| Hero rigs | 5 chars × 3 stages (stages are mostly layer/palette deltas) | §3.1–3.4 |
| Portraits | gap-fill + redraw to §1 rules | §3.6 |
| Standard enemies | ~30 existing re-ramped + 15 new | §4 |
| Bosses | 2 shipped-boss conformance passes + Vess, Archivist Prime, Unbound Crown | §4 |
| VFX | 14 primitives + `smear_arc` + 7 signatures | §5 |
| Icons | ~120 | §6 |
| Backdrops/tilesets/UI/NPCs | per v2.0 counts | §7–9 |

Priority order: **(1)** pipeline tooling (grid↔PNG converters, Gallery comparison
view) → **(2)** Lyra full rig (the pilot proving the whole grammar) → **(3)** remaining
4 heroes → **(4)** VFX library → **(5)** enemies re-ramp + bosses → **(6)** UI/portraits
→ **(7)** cinematics & ambience.

---

## 11. Pipeline & Generation (how art gets made)

**Decision (2026-07-09, supersedes D2 for character/enemy/NPC art):** shipped sprites
are **PNG spritesheet assets** under `public/assets/sprites/`, loaded via Phaser's
loader (`this.load.spritesheet` / atlas JSON). Text pixel-grids are retired for
sprites — hand-typing pixel data is not a viable production method. Procedural
generation at boot remains only where code is genuinely the better tool: VFX
primitives, UI frames/gauges, tile effects, palette-remap variants.

1. **No human artists, no paid art — ever.** The Craftpix pack is *reference only*
   (style ground truth for §12.C comparison); its files are never used as source
   material. All sprites are produced by the zero-cost generation pipeline in
   ART_PRODUCTION_PLAN.md: a **procedural sprite-rig generator** (code that composes
   parametric parts and poses them per animation tables — not hand-typed pixel data)
   as the primary route, optionally augmented by free/local AI image generation and
   CC0 assets, all through scripted post-processing (palette conforming to
   `art/palette.js` ramps, 64×64 cell anchoring, sheet packing).
2. **Sheet convention:** one PNG per character per action group, 8 frame columns × 4
   direction rows (front/back/side-L/side-R), 64×64 cells, plus an atlas JSON manifest
   (`public/assets/sprites/manifest.json`) mapping character → action → sheet/frames/
   fps. Bosses/large enemies use their §4 cell sizes.
3. **Layers are optional:** where a generator or pack provides part layers
   (body/head/weapon/swing), keep them for cheap stage/gear swaps; where it outputs
   whole frames, stage variants are produced by regenerating or palette-remapping
   whole sheets instead. §3.1 is a preference, not a gate.
4. Every asset ships with a manifest entry: id → spec section → source (pack name /
   generator + prompt ref) → post-processing applied → license note.
5. Validators run on the PNGs directly (`scripts/validate_sprites.mjs` rewritten):
   cell size/grid alignment, color count ≤32 after conforming, ramp depth, selout
   heuristic (exterior edge not one uniform color), character height range, all
   manifest-declared actions/directions present.

---

## 12. Acceptance Criteria (definition of done)

**A. Technical** — 64×64 cell; char height 26–34px (tier-appropriate); ≤32 colors, all
from declared ramps; every material ramp ≥3 hue-shifted steps; selout edges (no
uniform exterior outline color); transparent background; no AA in sprite pixels;
nearest-neighbor clean at ×3.

**B. Grammar** — 2-heads-tall proportion; eyes per §1 construction; 4 authored
directions (sides not mirrored); frame counts per §3.3; attacks include smear frames;
feet on the standard anchor; light upper-left.

**C. Reference match** — rendered side-by-side with the Craftpix reference in the
Gallery comparison view at ×6: comparable ramp depth, edge softness, proportion, and
animation fluidity. A reviewer seeing both should say they're from the same game.

**D. Readability** — identity from silhouette at 1× on the darkest region backdrop;
species readable per §9; mechanic states distinguishable with color removed.

**E. Cohesion** — region atmosphere palettes respected; characters more saturated than
environments; no shipped rect-primitive art.

**F. Verification evidence** — Gallery screenshot at ×3 in-engine INCLUDING the
side-by-side reference panel, attached to the commit; validators pass; manifest entry
exists.

An asset failing any category returns to its author with the failing criterion cited.
