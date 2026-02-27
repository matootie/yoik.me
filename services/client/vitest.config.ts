import { defineConfig } from "vitest/config"
import paths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [paths({ root: "../" })],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
