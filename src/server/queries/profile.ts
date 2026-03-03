import { getProfileByUserIdData } from "@/server/data/profiles";
import { mapProfileDto } from "@/server/mappers/profile";
import type { ProfileDto } from "@/types/profile";

export const getCurrentProfile = async (
  userId: string,
): Promise<ProfileDto | null> => {
  const profile = await getProfileByUserIdData(userId);

  if (!profile) {
    return null;
  }

  return mapProfileDto(profile);
};
