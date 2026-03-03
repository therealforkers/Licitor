import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";

export const getProfileByUserIdData = async (userId: string) => {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
};

export const updateProfileByUserIdData = async (
  userId: string,
  nextValues: {
    bio: string | null;
    image: string | null;
    location: string | null;
    name: string;
    updatedAt: Date;
  },
) => {
  await db.update(profiles).set(nextValues).where(eq(profiles.userId, userId));
};
