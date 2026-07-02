# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — UI Element Prompts
# ═══════════════════════════════════════════════════════════════

Pixel art UI elements for the game interface. All elements use the
game's pixel-art style with clean outlines and limited palettes.

For art direction rules, see `art-direction.md`.
For palette reference, see `config.js` COLORS.

## Style Rules

- **Pixel art style**: Hard edges, no anti-aliasing, flat color cells
- **Outline**: 1px near-black #1a1a2a on all element edges
- **Palette**: Max 8 colors per UI element
- **Aesthetic**: Clean sci-fi, slightly retro (16-bit RPG influence)
- **Readability**: All text/icons must be readable at the game's
  internal resolution (480×270)

---

## PART A: HUD ELEMENTS

### A1. HP Bar

```
Pixel art UI element, horizontal health bar. 64×8 pixels.
A horizontal bar showing character health. The bar has a dark
background #1a1a2a (1px border all around). The fill portion is
green #33cc66 (bright green, the current HP). The empty portion
#333333 (dark gray, the missing HP). A thin highlight line #66ff99
(1px, at the top of the fill portion) gives the bar a subtle glow.
The fill percentage is shown as a white #ffffff numeric overlay
"80/80" in a tiny pixel font (2px tall characters, centered on the
bar). When HP is low (below 25%), the fill color changes to red
#ff3344 and the highlight to #ff6677. The overall feel is clean,
readable, immediate — the player can instantly gauge their health.

Palette: #1a1a2a (border), #33cc66 (fill), #333333 (empty), #66ff99
(highlight), #ffffff (text), #ff3344 (low HP fill), #ff6677 (low
HP highlight).
```

### A2. SP Bar

```
Pixel art UI element, horizontal skill point bar. 64×8 pixels.
Same structure as the HP bar but for Skill Points. Dark background
#1a1a2a (1px border). Fill portion is blue #3344aa (deep blue).
Empty portion #333333. Highlight line #44ddff (1px, at the top of
the fill). Numeric overlay "20/20" in white #ffffff. When SP is
full (ready to use a skill), the fill pulses slightly — represented
by a brighter highlight #66eeff. The overall feel is calm,
controlled — the resource for special abilities.

Palette: #1a1a2a (border), #3344aa (fill), #333333 (empty), #44ddff
(highlight), #ffffff (text), #66eeff (full highlight).
```

### A3. ATB Gauge (Active Time Battle)

```
Pixel art UI element, horizontal ATB gauge. 48×6 pixels.
A thin horizontal bar that fills over time during combat. Dark
background #1a1a2a (1px border). Fill portion is gold #ffcc33
(filling from left to right). Empty portion #333333. When the gauge
is full, the entire bar flashes bright #ffffff for 1 frame (the
"ready" signal) then returns to gold. A small arrow indicator
#ffffff (1px triangle) at the right end of the bar points right
("your turn"). The overall feel is urgent, dynamic — the player
watches this bar to know when they can act.

Palette: #1a1a2a (border), #ffcc33 (fill), #333333 (empty), #ffffff
(ready flash/arrow).
```

### A4. Gold Icon

```
Pixel art UI element, 16x16 pixels. A gold coin icon — the currency
display.

A circular coin viewed at a slight angle (not pure top-down —
slightly tilted to show the coin's face). The coin body #ffcc33
(gold) with a darker edge #cc9900 (1px outline). A Crown emblem
#ffffff (2x2px, a simple crown shape) is stamped in the center of
the coin face. A highlight #ffdd66 (1px, upper-left quadrant)
catches the light. A subtle shadow #996600 (1px, lower-right)
gives depth. The overall feel is valuable, shiny — the player's
hard-earned currency.

Palette: #ffcc33 (coin), #cc9900 (edge), #ffffff (emblem), #ffdd66
(highlight), #996600 (shadow), #1a1a2a (outline).
```

### A5. Minimap

```
Pixel art UI element, 48x48 pixels. A minimap overlay showing the
current area.

A square frame #1a1a2a (2px border, dark). The interior #0a0a1a
(very dark, almost black) shows a simplified top-down map of the
current area. Walls are shown as #333333 (dark gray lines, 1px).
Walkable areas are #1a1a2a (slightly lighter). The player's
position is a gold dot #ffcc33 (2x2px, the brightest element).
NPCs are small colored dots: #44ddff (cyan, friendly), #ff3344
(red, hostile). Doors/portals are #aa44ff (purple, 1px squares).
A small compass rose #ffffff (4x4px, in the top-right corner)
shows N/S/E/W. The overall feel is a tactical overlay — clean,
informative, unobtrusive.

Palette: #1a1a2a (frame), #0a0a1a (interior), #333333 (walls),
#1a1a2a (floor), #ffcc33 (player), #44ddff (friendly NPC), #ff3344
(hostile NPC), #aa44ff (portal), #ffffff (compass).
```

---

## PART B: MENU FRAMES & OVERLAYS

### B1. Dialogue Box

```
Pixel art UI element, 96x32 pixels. A dialogue text box — the
frame for character speech and narration.

A rounded rectangle (corners are 2px radius) with a dark
semi-transparent background #0a0a1a at 80% opacity. The border
is #3344aa (blue, 1px, with a subtle inner glow #44ddff at 20%
opacity). The interior is clear for text. A small portrait frame
#1a1a2a (16x16px, top-left corner, 1px border #3344aa) shows
the speaker's face. A "continue" indicator — a small triangle
#ffcc33 (2px, pointing down) — blinks at the bottom-right corner
of the box. The overall feel is a classic RPG dialogue box —
familiar, readable, unobtrusive.

Palette: #0a0a1a (background), #3344aa (border), #44ddff (inner
glow), #ffcc33 (continue indicator), #1a1a2a (portrait frame).
```

### B2. Shop Menu Frame

```
Pixel art UI element, 128x96 pixels. A shop interface frame —
used for buying, selling, and upgrading.

A rectangular frame with a dark background #0a0a1a at 90% opacity.
The border is #ffcc33 (gold, 2px, indicating commerce). The
interior is divided into sections: a title bar at the top (16px
tall, #3344aa background, white #ffffff text "WEAPON SHOP"), an
item grid in the middle (8x6 grid of 12x12px slots, each slot
has a dark background #1a1a2a and a 1px border #333333), and a
bottom bar (16px tall, #1a1a2a background) showing the player's
gold (gold icon + amount in white text). A cursor/highlight
#ffcc33 (2px border, no fill) indicates the selected item. The
overall feel is a clean, organized shop interface — easy to
navigate, clear pricing.

Palette: #0a0a1a (background), #ffcc33 (border/highlight), #3344aa
(title bar), #1a1a2a (slots/bottom bar), #333333 (slot borders),
#ffffff (text).
```

### B3. Inventory Grid

```
Pixel art UI element, 96x80 pixels. An inventory management grid.

A rectangular frame with dark background #0a0a1a at 90% opacity.
Border #556677 (steel gray, 1px). The interior is a 6×5 grid of
12x12px item slots. Each slot has a dark background #1a1a2a and
a 1px border #333333. Items in slots are shown as small icons
(8x8px, centered in each slot). Empty slots show a faint "empty"
pattern (a 1px diagonal line #2a2a2a). A selected slot is
highlighted with a cyan border #44ddff (2px). A title bar at the
top (12px tall, #3344aa background, white text "INVENTORY"). A
description panel at the bottom (20px tall, #1a1a2a background)
shows the selected item's name and stats in white text. The
overall feel is a classic RPG inventory — grid-based, organized,
functional.

Palette: #0a0a1a (background), #556677 (border), #1a1a2a (slots),
#333333 (slot borders), #44ddff (selection), #3344aa (title), #2a2a2a
(empty pattern), #ffffff (text).
```

### B4. Combat UI Frame

```
Pixel art UI element, 128x64 pixels. The combat interface frame.

A rectangular frame with dark background #0a0a1a at 85% opacity.
Border #ff3344 (red, 2px — indicating combat). The interior is
divided: the left third shows party status (3 small portraits
16x16px stacked vertically, each with a tiny HP bar #33cc66 and
SP bar #3344aa below). The center third shows the enemy (a large
silhouette #333333, 32x32px, with a name label above in white
text and an HP bar #ff3344 below). The right third shows the
action menu (4 buttons stacked vertically: ATTACK #ff3344, SKILL
#44ddff, ITEM #ffcc33, DEFEND #3344aa — each button is 32x8px
with a 1px border and label text). A selected action is
highlighted with a brighter border #ffffff (2px). The overall
feel is a tactical combat interface — clear, fast, informative.

Palette: #0a0a1a (background), #ff3344 (border), #33cc66 (HP), #3344aa
(SP), #333333 (enemy), #ff3344 (enemy HP), #ffffff (text/highlight),
#44ddff (skill), #ffcc33 (item).
```

### B5. Title Screen Background

```
Pixel art UI element, 480x270 pixels (full screen). The title
screen background.

A deep space scene: the background is #0a0a1a (very dark blue-black)
with scattered stars #ffffff (1px dots, varying brightness). A
large nebula #1a0a2a (purple, soft edges) dominates the upper-right
quarter. A smaller nebula #2233aa (blue, soft edges) is in the
lower-left. In the center, the game logo "STELLAR PRINCESSES" is
rendered in a futuristic serif font — the letters are #ffffff
(white) with a subtle cyan glow #44ddff at 30% opacity. Below the
logo, "PRESS START" blinks in gold #ffcc33. At the bottom, a small
version tag "v4.1" in gray #666688. The overall feel is epic,
mysterious, inviting — the player's first impression of the game.

Palette: #0a0a1a (background), #ffffff (stars), #1a0a2a (purple
nebula), #2233aa (blue nebula), #ffffff (logo), #44ddff (logo glow),
#ffcc33 (press start), #666688 (version).
```

### B6. Game Over Screen

```
Pixel art UI element, 480x270 pixels (full screen). The game over
screen.

The screen is dark #0a0a1a with a subtle red vignette #330000 at
30% opacity (dark red at the edges, fading to black in the center).
In the center, "GAME OVER" is rendered in a large pixel font — the
letters are #ff3344 (red) with a dark shadow #660000 (1px offset
down-right). Below, "CONTINUE?" blinks in white #ffffff. Below
that, two options: "YES" #33cc66 (green) and "NO" #ff3344 (red),
separated by a gap. A small Crown emblem #333333 (dark, barely
visible) is centered at the bottom — a reminder of what was lost.
The overall feel is somber, final, but with hope (the continue
option).

Palette: #0a0a1a (background), #330000 (vignette), #ff3344 (text),
#660000 (shadow), #ffffff (continue), #33cc66 (yes), #333333
(crown).
```

### B7. Pause Menu Overlay

```
Pixel art UI element, 480x270 pixels (full screen). The pause menu
overlay.

The game screen behind is darkened to 50% opacity #000000 (a
semi-transparent black overlay). In the center, a menu panel
#0a0a1a at 95% opacity (128x96px) with a border #556677 (steel
gray, 2px). The title "PAUSED" is at the top in white #ffffff.
Below, a vertical list of menu items (each 16px tall, 96px wide):
"RESUME" #33cc66 (green, the default selection), "INVENTORY"
#44ddff (cyan), "SAVE" #ffcc33 (gold), "SETTINGS" #aa44ff (purple),
"QUIT" #ff3344 (red). The selected item has a highlight bar
#ffffff at 20% opacity behind it. A cursor triangle #ffcc33 (2px,
pointing right) is next to the selected item. The overall feel
is a clean, pauseable menu — the player can take a break without
losing their place.

Palette: #000000 (darken overlay), #0a0a1a (panel), #556677 (border),
#ffffff (title/highlight), #33cc66 (resume), #44ddff (inventory),
#ffcc33 (save/cursor), #aa44ff (settings), #ff3344 (quit).
```

---

## PART C: ICONS

### C1. Weapon Icons — Sword

```
Pixel art icon, 16x16 pixels. A sword icon — the most basic weapon
type.

A sword viewed from top-down (lying flat on the ground). The blade
#cccccc (steel gray, 1px wide, 10px long) extends diagonally from
upper-left to lower-right. The guard #778899 (crossguard, 3px wide,
perpendicular to the blade) is at the center. The handle #553322
(dark wood, 1px wide, 4px long) extends from the guard to the
lower-right. The pommel #ffcc33 (gold, 1px dot) is at the end of
the handle. A highlight #ffffff (1px, along the upper edge of the
blade) catches the light. The overall feel is a simple, recognizable
sword — the icon for melee weapons.

Palette: #cccccc (blade), #778899 (guard), #553322 (handle), #ffcc33
(pommel), #ffffff (highlight), #1a1a2a (outline).
```

### C2. Weapon Icons — Gun

```
Pixel art icon, 16x16 pixels. A gun icon — ranged weapon type.

A pistol/energy gun viewed from top-down. The barrel #778899
(steel gray, 1px wide, 8px long) extends horizontally to the right.
The body #556677 (darker metal, 4x4px) is at the center-left. The
handle #553322 (dark wood/grip, 2px wide, 4px tall) extends
downward from the body. A small sight #333333 (1px, on top of the
barrel near the tip) is visible. A subtle energy glow #44ddff
(1px, at the barrel tip) indicates this is an energy weapon. The
overall feel is a compact, functional ranged weapon.

Palette: #778899 (barrel), #556677 (body), #553322 (handle), #333333
(sight), #44ddff (energy glow), #1a1a2a (outline).
```

### C3. Weapon Icons — Staff

```
Pixel art icon, 16x16 pixels. A staff icon — magic weapon type.

A staff viewed from top-down (lying flat). The shaft #664422
(wood, 1px wide, 14px long) extends diagonally. The head #aa44ff
(purple crystal, 3x3px, the brightest element) is at the top end
of the shaft. A smaller crystal #44ddff (cyan, 1px) is at the
bottom end (the base). Energy wisps #aa44ff (1px lines, 2-3)
float around the head crystal. The overall feel is a magical
focus — a weapon for casting spells.

Palette: #664422 (shaft), #aa44ff (head crystal), #44ddff (base
crystal), #1a1a2a (outline).
```

### C4. Armor Icons — Light Armor

```
Pixel art icon, 16x16 pixels. A light armor icon — vest/jacket.

A light vest/jacket viewed from top-down (laid flat). The body
#3344aa (blue fabric, the main shape — a rounded rectangle 10x12px
with the top narrower for the shoulders). The collar #445566
(darker blue, 1px line across the top). A zipper #778899 (1px
vertical line down the center). The sleeves #3344aa (same as body,
2px wide, extending from the shoulders to the sides). A small
pocket #445566 (2x2px, on the left side). The overall feel is
light, agile — armor for scouts and mages.

Palette: #3344aa (body/sleeves), #445566 (collar/pocket), #778899
(zipper), #1a1a2a (outline).
```

### C5. Armor Icons — Heavy Armor

```
Pixel art icon, 16x16 pixels. A heavy armor icon — plate armor.

A breastplate viewed from top-down (laid flat). The body #556677
(steel gray metal, the main shape — a broad rectangle 12x14px
with curved edges). Shoulder plates #667788 (lighter metal, 4x3px
at the top corners). Rivets #8899aa (1px dots, 4 of them along
the edges). A central ridge #667788 (1px vertical line, the
center seam). A small emblem #ffcc33 (gold, 2x2px, on the left
side — a shield or dragon symbol). The overall feel is heavy,
protective — armor for tanks and warriors.

Palette: #556677 (body), #667788 (shoulders/ridge), #8899aa
(rivets), #ffcc33 (emblem), #1a1a2a (outline).
```

### C6. Accessory Icons — Ring

```
Pixel art icon, 16x16 pixels. A ring icon — jewelry accessory.

A ring viewed from top-down (lying flat). The band #ffcc33 (gold,
a 6px diameter circle, 1px thick). A gem #aa44ff (purple, 2x2px,
centered on the band — the brightest element). A highlight
#ffffff (1px, on the upper-left of the gem). The overall feel
is a simple, valuable ring — a basic accessory.

Palette: #ffcc33 (band), #aa44ff (gem), #ffffff (highlight),
#1a1a2a (outline).
```

### C7. Consumable Icons — Potion

```
Pixel art icon, 16x16 pixels. A potion bottle icon — healing item.

A small potion bottle viewed from top-down. The bottle #44ddff
(blue glass, 4x6px, rounded rectangle) is filled with liquid
#33cc66 (green, the healing potion). The cork #664422 (brown, 2x2px)
is at the top. A highlight #ffffff (1px, on the upper-left of the
glass) catches the light. A small label #ffcc33 (yellow, 2x1px)
is on the front of the bottle. The overall feel is a small,
precious healing item.

Palette: #44ddff (bottle), #33cc66 (liquid), #664422 (cork), #ffffff
(highlight), #ffcc33 (label), #1a1a2a (outline).
```

### C8. Material Icons — Crystal

```
Pixel art icon, 16x16 pixels. A crystal icon — crafting material.

A crystal cluster viewed from top-down. The main crystal #aa44ff
(purple, 4x6px, hexagonal shape) is the brightest element. Smaller
crystals #44ddff (cyan, 2x3px each, 2 of them) cluster around the
base. A highlight #ffffff (1px, on the upper-left face of the
main crystal). The base #333333 (dark rock, 4x2px) anchors the
crystals. The overall feel is a raw, magical material — something
found in dungeons and used for crafting.

Palette: #aa44ff (main crystal), #44ddff (small crystals), #ffffff
(highlight), #333333 (base), #1a1a2a (outline).
```

### C9. Element Icons — Fire

```
Pixel art icon, 8x8 pixels. A fire element icon — tiny, for skill
bars and status indicators.

A flame shape viewed from top-down. The base #ff4400 (orange-red,
3x3px, the main body). The tip #ffaa00 (yellow, 1x1px, at the
top). A small ember #ffcc33 (1px dot, floating to the right). The
overall feel is a tiny, bright flame — instantly recognizable as
fire even at 8x8 pixels.

Palette: #ff4400 (base), #ffaa00 (tip), #ffcc33 (ember), #1a1a2a
(outline).
```

### C10. Element Icons — Ice

```
Pixel art icon, 8x8 pixels. An ice element icon.

A snowflake/ice crystal viewed from top-down. The center #aaccff
(pale blue, 1x1px). Six branches #88aacc (slightly darker, 1px
each, radiating from the center in a hexagonal pattern). A
highlight #ffffff (1px, on the upper branch). The overall feel
is a tiny, cold crystal — instantly recognizable as ice.

Palette: #aaccff (center), #88aacc (branches), #ffffff (highlight),
#1a1a2a (outline).
```

### C11. Element Icons — Lightning

```
Pixel art icon, 8x8 pixels. A lightning element icon.

A lightning bolt viewed from top-down. The bolt #ffcc33 (bright
yellow, 1px wide, jagged path from upper-right to lower-left —
a zigzag of 3 segments). A glow #ffdd66 (1px halo around the bolt
at 50% opacity). The overall feel is a tiny, electric bolt —
instantly recognizable as lightning.

Palette: #ffcc33 (bolt), #ffdd66 (glow), #1a1a2a (outline).
```

### C12. Element Icons — Dark

```
Pixel art icon, 8x8 pixels. A dark/void element icon.

A void orb viewed from top-down. The outer ring #aa44ff (purple,
6px diameter, 1px thick). The center #1a0a2a (very dark purple-black,
4px diameter). A small highlight #cc66ff (1px, on the upper-left
of the ring). The overall feel is a tiny, dark sphere — the void
compressed into an icon.

Palette: #aa44ff (ring), #1a0a2a (center), #cc66ff (highlight),
#1a1a2a (outline).
```

### C13. Element Icons — Light

```
Pixel art icon, 8x8 pixels. A light/holy element icon.

A star/sun viewed from top-down. The center #ffffff (white, 1x1px,
the brightest element). Four rays #ffcc33 (gold, 1px each,
radiating up, down, left, right). A subtle glow #ffcc33 at 30%
opacity (1px halo around the entire icon). The overall feel is a
tiny, radiant star — instantly recognizable as light/holy.

Palette: #ffffff (center), #ffcc33 (rays/glow), #1a1a2a (outline).
```

### C14. Status Icons — Poison

```
Pixel art icon, 8x8 pixels. A poison status icon.

A skull viewed from top-down (simplified for 8x8). The skull shape
#33cc66 (green, 4x4px, a simple oval with two eye holes). The eye
holes #1a1a2a (dark, 1px each). A small drop #44ff44 (bright green,
1px, falling from the skull). The overall feel is a tiny, toxic
warning — the player is poisoned.

Palette: #33cc66 (skull), #1a1a2a (eyes), #44ff44 (drop), #1a1a2a
(outline).
```

### C15. Status Icons — Burn

```
Pixel art icon, 8x8 pixels. A burn status icon.

A flame viewed from top-down (same as the element icon but in
status colors). The base #ff4400 (orange-red, 3x3px). The tip
#ffaa00 (yellow, 1x1px). The overall feel is a tiny, burning
warning — the player is taking fire damage over time.

Palette: #ff4400 (base), #ffaa00 (tip), #1a1a2a (outline).
```

### C16. Status Icons — Buff

```
Pixel art icon, 8x8 pixels. A buff status icon (positive effect).

An upward arrow viewed from top-down. The arrow #33cc66 (green,
3x4px, a simple triangle pointing up with a rectangular base). A
highlight #66ff99 (1px, on the left edge of the arrow). The
overall feel is a tiny, positive indicator — the player has a
beneficial effect active.

Palette: #33cc66 (arrow), #66ff99 (highlight), #1a1a2a (outline).
```

### C17. Status Icons — Debuff

```
Pixel art icon, 8x8 pixels. A debuff status icon (negative effect).

A downward arrow viewed from top-down. The arrow #ff3344 (red,
3x4px, a simple triangle pointing down with a rectangular base). A
shadow #660000 (1px, on the right edge of the arrow). The overall
feel is a tiny, negative indicator — the player has a harmful
effect active.

Palette: #ff3344 (arrow), #660000 (shadow), #1a1a2a (outline).
```

### C18. Rarity Borders

```
Pixel art UI element, 16x16 pixels (×5 variants). Colored borders
for item rarity. Each variant is a 16x16px square with a 2px
border and transparent interior.

COMMON: Border #888888 (gray, 2px). Plain, no effects.
UNCOMMON: Border #33cc66 (green, 2px). A subtle glow #66ff99 at
  20% opacity on the inner edge.
RARE: Border #3344aa (blue, 2px). A subtle glow #44ddff at 20%
  opacity. Small sparkle #ffffff (1px dot) at each corner.
EPIC: Border #aa44ff (purple, 2px). A glow #cc66ff at 30% opacity.
  Sparkles #ffffff (1px dots) at each corner and midpoints.
LEGENDARY: Border #ffcc33 (gold, 2px). A strong glow #ffdd66 at
  40% opacity. Sparkles #ffffff (1px dots) at corners, midpoints,
  and center of each edge. The border pulses (brighter/dimmer).
CROWN RELIC: Border is prismatic — each side is a different color
  (top: #ffcc33 gold, right: #44ddff cyan, bottom: #aa44ff purple,
  left: #33cc66 green). A strong rainbow glow at 50% opacity.
  Sparkles #ffffff everywhere. The border shimmers.

Palette per variant as described above.
```
