import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export default async function globalSetup() {
  const testDirectory = resolve(process.cwd(), "test");
  const testDatabasePath = resolve(testDirectory, "test.db");
  const migrationsFolder = resolve(process.cwd(), "drizzle");

  process.env.DATABASE_URL = testDatabasePath;
  process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
  process.env.BETTER_AUTH_SECRET ??= "integration-test-secret";

  if (!existsSync(testDirectory)) {
    mkdirSync(testDirectory, { recursive: true });
  }

  if (existsSync(testDatabasePath)) {
    rmSync(testDatabasePath);
  }

  const { db } = await import("@/lib/db/client");
  migrate(db, { migrationsFolder });
}
