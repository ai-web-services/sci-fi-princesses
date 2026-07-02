# Pip — Robot Companion (Construct)

Small hovering drone with a single expressive eye.
Healer/buffer. Cheerful, literal, curious about organic emotions.
Ability: "Nano Swarm" — AoE heal over time.
Evolution: "Omega Core" — can resurrect fallen party members once
per battle.

Species traits: Immune to poison/bleed, -25% healing received, +30% buff duration.

See `GAME_DESIGN_DOC.md` § "Character Design" for full lore.

---

## Base Form — "Nano Drone" (Act 1, Pre-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
small hovering robot drone. Pip is a compact, rounded construct —
much smaller than the other characters (roughly 60% of their
height). Smooth rounded body #8899aa (steel blue-gray), single
large expressive eye #44ffff (bright cyan) in the center of the
body, two small rounded "ear" antennae #667788 on top of the
body, and a small thruster #553322 underneath that emits a faint
#44ffff glow (hovering effect). Two small articulated arms #667788
extend from the sides of the body, each ending in a three-fingered
gripper #8899aa. A small antenna rod #667788 extends from the
top of the body between the ear antennae, with a tiny #44ffff
light at the tip.

TOP-DOWN VIEW: Camera looks straight down. The body is a compact
rounded shape #8899aa — the smallest character silhouette in the
roster. The single large eye #44ffff is the dominant feature —
a bright cyan circle in the center of the body, taking up about
30% of the body area. The eye has a small #ffffff highlight dot
(expressive, curious). Two small ear antennae #667788 on top —
small rounded bumps. The antenna rod #667788 extends upward
between the ears with a tiny #44ffff light at the tip. Two small
arms #667788 extend from the sides — thin, articulated, with
three-fingered grippers #8899aa at the ends. The thruster
#553322 is visible from below as a small dark circle at the
bottom center of the body, with a faint #44ffff glow (1px glow
ring) indicating the hover effect. No legs — the character hovers.
A faint shadow #000000 at 20% opacity appears 1px below the body
(hovering above ground).

Stance: hovering, slightly tilted as if curious (body angled 5-10
degrees). The eye is the focal point — bright, expressive, and
friendly. Background: clean tech environment with soft blue
ambient light, faint circuit patterns. Rim lighting from upper
left in cool cyan #44ffff. 16-bit pixel art style, clean 2px-wide
outlines, limited palette, SNES-era RPG character sprite aesthetic.
No anti-aliasing on pixel edges.

Palette: body #8899aa, eye #44ffff, antennae #667788, arms
#667788, grippers #8899aa, thruster #553322, thruster glow
#44ffff, antenna light #44ffff, highlight #ffffff, shadow
#000000 at 20% opacity, outline #1a1a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Pip, small hovering
robot drone. 16-bit SNES-era RPG style. TOP-DOWN orthographic
perspective — camera looks straight down at the character.

Canvas: 32x40 pixels per frame (same grid as other characters,
but the sprite itself is smaller within the canvas — approximately
20x20 pixels of actual sprite content centered in the frame).
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

IMPORTANT: Pip is a hovering drone — NO LEGS, NO FEET. The body
hovers above the ground. Movement is smooth gliding (not walking).
The thruster glow indicates hover height.

SHEET LAYOUT — 4 rows (directions) × 4 frames (actions):

ROW 1 — FACING DOWN (toward camera):
  Frame 1 (idle): Hovering in place. Compact rounded body #8899aa
    centered in the frame. Single large eye #44ffff in the center
    of the body — a bright cyan circle with a small #ffffff
    highlight dot (upper-left of the eye, for the upper-left
    light source). Two small ear antennae #667788 on top of the
    body (small rounded bumps). Antenna rod #667788 extending
    upward between the ears with a tiny #44ffff light at the tip.
    Two small arms #667788 extending from the sides, each with
    three-fingered grippers #8899aa at the ends. Thruster #553322
    visible at the bottom center of the body — a small dark circle
    with a 1px #44ffff glow ring. Shadow #000000 at 20% opacity
    1px below the body (hovering indicator). The eye is the
    focal point — bright, expressive, curious.

  Frame 2 (glide step A): Gliding downward. The body shifts 1
    pixel down. Thruster glow #44ffff brightens slightly (thrust).
    Arms shift slightly forward (down) from momentum. Ear antennae
    tilt back slightly from movement. Shadow shifts down with the
    body. Eye unchanged (always facing "forward" relative to the
    body).

  Frame 3 (glide step B): Gliding downward, continuing. Body
    shifts another pixel down. Thruster glow returns to normal.
    Arms return to neutral position. This is a smooth glide, not
    a step — the movement is fluid, not jerky.

  Frame 4 (idle hover bob): The body bobs gently — shifts 1 pixel
    up, then back to center. This is the idle hover animation (the
    drone naturally bobs while hovering). Thruster glow pulses
    slightly. Eye unchanged. Arms sway 1 pixel outward then back.

ROW 2 — FACING UP (away from camera, showing back):
  Frame 1 (idle): Back of the drone visible. The body #8899aa is
    the same rounded shape. From behind, the eye is NOT visible
    (it's on the front). The back of the body has a small access
    panel #667788 (a small rectangular detail) and the antenna
    rod #667788 with #44ffff light is visible from behind. Ear
    antennae #667788 visible from behind. Arms #667788 at sides.
    Thruster #553322 with #44ffff glow at bottom center. Shadow
    1px below. The back of the body is less detailed than the
    front — the eye is the front identifier.

  Frame 2 (glide step A): Gliding upward (away from camera). Body
    shifts 1 pixel up. Thruster glow brightens. Arms shift
    slightly forward (up). Ear antennae tilt back.

  Frame 3 (glide step B): Continuing glide. Body shifts another
    pixel up. Thruster normalizes.

  Frame 4 (idle hover bob): Body bobs 1 pixel down then back to
    center. Thruster pulses.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. The body #8899aa is visible from
    the left side — a rounded shape. The eye #44ffff is visible
    on the left side of the body (it's a single central eye, so
    from the side it appears as a cyan shape on the left face of
    the body). Left arm #667788 visible extending to the left,
    gripper #8899aa. Right arm hidden behind body. Left ear
    antenna #667788 visible. Antenna rod #667788 with #44ffff
    light on top. Thruster #553322 with #44ffff glow at bottom.
    Shadow 1px below.

  Frame 2 (glide step A): Gliding left. Body shifts 1 pixel left.
    Thruster glow brightens. Left arm shifts back slightly from
    momentum. Ear antennae tilt right (opposite to movement).

  Frame 3 (glide step B): Continuing glide left. Body shifts
    another pixel left.

  Frame 4 (idle hover bob): Body bobs 1 pixel right then back.
    Thruster pulses.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Right arm visible, right ear
    antenna visible, eye visible on the right side of the body.

CONSISTENCY RULES across all 16 frames:
- Body always compact and rounded, #8899aa (steel blue-gray)
- Eye always #44ffff (bright cyan), large, central, with
  #ffffff highlight dot — the dominant feature
- Eye is visible from DOWN, LEFT, and RIGHT views (it's a central
  eye on the front face of the body)
- Eye is NOT visible from UP view (back of drone)
- Ear antennae always #667788, two small rounded bumps on top
- Antenna rod always #667788 with #44ffff light at tip
- Arms always #667788 with #8899aa three-fingered grippers
- Thruster always #553322 with #44ffff glow ring at bottom center
- Shadow always #000000 at 20% opacity, 1px below body
- NO LEGS, NO FEET — hovering drone
- Movement is smooth gliding (not walking), 1px shifts
- Idle animation is a gentle hover bob (1px up/down)
- Outline #1a1a2a on all edges
- Lighting from upper-left on all frames
```

---

## Evolution — "Omega Core" (Post-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
robot drone omega core. Pip in its evolved form.

TOP-DOWN VIEW: The body #8899aa has become slightly larger and
more elaborate — additional panel lines #667788 and a faint
#44ffff energy glow at the edges of every panel. The single eye
#44ffff is now larger and more expressive — it has a faint
#ffffff inner glow and a more complex shape (slightly more
angular, with a subtle omega symbol Ω shape visible in the center
of the eye in #ffffff). The ear antennae #667788 are now larger
and have #44ffff lights at the tips. The antenna rod #667788 is
taller and has a larger #44ffff light at the tip (brighter, more
prominent). The arms #667788 are now more articulated — an
additional joint is visible, and the grippers #8899aa now have
#44ffff energy between the fingers (nano swarm energy visible as
tiny #44ffff dots floating near the grippers). The thruster
#553322 now has a larger #44ffff glow (2px glow ring instead of
1px) — the drone hovers higher. A faint #44ffff energy field
surrounds the entire drone — a 1px ring of cyan light at the
silhouette edges, with tiny #44ffff particles (3-4) floating
around the body (nano swarm particles). The shadow #000000 at
20% opacity is now 2px below the body (hovering higher).

Stance: hovering confidently, eye bright and focused, nano swarm
particles orbiting. Background: high-tech clean room with blue
energy conduits, data streams, faint holographic displays. Rim
lighting from upper left in cool cyan #44ffff. 16-bit pixel art
style, clean outlines, more advanced and powerful than base form.

Palette adds: energy glow #44ffff, nano particles #44ffff,
omega symbol #ffffff, energy field #44ffff.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Pip "Omega Core"
evolution. 16-bit SNES-era RPG style. TOP-DOWN orthographic
perspective. Canvas: 32x40 pixels per frame. Transparent
background. Outline: 1px near-black #1a1a2a. No anti-aliasing.
Palette restricted to 16 colors max.

IMPORTANT: Pip is a hovering drone — NO LEGS, NO FEET. Movement
is smooth gliding. The evolved form hovers higher (shadow is 2px
below body instead of 1px).

SHEET LAYOUT — 4 rows × 4 frames:

ROW 1 — FACING DOWN:
  Frame 1 (idle): Larger, more elaborate body #8899aa with
    additional panel lines #667788 and #44ffff energy glow at
    every panel edge. Larger eye #44ffff with #ffffff inner glow
    and a subtle omega symbol Ω shape in #ffffff in the center
    of the eye. Larger ear antennae #667788 with #44ffff lights
    at the tips. Taller antenna rod #667788 with larger #44ffff
    light at tip. More articulated arms #667788 with additional
    joints visible, grippers #8899aa with #44ffff energy dots
    between the fingers (nano swarm energy — 2-3 tiny #44ffff
    dots near each gripper). Thruster #553322 with larger #44ffff
    glow ring (2px). Energy field: 1px #44ffff ring at silhouette
    edges. Nano particles: 3-4 tiny #44ffff dots floating around
    the body (positions: upper-left, upper-right, lower-left,
    lower-right of the sprite). Shadow #000000 at 20% opacity,
    2px below body (hovering higher).

  Frame 2 (glide step A): Gliding downward. Body shifts 1 pixel
    down. Thruster glow #44ffff brightens. Nano particles drift
    backward (up) from momentum. Arms shift slightly forward
    (down). Ear antennae tilt back. Eye unchanged. Energy field
    pulses outward 1px.

  Frame 3 (glide step B): Continuing glide. Body shifts another
    pixel down. Nano particles continue drifting. Thruster
    normalizes.

  Frame 4 (idle hover bob): Body bobs 1 pixel up then back to
    center. Nano particles orbit one position (upper-left moves
    to lower-left, etc.). Thruster pulses. Energy field pulses.
    Eye glow brightens slightly then dims.

ROW 2 — FACING UP:
  Frame 1 (idle): Back of the evolved drone. Body #8899aa with
    panel lines #667788 and #44ffff edge glow. Access panel
    #667788 on the back. Antenna rod #667788 with larger #44ffff
    light visible from behind. Ear antennae #667788 with #44ffff
    tip lights. Arms at sides. Thruster with larger glow. Energy
    field ring. Nano particles orbiting. Shadow 2px below. No
    eye visible (back).

  Frames 2-4: Glide cycle with nano particle drift. Energy field
    pulses. Thruster brightens during glide.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Larger body with panel lines and
    energy glow. Larger eye #44ffff with omega symbol visible on
    the left side of the body. Left arm with additional joint
    and nano energy dots at gripper. Left ear antenna with
    #44ffff tip light. Antenna rod with larger light. Thruster
    with larger glow. Energy field. Nano particles. Shadow 2px
    below.

  Frames 2-4: Glide cycle. Nano particles drift. Energy field
    pulses.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row.

EVOLUTION-SPECIFIC DETAILS (all frames):
- Body: larger, more elaborate, #8899aa with #667788 panel lines
  and #44ffff edge glow
- Eye: larger, #44ffff with #ffffff inner glow and omega symbol
  Ω in #ffffff at center
- Ear antennae: larger, #667788 with #44ffff tip lights
- Antenna rod: taller, #667788 with larger #44ffff light
- Arms: more articulated (additional joint), grippers #8899aa
  with #44ffff nano energy dots between fingers
- Thruster: #553322 with larger #44ffff glow ring (2px)
- Energy field: #44ffff 1px ring at silhouette edges
- Nano particles: 3-4 #44ffff dots floating around body, orbit
  during idle, drift backward during glide
- Shadow: 2px below body (hovering higher than base)
```

---

## Chibi / Icon Variant (UI, Save Slots, Map Marker)

```
Pixel art chibi icon, top-down view, full body (the whole drone
is the icon), robot drone. Pip in super-deformed chibi style,
16x16 or 32x32 pixel canvas.

TOP-DOWN: The entire drone fills the icon. Compact rounded body
#8899aa. Single large eye #44ffff dominates the center of the
icon, taking up 40% of the canvas, with a #ffffff highlight dot.
Two small ear antennae #667788 on top. A tiny antenna rod
#667788 with a bright #44ffff dot at the tip. Two tiny arms
#667788 extending from the sides with small gripper shapes
#8899aa. A small thruster glow #44ffff visible at the bottom
center. Clean black outline #1a1a2a. No shading — flat colors
only for tiny scale readability. Transparent background.

Palette: #8899aa body, #44ffff eye/antenna, #667788 antennae/arms,
#8899aa grippers, #ffffff highlight.
```
