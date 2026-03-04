"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { ListingCard } from "@/components/shared/listing-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ListingStatus } from "@/lib/db/schema";
import type { ListingSummaryDto } from "@/types/listings";

type PublicListingStatus = Exclude<ListingStatus, "Draft">;

const tabConfig = [
  { label: "Active", value: "Active" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Ended", value: "Ended" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: PublicListingStatus;
}>;

type PublicListingsTabsProps = {
  initialStatus: PublicListingStatus;
  listings: ListingSummaryDto[];
};

export function PublicListingsTabs({
  initialStatus,
  listings,
}: PublicListingsTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] =
    useState<PublicListingStatus>(initialStatus);

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = (status: string) => {
    const nextStatus = status as PublicListingStatus;
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("status", nextStatus);

    setSelectedStatus(nextStatus);
    startTransition(() => {
      router.replace(`${pathname}?${nextSearchParams.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs value={selectedStatus} onValueChange={handleStatusChange}>
      <TabsList className="h-auto flex-wrap gap-2 rounded-lg bg-muted/70 p-2">
        {tabConfig.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="min-w-24 rounded-md px-4 py-2 data-[state=active]:bg-background"
            disabled={isPending}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {listings.length === 0 ? (
        <EmptyStateCard
          eyebrow={`No ${selectedStatus.toLowerCase()} listings`}
          title={`No ${selectedStatus.toLowerCase()} auctions right now.`}
          description="Switch tabs to browse other listing stages or check back soon for new inventory."
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
