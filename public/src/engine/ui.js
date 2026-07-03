// ═══════════════════════════════════════════════════════════════
// UI — Ornate science-fantasy window kit: frames, menus, gauges.
// Windows use layered pixel borders (gold filigree over violet
// steel) with corner gems — one coherent visual system everywhere.
// ═══════════════════════════════════════════════════════════════

import { RAMP } from '../art/palette.js';
import { PixelText } from '../art/font.js';
import { uiSfx } from './audio.js';
import { Settings } from './settings.js';

// Draw an ornate window frame into a Graphics object.
export function drawWindow(g, x, y, w, h, opts = {}) {
  const F = RAMP.uiFrame, G = RAMP.uiGold;
  const fillA = opts.fillAlpha !== undefined ? opts.fillAlpha : 0.92;
  // fill — vertical two-band gradient feel
  g.fillStyle(F[0], fillA);
  g.fillRect(x + 2, y + 2, w - 4, h - 4);
  g.fillStyle(0x0d0a1c, fillA);
  g.fillRect(x + 2, y + Math.floor(h / 2), w - 4, Math.floor(h / 2) - 2);
  // outer border (violet steel)
  g.fillStyle(F[2], 1);
  g.fillRect(x, y, w, 1); g.fillRect(x, y + h - 1, w, 1);
  g.fillRect(x, y, 1, h); g.fillRect(x + w - 1, y, 1, h);
  // inner gold line
  g.fillStyle(G[2], 1);
  g.fillRect(x + 2, y + 2, w - 4, 1); g.fillRect(x + 2, y + h - 3, w - 4, 1);
  g.fillRect(x + 2, y + 2, 1, h - 4); g.fillRect(x + w - 3, y + 2, 1, h - 4);
  // gold highlight ticks on inner line (filigree suggestion)
  g.fillStyle(G[4], 1);
  const tickStep = 12;
  for (let tx = x + 6; tx < x + w - 6; tx += tickStep) g.fillRect(tx, y + 2, 2, 1);
  for (let tx = x + 6; tx < x + w - 6; tx += tickStep) g.fillRect(tx, y + h - 3, 2, 1);
  // corner gems (diamonds)
  const gem = opts.gemColor !== undefined ? opts.gemColor : 0x9678e0;
  for (const [cx, cy] of [[x + 2, y + 2], [x + w - 5, y + 2], [x + 2, y + h - 5], [x + w - 5, y + h - 5]]) {
    g.fillStyle(F[1], 1); g.fillRect(cx - 1, cy - 1, 5, 5);
    g.fillStyle(gem, 1); g.fillRect(cx, cy, 3, 3);
    g.fillStyle(0xffffff, 0.9); g.fillRect(cx, cy, 1, 1);
  }
}

// A window as a game object container. Add content with addText etc.
export class Win extends Phaser.GameObjects.Container {
  constructor(scene, x, y, w, h, opts = {}) {
    super(scene, x, y);
    this.w = w; this.h = h;
    this.bg = scene.add.graphics();
    drawWindow(this.bg, 0, 0, w, h, opts);
    this.add(this.bg);
    scene.add.existing(this);
    if (opts.depth !== undefined) this.setDepth(opts.depth);
  }
  addText(x, y, text, opts) {
    const t = new PixelText(this.scene, x, y, text, opts);
    this.add(t);
    return t;
  }
}

// ── MenuList ───────────────────────────────────────────
// Vertical menu with ▶ cursor, wrap, disabled items, scrolling.
// items: [{label, value, disabled, hint, color}]
export class MenuList extends Phaser.GameObjects.Container {
  constructor(scene, x, y, items, opts = {}) {
    super(scene, x, y);
    scene.add.existing(this);
    this.items = items;
    this.opts = {
      scale: opts.scale || 1,
      lineH: opts.lineH || 14,
      visible: opts.visible || items.length,   // max rows shown
      width: opts.width || 140,
      onSelect: opts.onSelect || (() => {}),
      onCancel: opts.onCancel || null,
      onChange: opts.onChange || null,
      rightTexts: opts.rightTexts || null      // aligned right column
    };
    this.index = 0;
    this.scroll = 0;
    // skip leading disabled
    while (this.items[this.index] && this.items[this.index].disabled && this.index < this.items.length - 1) this.index++;
    this.rows = [];
    this.cursor = null;
    this.render();
  }

  render() {
    this.removeAll(true);
    this.rows = [];
    const o = this.opts;
    const end = Math.min(this.items.length, this.scroll + o.visible);
    for (let i = this.scroll; i < end; i++) {
      const it = this.items[i];
      const yy = (i - this.scroll) * o.lineH;
      const color = it.disabled ? 0x555577 : (it.color !== undefined ? it.color : 0xe8e8f4);
      const t = new PixelText(this.scene, 10, yy, it.label, { scale: o.scale, color });
      this.add(t);
      this.rows.push(t);
      if (o.rightTexts && o.rightTexts[i] !== undefined) {
        const rt = new PixelText(this.scene, 0, yy, String(o.rightTexts[i]), { scale: o.scale, color, align: 'left' });
        rt.x = o.width - rt.textW;
        this.add(rt);
      }
    }
    this.cursor = new PixelText(this.scene, 0, 0, '▶', { scale: o.scale, color: 0xffd75e });
    this.add(this.cursor);
    // scroll arrows
    if (this.scroll > 0) this.add(new PixelText(this.scene, o.width / 2, -8, '↑', { scale: 1, color: 0x8888aa }));
    if (end < this.items.length) this.add(new PixelText(this.scene, o.width / 2, o.visible * o.lineH, '↓', { scale: 1, color: 0x8888aa }));
    this.positionCursor();
  }

  positionCursor() {
    const o = this.opts;
    if (this.index < this.scroll) { this.scroll = this.index; this.render(); return; }
    if (this.index >= this.scroll + o.visible) { this.scroll = this.index - o.visible + 1; this.render(); return; }
    this.cursor.y = (this.index - this.scroll) * o.lineH;
    this.cursor.x = 0;
  }

  move(dir) {
    const n = this.items.length;
    if (!n) return;
    let i = this.index;
    for (let tries = 0; tries < n; tries++) {
      i = (i + dir + n) % n;
      if (!this.items[i].disabled) break;
    }
    if (i !== this.index) {
      this.index = i;
      uiSfx('cursor');
      this.positionCursor();
      if (this.opts.onChange) this.opts.onChange(this.items[this.index], this.index);
    }
  }

  // Call each frame with polled input.
  handle(inp) {
    if (inp.upRepeat) this.move(-1);
    if (inp.downRepeat) this.move(1);
    if (inp.confirmed) {
      const it = this.items[this.index];
      if (it && !it.disabled) {
        uiSfx('confirm');
        this.opts.onSelect(it, this.index);
      } else {
        uiSfx('error');
      }
    }
    if (inp.cancelled && this.opts.onCancel) {
      uiSfx('cancel');
      this.opts.onCancel();
    }
  }

  get selected() { return this.items[this.index]; }
}

// ── Gauges ─────────────────────────────────────────────
export function drawGauge(g, x, y, w, h, frac, ramp, opts = {}) {
  frac = Math.max(0, Math.min(1, frac));
  g.fillStyle(0x0d0a1c, 1);
  g.fillRect(x - 1, y - 1, w + 2, h + 2);
  g.fillStyle(ramp[0], 1);
  g.fillRect(x, y, w, h);
  const fw = Math.round(w * frac);
  if (fw > 0) {
    g.fillStyle(ramp[2], 1);
    g.fillRect(x, y, fw, h);
    g.fillStyle(ramp[3], 1);
    g.fillRect(x, y, fw, 1);
  }
  if (opts.border !== false) {
    g.lineStyle(1, RAMP.uiFrame[2], 1);
    g.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
    g.lineStyle();
  }
}

// High-contrast helper: returns stronger colors when enabled
export function uiTextColor() { return Settings.highContrast ? 0xffffff : 0xe8e8f4; }
export function uiDimColor() { return Settings.highContrast ? 0xbbbbcc : 0x8888aa; }
