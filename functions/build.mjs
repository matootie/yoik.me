/**
 * Bundle the Cloud Functions entry point using esbuild.
 *
 * Produces functions/lib/index.js — a single CommonJS bundle
 * that Firebase CLI can deploy without workspace resolution.
 */

import { build } from "esbuild"

await build({
  entryPoints: ["../services/api/src/functions.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "lib/index.js",
  format: "cjs",
  sourcemap: true,
  external: ["firebase-admin", "firebase-functions"],
})

console.log("Functions bundled to functions/lib/index.js")
