// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: "./docs/coverage",
      provider: "istanbul",
    },
  },
});
