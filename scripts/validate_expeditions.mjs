// ═══ VALIDATE EXPEDITIONS — deterministic seed corpus.

import { generateExpedition, validateExpedition } from '../public/src/expedition/generator.js';

const count = Math.max(1, Number(process.argv[2]) || 1000);
const hashes = new Set();
for (let seed = 0; seed < count; seed++) {
  const first = generateExpedition(seed);
  const second = generateExpedition(seed);
  const result = validateExpedition(first);
  if (!result.valid) throw new Error(`Seed ${seed}: ${result.errors.join('; ')}`);
  if (first.hash !== second.hash) throw new Error(`Seed ${seed}: nondeterministic hash`);
  if (first.seed !== seed >>> 0) throw new Error(`Seed ${seed}: seed was not preserved`);
  if (first.habitats.length > 22) throw new Error(`Seed ${seed}: population cap exceeded`);
  hashes.add(first.hash);
}
if (hashes.size < Math.floor(count * 0.95)) throw new Error(`Insufficient topology variation: ${hashes.size}/${count}`);
console.log(`OK  ${count} deterministic expedition seeds (${hashes.size} unique hashes)`);
