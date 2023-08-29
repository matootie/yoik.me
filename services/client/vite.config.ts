/**
 * Vite configuration.
 */

// Standard imports.
import { join } from "path"

// External imports.
import { defineConfig } from "vite"
// Plugin imports.
import react from "@vitejs/plugin-react-swc"
import paths from "vite-tsconfig-paths"

/**
 * Exported configuration.
 */
export default defineConfig({
  root: join(__dirname, "./src"),
  envDir: ".",
  envPrefix: "CLIENT_",
  publicDir: join(__dirname, "./public"),
  clearScreen: false,
  logLevel: "info",
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: join(__dirname, "./dist"),
    emptyOutDir: true,
    sourcemap: true,
    manifest: true,
  },
  plugins: [react(), paths({ root: "../" })],
})
