# Prompt Engineering Notes

Tool-specific guidance for using the prompts in this directory.

## Pixel-Art Focused Tools

(Aseprite, PixAI, Lospec, etc.)

- Emphasize: "no anti-aliasing", "hard pixel edges", "limited palette"
- Specify exact hex colors from `art-direction.md`
- Request specific canvas sizes (e.g., "32x40 pixels", "16x16 icon")
- Use "transparent background" for sprites and icons

## General AI Image Generators

(DALL-E, Midjourney, Stable Diffusion, etc.)

**Add to prompts:**
- "pixel art sprite", "16-bit", "SNES style"
- "no gradients — flat color cells"
- "clean pixel outlines"

**Negative prompts:**
```
no realistic, no 3D render, no smooth shading, no photograph,
no anti-aliasing, no gradients, no blurry
```

## Concept Art / Promotional Images

- Remove pixel-specific constraints
- Add: "digital painting", "concept art", "dramatic lighting", "high detail"
- Keep the color palette and character design notes from the prompt
- Increase resolution / aspect ratio as needed

## Upscaling Pixel Art

Always use **nearest-neighbor** upscaling to preserve hard pixel edges.

```bash
# ImageMagick
convert input.png -scale 400% -interpolate integer output.png

# Or specify exact output size
convert input.png -resize 128x160! -interpolate integer output.png
```

In Aseprite: Resize with "Nearest Neighbor" algorithm.

## Consistency Across Evolution Tiers

When generating multiple evolution forms of the same character:

1. Keep **hair style**, **eye color**, and **facial structure** identical
2. Only change: outfit details, energy effects, crown state
3. Reference the base form prompt when generating evolved forms
4. Use the same seed (if the generator supports it) for character-only variations
5. Generate all tiers in the same session/style pass when possible
