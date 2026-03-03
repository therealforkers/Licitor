"use client";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import { formatListingCategory, formatListingCondition } from "@/lib/listings";

export function ListingDetailsMeta() {
  const { listing } = useListingDetailsContext();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            Seller
          </p>
          <p className="mt-2 text-base font-medium text-foreground">
            {listing.sellerName}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            Location
          </p>
          <p className="mt-2 text-base font-medium text-foreground">
            {listing.location ?? "Location pending"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            Category
          </p>
          <p className="mt-2 text-base font-medium text-foreground">
            {formatListingCategory(listing.category)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            Condition
          </p>
          <p className="mt-2 text-base font-medium text-foreground">
            {formatListingCondition(listing.condition)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/50 p-5">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Description
        </p>
        <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
          {listing.description}
        </p>
      </div>
    </>
  );
}
