import type {
  ListingCategory,
  ListingCondition,
  ListingStatus,
} from "@/lib/db/schema";
import type { IsoDateString, Nullable } from "@/types/dto";

export type ListingImageDto = {
  id: string;
  isMain: boolean;
  url: string;
};

export type ListingSummaryDto = {
  bidCount: number;
  currentBid: Nullable<number>;
  endAt: Nullable<IsoDateString>;
  id: string;
  imageUrl: Nullable<string>;
  sellerName: string;
  startAt: Nullable<IsoDateString>;
  status: ListingStatus;
  title: string;
};

export type ListingDetailsDto = {
  bidCount: number;
  category: ListingCategory;
  condition: ListingCondition;
  currentBid: Nullable<number>;
  description: string;
  endAt: Nullable<IsoDateString>;
  id: string;
  images: ListingImageDto[];
  location: Nullable<string>;
  reservePrice: Nullable<number>;
  sellerId: string;
  sellerName: string;
  startAt: Nullable<IsoDateString>;
  startingBid: Nullable<number>;
  status: ListingStatus;
  title: string;
};

export type OwnedListingForEditDto = {
  bidCount: number;
  currentBid: Nullable<number>;
  endAt: Date | null;
  images: Array<{
    id: string;
    isMain: boolean;
    publicId: string | null;
    url: string;
  }>;
  startAt: Date | null;
  status: ListingStatus;
};

export type CreateDraftListingResultDto = {
  id: string;
};

export type AddListingImageResultDto = {
  image: ListingImageDto;
};

export type MutationSuccessDto = {
  success: true;
};

export type PublishListingResultDto = MutationSuccessDto & {
  status: ListingStatus;
};
