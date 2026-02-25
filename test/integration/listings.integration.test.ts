import { describe, expect, it } from "vitest";

import { db } from "@/db/client";
import { listings } from "@/db/schema";
import { getListings } from "@/server/queries/listings";

describe("getListings integration", () => {
  it("returns listings ordered by createdAt descending", async () => {
    await db.insert(listings).values([
      {
        id: "LST-OLDEST",
        title: "Old listing",
        content: "Created first",
        image: "https://example.com/old.jpg",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      {
        id: "LST-NEWEST",
        title: "New listing",
        content: "Created last",
        image: "https://example.com/new.jpg",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      },
    ]);

    const result = await getListings();

    expect(result).toHaveLength(2);
    expect(result.map((listing) => listing.id)).toEqual([
      "LST-NEWEST",
      "LST-OLDEST",
    ]);
  });
});
