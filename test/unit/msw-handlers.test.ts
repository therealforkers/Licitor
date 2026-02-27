import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { mswServer } from "../setup.unit";

describe("msw handlers", () => {
  it("uses baseline handlers from test/mocks", async () => {
    const response = await fetch("https://api.licitor.test/health");
    const body = (await response.json()) as { status: string };

    expect(response.ok).toBe(true);
    expect(body.status).toBe("ok");
  });

  it("supports per-test overrides", async () => {
    mswServer.use(
      http.get("https://api.licitor.test/health", () => {
        return HttpResponse.json({ status: "degraded" });
      }),
    );

    const response = await fetch("https://api.licitor.test/health");
    const body = (await response.json()) as { status: string };

    expect(body.status).toBe("degraded");
  });
});
