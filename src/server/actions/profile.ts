"use server";

import { getCurrentSession } from "@/lib/auth-session";
import {
  type ProfileUpdateInput,
  profileUpdateSchema,
} from "@/lib/validators/profile";
import {
  getProfileByUserIdData,
  updateProfileByUserIdData,
} from "@/server/data/profiles";

const toNullable = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const updateProfileByUserId = async (
  userId: string | null,
  input: ProfileUpdateInput,
) => {
  if (!userId) {
    throw new Error("Unauthorized.");
  }

  const parsed = profileUpdateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid profile payload.",
    );
  }

  const now = new Date();
  const nextValues = {
    name: parsed.data.name.trim(),
    image: toNullable(parsed.data.image),
    bio: toNullable(parsed.data.bio),
    location: toNullable(parsed.data.location),
    updatedAt: now,
  };

  await updateProfileByUserIdData(userId, nextValues);
  const updatedProfile = await getProfileByUserIdData(userId);

  if (!updatedProfile) {
    throw new Error("Profile not found.");
  }

  return updatedProfile;
};

export const updateProfileAction = async (input: ProfileUpdateInput) => {
  const session = await getCurrentSession();

  const updatedProfile = await updateProfileByUserId(
    session?.user?.id ?? null,
    input,
  );

  return {
    success: true,
    profile: updatedProfile,
  };
};
