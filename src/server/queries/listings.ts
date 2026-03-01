import { db } from "@/lib/db/client";

export const getListings = async () => {
  return db.query.listings.findMany({
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
