import type { Nullable } from "@/types/dto";

export type ProfileDto = {
  bio: Nullable<string>;
  image: Nullable<string>;
  location: Nullable<string>;
  name: string;
};

export type UpdateProfileResultDto = {
  profile: ProfileDto;
  success: true;
};
