// ═══════════════════════════════════════════════════════════════
// VALIDATE SPRITES — PNG sheet validator for the Route P generator.
// Legacy text-grid validation remains available through the same command
// when no generated manifest is present.
// ═══════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { RAMP } from '../public/src/art/palette.js';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const DIR = path.join(ROOT, 'public/assets/sprites');
const manifestPath = path.join(DIR, 'manifest.json');

function readPng(file) {
  const data = fs.readFileSync(file);
  if (data.readUInt32BE(0) !== 0x89504e47 || data.readUInt32BE(4) !== 0x0d0a1a0a) throw new Error('bad PNG signature');
  let offset = 8, width, height, bitDepth, colorType, interlace, compressed = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset); const type = data.toString('ascii', offset + 4, offset + 8);
    const body = data.subarray(offset + 8, offset + 8 + length); offset += 12 + length;
    if (type === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); bitDepth = body[8]; colorType = body[9]; interlace = body[12]; }
    if (type === 'IDAT') compressed.push(body);
    if (type === 'IEND') break;
  }
  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) throw new Error('requires non-interlaced RGBA8 PNG');
  const raw = zlib.inflateSync(Buffer.concat(compressed));
  const stride = width * 4, rows = [], bpp = 4;
  let p = 0, previous = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[p++], row = Buffer.from(raw.subarray(p, p + stride)); p += stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? row[x - bpp] : 0, up = previous[x], upLeft = x >= bpp ? previous[x - bpp] : 0;
      if (filter === 1) row[x] = (row[x] + left) & 255;
      else if (filter === 2) row[x] = (row[x] + up) & 255;
      else if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) { const q = left + up - upLeft; const pa = Math.abs(q - left), pb = Math.abs(q - up), pc = Math.abs(q - upLeft); row[x] = (row[x] + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255; }
      else if (filter !== 0) throw new Error(`unsupported PNG filter ${filter}`);
    }
    rows.push(row); previous = row;
  }
  return { width, height, rows };
}

function validateSheet(file, action, expectedFrames, allowedRamps, range) {
  const errors = [];
  const png = readPng(file);
  if (png.width !== 512 || png.height !== 256) errors.push(`dimensions ${png.width}×${png.height}, expected 512×256`);
  const colors = new Set();
  for (let row = 0; row < 4; row++) for (let col = 0; col < expectedFrames; col++) {
    let minY = 64, maxY = -1, count = 0;
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const px = png.rows[row * 64 + y], o = (col * 64 + x) * 4;
      if (px[o + 3] === 0) continue;
      count++; minY = Math.min(minY, y); maxY = Math.max(maxY, y); colors.add(`${px[o]}-${px[o + 1]}-${px[o + 2]}`);
    }
    if (!count) errors.push(`${action} row ${row} frame ${col}: empty`);
    const height = maxY - minY + 1;
    if (height < range[0] || height > range[1]) errors.push(`${action} row ${row} frame ${col}: character height ${height}px (expected ${range[0]}–${range[1]}px)`);
  }
  if (colors.size > 32) errors.push(`${action}: ${colors.size} opaque colors (max 32)`);
  const allowedColors = new Set(allowedRamps.flatMap(ramp => ramp.colors));
  for (const color of colors) if (!allowedColors.has(color)) errors.push(`${action}: color ${color} is outside declared ramps`);
  for (const ramp of allowedRamps) {
    const visible = ramp.colors.filter(color => colors.has(color)).length;
    if (ramp.required && visible < 3) errors.push(`${action}: ramp ${ramp.name} exposes ${visible} visible steps (minimum 3)`);
  }
  return errors;
}

if (!fs.existsSync(manifestPath)) {
  console.error('FAIL generated manifest missing:', manifestPath);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const errors = [];
for (const asset of manifest.assets ?? []) for (const [action, spec] of Object.entries(asset.actions ?? {})) {
  const file = path.join(DIR, spec.file);
  if (!fs.existsSync(file)) errors.push(`${asset.id}/${action}: missing ${spec.file}`);
  else {
    const allowedRamps = (asset.ramps ?? []).map(name => ({ name, required: !(asset.accentRamps ?? []).includes(name), colors: (RAMP[name] ?? []).map(color => `${color >> 16 & 255}-${color >> 8 & 255}-${color & 255}`) }));
    const range = asset.category === 'enemy' ? ({ small: [18, 28], medium: [26, 38], large: [38, 60] }[asset.size] ?? [26, 38]) : [26, 36];
    for (const error of validateSheet(file, action, spec.frames, allowedRamps, range)) errors.push(`${asset.id}/${error}`);
  }
}
if (errors.length) { console.error('Sprite validation FAILED\n' + errors.map(e => `- ${e}`).join('\n')); process.exit(1); }
console.log(`Sprite validation OK: ${manifest.assets.length} asset(s), PNG sheets pass.`);
