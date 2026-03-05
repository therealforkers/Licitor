import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import type { ProfileDto } from "@/types/profile";

export const getProfileDtoByUserIdData = async (
  userId: string,
): Promise<ProfileDto | null> => {
  const profile = await db.query.profiles.findFirst({
    columns: {
      name: true,
      image: true,
      bio: true,
      location: true,
    },
    where: eq(profiles.userId, userId),
  });

  if (!profile) {
    return null;
  }

  return {
    name: profile.name,
    image: profile.image,
    bio: profile.bio,
    location: profile.location,
  };
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
