# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — Environment Tile Prompts
# ═══════════════════════════════════════════════════════════════

Pixel art tile textures for the game world. All tiles are 16×16 pixels
(1× scale) viewed from pure top-down orthographic perspective. These
replace or upgrade the procedural tiles in `textures.js`.

For art direction rules, see `art-direction.md`.
For palette reference, see `config.js` COLORS.

## Style Rules

- **Canvas**: 16×16 pixels per tile
- **Perspective**: Pure top-down (90 degrees), no isometric angle
- **Lighting**: Upper-left light source, consistent across all tiles
- **Palette**: Max 8 colors per tile (readability at small size)
- **Outline**: 1px near-black #1a1a2a on edges where tiles meet
different types
- **Seamless**: Tiles must tile seamlessly — edges must match when
  placed adjacent to the same tile type
- **No anti-aliasing**: Hard pixel edges only

---

## PART A: TOWN TILES (Nova Prime City)

### A1. Town Floor — Primary

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Sci-fi city floor tile for Nova Prime City. Dark blue-gray base
#2a2a4a. Subtle panel line grid: thin lines #333355 divide the tile
into four 8x8 quadrants, creating a clean metallic floor panel look.
At the center where the panel lines cross, a tiny circular rivet
#444466 (1px). Each quadrant has a faint highlight #3a3a5a in the
upper-left corner (light source from upper-left) and a subtle shadow
#222244 in the lower-right corner. The overall feel is clean,
futuristic, well-maintained — the floor of a thriving space city.
Palette: #2a2a4a (base), #333355 (panel lines), #444466 (rivets),
#3a3a5a (highlight), #222244 (shadow), #1a1a2a (outline).
```

### A2. Town Floor — Worn Variant

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Worn variant of the town floor tile. Same panel layout as the primary
town floor, but with signs of wear: a few scratches #444466 across
the surface (1px diagonal lines), one slightly discolored panel
quadrant #353560 (subtle, not dramatic), and a small crack line
#1a1a2a running from the upper-right corner toward the center.
The overall feel is the same clean sci-fi floor but in a less
maintained area — back alleys, older districts.
Palette: #2a2a4a (base), #333355 (panel lines), #444466 (scratches),
#353560 (discolored panel), #1a1a2a (crack/outline).
```

### A3. Town Wall — Primary

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Sci-fi building wall tile for Nova Prime City. The wall is viewed
from above — this is the top edge of a wall, showing the wall cap/roof
edge. Base color #444466 (medium blue-gray metal). A raised ridge
#555577 runs along the top edge (1px wide, the wall's top surface).
Below the ridge, the wall face #3a3a5a has vertical panel lines
#333355 every 4px, creating a ribbed metal wall appearance. Small
rivets #666688 at each panel line intersection. The upper-left edge
has a highlight #5a5a7a (light catching the ridge). The lower-right
has a shadow #2a2a4a. The overall feel is solid, well-built
construction — the walls of a prosperous city.
Palette: #444466 (base), #555577 (ridge), #3a3a5a (face), #333355
(panel lines), #666688 (rivets), #5a5a7a (highlight), #2a2a4a (shadow).
```

### A4. Town Wall — Ornate Variant

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Ornate wall cap tile for important buildings (Crown Spire, shops).
Same structure as the primary wall but with decorative elements: the
ridge #555577 has a gold inlay line #ffcc33 running along its center
(1px). The panel lines #333355 are finer and more frequent (every 2px).
Small decorative dots #ffcc33 (1px each) are placed at regular intervals
along the ridge. The overall feel is prestigious and well-funded —
the walls of important civic buildings.
Palette: #444466 (base), #555577 (ridge), #ffcc33 (gold inlay), #3a3a5a
(face), #333355 (panel lines), #666688 (rivets).
```

### A5. Town Path — Stone

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Cobblestone path tile for town walkways. Base color #554433 (warm
brown). Irregular stone shapes in slightly varied tones: #665544
(lighter stones), #443322 (darker stones), #554433 (medium stones).
The stones are roughly 4-6px across, arranged in a natural
cobblestone pattern. Dark mortar lines #3a2a1a separate the stones
(1px gaps). A few stones have tiny highlights #776655 in their
upper-left corners. The overall feel is warm, walkable, slightly
rustic — a contrast to the metallic city floors.
Palette: #554433 (base), #665544 (light stone), #443322 (dark stone),
#3a2a1a (mortar), #776655 (highlight), #1a1a2a (outline).
```

### A6. Town Grass — Garden

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Garden grass tile for Nova Prime City's green spaces. Base color
#225533 (medium green). Grass blades in clusters: #336644 (lighter
green, main blades), #1a4428 (darker green, shadow blades), #44aa66
(bright green, young growth). Blades are 1-2px tall, clustered in
groups of 3-5, distributed across the tile. A few tiny flowers
#ff66aa (1px pink dots) scattered sparingly. The upper-left area
is slightly brighter #337744 (light hitting the grass). The overall
feel is a well-maintained alien garden — lush but not overgrown.
Palette: #225533 (base), #336644 (light grass), #1a4428 (dark grass),
#44aa66 (young growth), #ff66aa (flowers), #337744 (highlight).
```

### A7. Town Water — Canal

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Water tile for town canals and fountains. Base color #224444 (deep
teal-blue). Animated-feeling water surface: curved wave lines
#336666 (lighter teal, 1px curves) flow horizontally across the tile.
White foam/highlight lines #aaccff (1px, sparse) catch the light at
wave peaks. Darker depth shadows #112233 appear in the lower portions
of waves. A few tiny bubbles #ffffff (1px dots) float near the
surface. The overall feel is clean, contained water — city canals,
not wild oceans.
Palette: #224444 (base), #336666 (wave highlights), #aaccff (foam),
#112233 (depth shadow), #ffffff (bubbles).
```

### A8. Town Metal — Grate

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Metal grate/floor tile for industrial areas of the city. Base color
#556677 (steel gray). A grid of thin metal bars #667788 (1px wide)
divides the tile into a 4×4 grid of square openings. Through the
openings, a darker surface #334455 is visible below (the grate has
depth). The bar intersections have small bolt heads #8899aa (1px
squares). Upper-left edges of bars catch light #778899. The overall
feel is industrial, functional — maintenance areas, docks, utility
zones.
Palette: #556677 (base), #667788 (bars), #334455 (below), #8899aa
(bolts), #778899 (highlight), #1a1a2a (outline).
```

---

## PART B: DUNGEON TILES (Void Scar)

### B1. Dungeon Floor — Stone

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Dark stone floor tile for the Void Scar dungeon. Base color #2a2a2a
(very dark gray). Irregular stone slabs in slightly varied tones:
#333333 (lighter slabs), #222222 (darker slabs), #2a2a2a (medium).
Slabs are 4-7px across with 1px mortar gaps #1a1a1a between them.
Some slabs have faint cracks #1a1a1a (1px lines). A few have
subtle void-touched discoloration — faint purple tints #2a1a2a
on 1-2 slabs per tile. The overall feel is ancient, dark, slightly
corrupted — a place where void energy has seeped into the stone.
Palette: #2a2a2a (base), #333333 (light slab), #222222 (dark slab),
#1a1a1a (mortar/cracks), #2a1a2a (void tint), #0a0a0a (deep shadow).
```

### B2. Dungeon Wall — Stone

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Dark stone wall cap tile for the Void Scar dungeon. Same concept as
town wall but darker and more primitive. Base color #3a3a3a (dark
gray stone). Rough ridge #444444 along the top edge (1px, uneven).
The wall face #2a2a2a has irregular vertical striations #222222
(rough-hewn stone texture, not clean panel lines). No rivets — this
is ancient construction. Faint void energy seepage #2a1a2a (purple
tint) along the bottom edge where the wall meets the floor. The
overall feel is ancient, oppressive, corrupted.
Palette: #3a3a3a (base), #444444 (ridge), #2a2a2a (face), #222222
(striations), #2a1a2a (void seepage), #0a0a0a (shadow).
```

### B3. Dungeon Floor — Cracked

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Cracked dungeon floor tile — damaged variant. Same dark stone base
#2a2a2a but with prominent cracks. A main crack #1a1a1a runs
diagonally from upper-left to lower-right (1px wide, jagged path).
Smaller branch cracks #1a1a1a extend from the main crack. Through
the largest crack, a faint purple void glow #aa44ff (1px line,
very subtle) is visible — void energy bleeding through from below.
Some stone fragments along the crack edges are slightly displaced
#333333 (lighter, raised). The overall feel is a floor on the verge
of collapse.
Palette: #2a2a2a (base), #1a1a1a (cracks), #aa44ff (void glow),
#333333 (displaced fragments), #0a0a0a (deep shadow).
```

### B4. Dungeon Void Floor

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Void-corrupted floor tile — the stone is dissolving into void.
Base color #1a0a2a (very dark purple-black). The edges of the tile
are more corrupted than the center — void energy #1a0a2a with
faint purple glow #aa44ff (1px, sparse) creeps inward. Small
fragments of remaining stone #2a2a2a float in the void like islands.
Tiny void particles #aa44ff (1px dots, 3-4 per tile) float upward.
The overall feel is reality breaking down — the void is consuming
the dungeon from the edges inward.
Palette: #1a0a2a (void base), #aa44ff (void glow), #2a2a2a (stone
fragments), #0a0000 (deep void), #2a1a2a (transition zone).
```

### B5. Dungeon Water — Flooded

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Flooded dungeon floor tile — standing water in the dungeon. Base
color #1a2a4a (dark murky blue). The water is not clean — it has
a faint purple tint #2a1a2a (void-touched) in patches. Murky wave
lines #223355 (1px, subtle) disturb the surface. A few floating
debris particles #3a3a3a (1px, dark gray — bits of stone or bone)
drift on the surface. Dark depth shadows #0a1a2a appear in the
deepest areas. The overall feel is stagnant, corrupted water —
flooded chambers where void energy has tainted the groundwater.
Palette: #1a2a4a (water base), #2a1a2a (void tint), #223355 (waves),
#3a3a3a (debris), #0a1a2a (depth), #0a0a1a (outline).
```

### B6. Dungeon Lava

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Lava floor tile for fire-themed dungeon areas. Base color #441100
(dark cooled lava/obsidian). Flowing lava channels #cc2200 (bright
orange-red, 1-2px wide) wind across the tile in organic patterns.
The brightest parts of the lava #ff4400 (1px lines at the center
of channels) glow intensely. Cooled lava edges #881100 (dark red)
border the channels. Heat shimmer effect: the air above the lava
is subtly distorted — represented by slightly lighter pixels
#552200 above the channels. Ember particles #ffaa00 (1px dots, 2-3
per tile) float upward from the lava. The overall feel is dangerous,
volcanic, intense.
Palette: #441100 (cooled base), #cc2200 (lava), #ff4400 (bright lava),
#881100 (cooled edge), #552200 (heat shimmer), #ffaa00 (embers).
```

### B7. Dungeon Ice

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Ice floor tile for ice-themed dungeon areas. Base color #88aacc
(pale blue-white). Ice surface has subtle fracture lines #aaccff
(1px, thin, branching) across it. Some areas are more opaque
#6688aa (thicker ice), others more transparent #cceeff (thin ice).
A few trapped air bubbles #ffffff (1px dots, 2-3 per tile) are
visible within the ice. The upper-left edge has a bright highlight
#eef4ff (light reflecting off the ice surface). The overall feel
is cold, slippery, ancient — frozen chambers deep in the dungeon.
Palette: #88aacc (base), #aaccff (fractures), #6688aa (thick ice),
#cceeff (thin ice), #ffffff (bubbles), #eef4ff (highlight).
```

### B8. Dungeon Metal — Walkway

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Metal walkway tile for dungeon bridges and platforms. Base color
#556677 (steel gray, same as town grate but darker). Metal planks
#667788 (2px wide) run horizontally with 1px gaps #334455 between
them (showing the void far below). Plank edges have small rivets
#8899aa (1px squares) at regular intervals. Some planks have rust
spots #885533 (1px, sparse). The upper-left edges of planks catch
light #778899. The overall feel is precarious, industrial — metal
grating over a deep void chasm.
Palette: #556677 (base), #667788 (planks), #334455 (gaps), #8899aa
(rivets), #885533 (rust), #778899 (highlight).
```

---

## PART C: BOSS ARENA TILES

### C1. Boss Arena — Stellar Gate (Boss 1)

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Boss arena floor tile for the Stellar Gate chamber (Boss 1: Void
Sentinel Kael). Base color #3a3a4a (dark blue-gray stone). A
geometric pattern of inlaid metal lines #778899 (1px) forms a
radiating star pattern from the center — the floor was once
ceremonial. The metal lines are cracked and leaking void energy
#aa44ff (1px glow along the cracks). Stone tiles #444455 (slightly
lighter) form the background between the metal lines. Scattered
debris #2a2a2a (1px fragments, 3-4 per tile) litters the floor.
The overall feel is a once-grand chamber now corrupted by void.
Palette: #3a3a4a (base), #778899 (metal inlay), #aa44ff (void leak),
#444455 (stone), #2a2a2a (debris), #1a1a2a (shadow).
```

### C2. Boss Arena — Flooded Throne (Boss 2)

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Boss arena floor tile for the Flooded Throne (Boss 2: Drowned
Matriarch). Base color #1a2a4a (deep water). The water is deeper
and darker than the dungeon flooded tile — this is a fully
submerged throne room. Bioluminescent patterns #44ff44 (1px dots
and short lines, 4-5 per tile) glow faintly on the floor —
ancient aquatic murals now underwater. Void corruption streaks
#1a0a2a (dark purple, 1px wavy lines) contaminate the
bioluminescence. A few ancient stone tiles #3a4a5a are visible
through the clear water in places. The overall feel is a drowned
temple — beautiful and tragic.
Palette: #1a2a4a (water), #44ff44 (bioluminescence), #1a0a2a (void
corruption), #3a4a5a (visible floor), #0a1a2a (deep water shadow).
```

### C3. Boss Arena — Ash Pit (Boss 3)

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Boss arena floor tile for the Ash Pit (Boss 3: Ash Tyrant Ignis).
Base color #331100 (dark volcanic rock). Cracks in the rock
#cc2200 (1px, glowing orange-red) form a web pattern across the
tile — lava flowing beneath the surface. The brightest crack
intersections #ff4400 (1px) glow intensely. Ash and ember particles
#ffaa00 (1px dots, 3-4 per tile) float above the surface. Cooled
lava flow patterns #441100 (darker, organic shapes) show where
previous lava flows have solidified. The overall feel is a living
volcanic surface — the floor itself is barely solid.
Palette: #331100 (base), #cc2200 (cracks), #ff4400 (bright cracks),
#ffaa00 (embers), #441100 (cooled flows), #220000 (deep shadow).
```

### C4. Boss Arena — Void Heart (Final Boss)

```
Pixel art tile, 16x16 pixels, top-down view, seamless tiling.
Boss arena floor tile for the Void Heart (Final Boss: The Final
Voidborn). Base color #0a0a1a (near-black). The floor is barely
reality — fragments of stone #1a1a2a (1-2px, sparse) float in a
sea of void energy #0a0a1a. Void energy wisps #aa44ff (1px lines,
3-4 per tile) rise from the surface. At the center of the tile, a
faint prismatic glow #ffcc33/#44ddff/#aa44ff (1px, the corrupted
Crown shard light) pulses. The edges of the tile dissolve into
pure void #000000. The overall feel is the edge of reality — a
floor that barely exists, held together by the Crown shards'
remaining power.
Palette: #0a0a1a (void base), #1a1a2a (stone fragments), #aa44ff
(void wisps), #ffcc33/#44ddff/#aa44ff (corrupted Crown glow),
#000000 (dissolution edge).
```
