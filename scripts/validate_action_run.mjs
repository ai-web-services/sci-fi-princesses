import assert from 'node:assert/strict';
import { generateExpedition } from '../public/src/expedition/generator.js';
import { createRunState, advanceObjective, canActivateRelay, canEnterBossGate, claimLoot, settleRun, mergeInventory, rankRuns } from '../public/src/expedition/runModel.js';
import { levelChoices, applyBuildChoice } from '../public/src/expedition/buildChoices.js';
import { createActionState, startAttack, startDodge, startWeaponSkill, switchWeapon, updateActionState, attackSpec, WEAPONS, WEAPON_SKILLS } from '../public/src/expedition/actionModel.js';
import { KaelController, KAEL_MAX_HP } from '../public/src/expedition/kaelController.js';
import { newGameState, normalizeGameState } from '../public/src/game/state.js';
import { loadProgressionData, effectiveStats, statBreakdown, itemData } from '../public/src/game/progression.js';
import {
  enhanceGear, enhancementCost, gearStats, infuseGear, normalizeGearEntry,
  transcendGear, affixLabels, gearPassives
} from '../public/src/game/gearProgression.js';
import { createRng } from '../public/src/expedition/rng.js';
import { COMPANION_ROLES } from '../public/src/expedition/fieldCompanion.js';
import { ECOLOGY_LIMITS, createEcologyState, provokeCreature, retireCreature, stepEcology, updateWander } from '../public/src/expedition/ecologyModel.js';

newGameState();
await loadProgressionData();
const legacyState = newGameState();
legacyState.actionArsenal = null;
legacyState.chars.lyra.equipment.weapon = 'starlight_saber';
normalizeGameState(legacyState);
assert.equal(legacyState.chars.lyra.equipment.weapon.id, 'starlight_saber');
assert.deepEqual(Object.keys(legacyState.actionArsenal).sort(), ['blade', 'lance', 'wand']);
const lyraStats = effectiveStats('lyra');
assert.equal(lyraStats.crit, 8, 'fractional content crit is normalized to display/combat percent');
const lyraBreakdown = statBreakdown('lyra');
assert.equal(lyraBreakdown.final.maxHp, lyraStats.maxHp);
assert.ok(lyraBreakdown.speciesEffects.some(effect => effect.includes('Fire resist')));
const legacyGear = normalizeGearEntry('starlight_saber');
assert.equal(legacyGear.enhancement, 0, 'legacy equipment ids migrate without losing the item');
assert.deepEqual(enhancementCost(legacyGear).materials, [{ id: 'scrap_metal', qty: 1 }]);
let upgradedGear = legacyGear;
for (let level = 1; level <= 10; level++) upgradedGear = enhanceGear(upgradedGear);
assert.equal(upgradedGear.enhancement, 10);
assert.equal(affixLabels(upgradedGear).length, 3, 'affixes unlock deterministically at +3/+6/+9');
const baseWeapon = { stats: { atk: 10, crit: 0.05 } };
assert.ok(gearStats(baseWeapon, upgradedGear).atk > 10);
const infusedGear = infuseGear(upgradedGear, 'stellar');
assert.equal(infusedGear.infusion, 'stellar');
assert.ok(gearStats(baseWeapon, infusedGear).crit > gearStats(baseWeapon, upgradedGear).crit);
for (const [infusion, type] of [['void', 'dark'], ['flame', 'fire'], ['frost', 'ice'], ['storm', 'lightning'], ['stellar', 'light']]) {
  assert.equal(gearPassives(baseWeapon, infuseGear(upgradedGear, infusion)).infusedDamage, type);
}
const transcendedGear = transcendGear(infusedGear);
assert.equal(transcendedGear.transcended, true);
assert.ok(gearStats(baseWeapon, transcendedGear).atk > gearStats(baseWeapon, infusedGear).atk);
assert.equal(itemData('crownlight_blade').rarity, 'legendary');

const ecologyRng = createRng(99);
const fakeBody = { x: 8, y: 8, active: true };
const passive = { kind: 'passive', territory: 'basin', body: fakeBody, state: 'graze', ecology: createEcologyState({ x: 0, y: 0, kind: 'passive', territory: 'basin' }, 0, ecologyRng) };
provokeCreature(passive);
assert.equal(passive.state, 'flee');
assert.equal(retireCreature(passive, ecologyRng), true);
passive.body.active = false;
let lifecycle = stepEcology(passive, ECOLOGY_LIMITS.respawnMaxMs + 1, {
  playerX: 1000, playerY: 1000, activeCount: 0, rng: ecologyRng, onScreen: () => false
});
assert.equal(lifecycle.type, 'respawn');
passive.body.active = true; passive.body.x = 8; passive.body.y = 8;
lifecycle = stepEcology(passive, 16, { playerX: 1000, playerY: 1000, activeCount: 1, rng: ecologyRng, onScreen: () => false });
assert.equal(lifecycle.type, 'despawn');
const neutral = { kind: 'neutral', body: { x: 0, y: 0, active: true }, state: 'idle', ecology: createEcologyState({ x: 0, y: 0, kind: 'neutral', territory: 'basin' }, 1, ecologyRng) };
provokeCreature(neutral);
assert.equal(neutral.state, 'retaliate');
const activityBody = { x: 8, y: 8, active: true, setPosition(x, y) { this.x = x; this.y = y; } };
const activityCreature = { kind: 'passive', body: activityBody, state: 'graze', ecology: createEcologyState({ x: 0, y: 0, kind: 'passive', territory: 'basin' }, 2, ecologyRng) };
const observedActivities = new Set();
for (let i = 0; i < 80; i++) { activityCreature.ecology.wanderMs = 0; updateWander(activityCreature, 16, () => true, ecologyRng); observedActivities.add(activityCreature.state); }
assert.ok(observedActivities.has('sleep') && observedActivities.has('gather') && observedActivities.has('graze') && observedActivities.has('wander'), 'passive ecology cycles through sleep, gather, graze, and wander');
assert.deepEqual(Object.keys(COMPANION_ROLES), ['erynn', 'brimble', 'drakkor', 'pip']);
assert.equal(new Set(Object.values(COMPANION_ROLES).map(profile => profile.command)).size, 4, 'companions need distinct field commands');
assert.ok(COMPANION_ROLES.brimble.guardMs && COMPANION_ROLES.brimble.healFraction, 'Brimble must shield and heal');
assert.ok(COMPANION_ROLES.drakkor.breakMs && COMPANION_ROLES.drakkor.damageType === 'fire', 'Drakkor must break armor with Fire damage');
assert.ok(COMPANION_ROLES.pip.scanMs && COMPANION_ROLES.pip.healFraction, 'Pip must scan/debuff and support-heal');

const pool = Array.from({ length: 25 }, (_, index) => {
  const enemy = { kind: 'passive', body: { x: index * 16, y: 0, active: false }, ecology: createEcologyState({ x: index, y: 0, kind: 'passive', territory: 'basin' }, index, ecologyRng) };
  enemy.ecology.dormant = true; enemy.ecology.respawnMs = 0; return enemy;
});
let activePopulation = 0;
for (const enemy of pool) {
  const event = stepEcology(enemy, 1000, { playerX: 2000, playerY: 2000, activeCount: activePopulation, rng: ecologyRng, onScreen: () => false });
  if (event?.type === 'respawn') { enemy.body.active = true; activePopulation++; }
}
assert.equal(activePopulation, ECOLOGY_LIMITS.activeBudget, 'population pooling respects the active budget');

const region = generateExpedition(424242);
const run = createRunState(region, null, 1000);
assert.equal(run.objective, 'relay');
assert.equal(canActivateRelay(run, region.anchors.relay, region, 1), false);
assert.equal(canActivateRelay(run, region.anchors.relay, region, 0), true);
assert.equal(advanceObjective(run, 'relayActivated'), true);
assert.equal(run.objective, 'miniboss');
assert.equal(run.checkpoint, 'shrine');
assert.equal(advanceObjective(run, 'minibossDefeated'), true);
assert.equal(run.objective, 'bossGate');
assert.equal(run.shortcutOpen, true);
assert.equal(canEnterBossGate(run, region.anchors.bossGate, region), true);
assert.equal(advanceObjective(run, 'gateEntered'), true);
assert.equal(advanceObjective(run, 'kaelDefeated'), true);
assert.equal(advanceObjective(run, 'shardClaimed'), true);
assert.equal(run.objective, 'extraction');

const reward = claimLoot(run, 'cache_0', region);
assert.ok(reward && reward.qty > 0);
assert.equal(claimLoot(run, 'cache_0', region), null, 'loot cannot be claimed twice');
run.carriedLoot.push({ id: 'scrap_metal', qty: 3 });
const defeatRewards = settleRun(run, 'defeat', 5000);
assert.ok(defeatRewards.every(entry => entry.qty > 0));
const inventory = [];
mergeInventory(inventory, defeatRewards);
mergeInventory(inventory, defeatRewards);
assert.ok(inventory.every(entry => entry.qty >= 2), 'inventory rewards merge by id');
const ranked = rankRuns([
  { lifetimeXp: 100, finalLevel: 2, bossesDefeated: [], durationMs: 1000 },
  { lifetimeXp: 100, finalLevel: 3, bossesDefeated: [], durationMs: 2000 },
  { lifetimeXp: 120, finalLevel: 1, bossesDefeated: [], durationMs: 3000 }
]);
assert.equal(ranked[0].lifetimeXp, 120);
assert.equal(ranked[1].finalLevel, 3);

const action = createActionState({ maxHp: 110, maxStamina: 100, maxEnergy: 48 });
for (const weapon of ['blade', 'lance', 'wand']) {
  action.weapon = weapon;
  action.action = null;
  action.stamina = 100;
  const started = startAttack(action);
  assert.ok(started);
  const spec = attackSpec(action);
  assert.equal(spec.weapon, weapon);
  assert.equal(spec.reach, WEAPONS[weapon].reach[started.combo]);
  for (let t = 0; t < 1000 && action.action; t += 20) updateActionState(action, 20);
  assert.equal(action.action, null);
}
for (const weapon of ['blade', 'lance', 'wand']) {
  action.weapon = weapon;
  action.action = null;
  action.energy = action.maxEnergy;
  const before = action.energy;
  const started = startWeaponSkill(action);
  assert.equal(started.type, 'skill');
  assert.equal(before - action.energy, WEAPON_SKILLS[weapon].energy);
  const spec = attackSpec(action);
  assert.equal(spec.skill, WEAPON_SKILLS[weapon].name);
  assert.equal(spec.omni, weapon === 'wand');
  for (let t = 0; t < 1000 && action.action; t += 20) updateActionState(action, 20);
  assert.equal(action.action, null);
}
action.stamina = 100;
assert.ok(startDodge(action, { x: 1, y: 1 }));
assert.ok(action.invulnerableMs > 0);
assert.equal(switchWeapon(action, 1), false, 'weapon cannot switch during active dodge');

const choicesA = levelChoices(424242, 2, {}, true);
const choicesB = levelChoices(424242, 2, {}, true);
assert.deepEqual(choicesA.map(choice => choice.id), choicesB.map(choice => choice.id));
assert.equal(new Set(choicesA.map(choice => choice.id)).size, 3);
const character = { build: {} };
const buildAction = createActionState({});
assert.equal(applyBuildChoice(choicesA[0].id, character, buildAction), true);
assert.ok(Object.values(character.build).some(Boolean));

const kaelA = new KaelController(777, 100, 100);
const kaelB = new KaelController(777, 100, 100);
const context = { player: { x: 180, y: 100 }, beamBlocked: () => false };
const sequenceA = [], sequenceB = [];
for (let elapsed = 0; elapsed < 18000; elapsed += 50) {
  kaelA.update(50, context); kaelB.update(50, context);
  const a = kaelA.telegraph()?.type, b = kaelB.telegraph()?.type;
  if (a && sequenceA.at(-1) !== a) sequenceA.push(a);
  if (b && sequenceB.at(-1) !== b) sequenceB.push(b);
}
assert.deepEqual(sequenceA, sequenceB, 'Kael director must be deterministic');
assert.ok(sequenceA.includes('slash') && sequenceA.includes('pulse') && sequenceA.includes('summon'));
const phaseHit = kaelA.hit(Math.ceil(KAEL_MAX_HP * 0.8), 'stellar', 3);
assert.equal(phaseHit.phase, 2);
assert.equal(kaelA.telegraph().type, 'transition');
while (kaelA.telegraph()) kaelA.update(50, context);
const enrageHit = kaelA.hit(KAEL_MAX_HP, 'stellar', 3);
assert.equal(enrageHit.dead, true);

const beamCover = new KaelController(8, 100, 100);
beamCover.phase = 2;
beamCover.current = { type: 'beam', stage: 'warning', timerMs: 1, totalMs: 2400, direction: { x: 1, y: 0 }, target: { x: 180, y: 100 }, locked: true };
const coveredEvents = beamCover.update(50, { player: { x: 180, y: 100 }, beamBlocked: () => true });
assert.equal(coveredEvents.some(event => event.type === 'damage'), false, 'beam cover is a valid tactical answer');

console.log('OK  objectives, rewards, action resources, weapons, character breakdown, deterministic multi-phase Kael');
