import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./dev/qa/setup.ts"],
    include: ["dev/qa/**/*.test.ts", "dev/qa/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/services/**/*.ts", "src/lib/**/*.ts", "src/features/**/*.tsx"],
    },
  },
});
