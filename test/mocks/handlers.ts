import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("https://api.licitor.test/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),
];
