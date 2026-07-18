import fs from 'node:fs';
import path from 'node:path';
import { renderSheetFor, renderSheet } from './render.mjs';
import { ANIMATIONS, DIRECTIONS } from './animations.mjs';
import { LYRA_DESCRIPTOR } from './descriptors.mjs';
import { writeReviewSheet } from './review.mjs';
import { HERO_DESCRIPTORS, drawHero } from './heroParts.mjs';
import { ENEMY_DESCRIPTORS } from './enemyDescriptors.mjs';
import { drawEnemy } from './enemyParts.mjs';

const root = path.resolve(new URL('.', import.meta.url).pathname, '../..');
const outputDir = path.join(root, 'public/assets/sprites');
fs.mkdirSync(outputDir, { recursive: true });

const assets = [];
const actions = {};
for (const action of LYRA_DESCRIPTOR.actions) {
  actions[action] = renderSheet(action, outputDir);
  const reviewFile = `reviews/${LYRA_DESCRIPTOR.id}-${action}-review-6x.png`;
  writeReviewSheet(path.join(outputDir, actions[action].file), path.join(outputDir, reviewFile));
  actions[action].review = reviewFile;
}
assets.push({ ...LYRA_DESCRIPTOR, cell: { width: 64, height: 64 }, actions });

for (const descriptor of HERO_DESCRIPTORS) {
  const heroActions = {};
  for (const action of descriptor.actions) {
    heroActions[action] = renderSheetFor(descriptor, drawHero, action, outputDir);
    const reviewFile = `reviews/${descriptor.id}-${action}-review-6x.png`;
    writeReviewSheet(path.join(outputDir, heroActions[action].file), path.join(outputDir, reviewFile));
    heroActions[action].review = reviewFile;
  }
  assets.push({ ...descriptor, cell: { width: 64, height: 64 }, actions: heroActions });
}

for (const descriptor of ENEMY_DESCRIPTORS) {
  const enemyActions = {};
  for (const action of descriptor.actions) enemyActions[action] = renderSheetFor(descriptor, drawEnemy, action, outputDir);
  assets.push({ ...descriptor, cell: { width: 64, height: 64 }, actions: enemyActions });
}

const manifest = {
  schema: 1, generatedBy: 'tools/spritegen', cell: { width: 64, height: 64 },
  layout: { columns: 8, rows: 4, directions: DIRECTIONS, spacing: 0, margin: 0 },
  assets
};
fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated Route P assets: ${assets.length} descriptors`);
