// ═══════════════════════════════════════════════════════════════
// FX — Screen transitions, shake, flash. All effects respect
// accessibility settings (reducedMotion / reducedFlash).
// ═══════════════════════════════════════════════════════════════

import { GAME_W, GAME_H, DEPTH } from '../config.js';
import { Settings } from './settings.js';

// Fade the screen to a color, then run cb.
export function fadeOut(scene, ms = 400, cb = null, color = 0x000000) {
  const r = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, color)
    .setAlpha(0).setDepth(DEPTH.FADE).setScrollFactor(0);
  scene.tweens.add({
    targets: r, alpha: 1, duration: Settings.reducedMotion ? Math.min(ms, 200) : ms,
    onComplete: () => { if (cb) cb(); }
  });
  return r;
}

// Fade in from a color overlay (destroys overlay when done).
export function fadeIn(scene, ms = 400, cb = null, color = 0x000000) {
  const r = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, color)
    .setAlpha(1).setDepth(DEPTH.FADE).setScrollFactor(0);
  scene.tweens.add({
    targets: r, alpha: 0, duration: Settings.reducedMotion ? Math.min(ms, 200) : ms,
    onComplete: () => { r.destroy(); if (cb) cb(); }
  });
  return r;
}

// Camera shake — suppressed by reducedMotion.
export function shake(scene, intensity = 0.008, ms = 200) {
  if (Settings.reducedMotion) return;
  scene.cameras.main.shake(ms, intensity);
}

// Brief flash — softened/removed by reducedFlash.
export function flash(scene, color = 0xffffff, ms = 120, alpha = 0.8) {
  if (Settings.reducedFlash) {
    // gentle dim pulse instead of flash
    const r = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, color)
      .setAlpha(0.15).setDepth(DEPTH.FADE).setScrollFactor(0);
    scene.tweens.add({ targets: r, alpha: 0, duration: ms * 2, onComplete: () => r.destroy() });
    return;
  }
  const r = scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, color)
    .setAlpha(alpha).setDepth(DEPTH.FADE).setScrollFactor(0);
  scene.tweens.add({ targets: r, alpha: 0, duration: ms, onComplete: () => r.destroy() });
}

// Scene transition helper: fade out → switch scene → (target fades in itself).
export function transition(scene, targetKey, data = {}, ms = 350) {
  if (scene._transitioning) return;
  scene._transitioning = true;
  fadeOut(scene, ms, () => {
    scene._transitioning = false;
    scene.scene.start(targetKey, data);
  });
}
