"use client";

import { useListingDetailsContext } from "@/components/listing-details/listing-details-context";
import { ListingImageUploadPanel } from "@/components/listing-details/listing-image-upload-panel";
import { ListingSellerControls } from "@/components/listing-details/listing-seller-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ListingDetailsSidebar() {
  const { isOwner, listing } = useListingDetailsContext();

  return (
    <div className="space-y-4 lg:col-span-2">
      <Card className="h-fit border-border/70 bg-card/95 py-0">
        <CardHeader className="gap-3 px-6 pt-6 pb-3">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">
            {isOwner ? "Seller controls" : "Bid controls"}
          </p>
          <CardTitle className="text-2xl">
            {isOwner ? "Manage your listing" : "Bidding tools arrive next"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6 pt-0">
          {isOwner ? (
            <ListingSellerControls listing={listing} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                This listing belongs to {listing.sellerName}. Phase 3 will
                replace this placeholder with live bid entry, current bid
                validation, and real-time updates.
              </p>
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Bidder state
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  Read-only auction context for non-owners.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isOwner ? (
        <Card className="border-border/70 bg-card/95 py-0">
          <CardHeader className="gap-2 px-6 pt-6 pb-3">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Listing images
            </p>
            <CardTitle className="text-xl">Upload and manage gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-0">
            <ListingImageUploadPanel />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
