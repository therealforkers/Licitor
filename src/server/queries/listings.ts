import type { ListingStatus } from "@/lib/db/schema";
import {
  getListingByIdData,
  getListingsBySellerIdData,
  getPublicListingsData,
  type PublicListingStatus,
} from "@/server/data/listings";
import {
  mapListingDetailsDto,
  mapListingSummaryDto,
} from "@/server/mappers/listings";
import type { ListingDetailsDto, ListingSummaryDto } from "@/types/listings";

export const getPublicListings = async (
  status?: PublicListingStatus,
): Promise<ListingSummaryDto[]> => {
  const rows = await getPublicListingsData(status);

  return rows.map(mapListingSummaryDto);
};

export const getListingsBySellerId = async (
  sellerId: string,
  status?: ListingStatus,
): Promise<ListingSummaryDto[]> => {
  const rows = await getListingsBySellerIdData(sellerId, status);

  return rows.map(mapListingSummaryDto);
};

export const getListingById = async (
  listingId: string,
): Promise<ListingDetailsDto | null> => {
  const row = await getListingByIdData(listingId);

  if (!row) {
    return null;
  }

  return mapListingDetailsDto(row);
};
