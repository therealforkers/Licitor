import { notFound } from "next/navigation";

import { ListingDetailsView } from "@/components/listings/listing-details-view";
import { getCurrentSession } from "@/lib/auth-session";
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

  const isOwner = session?.user?.id === listing.sellerId;

  if (listing.status === "Draft" && !isOwner) {
    notFound();
  }

  return (
    <ListingDetailsView
      bidCount={listing.bidCount}
      category={listing.category}
      condition={listing.condition}
      currentBid={listing.currentBid}
      description={listing.description}
      endAt={listing.endAt}
      id={listing.id}
      images={listing.images.map((image) => ({
        id: image.id,
        isMain: image.isMain,
        url: image.url,
      }))}
      isOwner={isOwner}
      location={listing.location}
      reservePrice={listing.reservePrice}
      sellerName={listing.seller.name}
      startAt={listing.startAt}
      startingBid={listing.startingBid}
      status={listing.status}
      title={listing.title}
    />
  );
}
