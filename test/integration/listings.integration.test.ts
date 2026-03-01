import { describe, expect, it } from "vitest";

import { db } from "@/lib/db/client";
import { listings } from "@/lib/db/schema";
import { getListings } from "@/server/queries/listings";
import { createListingFixture } from "../fixtures/factories";

describe("getListings integration", () => {
  it("returns listings ordered by createdAt descending", async () => {
    await createListingFixture({
      id: "LST-OLDEST",
      title: "Old listing",
      description: "Created first",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-NEWEST",
      title: "New listing",
      description: "Created last",
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-01T00:00:00.000Z"),
    });

    const result = await getListings();

    expect(result).toHaveLength(2);
    expect(result.map((listing) => listing.id)).toEqual([
      "LST-NEWEST",
      "LST-OLDEST",
    ]);
  });

  it("starts each test with a clean listing state via transaction rollback", async () => {
    const result = await db.select().from(listings);
    expect(result).toHaveLength(0);
  });
});
