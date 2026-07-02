# Lyra Solari — Main Character Prompts

Protagonist of Stellar Princesses. Human, early 20s, golden blonde
hair with side bangs, cyan eyes. Heir to the Celestial Crown.
Archetype: Princess → Warrior → Ascendant.

See `GAME_DESIGN_DOC.md` § "Character Design" for full lore.

---

## Base Form — "Crown Bearer" (Act 1, Pre-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
princess warrior. Young human woman, early 20s, warm peach skin,
golden blonde hair worn long with side bangs, striking cyan eyes.
Wearing a fitted deep blue military-style jacket with gold trim
and silver buckle details, dark fitted pants, knee-high boots.
A small broken crown fragment glows faintly on a chain around her
neck — the first Crown Shard, emitting soft white-blue light.

TOP-DOWN VIEW: Camera looks straight down. Visible: top of head
(hair is the dominant shape — a flat golden mass with side bangs
framing where the face would be), shoulders (widest part of the
body, deep blue jacket with gold trim along the shoulder line),
arms hanging at sides (skin-colored small shapes), torso (jacket
front with a central zipper line and gold belt buckle), legs (dark
pants, two distinct shapes), boots (dark, directional — pointing
the facing direction).

She stands in a confident but slightly uncertain pose — one hand
near the shard on her chest, the other relaxed at her side.
Background: soft starfield with faint nebula purple haze. Rim
lighting from upper left in cool white. 16-bit pixel art style,
clean 2px-wide outlines, limited palette, SNES-era RPG character
sprite aesthetic. No anti-aliasing on pixel edges.

Palette: skin #ffccaa, hair #ffdd44/#cc8833, eyes #44ddff,
jacket #3344aa/#223388, gold trim #ffcc33, metal #778899,
pants #222233, boots #111111, outline #1a1a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Lyra Solari,
sci-fi princess. 16-bit SNES-era RPG style. TOP-DOWN orthographic
perspective — camera looks straight down at the character.

Canvas: 32x40 pixels per frame. Transparent background.
Outline: 1px near-black #1a1a2a. No anti-aliasing.
Palette restricted to 16 colors max per character.

SHEET LAYOUT — 4 rows (directions) × 4 frames (actions):

ROW 1 — FACING DOWN (toward camera):
  Frame 1 (idle): Standing still. Top of head visible — golden
    blonde hair as a flat mass, side bangs hanging on both sides
    of the forehead area. Shoulders in deep blue jacket with gold
    trim along the top edge. Jacket front visible: central zipper
    line in #778899, gold belt buckle #ffcc33 at the waist. Arms
    at sides in skin #ffccaa. Dark pants #222233. Boots #111111
    pointing downward. Crown Shard on chain: small #ffffff glow
    dot at chest level. Cyan eyes #44ddff visible as two small
    dots in the face area (upper third of head, below hair bangs).

  Frame 2 (walk step A): Left leg forward, right leg back. Left
    boot shifted down, right boot shifted up. Arms swing opposite:
    right arm slightly forward (down), left arm slightly back.
    Hair shifts slightly to the right from momentum. Jacket and
    torso face the camera (top-down) — no change in upper body
    angle. Belt buckle centered.

  Frame 3 (walk step B): Mirror of step A. Right leg forward, left
    leg back. Left arm forward, right arm back. Hair shifts left.

  Frame 4 (idle breathing): Same as idle but torso shifted 1 pixel
    up, shoulders relaxed 1 pixel down. Subtle breathing motion.
    Hair unchanged. Arms unchanged.

ROW 2 — FACING UP (away from camera, showing back):
  Frame 1 (idle): Back of head visible — golden blonde hair as a
    flat mass, no face visible. Back of deep blue jacket #3344aa,
    no front details (no zipper, no belt buckle visible from back).
    Gold trim along the collar edge at the neck. Shoulders same
    width as front view. Arms at sides in skin #ffccaa. Dark pants
    #222233. Boots #111111 pointing upward (away from camera).
    No Crown Shard visible (it's on the front of her chest).

  Frame 2 (walk step A): Left leg forward (up), right leg back
    (down). Arms swing: right arm forward (up), left arm back.
    Hair shifts slightly right. Jacket back panels shift with leg
    movement.

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Left arm forward, right arm back. Hair shifts
    left.

  Frame 4 (idle breathing): Same as idle but torso shifted 1 pixel
    down (slight slouch). Hair unchanged.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left side of head visible — golden blonde hair
    with left side bang. Left arm visible at left side in skin
    #ffccaa, right arm hidden behind torso. Jacket left panel
    #3344aa with gold trim on the left shoulder. Torso narrower
    than front view (side profile). Left leg visible, right leg
    hidden behind. Left boot #111111 pointing left. Crown Shard
    partially visible at the left edge of the chest area.

  Frame 2 (walk step A): Left leg forward (left), right leg back
    (right). Left arm swings back, right arm (hidden) swings
    forward. Hair shifts left from momentum.

  Frame 3 (walk step B): Right leg forward (left — crossing over),
    left leg back. Hair shifts right.

  Frame 4 (idle breathing): Subtle torso shift. Left arm sways 1
    pixel outward.

ROW 4 — FACING RIGHT:
  Frame 1 (idle): Mirror of LEFT view. Right side of head, right
    bang, right arm visible, left arm hidden. Jacket right panel.
    Right boot pointing right.

  Frames 2-4: Mirror of LEFT row walk cycle and breathing.

CONSISTENCY RULES across all 16 frames:
- Hair color always #ffdd44 (highlight) / #cc8833 (shadow)
- Jacket always #3344aa (primary) / #223388 (shadow)
- Skin always #ffccaa (highlight) / #ddaa88 (shadow)
- Boots always #111111
- Pants always #222233
- Belt buckle #ffcc33 only visible in DOWN and UP rows
- Crown Shard glow #ffffff only visible in DOWN row (front)
- Cyan eyes #44ddff only visible in DOWN row (face visible)
- Outline #1a1a2a on all edges
- Lighting from upper-left on all frames
```

---

## Evolution 1 — "Starforged" (Act 2, After 3rd Shard)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
princess ascended. Same character as base form but visibly more
powerful.

TOP-DOWN VIEW: Golden blonde hair now has glowing streaks of
white-light (#ffffff) running through it — visible as bright
pixels within the hair mass. Cyan eyes glow faintly (larger than
base, 3x3 pixels instead of 2x2). The deep blue jacket now has
luminous purple (#aa44ff) circuit-like patterns tracing the seams
— visible as glowing lines along the shoulder edges, down the
sleeve lines, and across the chest. The broken crown fragment has
grown into a partial crown hovering just above her head, made of
hard-light prismatic energy (#ffffff with #aa44ff edges), casting
a faint rainbow glow on the hair below it. She wears a short cape
or half-cloak in dark purple (#1a0a2a) that fades to transparent
at the edges, attached at the shoulders, flowing behind her (visible
as a dark shape extending from the shoulder line). Stance is more
confident — feet planted wider, one hand extended slightly with
energy crackling at the fingertips (#ffcc33 sparks).

Background: dramatic starfield with a large nebula in purple and
blue behind her, energy particles floating. Rim lighting is now
bi-colored: cool white from left, warm gold from right. 16-bit
pixel art style, clean outlines, slightly more detail than base
form.

Palette adds: energy glow #aa44ff, hard-light crown #ffffff,
cape #1a0a2a, energy sparks #ffcc33.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Lyra Solari
"Starforged" evolution. 16-bit SNES-era RPG style. TOP-DOWN
orthographic perspective. Canvas: 32x40 pixels per frame.
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

SHEET LAYOUT — 4 rows × 4 frames (same grid as base form):

ROW 1 — FACING DOWN:
  Frame 1 (idle): Hair mass with glowing white streaks (#ffffff
    pixels within #ffdd44 hair). Partial crown hovering 2-3px
    above head — a small arc of hard-light (#ffffff center,
    #aa44ff edges) with one visible shard point. Jacket front
    with purple circuit lines (#aa44ff) glowing along shoulder
    seams and down the zipper line. Cape attached at shoulders,
    flowing downward (behind torso) as a dark purple #1a0a2a
    shape with transparent fade at edges. Belt buckle #ffcc33.
    Cyan eyes #44ddff slightly larger (3x3px). Crown Shard glow
    at chest: larger than base, #ffffff 3x3px glow.

  Frames 2-4: Same walk cycle and breathing as base form, but
    with energy particles (#ffcc33 1px dots) floating around the
    extended hand in walk frames. Cape sways opposite to leg
    movement (cape flows behind, shifts with momentum).

ROW 2 — FACING UP:
  Frame 1 (idle): Back of hair with white streaks. Jacket back
    with circuit lines visible along the back seam (vertical
    #aa44ff line down center back). Cape is the dominant feature
    from behind — a dark purple #1a0a2a shape extending from
    shoulders down past the waist, fading to transparent at the
    bottom edge. Partial crown visible above head (same arc).
    No face, no Crown Shard (front only).

  Frames 2-4: Walk cycle with cape physics — cape sways opposite
    to leg movement. Energy particles trail from the cape edges
    in walk frames.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Hair with white streaks. Left arm
    visible with circuit line glowing along the sleeve edge
    (#aa44ff). Cape visible as a dark shape extending from the
    right shoulder (behind torso). Jacket left panel with circuit
    line along the shoulder seam. Left boot pointing left.

  Frames 2-4: Walk cycle. Cape sways. Energy particles at
    fingertips of the forward-swinging arm.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row.

EVOLUTION-SPECIFIC DETAILS (all frames):
- Circuit lines: #aa44ff, 1px wide, along jacket seams only
- Crown arc: #ffffff center, #aa44ff glow, 2-3px above head
- Cape: #1a0a2a solid at shoulders, fading to transparent
- Energy particles: #ffcc33, 1px dots, max 3 per frame
- Hair streaks: #ffffff pixels within hair, max 4 per frame
```

---

## Evolution 2 — "Celestial Ascendant" (Act 3, Final Form)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
goddess emperor. Lyra in her ultimate form.

TOP-DOWN VIEW: Hair is now fully luminous — golden blonde
transformed into flowing light, almost white-gold (#ffffff with
#ffcc33 warm tones), moving as if in zero gravity (hair extends
beyond the normal hair silhouette by 2-3px in all directions,
with a slight animated-flow shape). Eyes are solid cyan light
#44ddff with no visible pupil — larger than previous evolutions
(4x4px). The Celestial Crown is complete: a full circlet of
hard-light prismatic energy (#ffffff with rainbow refraction
edges in #aa44ff, #ffcc33, #44ddff) with three large shard
points visible above the head, floating 3-4px above the hair,
casting prismatic light across the hair below. Her outfit has
evolved into ornate light-armor: the base is still deep blue
#3344aa but now covered in intricate glowing purple-gold patterns
(#aa44ff and #ffcc33) resembling constellations — visible as
a network of connected glowing dots and lines across the jacket
front and shoulders. A full cape of pure energy flows behind her
— translucent, shifting between deep purple #1a0a2a and starfield
patterns with tiny stars (#ffffff 1px dots) visible within it,
extending 8-10px beyond the shoulder line. She hovers slightly
off the ground (no shadow beneath her, or a very faint #1a0a2a
shadow 2px below the feet). Both hands are raised slightly, palms
open, with energy orbs floating above each — one gold #ffcc33
(creation), one purple #aa44ff (void/destruction), each 3x3px
with a 1px glow halo.

Background: cosmic — a massive galaxy spiral behind her, stars
being born, the void of space. She is the brightest element in
the frame. Lighting: self-illuminated character with strong
bloom effect on energy elements, rim light is prismatic rainbow.
16-bit pixel art style pushed to the maximum detail while
maintaining pixel clarity.

Palette dominated by: #ffcc33 gold energy, #aa44ff purple power,
#44ddff cyan eyes/crown, #ffffff highlights, #1a0a2a shadows.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Lyra Solari
"Celestial Ascendant" final evolution. 16-bit SNES-era RPG style.
TOP-DOWN orthographic perspective. Canvas: 32x40 pixels per frame.
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

SHEET LAYOUT — 4 rows × 4 frames:

ROW 1 — FACING DOWN:
  Frame 1 (idle): Hair is luminous white-gold (#ffffff/#ffcc33)
    extending 2-3px beyond normal silhouette in all directions
    (flowing light effect). Complete Celestial Crown floating
    3-4px above head — full circlet (#ffffff) with three shard
    points (top, left, right) in #ffffff with #aa44ff and
    #ffcc33 refraction edges. Jacket front covered in constellation
    patterns: network of #aa44ff and #ffcc33 connected dots and
    lines across the chest and shoulders. Eyes solid cyan #44ddff
    (4x4px). Energy orbs floating at each hand: gold #ffcc33
    (left hand) and purple #aa44ff (right hand), each 3x3px
    with 1px glow halo. Cape of pure energy extends from
    shoulders — translucent #1a0a2a with tiny #ffffff star
    dots within it, flowing downward past the waist. No ground
    shadow (hovering). Constellation pattern on jacket: connected
    glowing dots forming star-map shapes.

  Frame 2 (walk step A): Left leg forward, right leg back. Hair
    flows backward (shifts up) from momentum. Crown stays level
    above head. Cape flows backward (up) and sways right. Energy
    orbs trail slightly behind the hands. Constellation patterns
    shift with torso movement. Energy particles (#ffcc33 and
    #aa44ff 1px dots, max 5 total) float around the character.

  Frame 3 (walk step B): Mirror of step A. Right leg forward.
    Cape sways left. Hair flows backward.

  Frame 4 (idle breathing): Hair pulses slightly (expands 1px in
    all directions then contracts). Crown glows brighter (#ffffff
    pixels increase). Energy orbs pulse. Cape's internal stars
    shift position. Constellation lines brighten.

ROW 2 — FACING UP:
  Frame 1 (idle): Back of luminous hair (white-glowing, flowing).
    Crown visible above head (full circlet with three points).
    Jacket back covered in constellation patterns — denser than
    front, covering the full back panel with #aa44ff and #ffcc33
    connected dots. Cape is the dominant feature — full energy
    cape extending 8-10px from shoulders, translucent #1a0a2a
    with starfield pattern (#ffffff dots), flowing downward.
    No face, no Crown Shard. No energy orbs visible from behind
    (they're in front of the character).

  Frames 2-4: Walk cycle with dramatic cape physics — cape flows
    opposite to leg movement, extends further in walk frames.
    Energy particles trail from cape edges. Constellation patterns
    on back shift with movement.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Luminous hair flowing. Left arm
    visible with constellation pattern on the sleeve. Energy orb
    (gold #ffcc33) visible at left hand. Cape extends from right
    shoulder (behind torso) as a large translucent energy shape.
    Jacket left panel with constellation pattern. Crown above head.
    Left boot pointing left. No ground shadow.

  Frames 2-4: Walk cycle. Cape sways dramatically. Energy orb
    trails behind forward-swinging arm. Energy particles around
    the character.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Energy orb at right hand is
    purple #aa44ff (void/destruction).

FINAL EVOLUTION-SPECIFIC DETAILS (all frames):
- Hair: #ffffff/#ffcc33, extends 2-3px beyond normal silhouette
- Crown: full circlet, 3 shard points, #ffffff with rainbow edges
- Constellation patterns: #aa44ff + #ffcc33 dots/lines on jacket
- Cape: translucent #1a0a2a with #ffffff star dots, 8-10px flow
- Energy orbs: #ffcc33 (gold/left) and #aa44ff (purple/right),
  3x3px with 1px glow halo, only in DOWN and SIDE views
- Energy particles: #ffcc33 and #aa44ff 1px dots, max 5 per frame
- No ground shadow (hovering)
- Eyes: solid #44ddff, 4x4px, only in DOWN view
```

---

## Chibi / Icon Variant (UI, Save Slots, Map Marker)

```
Pixel art chibi icon, top-down view, head-and-shoulders only,
sci-fi princess. Lyra Solari in super-deformed chibi style,
16x16 or 32x32 pixel canvas.

TOP-DOWN: Top of head fills most of the canvas. Golden blonde
hair #ffdd44 as a large round mass taking up the top 60% of the
icon. Side bangs visible as small hair shapes on the left and
right edges of the head. Face area (bottom 40% of head): two
oversized cyan eyes #44ddff with white #ffffff highlight dots,
small confident smile. Shoulders visible below head — deep blue
jacket #3344aa with a tiny gold #ffcc33 collar detail. The Crown
Shard visible as a small glowing #ffffff dot on the chest area.

Clean black outline #1a1a2a. No shading — flat colors only for
tiny scale readability. Transparent background.

Palette: #ffccaa skin, #ffdd44 hair, #44ddff eyes, #3344aa
jacket, #ffcc33 accent, #ffffff highlight.
```
