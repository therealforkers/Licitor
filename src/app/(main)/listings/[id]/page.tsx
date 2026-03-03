import { notFound } from "next/navigation";

import { ListingDetailsView } from "@/components/listing-details/listing-details-view";
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

  return <ListingDetailsView isOwner={isOwner} listing={listing} />;
}
