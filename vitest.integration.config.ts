import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "./vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ["test/integration/**/*.test.ts"],
      exclude: ["test/unit/**/*.test.ts"],
      setupFiles: ["test/integration/setup.ts"],
    },
  }),
);
