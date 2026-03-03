"use client";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import {
  formatBidCount,
  formatListingCurrency,
  getListingTimeLabel,
} from "@/lib/listings";

export function ListingDetailsStats() {
  const { endAt, listing, startAt } = useListingDetailsContext();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Current price
        </p>
        <p className="mt-2 text-xl font-semibold text-primary">
          {formatListingCurrency(listing.currentBid ?? 0)}
        </p>
      </div>
      <div className="rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Activity
        </p>
        <p className="mt-2 text-base font-semibold text-foreground">
          {formatBidCount(listing.bidCount)}
        </p>
      </div>
      <div className="rounded-2xl border border-border/70 bg-background/50 px-4 py-3">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Auction timing
        </p>
        <p className="mt-2 text-base font-semibold text-foreground">
          {getListingTimeLabel({ endAt, startAt, status: listing.status })}
        </p>
      </div>
    </div>
  );
}
