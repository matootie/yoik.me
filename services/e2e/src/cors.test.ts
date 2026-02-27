/**
 * CORS and HTTP edge-case tests.
 *
 * Ensures the API handles cross-origin requests and malformed input
 * without returning 5xx errors (regression coverage for #33).
 */

import { describe, it, expect } from "vitest"
import { api } from "./helpers"

describe("CORS headers", () => {
  it("includes CORS headers on API responses", async () => {
    const res = await api("/api/posts?limit=1")
    expect(res.headers.get("access-control-allow-origin")).toBeTruthy()
  })
})

describe("HTTP edge cases", () => {
  it("returns 404 for unknown API routes", async () => {
    const res = await api("/api/nonexistent-route")
    expect(res.status).toBe(404)
  })

  it("handles POST with various content types without 5xx", async () => {
    const res = await api("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "body=test",
    })
    expect(res.status).toBeLessThan(500)
  }, 60_000)

  it("handles POST with empty body without 5xx", async () => {
    const res = await api("/api/posts", {
      method: "POST",
      body: "",
    })
    expect(res.status).toBeLessThan(500)
  }, 60_000)
})
