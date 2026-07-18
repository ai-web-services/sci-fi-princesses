CREATE TABLE `expedition_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_email` text NOT NULL,
	`display_name` text NOT NULL,
	`seed` text NOT NULL,
	`result` text NOT NULL,
	`level` integer NOT NULL,
	`xp` integer NOT NULL,
	`bosses` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`mastery` integer NOT NULL,
	`build` text NOT NULL,
	`submitted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `expedition_runs_rank_idx` ON `expedition_runs` (`xp`,`level`,`bosses`,`duration_ms`);--> statement-breakpoint
CREATE INDEX `expedition_runs_user_idx` ON `expedition_runs` (`user_email`);