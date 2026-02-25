import { resolve } from "node:path";

import { sql } from "drizzle-orm";
import { beforeAll, beforeEach } from "vitest";

const testDatabasePath = resolve(process.cwd(), "test", "test.db");

process.env.DATABASE_URL = testDatabasePath;

const { db } = await import("@/db/client");
const { listings } = await import("@/db/schema");

beforeAll(async () => {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
});

beforeEach(async () => {
  await db.delete(listings);
});
