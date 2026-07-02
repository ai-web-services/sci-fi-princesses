# ═══════════════════════════════════════════════════════════════
# STELLAR PRINCESSES — Image Generation Prompts
# ═══════════════════════════════════════════════════════════════

Reference this directory when generating character art, promotional
images, or concept art for the game. All prompts are grounded in the
GDD lore, the in-game color palette (`config.js` COLORS), and the
pixel-art sprite style (`sprites.js`).

## Directory Structure

| File | Contents |
|------|----------|
| `README.md` | This file — index and quick-start |
| `art-direction.md` | Camera perspective, sprite anatomy, palette, pixel rules |
| `prompt-engineering.md` | Tool-specific tips, negative prompts, upscaling |
| `concept-art.md` | Promotional/concept art — logo, key art, maps, bosses, UI mockup |
| `lyra-solari.md` | Main character — all evolution tiers, chibi, sprite sheets |
| `erynn-vexx.md` | Cat person scout — base + Phantom Queen evolution |
| `brimble-toadsworth.md` | Frog person tank — base + Leviathan Sovereign evolution |
| `drakkor-ashveil.md` | Dragon person heavy — base + Elder Wyrm evolution |
| `pip.md` | Robot drone healer — base + Omega Core evolution |
| `tiles-environment.md` | Environment tiles — town, dungeon, boss arenas (20 tiles) |
| `buildings-props.md` | Building exteriors + interactive props (18 assets) |
| `ui-elements.md` | UI elements — HUD, menus, icons (30+ elements) |
| `enemies-bosses.md` | Enemy sprites + boss sprites with animation frames (8 enemies) |

## Quick Start

1. Read `art-direction.md` for the visual foundation (top-down perspective,
   directionality, sprite anatomy).
2. Pick the file you need by category.
3. Read `prompt-engineering.md` for your target generator.
4. Copy the relevant prompt block and adapt.

## File Reference

| Asset | Description | Status |
|-------|-------------|--------|
| `public/src/sprites.js` | In-game procedural pixel sprites | Live |
| `public/src/config.js` | Color palette (COLORS object) | Live |
| `GAME_DESIGN_DOC.md` | Full character lore & design | Live |
| `ART_ASSET_INVENTORY.md` | Full asset list with priorities | Live |
| `prompts/` | This directory — all generation prompts | Live |
