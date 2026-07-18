import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_GAME_VERSION, HOURLY_SUBMISSION_LIMIT, submissionDecision, validateRun } from '../lib/run-contract.ts';

const valid = {
  runId: '123e4567-e89b-42d3-a456-426614174000', gameVersion: CURRENT_GAME_VERSION,
  seed: '424242', result: 'Victory', level: 4, xp: 800, runXp: 320,
  bosses: 1, durationMs: 240000, mastery: 90, build: 'Blade 50 · Lance 20 · Wand 20', objective: 'Kael defeated'
};

test('accepts a bounded current-version run', () => assert.deepEqual(validateRun(valid).runId, valid.runId));
test('rejects unsupported versions', () => assert.throws(() => validateRun({ ...valid, gameVersion: 'v0' }), /version/));
test('rejects malformed ids and impossible XP', () => {
  assert.throws(() => validateRun({ ...valid, runId: 'same-run' }), /identifier/);
  assert.throws(() => validateRun({ ...valid, runXp: valid.xp + 1 }), /Run XP/);
});
test('rejects victory without a boss', () => assert.throws(() => validateRun({ ...valid, bosses: 0 }), /boss/));
test('duplicate and hourly limits have explicit decisions', () => {
  assert.equal(submissionDecision(true, 0).status, 409);
  assert.equal(submissionDecision(false, HOURLY_SUBMISSION_LIMIT).status, 429);
  assert.equal(submissionDecision(false, 0).allowed, true);
});
