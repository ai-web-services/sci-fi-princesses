import fs from 'node:fs';
import path from 'node:path';
import { ANIMATIONS, DIRECTIONS } from './animations.mjs';
import { drawLyra } from './parts.mjs';
import { LYRA_DESCRIPTOR } from './descriptors.mjs';
import { PixelCanvas } from './canvas.mjs';

export function fitCharacter(cell, scale = 0.64) {
  const fitted = new PixelCanvas(64, 64);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const source = cell.index(x, y);
    if (cell.material[source] < 0) continue;
    const dx = Math.round(32 + (x - 32) * scale);
    const dy = Math.round(60 + (y - 49) * scale);
    if (!fitted.inside(dx, dy)) continue;
    const target = fitted.index(dx, dy);
    fitted.pixels[target] = cell.pixels[source];
    fitted.material[target] = cell.material[source];
  }
  return fitted;
}

export function renderSheetFor(descriptor, drawFn, action, outputDir) {
  const frames = descriptor.actionFrames?.[action] ?? ANIMATIONS[action].frames;
  const sheet = new PixelCanvas(512, 256);
  for (let row = 0; row < DIRECTIONS.length; row++) for (let frame = 0; frame < frames; frame++) {
    const cell = fitCharacter(drawFn(descriptor, action, frame, DIRECTIONS[row]), descriptor.fitScale ?? 0.64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const src = cell.index(x, y), dst = sheet.index(frame * 64 + x, row * 64 + y);
      sheet.pixels[dst] = cell.pixels[src]; sheet.material[dst] = cell.material[src];
    }
  }
  const file = `${descriptor.id}-${action}.png`;
  fs.writeFileSync(path.join(outputDir, file), sheet.toPng());
  return { file, frames, fps: ANIMATIONS[action].fps };
}

export function renderSheet(action, outputDir) {
  return renderSheetFor(LYRA_DESCRIPTOR, (_descriptor, currentAction, frame, direction) => drawLyra(currentAction, frame, direction), action, outputDir);
}
