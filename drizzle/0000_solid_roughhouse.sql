CREATE TABLE `content_items` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`title` text NOT NULL,
	`eyebrow` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`media_url` text DEFAULT '' NOT NULL,
	`media_alt` text DEFAULT '' NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`year` text DEFAULT '' NOT NULL,
	`href` text DEFAULT '' NOT NULL,
	`accent` text DEFAULT 'forest' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
