"use client";

import { RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  ALL_OPTION,
  FilterDropdown,
} from "@/components/listings/filter-dropdown";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { ListingCard } from "@/components/shared/listing-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ListingCategory,
  type ListingCondition,
  listingCategories,
  listingConditions,
} from "@/lib/db/schema";
import {
  getListingPriceLabel,
  getListingSortLabel,
  type ListingBrowseState,
  type ListingPriceFilter,
  type ListingSortOption,
  listingPriceFilterOptions,
  listingSortOptions,
  type PublicBrowseStatus,
  publicBrowseStatuses,
} from "@/lib/listing-browse";
import { formatListingCategory, formatListingCondition } from "@/lib/listings";
import type { ListingSummaryDto } from "@/types/listings";

type PublicListingsTabsProps = {
  initialState: ListingBrowseState;
  listings: ListingSummaryDto[];
};

const statusTabLabels = {
  Active: "Active",
  Ended: "Ended",
  Scheduled: "Scheduled",
} as const satisfies Record<PublicBrowseStatus, string>;

export function PublicListingsTabs({
  initialState,
  listings,
}: PublicListingsTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<PublicBrowseStatus>(
    initialState.status,
  );

  useEffect(() => {
    setSelectedStatus(initialState.status);
  }, [initialState.status]);

  const navigateWithParams = (mutator: (params: URLSearchParams) => void) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    mutator(nextSearchParams);

    startTransition(() => {
      router.replace(`${pathname}?${nextSearchParams.toString()}`, {
        scroll: false,
      });
    });
  };

  const setParam = (key: string, value?: string) => {
    navigateWithParams((params) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });
  };

  const handleStatusChange = (status: string) => {
    const nextStatus = status as PublicBrowseStatus;

    setSelectedStatus(nextStatus);
    setParam("status", nextStatus);
  };

  const hasActiveSelection = Boolean(
    initialState.category ||
      initialState.condition ||
      getListingPriceLabel(initialState.price) ||
      getListingSortLabel(initialState.sort),
  );

  const handleCategoryChange = (value: string) => {
    setParam("category", value === ALL_OPTION ? undefined : value);
  };

  const handleConditionChange = (value: string) => {
    setParam("condition", value === ALL_OPTION ? undefined : value);
  };

  const handlePriceChange = (value: string) => {
    setParam("price", value === ALL_OPTION ? undefined : value);
  };

  const handleSortChange = (value: string) => {
    setParam("sort", value === ALL_OPTION ? undefined : value);
  };

  const resetFiltersAndSort = () => {
    navigateWithParams((params) => {
      params.delete("category");
      params.delete("condition");
      params.delete("price");
      params.delete("sort");
    });
  };

  return (
    <Tabs value={selectedStatus} onValueChange={handleStatusChange}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <TabsList className="h-auto flex-wrap gap-2 rounded-lg bg-muted/70 p-2">
            {publicBrowseStatuses.map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="min-w-24 rounded-md px-4 py-2 data-[state=active]:bg-background"
                disabled={isPending}
              >
                {statusTabLabels[status]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <FilterDropdown<ListingCategory>
              label="Category"
              options={listingCategories.map((category) => ({
                label: formatListingCategory(category),
                value: category,
              }))}
              value={initialState.category}
              onValueChange={handleCategoryChange}
              disabled={isPending}
            />

            <FilterDropdown<ListingCondition>
              label="Condition"
              options={listingConditions.map((condition) => ({
                label: formatListingCondition(condition),
                value: condition,
              }))}
              value={initialState.condition}
              onValueChange={handleConditionChange}
              disabled={isPending}
            />

            <FilterDropdown<ListingPriceFilter>
              label="Price"
              options={listingPriceFilterOptions}
              value={initialState.price}
              onValueChange={handlePriceChange}
              disabled={isPending}
            />

            <FilterDropdown<ListingSortOption>
              label="Sort"
              options={listingSortOptions}
              value={initialState.sort}
              onValueChange={handleSortChange}
              disabled={isPending}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={resetFiltersAndSort}
              disabled={isPending || !hasActiveSelection}
              aria-label="Reset filters and sort"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {listings.length === 0 ? (
        <EmptyStateCard
          eyebrow={`No ${selectedStatus.toLowerCase()} listings`}
          title={`No ${selectedStatus.toLowerCase()} auctions right now.`}
          description="Adjust your filters, switch tabs, or check back soon for new inventory."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              href={`/listings/${listing.id}`}
              listing={listing}
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </Tabs>
  );
}
