import { describe, expect, it } from "vitest";

import { db } from "@/lib/db/client";
import { listingImages, listings, profiles, user } from "@/lib/db/schema";
import {
  getListingById,
  getListingsBySellerId,
  getPublicListings,
} from "@/server/queries/listings";
import { createListingFixture } from "../fixtures/factories";

describe("getPublicListings integration", () => {
  it("returns public listings ordered by createdAt descending", async () => {
    await createListingFixture({
      id: "LST-OLDEST",
      title: "Old listing",
      description: "Created first",
      status: "Ended",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-NEWEST",
      title: "New listing",
      description: "Created last",
      status: "Active",
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-01T00:00:00.000Z"),
    });

    const result = await getPublicListings();

    expect(result).toHaveLength(2);
    expect(result.map((listing) => listing.id)).toEqual([
      "LST-NEWEST",
      "LST-OLDEST",
    ]);
  });

  it("excludes draft listings from the public dataset", async () => {
    await createListingFixture({
      id: "LST-DRAFT",
      title: "Private draft",
      status: "Draft",
    });
    await createListingFixture({
      id: "LST-SCHEDULED",
      title: "Public scheduled",
      status: "Scheduled",
    });

    const result = await getPublicListings();

    expect(result.map((listing) => listing.id)).toEqual(["LST-SCHEDULED"]);
  });

  it("returns an empty array when no public listings exist", async () => {
    const result = await getPublicListings();

    expect(result).toEqual([]);
  });

  it("starts each test with a clean listing state via transaction rollback", async () => {
    const result = await db.select().from(listings);
    expect(result).toHaveLength(0);
  });
});

describe("getListingsBySellerId integration", () => {
  it("returns only listings owned by the requested seller", async () => {
    const sellerCreatedAt = new Date("2026-01-01T00:00:00.000Z");

    await db.insert(user).values([
      {
        id: "usr_seller_a",
        name: "Seller A",
        email: "seller-a@test.local",
        emailVerified: true,
        image: "https://example.com/seller-a.png",
        createdAt: sellerCreatedAt,
        updatedAt: sellerCreatedAt,
      },
      {
        id: "usr_seller_b",
        name: "Seller B",
        email: "seller-b@test.local",
        emailVerified: true,
        image: "https://example.com/seller-b.png",
        createdAt: sellerCreatedAt,
        updatedAt: sellerCreatedAt,
      },
    ]);
    await db.insert(profiles).values([
      {
        id: "prf_seller_a",
        userId: "usr_seller_a",
        name: "Seller A",
        location: "Seller City",
        bio: null,
        image: "https://example.com/seller-a.png",
        createdAt: sellerCreatedAt,
        updatedAt: sellerCreatedAt,
      },
      {
        id: "prf_seller_b",
        userId: "usr_seller_b",
        name: "Seller B",
        location: "Seller City",
        bio: null,
        image: "https://example.com/seller-b.png",
        createdAt: sellerCreatedAt,
        updatedAt: sellerCreatedAt,
      },
    ]);

    await createListingFixture({
      id: "LST-MY-DRAFT",
      sellerId: "usr_seller_a",
      title: "My draft",
      status: "Draft",
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-01T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-MY-ACTIVE",
      sellerId: "usr_seller_a",
      title: "My active",
      status: "Active",
      createdAt: new Date("2026-02-02T00:00:00.000Z"),
      updatedAt: new Date("2026-02-02T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-OTHER-ACTIVE",
      sellerId: "usr_seller_b",
      title: "Other active",
      status: "Active",
      createdAt: new Date("2026-02-03T00:00:00.000Z"),
      updatedAt: new Date("2026-02-03T00:00:00.000Z"),
    });

    const result = await getListingsBySellerId("usr_seller_a");

    expect(result.map((listing) => listing.id)).toEqual([
      "LST-MY-ACTIVE",
      "LST-MY-DRAFT",
    ]);
  });

  it("includes all statuses for the current seller, including drafts", async () => {
    const sellerCreatedAt = new Date("2026-01-01T00:00:00.000Z");

    await db.insert(user).values({
      id: "usr_seller_c",
      name: "Seller C",
      email: "seller-c@test.local",
      emailVerified: true,
      image: "https://example.com/seller-c.png",
      createdAt: sellerCreatedAt,
      updatedAt: sellerCreatedAt,
    });
    await db.insert(profiles).values({
      id: "prf_seller_c",
      userId: "usr_seller_c",
      name: "Seller C",
      location: "Seller City",
      bio: null,
      image: "https://example.com/seller-c.png",
      createdAt: sellerCreatedAt,
      updatedAt: sellerCreatedAt,
    });

    await createListingFixture({
      id: "LST-SELLER-DRAFT",
      sellerId: "usr_seller_c",
      status: "Draft",
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-01T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-SELLER-SCHEDULED",
      sellerId: "usr_seller_c",
      status: "Scheduled",
      createdAt: new Date("2026-02-02T00:00:00.000Z"),
      updatedAt: new Date("2026-02-02T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-SELLER-ENDED",
      sellerId: "usr_seller_c",
      status: "Ended",
      createdAt: new Date("2026-02-03T00:00:00.000Z"),
      updatedAt: new Date("2026-02-03T00:00:00.000Z"),
    });

    const result = await getListingsBySellerId("usr_seller_c");

    expect(result.map((listing) => listing.status)).toEqual([
      "Ended",
      "Scheduled",
      "Draft",
    ]);
  });

  it("can filter the seller dataset by status at the query layer", async () => {
    const sellerCreatedAt = new Date("2026-01-01T00:00:00.000Z");

    await db.insert(user).values({
      id: "usr_seller_d",
      name: "Seller D",
      email: "seller-d@test.local",
      emailVerified: true,
      image: "https://example.com/seller-d.png",
      createdAt: sellerCreatedAt,
      updatedAt: sellerCreatedAt,
    });
    await db.insert(profiles).values({
      id: "prf_seller_d",
      userId: "usr_seller_d",
      name: "Seller D",
      location: "Seller City",
      bio: null,
      image: "https://example.com/seller-d.png",
      createdAt: sellerCreatedAt,
      updatedAt: sellerCreatedAt,
    });

    await createListingFixture({
      id: "LST-SELLER-D-ACTIVE",
      sellerId: "usr_seller_d",
      status: "Active",
      createdAt: new Date("2026-02-02T00:00:00.000Z"),
      updatedAt: new Date("2026-02-02T00:00:00.000Z"),
    });
    await createListingFixture({
      id: "LST-SELLER-D-SCHEDULED",
      sellerId: "usr_seller_d",
      status: "Scheduled",
      createdAt: new Date("2026-02-03T00:00:00.000Z"),
      updatedAt: new Date("2026-02-03T00:00:00.000Z"),
    });

    const result = await getListingsBySellerId("usr_seller_d", "Scheduled");

    expect(result.map((listing) => listing.id)).toEqual([
      "LST-SELLER-D-SCHEDULED",
    ]);
    expect(result.every((listing) => listing.status === "Scheduled")).toBe(
      true,
    );
  });
});

describe("getListingById integration", () => {
  it("returns a complete listing record with seller and ordered images", async () => {
    const createdAt = new Date("2026-02-10T12:00:00.000Z");
    await db.insert(user).values({
      id: "usr_detail_owner",
      name: "Detail Seller",
      email: "detail-seller@test.local",
      emailVerified: true,
      image: "https://example.com/detail-seller.png",
      createdAt,
      updatedAt: createdAt,
    });
    await db.insert(profiles).values({
      id: "prf_detail_owner",
      userId: "usr_detail_owner",
      name: "Detail Seller",
      location: "Detail City",
      bio: null,
      image: "https://example.com/detail-seller.png",
      createdAt,
      updatedAt: createdAt,
    });

    await createListingFixture({
      id: "LST-DETAILS",
      sellerId: "usr_detail_owner",
      title: "Detailed listing",
      status: "Active",
      createdAt,
      updatedAt: createdAt,
    });

    await db.insert(listingImages).values({
      id: "LST-DETAILS-IMG-2",
      listingId: "LST-DETAILS",
      url: "https://example.com/detail-listing-2.jpg",
      publicId: null,
      isMain: false,
      createdAt: new Date("2026-02-10T12:05:00.000Z"),
    });

    const result = await getListingById("LST-DETAILS");

    expect(result).not.toBeNull();
    expect(result?.sellerName).toBe("Detail Seller");
    expect(result?.images.map((image) => image.id)).toEqual([
      "LST-DETAILS-IMG-1",
      "LST-DETAILS-IMG-2",
    ]);
    expect(result?.status).toBe("Active");
  });
});
