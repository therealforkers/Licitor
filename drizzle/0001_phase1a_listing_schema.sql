PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TEMP TABLE `__listing_image_backfill` AS
SELECT `id` AS `listing_id`, `image`, `created_at`
FROM `listings`;
--> statement-breakpoint
INSERT OR IGNORE INTO `user` (
	`id`,
	`name`,
	`email`,
	`email_verified`,
	`image`,
	`created_at`,
	`updated_at`
) VALUES (
	'legacy-seed-user',
	'Legacy Seller',
	'legacy-seller@licitor.local',
	true,
	NULL,
	(strftime('%s', 'now') * 1000),
	(strftime('%s', 'now') * 1000)
);
--> statement-breakpoint
CREATE TABLE `__new_listings` (
	`id` text PRIMARY KEY NOT NULL,
	`seller_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`condition` text NOT NULL,
	`reserve_price` integer,
	`starting_bid` integer NOT NULL,
	`current_bid` integer NOT NULL,
	`bid_count` integer DEFAULT 0 NOT NULL,
	`start_at` integer,
	`end_at` integer,
	`status` text DEFAULT 'Draft' NOT NULL,
	`location` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`seller_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_listings` (
	`id`,
	`seller_id`,
	`title`,
	`description`,
	`category`,
	`condition`,
	`reserve_price`,
	`starting_bid`,
	`current_bid`,
	`bid_count`,
	`start_at`,
	`end_at`,
	`status`,
	`location`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	'legacy-seed-user',
	`title`,
	`content`,
	'Other',
	'Good',
	NULL,
	0,
	0,
	0,
	NULL,
	NULL,
	'Draft',
	NULL,
	`created_at`,
	`created_at`
FROM `listings`;
--> statement-breakpoint
DROP TABLE `listings`;
--> statement-breakpoint
ALTER TABLE `__new_listings` RENAME TO `listings`;
--> statement-breakpoint
CREATE TABLE `listing_images` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`url` text NOT NULL,
	`public_id` text,
	`is_main` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `listing_images` (
	`id`,
	`listing_id`,
	`url`,
	`public_id`,
	`is_main`,
	`created_at`
)
SELECT
	`listing_id` || '-IMG-1',
	`listing_id`,
	`image`,
	NULL,
	true,
	`created_at`
FROM `__listing_image_backfill`;
--> statement-breakpoint
DROP TABLE `__listing_image_backfill`;
--> statement-breakpoint
CREATE INDEX `listings_seller_id_idx` ON `listings` (`seller_id`);
--> statement-breakpoint
CREATE INDEX `listings_status_idx` ON `listings` (`status`);
--> statement-breakpoint
CREATE INDEX `listing_images_listing_id_idx` ON `listing_images` (`listing_id`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
