// ═══ LEADERBOARD CLIENT — shared Sites service with local fallback.

const SHARED_BOARD_URL = 'https://stellar-princesses-records.jrholco.chatgpt.site';

export function leaderboardEndpoint() {
  const override = globalThis.localStorage?.getItem('stellar_leaderboard_url');
  const configured = String(globalThis.STELLAR_LEADERBOARD_URL || override || '').replace(/\/$/, '');
  if (configured) return configured;
  return globalThis.location?.origin === SHARED_BOARD_URL ? SHARED_BOARD_URL : '';
}

export function sharedLeaderboardUrl() { return SHARED_BOARD_URL; }

export function sharedSubmissionUrl(summary) {
  const payload = submissionPayload(summary);
  return `${SHARED_BOARD_URL}/submit?run=${encodeURIComponent(JSON.stringify(payload))}`;
}

export function isSharedLeaderboardConfigured() { return !!leaderboardEndpoint(); }

export async function fetchSharedRuns(signal) {
  const endpoint = leaderboardEndpoint();
  if (!endpoint) return null;
  const response = await fetch(`${endpoint}/api/runs`, { credentials: 'include', signal });
  if (!response.ok) throw new Error(`Leaderboard returned ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload.runs) ? payload.runs : [];
}

export async function submitSharedRun(summary) {
  const endpoint = leaderboardEndpoint();
  if (!endpoint || !summary || summary.sharedSubmitted) return { status: 'local' };
  const payload = submissionPayload(summary);
  let response;
  try {
    response = await fetch(`${endpoint}/api/runs`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
  } catch (error) { return { status: 'offline', error: String(error) }; }
  if (response.status === 401) return { status: 'signin', url: endpoint };
  if (response.status === 409) { summary.sharedSubmitted = true; return { status: 'duplicate' }; }
  if (response.status === 429) return { status: 'rate-limited' };
  if (!response.ok) throw new Error(`Submission returned ${response.status}`);
  summary.sharedSubmitted = true;
  return { status: 'submitted' };
}

export function submissionPayload(summary) {
  const mastery = summary?.weaponMastery || {};
  return {
    runId: summary.runId,
    gameVersion: summary.gameVersion,
    seed: summary.seed,
    result: titleCase(summary.result),
    level: summary.finalLevel || 1,
    xp: summary.lifetimeXp || 0,
    runXp: summary.runXp || 0,
    bosses: summary.bossesDefeated?.length || 0,
    durationMs: Math.max(1, summary.durationMs || 1),
    mastery: (mastery.blade || 0) + (mastery.lance || 0) + (mastery.wand || 0),
    build: `Blade ${mastery.blade || 0} · Lance ${mastery.lance || 0} · Wand ${mastery.wand || 0}`,
    objective: summary.bossesDefeated?.length ? summary.bossesDefeated.join(', ') : titleCase(summary.result)
  };
}

function titleCase(value) {
  const text = String(value || 'extracted');
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
