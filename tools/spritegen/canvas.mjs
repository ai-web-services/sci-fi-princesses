import { encodePng } from './png.mjs';
import { RAMP } from '../../public/src/art/palette.js';

const TRANSPARENT = -1;

export class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint32Array(width * height);
    this.material = new Int16Array(width * height).fill(TRANSPARENT);
  }

  index(x, y) { return y * this.width + x; }
  inside(x, y) { return x >= 0 && y >= 0 && x < this.width && y < this.height; }

  set(x, y, color, material = TRANSPARENT) {
    x = Math.round(x); y = Math.round(y);
    if (!this.inside(x, y)) return;
    const i = this.index(x, y);
    this.pixels[i] = color >>> 0;
    this.material[i] = material;
  }

  ramp(material, step = 2) {
    const values = RAMP[material];
    if (!values) throw new Error(`Unknown art ramp: ${material}`);
    return values[Math.max(0, Math.min(values.length - 1, step))];
  }

  fillRect(x, y, w, h, material, step = 2) {
    const color = this.ramp(material, step);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) this.set(xx, yy, color, Object.keys(RAMP).indexOf(material));
  }

  ellipse(cx, cy, rx, ry, material, step = 2) {
    const color = this.ramp(material, step), id = Object.keys(RAMP).indexOf(material);
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, color, id);
      }
    }
  }

  polygon(points, material, step = 2) {
    const minY = Math.floor(Math.min(...points.map(p => p[1])));
    const maxY = Math.ceil(Math.max(...points.map(p => p[1])));
    const color = this.ramp(material, step), id = Object.keys(RAMP).indexOf(material);
    for (let y = minY; y <= maxY; y++) {
      const xs = [];
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i], [xj, yj] = points[j];
        if ((yi > y) !== (yj > y)) xs.push((xj - xi) * (y - yi) / (yj - yi) + xi);
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i < xs.length; i += 2) for (let x = Math.ceil(xs[i]); x <= Math.floor(xs[i + 1] ?? xs[i]); x++) this.set(x, y, color, id);
    }
  }

  line(x0, y0, x1, y1, material, step = 2) {
    const color = this.ramp(material, step), id = Object.keys(RAMP).indexOf(material);
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    while (true) {
      this.set(x0, y0, color, id);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  autoShade() {
    const source = this.material.slice();
    const bounds = new Map();
    for (let y = 0; y < this.height; y++) for (let x = 0; x < this.width; x++) {
      const materialId = source[this.index(x, y)];
      if (materialId < 0) continue;
      const b = bounds.get(materialId) || { minX: x, maxX: x, minY: y, maxY: y };
      b.minX = Math.min(b.minX, x); b.maxX = Math.max(b.maxX, x);
      b.minY = Math.min(b.minY, y); b.maxY = Math.max(b.maxY, y); bounds.set(materialId, b);
    }
    for (let y = 0; y < this.height; y++) for (let x = 0; x < this.width; x++) {
      const i = this.index(x, y), materialId = source[i];
      if (materialId < 0) continue;
      const materialName = Object.keys(RAMP)[materialId];
      const same = (nx, ny) => this.inside(nx, ny) && source[this.index(nx, ny)] === materialId;
      const b = bounds.get(materialId);
      const nx = (x - b.minX) / Math.max(1, b.maxX - b.minX);
      const ny = (y - b.minY) / Math.max(1, b.maxY - b.minY);
      let step = nx + ny < 0.42 ? 4 : nx + ny > 1.28 ? 1 : 2;
      if (!same(x + 1, y) || !same(x, y + 1)) step = 0;
      this.pixels[i] = this.ramp(materialName, step);
    }
  }

  autoSelout() {
    const copy = this.pixels.slice(), mats = this.material.slice();
    for (let y = 0; y < this.height; y++) for (let x = 0; x < this.width; x++) {
      const i = this.index(x, y);
      if (mats[i] !== TRANSPARENT) continue;
      const neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      const source = neighbors.map(([nx, ny]) => this.inside(nx, ny) ? this.index(nx, ny) : -1).find(n => n >= 0 && mats[n] !== TRANSPARENT);
      if (source === undefined) continue;
      const materialName = Object.keys(RAMP)[mats[source]];
      this.pixels[i] = this.ramp(materialName, 0);
      this.material[i] = mats[source];
    }
    // Preserve the original pixels; only transparent exterior pixels changed above.
    void copy;
  }

  toPng() {
    const rgba = Buffer.alloc(this.width * this.height * 4);
    for (let i = 0; i < this.pixels.length; i++) {
      const color = this.pixels[i], o = i * 4;
      rgba[o] = (color >>> 16) & 255; rgba[o + 1] = (color >>> 8) & 255; rgba[o + 2] = color & 255;
      rgba[o + 3] = this.material[i] === TRANSPARENT ? 0 : 255;
    }
    return encodePng(this.width, this.height, rgba);
  }
}
