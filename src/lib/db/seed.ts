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
] as const;

const seedListings = [
  {
    id: "LST-001",
    sellerEmail: "bob@test.com",
    title: "Leica M4 Travel Kit",
    description:
      "Film body, prime lenses, and matching field case from a meticulous collector.",
    category: "Electronics",
    condition: "Good",
    reservePrice: 240000,
    startingBid: 175000,
    currentBid: 221000,
    bidCount: 12,
    startAt: new Date("2026-02-22T12:00:00.000Z"),
    endAt: new Date("2026-03-08T20:00:00.000Z"),
    status: "Active",
    location: "San Francisco, CA",
    createdAt: new Date("2026-02-20T14:45:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/250/1200/900",
      "https://picsum.photos/id/96/1200/900",
    ],
  },
  {
    id: "LST-002",
    sellerEmail: "alice@test.com",
    title: "Tailored Cashmere Coat",
    description:
      "Structured winter coat with removable lining and original garment bag.",
    category: "Fashion",
    condition: "LikeNew",
    reservePrice: 72000,
    startingBid: 36000,
    currentBid: 49800,
    bidCount: 6,
    startAt: new Date("2026-02-25T10:00:00.000Z"),
    endAt: new Date("2026-03-10T18:30:00.000Z"),
    status: "Active",
    location: "New York, NY",
    createdAt: new Date("2026-02-21T16:05:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/838/1200/900",
      "https://picsum.photos/id/823/1200/900",
    ],
  },
  {
    id: "LST-003",
    sellerEmail: "charlie@test.com",
    title: "Mid-Century Lounge Chair",
    description:
      "Patinated leather, walnut arms, and a low profile silhouette in excellent shape.",
    category: "HomeGarden",
    condition: "LikeNew",
    reservePrice: 185000,
    startingBid: 120000,
    currentBid: 148000,
    bidCount: 7,
    startAt: new Date("2026-02-24T15:00:00.000Z"),
    endAt: new Date("2026-03-09T18:00:00.000Z"),
    status: "Active",
    location: "Portland, OR",
    createdAt: new Date("2026-02-22T10:30:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1062/1200/900",
      "https://picsum.photos/id/1070/1200/900",
    ],
  },
  {
    id: "LST-004",
    sellerEmail: "bob@test.com",
    title: "Carbon Gravel Bike Frameset",
    description:
      "56cm endurance geometry with fork and headset, no crashes and light wear.",
    category: "Sports",
    condition: "Good",
    reservePrice: 160000,
    startingBid: 110000,
    currentBid: 132500,
    bidCount: 6,
    startAt: new Date("2026-02-26T08:00:00.000Z"),
    endAt: new Date("2026-03-11T23:00:00.000Z"),
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
    sellerEmail: "alice@test.com",
    title: "Limited Resin Figure Set",
    description:
      "Numbered collectible run with certificates and unopened accessory pack.",
    category: "Toys",
    condition: "New",
    reservePrice: null,
    startingBid: 22000,
    currentBid: 33800,
    bidCount: 9,
    startAt: new Date("2026-02-20T13:00:00.000Z"),
    endAt: new Date("2026-03-07T13:00:00.000Z"),
    status: "Active",
    location: "Seattle, WA",
    createdAt: new Date("2026-02-19T13:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/593/1200/900",
      "https://picsum.photos/id/582/1200/900",
    ],
  },
  {
    id: "LST-006",
    sellerEmail: "charlie@test.com",
    title: "Signed Abstract Diptych",
    description:
      "Two mixed-media canvases with gallery framing and vibrant geometric forms.",
    category: "Art",
    condition: "Good",
    reservePrice: 90000,
    startingBid: 45000,
    currentBid: 61000,
    bidCount: 4,
    startAt: new Date("2026-02-27T16:00:00.000Z"),
    endAt: new Date("2026-03-12T16:00:00.000Z"),
    status: "Active",
    location: "Chicago, IL",
    createdAt: new Date("2026-02-26T09:15:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1025/1200/900",
      "https://picsum.photos/id/1039/1200/900",
    ],
  },
  {
    id: "LST-007",
    sellerEmail: "bob@test.com",
    title: "First Edition Sci-Fi Set",
    description:
      "Six matching hardcovers with dust jackets and archival sleeves.",
    category: "Books",
    condition: "Fair",
    reservePrice: null,
    startingBid: 18000,
    currentBid: 26200,
    bidCount: 5,
    startAt: new Date("2026-02-28T14:00:00.000Z"),
    endAt: new Date("2026-03-13T14:00:00.000Z"),
    status: "Active",
    location: "Boston, MA",
    createdAt: new Date("2026-02-27T11:20:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/24/1200/900",
      "https://picsum.photos/id/20/1200/900",
    ],
  },
  {
    id: "LST-008",
    sellerEmail: "alice@test.com",
    title: "Classic Coupe Project",
    description:
      "Rolling shell with straight panels and labeled bins of spare components.",
    category: "Vehicles",
    condition: "Poor",
    reservePrice: 950000,
    startingBid: 700000,
    currentBid: 812000,
    bidCount: 14,
    startAt: new Date("2026-02-18T09:00:00.000Z"),
    endAt: new Date("2026-03-14T21:00:00.000Z"),
    status: "Active",
    location: "Phoenix, AZ",
    createdAt: new Date("2026-02-15T09:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/111/1200/900",
      "https://picsum.photos/id/133/1200/900",
    ],
  },
  {
    id: "LST-009",
    sellerEmail: "charlie@test.com",
    title: "Estate Jewelry Collection",
    description:
      "Mixed precious metal pieces with appraisal notes and stone details.",
    category: "Collectibles",
    condition: "Fair",
    reservePrice: 145000,
    startingBid: 90000,
    currentBid: 101500,
    bidCount: 3,
    startAt: new Date("2026-03-01T10:00:00.000Z"),
    endAt: new Date("2026-03-15T19:00:00.000Z"),
    status: "Active",
    location: "Savannah, GA",
    createdAt: new Date("2026-02-28T12:10:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/64/1200/900",
      "https://picsum.photos/id/65/1200/900",
    ],
  },
  {
    id: "LST-010",
    sellerEmail: "bob@test.com",
    title: "Industrial Tool Cabinet",
    description: "Heavy steel cabinet loaded with machinist measuring tools.",
    category: "Other",
    condition: "Fair",
    reservePrice: 68000,
    startingBid: 30000,
    currentBid: 39200,
    bidCount: 2,
    startAt: new Date("2026-03-02T09:30:00.000Z"),
    endAt: new Date("2026-03-16T18:00:00.000Z"),
    status: "Active",
    location: "Detroit, MI",
    createdAt: new Date("2026-03-01T18:40:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/48/1200/900",
      "https://picsum.photos/id/28/1200/900",
    ],
  },
  {
    id: "LST-011",
    sellerEmail: "alice@test.com",
    title: "Mirrorless Camera Bundle",
    description: "Body, two zooms, charger set, and weatherproof travel sling.",
    category: "Electronics",
    condition: "New",
    reservePrice: 155000,
    startingBid: 99000,
    currentBid: 99000,
    bidCount: 0,
    startAt: new Date("2026-03-08T12:00:00.000Z"),
    endAt: new Date("2026-03-18T12:00:00.000Z"),
    status: "Scheduled",
    location: "Austin, TX",
    createdAt: new Date("2026-03-03T10:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/259/1200/900",
      "https://picsum.photos/id/367/1200/900",
    ],
  },
  {
    id: "LST-012",
    sellerEmail: "charlie@test.com",
    title: "Selvedge Denim Capsule",
    description:
      "Three premium pairs in unworn condition with branded storage bags.",
    category: "Fashion",
    condition: "New",
    reservePrice: null,
    startingBid: 25000,
    currentBid: 25000,
    bidCount: 0,
    startAt: new Date("2026-03-09T15:00:00.000Z"),
    endAt: new Date("2026-03-19T15:00:00.000Z"),
    status: "Scheduled",
    location: "Nashville, TN",
    createdAt: new Date("2026-03-03T12:30:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1005/1200/900",
      "https://picsum.photos/id/1011/1200/900",
    ],
  },
  {
    id: "LST-013",
    sellerEmail: "bob@test.com",
    title: "Teak Outdoor Dining Set",
    description: "Eight-seat patio set with extending table and weather cover.",
    category: "HomeGarden",
    condition: "Good",
    reservePrice: 128000,
    startingBid: 82000,
    currentBid: 82000,
    bidCount: 0,
    startAt: new Date("2026-03-10T08:00:00.000Z"),
    endAt: new Date("2026-03-20T08:00:00.000Z"),
    status: "Scheduled",
    location: "San Diego, CA",
    createdAt: new Date("2026-03-03T14:20:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1040/1200/900",
      "https://picsum.photos/id/1060/1200/900",
    ],
  },
  {
    id: "LST-014",
    sellerEmail: "alice@test.com",
    title: "Team-Issue Hockey Sticks",
    description:
      "Set of five pro stock sticks, mixed flex ratings, lightly used.",
    category: "Sports",
    condition: "Fair",
    reservePrice: null,
    startingBid: 14000,
    currentBid: 14000,
    bidCount: 0,
    startAt: new Date("2026-03-11T11:30:00.000Z"),
    endAt: new Date("2026-03-21T11:30:00.000Z"),
    status: "Scheduled",
    location: "Minneapolis, MN",
    createdAt: new Date("2026-03-03T16:10:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/429/1200/900",
      "https://picsum.photos/id/488/1200/900",
    ],
  },
  {
    id: "LST-015",
    sellerEmail: "charlie@test.com",
    title: "Vintage Mecha Figure Trio",
    description: "Rare boxed set with complete inserts and display stands.",
    category: "Toys",
    condition: "LikeNew",
    reservePrice: 52000,
    startingBid: 28000,
    currentBid: 28000,
    bidCount: 0,
    startAt: new Date("2026-03-12T09:00:00.000Z"),
    endAt: new Date("2026-03-22T09:00:00.000Z"),
    status: "Scheduled",
    location: "Las Vegas, NV",
    createdAt: new Date("2026-03-03T18:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1076/1200/900",
      "https://picsum.photos/id/1084/1200/900",
    ],
  },
  {
    id: "LST-016",
    sellerEmail: "bob@test.com",
    title: "Bronze Sculpture Study",
    description:
      "Signed bronze maquette on marble base from a regional artist estate.",
    category: "Art",
    condition: "Good",
    reservePrice: 87000,
    startingBid: 54000,
    currentBid: 54000,
    bidCount: 0,
    startAt: new Date("2026-03-13T17:00:00.000Z"),
    endAt: new Date("2026-03-23T17:00:00.000Z"),
    status: "Scheduled",
    location: "Santa Fe, NM",
    createdAt: new Date("2026-03-03T19:30:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/1021/1200/900",
      "https://picsum.photos/id/1031/1200/900",
    ],
  },
  {
    id: "LST-017",
    sellerEmail: "alice@test.com",
    title: "Signed Poetry First Print",
    description:
      "Small-run press edition, hand-numbered and signed by the author.",
    category: "Books",
    condition: "LikeNew",
    reservePrice: null,
    startingBid: 9000,
    currentBid: 12400,
    bidCount: 4,
    startAt: new Date("2026-02-10T18:00:00.000Z"),
    endAt: new Date("2026-02-24T18:00:00.000Z"),
    status: "Ended",
    location: "Providence, RI",
    createdAt: new Date("2026-02-08T13:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/367/1200/900",
      "https://picsum.photos/id/365/1200/900",
    ],
  },
  {
    id: "LST-018",
    sellerEmail: "charlie@test.com",
    title: "Classic Motorcycle Chassis",
    description: "Restoration-ready frame with matching VIN documentation.",
    category: "Vehicles",
    condition: "Poor",
    reservePrice: 310000,
    startingBid: 210000,
    currentBid: 244000,
    bidCount: 8,
    startAt: new Date("2026-02-01T08:00:00.000Z"),
    endAt: new Date("2026-02-18T20:00:00.000Z"),
    status: "Ended",
    location: "Cleveland, OH",
    createdAt: new Date("2026-01-30T08:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/183/1200/900",
      "https://picsum.photos/id/175/1200/900",
    ],
  },
  {
    id: "LST-019",
    sellerEmail: "bob@test.com",
    title: "Retro Sports Memorabilia Lot",
    description:
      "Programs, pins, and signed cards from 1980s championship seasons.",
    category: "Collectibles",
    condition: "Fair",
    reservePrice: null,
    startingBid: 14000,
    currentBid: 19600,
    bidCount: 5,
    startAt: new Date("2026-02-05T12:00:00.000Z"),
    endAt: new Date("2026-02-22T12:00:00.000Z"),
    status: "Ended",
    location: "St. Louis, MO",
    createdAt: new Date("2026-02-02T12:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/577/1200/900",
      "https://picsum.photos/id/600/1200/900",
    ],
  },
  {
    id: "LST-020",
    sellerEmail: "alice@test.com",
    title: "Industrial Workbench Bundle",
    description: "Heavy maple bench, vises, and hardware organizer assortment.",
    category: "Other",
    condition: "Good",
    reservePrice: 56000,
    startingBid: 32000,
    currentBid: 38400,
    bidCount: 3,
    startAt: new Date("2026-02-12T07:30:00.000Z"),
    endAt: new Date("2026-02-28T17:30:00.000Z"),
    status: "Ended",
    location: "Milwaukee, WI",
    createdAt: new Date("2026-02-10T17:00:00.000Z"),
    imageUrls: [
      "https://picsum.photos/id/84/1200/900",
      "https://picsum.photos/id/49/1200/900",
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
