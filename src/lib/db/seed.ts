import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "./client";
import {
  account,
  listingImages,
  listings,
  profiles,
  session,
  user,
  verification,
} from "./schema";

const seedUsers = [
  {
    name: "Bob Bobbity",
    email: "bob@test.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Alice Testford",
    email: "alice@test.com",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Charlie Example",
    email: "charlie@test.com",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    name: "Dana Seller",
    email: "dana@test.com",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const seedListings = [
  {
    id: "LST-001",
    sellerEmail: "bob@test.com",
    title: "1960s Lounge Chair by Hjellegjerde",
    description:
      "Patinated cognac leather, sculpted walnut arms, and a low-slung silhouette that still feels current.",
    category: "HomeGarden",
    condition: "LikeNew",
    reservePrice: 185000,
    startingBid: 120000,
    currentBid: 148000,
    bidCount: 7,
    startAt: new Date("2026-02-20T15:00:00.000Z"),
    endAt: new Date("2026-03-05T18:00:00.000Z"),
    status: "Active",
    location: "Portland, OR",
    createdAt: new Date("2026-02-18T10:30:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1062/1200/900",
      "https://picsum.photos/id/1070/1200/900",
    ],
  },
  {
    id: "LST-002",
    sellerEmail: "alice@test.com",
    title: "Leica M4 Travel Kit",
    description:
      "Film body, 35mm and 50mm lenses, strap, manuals, and field case from a meticulous collector.",
    category: "Electronics",
    condition: "Good",
    reservePrice: 240000,
    startingBid: 175000,
    currentBid: 221000,
    bidCount: 12,
    startAt: new Date("2026-02-19T12:00:00.000Z"),
    endAt: new Date("2026-03-02T20:00:00.000Z"),
    status: "Active",
    location: "San Francisco, CA",
    createdAt: new Date("2026-02-17T14:45:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/250/1200/900",
      "https://picsum.photos/id/96/1200/900",
      "https://picsum.photos/id/433/1200/900",
    ],
  },
  {
    id: "LST-003",
    sellerEmail: "charlie@test.com",
    title: "Signed Abstract Diptych",
    description:
      "Pair of mixed-media canvases with bold geometry and gallery framing, ready for a large wall.",
    category: "Art",
    condition: "LikeNew",
    reservePrice: 90000,
    startingBid: 45000,
    currentBid: 61000,
    bidCount: 4,
    startAt: new Date("2026-02-24T16:00:00.000Z"),
    endAt: new Date("2026-03-06T16:00:00.000Z"),
    status: "Active",
    location: "Chicago, IL",
    createdAt: new Date("2026-02-22T09:15:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1025/1200/900",
      "https://picsum.photos/id/1039/1200/900",
    ],
  },
  {
    id: "LST-004",
    sellerEmail: "dana@test.com",
    title: "Carbon Gravel Bike Frameset",
    description:
      "56cm endurance geometry with fork, seatpost, and headset. Light cosmetic wear and no crashes.",
    category: "Sports",
    condition: "Good",
    reservePrice: 160000,
    startingBid: 110000,
    currentBid: 132500,
    bidCount: 6,
    startAt: new Date("2026-02-26T08:00:00.000Z"),
    endAt: new Date("2026-03-08T23:00:00.000Z"),
    status: "Active",
    location: "Boulder, CO",
    createdAt: new Date("2026-02-25T08:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/292/1200/900",
      "https://picsum.photos/id/1074/1200/900",
    ],
  },
  {
    id: "LST-005",
    sellerEmail: "bob@test.com",
    title: "First Edition Sci-Fi Box Set",
    description:
      "Six matching hardcovers with dust jackets and archival sleeves from a private estate library.",
    category: "Books",
    condition: "Fair",
    reservePrice: null,
    startingBid: 18000,
    currentBid: 18000,
    bidCount: 0,
    startAt: new Date("2026-03-03T14:00:00.000Z"),
    endAt: new Date("2026-03-10T14:00:00.000Z"),
    status: "Scheduled",
    location: "Boston, MA",
    createdAt: new Date("2026-02-27T11:20:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/24/1200/900",
      "https://picsum.photos/id/20/1200/900",
    ],
  },
  {
    id: "LST-006",
    sellerEmail: "alice@test.com",
    title: "Designer Archive Coat",
    description:
      "Structured wool coat with removable lining, garment bag, and original tags still attached.",
    category: "Fashion",
    condition: "New",
    reservePrice: 72000,
    startingBid: 36000,
    currentBid: 36000,
    bidCount: 0,
    startAt: new Date("2026-03-04T17:30:00.000Z"),
    endAt: new Date("2026-03-11T17:30:00.000Z"),
    status: "Scheduled",
    location: "New York, NY",
    createdAt: new Date("2026-02-26T16:05:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/838/1200/900",
      "https://picsum.photos/id/823/1200/900",
    ],
  },
  {
    id: "LST-007",
    sellerEmail: "charlie@test.com",
    title: "Project Roadster Roller",
    description:
      "Rolling shell with straight body panels, partial interior, and a crate of labeled spares.",
    category: "Vehicles",
    condition: "Poor",
    reservePrice: 950000,
    startingBid: 700000,
    currentBid: 812000,
    bidCount: 14,
    startAt: new Date("2026-02-01T09:00:00.000Z"),
    endAt: new Date("2026-02-20T21:00:00.000Z"),
    status: "Ended",
    location: "Phoenix, AZ",
    createdAt: new Date("2026-01-28T09:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/111/1200/900",
      "https://picsum.photos/id/133/1200/900",
    ],
  },
  {
    id: "LST-008",
    sellerEmail: "dana@test.com",
    title: "Limited Resin Figure Set",
    description:
      "Complete collectible run with numbered certificates, foam inserts, and unopened accessory pack.",
    category: "Toys",
    condition: "New",
    reservePrice: null,
    startingBid: 22000,
    currentBid: 33800,
    bidCount: 9,
    startAt: new Date("2026-02-05T13:00:00.000Z"),
    endAt: new Date("2026-02-26T13:00:00.000Z"),
    status: "Ended",
    location: "Seattle, WA",
    createdAt: new Date("2026-02-03T13:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/593/1200/900",
      "https://picsum.photos/id/582/1200/900",
    ],
  },
  {
    id: "LST-009",
    sellerEmail: "bob@test.com",
    title: "Estate Jewelry Sort",
    description:
      "Draft lot with stones and settings documented, ready for pricing and catalog refinement before launch.",
    category: "Collectibles",
    condition: "Good",
    reservePrice: null,
    startingBid: 15000,
    currentBid: 15000,
    bidCount: 0,
    startAt: null,
    endAt: null,
    status: "Draft",
    location: "Savannah, GA",
    createdAt: new Date("2026-02-28T12:10:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/64/1200/900",
      "https://picsum.photos/id/65/1200/900",
    ],
  },
  {
    id: "LST-010",
    sellerEmail: "alice@test.com",
    title: "Warehouse Tool Cabinet",
    description:
      "Heavy steel cabinet with labeled drawers and a full set of machinist measuring tools still inside.",
    category: "Other",
    condition: "Fair",
    reservePrice: 68000,
    startingBid: 30000,
    currentBid: 30000,
    bidCount: 0,
    startAt: null,
    endAt: null,
    status: "Draft",
    location: "Detroit, MI",
    createdAt: new Date("2026-02-28T18:40:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/48/1200/900",
      "https://picsum.photos/id/28/1200/900",
    ],
  },
] as const;

const sharedPassword = "Pa$$w0rd";

const getSellerId = (sellerIds: Map<string, string>, sellerEmail: string) => {
  const sellerId = sellerIds.get(sellerEmail);

  if (!sellerId) {
    throw new Error(`Missing seller id for ${sellerEmail}.`);
  }

  return sellerId;
};

const seed = async () => {
  await db.delete(session);
  await db.delete(account);
  await db.delete(verification);
  await db.delete(profiles);
  await db.delete(listingImages);
  await db.delete(listings);
  await db.delete(user);

  for (const seedUser of seedUsers) {
    await auth.api.signUpEmail({
      body: {
        name: seedUser.name,
        email: seedUser.email,
        password: sharedPassword,
        image: seedUser.image,
      },
    });
  }

  const sellerIds = new Map<string, string>();

  for (const seedUser of seedUsers) {
    const createdUser = await db.query.user.findFirst({
      where: eq(user.email, seedUser.email),
    });

    if (!createdUser) {
      throw new Error(`Missing seeded auth user for ${seedUser.email}.`);
    }

    sellerIds.set(seedUser.email, createdUser.id);
  }

  await db.insert(listings).values(
    seedListings.map((listing) => ({
      id: listing.id,
      sellerId: getSellerId(sellerIds, listing.sellerEmail),
      title: listing.title,
      description: listing.description,
      category: listing.category,
      condition: listing.condition,
      reservePrice: listing.reservePrice,
      startingBid: listing.startingBid,
      currentBid: listing.currentBid,
      bidCount: listing.bidCount,
      startAt: listing.startAt,
      endAt: listing.endAt,
      status: listing.status,
      location: listing.location,
      createdAt: listing.createdAt,
      updatedAt: listing.createdAt,
    })),
  );

  await db.insert(listingImages).values(
    seedListings.flatMap((listing) =>
      listing.imageUrls.map((url, index) => ({
        id: `${listing.id}-IMG-${index + 1}`,
        listingId: listing.id,
        url,
        publicId: null,
        isMain: index === 0,
        createdAt: listing.createdAt,
      })),
    ),
  );

  console.log(
    `Seeded ${seedListings.length} listings, ${seedListings.flatMap((listing) => listing.imageUrls).length} listing images, and ${seedUsers.length} auth users into SQLite database.`,
  );
  console.log(`Seeded user password: ${sharedPassword}`);
};

seed().catch((error: unknown) => {
  console.error("Failed to seed listings.", error);
  process.exit(1);
});
