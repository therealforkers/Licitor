import type { Profile } from "@/lib/db/schema";
import type { ProfileDto } from "@/types/profile";

export const mapProfileDto = (
  profile: Pick<Profile, "name" | "image" | "bio" | "location">,
): ProfileDto => {
  return {
    name: profile.name,
    image: profile.image,
    bio: profile.bio,
    location: profile.location,
  };
};
