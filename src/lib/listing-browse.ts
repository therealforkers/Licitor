import {
  type ListingCategory,
  type ListingCondition,
  type ListingStatus,
  listingCategories,
  listingConditions,
} from "@/lib/db/schema";

export type PublicBrowseStatus = Exclude<ListingStatus, "Draft">;

export const publicBrowseStatuses = [
  "Active",
  "Scheduled",
  "Ended",
] as const satisfies ReadonlyArray<PublicBrowseStatus>;

export type ListingPriceFilter = "10" | "50" | "100" | "500";

export const listingPriceFilterOptions = [
  { label: "Under $10", value: "10" },
  { label: "Under $50", value: "50" },
  { label: "Under $100", value: "100" },
  { label: "Under $500", value: "500" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ListingPriceFilter;
}>;

export type ListingSortOption =
  | "newest"
  | "ending-soonest"
  | "most-bids"
  | "price-low-high"
  | "price-high-low";

export const listingSortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Ending Soonest", value: "ending-soonest" },
  { label: "Most Bids", value: "most-bids" },
  { label: "Price Low->High", value: "price-low-high" },
  { label: "Price High->Low", value: "price-high-low" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ListingSortOption;
}>;

export type ListingBrowseState = {
  category?: ListingCategory;
  condition?: ListingCondition;
  price?: ListingPriceFilter;
  q?: string;
  sort?: ListingSortOption;
  status: PublicBrowseStatus;
};

const listingCategorySet = new Set<ListingCategory>(listingCategories);
const listingConditionSet = new Set<ListingCondition>(listingConditions);
const publicBrowseStatusSet = new Set<PublicBrowseStatus>(publicBrowseStatuses);
const listingPriceFilterSet = new Set<ListingPriceFilter>(
  listingPriceFilterOptions.map((option) => option.value),
);
const listingSortSet = new Set<ListingSortOption>(
  listingSortOptions.map((option) => option.value),
);

const normalizeSearchParam = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export const parsePublicBrowseStatus = (
  value?: string | string[],
): PublicBrowseStatus => {
  const normalized = normalizeSearchParam(value);

  if (
    normalized &&
    publicBrowseStatusSet.has(normalized as PublicBrowseStatus)
  ) {
    return normalized as PublicBrowseStatus;
  }

  return "Active";
};

export const parseListingCategoryFilter = (
  value?: string | string[],
): ListingCategory | undefined => {
  const normalized = normalizeSearchParam(value);

  if (!normalized) {
    return undefined;
  }

  return listingCategorySet.has(normalized as ListingCategory)
    ? (normalized as ListingCategory)
    : undefined;
};

export const parseListingConditionFilter = (
  value?: string | string[],
): ListingCondition | undefined => {
  const normalized = normalizeSearchParam(value);

  if (!normalized) {
    return undefined;
  }

  return listingConditionSet.has(normalized as ListingCondition)
    ? (normalized as ListingCondition)
    : undefined;
};

export const parseListingPriceFilter = (
  value?: string | string[],
): ListingPriceFilter | undefined => {
  const normalized = normalizeSearchParam(value);

  if (!normalized) {
    return undefined;
  }

  return listingPriceFilterSet.has(normalized as ListingPriceFilter)
    ? (normalized as ListingPriceFilter)
    : undefined;
};

export const parseListingSortOption = (
  value?: string | string[],
): ListingSortOption | undefined => {
  const normalized = normalizeSearchParam(value);

  if (!normalized) {
    return undefined;
  }

  return listingSortSet.has(normalized as ListingSortOption)
    ? (normalized as ListingSortOption)
    : undefined;
};

export const parseListingSearchTerm = (value?: string | string[]) => {
  const normalized = normalizeSearchParam(value)?.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, 200);
};

export const getListingPriceCeilingCents = (
  priceFilter?: ListingPriceFilter,
): number | undefined => {
  if (!priceFilter) {
    return undefined;
  }

  return Number(priceFilter) * 100;
};

export const getListingSortLabel = (sort?: ListingSortOption) => {
  if (!sort) {
    return undefined;
  }

  return listingSortOptions.find((option) => option.value === sort)?.label;
};

export const getListingPriceLabel = (price?: ListingPriceFilter) => {
  if (!price) {
    return undefined;
  }

  return listingPriceFilterOptions.find((option) => option.value === price)
    ?.label;
};
