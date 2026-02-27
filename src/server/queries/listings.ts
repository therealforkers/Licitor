import { desc } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { listings } from "@/lib/db/schema";

export const getListings = async () => {
  return db.select().from(listings).orderBy(desc(listings.createdAt));
};
