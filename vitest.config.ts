import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
