# Phaser 4 Sprite Generation Patterns

Discovered during 2026-06-20 session fixing Stellar Princesses RPG (Phaser 4.2.0).

## Character Sprite Clipping Fix

**Problem:** Character sprites drawn with negative y coordinates (head above origin) get clipped because the texture bounds don't account for the full content area.

**Root cause:** Using coordinates like `g.fillRect(x, -18, w, h)` draws above the texture's top edge. The texture is `16*scale × 20*scale` but content spans y=-18 to y=8, which is 26 pixels of content in a 40-pixel texture with the visual center offset.

**Fix:** Use a vertical offset (`CY`) to center all content within the texture bounds:

```javascript
const CY = 4; // vertical offset to center content
// Head at CY+1, feet at CY+24, total content fits in 0..36 of 40px texture
g.fillRect(8, CY + 1, 16, 14);  // head
g.fillRect(6, CY + 8, 20, 12);  // body
g.fillRect(8, CY + 18, 4, 8);   // legs
g.fillRect(7, CY + 24, 6, 4);   // shoes
```

**Rule:** Always keep all draw coordinates ≥ 0 and ≤ texture height. Use an offset constant to center the character vertically.

## Generating Textures for NPCs/Enemies

For simple colored-blob enemies (dungeon creatures), use Phaser.Graphics with containers:

```javascript
const enemyContainer = this.add.container(0, 0).setDepth(10);
const g = this.add.graphics();
g.fillStyle(color, 1);
g.fillRect(-8, -12, 16, 20);  // body centered on origin
g.fillStyle(0xffffff, 1);
g.fillRect(-4, -8, 2, 2);      // eyes
g.setPosition(e.x * TILE + TILE/2, e.y * TILE + TILE/2);
enemyContainer.add(g);

// Camera scroll: move the container
enemyContainer.setPosition(-cameraX, -cameraY);
```

**Key pattern:** Draw graphics centered on (0,0), position at world coordinates. Put all enemies in one container for efficient camera scrolling.

## Walk Animation Pattern

```javascript
if (dx !== 0 || dy !== 0) {
  this.moveTimer++;
  if (this.moveTimer >= 6) { /* move logic */ }
  this.player.frame++;
  const bob = Math.sin(this.player.frame * 0.3) * 1.5;
  this.playerSprite.y = baseY + bob;
} else {
  this.moveTimer = 0;
  this.playerSprite.y = baseY;
}
```

## Web Audio Sound System Pattern

For simple 8-bit style sound effects without audio files:

```javascript
const AudioSys = {
  ctx: null,
  init() { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} },
  ensureCtx() { if (!this.ctx) this.init(); if (this.ctx?.state === 'suspended') this.ctx.resume(); },
  playTone(freq, duration, type, vol) {
    this.ensureCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime((vol || 0.15), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (duration || 0.1));
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + (duration || 0.1));
  }
};
// Usage: AudioSys.playTone(800, 0.08, 'square', 0.1);
```

Initialize once: `AudioSys.init()` in BootScene. Call `AudioSys.ensureCtx()` before first playback (browsers require user gesture to unlock audio).
