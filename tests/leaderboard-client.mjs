import assert from 'node:assert/strict';
import { sharedSubmissionUrl, submitSharedRun } from '../public/src/expedition/leaderboardClient.js';

globalThis.STELLAR_LEADERBOARD_URL = 'https://leaderboard.test';
globalThis.localStorage = { getItem: () => null };

function summary() {
  return {
    runId: crypto.randomUUID(), gameVersion: 'v6.0-alpha.5', seed: 424242,
    result: 'victory', finalLevel: 3, lifetimeXp: 500, runXp: 240,
    durationMs: 180000, bossesDefeated: ['kael'], weaponMastery: { blade: 20, lance: 10, wand: 5 }
  };
}

let submittedBody;
globalThis.fetch = async (_url, options) => {
  submittedBody = JSON.parse(options.body);
  return { ok: true, status: 201, json: async () => ({ run: { id: 1 } }) };
};
const accepted = summary();
assert.match(sharedSubmissionUrl(accepted), /\/submit\?run=/);
assert.equal((await submitSharedRun(accepted)).status, 'submitted');
assert.equal(accepted.sharedSubmitted, true);
assert.equal(submittedBody.gameVersion, 'v6.0-alpha.5');
assert.equal(submittedBody.runXp, 240);
assert.equal(submittedBody.objective, 'kael');

globalThis.fetch = async () => ({ ok: false, status: 401 });
assert.equal((await submitSharedRun(summary())).status, 'signin');
globalThis.fetch = async () => ({ ok: false, status: 409 });
assert.equal((await submitSharedRun(summary())).status, 'duplicate');
globalThis.fetch = async () => ({ ok: false, status: 429 });
assert.equal((await submitSharedRun(summary())).status, 'rate-limited');
globalThis.fetch = async () => { throw new Error('offline'); };
assert.equal((await submitSharedRun(summary())).status, 'offline');

console.log('OK  leaderboard client: success, identity gate, duplicate, rate limit, offline fallback');
