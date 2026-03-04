import type {
  ListingCategory,
  ListingCondition,
  ListingStatus,
} from "@/lib/db/schema";
import type {
  ListingPriceFilter,
  ListingSortOption,
} from "@/lib/listing-browse";
import { getListingPriceCeilingCents } from "@/lib/listing-browse";
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
  options: {
    category?: ListingCategory;
    condition?: ListingCondition;
    price?: ListingPriceFilter;
    q?: string;
    sort?: ListingSortOption;
    status?: PublicListingStatus;
  } = {},
): Promise<ListingSummaryDto[]> => {
  const rows = await getPublicListingsData({
    category: options.category,
    condition: options.condition,
    priceCeilingCents: getListingPriceCeilingCents(options.price),
    searchQuery: options.q,
    sort: options.sort,
    status: options.status,
  });

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
