# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — Enemy & Boss Sprite Prompts
# ═══════════════════════════════════════════════════════════════

Pixel art enemy sprites for the game. All enemies are viewed from
pure top-down orthographic perspective. Sprites are larger than
player characters to convey threat.

For art direction rules, see `art-direction.md`.
For palette reference, see `config.js` COLORS.

## Style Rules

- **Canvas**: 32×34 pixels for regular enemies, 48×48 pixels for
  mini-bosses, 64×64 pixels for bosses
- **Perspective**: Pure top-down (90 degrees)
- **Lighting**: Upper-left light source, consistent across all sprites
- **Palette**: Max 12 colors per enemy
- **Outline**: 1px near-black #1a1a2a on all edges
- **Animation frames**: idle, attack, hurt, defeat (4 frames minimum)

---

## PART A: DUNGEON ENEMIES

### A1. Void Shade (Basic — Floating)

```
Pixel art enemy sprite, 32x34 pixels, top-down view. A Void Shade
— a basic floating shadow enemy found in the Void Scar dungeon.

APPEARANCE: A floating mass of dark void energy. The body is an
irregular, organic shape #1a0a2a (very dark purple-black) with
no fixed form — it shifts and undulates. The "core" is a brighter
spot #aa44ff (purple glow, 3x3px, the brightest element) at the
center of the mass — this is the Shade's "heart." Tendrils of
void energy #2a1a2a (1px lines, 4-6) extend outward from the
main mass in all directions, constantly shifting. Two small "eyes"
#ff3344 (red, 1px each, glowing) float within the mass — they
don't have fixed positions, they drift within the void. A faint
shadow #000000 at 20% opacity floats 1px below (the Shade hovers
above the ground).

IDLE ANIMATION (4 frames):
  Frame 1: Tendrils extended outward. Core centered. Eyes at
    upper-left of the mass.
  Frame 2: Tendrils retracted slightly (1px inward). Core pulses
    brighter (#cc66ff). Eyes drift to center.
  Frame 3: Tendrils extended again (different pattern). Core
    returns to normal #aa44ff. Eyes drift to lower-right.
  Frame 4: Same as Frame 1 (loop).

ATTACK ANIMATION (3 frames):
  Frame 1: Mass compresses (1px smaller in all directions). Core
    brightens #cc66ff. Tendrils pull inward.
  Frame 2: Mass launches forward (shifted 2px in the attack
    direction). A void projectile #aa44ff (2x2px) separates from
    the core and flies outward. Tendrils trail behind.
  Frame 3: Mass returns to normal position. Projectile continues
    outward (now 4px from the mass).

HURT ANIMATION (2 frames):
  Frame 1: Mass flashes white #ffffff (1 frame, full-sprite flash).
    Core dims to #552255.
  Frame 2: Mass returns to normal colors but slightly smaller (1px
    shrink, the Shade is weakened).

DEFEAT ANIMATION (4 frames):
  Frame 1: Mass flashes white #ffffff. Core brightens #cc66ff.
  Frame 2: Mass begins to dissolve — tendrils break apart into
    individual pixels #2a1a2a that float upward.
  Frame 3: Only the core remains #aa44ff (2x2px), pulsing weakly.
  Frame 4: Core fades to #1a0a2a (1x1px) then disappears.
    A small void residue #1a0a2a (2x2px) remains on the ground.

Palette: #1a0a2a (body), #aa44ff (core), #2a1a2a (tendrils), #ff3344
(eyes), #cc66ff (bright core), #552255 (dim core), #ffffff (flash),
#000000 (shadow).
```

### A2. Void Crawler (Basic — Ground)

```
Pixel art enemy sprite, 32x34 pixels, top-down view. A Void
Crawler — a basic ground-based insectoid void creature.

APPEARANCE: A small, six-legged insectoid creature made of void
energy and chitin. The body is an oval shape #2a1a2a (dark purple,
6x4px) with a slightly pointed front (the head). The head has two
compound eyes #ff3344 (red, 2x1px each, glowing) and mandibles
#1a0a2a (dark, 1px each, small triangular shapes below the eyes).
Six legs #1a0a2a (dark, 1px each, 3 per side) extend from the
body — the front legs point forward, middle legs point sideways,
back legs point backward. A segmented tail #2a1a2a (3x1px) extends
from the rear. Void energy wisps #aa44ff (1px dots, 2-3) float
above the creature.

IDLE ANIMATION (4 frames):
  Frame 1: Legs in neutral position. Body centered.
  Frame 2: Front legs lift 1px (subtle movement). Body shifts 1px
    forward.
  Frame 3: Front legs down, back legs lift 1px. Body shifts 1px
    back.
  Frame 4: Same as Frame 1 (loop). The creature "breathes" — the
    body subtly expands and contracts.

ATTACK ANIMATION (3 frames):
  Frame 1: Body compresses (1px shorter). Front legs raise 1px.
    Mandibles open (spread 1px wider).
  Frame 2: Body lunges forward (shifted 2px forward). Front legs
    extend forward (2px reach). Mandibles snap closed.
  Frame 3: Body returns to normal position. Legs return to neutral.

HURT ANIMATION (2 frames):
  Frame 1: Body flashes white #ffffff. Legs splay outward (1px
    further from body).
  Frame 2: Body returns to normal but shifts 1px backward (knockback).

DEFEAT ANIMATION (4 frames):
  Frame 1: Body flashes white #ffffff. Legs splay outward.
  Frame 2: Body darkens to #0a0a1a. Legs curl inward (1px toward
    body).
  Frame 3: Body shrinks to 4x3px. Legs disappear. Only the eyes
    #ff3344 remain (1px each, fading).
  Frame 4: Eyes fade to #1a0a2a. A small void residue #1a0a2a
    (2x2px) remains.

Palette: #2a1a2a (body), #1a0a2a (legs/mandibles), #ff3344 (eyes),
#aa44ff (wisps), #0a0a1a (defeat dark), #ffffff (flash).
```

### A3. Void Sentinel (Mini-Boss — Armored)

```
Pixel art enemy sprite, 48x48 pixels, top-down view. A Void
Sentinel — a mini-boss, an armored void warrior found in deeper
dungeon rooms.

APPEARANCE: A tall, armored humanoid figure (roughly 1.5x the
height of a player character). The body is covered in dark void-corrupted
armor #334455 (dark blue-gray metal) with purple void energy #aa44ff
leaking from the cracks and joints. The helmet #334455 has a cracked
visor with glowing purple eyes #aa44ff (2x1px each, horizontal slits).
The right arm holds a void-corrupted sword #556677 (dark metal blade)
with void energy #aa44ff crackling along the edge. The left arm has
a small round shield #556677 with a cracked emblem #aa44ff. The legs
#334455 are armored with visible knee joints leaking void energy
#aa44ff. A tattered cloak #1a0a2a (dark purple, 2px wide) hangs from
the shoulders, dissolving into void wisps at the bottom.

IDLE ANIMATION (4 frames):
  Frame 1: Standing upright. Sword at rest (pointing down). Shield
    at side. Void energy pulses #aa44ff at the cracks (normal
    brightness).
  Frame 2: Void energy brightens #cc66ff (pulse). Cloak wisps shift
    1px. Eyes brighten #cc66ff.
  Frame 3: Void energy returns to normal #aa44ff. Cloak returns.
  Frame 4: Subtle weight shift — body shifts 1px left, then right.

ATTACK ANIMATION (4 frames):
  Frame 1: Sword raises (sword shifts 2px up, blade pointing forward).
    Shield arm pulls back. Body shifts 1px back (wind-up).
  Frame 2: Sword slashes forward (sword shifts 4px forward, blade
    horizontal). A void slash effect #aa44ff (3x1px arc) extends
    from the blade tip. Body lunges 2px forward.
  Frame 3: Sword returns to rest position. Slash effect fades.
    Body returns to neutral.
  Frame 4: Brief pause — void energy pulses #cc66ff at the cracks
    (recovery).

HURT ANIMATION (3 frames):
  Frame 1: Full-sprite flash #ffffff. Sword drops 1px. Shield
    drops 1px.
  Frame 2: Body shifts 2px backward (knockback). Void energy at
    cracks brightens #cc66ff (the armor is damaged, more void
    leaking). A crack line #aa44ff appears on the armor (1px, new
    damage mark).
  Frame 3: Body returns to neutral. Void energy returns to normal
    #aa44ff. The new crack remains (permanent damage mark).

DEFEAT ANIMATION (6 frames):
  Frame 1: Full-sprite flash #ffffff. Sword and shield drop 2px.
  Frame 2: Body shifts 2px backward. Armor cracks widen — more
    void energy #aa44ff leaks from multiple points.
  Frame 3: Body kneels (shifts 2px down). Sword falls (shifts 4px
    forward, lying on the ground). Shield falls (shifts 2px to the
    side).
  Frame 4: Body collapses (shifts 4px down, 2px wider — lying down).
    Helmet cracks — eyes #aa44ff dim to #552255.
  Frame 5: Body dissolves — armor fragments #334455 break apart into
    individual pixels that float upward. Void energy #aa44ff wisps
    rise from the remains.
  Frame 6: Only the sword #556677 and shield #556677 remain on the
    ground (lying flat). A void residue #1a0a2a (4x2px) marks where
    the body was.

Palette: #334455 (armor), #aa44ff (void energy), #cc66ff (bright
void), #556677 (sword/shield), #1a0a2a (cloak), #552255 (dim eyes),
#ffffff (flash), #0a0a1a (defeat dark).
```

### A4. Corrupted Guardian (Trap/Enemy — Construct)

```
Pixel art enemy sprite, 32x34 pixels, top-down view. A Corrupted
Guardian — a formerly friendly construct (like Pip) that has been
corrupted by void energy. Found in dungeon trap rooms.

APPEARANCE: A small, rounded construct (similar in size and shape
to Pip) but corrupted. The body #556677 (steel gray, same as Pip's
but darker) has cracks #1a0a2a (dark purple, 1px lines) across its
surface, with void energy #aa44ff leaking from the cracks. The single
eye #ff3344 (red, corrupted from Pip's cyan — 3x3px, the brightest
element) glows with a malevolent light. The ear antennae #667788 are
bent and damaged (1px, tilted at odd angles). The arms #556677 are
still articulated but one is missing its gripper (the end is just
a broken stump #333333). The thruster #553322 still works but emits
dark smoke #1a0a2a instead of a clean glow. A faint shadow #000000
at 20% opacity floats 1px below (still hovering, but unsteadily).

IDLE ANIMATION (4 frames):
  Frame 1: Hovering unsteadily — body shifts 1px up. Eye #ff3344
    glows normally. Void energy #aa44ff leaks from cracks (normal).
  Frame 2: Body shifts 1px down. Eye dims slightly #cc2222. Void
    energy pulses #cc66ff.
  Frame 3: Body shifts 1px left. Eye brightens #ff3344. One antenna
    twitches (1px tilt).
  Frame 4: Body shifts 1px right. Same as Frame 1 (loop). The
    hovering is erratic — this construct is barely holding together.

ATTACK ANIMATION (3 frames):
  Frame 1: Body compresses (1px smaller). Eye brightens #ff6666.
    The good arm extends forward (2px). Void energy #aa44ff gathers
    at the gripper.
  Frame 2: A void projectile #aa44ff (2x2px) launches from the
    gripper. Body shifts 1px backward (recoil). The broken arm
    sparks #ffcc33 (1px, a short-circuit).
  Frame 3: Body returns to neutral. Projectile continues outward.
    Eye returns to normal #ff3344.

HURT ANIMATION (2 frames):
  Frame 1: Body flashes white #ffffff. A new crack #1a0a2a appears
    on the body (1px, permanent damage). More void energy #aa44ff
    leaks.
  Frame 2: Body shifts 1px backward (knockback). Eye flickers
    #ff3344 → #cc2222 → #ff3344 (unstable).

DEFEAT ANIMATION (5 frames):
  Frame 1: Body flashes white #ffffff. Eye brightens #ff6666.
  Frame 2: Body cracks widen — the construct breaks apart into
    two halves (body splits 1px down the middle). Void energy
    #aa44ff pours out.
  Frame 3: Halves separate (2px gap). Eye #ff3344 is now in one
    half, flickering. Arms fall away (shift 2px outward).
  Frame 4: Halves dissolve into pixels #556677 that float upward.
    Eye fades #ff3344 → #cc2222 → #552255.
  Frame 5: Only a small metal fragment #556677 (2x2px) and a void
    residue #1a0a2a (2x2px) remain on the ground.

Palette: #556677 (body), #1a0a2a (cracks), #aa44ff (void leak),
#ff3344 (eye), #cc2222 (dim eye), #ff6666 (bright eye), #667788
(antennae), #553322 (thruster), #333333 (broken arm), #ffcc33
(spark), #ffffff (flash), #552255 (fading eye).
```

---

## PART B: BOSSES

### B1. Void Sentinel Kael (Boss 1 — Corrupted Guardian)

```
Pixel art boss sprite, 64x64 pixels, top-down view. Void Sentinel
Kael — the first boss, a corrupted guardian of the Stellar Gate.
Tall, imposing, tragic.

APPEARANCE (PHASE 1 — 100% to 50% HP):
A tall humanoid figure (roughly 2x player character height). The
body is covered in heavy ceremonial armor that was once gleaming
silver-blue #8899aa but is now cracked and leaking dark purple void
energy #1a0a2a from every seam. The armor has a regal, military
design — shoulder plates #778899 (large, angular), chest plate
#8899aa with a gate emblem #ffcc33 (gold, cracked down the middle),
gauntlets #778899, heavy boots #556677. A tattered dark purple cloak
#1a0a2a hangs from the shoulders, dissolving into void wisps at the
bottom edges.

The head is a helmet #778899 with a cracked visor — glowing purple
void energy #aa44ff leaks from the eye slits (2x1px each, horizontal
glowing lines). Two curved horns #553322 (dark, 3px long) sweep back
from the helmet. The right arm holds a massive corrupted greatsword
#778899 (blade is half steel, half void energy #aa44ff crackling
along the edge, 8px long). The left arm is more corrupted — void
tendrils #1a0a2a extend from the gauntlet, and the left leg has
void energy replacing the armor entirely (unstable, shifting shape
#1a0a2a with #aa44ff glow).

IDLE ANIMATION (4 frames):
  Frame 1: Standing upright. Greatsword planted on the ground (blade
    pointing down, 2px in front of the feet). Cloak wisps hang
    downward. Void energy pulses #aa44ff at the cracks (normal).
  Frame 2: Void energy brightens #cc66ff (pulse). Cloak wisps shift
    1px. Left leg void energy shifts shape (1px distortion).
  Frame 3: Void energy returns to normal #aa44ff. Cloak returns.
  Frame 4: Subtle weight shift — body shifts 1px left, then right.
    Greatsword remains planted.

ATTACK ANIMATION — Void Slash (4 frames):
  Frame 1: Greatsword raises (shifts 4px up, blade pointing forward).
    Body shifts 2px back (wind-up). Void energy gathers at the blade
    #cc66ff.
  Frame 2: Greatsword slashes forward (shifts 6px forward, blade
    horizontal). A massive void slash effect #aa44ff (8x2px arc)
    extends from the blade tip. Body lunges 3px forward.
  Frame 3: Slash effect holds (still visible, fading to #552255).
    Greatsword begins to return.
  Frame 4: Greatsword returns to rest. Slash effect fades completely.
    Body returns to neutral.

ATTACK ANIMATION — Dark Pulse (4 frames):
  Frame 1: Body compresses (1px smaller). Arms spread wide. Void
    energy #aa44ff gathers at the center of the chest (3x3px glow).
  Frame 2: A ring of void energy #aa44ff (12px diameter, 1px thick)
    expands outward from the body. The ring is brightest at the
    top (closest to the boss) and fades at the edges.
  Frame 3: Ring continues expanding (16px diameter). Boss body
    returns to normal size.
  4: Ring fades to #552255 then disappears.

HURT ANIMATION (3 frames):
  Frame 1: Full-sprite flash #ffffff. Greatsword drops 2px. Body
    shifts 3px backward.
  Frame 2: New crack appears on the armor #1a0a2a (1px, on the
    chest plate). More void energy #aa44ff leaks. Left side
    corruption spreads 1px further.
  Frame 3: Body returns to neutral. New crack remains (permanent
    damage mark).

PHASE TRANSITION (at 50% HP, 6 frames):
  Frame 1: Full-sprite flash #ffffff. Body shifts 4px backward.
    Greatsword drops to the ground (shifts 6px forward).
  Frame 2: Body convulses — shifts 1px in random directions. Void
    energy #aa44ff erupts from all cracks simultaneously (4-5 new
    glow points).
  Frame 3: The helmet cracks further — the visor shatters (visor
    area becomes pure void #1a0a2a with #aa44ff glow). The horns
    #553322 grow 1px longer.
  Frame 4: The left arm's void tendrils grow longer (2px more).
    The left leg's void corruption spreads to the hip.
  Frame 5: Greatsword is re-absorbed into the right arm (the arm
    itself becomes the blade — the gauntlet #778899 extends into
    a void energy blade #aa44ff, 10px long).
  Frame 6: New stance — body leans forward (2px), both arms now
    have void blades (right: long blade #aa44ff, left: short
    tendril blade #1a0a2a). The boss is now more aggressive —
    faster attacks, more void energy.

APPEARANCE (PHASE 2 — 50% to 0% HP):
Same as Phase 1 but: helmet visor is fully shattered (pure void
#1a0a2a), horns are longer (4px), left side is more corrupted
(void energy #aa44ff covers the entire left arm and leg), both
arms end in void blades (right: long blade #aa44ff, left: short
tendril blade #1a0a2a), cloak is more tattered (shorter, more
wisps), and the chest plate has 3 visible cracks #1a0a2a (the
new one from transition + 2 more from damage).

DEFEAT ANIMATION (8 frames):
  Frame 1: Full-sprite flash #ffffff. Both void blades flicker
    #aa44ff → #552255.
  Frame 2: Body shifts 4px backward. Void blades dissolve (fade
    to #1a0a2a). Armor cracks widen — void energy #aa44ff pours
    from every seam.
  Frame 3: Body kneels (shifts 4px down). Helmet tilts forward.
    Horns #553322 crack (1px break on each horn).
  Frame 4: Body collapses forward (shifts 6px down, 4px wider —
    lying face-down). The greatsword (if it was dropped in Phase
    1) lies beside the body.
  Frame 5: Armor begins to dissolve — plates #8899aa break apart
    into pixels that float upward. Void energy #aa44ff wisps rise.
  Frame 6: Only the helmet #778899 and chest plate #8899aa remain
    (lying on the ground). The gate emblem #ffcc33 on the chest
    plate glows faintly — the last remnant of Kael's honor.
  Frame 7: Helmet and chest plate fade to #333333 (dark gray).
    The gate emblem fades to #666633 (dim gold).
  Frame 8: Only a void residue #1a0a2a (6x4px) and the dim gate
    emblem #666633 (1x1px) remain. The Stellar Gate portal behind
    the boss stabilizes (stops flickering) — the corruption is
    gone.

Palette: #8899aa (armor), #778899 (shoulder plates/gauntlets), #556677
(boots), #1a0a2a (cloak/void), #aa44ff (void energy), #cc66ff (bright
void), #553322 (horns), #ffcc33 (emblem), #552255 (dim void), #ffffff
(flash), #333333 (defeat dark), #666633 (dim emblem).
```

### B2. Drowned Matriarch (Boss 2 — Aquatic)

```
Pixel art boss sprite, 64x64 pixels, top-down view. The Drowned
Matriarch — the second boss, a massive aquatic entity that floods
its arena. Ethereal, tragic, beautiful.

APPEARANCE (PHASE 1):
A enormous jellyfish-like creature viewed from above. The main body
is a translucent bell #2244aa (blue-green, 20x20px, the largest
element) with bioluminescent patterns #44ff44 (bright green, 1px
lines forming organic, flowing patterns across the bell surface —
like a heartbeat made visible). The bell edges are slightly darker
#1a3366 (the rim). Embedded within the bell, a faint humanoid
silhouette #44aa66 at 30% opacity (the remains of the person the
Matriarch once was — arms outstretched, reaching upward).

Below the bell, dozens of translucent tentacles #2244aa flow
downward — 8 thick tentacles (2px wide, 12px long) and 16 thin
tentacles (1px wide, 8px long). The tentacles sway gently. Void-touched
water streaks #1a0a2a (dark purple, 1px wavy lines) contaminate
some of the tentacles (3-4 tentacles have void streaks). Small fish
#3a4a5a (1px each, 3-4) orbit the bell. A faint water ripple
effect #2244aa at 20% opacity surrounds the entire creature (2px
halo).

IDLE ANIMATION (4 frames):
  Frame 1: Bell centered. Tentacles hang straight down.
    Bioluminescent patterns #44ff44 pulse (normal brightness).
  Frame 2: Bell expands 1px (the creature "breathes"). Tentacles
    sway 1px to the right. Bioluminescent patterns brighten #66ff66.
  Frame 3: Bell contracts 1px. Tentacles sway 1px to the left.
    Patterns return to normal #44ff44.
  Frame 4: Same as Frame 1. Fish orbit one position.

ATTACK ANIMATION — Tidal Shield (4 frames):
  Frame 1: Bell compresses 1px. Tentacles pull inward (2px toward
    the bell). Water energy #2244aa gathers at the bell rim.
  2: A water barrier ring #2244aa (24px diameter, 2px thick)
    expands outward from the bell. The ring is brightest at the
    top (closest to the boss).
  Frame 3: Ring holds (still visible). Tentacles extend through
    the ring (they pass through the barrier).
  Frame 4: Ring fades to #1a3366 then disappears. Tentacles return
    to normal.

ATTACK ANIMATION — Void Tentacle Lash (4 frames):
  Frame 1: 4 thick tentacles #2244aa raise upward (shift 2px up).
    Void streaks #1a0a2a on the tentacles brighten #aa44ff.
  Frame 2: Tentacles lash forward (shift 6px in the attack direction).
    Void energy #aa44ff trails behind the tentacles (1px lines).
  Frame 3: Tentacles hold extended position. Void trails fade.
  Frame 4: Tentacles return to normal hanging position.

HURT ANIMATION (3 frames):
  Frame 1: Bell flashes white #ffffff. Tentacles splay outward (2px
    further from bell). Bioluminescent patterns flicker #44ff44 →
    #225533.
  Frame 2: A new void streak #1a0a2a appears on the bell (1px,
    permanent damage — the void corruption spreads). One tentacle
    darkens to #1a0a2a (permanently corrupted).
  Frame 3: Bell returns to normal. New void streak remains.

PHASE TRANSITION (at 50% HP, 6 frames):
  Frame 1: Bell flashes white #ffffff. Tentacles splay outward.
    Water in the arena rises (represented by the water ripple halo
    expanding to 6px).
  Frame 2: Bell convulses — shifts 1px in random directions. More
    void streaks #1a0a2a appear on the bell (3-4 new streaks).
  Frame 3: The humanoid silhouette within the bell becomes more
    visible (opacity increases to 50% — the person is "waking up").
    The silhouette's arms shift from reaching upward to reaching
    outward (more aggressive).
  Frame 4: More tentacles become void-corrupted (now 8-10 tentacles
    have void streaks #1a0a2a). The bioluminescent patterns #44ff44
    become erratic (some dim to #225533, others brighten to #66ff66).
  Frame 5: The bell grows 2px larger (the creature is swelling with
    void energy). New tentacles grow (2 more thick tentacles appear,
    already void-corrupted #1a0a2a).
  Frame 6: New stance — the bell tilts slightly (1px off-center),
    tentacles are more spread out (aggressive posture). The
    bioluminescent patterns now pulse erratically (some frames
    bright, some dim).

APPEARANCE (PHASE 2):
Same as Phase 1 but: bell is larger (22x22px), more void streaks
#1a0a2a on the bell (6-8), more corrupted tentacles (8-10 with
void streaks), bioluminescent patterns are erratic (mix of #44ff44
and #225533), humanoid silhouette is more visible (50% opacity,
arms reaching outward), and the water ripple halo is larger (4px)
and tinted purple #1a0a2a at the edges.

DEFEAT ANIMATION (8 frames):
  Frame 1: Bell flashes white #ffffff. All tentacles splay outward.
    Bioluminescent patterns go dark #1a1a2a.
  Frame 2: Bell begins to dissolve — the edges break apart into
    pixels #2244aa that float upward. Tentacles detach and float
    away.
  Frame 3: The humanoid silhouette #44aa66 becomes fully visible
    (100% opacity) — the person is being released. The silhouette
    is peaceful (arms at sides, no longer reaching).
  Frame 4: Bell is half-dissolved (only the core remains, 8x8px).
    The humanoid silhouette floats upward (shifts 2px up).
  Frame 5: Bell core dissolves completely. The humanoid silhouette
    is now free — it floats upward (shifts 4px up) and begins to
    fade (opacity decreases).
  Frame 6: The humanoid silhouette fades to 30% opacity. A single
    bioluminescent particle #44ff44 (1px) remains where the bell
    was — a remnant of the Matriarch's original light.
  Frame 7: The humanoid silhouette disappears. The bioluminescent
    particle pulses once (#44ff44 → #66ff66 → #44ff44).
  Frame 8: Only a water residue #1a3366 (6x6px) and the
    bioluminescent particle #44ff44 (1px) remain. The arena's water
    level drops (the flood recedes).

Palette: #2244aa (bell), #1a3366 (bell rim), #44ff44 (bioluminescence),
#66ff66 (bright bio), #225533 (dim bio), #1a0a2a (void streaks),
#44aa66 (humanoid silhouette), #3a4a5a (fish), #1a1a2a (dark bio),
#ffffff (flash).
```

### B3. Ash Tyrant Ignis (Boss 3 — Dragon)

```
Pixel art boss sprite, 64x64 pixels, top-down view. Ash Tyrant
Ignis — the third boss, a massive dragon. Drakkor's personal trial.
Ancient, powerful, tragic.

APPEARANCE (PHASE 1):
A massive four-legged dragon viewed from above. The body is a large
oval #881122 (dark red-black, 24x16px) — the largest element.
The belly and underwings are visible as a lighter area #ff8833
(pale orange, 12x8px, centered on the body) with visible vein-like
patterns of flowing lava #ff4400 (1px lines, organic shapes). The
head #881122 (8x6px) extends from the front — angular, with four
curved horns #553322 (2 large: 3px long, 2 small: 2px long), a wide
jaw with visible fangs #333333 (1px each, 4 visible), and burning
amber eyes #ffaa00 (2x2px each, the brightest element on the head,
with a fire halo #ff4400 at 30% opacity around each eye).

Two massive wings #881122 (12x8px each, folded against the sides
of the body) have tattered edges (1px gaps at the wing tips) showing
the glow of lava #ff4400 beneath. The tail #881122 (10px long,
tapering from 3px to 1px wide) extends from the rear, ending in a
spade-shaped club that glows white-hot #ffffff (2x2px, the
brightest element on the sprite).

Four legs #881122 (4x3px each) extend from the body corners, with
clawed feet #553322 (1px claws, 3 per foot). Smoke and ember
particles #ff4400 (1px dots, 4-5 per frame) float above the dragon.
Armor plates #333333 (dark metal, 2x2px each, 4-5 visible) are
bolted onto the body — remnants of a rider's saddle and armor,
now fused to the scales.

IDLE ANIMATION (4 frames):
  Frame 1: Wings folded. Tail at rest (curving to the right). Head
    facing forward. Eyes #ffaa00 glow normally. Ember particles
    float upward.
  Frame 2: Wings shift 1px (subtle movement). Tail sways 1px left.
    Eyes brighten #ffcc33. Lava veins #ff4400 pulse brighter.
  Frame 3: Wings return. Tail sways 1px right. Eyes return to
    #ffaa00. Lava veins return to normal.
  Frame 4: Head shifts 1px left, then right (looking around). Same
    as Frame 1 (loop).

ATTACK ANIMATION — Inferno Breath (6 frames):
  Frame 1: Head raises 2px. Mouth opens (jaw drops 1px). Fire
    gathers in the throat #ff4400 (2x2px glow inside the mouth).
  Frame 2: Fire builds #ff8833 (3x3px glow). Head tilts slightly
    forward. Body shifts 1px back (wind-up).
  Frame 3: Fire breath releases — a cone of fire #ff4400 (12px
    long, 8px wide at the base, tapering to 2px at the tip)
    extends from the mouth. The cone has a bright core #ffaa00
    (1px wide, centered in the cone) and ember particles #ffcc33
    (1px dots, 4-5) within it.
  Frame 4: Fire cone holds (still visible, fading to #cc2200).
    Head begins to lower.
  Frame 5: Fire cone fades to #881122 then disappears. Head
    returns to neutral.
  Frame 6: Brief pause — smoke #666666 at 30% opacity rises from
    the mouth (2px, 2-3 wisps).

ATTACK ANIMATION — Tail Sweep (4 frames):
  Frame 1: Tail raises 3px (the spade tip #ffffff brightens).
    Body shifts 1px forward (wind-up).
  Frame 2: Tail sweeps in a wide arc (shifts 8px to the left,
    curving). The spade tip leaves a trail of white-hot pixels
    #ffffff (1px each, 4-5 in an arc pattern).
  Frame 3: Tail continues the arc (shifts 8px to the right,
    passing through the center). Trail fades to #ffcc33.
  Frame 4: Tail returns to rest position (curving right). Trail
    fades completely.

HURT ANIMATION (3 frames):
  Frame 1: Full-sprite flash #ffffff. Wings splay outward (2px).
    Tail drops 2px. Eyes flicker #ffaa00 → #cc6600.
  Frame 2: A crack appears in one armor plate #333333 → #1a1a1a
    (the plate is damaged). Lava #ff4400 leaks from the crack (1px
    line). One horn #553322 cracks (1px break).
  Frame 3: Body returns to neutral. New crack and horn damage
    remain (permanent).

PHASE TRANSITION (at 50% HP, 6 frames):
  Frame 1: Full-sprite flash #ffffff. Wings spread fully (4px
    outward). Tail raises 4px. Eyes brighten #ffcc33.
  Frame 2: Body convulses — shifts 1px in random directions. Lava
    veins #ff4400 across the body brighten intensely #ff8833.
    All armor plates #333333 crack (1px lines on each plate).
  Frame 3: Wings grow 2px larger (the dragon is enraged). Horns
    #553322 grow 1px longer. New lava cracks #ff4400 appear on
    the body (3-4 new 1px lines).
  Frame 4: The spade tail tip #ffffff grows 1px larger and glows
    brighter (white-hot). Eyes #ffaa00 develop a larger fire halo
    #ff4400 (2px radius instead of 1px).
  Frame 5: Ember particles #ff4400 increase in number (8-10 instead
    of 4-5). Smoke #666666 at 30% opacity rises from the body
    (constant, not just during attacks).
  Frame 6: New stance — body lowers 1px (crouching, ready to
    pounce). Wings are half-spread (2px outward). Head is lower
    (1px down, more aggressive posture). The dragon is now in
    full combat mode.

APPEARANCE (PHASE 2):
Same as Phase 1 but: wings are larger (14x8px), horns are longer
(3px/3px), more lava cracks #ff4400 on the body (6-8), all armor
plates are cracked #1a1a1a, tail spade tip is larger (3x3px),
eyes have larger fire halos #ff4400 (2px radius), constant smoke
#666666 rises from the body, more ember particles #ff4400 (8-10),
and the body is slightly lowered (crouching posture).

DEFEAT ANIMATION (8 frames):
  Frame 1: Full-sprite flash #ffffff. Wings splay outward. Tail
    drops. Eyes flicker #ffaa00 → #cc6600 → #ffaa00.
  Frame 2: Body shifts 4px backward. Wings begin to fold (2px
    inward). Lava veins #ff4400 dim to #881122 (the fire is
    dying).
  Frame 3: Body kneels (shifts 4px down). Head lowers 2px. Eyes
    dim to #cc6600. Tail spade tip #ffffff dims to #ffcc33.
  Frame 4: Body collapses (shifts 6px down, 4px wider — lying
    on the ground). Wings fold completely against the body. Head
    rests on the ground.
  Frame 5: Lava veins #ff4400 cool to #331100 (dark, solidified).
    Eyes #cc6600 dim to #663300. Smoke stops rising.
  Frame 6: The body begins to turn to ash — the edges of the body
    #881122 break apart into gray pixels #666666 that float
    upward (ash particles).
  Frame 7: Only the horns #553322, skull #666666, and tail spade
    #ffcc33 remain (the indestructible parts). The eyes are dark
    #331100.
  Frame 8: The remains fade to #333333 (dark gray ash). A single
    ember #ff4400 (1px) glows faintly in the center of the ash
    pile — the last spark of the Ash Tyrant's fire. The arena's
    lava cools (the floor transitions from #ff4400 to #331100).

Palette: #881122 (body/scales), #ff8833 (belly), #ff4400 (lava),
#ffaa00 (eyes), #ffcc33 (bright eyes/spade), #553322 (horns/claws),
#333333 (armor), #1a1a1a (cracked armor), #ffffff (spade tip),
#666666 (smoke/ash), #cc6600 (dim eyes), #331100 (cooled lava),
#cc2200 (fading fire).
```

### B4. The Final Voidborn (Final Boss — Eldritch)

```
Pixel art boss sprite, 64x64 pixels, top-down view. The Final
Voidborn — the final boss, an eldritch entity from beyond the
dimensional rift. Cosmic horror, incomprehensible, terrifying.

APPEARANCE (PHASE 1 — Contained):
A swirling vortex of void energy in a roughly humanoid shape
(16x20px, the central mass). The body is pure void #0a0a1a
(near-black) with no fixed form — the edges shift and undulate
constantly. At the center, a massive single eye #aa44ff (purple,
4x4px, the brightest element) with a horizontal slit pupil
#ffffff (1px, the very center of the eye). The eye is the only
stable feature — everything else shifts.

The "arms" are long, multi-jointed appendages of void energy
#1a0a2a (1px wide, 12px long each, 2 visible) that extend from
the upper portion of the mass. They end in claw-like points
#aa44ff (1px, glowing). The "torso" has fragments of the Celestial
Crown embedded in it — 3 Crown shards #ffcc33/#44ddff/#aa44ff
(each 2x2px, different colors, the corrupted Crown energy)
embedded in the void mass at irregular positions. The shards
pulse with their respective colors.

Around the entity, reality warps — represented by distorted
pixels #1a0a2a (1px each, 8-10) that float in a 2px radius
around the body, their positions shifting every frame. Smaller
void tendrils #1a0a2a (1px, 4-6) extend from the bottom of the
mass, reaching downward like roots.

Fragments of destroyed reality orbit the entity: small pieces
of stone #333333 (1px each, 3-4), frozen star fragments #ffcc33
(1px each, 1-2), and broken ship parts #556677 (1px each, 1-2)
float in a 6px orbit around the central mass.

IDLE ANIMATION (4 frames):
  Frame 1: Central mass in neutral position. Arms at sides. Eye
    #aa44ff centered. Crown shards pulse (normal). Orbiting
    fragments at positions: upper-left, upper-right, lower-left,
    lower-right.
  Frame 2: Central mass shifts 1px in a random direction (the
    void is unstable). Arms shift 1px. Eye remains centered (it
    doesn't move with the body). Crown shards brighten #ffdd66/
    #66eeff/#cc66ff. Orbiting fragments shift 1px in their orbit.
  Frame 3: Mass shifts 1px in a different direction. Arms shift.
    Crown shards return to normal. Reality distortion pixels
    shift positions.
  Frame 4: Same as Frame 1 (loop). The entity is constantly
    shifting — nothing is stable except the eye.

ATTACK ANIMATION — Void Rift (6 frames):
  Frame 1: Eye #aa44ff brightens #cc66ff. Arms raise 2px. Crown
    shards #ffcc33/#44ddff/#aa44ff brighten simultaneously. Void
    energy gathers at the center of the mass (3x3px glow #aa44ff).
  Frame 2: A rift opens in front of the entity — a vertical line
    #1a0a2a (1px wide, 16px tall) appears 4px in front of the
    mass. The rift edges glow #aa44ff.
  Frame 3: The rift widens (2px wide). Void energy #aa44ff pours
    from the rift in a cone (8px long, 6px wide at the base).
    The cone has a bright core #cc66ff (1px wide).
  Frame 4: Rift holds (still wide, energy still pouring). Eye
    #aa44ff tracks the target (the eye shifts 1px in the attack
    direction — the only time the eye moves).
  Frame 5: Rift begins to close (1px wide). Energy cone fades
    to #552255.
  Frame 6: Rift closes completely. Eye returns to center. Arms
    return to sides.

ATTACK ANIMATION — Reality Warp (4 frames):
  Frame 1: Eye #aa44ff closes (becomes a horizontal line #aa44ff,
    4x1px). All orbiting fragments stop moving. The central mass
    compresses (2px smaller in all directions).
  Frame 2: The eye opens wide (4x4px, brighter #cc66ff). Reality
    distortion pixels #1a0a2a expand outward (4px radius instead
    of 2px). Orbiting fragments scatter (shift 2px outward in
    random directions).
  Frame 3: A wave of distorted reality #1a0a2a at 30% opacity
    expands outward from the entity (12px radius, 1px thick ring).
  Frame 4: Ring fades. Distortion pixels return to normal radius.
    Fragments return to orbit. Eye returns to normal #aa44ff.

HURT ANIMATION (3 frames):
  Frame 1: Full-sprite flash #ffffff. Central mass compresses (4px
    smaller). Arms retract 2px. Eye #aa44ff flickers #cc66ff →
    #552255 → #cc66ff. Crown shards flicker.
  Frame 2: A Crown shard cracks — one shard (random) develops a
    crack line #1a0a2a (1px). The shard's color dims (e.g.,
    #ffcc33 → #cc9900). The entity's mass is slightly smaller
    (permanent 1px shrink).
  Frame 3: Mass returns to normal size (minus the permanent shrink).
    Cracked shard remains damaged. Eye returns to #aa44ff.

PHASE TRANSITION (at 50% HP, 8 frames):
  Frame 1: Full-sprite flash #ffffff. Central mass compresses
    dramatically (6px smaller). All Crown shards #ffcc33/#44ddff/
    #aa44ff flash simultaneously.
  Frame 2: Mass convulses — shifts 2px in random directions. Arms
    extend to maximum length (4px longer). Eye #aa44ff opens
    wider (5x5px).
  Frame 3: The dimensional rift behind the entity widens
    (represented by a larger dark area #000000 behind the entity,
    4px wider). More reality fragments appear (6-8 instead of 3-4).
  Frame 4: Two new arms grow from the mass (now 4 arms total,
    all 12px long, ending in #aa44ff claws). The entity is now
    more complex, more threatening.
  Frame 5: The Crown shards grow larger (3x3px each) and glow
    brighter. The cracks in the shards widen (2px cracks).
  Frame 6: The eye #aa44ff develops a second ring — an outer
    glow #cc66ff at 30% opacity (2px radius around the eye).
  Frame 7: Reality distortion pixels #1a0a2a increase in number
    (12-16 instead of 8-10) and radius (3px instead of 2px).
  Frame 8: New stance — the entity is larger (20x24px instead of
    16x20px), more arms (4 instead of 2), larger eye (5x5px),
    brighter Crown shards, more distortion. The entity has
    broken free of its partial containment.

APPEARANCE (PHASE 2):
Same as Phase 1 but: larger mass (20x24px), 4 arms instead of 2,
larger eye (5x5px with outer glow), larger Crown shards (3x3px,
all cracked), more reality distortion (12-16 pixels, 3px radius),
more orbiting fragments (6-8), and a larger dimensional rift
behind the entity.

DEFEAT ANIMATION (10 frames):
  Frame 1: Full-sprite flash #ffffff. All 4 arms retract 4px.
    Eye #aa44ff brightens #cc66ff. Crown shards flash.
  Frame 2: Central mass compresses (6px smaller). Eye flickers
    #cc66ff → #552255 → #cc66ff. Crown shards crack further
    (3px cracks each).
  Frame 3: The dimensional rift behind the entity begins to close
    (the dark area #000000 shrinks 2px). Orbiting fragments
    fall (shift 2px downward).
  Frame 4: Mass convulses — shifts 2px in random directions.
    Arms extend and retract randomly (the entity is losing
    coherence). Eye #aa44ff dims to #552255.
  Frame 5: Crown shards begin to separate from the mass — they
    shift 2px outward, no longer embedded. The shards still glow
    but are free of the void.
  Frame 6: The central mass begins to dissolve — the edges break
    apart into pixels #1a0a2a that float upward. The eye #552255
    is the last part of the mass still visible.
  Frame 7: Only the eye #552255 (3x3px) and the 3 Crown shards
    #ffcc33/#44ddff/#aa44ff (now free, floating) remain. The eye
    is fading.
  Frame 8: The eye closes (becomes a horizontal line #552255,
    3x1px) then fades to #1a0a2a (1x1px). The Crown shards
    pulse once (brighten then dim).
  Frame 9: The eye disappears. The Crown shards #ffcc33/#44ddff/
    #aa44ff float in a triangular formation, glowing softly.
    A void residue #0a0a1a (4x4px) marks where the entity was.
  Frame 10: The Crown shards stabilize — they are now pure again
    (no void corruption, their original colors brighten: #ffcc33
    gold, #44ddff cyan, #aa44ff purple). They float in place,
    pulsing gently. The dimensional rift is fully closed (no more
    #000000 area). The arena's reality distortion fades (no more
    #1a0a2a pixels). The void is gone.

Palette: #0a0a1a (void mass), #1a0a2a (void tendrils/distortion),
#aa44ff (eye/energy), #cc66ff (bright eye), #552255 (dim eye),
#ffcc33 (Crown shard 1), #44ddff (Crown shard 2), #aa44ff (Crown
shard 3 — same as eye color, but distinct element), #ffffff (flash/
pupil), #000000 (dimensional rift), #333333 (stone fragments),
#556677 (ship fragments), #cc9900 (cracked gold shard).
```
