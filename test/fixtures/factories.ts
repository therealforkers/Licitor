import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import type { Listing } from "@/lib/db/schema";
import { listings } from "@/lib/db/schema";

export const createUserFixture = async (overrides?: {
  email?: string;
  name?: string;
  password?: string;
  image?: string;
}) => {
  const suffix = randomUUID();

  return auth.api.signUpEmail({
    body: {
      name: overrides?.name ?? `Fixture User ${suffix.slice(0, 8)}`,
      email: overrides?.email ?? `fixture-${suffix}@test.local`,
      password: overrides?.password ?? "Pa$$w0rd",
      image: overrides?.image ?? "https://example.com/fixture-user.png",
    },
  });
};

export const createListingFixture = async (
  overrides?: Partial<Listing>,
): Promise<Listing> => {
  const id = overrides?.id ?? `LST-${randomUUID().slice(0, 8).toUpperCase()}`;
  const listing: Listing = {
    id,
    title: overrides?.title ?? "Fixture Listing",
    content: overrides?.content ?? "Fixture listing content",
    image: overrides?.image ?? "https://example.com/fixture-listing.jpg",
    createdAt: overrides?.createdAt ?? new Date(),
  };

  await db.insert(listings).values(listing);

  return listing;
};
