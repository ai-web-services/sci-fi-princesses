import fs from 'node:fs';
import path from 'node:path';
import { decodePng, encodePng, rgbaFromDecoded } from './png.mjs';

export function scaleNearest(image, scale) {
  const src = rgbaFromDecoded(image), out = Buffer.alloc(image.width * scale * image.height * scale * 4);
  const width = image.width * scale;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
    const so = (y * image.width + x) * 4;
    for (let yy = 0; yy < scale; yy++) for (let xx = 0; xx < scale; xx++) {
      const o = ((y * scale + yy) * width + x * scale + xx) * 4;
      src.copy(out, o, so, so + 4);
    }
  }
  return { width, height: image.height * scale, rgba: out };
}

export function writeReviewSheet(inputFile, outputFile, scale = 6) {
  const image = decodePng(fs.readFileSync(inputFile));
  const scaled = scaleNearest(image, scale);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, encodePng(scaled.width, scaled.height, scaled.rgba));
  return { width: scaled.width, height: scaled.height };
}
