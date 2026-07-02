# Brimble Toadsworth — Frog Person (Anura)

Stocky, wide mouth, powerful legs, bioluminescent throat sac.
Gentle tank/support. Philosophical, calls everyone "friend."
Ability: "Tidal Shield" — creates a water barrier that absorbs
damage and heals allies inside.
Evolution: "Leviathan Sovereign" — summons massive water constructs.

Species traits: +30% max HP, +20% healing received, -15% speed.

See `GAME_DESIGN_DOC.md` § "Character Design" for full lore.

---

## Base Form — "Tidal Guardian" (Act 1, Pre-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
frog person tank. Stocky, wide-bodied anura man, broad shoulders,
green skin #44aa66, wide mouth, large round eyes #44ff44 with
horizontal pupils, bioluminescent throat sac #44ff44 that glows
softly. Powerful legs folded beneath him (thick and muscular from
above).

Wearing a heavy-duty blue-gray armor vest #667788 over a simple
green tunic #44aa66, the armor has rounded plates suited to his
wide frame. Thick armored boots #553322. A large round shield
#667788 with a water-drop emblem #2244aa is strapped to his left
arm. A simple belt #553322 with a water flask #2244aa. His hands
are wide and webbed #44aa66.

TOP-DOWN VIEW: Camera looks straight down. The dominant feature is
his wide, stocky silhouette — shoulders are the widest part of the
body, broader than any other character. Green skin #44aa66 visible
on the face area (round, wide head). Large round eyes #44ff44 with
horizontal pupils (wide oval shapes) in the face area. Wide mouth
visible as a broad line across the lower face. Bioluminescent
throat sac #44ff44 visible as a glowing round shape at the front
of the neck/upper chest area — it pulses with soft green light.
Armor vest #667788 covers the torso, with rounded plate edges
visible at the shoulders. Shield #667788 on the left arm — a
large round shape with #2244aa water-drop emblem. Right hand
visible at the side, wide and webbed #44aa66. Powerful legs from
above — thick, muscular shapes, wider than human legs, folded
beneath the body. Armored boots #553322 at the bottom. Belt
#553322 with water flask #2244aa at the waist.

Stance: solid and grounded, feet planted wide, shield arm forward.
Background: calm water surface with gentle ripples, soft blue
ambient light. Rim lighting from upper left in cool white. 16-bit
pixel art style, clean 2px-wide outlines, limited palette, SNES-era
RPG character sprite aesthetic. No anti-aliasing on pixel edges.

Palette: skin #44aa66, eyes #44ff44, throat sac #44ff44, armor
#667788, tunic #44aa66, shield #667788, emblem #2244aa, boots
#553322, belt #553322, flask #2244aa, outline #1a1a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Brimble Toadsworth,
frog person tank. 16-bit SNES-era RPG style. TOP-DOWN orthographic
perspective — camera looks straight down at the character.

Canvas: 32x40 pixels per frame. Transparent background.
Outline: 1px near-black #1a1a2a. No anti-aliasing.
Palette restricted to 16 colors max per character.

SHEET LAYOUT — 4 rows (directions) × 4 frames (actions):

ROW 1 — FACING DOWN (toward camera):
  Frame 1 (idle): Standing solid. Top of head visible — round,
    wide head shape. Green skin #44aa66. Large round eyes #44ff44
    with horizontal pupils (wide oval shapes) in the face area,
    positioned wide apart on the round head. Wide mouth as a broad
    line across the lower face. Bioluminescent throat sac #44ff44
    visible as a glowing round shape at the front of the neck area
    (upper chest), pulsing softly. Armor vest #667788 covering the
    torso — wide, stocky shape with rounded shoulder plates. Shield
    #667788 on left arm — large round shape with #2244aa water-drop
    emblem in the center. Right hand #44aa66 (wide, webbed) at the
    side. Powerful legs from above — thick, wide shapes, green
    skin #44aa66. Armored boots #553322 at the bottom, pointing
    downward. Belt #553322 at waist with water flask #2244aa.

  Frame 2 (walk step A): Left leg forward, right leg back. Thick
    leg shapes shift — left boot down, right boot up. Arms swing
    opposite: right arm forward (down), left arm (with shield)
    back. The shield shifts to the back-left. Throat sac glow
    pulses brighter during the step. Body has a slight bob — the
    stocky frame moves with a deliberate, heavy gait (not bouncy).

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Shield arm forward, right arm back. Throat sac
    pulses.

  Frame 4 (idle breathing): Throat sac #44ff44 pulses — expands
    1px in all directions then contracts (bioluminescent breathing).
    Body shifts 1 pixel down then up. Eyes unchanged. Shield
    steady.

ROW 2 — FACING UP (away from camera, showing back):
  Frame 1 (idle): Back of head visible — round, wide head shape
    in green #44aa66. Back of armor vest #667788 — wide back
    panel with rounded plate edges at the shoulders. Shield
    #667788 on left arm visible from behind (round shape with
    #2244aa emblem). Right arm at side. Powerful legs from behind
    — thick shapes, green skin #44aa66. Armored boots #553322
    pointing upward. Belt #553322 at waist. No face visible.
    Throat sac not visible (front only).

  Frame 2 (walk step A): Left leg forward (up), right leg back
    (down). Shield arm swings back, right arm forward (up). Body
    bobs with heavy gait. Leg shapes shift.

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back.

  Frame 4 (idle breathing): Body shifts 1 pixel down then up.
    Armor plates creak (subtle 1px shift in shoulder plate positions).

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Left side of round head visible —
    green skin #44aa66. Left eye #44ff44 with horizontal pupil
    visible on the left edge of the face. Wide mouth visible as a
    line on the left side of the face. Throat sac #44ff44 visible
    at the front-left of the neck. Left arm with shield #667788
    — the shield is the dominant feature on the left side, round
    shape with #2244aa emblem. Right arm hidden behind torso.
    Armor vest left panel #667788. Left leg visible — thick,
    powerful shape in green #44aa66. Right leg hidden behind.
    Left boot #553322 pointing left. Belt flask #2244aa partially
    visible at the left edge of the waist.

  Frame 2 (walk step A): Left leg forward (left), right leg back
    (right). Left arm (shield) swings back, right arm (hidden)
    swings forward. Throat sac pulses. Body bobs.

  Frame 3 (walk step B): Right leg forward (crossing over to left),
    left leg back. Shield arm forward. Body bobs.

  Frame 4 (idle breathing): Throat sac pulses. Left arm (shield)
    sways 1 pixel outward.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Right side of head visible,
    right eye, right arm visible (no shield — shield is on left
    arm, so from right view it's hidden behind the body). Right
    hand #44aa66 (webbed) visible at right side. Right boot
    pointing right.

CONSISTENCY RULES across all 16 frames:
- Head always round and wide, green #44aa66
- Eyes always #44ff44 with horizontal pupils, wide-set on round head
- Throat sac always #44ff44, glowing, only visible in DOWN and
  SIDE views (front of neck)
- Armor always #667788 (plates) over #44aa66 (tunic/skin)
- Shield always #667788 with #2244aa emblem, on LEFT arm only
- Legs always thick and wide (powerful frog legs), green #44aa66
- Boots always #553322
- Belt #553322 with flask #2244aa at waist
- Walk gait is heavy and deliberate (not bouncy), body bobs 1px
- Outline #1a1a2a on all edges
- Lighting from upper-left on all frames
```

---

## Evolution — "Leviathan Sovereign" (Post-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
frog person leviathan sovereign. Brimble in his evolved form.

TOP-DOWN VIEW: Green skin #44aa66 now has flowing water patterns
#2244aa running across it — visible as wavy blue lines on the
head, arms, and legs. Large round eyes #44ff44 now glow brightly
with a water-blue halo #2244aa. The bioluminescent throat sac
#44ff44 has grown significantly — it's now a large, prominent
glowing orb at the front of the chest, pulsing with intense
#44ff44 light and surrounded by a #2244aa water aura (1-2px glow
ring). The armor vest has transformed into ornate blue-gray plate
armor #667788 with flowing water engravings #2244aa — wavy lines
and water-drop patterns etched into every surface. The shield
#667788 is now larger and has a glowing #2244aa water-drop emblem
that pulses. Water constructs orbit the character — 2-3 small
water-drop shapes #2244aa floating in a circle around him, each
2-3px, leaving tiny water trail pixels. His powerful legs now
have water energy #2244aa flowing around them like currents. The
belt flask #2244aa has become a glowing water orb. A faint water
ripple effect #2244aa at 30% opacity surrounds the entire
character (1px ring around the full silhouette).

Stance: commanding and grounded, shield raised, water constructs
orbiting. Background: ocean depths with light rays filtering
through water, water particles floating. Rim lighting from upper
left in cool blue-white. 16-bit pixel art style, clean outlines,
more ornate and powerful than base form.

Palette adds: water aura #2244aa, water constructs #2244aa,
water engravings #2244aa, water ripple #2244aa at 30% opacity.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sheet for Brimble Toadsworth
"Leviathan Sovereign" evolution. 16-bit SNES-era RPG style.
TOP-DOWN orthographic perspective. Canvas: 32x40 pixels per frame.
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

SHEET LAYOUT — 4 rows × 4 frames:

ROW 1 — FACING DOWN:
  Frame 1 (idle): Round wide head with water pattern lines #2244aa
    running across the green #44aa66 skin (wavy lines, 1px wide).
    Large round eyes #44ff44 with #2244aa water halo (1px blue ring
    around each eye). Bioluminescent throat sac is now a large
    glowing orb — #44ff44 center with #2244aa glow ring, prominent
    on the chest. Ornate armor #667788 with water engravings #2244aa
    (wavy lines and water-drop patterns on every plate surface).
    Shield #667788 larger than base, with pulsing #2244aa water-drop
    emblem. Water constructs: 2-3 small water-drop shapes #2244aa
    orbiting the character (positions: upper-left, upper-right,
    lower-right of the sprite), each 2-3px, with 1px water trail.
    Water ripple ring #2244aa at 30% opacity surrounds the full
    character silhouette (1px wide). Legs with water currents
    #2244aa flowing around them (1px blue lines along the outer
    edges of the thick leg shapes). Belt orb #2244aa glowing at
    waist.

  Frame 2 (walk step A): Heavy deliberate walk. Water constructs
    orbit — they shift position (upper-left construct moves to
    lower-left, etc.). Water ripple ring pulses outward 1px then
    contracts. Throat sac orb pulses brighter. Shield arm back,
    water constructs cluster on the shield side. Water currents
    on legs flow backward (opposite to movement).

  Frame 3 (walk step B): Mirror of step A. Water constructs orbit
    opposite direction.

  Frame 4 (idle breathing): Throat sac orb pulses — expands 1px,
    glows brighter (#44ff44 intensifies), then contracts. Water
    constructs orbit one position. Water ripple ring pulses.
    Water engravings on armor brighten (#2244aa pixels intensify).

ROW 2 — FACING UP:
  Frame 1 (idle): Back of head with water patterns #2244aa on green
    #44aa66. Ornate armor back #667788 with water engravings
    #2244aa covering the full back panel. Shield visible from
    behind with pulsing #2244aa emblem. Water constructs orbiting
    (visible from above as small #2244aa drops around the
    character). Water ripple ring surrounding the silhouette.
    Legs with water currents. No face, no throat sac visible.

  Frames 2-4: Walk cycle with water construct orbit. Water ripple
    pulses. Armor engravings shift with movement.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Water patterns on head and left
    arm. Left eye #44ff44 with #2244aa halo. Throat sac orb
    visible at front-left of chest. Shield on left arm — large
    round shape with pulsing #2244aa emblem, water constructs
    clustered near the shield. Water currents on left leg. Water
    ripple ring.

  Frames 2-4: Walk cycle. Water constructs orbit. Shield sways.
    Throat sac pulses.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Right arm visible (no shield).
    Water constructs visible. Water ripple ring.

EVOLUTION-SPECIFIC DETAILS (all frames):
- Water patterns: #2244aa wavy lines on green skin, 1px wide
- Eye halo: #2244aa, 1px ring around eyes, only in DOWN view
- Throat sac: large orb, #44ff44 center + #2244aa glow ring,
  visible in DOWN and SIDE views
- Armor engravings: #2244aa wavy lines and water-drop patterns
  on all armor surfaces
- Water constructs: 2-3 #2244aa water-drop shapes (2-3px each)
  orbiting the character, with 1px water trails
- Water ripple ring: #2244aa at 30% opacity, 1px wide, surrounding
  full silhouette
- Water currents: #2244aa 1px lines along outer edges of legs
- Belt orb: #2244aa glowing water orb replacing flask
```

---

## Chibi / Icon Variant (UI, Save Slots, Map Marker)

```
Pixel art chibi icon, top-down view, head-and-shoulders only,
frog person tank. Brimble Toadsworth in super-deformed chibi
style, 16x16 or 32x32 pixel canvas.

TOP-DOWN: Round, wide head fills most of the canvas. Green skin
#44aa66. Two large round eyes #44ff44 with horizontal pupils
(wide ovals), positioned wide apart, taking up most of the face
area. Wide mouth as a broad line across the lower face. A small
glowing throat sac #44ff44 visible as a bright dot at the bottom
center of the face/upper chest. Shoulders visible below head —
armor vest #667788 with a tiny #2244aa water-drop emblem on the
left shoulder (shield hint).

Clean black outline #1a1a2a. No shading — flat colors only for
tiny scale readability. Transparent background.

Palette: #44aa66 skin, #44ff44 eyes/throat, #667788 armor,
#2244aa accent.
```
