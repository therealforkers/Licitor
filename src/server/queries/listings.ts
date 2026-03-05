import type {
  ListingCategory,
  ListingCondition,
  ListingStatus,
} from "@/lib/db/schema";
import type {
  ListingPageSize,
  ListingPriceFilter,
  ListingSortOption,
} from "@/lib/listing-browse";
import {
  buildListingPaginationMeta,
  getListingPriceCeilingCents,
} from "@/lib/listing-browse";
import {
  getListingDetailsDtoData,
  getListingsBySellerIdCountData,
  getListingsBySellerIdSummariesData,
  getPublicListingSummariesData,
  getPublicListingsCountData,
  type PublicListingStatus,
} from "@/server/data/listings";
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
  const priceCeilingCents = getListingPriceCeilingCents(options.price);
  return getPublicListingSummariesData({
    category: options.category,
    condition: options.condition,
    priceCeilingCents,
    searchQuery: options.q,
    sort: options.sort,
    status: options.status,
  });
};

export const getPublicListingsPaginated = async (options: {
  category?: ListingCategory;
  condition?: ListingCondition;
  page: number;
  pageSize: ListingPageSize;
  price?: ListingPriceFilter;
  q?: string;
  sort?: ListingSortOption;
  status?: PublicListingStatus;
}) => {
  const priceCeilingCents = getListingPriceCeilingCents(options.price);
  const totalCount = await getPublicListingsCountData({
    category: options.category,
    condition: options.condition,
    priceCeilingCents,
    searchQuery: options.q,
    status: options.status,
  });
  const pagination = buildListingPaginationMeta({
    page: options.page,
    pageSize: options.pageSize,
    totalCount,
  });
  const listings = await getPublicListingSummariesData({
    category: options.category,
    condition: options.condition,
    pagination: {
      limit: pagination.pageSize,
      offset: pagination.offset,
    },
    priceCeilingCents,
    searchQuery: options.q,
    sort: options.sort,
    status: options.status,
  });

  return {
    listings,
    pagination,
  };
};

export const getListingsBySellerId = async (
  sellerId: string,
  status?: ListingStatus,
): Promise<ListingSummaryDto[]> => {
  return getListingsBySellerIdSummariesData(sellerId, { status });
};

export const getListingsBySellerIdPaginated = async (options: {
  page: number;
  pageSize: ListingPageSize;
  sellerId: string;
  status?: ListingStatus;
}) => {
  const totalCount = await getListingsBySellerIdCountData(
    options.sellerId,
    options.status,
  );
  const pagination = buildListingPaginationMeta({
    page: options.page,
    pageSize: options.pageSize,
    totalCount,
  });
  const listings = await getListingsBySellerIdSummariesData(options.sellerId, {
    pagination: {
      limit: pagination.pageSize,
      offset: pagination.offset,
    },
    status: options.status,
  });

  return {
    listings,
    pagination,
  };
};

export const getListingById = async (
  listingId: string,
): Promise<ListingDetailsDto | null> => {
  return getListingDetailsDtoData(listingId);
};
