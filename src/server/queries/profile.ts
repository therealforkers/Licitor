import { getProfileByUserIdData } from "@/server/data/profiles";

export const getCurrentProfile = async (userId: string) => {
  return getProfileByUserIdData(userId);
};
