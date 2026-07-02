# Erynn "Eryx" Vexx — Cat Person (Felidae)

Tall, digitigrade legs, retractable claws, large expressive ears.
Outcast scout. Sarcastic, guarded, lonely.
Ability: "Shadow Pounce" — teleports to target, guaranteed crit.
Evolution: "Phantom Queen" — leaves afterimages that attack independently.

Species traits: +20% evasion, +15% crit rate, -10% max HP.

See `GAME_DESIGN_DOC.md` § "Character Design" for full lore.

---

## Base Form — "Shadow Scout" (Act 1, Pre-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
cat person scout. Tall felidae woman, lean and agile build, warm
tan skin #ddaa88, large pointed cat ears #ff8866 standing upright
on top of head, short messy dark hair #333333 beneath the ears,
sharp amber eyes #ffaa00 with slit pupils. Digitigrade legs (bent
backward at the knee, giving a distinctive tall silhouette).

Wearing a fitted dark stealth suit #222233 with dark red #881122
accent panels along the sides, fingerless gloves #333333 showing
retractable claw tips #cccccc at the fingertips, light armored
boots #222233 suited for silent movement. A short utility belt
#553322 with small pouches. Tail #333333 with dark red #881122
tip, extending from the lower back and curving to one side.

TOP-DOWN VIEW: Camera looks straight down. Dominant feature is the
large cat ears #ff8866 — two tall triangular shapes on top of the
head, the most recognizable silhouette element. Short dark hair
#333333 visible between and below the ears. Sharp amber eyes
#ffaa00 with vertical slit pupils visible as small diamond shapes
in the face area. Stealth suit forms the torso — dark #222233
with #881122 accent panels along the outer edges (sides of torso,
outer arms, outer legs). Arms at sides with fingerless gloves
#333333, claw tips #cccccc visible as tiny bright dots at the
fingertips. Digitigrade legs visible from above as distinctive
shapes — the lower leg angles backward, giving a "Z" shape profile
to each leg from above. Tail extends from the back, curving to the
right, #333333 with #881122 tip.

Stance: low and ready, weight on the balls of the feet, one arm
slightly forward as if ready to strike. Background: dark alley or
shadowy corridor, faint purple ambient light. Rim lighting from
upper left in cool white. 16-bit pixel art style, clean 2px-wide
outlines, limited palette, SNES-era RPG character sprite aesthetic.
No anti-aliasing on pixel edges.

Palette: skin #ddaa88, ears #ff8866, hair #333333, eyes #ffaa00,
suit #222233, accents #881122, gloves #333333, claws #cccccc,
belt #553322, tail #333333/#881122, outline #1a1a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Erynn "Eryx" Vexx,
cat person scout. 16-bit SNES-era RPG style. TOP-DOWN orthographic
perspective — camera looks straight down at the character.

Canvas: 32x40 pixels per frame. Transparent background.
Outline: 1px near-black #1a1a2a. No anti-aliasing.
Palette restricted to 16 colors max per character.

SHEET LAYOUT — 4 rows (directions) × 4 frames (actions):

ROW 1 — FACING DOWN (toward camera):
  Frame 1 (idle): Standing still, low ready stance. Top of head
    visible — two large cat ears #ff8866 are the dominant silhouette
    element, tall triangles on top. Short dark hair #333333 between
    and below ears. Sharp amber eyes #ffaa00 with slit pupils
    (small vertical diamond shapes) in the face area. Stealth suit
    torso #222233 with #881122 accent panels along the outer edges.
    Arms at sides, fingerless gloves #333333, claw tips #cccccc
    as tiny bright dots at fingertips. Digitigrade legs — from
    above, each leg has a distinctive backward-angle shape. Tail
    extends from lower back, curving right, #333333 with #881122
    tip. Utility belt #553322 at waist with small pouch shapes.

  Frame 2 (walk step A): Left leg forward, right leg back.
    Digitigrade leg shapes shift — left leg's backward angle points
    down, right leg's points up. Arms swing opposite: right arm
    forward (down), left arm back. Ears stay upright but shift
    slightly right from momentum. Tail curves more dramatically
    to the right (counterbalance). Claw tips catch the light
    (#cccccc bright dots at forward hand).

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Left arm forward, right arm back. Ears shift
    left. Tail curves left.

  Frame 4 (idle breathing): Subtle crouch — entire body shifts
    1 pixel down, then up. Ears twitch (left ear tilts 1 pixel
    outward). Tail tip sways 1 pixel. Claws extend slightly
    (#cccccc dots grow 1px).

ROW 2 — FACING UP (away from camera, showing back):
  Frame 1 (idle): Back of head visible — cat ears #ff8866 from
    behind (triangular shapes pointing up), short dark hair
    #333333. Back of stealth suit #222233 with #881122 accent
    panels along the outer edges (visible as colored strips along
    the sides of the back). Arms at sides in #222233 suit sleeves.
    Digitigrade legs from behind — the backward knee angle is
    visible as a distinctive notch in the leg silhouette. Tail
    extends from lower back, curving left from this angle,
    #333333 with #881122 tip. No face visible. Belt pouches
    partially visible at the sides.

  Frame 2 (walk step A): Left leg forward (up), right leg back
    (down). Digitigrade shapes shift. Arms swing: right arm
    forward (up), left arm back. Tail sways right (counterbalance).
    Ears tilt slightly forward from movement.

  Frame 3 (walk step B): Mirror of step A. Right leg forward,
    left leg back. Tail sways left.

  Frame 4 (idle breathing): Subtle weight shift — body sways 1
    pixel left then right. Tail tip flicks.

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Left cat ear #ff8866 visible as a
    tall triangle on the left side of the head. Left side of face
    visible — amber eye #ffaa00 with slit pupil. Left arm visible
    at left side in #222233 sleeve, glove #333333, claw tips
    #cccccc. Right arm hidden behind torso. Stealth suit left
    panel #222233 with #881122 accent along the left edge. Left
    digitigrade leg visible — the backward knee angle creates a
    distinctive shape. Right leg hidden behind. Tail extends from
    the back, curving behind the visible (left) side. Left boot
    #222233 pointing left.

  Frame 2 (walk step A): Left leg forward (left), right leg back
    (right). Left arm swings back, right arm (hidden) swings
    forward. Ear tilts forward from momentum. Tail sweeps right.

  Frame 3 (walk step B): Right leg forward (crossing over to left),
    left leg back. Ear tilts back. Tail sweeps left.

  Frame 4 (idle breathing): Left arm sways 1 pixel outward. Ear
    twitches.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row. Right cat ear visible, right
    arm visible, right digitigrade leg visible. Tail curves to
    the left from this angle.

CONSISTENCY RULES across all 16 frames:
- Cat ears always #ff8866, tall triangular shape, dominant silhouette
- Hair always #333333 (short, beneath and between ears)
- Eyes always #ffaa00 with slit pupils, only visible in DOWN and
  nearest SIDE view
- Stealth suit always #222233 (primary) / #881122 (accents)
- Claws always #cccccc, visible as tiny dots at fingertips
- Tail always #333333 with #881122 tip, sways with movement
- Digitigrade leg shape consistent in all frames
- Belt #553322 with pouches, visible in DOWN and UP rows
- Outline #1a1a2a on all edges
- Lighting from upper-left on all frames
```

---

## Evolution — "Phantom Queen" (Post-Evolution)

### Full-Body Character Portrait (Promotional / Concept Art)

```
Pixel art character portrait, top-down orthographic view, sci-fi
cat person phantom queen. Erynn in her evolved form.

TOP-DOWN VIEW: Cat ears #ff8866 now have a faint dark purple
#1a0a2a glow at the tips — phantom energy crackling. Short dark
hair #333333 now has streaks of dark purple #1a0a2a running
through it. Amber eyes #ffaa00 now glow faintly with a dark purple
halo #1a0a2a. The stealth suit has transformed — still dark
#222233 but now with flowing dark purple #1a0a2a phantom trails
extending from the edges of the suit, as if the character is
partially dissolving into shadow. The most dramatic change: faint
afterimage silhouettes #222233 at 50% opacity visible 1-2px
offset from the main body in 2-3 directions, as if previous
positions of the character are still visible. Claws #cccccc now
extend further and glow with dark purple #1a0a2a energy. Tail
#333333 with #881122 tip now leaves a faint phantom trail as it
moves. The digitigrade legs have dark purple energy wisps
#1a0a2a floating around the knee joints.

Stance: confident, one hand extended with phantom energy
crackling at the fingertips (#1a0a2a sparks). Background: dark
void with purple energy wisps, shadowy afterimages of the
character floating in the background. Rim lighting from upper
left in cool white with purple tint. 16-bit pixel art style,
clean outlines, more ethereal and ghostly than base form.

Palette adds: phantom glow #1a0a2a, afterimage #222233 at 50%
opacity, energy sparks #1a0a2a.
```

### Sprite Sheet — Walk Cycle (Game-Ready)

```
Generate a pixel art character sprite sheet for Erynn "Eryx" Vexx
"Phantom Queen" evolution. 16-bit SNES-era RPG style. TOP-DOWN
orthographic perspective. Canvas: 32x40 pixels per frame.
Transparent background. Outline: 1px near-black #1a1a2a.
No anti-aliasing. Palette restricted to 16 colors max.

SHEET LAYOUT — 4 rows × 4 frames:

ROW 1 — FACING DOWN:
  Frame 1 (idle): Cat ears #ff8866 with dark purple #1a0a2a glow
    at the tips (1-2px of purple at each ear tip). Short dark hair
    #333333 with #1a0a2a streaks. Amber eyes #ffaa00 with #1a0a2a
    halo (1px purple ring around each eye). Stealth suit #222233
    with phantom trails — dark purple #1a0a2a wisps extending from
    the outer edges of the suit (shoulders, arms, legs), 1-2px
    wide, fading to transparent. Afterimage silhouettes: 2-3 faint
    #222233 shapes at ~50% opacity, offset 1-2px from the main
    body (one shifted up-left, one shifted down-right), showing
    the torso and head outline. Claws #cccccc extended with
    #1a0a2a glow at tips. Tail with phantom trail — a faint
    #1a0a2a wisp follows the tail tip. Digitigrade legs with
    #1a0a2a energy wisps at the knee joints (1px dots).

  Frame 2 (walk step A): Standard walk cycle with phantom effects.
    Afterimages shift position — the "previous position" silhouettes
    now appear where the character was 1 frame ago (shifted in the
    opposite direction of movement). Phantom trails from suit edges
    flow backward (opposite to movement direction). Claws on the
    forward hand glow brighter (#1a0a2a energy). Tail phantom trail
    is longer (2-3px of #1a0a2a wisp).

  Frame 3 (walk step B): Mirror of step A. Afterimages shift
    opposite direction.

  Frame 4 (idle breathing): Afterimages pulse — they grow 1px
    larger then shrink. Phantom trails pulse brighter. Ear tip
    glow intensifies then dims. Energy wisps at knees float
    upward 1px then settle.

ROW 2 — FACING UP:
  Frame 1 (idle): Back of head — cat ears #ff8866 with #1a0a2a
    glow at tips (visible from behind). Hair with #1a0a2a streaks.
    Suit back #222233 with phantom trails extending from edges.
    Afterimage silhouettes visible (faint torso shapes offset from
    main body). Tail with phantom trail. Digitigrade legs with
    energy wisps at knees. No face visible.

  Frames 2-4: Walk cycle with phantom trail effects. Afterimages
    shift with movement. Phantom trails flow dramatically from
    the back (cape-like effect from the suit's phantom energy).

ROW 3 — FACING LEFT:
  Frame 1 (idle): Left profile. Left ear #ff8866 with #1a0a2a tip
    glow. Left eye #ffaa00 with #1a0a2a halo. Left arm visible
    with phantom trail extending from the sleeve edge. Afterimage
    silhouettes offset to the left and right of the main body.
    Claws #cccccc with #1a0a2a glow. Tail with phantom trail
    curving behind.

  Frames 2-4: Walk cycle. Phantom trails flow behind the
    character. Afterimages shift.

ROW 4 — FACING RIGHT:
  Frames 1-4: Mirror of LEFT row.

EVOLUTION-SPECIFIC DETAILS (all frames):
- Ear tip glow: #1a0a2a, 1-2px at each ear tip
- Hair streaks: #1a0a2a within #333333 hair, max 3 per frame
- Eye halo: #1a0a2a, 1px ring around eyes, only in DOWN view
- Phantom trails: #1a0a2a wisps from suit edges, 1-2px wide,
  fading to transparent
- Afterimages: #222233 at 50% opacity, 2-3 silhouettes offset
  1-2px from main body, torso and head shape only
- Claw glow: #1a0a2a at claw tips
- Tail trail: #1a0a2a wisp following tail tip, 1-3px
- Knee energy wisps: #1a0a2a 1px dots at digitigrade knee joints
```

---

## Chibi / Icon Variant (UI, Save Slots, Map Marker)

```
Pixel art chibi icon, top-down view, head-and-shoulders only,
cat person scout. Erynn "Eryx" Vexx in super-deformed chibi
style, 16x16 or 32x32 pixel canvas.

TOP-DOWN: Two large cat ears #ff8866 dominate the top of the icon,
taking up the top 50% of the canvas. Short dark hair #333333
visible between the ears. Face area: two oversized amber eyes
#ffaa00 with slit pupils (vertical diamond shapes), small confident
smirk. Shoulders visible below head — dark stealth suit #222233
with a small #881122 accent dot on each shoulder. Claw tips
#cccccc visible as tiny bright dots at the bottom edge of the
icon (hands at sides).

Clean black outline #1a1a2a. No shading — flat colors only for
tiny scale readability. Transparent background.

Palette: #ff8866 ears, #333333 hair, #ffaa00 eyes, #222233 suit,
#881122 accent, #cccccc claws.
```
