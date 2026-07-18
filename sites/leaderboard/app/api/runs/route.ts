import { and, asc, count, desc, eq, gte } from "drizzle-orm";
import { getDb } from "../../../db";
import { expeditionRuns } from "../../../db/schema";
import { submissionDecision, validateRun } from "../../../lib/run-contract";

function corsHeaders(request?: Request) {
  return {
    "Access-Control-Allow-Origin": request?.headers.get("Origin") || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const rows = await getDb()
      .select({
        id: expeditionRuns.id,
        displayName: expeditionRuns.displayName,
        runId: expeditionRuns.runId,
        gameVersion: expeditionRuns.gameVersion,
        seed: expeditionRuns.seed,
        result: expeditionRuns.result,
        level: expeditionRuns.level,
        xp: expeditionRuns.xp,
        runXp: expeditionRuns.runXp,
        bosses: expeditionRuns.bosses,
        durationMs: expeditionRuns.durationMs,
        mastery: expeditionRuns.mastery,
        build: expeditionRuns.build,
        objective: expeditionRuns.objective,
        submittedAt: expeditionRuns.submittedAt,
      })
      .from(expeditionRuns)
      .orderBy(
        desc(expeditionRuns.xp),
        desc(expeditionRuns.level),
        desc(expeditionRuns.bosses),
        asc(expeditionRuns.durationMs),
        asc(expeditionRuns.id),
      )
      .limit(50);

    return Response.json({ runs: rows }, { headers: corsHeaders(request) });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Leaderboard unavailable" },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

export async function POST(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!email) {
    return Response.json(
      { error: "Sign in with ChatGPT before submitting a run." },
      { status: 401, headers: corsHeaders(request) },
    );
  }

  let run: ReturnType<typeof validateRun>;
  try {
    const payload = await request.json() as Record<string, unknown>;
    run = validateRun(payload);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid run" },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  try {
    const encodedName = request.headers.get("oai-authenticated-user-full-name");
    const encoding = request.headers.get("oai-authenticated-user-full-name-encoding");
    const fullName = encodedName && encoding === "percent-encoded-utf-8"
      ? safeDecode(encodedName)
      : null;
    const displayName = cleanName(fullName || email.split("@")[0] || "Princess");

    const db = getDb();
    const [duplicate] = await db.select({ total: count() }).from(expeditionRuns)
      .where(and(eq(expeditionRuns.userEmail, email), eq(expeditionRuns.runId, run.runId)));
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [recent] = await db.select({ total: count() }).from(expeditionRuns)
      .where(and(eq(expeditionRuns.userEmail, email), gte(expeditionRuns.submittedAt, hourAgo)));
    const decision = submissionDecision((duplicate?.total || 0) > 0, recent?.total || 0);
    if (!decision.allowed) return Response.json({ error: decision.error }, { status: decision.status, headers: corsHeaders(request) });

    const [created] = await db.insert(expeditionRuns).values({
      userEmail: email,
      displayName,
      ...run,
    }).returning({ id: expeditionRuns.id, displayName: expeditionRuns.displayName });

    return Response.json({ run: created }, { status: 201, headers: corsHeaders(request) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE constraint failed") || message.includes("expedition_runs_user_run_uidx")) {
      return Response.json({ error: "This run was already submitted." }, { status: 409, headers: corsHeaders(request) });
    }
    return Response.json(
      { error: "Score submission is temporarily unavailable." },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

function cleanName(value: string) {
  return value.trim().replace(/[<>]/g, "").slice(0, 40) || "Princess";
}

function safeDecode(value: string) {
  try { return decodeURIComponent(value); } catch { return null; }
}
