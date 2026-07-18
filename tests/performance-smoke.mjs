import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const baseURL = process.env.STELLAR_BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.stack || error.message));

try {
  await page.goto(`${baseURL}/?test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__stellarTest?.ready && window.__stellarTest.commands);
  await page.evaluate(() => window.__stellarTest.commands.startExpedition(31337, { erynn: true }));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));
  const load = await page.evaluate(() => window.__stellarTest.commands.stressExpedition());
  assert.ok(load.active >= 17 && load.transientLabels >= 85);
  assert.equal(load.pooledFlyouts, load.flyoutCapacity, 'stress burst should saturate without exceeding the bounded flyout pool');
  assert.equal(load.flyoutCapacity, 32);
  assert.equal(load.pooledParticles, load.particleCapacity, 'stress burst should saturate without exceeding the bounded particle pool');
  assert.equal(load.particleCapacity, 48);
  const timings = await page.evaluate(() => new Promise(resolve => {
    const samples = [];
    let previous = performance.now();
    const frame = now => {
      samples.push(now - previous); previous = now;
      if (samples.length >= 180) resolve(samples.slice(10)); else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }));
  timings.sort((a, b) => a - b);
  const average = timings.reduce((sum, value) => sum + value, 0) / timings.length;
  const p95 = timings[Math.floor(timings.length * 0.95)];
  assert.ok(average < 20, `average frame time ${average.toFixed(2)}ms exceeds budget`);
  assert.ok(p95 < 30, `p95 frame time ${p95.toFixed(2)}ms exceeds budget`);
  assert.deepEqual(errors, [], `performance browser errors:\n${errors.join('\n')}`);
  console.log(`OK  expedition stress: ${load.active} creatures, ${load.transientLabels} requested / ${load.flyoutCapacity} pooled flyouts, ${load.particleCapacity} pooled particles, ${average.toFixed(2)}ms avg, ${p95.toFixed(2)}ms p95`);
} finally {
  await browser.close();
}
