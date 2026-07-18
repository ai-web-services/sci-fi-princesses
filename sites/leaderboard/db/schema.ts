import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const expeditionRuns = sqliteTable(
  "expedition_runs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userEmail: text("user_email").notNull(),
    displayName: text("display_name").notNull(),
    runId: text("run_id").notNull(),
    gameVersion: text("game_version").notNull(),
    seed: text("seed").notNull(),
    result: text("result").notNull(),
    level: integer("level").notNull(),
    xp: integer("xp").notNull(),
    runXp: integer("run_xp").notNull(),
    bosses: integer("bosses").notNull(),
    durationMs: integer("duration_ms").notNull(),
    mastery: integer("mastery").notNull(),
    build: text("build").notNull(),
    objective: text("objective").notNull(),
    submittedAt: integer("submitted_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("expedition_runs_rank_idx").on(
      table.xp,
      table.level,
      table.bosses,
      table.durationMs,
    ),
    index("expedition_runs_user_idx").on(table.userEmail),
    index("expedition_runs_rate_idx").on(table.userEmail, table.submittedAt),
    uniqueIndex("expedition_runs_user_run_uidx").on(table.userEmail, table.runId),
  ],
);
