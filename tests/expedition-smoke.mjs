import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const baseURL = process.env.STELLAR_BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(6000);
const consoleErrors = [];
const tap = async key => {
  await page.keyboard.down(key);
  await page.waitForTimeout(90);
  await page.keyboard.up(key);
  await page.waitForTimeout(50); // let Phaser observe the released edge
};
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => consoleErrors.push(error.stack || error.message));

try {
  await page.goto(`${baseURL}/?test=1`, { waitUntil: 'domcontentloaded' });
  console.log('stage: page loaded');
  const canvasSize = await page.locator('canvas').evaluate(canvas => ({ width: canvas.width, height: canvas.height }));
  assert.deepEqual(canvasSize, { width: 480, height: 270 }, 'shipping canvas must be 480×270');
  await page.waitForFunction(() => window.__stellarTest?.ready && window.__stellarTest.commands);
  console.log('stage: test seam ready');
  await page.evaluate(() => window.__stellarTest.commands.startExpedition(424242, { erynn: true }));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));
  console.log('stage: expedition active');
  const initial = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(initial.expedition.seed, 424242);
  assert.equal(initial.expedition.status, 'active');
  assert.equal(initial.action.weapon, 'blade');
  assert.ok(initial.action.enemiesAlive > 0);
  assert.ok(initial.action.companion, 'Erynn should enter the field when recruited');
  assert.ok(initial.action.ecology.some(enemy => enemy.kind === 'neutral'), 'seeded region should contain neutral ecology');
  await page.screenshot({ path: 'screenshots/exploration.png' });
  await page.evaluate(() => window.__stellarTest.commands.damageCreature('neutral', 1));
  const provoked = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(provoked.action.ecology.find(enemy => enemy.kind === 'neutral').state, 'retaliate');

  await page.evaluate(() => window.__stellarTest.commands.setActionEnergy(48));
  await tap('f');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === 'skill');
  const skilled = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(skilled.action.energy, 36, 'blade Crown skill should spend its 12-energy cost');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === null);

  await tap('c');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('MenuScene'));
  await page.waitForTimeout(120);
  await tap('x');
  await page.waitForFunction(() => !window.__stellarTest.snapshot().activeScenes.includes('MenuScene'));

  await tap('C');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('MenuScene'));
  for (let i = 0; i < 8; i++) await tap('ArrowDown');
  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('OptionsScene'));
  await tap('x');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('MenuScene'));
  await tap('x');
  await page.waitForFunction(() => !window.__stellarTest.snapshot().activeScenes.includes('MenuScene') && window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));

  await page.keyboard.down('d');
  await page.waitForTimeout(250);
  await page.keyboard.up('d');
  const moved = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.ok(moved.action.player.x > initial.action.player.x, 'eight-direction movement should move right');

  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.stamina < 100);
  const attacked = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.ok(attacked.action.stamina < 100, 'attack should spend stamina');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === null);

  await tap('e');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.weapon === 'lance');
  await tap('e');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.weapon === 'wand');
  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.playerProjectiles > 0);
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === null);
  await tap('q');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.weapon === 'lance');

  await tap('x');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === 'dodge');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.action === null);

  await page.evaluate(() => window.__stellarTest.commands.teleportToAnchor('relay'));
  await tap('r');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.companion?.cooldownMs > 0);
  await page.evaluate(() => window.__stellarTest.commands.defeatTerritory('relay'));
  await tap('f');
  await page.waitForFunction(() => window.__stellarTest.snapshot().expedition?.objective === 'miniboss');

  await page.evaluate(() => {
    window.__stellarTest.commands.setLyraXp(99);
    window.__stellarTest.commands.teleportToAnchor('miniboss');
    window.__stellarTest.commands.defeatTerritory('miniboss');
  });
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('LevelUpScene'));
  await page.screenshot({ path: 'screenshots/level-up.png' });
  const beforeBuild = await page.evaluate(() => window.__stellarTest.snapshot().build);
  await tap('z');
  await page.waitForFunction(() => !window.__stellarTest.snapshot().activeScenes.includes('LevelUpScene'));
  const progressed = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(progressed.expedition.objective, 'bossGate');
  assert.equal(progressed.level, 2);
  assert.notDeepEqual(progressed.build, beforeBuild, 'level choice should persist a recognizable build modifier');

  await page.evaluate(() => window.__stellarTest.commands.teleportToAnchor('bossGate'));
  await tap('f');
  await page.waitForFunction(() => window.__stellarTest.snapshot().expedition?.objective === 'kael');
  await page.evaluate(() => window.__stellarTest.commands.teleportToAnchor('bossArena', 0, 6));
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.kael?.hp > 0);
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.kael?.action !== null);
  await page.screenshot({ path: 'screenshots/kael.png' });
  await page.evaluate(() => window.__stellarTest.commands.damageKael(400, 'stellar'));
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.kael?.phase === 2);
  await page.evaluate(() => window.__stellarTest.commands.damageKael(2000, 'stellar'));
  await page.waitForFunction(() => window.__stellarTest.snapshot().expedition?.objective === 'shard');
  await page.waitForTimeout(150);
  if ((await page.evaluate(() => window.__stellarTest.snapshot().activeScenes)).includes('LevelUpScene')) {
    await tap('z');
    await page.waitForFunction(() => !window.__stellarTest.snapshot().activeScenes.includes('LevelUpScene'));
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.__stellarTest.commands.teleportToAnchor('bossArena'));
  await tap('f');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('EvolutionScene'));
  await page.waitForTimeout(1000);
  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().expedition?.objective === 'extraction');
  await tap('f');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('RunSummaryScene'));
  await page.screenshot({ path: 'screenshots/run-summary.png' });
  const victory = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.ok(victory.shards.includes('crown_shard_gate'));
  assert.equal(victory.evolution, 1);
  assert.equal(victory.runHistory.at(-1).result, 'victory');
  await page.waitForTimeout(100);
  await tap('ArrowDown');
  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('LeaderboardScene'));
  await page.screenshot({ path: 'screenshots/leaderboard.png' });
  await page.waitForTimeout(100);
  await tap('x');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('RunSummaryScene'));
  await page.waitForTimeout(100);
  await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('MapScene'));
  await page.screenshot({ path: 'screenshots/expedition-smoke.png' });
  await page.evaluate(() => window.__stellarTest.commands.startExpedition(7331));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));
  await page.evaluate(() => window.__stellarTest.commands.setActionHp(0));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('RunSummaryScene'));
  const defeated = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(defeated.runHistory.at(-1).result, 'defeat', 'zero HP should settle and preserve a defeat run summary');
  await page.evaluate(() => window.__stellarTest.commands.startExpedition(9090, { companion: 'brimble' }));
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.companion?.id === 'brimble');
  await page.evaluate(() => { window.__stellarTest.commands.setActionHp(40); window.__stellarTest.commands.teleportToAnchor('relay'); });
  await tap('r');
  await page.waitForFunction(() => window.__stellarTest.snapshot().action?.companion?.guardMs > 0);
  const guarded = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.ok(guarded.action.hp > 40, 'Brimble Bulwark should heal as well as guard');
  assert.deepEqual(consoleErrors, [], `browser console errors:\n${consoleErrors.join('\n')}`);
  console.log('OK  action expedition E2E: Erynn, objectives, leveling, Kael phase, shard evolution, victory return');
} finally {
  await browser.close();
}
