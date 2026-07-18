// ═══════════════════════════════════════════════════════════════
// COMPARE REF — builds a nearest-neighbor ×6 generated/reference plate.
// The reference is intentionally supplied as a local path; it is never
// copied into the repository or used as shipped source material.
// ═══════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { decodePng, encodePng } from '../tools/spritegen/png.mjs';
import { scaleNearest } from '../tools/spritegen/review.mjs';

function arg(name, fallback) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : fallback; }
const generatedPath = arg('--generated', 'public/assets/sprites/lyra-idle.png');
const referencePath = arg('--reference');
const outputPath = arg('--out', 'public/assets/sprites/reviews/lyra-idle-compare-6x.png');
if (!referencePath) { console.error('Usage: node scripts/compare_ref.mjs --reference <local-png> [--generated <png>] [--out <png>]'); process.exit(2); }

const generated = decodePng(fs.readFileSync(generatedPath));
const reference = decodePng(fs.readFileSync(referencePath));
if (generated.width !== reference.width || generated.height !== reference.height) throw new Error(`dimension mismatch: generated ${generated.width}×${generated.height}, reference ${reference.width}×${reference.height}`);
const left = scaleNearest(generated, 6), right = scaleNearest(reference, 6), gap = 24;
const plateWidth = left.width + gap + right.width;
const plateHeight = Math.max(left.height, right.height);
const rgba = Buffer.alloc(plateWidth * plateHeight * 4);
for (let y = 0; y < left.height; y++) left.rgba.copy(rgba, y * (left.width + gap + right.width) * 4, y * left.width * 4, (y + 1) * left.width * 4);
for (let y = 0; y < right.height; y++) right.rgba.copy(rgba, (y * (left.width + gap + right.width) + left.width + gap) * 4, y * right.width * 4, (y + 1) * right.width * 4);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, encodePng(plateWidth, plateHeight, rgba));
console.log(`Wrote ×6 comparison plate: ${outputPath}`);
