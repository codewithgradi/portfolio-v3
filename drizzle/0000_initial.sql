CREATE TABLE IF NOT EXISTS `projects` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `description` text NOT NULL, `problem` text NOT NULL, `solution` text NOT NULL, `tech_stack` text DEFAULT '[]' NOT NULL, `github_url` text DEFAULT '' NOT NULL, `live_url` text DEFAULT '' NOT NULL, `image_url` text DEFAULT '' NOT NULL, `created_at` text NOT NULL);
CREATE TABLE IF NOT EXISTS `experiences` (`id` text PRIMARY KEY NOT NULL, `company` text NOT NULL, `role` text NOT NULL, `start_date` text NOT NULL, `end_date` text NOT NULL, `description` text NOT NULL, `order` integer DEFAULT 0 NOT NULL);
CREATE TABLE IF NOT EXISTS `skills` (`id` text PRIMARY KEY NOT NULL, `name` text NOT NULL, `category` text NOT NULL, `proficiency_level` text NOT NULL);
CREATE TABLE IF NOT EXISTS `certifications` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `issuer` text NOT NULL, `date_issued` text NOT NULL, `credential_url` text DEFAULT '' NOT NULL);
CREATE TABLE IF NOT EXISTS `achievements` (`id` text PRIMARY KEY NOT NULL, `title` text NOT NULL, `description` text NOT NULL, `date` text NOT NULL, `image_url` text DEFAULT '' NOT NULL);
CREATE TABLE IF NOT EXISTS `education` (`id` text PRIMARY KEY NOT NULL, `institution` text NOT NULL, `degree` text NOT NULL, `start_date` text NOT NULL, `end_date` text NOT NULL, `description` text NOT NULL);
CREATE TABLE IF NOT EXISTS `admin_users` (`id` text PRIMARY KEY NOT NULL, `username` text NOT NULL, `password_hash` text NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS `admin_users_username_unique` ON `admin_users` (`username`);
CREATE TABLE IF NOT EXISTS `site_settings` (`key` text PRIMARY KEY NOT NULL, `value` text NOT NULL);
