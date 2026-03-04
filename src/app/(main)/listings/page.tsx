import { PublicListingsTabs } from "@/components/listings/public-listings-tabs";
import { PageHeader } from "@/components/shared/page-header";
import type { ListingStatus } from "@/lib/db/schema";
import { getPublicListings } from "@/server/queries/listings";

const validStatuses = new Set<ListingStatus>(["Active", "Scheduled", "Ended"]);

type ListingsPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeStatus = validStatuses.has(
    resolvedSearchParams?.status as ListingStatus,
  )
    ? (resolvedSearchParams?.status as Exclude<ListingStatus, "Draft">)
    : "Active";

  const listingRows = await getPublicListings(activeStatus);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <PageHeader
        eyebrow="Public marketplace"
        title="Browse live and upcoming auctions"
        description="Explore the seeded marketplace inventory, from active bidding wars to scheduled launches waiting for their opening bid."
      />

      <PublicListingsTabs initialStatus={activeStatus} listings={listingRows} />
    </section>
  );
}
