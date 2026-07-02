# Art Direction — Stellar Princesses

## Camera & Perspective

**Top-down orthographic.** Camera looks straight down at the ground plane.
Characters are rendered as flat sprites viewed from above. This is NOT
an isometric or 3/4 view — it is a pure 90-degree downward angle.

## Sprite Anatomy (Top-Down)

At top-down angle, the viewer sees:

- **Head** from above — hair is the dominant shape (a flat mass on top)
- **Shoulders & upper torso** — the widest body part, defines silhouette
- **Arms** hang at sides or slightly forward, visible as small shapes
- **Legs & feet** — seen from above as two small shapes at the bottom
  of the sprite; foot direction indicates facing direction

What you do NOT see: facial features from the front, chest, stomach.
What you DO see: top of head, shoulder width, arm position, foot spread.

## Directionality

The game uses 4-directional movement. Each direction shows a different
view of the same character:

| Direction | Camera sees | Key visual |
|-----------|-------------|------------|
| **Down** (facing camera) | Top of head, shoulders, front of outfit | Hair top, shoulder line, jacket front, belt |
| **Up** (back) | Back of head, back of outfit | Hair back, jacket back, cape/cloak |
| **Left** | Left profile | Left arm visible, right arm hidden, hair left side |
| **Right** | Right profile | Right arm visible, left arm hidden, hair right side |

For each direction, the sprite must read clearly as the same character.
Hair shape, outfit colors, and silhouette must be consistent across all
four views.

## Sprite Dimensions

- Canvas: 32×40 pixels per frame (2× scale of a 16×20 logical grid)
- Pixel scale factor: 2 (each "game pixel" = 2×2 real pixels)
- Outline: 1px near-black `#1a1a2a` on all edges
- Transparent background (no fill)

## Palette Anchors

From `config.js` COLORS:

| Element | Hex | Notes |
|---------|-----|-------|
| Skin (warm) | `#ffccaa` | Primary skin tone |
| Skin (shadow) | `#ddaa88` | Shading variant |
| Hair (Lyra light) | `#ffdd44` | Golden blonde highlight |
| Hair (Lyra dark) | `#cc8833` | Golden blonde shadow |
| Eyes (Lyra) | `#44ddff` | Cyan — visible only in down/side frames as small dots |
| Outfit primary | `#3344aa` | Deep blue jacket |
| Outfit accent | `#aa44ff` | Purple energy glow |
| Metal/tech | `#778899` | Steel buckles, zippers |
| Metal/dark | `#553322` | Dark bronze |
| Void/dark | `#1a0a2a` | Deep purple-black |
| Energy/light | `#ffcc33` | Bright gold |
| Energy/white | `#ffffff` | Pure highlights |
| Outline | `#1a1a2a` | Near-black for pixel outlines |

## Pixel Art Rules

- No anti-aliasing on pixel edges
- Hard 1px outlines in near-black
- Flat color cells — no gradients
- Max 16 colors per character sprite
- Nearest-neighbor upscaling only
- Each frame on transparent background

## Lighting Convention

Light source is from the **upper-left** of the sprite (northwest).
This means:
- Highlights on the top-left edges of shapes
- Shadows on the bottom-right edges
- Consistent across all frames and all characters
