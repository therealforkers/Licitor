import { afterEach, beforeEach } from "vitest";

import { sqlite } from "@/lib/db/client";

export const withTestTransaction = () => {
  beforeEach(() => {
    sqlite.exec("BEGIN TRANSACTION");
  });

  afterEach(() => {
    sqlite.exec("ROLLBACK");
  });
};
