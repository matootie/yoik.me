/**
 * Posts endpoint e2e tests.
 *
 * Tests the full lifecycle of posts: listing, creation (auth-gated),
 * single-post retrieval, pagination, and error handling.
 *
 * NOTE: POST endpoints require a valid Firebase auth token. Tests that
 * create resources are skipped when E2E_AUTH_TOKEN is not set, allowing
 * the read-only suite to run against any environment without credentials.
 */

import { describe, it, expect } from "vitest"
import { api, uniqueId } from "./helpers"

const AUTH_TOKEN = process.env.E2E_AUTH_TOKEN

describe("GET /api/posts", () => {
  it("returns 200 with paginated response shape", async () => {
    const res = await api("/api/posts")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty("items")
    expect(Array.isArray(body.items)).toBe(true)
  })

  it("respects the limit query parameter", async () => {
    const res = await api("/api/posts?limit=2")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.items.length).toBeLessThanOrEqual(2)
  })

  it("returns posts with expected schema", async () => {
    const res = await api("/api/posts?limit=1")
    const body = await res.json()
    if (body.items.length > 0) {
      const post = body.items[0]
      expect(post).toHaveProperty("postId")
      expect(post).toHaveProperty("body")
      expect(post).toHaveProperty("published")
      expect(post).toHaveProperty("author")
      expect(post.author).toHaveProperty("uid")
      expect(post.author).toHaveProperty("color")
      expect(post.author).toHaveProperty("username")
    }
  })

  it("supports cursor-based pagination", async () => {
    const first = await api("/api/posts?limit=1")
    const firstBody = await first.json()
    if (firstBody.cursor) {
      const second = await api(`/api/posts?limit=1&cursor=${firstBody.cursor}`)
      expect(second.status).toBe(200)
      const secondBody = await second.json()
      expect(Array.isArray(secondBody.items)).toBe(true)
      if (secondBody.items.length > 0) {
        expect(secondBody.items[0].postId).not.toBe(firstBody.items[0].postId)
      }
    }
  })
})

describe("GET /api/posts/:id", () => {
  it("returns 404 for a nonexistent post", async () => {
    const res = await api("/api/posts/nonexistent-id-12345")
    expect(res.status).toBe(404)
  })

  it("returns a valid post when one exists", async () => {
    const list = await api("/api/posts?limit=1")
    const listBody = await list.json()
    if (listBody.items.length > 0) {
      const id = listBody.items[0].postId
      const res = await api(`/api/posts/${id}`)
      expect(res.status).toBe(200)
      const post = await res.json()
      expect(post.postId).toBe(id)
    }
  })
})

describe("POST /api/posts", () => {
  /**
   * These tests verify POST requests are handled without 5xx errors.
   * Issue #33 reported 502 responses on POST — these catch regressions.
   * 60s timeout accommodates Cloud Functions cold starts.
   */
  it("returns 401 without an auth token (not 5xx)", async () => {
    const res = await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({ body: "should fail" }),
    })
    expect(res.status).toBeLessThan(500)
    expect(res.status).toBe(401)
  }, 60_000)

  it("returns 401 with an invalid auth token (not 5xx)", async () => {
    const res = await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({ body: "should fail" }),
      headers: { Authorization: "Bearer invalid-token" },
    })
    expect(res.status).toBeLessThan(500)
    expect(res.status).toBe(401)
  }, 60_000)

  it.skipIf(!AUTH_TOKEN)(
    "creates a post with a valid auth token",
    async () => {
      const content = `Test post ${uniqueId()}`
      const res = await api("/api/posts", {
        method: "POST",
        body: JSON.stringify({ body: content }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      // Critical regression test for issue #33.
      expect(res.status).toBeLessThan(500)
      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body).toHaveProperty("postId")
    },
    60_000
  )

  it.skipIf(!AUTH_TOKEN)(
    "returns 400 for an empty post body",
    async () => {
      const res = await api("/api/posts", {
        method: "POST",
        body: JSON.stringify({ body: "" }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      expect(res.status).toBe(400)
    },
    60_000
  )

  it.skipIf(!AUTH_TOKEN)(
    "returns 400 for a whitespace-only post body",
    async () => {
      const res = await api("/api/posts", {
        method: "POST",
        body: JSON.stringify({ body: "   " }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      expect(res.status).toBe(400)
    },
    60_000
  )
})
