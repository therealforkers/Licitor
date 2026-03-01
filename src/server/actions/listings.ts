"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUserSession } from "@/lib/auth-session";
import { db } from "@/lib/db/client";
import { listingImages, listings } from "@/lib/db/schema";

const createDraftListingSchema = z.object({
  imageUrl: z.string().url("A hosted image URL is required."),
  publicId: z.string().min(1, "A Cloudinary public id is required."),
});

const buildPlaceholderDraft = () => {
  return {
    category: "Other" as const,
    condition: "Good" as const,
    description:
      "Phase 1F creates this draft from placeholder JSON after the signed Cloudinary upload completes. AI-generated listing details will replace this stub in a later phase.",
    location: "Seller review pending",
    reservePrice: 22000,
    startingBid: 15000,
    title: "Draft listing awaiting refinement",
  };
};

export const createDraftListingAction = async (input: {
  imageUrl: string;
  publicId: string;
}) => {
  const session = await requireCurrentUserSession();
  const parsed = createDraftListingSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid listing draft payload.",
    );
  }

  const draftValues = buildPlaceholderDraft();
  const listingId = randomUUID();
  const listingImageId = randomUUID();
  const now = new Date();

  db.transaction((tx) => {
    tx.insert(listings)
      .values({
        id: listingId,
        sellerId: session.user.id,
        title: draftValues.title,
        description: draftValues.description,
        category: draftValues.category,
        condition: draftValues.condition,
        reservePrice: draftValues.reservePrice,
        startingBid: draftValues.startingBid,
        currentBid: draftValues.startingBid,
        bidCount: 0,
        startAt: null,
        endAt: null,
        status: "Draft",
        location: draftValues.location,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    tx.insert(listingImages)
      .values({
        id: listingImageId,
        listingId,
        url: parsed.data.imageUrl,
        publicId: parsed.data.publicId,
        isMain: true,
        createdAt: now,
      })
      .run();
  });

  revalidatePath("/listings");
  revalidatePath("/my-listings");
  revalidatePath(`/listings/${listingId}`);

  return { id: listingId };
};
