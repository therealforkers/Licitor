import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes and keeps the last conflicting utility", () => {
    expect(cn("px-2", "text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("filters falsy values via clsx before merge", () => {
    expect(
      cn("font-semibold", false && "hidden", null, undefined, "italic"),
    ).toBe("font-semibold italic");
  });
});
