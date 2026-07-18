PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expedition_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_email` text NOT NULL,
	`display_name` text NOT NULL,
	`run_id` text NOT NULL,
	`game_version` text NOT NULL,
	`seed` text NOT NULL,
	`result` text NOT NULL,
	`level` integer NOT NULL,
	`xp` integer NOT NULL,
	`run_xp` integer NOT NULL,
	`bosses` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`mastery` integer NOT NULL,
	`build` text NOT NULL,
	`objective` text NOT NULL,
	`submitted_at` integer NOT NULL
);--> statement-breakpoint
INSERT INTO `__new_expedition_runs` (`id`,`user_email`,`display_name`,`run_id`,`game_version`,`seed`,`result`,`level`,`xp`,`run_xp`,`bosses`,`duration_ms`,`mastery`,`build`,`objective`,`submitted_at`)
SELECT `id`,`user_email`,`display_name`,'legacy-' || `id`,'legacy',`seed`,`result`,`level`,`xp`,0,`bosses`,`duration_ms`,`mastery`,`build`,'Legacy record',`submitted_at` FROM `expedition_runs`;--> statement-breakpoint
DROP TABLE `expedition_runs`;--> statement-breakpoint
ALTER TABLE `__new_expedition_runs` RENAME TO `expedition_runs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `expedition_runs_rank_idx` ON `expedition_runs` (`xp`,`level`,`bosses`,`duration_ms`);--> statement-breakpoint
CREATE INDEX `expedition_runs_user_idx` ON `expedition_runs` (`user_email`);--> statement-breakpoint
CREATE INDEX `expedition_runs_rate_idx` ON `expedition_runs` (`user_email`,`submitted_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `expedition_runs_user_run_uidx` ON `expedition_runs` (`user_email`,`run_id`);
