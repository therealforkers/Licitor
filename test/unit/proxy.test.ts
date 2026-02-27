import { describe, expect, it } from "vitest";

import { getAuthRouteRedirect } from "@/lib/auth-routing";

describe("auth proxy route decisions", () => {
  it("redirects unauthenticated users from profile to sign-in", () => {
    expect(getAuthRouteRedirect("/profile", false)).toBe("/login");
    expect(getAuthRouteRedirect("/profile/edit", false)).toBe("/login");
  });

  it("does not redirect authenticated users from profile", () => {
    expect(getAuthRouteRedirect("/profile", true)).toBeNull();
  });

  it("redirects authenticated users from sign-in/register to profile", () => {
    expect(getAuthRouteRedirect("/login", true)).toBe("/profile");
    expect(getAuthRouteRedirect("/register", true)).toBe("/profile");
  });

  it("does not redirect public routes", () => {
    expect(getAuthRouteRedirect("/", false)).toBeNull();
    expect(getAuthRouteRedirect("/listings", true)).toBeNull();
  });
});
