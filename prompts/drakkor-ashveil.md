# Drakkor Ashveil — Dragon Person (Drakonid)

Scaled, horned, smoldering breath, powerful tail.
Heavy DPS/breaker. Formal, archaic speech, hides fear behind pride.
Ability: "Inferno Breath" — cone AoE, applies burn DoT.
Evolution: "Elder Wyrm" — transforms into dragon form temporarily.

Species traits: +25% physical damage, +15% fire resistance, -20% magic resistance.

See `GAME_DESIGN_DOC.md` § "Character Design" for full lore.

---

## Base Form — "Ash Walker" (Act 1, Pre-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
dragon person heavy warrior. Tall, powerfully built drakonid man,
red-scaled skin #cc3333, two curved horns #882222 sweeping back
from the top of the head, smoldering breath (faint #ff4400 ember
particles near the mouth), powerful tail #cc3333 with a spaded
tip extending from the lower back. Amber eyes #ffaa00 with
vertical slit pupils.

Wearing heavy dark armor #553322 with red #cc3333 scale accents
along the edges — the armor is bulky and angular, suited to his
powerful frame. A large shoulder plate #553322 on each shoulder
with a #cc3333 dragon emblem. Thick armored gauntlets #553322.
Heavy boots #333333. A short cape or half-cloak #881122 (dark
red) attached at the shoulders, flowing behind him. No weapon
equipped in the portrait (he fights with claws and breath).

TOP-DOWN VIEW: Camera looks straight down. Dominant features are
the two curved horns #882222 — sweeping backward from the top of
the head, they extend 3-4px beyond the head silhouette, making the
head appear wider at the back. Red-scaled skin #cc3333 on the
head and visible body parts. Amber eyes #ffaa00 with vertical
slit pupils in the face area. Smoldering breath visible as 2-3
tiny #ff4400 ember particles floating near the mouth area. Heavy
angular armor #553322 covering the torso — broad shoulders with
large shoulder plates, the widest part of the body. Red #cc3333
scale accents along the armor edges. Arms at sides in armored
gauntlets #553322, clawed hands #882222 visible at the fingertips
(short, thick claws). Legs in heavy armor #553322. Heavy boots
#333333 at the bottom. Tail #cc3333 extends from the lower back,
thick at the base and tapering to a spaded tip, curving to the
right. Cape #881122 extends from the shoulders, flowing behind
(downward from the top-down view), a dark red shape.

Stance: proud and upright, chest forward, one hand on hip.
Background: volcanic landscape with faint lava glow, ember
particles floating. Rim lighting from upper left in warm orange
#ff8833. 16-bit pixel art style, clean 2px-wide outlines, limited
palette, SNES-era RPG character sprite aesthetic. No anti-aliasing
on pixel edges.

Palette: scales #cc3333, horns #882222, eyes #ffaa00, embers
#ff4400, armor #553322, accents #cc3333, gauntlets #553322,
claws #882222, boots #333333, cape #881122, tail #cc3333,
outline #1a1a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Drakkor Ashveil,
dragon person heavy warrior. 16-bit SNES-era RPG style. TOP-DOWN
orthographic perspective — camera looks straight down at the
character.

Canvas: 32x40 pixels per frame. Transparent background.
Outline: 1px near-black #1a1a2a. No anti-aliasing.
Palette restricted to 16 colors max per character.

SHEET LAYOUT — 4 rows (directions) × 4 frames (actions):

ROW 1 — FACING DOWN (toward camera):
  Frame 1 (idle): Standing proud and upright. Top of head visible
    — two curved horns #882222 sweeping backward, the most
    distinctive silhouette element. Red-scaled skin #cc3333 on
    the head. Amber eyes #ffaa00 with vertical slit pupils in the
    face area. Smoldering breath: 2-3 tiny #ff4400 ember particles
    floating near the mouth area (lower face). Heavy angular armor
    #553322 covering the torso — broad shoulders with large
    shoulder plates (widest part of the body). Red #cc3333 scale
    accents along the armor edges (visible as red lines along the
    outer edges of the shoulder plates and torso). Arms at sides
    in armored gauntlets #553322, clawed hands #882222 at the
    fingertips (short, thick claw shapes). Legs in heavy armor
    #553322. Heavy boots #333333 at the bottom, pointing downward.
    Tail #cc3333 extends from the lower back, thick at the base,
    tapering to a spaded tip, curving to the right. Cape #881122
    extends from the shoulders, flowing downward (behind torso).

  Frame 2 (walk step A): Left leg forward, right leg back. Heavy
    gait — the powerful frame moves with deliberate weight. Arms
    swing opposite: right arm forward (down), left arm back.
    Horns stay fixed on head. Tail sways left (counterbalance).
    Ember particles #ff4400 drift from the mouth area. Cape flows
    behind (shifts up from momentum). Claws on the forward hand
    catch the light (#882222 brightens slightly).

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Left arm forward, right arm back. Tail sways
    right. Cape shifts up opposite direction.

  Frame 4 (idle breathing): Subtle chest expansion — torso shifts
    1 pixel up, then down. Ember particles #ff4400 drift upward
    1px then settle. Tail tip flicks 1 pixel. Eyes unchanged.

ROW 2 — FACING UP (away from camera, showing back):
  Frame 1 (idle): Back of head visible — horns #882222 from behind
    (curving backward, visible as two curved shapes extending from
    the back of the head). Red-scaled skin #cc3333 on the back of
    the head. Back of heavy armor #553322 — broad back panel with
    angular plate edges. Red #cc3333 scale accents along the outer
    edges. Cape #881122 is the dominant feature from behind — a
    large dark red shape extending from the shoulders, flowing
    downward past the waist. Tail #cc3333 extends from the lower
    back, visible above the cape, curving left from this angle.
    Arms at sides in gauntlets #553322. Legs in heavy armor
    #553322. Heavy boots #333333 pointing upward. No face visible.
    No embers visible (breath is from the front of the mouth).

  Frame 2 (walk step A): Left leg forward (up), right leg back
    (down). Arms swing: right arm forward (up), left arm back.
    Cape flows behind (up) and sways right. Tail sways right
    (counterbalance). Horns fixed on head.

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Cape sways left.

  Frame 4 (idle breathing): Cape shifts 1 pixel (subtle breeze
    effect). Tail tip flicks. Armor plates creak (subtle 1px
    shift in shoulder plate positions).

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Left horn #882222 visible as a
    curved shape sweeping back from the left side of the head.
    Left side of face visible — amber eye #ffaa00 with slit pupil.
    Smoldering breath embers #ff4400 visible near the mouth area
    (left side). Left arm visible at left side in gauntlet #553322,
    clawed hand #882222. Right arm hidden behind torso. Armor
    left panel #553322 with #cc3333 scale accent along the left
    edge. Left leg visible in heavy armor #553322. Right leg
    hidden behind. Left boot #333333 pointing left. Tail extends
    from the back, curving behind the visible (left) side.
    Cape extends from the right shoulder (behind torso), visible
    as a dark red shape on the right side.

  Frame 2 (walk step A): Left leg forward (left), right leg back
    (right). Left arm swings back, right arm (hidden) swings
    forward. Tail sweeps right. Cape flows behind. Embers drift.

  Frame 3 (walk step B): Right leg forward (crossing over to left),
    left leg back. Tail sweeps left.

  Frame 4 (idle breathing): Left arm (gauntlet) sways 1 pixel
    outward. Embers drift. Tail tip flicks.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Right horn visible, right eye,
    right arm with gauntlet and claws, right leg, right boot
    pointing right. Tail curves to the left from this angle.

CONSISTENCY RULES across all 16 frames:
- Horns always #882222, curved, sweeping backward, extending
  beyond head silhouette
- Scales always #cc3333 (red) on all visible skin
- Eyes always #ffaa00 with vertical slit pupils, only visible in
  DOWN and nearest SIDE view
- Embers always #ff4400, 2-3 particles near mouth, only in DOWN
  and SIDE views (front of face)
- Armor always #553322 (dark, angular, heavy)
- Accents always #cc3333 (red scale pattern on armor edges)
- Claws always #882222, short and thick, at fingertips
- Tail always #cc3333, thick base to spaded tip, sways with
  movement
- Cape always #881122 (dark red), attached at shoulders, flows
  behind
- Boots always #333333
- Walk gait is heavy and powerful (deliberate, not bouncy)
- Outline #1a1a2a on all edges
- Lighting from upper-left on all frames
```

---

## Evolution — "Elder Wyrm" (Post-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
dragon person elder wyrm. Drakkor in his evolved form — partially
transformed into a more draconic state.

TOP-DOWN VIEW: The horns #882222 have grown larger and more
elaborate — now branching slightly at the tips (like a young
dragon's antlers), extending 5-6px beyond the head silhouette.
Red scales #cc3333 now have a faint #ff4400 glow at the edges —
as if the scales are heated from within. Amber eyes #ffaa00 now
glow intensely with a #ff4400 fire halo. Smoldering breath has
become a constant flame aura — #ff4400 fire particles (4-5)
float around the head and mouth area, and thin #ff4400 flame
wisps extend from the mouth. The heavy armor has transformed into
dragon-scale armor — still #553322 but now with prominent
#cc3333 scale textures covering every surface (visible as a
pattern of overlapping scale shapes), and the edges glow with
#ff4400 fire. The shoulder plates are larger and more angular,
with #ff4400 fire wisps at the edges. Claws #882222 are now
longer and glow with #ff4400 fire at the tips. The tail #cc3333
is now longer and more prominent, with #ff4400 fire wisps
flowing from it, and the spaded tip glows bright #ff4400. The
cape #881122 has become a cloak of dark fire — still dark red
but with #ff4400 ember particles floating within it and fire
wisps at the edges. A faint #ff4400 heat distortion effect
surrounds the entire character (1px ring of warm-colored pixels
at the silhouette edges).

Stance: dominant and powerful, chest forward, claws raised.
Background: volcanic crater with lava flows, intense ember
particles, heat shimmer. Rim lighting from upper left in warm
orange #ff8833 with #ff4400 fire tint. 16-bit pixel art style,
clean outlines, dramatically more powerful and draconic than
base form.

Palette adds: fire glow #ff4400, fire wisps #ff4400, heat
distortion #ff4400, scale texture #cc3333 pattern on all armor.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Drakkor Ashveil
"Elder Wyrm" evolution. 16-bit SNES-era RPG style. TOP-DOWN
orthographic perspective. Canvas: 32x40 pixels per frame.
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

SHEET LAYOUT — 4 rows × 4 frames:

ROW 1 — FACING DOWN:
  Frame 1 (idle): Head with larger, branching horns #882222
    (tips branch into two points each, extending 5-6px beyond
    head silhouette). Red scales #cc3333 with #ff4400 edge glow
    (1px of fire color at the outer edges of scale patterns on
    the head). Amber eyes #ffaa00 with #ff4400 fire halo (1px
    orange ring around each eye). Flame aura: 4-5 #ff4400 fire
    particles floating around the head, with thin flame wisps
    extending from the mouth area. Dragon-scale armor #553322
    with #cc3333 scale texture pattern (overlapping scale shapes
    on every armor surface) and #ff4400 fire at the edges. Larger
    shoulder plates with #ff4400 fire wisps. Claws #882222 longer
    than base, with #ff4400 fire at the tips. Tail #cc3333 longer,
    with #ff4400 fire wisps flowing from it, spaded tip glowing
    bright #ff4400. Cape of dark fire #881122 with #ff4400 ember
    particles within it and fire wisps at the edges. Heat
    distortion ring #ff4400 at silhouette edges (1px). Legs with
    fire-edged armor. Boots #333333.

  Frame 2 (walk step A): Heavy powerful walk. Fire particles
    #ff4400 drift backward (opposite to movement). Flame wisps
    from mouth flow backward. Tail with fire wisps sways left.
    Cape fire wisps flow backward. Claws on forward hand glow
    brighter #ff4400. Heat distortion pulses outward 1px.

  Frame 3 (walk step B): Mirror of step A. Fire particles drift
    opposite direction. Tail sways right.

  Frame 4 (idle breathing): Fire aura intensifies — #ff4400
    particles increase in brightness. Flame wisps from mouth grow
    1px longer then shrink. Tail fire wisps pulse. Scale edge
    glow brightens. Heat distortion pulses.

ROW 2 — FACING UP:
  Frame 1 (idle): Back of head — larger branching horns #882222
    from behind. Scale-textured armor back #553322 with #cc3333
    scale pattern and #ff4400 fire edges. Cape of dark fire
    #881122 dominant from behind — large shape with #ff4400
    ember particles and fire wisps. Tail #cc3333 with fire wisps
    visible above cape. Heat distortion ring. No face, no embers
    visible from behind.

  Frames 2-4: Walk cycle with fire effects. Cape fire wisps flow
    dramatically. Tail fire wisps sway. Heat distortion pulses.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Left horn #882222 (branching).
    Left eye #ffaa00 with #ff4400 halo. Flame wisps from mouth
    visible on left side. Left arm with longer claws #882222 and
    #ff4400 claw tips. Scale-textured armor with fire edges.
    Tail with fire wisps curving behind. Cape fire visible.
    Heat distortion.

  Frames 2-4: Walk cycle. Fire particles drift. Tail sways.
    Claws glow.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row.

EVOLUTION-SPECIFIC DETAILS (all frames):
- Horns: larger, branching at tips, #882222, 5-6px beyond head
- Scale glow: #ff4400 at edges of scale patterns on skin
- Eye halo: #ff4400 fire ring around eyes, only in DOWN view
- Fire aura: 4-5 #ff4400 particles around head, flame wisps
  from mouth, only in DOWN and SIDE views
- Armor texture: #cc3333 overlapping scale pattern on all
  #553322 armor surfaces
- Armor edge glow: #ff4400 at all armor plate edges
- Claws: longer than base, #882222 with #ff4400 fire tips
- Tail: longer, with #ff4400 fire wisps, spaded tip glows #ff4400
- Cape: #881122 with #ff4400 ember particles within and fire
  wisps at edges
- Heat distortion: #ff4400 1px ring at silhouette edges
```

---

## Chibi / Icon Variant (UI, Save Slots, Map Marker)

```
Pixel art chibi icon, top-down view, head-and-shoulders only,
dragon person heavy warrior. Drakkor Ashveil in super-deformed
chibi style, 16x16 or 32x32 pixel canvas.

TOP-DOWN: Head fills most of the canvas. Two curved horns #882222
dominate the top of the icon, sweeping backward, taking up the
top 40% of the canvas. Red-scaled skin #cc3333 on the face area.
Two amber eyes #ffaa00 with slit pupils, intense and proud. A
tiny #ff4400 ember particle near the mouth area (smoldering
breath hint). Shoulders visible below head — heavy armor #553322
with a small #cc3333 scale accent dot on each shoulder. A tiny
#ff4400 glow dot at the bottom center (tail tip hint).

Clean black outline #1a1a2a. No shading — flat colors only for
tiny scale readability. Transparent background.

Palette: #882222 horns, #cc3333 scales, #ffaa00 eyes, #ff4400
embers, #553322 armor.
```
