import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  achievements,
  adminUsers,
  certifications,
  education,
  experiences,
  projects,
  schema,
  siteSettings,
  skills,
} from "./schema";
import {
  seedAchievements,
  seedCertifications,
  seedEducation,
  seedExperiences,
  seedProjects,
  seedSkills,
} from "./seed-data";
import { ensureDefaultCv } from "@/lib/default-cv";

const databasePath = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  process.env.SQLITE_PATH || "./data/portfolio.db",
);
mkdirSync(path.dirname(databasePath), { recursive: true });

const globalForDb = globalThis as typeof globalThis & {
  __portfolioSqlite?: Database.Database;
};

const sqlite =
  globalForDb.__portfolioSqlite ??
  new Database(databasePath, { timeout: 30000 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__portfolioSqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function bootstrapDatabase() {
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 30000");
  sqlite.exec("BEGIN IMMEDIATE");

  try {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        tech_stack TEXT NOT NULL DEFAULT '[]',
        github_url TEXT NOT NULL DEFAULT '',
        live_url TEXT NOT NULL DEFAULT '',
        image_url TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        description TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        proficiency_level TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS certifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        date_issued TEXT NOT NULL,
        credential_url TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        image_url TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS education (
        id TEXT PRIMARY KEY,
        institution TEXT NOT NULL,
        degree TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        description TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    if (db.select().from(projects).all().length === 0) {
      db.insert(projects).values(seedProjects).run();
    }
    if (db.select().from(experiences).all().length === 0) {
      db.insert(experiences).values(seedExperiences).run();
    }
    if (db.select().from(skills).all().length === 0) {
      db.insert(skills).values(seedSkills).run();
    }
    if (db.select().from(certifications).all().length === 0) {
      db.insert(certifications).values(seedCertifications).run();
    }
    if (db.select().from(achievements).all().length === 0) {
      db.insert(achievements).values(seedAchievements).run();
    }
    if (db.select().from(education).all().length === 0) {
      db.insert(education).values(seedEducation).run();
    }
    if (db.select().from(adminUsers).all().length === 0) {
      db.insert(adminUsers)
        .values({
          id: "admin-primary",
          username: process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin",
          passwordHash: hashPassword(
            process.env.ADMIN_PASSWORD || randomBytes(24).toString("hex"),
          ),
        })
        .run();
    }

    db.insert(siteSettings)
      .values({ key: "cvUpdatedAt", value: "2026-02-18T09:00:00.000Z" })
      .onConflictDoNothing()
      .run();
    sqlite.exec("COMMIT");
  } catch (error) {
    sqlite.exec("ROLLBACK");
    throw error;
  }

  ensureDefaultCv();
}

// Next.js collects route configuration in parallel build workers. No worker
// needs content at build time because every database-backed route is dynamic.
if (process.env.NEXT_PHASE !== "phase-production-build") {
  bootstrapDatabase();
}

export { sqlite };
