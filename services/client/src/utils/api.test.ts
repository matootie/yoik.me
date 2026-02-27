/**
 * Tests for the API client utilities.
 *
 * The `resolveApiBase` function is exported specifically for testability —
 * it encapsulates the env-var-to-URL logic without requiring module
 * reloads or Vite env stubbing.
 */

import { describe, it, expect } from "vitest"
import { resolveApiBase } from "./api"

describe("resolveApiBase", () => {
  it("uses CLIENT_API_URL when provided, regardless of mode", () => {
    expect(
      resolveApiBase({ CLIENT_API_URL: "https://staging.example.com" })
    ).toBe("https://staging.example.com")
    expect(
      resolveApiBase({
        CLIENT_API_URL: "https://staging.example.com",
        PROD: true,
      })
    ).toBe("https://staging.example.com")
    expect(
      resolveApiBase({
        CLIENT_API_URL: "https://staging.example.com",
        PROD: false,
      })
    ).toBe("https://staging.example.com")
  })

  it("returns empty string in production (relative URLs for Firebase Hosting rewrites)", () => {
    expect(resolveApiBase({ PROD: true })).toBe("")
  })

  it("returns localhost dev server URL in development", () => {
    expect(resolveApiBase({ PROD: false })).toBe("http://localhost:3001")
    expect(resolveApiBase({})).toBe("http://localhost:3001")
  })

  it("respects explicit empty string (forces relative URLs in any mode)", () => {
    expect(resolveApiBase({ CLIENT_API_URL: "", PROD: false })).toBe("")
    expect(resolveApiBase({ CLIENT_API_URL: "" })).toBe("")
  })
})
