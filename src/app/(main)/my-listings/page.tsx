import { MyListingsTabs } from "@/components/my-listings/my-listings-tabs";
import { requireCurrentUserSession } from "@/lib/auth-session";
import type { ListingStatus } from "@/lib/db/schema";
import { getListingsBySellerId } from "@/server/queries/listings";

const validStatuses = new Set<ListingStatus>([
  "Draft",
  "Active",
  "Scheduled",
  "Ended",
]);

type MyListingsPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function MyListingsPage({
  searchParams,
}: MyListingsPageProps) {
  const session = await requireCurrentUserSession();

  const resolvedSearchParams = await searchParams;
  const activeStatus = validStatuses.has(
    resolvedSearchParams?.status as ListingStatus,
  )
    ? (resolvedSearchParams?.status as ListingStatus)
    : "Draft";
  const listingRows = await getListingsBySellerId(
    session.user.id,
    activeStatus,
  );

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-primary">
          Seller inventory
        </p>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          My listings
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Review only your auctions, split by drafts, live listings, scheduled
          launches, and completed sales.
        </p>
      </div>

      <MyListingsTabs
        initialStatus={activeStatus}
        listings={listingRows.map((listing) => ({
          id: listing.id,
          bidCount: listing.bidCount,
          currentBid: listing.currentBid,
          endAt: listing.endAt?.toISOString() ?? null,
          imageUrl: listing.images[0]?.url ?? null,
          sellerName: listing.seller.name,
          startAt: listing.startAt?.toISOString() ?? null,
          title: listing.title,
        }))}
      />
    </section>
  );
}
