import { describe, expect, it } from "vitest";

import {
  getListingPriceCeilingCents,
  parseListingCategoryFilter,
  parseListingConditionFilter,
  parseListingPriceFilter,
  parseListingSearchTerm,
  parseListingSortOption,
  parsePublicBrowseStatus,
} from "@/lib/listing-browse";

describe("listing browse helpers", () => {
  it("parses supported browse params and falls back safely", () => {
    expect(parsePublicBrowseStatus("Scheduled")).toBe("Scheduled");
    expect(parsePublicBrowseStatus("Draft")).toBe("Active");

    expect(parseListingCategoryFilter("Electronics")).toBe("Electronics");
    expect(parseListingCategoryFilter("Unknown")).toBeUndefined();

    expect(parseListingConditionFilter("LikeNew")).toBe("LikeNew");
    expect(parseListingConditionFilter("Damaged")).toBeUndefined();

    expect(parseListingPriceFilter("100")).toBe("100");
    expect(parseListingPriceFilter("150")).toBeUndefined();

    expect(parseListingSortOption("most-bids")).toBe("most-bids");
    expect(parseListingSortOption("random")).toBeUndefined();
  });

  it("normalizes array params and trims search text", () => {
    expect(parsePublicBrowseStatus(["Ended", "Active"])).toBe("Ended");
    expect(parseListingSearchTerm("  optics  ")).toBe("optics");
    expect(parseListingSearchTerm("   ")).toBeUndefined();
  });

  it("maps price filters to cents ceilings", () => {
    expect(getListingPriceCeilingCents("10")).toBe(1_000);
    expect(getListingPriceCeilingCents("50")).toBe(5_000);
    expect(getListingPriceCeilingCents("500")).toBe(50_000);
    expect(getListingPriceCeilingCents()).toBeUndefined();
  });
});
