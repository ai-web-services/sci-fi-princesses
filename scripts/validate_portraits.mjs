// Validate portrait data: each expression grid must be exactly H rows,
// each row exactly W chars, and every char must be a key in `map` or '.'.
import { PORTRAITS } from '../public/src/art/portraits/index.js';

let failures = 0;

for (const [id, portrait] of Object.entries(PORTRAITS)) {
  const { w, h, map, expressions } = portrait;
  const validChars = new Set(['.', ...Object.keys(map)]);

  for (const [exprName, rows] of Object.entries(expressions)) {
    if (rows.length !== h) {
      console.error(`[FAIL] ${id}.${exprName}: expected ${h} rows, got ${rows.length}`);
      failures++;
      continue;
    }
    rows.forEach((r, i) => {
      if (r.length !== w) {
        console.error(`[FAIL] ${id}.${exprName} row ${i}: expected ${w} chars, got ${r.length} -> "${r}"`);
        failures++;
      }
      for (const ch of r) {
        if (!validChars.has(ch)) {
          console.error(`[FAIL] ${id}.${exprName} row ${i}: invalid char '${ch}' not in map`);
          failures++;
        }
      }
    });
  }
  console.log(`[OK] ${id}: ${Object.keys(expressions).length} expressions checked`);
}

if (failures > 0) {
  console.error(`\nVALIDATION FAILED: ${failures} issue(s) found.`);
  process.exit(1);
} else {
  console.log('\nAll portraits valid.');
}
