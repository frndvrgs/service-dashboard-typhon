/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./test/coverage",
      clean: true,
    },
  },
});
