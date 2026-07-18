export const CURRENT_GAME_VERSION = "v6.0-alpha.5";
export const HOURLY_SUBMISSION_LIMIT = 12;

export type ValidatedRun = {
  runId: string;
  gameVersion: string;
  seed: string;
  result: "Victory" | "Defeat" | "Extracted";
  level: number;
  xp: number;
  runXp: number;
  bosses: number;
  durationMs: number;
  mastery: number;
  build: string;
  objective: string;
};

export function validateRun(payload: Record<string, unknown>): ValidatedRun {
  const result = payload.result;
  if (result !== "Victory" && result !== "Defeat" && result !== "Extracted") {
    throw new Error("Unknown expedition result.");
  }
  const gameVersion = cleanText(payload.gameVersion, 24);
  if (gameVersion !== CURRENT_GAME_VERSION) throw new Error("Unsupported game version.");
  const runId = cleanText(payload.runId, 64).toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(runId)) {
    throw new Error("Invalid run identifier.");
  }
  const level = boundedInt(payload.level, 1, 20);
  const xp = boundedInt(payload.xp, 0, 25_000_000);
  const runXp = boundedInt(payload.runXp, 0, 250_000);
  const bosses = boundedInt(payload.bosses, 0, 8);
  const durationMs = boundedInt(payload.durationMs, 1_000, 43_200_000);
  const mastery = boundedInt(payload.mastery, 0, 5_000_000);
  if (runXp > xp) throw new Error("Run XP cannot exceed lifetime XP.");
  if (result === "Victory" && bosses < 1) throw new Error("Victory requires a defeated boss.");
  return {
    runId, gameVersion,
    seed: cleanText(payload.seed, 32), result, level, xp, runXp, bosses, durationMs, mastery,
    build: cleanText(payload.build, 256), objective: cleanText(payload.objective, 80),
  };
}

export function submissionDecision(existing: boolean, recentCount: number) {
  if (existing) return { allowed: false as const, status: 409, error: "This run was already submitted." };
  if (recentCount >= HOURLY_SUBMISSION_LIMIT) return { allowed: false as const, status: 429, error: "Submission limit reached. Try again later." };
  return { allowed: true as const, status: 201, error: null };
}

function boundedInt(value: unknown, min: number, max: number) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(`Numeric field must be between ${min} and ${max}.`);
  return number;
}
function cleanText(value: unknown, max: number) {
  const text = String(value ?? "").trim().replace(/[<>\u0000-\u001f]/g, "").slice(0, max);
  if (!text) throw new Error("A required text field is missing.");
  return text;
}
