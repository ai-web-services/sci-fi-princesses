import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.STELLAR_BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(8000);
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.stack || error.message));
await mkdir('screenshots/viewport', { recursive: true });
async function tap(key) {
  await page.keyboard.down(key); await page.waitForTimeout(80);
  await page.keyboard.up(key); await page.waitForTimeout(80);
}

async function shot(key, data = {}) {
  await page.evaluate(({ key, data }) => {
    const game = window.__stellarGame;
    for (const scene of game.scene.getScenes(true)) scene.scene.stop();
    game.scene.start(key, data);
  }, { key, data });
  await page.waitForFunction(key => window.__stellarGame.scene.getScene(key)?.scene.isActive(), key);
  await page.waitForTimeout(120);
  await page.screenshot({ path: `screenshots/viewport/${key}.png` });
}

try {
  await page.goto(`${baseURL}/?test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__stellarTest?.ready && window.__stellarTest.commands);
  const canvas = await page.locator('canvas').evaluate(node => ({ width: node.width, height: node.height }));
  assert.deepEqual(canvas, { width: 480, height: 270 });
  await page.screenshot({ path: 'screenshots/viewport/TitleScene.png' });

  await page.evaluate(() => window.__stellarTest.commands.startExpedition(8080, { erynn: true }));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));
  await shot('MapScene', { mapId: 'nova_plaza', entry: { x: 14, y: 18, dir: 'up' } });
  await page.screenshot({ path: 'screenshots/viewport/Town.png' });
  await page.evaluate(() => window.__stellarTest.commands.startExpedition(8080, { erynn: true }));
  await page.waitForFunction(() => window.__stellarTest.snapshot().activeScenes.includes('ExpeditionScene'));
  await shot('OptionsScene', { back: 'TitleScene' });
  await shot('SaveLoadScene', { mode: 'save', back: 'TitleScene' });
  await shot('MenuScene', { parentScene: 'MapScene', locationName: 'Nova Prime' });
  await shot('CharacterSheetScene', { parentScene: 'MapScene', backScene: 'MenuScene' });
  await tap('ArrowRight');
  await page.screenshot({ path: 'screenshots/viewport/CharacterSheetStats.png' });
  await shot('QuestJournalScene', { parentScene: 'MapScene' });
  await shot('TravelScene', { parentScene: 'MapScene', currentMap: 'stargate_dock' });
  await shot('ShopScene', { shopId: 'materials', parentScene: 'MapScene' });
  await page.evaluate(() => window.__stellarTest.commands.prepareForge());
  await shot('ForgeScene', { parentScene: 'MapScene' });
  await tap('z'); await tap('ArrowDown'); await tap('z');
  await page.waitForFunction(() => window.__stellarTest.snapshot().arsenal.blade?.enhancement === 1);
  const forged = await page.evaluate(() => window.__stellarTest.snapshot());
  assert.equal(forged.gold, 4950);
  assert.equal(forged.inventory.find(item => item.id === 'scrap_metal').qty, 39);
  await page.screenshot({ path: 'screenshots/viewport/ForgeEnhanced.png' });
  await shot('TutorialScene', { id: 'movement', parentScene: 'MapScene' });
  await shot('CombatScene', { enemies: ['voidling'], backdrop: 'nova', canFlee: true });
  await shot('DialogueScene');
  await page.evaluate(() => window.__stellarGame.events.emit('dialogue:say', {
    speaker: 'Lyra', portrait: 'lyra', emote: 'neutral',
    text: 'The Crown Network is stable. Every path remains visible at the shipping resolution.', resolve() {}
  }));
  await page.waitForTimeout(120);
  await page.screenshot({ path: 'screenshots/viewport/DialogueScene.png' });
  await shot('GalleryScene');

  assert.deepEqual(errors, [], `viewport browser errors:\n${errors.join('\n')}`);
  console.log('OK  480×270 viewport suite: title, overlays, commerce, dialogue, combat, gallery');
} finally {
  await browser.close();
}
