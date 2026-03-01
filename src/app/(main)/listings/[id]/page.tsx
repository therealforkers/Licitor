import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth-session";
import {
  formatBidCount,
  formatListingCurrency,
  getListingStatusTone,
  getListingTimeLabel,
} from "@/lib/listings";
import { cn } from "@/lib/utils";
import { getListingById } from "@/server/queries/listings";

type ListingDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailsPage({
  params,
}: ListingDetailsPageProps) {
  const { id } = await params;
  const [listing, session] = await Promise.all([
    getListingById(id),
    getCurrentSession(),
  ]);

  if (!listing) {
    notFound();
  }

  if (listing.status === "Draft" && session?.user?.id !== listing.sellerId) {
    notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-primary">
            Listing details
          </p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            {listing.title}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Seller {listing.seller.name} is reviewing this draft before the full
            seller controls ship in phase 1G and 1H.
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "w-fit border px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em]",
            getListingStatusTone(listing.status),
          )}
        >
          {listing.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <Card className="overflow-hidden border-border/70 bg-card/95 py-0">
          <div className="relative aspect-[4/3] border-b border-border/70 bg-background/60">
            <Image
              alt={listing.title}
              className="object-cover"
              fill
              priority
              src={
                listing.images[0]?.url ?? "https://picsum.photos/id/1/1200/900"
              }
            />
          </div>
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Current bid
                </p>
                <p className="mt-2 text-2xl font-semibold text-primary">
                  {formatListingCurrency(listing.currentBid)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Starting bid
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {formatListingCurrency(listing.startingBid)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Timing
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {getListingTimeLabel({
                    endAt: listing.endAt,
                    startAt: listing.startAt,
                    status: listing.status,
                  })}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Category
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {listing.category}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Condition
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {listing.condition}
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
                  Activity
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {formatBidCount(listing.bidCount)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                Description
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                {listing.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit border-border/70 bg-card/95 py-0">
          <CardHeader className="gap-3 px-6 py-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              Phase 1F checkpoint
            </p>
            <CardTitle className="text-2xl">
              Draft created from the uploaded image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <p className="text-sm text-muted-foreground">
              This page confirms the signed upload completed, the placeholder
              listing draft was inserted, and the redirect landed on a
              seller-visible details route.
            </p>
            <p className="text-sm text-muted-foreground">
              Image rows stored: {listing.images.length}. Main image public id:{" "}
              {listing.images[0]?.publicId ?? "not set"}.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
