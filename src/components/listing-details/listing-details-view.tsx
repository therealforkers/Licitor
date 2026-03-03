"use client";

import { ListingDetailsProvider } from "@/components/listing-details/listing-details-context";
import { ListingDetailsHeader } from "@/components/listing-details/listing-details-header";
import { ListingDetailsMeta } from "@/components/listing-details/listing-details-meta";
import { ListingDetailsSidebar } from "@/components/listing-details/listing-details-sidebar";
import { ListingDetailsStats } from "@/components/listing-details/listing-details-stats";
import { ListingImageHero } from "@/components/listing-details/listing-image-hero";
import { ListingImageThumbnailStrip } from "@/components/listing-details/listing-image-thumbnail-strip";
import { Card, CardContent } from "@/components/ui/card";
import type { ListingDetailsDto } from "@/types/listings";

type ListingDetailsViewProps = {
  isOwner: boolean;
  listing: ListingDetailsDto;
};

function ListingDetailsContent() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12">
      <ListingDetailsHeader />
      <ListingDetailsStats />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="gap-0 overflow-hidden border-border/70 bg-card/95 py-0 lg:col-span-3">
          <ListingImageHero />
          <ListingImageThumbnailStrip />

          <CardContent className="space-y-6 p-6">
            <ListingDetailsMeta />
          </CardContent>
        </Card>

        <ListingDetailsSidebar />
      </div>
    </section>
  );
}

export function ListingDetailsView({
  isOwner,
  listing,
}: ListingDetailsViewProps) {
  return (
    <ListingDetailsProvider isOwner={isOwner} listing={listing}>
      <ListingDetailsContent />
    </ListingDetailsProvider>
  );
}
