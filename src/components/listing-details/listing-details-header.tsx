"use client";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { getListingStatusTone } from "@/lib/listings";
import { cn } from "@/lib/utils";

export function ListingDetailsHeader() {
  const { listing } = useListingDetailsContext();

  return (
    <PageHeader
      eyebrow="Listing details"
      title={listing.title}
      className="space-y-2"
      titleClassName="max-w-4xl tracking-tight"
      rightSlot={
        <Badge
          variant="outline"
          className={cn(
            "w-fit border px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] lg:mt-2",
            getListingStatusTone(listing.status),
          )}
        >
          {listing.status}
        </Badge>
      }
    />
  );
}
