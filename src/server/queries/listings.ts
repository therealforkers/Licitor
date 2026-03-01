import { db } from "@/lib/db/client";
import type { ListingStatus } from "@/lib/db/schema";

export const getPublicListings = async () => {
  return db.query.listings.findMany({
    where: (listing, { ne }) => ne(listing.status, "Draft"),
    with: {
      images: {
        where: (images, { eq }) => eq(images.isMain, true),
        orderBy: (images, { desc: orderDesc }) => [orderDesc(images.createdAt)],
      },
      seller: true,
    },
    orderBy: (listing, { desc }) => [desc(listing.createdAt)],
  });
};

export const getListingsBySellerId = async (
  sellerId: string,
  status?: ListingStatus,
) => {
  return db.query.listings.findMany({
    where: (listing, { and, eq }) =>
      status
        ? and(eq(listing.sellerId, sellerId), eq(listing.status, status))
        : eq(listing.sellerId, sellerId),
    with: {
      images: {
        where: (images, { eq }) => eq(images.isMain, true),
        orderBy: (images, { desc: orderDesc }) => [orderDesc(images.createdAt)],
      },
      seller: true,
    },
    orderBy: (listing, { desc }) => [desc(listing.createdAt)],
  });
};
