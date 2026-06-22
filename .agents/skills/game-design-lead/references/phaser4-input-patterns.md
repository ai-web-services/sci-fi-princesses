# Phaser 4 Input Handling Patterns

Discovered during 2026-06-20 session fixing Stellar Princesses RPG (Phaser 4.2.0).

## Critical API Changes from Phaser 3

### Keyboard Input

**Phaser 3 (BROKEN in Phaser 4):**
```javascript
kb.isDown(Phaser.Input.Keyboard.KeyCodes.Z)
```

**Phaser 4 (WORKS):**
```javascript
const keyZ = kb.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
keyZ.isDown  // boolean, true while held
Phaser.Input.Keyboard.JustDown(keyZ)  // true only on the frame it was pressed
```

### JustDown Must Be Called in update()

`JustDown()` is frame-based. Calling it from `time.addEvent` callbacks means it almost never catches key presses. Always poll input in `scene.update()`.

### getInput() Pattern for Phaser 4

```javascript
function getInput(scene) {
  const kb = scene.input.keyboard;
  const gp = scene.input.gamepad?.getPad(0) ?? null;
  let dx = 0, dy = 0;
  if (kb.addKey(KeyA).isDown || kb.addKey(KeyLeft).isDown) dx = -1;
  if (kb.addKey(KeyD).isDown || kb.addKey(KeyRight).isDown) dx = 1;
  if (kb.addKey(KeyW).isDown || kb.addKey(KeyUp).isDown) dy = -1;
  if (kb.addKey(KeyS).isDown || kb.addKey(KeyDown).isDown) dy = 1;
  const interact = Phaser.Input.Keyboard.JustDown(kb.addKey(KeyZ)) ||
                   Phaser.Input.Keyboard.JustDown(kb.addKey(KeySpace)) ||
                   !!(gp && gp.buttons[0] && Phaser.Input.Gamepad.JustDown(gp.buttons[0]));
  return { dx, dy, interact, cancel, menu, gp };
}
```

### Gamepad D-Pad Bug
`gp.down` must set `dy = 1` (not `-1` which is same as up).

## Browser Tab Key Interference
Browser intercepts Tab/F-keys. Add `e.preventDefault()` in HTML. Use Q or Shift for in-game tab-switching, never Tab.

## Crisp Rendering: zoom + Scale.NONE
NEVER use `pixelArt: true` — it blurs fonts. NEVER use `Scale.FIT` — non-integer scale factors cause blur.

```javascript
const config = {
  width: 480, height: 270,
  zoom: 2,
  scale: { mode: Phaser.Scale.NONE }
};
```
```css
canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
```

## Node.js Dev Server
Use Node.js + WebSocket live reload instead of python http.server for web game dev. See `templates/node-server.js`.
