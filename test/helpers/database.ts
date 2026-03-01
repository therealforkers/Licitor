import { db } from "@/lib/db/client";
import {
  account,
  listingImages,
  listings,
  profiles,
  session,
  user,
  verification,
} from "@/lib/db/schema";

// Fallback deterministic reset helper for cases where transaction rollback
// cannot be used for a specific integration scenario.
export const resetTestDatabaseState = async () => {
  await db.delete(session);
  await db.delete(account);
  await db.delete(verification);
  await db.delete(profiles);
  await db.delete(listingImages);
  await db.delete(listings);
  await db.delete(user);
};
