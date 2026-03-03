import type { ListingStatus } from "@/lib/db/schema";
import {
  getListingByIdData,
  getListingsBySellerIdData,
  getPublicListingsData,
} from "@/server/data/listings";

export const getPublicListings = async () => {
  return getPublicListingsData();
};

export const getListingsBySellerId = async (
  sellerId: string,
  status?: ListingStatus,
) => {
  return getListingsBySellerIdData(sellerId, status);
};

export const getListingById = async (listingId: string) => {
  return getListingByIdData(listingId);
};
