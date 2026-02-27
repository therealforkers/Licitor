import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";

export const getCurrentProfile = async (userId: string) => {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
};
