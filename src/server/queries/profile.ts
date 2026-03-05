import { getProfileDtoByUserIdData } from "@/server/data/profiles";
import type { ProfileDto } from "@/types/profile";

export const getCurrentProfile = async (
  userId: string,
): Promise<ProfileDto | null> => {
  return getProfileDtoByUserIdData(userId);
};
