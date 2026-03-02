import { describe, expect, it } from "vitest";

import {
  clampSelectedImageIndex,
  createInitialListingDetailsState,
  hasReachedListingImageLimit,
  listingDetailsReducer,
} from "@/components/listings/listing-details-view-state";

describe("listing details hook helpers", () => {
  it("keeps selected image index in range after image removal", () => {
    const initial = createInitialListingDetailsState([
      { id: "img-1", isMain: true, url: "https://example.com/1.jpg" },
      { id: "img-2", isMain: false, url: "https://example.com/2.jpg" },
      { id: "img-3", isMain: false, url: "https://example.com/3.jpg" },
    ]);
    const selected = listingDetailsReducer(initial, {
      type: "selected-image/set",
      index: 2,
    });
    const afterDelete = listingDetailsReducer(selected, {
      type: "delete/success",
      imageId: "img-3",
    });

    expect(afterDelete.images.map((image) => image.id)).toEqual([
      "img-1",
      "img-2",
    ]);
    expect(afterDelete.selectedImageIndex).toBe(1);
    expect(clampSelectedImageIndex(0, 3)).toBe(0);
  });

  it("tracks upload progress and returns to idle after success", () => {
    const initial = createInitialListingDetailsState([
      { id: "img-1", isMain: true, url: "https://example.com/1.jpg" },
    ]);

    const started = listingDetailsReducer(initial, { type: "upload/start" });
    const progressed = listingDetailsReducer(started, {
      type: "upload/progress",
      progress: 42,
    });
    const processing = listingDetailsReducer(progressed, {
      type: "upload/processing",
    });
    const done = listingDetailsReducer(processing, {
      type: "upload/success",
      image: {
        id: "img-2",
        isMain: false,
        url: "https://example.com/2.jpg",
      },
    });

    expect(started.isUploading).toBe(true);
    expect(progressed.uploadProgress).toBe(42);
    expect(processing.uploadProgress).toBe(100);
    expect(done.isUploading).toBe(false);
    expect(done.uploadProgress).toBe(0);
    expect(done.images.map((image) => image.id)).toEqual(["img-1", "img-2"]);
  });

  it("enforces max image count at 5", () => {
    expect(hasReachedListingImageLimit(4)).toBe(false);
    expect(hasReachedListingImageLimit(5)).toBe(true);
    expect(hasReachedListingImageLimit(9)).toBe(true);
  });

  it("updates main image flag without changing image order", () => {
    const initial = createInitialListingDetailsState([
      { id: "img-1", isMain: true, url: "https://example.com/1.jpg" },
      { id: "img-2", isMain: false, url: "https://example.com/2.jpg" },
      { id: "img-3", isMain: false, url: "https://example.com/3.jpg" },
    ]);

    const next = listingDetailsReducer(initial, {
      type: "set-main/success",
      imageId: "img-3",
    });

    expect(next.images.map((image) => image.id)).toEqual([
      "img-1",
      "img-2",
      "img-3",
    ]);
    expect(next.images.map((image) => image.isMain)).toEqual([
      false,
      false,
      true,
    ]);
  });
});
