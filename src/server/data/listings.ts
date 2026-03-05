import { and, eq, like, ne, or, type SQL, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import type { ListingStatus } from "@/lib/db/schema";
import { listingImages, listings } from "@/lib/db/schema";
import type { ListingSortOption } from "@/lib/listing-browse";
import type { UpdateListingDraftValues } from "@/lib/validators/listings";
import type {
  ListingDetailsDto,
  ListingSummaryDto,
  OwnedListingForEditDto,
} from "@/types/listings";

export type PublicListingStatus = Exclude<ListingStatus, "Draft">;

const toIsoDate = (value: Date | null) => {
  return value ? value.toISOString() : null;
};

type QueryPagination = {
  limit: number;
  offset: number;
};

type GetPublicListingsDataOptions = {
  category?: (typeof listings.$inferSelect)["category"];
  condition?: (typeof listings.$inferSelect)["condition"];
  pagination?: QueryPagination;
  priceCeilingCents?: number;
  searchQuery?: string;
  sort?: ListingSortOption;
  status?: PublicListingStatus;
};

type GetPublicListingsCountDataOptions = Omit<
  GetPublicListingsDataOptions,
  "pagination" | "sort"
>;

const buildPublicListingsWhereClause = (
  options: GetPublicListingsCountDataOptions,
) => {
  let whereClause: SQL = ne(listings.status, "Draft");
  const appendFilter = (nextFilter: SQL) => {
    const merged = and(whereClause, nextFilter);
    whereClause = merged ?? whereClause;
  };

  if (options.status) {
    appendFilter(eq(listings.status, options.status));
  }

  if (options.category) {
    appendFilter(eq(listings.category, options.category));
  }

  if (options.condition) {
    appendFilter(eq(listings.condition, options.condition));
  }

  if (options.priceCeilingCents !== undefined) {
    appendFilter(
      sql`coalesce(${listings.currentBid}, 0) < ${options.priceCeilingCents}`,
    );
  }

  if (options.searchQuery) {
    const wildcard = `%${options.searchQuery}%`;
    const searchClause = or(
      like(listings.title, wildcard),
      like(listings.description, wildcard),
    );

    if (searchClause) {
      appendFilter(searchClause);
    }
  }

  return whereClause;
};

export const getPublicListingSummariesData = async (
  options: GetPublicListingsDataOptions = {},
): Promise<ListingSummaryDto[]> => {
  const whereClause = buildPublicListingsWhereClause(options);
  const rows = await db.query.listings.findMany({
    columns: {
      id: true,
      title: true,
      status: true,
      bidCount: true,
      currentBid: true,
      startAt: true,
      endAt: true,
    },
    with: {
      images: {
        columns: {
          url: true,
        },
        where: (images, { eq }) => eq(images.isMain, true),
        orderBy: (images, { desc: orderDesc }) => [orderDesc(images.createdAt)],
        limit: 1,
      },
      seller: {
        columns: {
          name: true,
        },
      },
    },
    where: whereClause,
    limit: options.pagination?.limit,
    offset: options.pagination?.offset,
    orderBy: (listing, { asc, desc }) => {
      switch (options.sort) {
        case "ending-soonest":
          return [
            asc(sql<number>`coalesce(${listing.endAt}, 253402300799000)`),
            desc(listing.createdAt),
          ];
        case "most-bids":
          return [desc(listing.bidCount), desc(listing.createdAt)];
        case "price-low-high":
          return [
            asc(sql<number>`coalesce(${listing.currentBid}, 0)`),
            desc(listing.createdAt),
          ];
        case "price-high-low":
          return [
            desc(sql<number>`coalesce(${listing.currentBid}, 0)`),
            desc(listing.createdAt),
          ];
        default:
          return [desc(listing.createdAt)];
      }
    },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    bidCount: row.bidCount,
    currentBid: row.currentBid,
    startAt: toIsoDate(row.startAt),
    endAt: toIsoDate(row.endAt),
    sellerName: row.seller.name,
    imageUrl: row.images[0]?.url ?? null,
  }));
};

export const getPublicListingsCountData = async (
  options: GetPublicListingsCountDataOptions = {},
) => {
  const whereClause = buildPublicListingsWhereClause(options);
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(listings)
    .where(whereClause);

  return result?.count ?? 0;
};

type GetListingsBySellerIdDataOptions = {
  pagination?: QueryPagination;
  status?: ListingStatus;
};

const buildSellerListingsWhereClause = (
  sellerId: string,
  status?: ListingStatus,
) =>
  status
    ? and(eq(listings.sellerId, sellerId), eq(listings.status, status))
    : eq(listings.sellerId, sellerId);

export const getListingsBySellerIdSummariesData = async (
  sellerId: string,
  options: GetListingsBySellerIdDataOptions = {},
): Promise<ListingSummaryDto[]> => {
  const whereClause = buildSellerListingsWhereClause(sellerId, options.status);
  const rows = await db.query.listings.findMany({
    columns: {
      id: true,
      title: true,
      status: true,
      bidCount: true,
      currentBid: true,
      startAt: true,
      endAt: true,
    },
    with: {
      images: {
        columns: {
          url: true,
        },
        where: (images, { eq }) => eq(images.isMain, true),
        orderBy: (images, { desc: orderDesc }) => [orderDesc(images.createdAt)],
        limit: 1,
      },
      seller: {
        columns: {
          name: true,
        },
      },
    },
    where: whereClause,
    limit: options.pagination?.limit,
    offset: options.pagination?.offset,
    orderBy: (listing, { desc }) => [desc(listing.createdAt)],
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    bidCount: row.bidCount,
    currentBid: row.currentBid,
    startAt: toIsoDate(row.startAt),
    endAt: toIsoDate(row.endAt),
    sellerName: row.seller.name,
    imageUrl: row.images[0]?.url ?? null,
  }));
};

export const getListingsBySellerIdCountData = async (
  sellerId: string,
  status?: ListingStatus,
) => {
  const whereClause = buildSellerListingsWhereClause(sellerId, status);
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(listings)
    .where(whereClause);

  return result?.count ?? 0;
};

export const getListingDetailsDtoData = async (
  listingId: string,
): Promise<ListingDetailsDto | null> => {
  const row = await db.query.listings.findFirst({
    columns: {
      id: true,
      sellerId: true,
      title: true,
      description: true,
      category: true,
      condition: true,
      reservePrice: true,
      startingBid: true,
      currentBid: true,
      bidCount: true,
      startAt: true,
      endAt: true,
      status: true,
      location: true,
    },
    where: eq(listings.id, listingId),
    with: {
      images: {
        columns: {
          id: true,
          isMain: true,
          url: true,
        },
        orderBy: (images, { asc }) => [asc(images.createdAt)],
      },
      seller: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    sellerId: row.sellerId,
    title: row.title,
    description: row.description,
    category: row.category,
    condition: row.condition,
    reservePrice: row.reservePrice,
    startingBid: row.startingBid,
    currentBid: row.currentBid,
    bidCount: row.bidCount,
    startAt: toIsoDate(row.startAt),
    endAt: toIsoDate(row.endAt),
    status: row.status,
    location: row.location,
    sellerName: row.seller.name,
    images: row.images.map((image) => ({
      id: image.id,
      isMain: image.isMain,
      url: image.url,
    })),
  };
};

export const getOwnedListingForEditDtoData = async (
  listingId: string,
  sellerId: string,
): Promise<OwnedListingForEditDto | null> => {
  const row = await db.query.listings.findFirst({
    columns: {
      bidCount: true,
      currentBid: true,
      endAt: true,
      startAt: true,
      status: true,
    },
    where: (listing, { and, eq }) =>
      and(eq(listing.id, listingId), eq(listing.sellerId, sellerId)),
    with: {
      images: {
        columns: {
          id: true,
          publicId: true,
          isMain: true,
          url: true,
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return {
    bidCount: row.bidCount,
    currentBid: row.currentBid,
    endAt: row.endAt,
    startAt: row.startAt,
    status: row.status,
    images: row.images.map((image) => ({
      id: image.id,
      publicId: image.publicId,
      isMain: image.isMain,
      url: image.url,
    })),
  };
};

export const createDraftListingWithMainImageData = (input: {
  defaultEndAt: Date;
  draftValues: {
    category: "Other";
    condition: "Good";
    description: string;
    location: string;
    reservePrice: number;
    startingBid: number;
    title: string;
  };
  imageUrl: string;
  listingId: string;
  listingImageId: string;
  now: Date;
  publicId: string;
  sellerId: string;
  startingBid: number;
}) => {
  db.transaction((tx) => {
    tx.insert(listings)
      .values({
        id: input.listingId,
        sellerId: input.sellerId,
        title: input.draftValues.title,
        description: input.draftValues.description,
        category: input.draftValues.category,
        condition: input.draftValues.condition,
        reservePrice: input.draftValues.reservePrice,
        startingBid: input.startingBid,
        currentBid: input.startingBid,
        bidCount: 0,
        startAt: null,
        endAt: input.defaultEndAt,
        status: "Draft",
        location: input.draftValues.location,
        createdAt: input.now,
        updatedAt: input.now,
      })
      .run();

    tx.insert(listingImages)
      .values({
        id: input.listingImageId,
        listingId: input.listingId,
        url: input.imageUrl,
        publicId: input.publicId,
        isMain: true,
        createdAt: input.now,
      })
      .run();
  });
};

export const addListingImageData = (input: {
  createdAt: Date;
  id: string;
  imageUrl: string;
  listingId: string;
  publicId: string;
}) => {
  db.insert(listingImages)
    .values({
      id: input.id,
      listingId: input.listingId,
      url: input.imageUrl,
      publicId: input.publicId,
      isMain: false,
      createdAt: input.createdAt,
    })
    .run();
};

export const deleteListingImageData = (listingId: string, imageId: string) => {
  db.delete(listingImages)
    .where(
      and(
        eq(listingImages.id, imageId),
        eq(listingImages.listingId, listingId),
      ),
    )
    .run();
};

export const setMainListingImageData = (listingId: string, imageId: string) => {
  db.transaction((tx) => {
    tx.update(listingImages)
      .set({ isMain: false })
      .where(eq(listingImages.listingId, listingId))
      .run();

    tx.update(listingImages)
      .set({ isMain: true })
      .where(
        and(
          eq(listingImages.id, imageId),
          eq(listingImages.listingId, listingId),
        ),
      )
      .run();
  });
};

export const updateListingDraftData = (input: {
  currentBid: number | null;
  listingId: string;
  nextStartingBid: number;
  updatedAt: Date;
  values: UpdateListingDraftValues;
}) => {
  db.update(listings)
    .set({
      category: input.values.category,
      condition: input.values.condition,
      currentBid: input.currentBid,
      description: input.values.description,
      endAt: input.values.endAt,
      location: input.values.location,
      reservePrice: input.values.reservePrice,
      startAt: input.values.startAt,
      startingBid: input.nextStartingBid,
      status: "Draft",
      title: input.values.title,
      updatedAt: input.updatedAt,
    })
    .where(eq(listings.id, input.listingId))
    .run();
};

export const updateListingStatusData = (
  listingId: string,
  status: ListingStatus,
  updatedAt: Date,
) => {
  db.update(listings)
    .set({
      status,
      updatedAt,
    })
    .where(eq(listings.id, listingId))
    .run();
};

export const deleteListingBySellerData = (
  listingId: string,
  sellerId: string,
) => {
  db.delete(listings)
    .where(and(eq(listings.id, listingId), eq(listings.sellerId, sellerId)))
    .run();
};
