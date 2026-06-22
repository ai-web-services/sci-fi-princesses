# Phaser 3 → 4 Migration Notes

Key API differences encountered when building with Phaser 4.2.0.

## Scale Mode

Phaser 4 renames scale modes:

| Phaser 3 | Phaser 4 |
|----------|----------|
| `Phaser.Scale.FIT` | `Phaser.Scale.NONE` (manual) or `Phaser.Scale.FIT` |
| `Phaser.Scale.NO_CENTER` | `Phaser.Scale.NO_CENTER` |
| `Phaser.Scale.RESIZE` | `Phaser.Scale.RESIZE` |

For pixel-art games at fixed resolution, use `Scale.NONE` and handle
canvas scaling manually via CSS (`image-rendering: pixelated`).

## Input Handling

### JustDown / JustUp

Phaser 4 moves `JustDown` and `JustUp`:

```javascript
// Phaser 3
Phaser.Input.Keyboard.JustDown(key)

// Phaser 4 — same API, but also:
Phaser.Input.Gamepad.JustDown(button)  // gamepad JustDown exists
```

### Gamepad

Poll gamepad **once per frame** and cache the reference. Do NOT call
`scene.input.gamepad.getPad(0)` in every `dx`/`dy`/`interact` helper —
the gamepad state is per-frame.

```javascript
// Cache once per frame in update():
const gp = scene.input.gamepad ? scene.input.gamepad.getPad(0) : null;
```

### Key Objects

Creating key objects once (outside `update()`) is still the correct pattern:

```javascript
const KeyW = Phaser.Input.Keyboard.KeyCodes.W;
// Then in update:
kb.addKey(KeyW).isDown
```

## Graphics / Texture Generation

`scene.make.graphics()` replaces `scene.add.graphics()` for off-screen texture
generation:

```javascript
// Phaser 4 pattern for procedural textures:
const g = scene.make.graphics({ x: 0, y: 0, add: false });
g.fillStyle(color, 1);
g.fillRect(x, y, w, h);
g.generateTexture(key, width, height);
g.destroy();
```

## Scene Transitions

Scene launch/pause/resume pattern for overlay scenes (dialogue, shop, inventory):

```javascript
// Launch overlay, pause current:
this.scene.launch('DialogueScene', { npc: npcData, scene: this });
this.scene.pause();

// In overlay, on completion:
this.scene.stop();
if (this.mainScene) this.mainScene.scene.resume();
```

## Module Loading

Phaser 4 from CDN with ES modules:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser@4.2.0/dist/phaser.min.js"></script>
<script type="module">
  import('./src/main.js');
</script>
```

Import scenes and utilities as ES modules — no bundler needed for small projects:

```javascript
// main.js
import { BootScene } from './scenes/BootScene.js';
import { GAME_W, GAME_H } from './config.js';
```

## Canvas Scaling for Pixel Art

Integer scaling to avoid blur:

```javascript
function scaleCanvas() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  const scale = Math.max(1, Math.floor(
    Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H)
  ));
  canvas.style.width = (GAME_W * scale) + 'px';
  canvas.style.height = (GAME_H * scale) + 'px';
}
```

With CSS:
```css
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

## Common Pitfalls

1. **Gamepad button state not cleared**: `GpButtons[idx]` must be cleared every
   frame or `JustDown` only fires once. Clear in your input polling function.

2. **Loading assets in `create()`**: Still wrong in Phaser 4. Use `preload()` or
   generate textures procedurally in `BootScene.create()`.

3. **`this.load` in BootScene**: For procedurally generated textures, you don't
   need `preload()` at all — just generate in `create()` and call
   `scene.start('NextScene')` when done.
