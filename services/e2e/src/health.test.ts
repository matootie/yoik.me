/**
 * Health check and smoke tests.
 *
 * Verifies the API is reachable. The /health endpoint is only
 * available when hitting the API directly; in production, Firebase
 * Hosting routes /api/** to the function but /health serves the SPA.
 */

import { describe, it, expect } from "vitest"
import { api } from "./helpers"

describe("API reachability", () => {
  it("GET /api/posts returns 200", async () => {
    const res = await api("/api/posts?limit=1")
    expect(res.status).toBe(200)
  })

  it("responds with JSON content type", async () => {
    const res = await api("/api/posts?limit=1")
    expect(res.headers.get("content-type")).toContain("application/json")
  })
})
