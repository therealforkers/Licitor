import { MyListingsTabs } from "@/components/my-listings/my-listings-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentUserSession } from "@/lib/auth-session";
import type { ListingStatus } from "@/lib/db/schema";
import {
  buildListingPaginationMeta,
  parseListingPage,
  parseListingPageSize,
} from "@/lib/listing-browse";
import { getListingsBySellerId } from "@/server/queries/listings";

const validStatuses = new Set<ListingStatus>([
  "Draft",
  "Active",
  "Scheduled",
  "Ended",
]);

type MyListingsPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    pageSize?: string | string[];
    status?: string | string[];
  }>;
};

export default async function MyListingsPage({
  searchParams,
}: MyListingsPageProps) {
  const session = await requireCurrentUserSession();

  const resolvedSearchParams = await searchParams;
  const rawStatus = Array.isArray(resolvedSearchParams?.status)
    ? resolvedSearchParams?.status[0]
    : resolvedSearchParams?.status;
  const activeStatus = validStatuses.has(rawStatus as ListingStatus)
    ? (rawStatus as ListingStatus)
    : "Draft";
  const page = parseListingPage(resolvedSearchParams?.page);
  const pageSize = parseListingPageSize(resolvedSearchParams?.pageSize);
  const listingRows = await getListingsBySellerId(
    session.user.id,
    activeStatus,
  );
  const pagination = buildListingPaginationMeta({
    page,
    pageSize,
    totalCount: listingRows.length,
  });
  const paginatedListings = listingRows.slice(
    pagination.offset,
    pagination.offset + pagination.pageSize,
  );

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <PageHeader
        eyebrow="Seller inventory"
        title="My listings"
        description="Review only your auctions, split by drafts, live listings, scheduled launches, and completed sales."
      />

      <MyListingsTabs
        initialStatus={activeStatus}
        listings={paginatedListings}
        pagination={pagination}
      />
    </section>
  );
}
