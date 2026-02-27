/**
 * Comments endpoint e2e tests.
 *
 * Tests listing and creating comments on posts, including auth
 * requirements, validation, and error handling.
 */

import { describe, it, expect, beforeAll } from "vitest"
import { api, uniqueId } from "./helpers"

const AUTH_TOKEN = process.env.E2E_AUTH_TOKEN

/** Fetches the first available post ID, or undefined if none exist. */
async function getFirstPostId(): Promise<string | undefined> {
  const res = await api("/api/posts?limit=1")
  const body = await res.json()
  return body.items[0]?.postId
}

describe("GET /api/posts/:postId/comments", () => {
  let postId: string | undefined

  beforeAll(async () => {
    postId = await getFirstPostId()
  })

  it("returns paginated response for an existing post", async () => {
    if (!postId) return
    const res = await api(`/api/posts/${postId}/comments`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty("items")
    expect(Array.isArray(body.items)).toBe(true)
  })

  it("returns comments with expected schema", async () => {
    if (!postId) return
    const res = await api(`/api/posts/${postId}/comments?limit=1`)
    const body = await res.json()
    if (body.items.length > 0) {
      const comment = body.items[0]
      expect(comment).toHaveProperty("commentId")
      expect(comment).toHaveProperty("postId", postId)
      expect(comment).toHaveProperty("body")
      expect(comment).toHaveProperty("published")
      expect(comment).toHaveProperty("author")
    }
  })
})

describe("POST /api/posts/:postId/comments", () => {
  let postId: string | undefined

  beforeAll(async () => {
    postId = await getFirstPostId()
  })

  it("returns 401 without an auth token (not 5xx)", async () => {
    if (!postId) return
    const res = await api(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: "should fail" }),
    })
    expect(res.status).toBeLessThan(500)
    expect(res.status).toBe(401)
  }, 60_000)

  it("returns 401 with an invalid auth token (not 5xx)", async () => {
    if (!postId) return
    const res = await api(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: "should fail" }),
      headers: { Authorization: "Bearer invalid-token" },
    })
    expect(res.status).toBeLessThan(500)
    expect(res.status).toBe(401)
  }, 60_000)

  it.skipIf(!AUTH_TOKEN)(
    "returns 404 for a nonexistent post",
    async () => {
      const res = await api("/api/posts/nonexistent-id-12345/comments", {
        method: "POST",
        body: JSON.stringify({ body: "orphaned comment" }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      expect(res.status).toBe(404)
    },
    60_000
  )

  it.skipIf(!AUTH_TOKEN)(
    "creates a comment with a valid auth token",
    async () => {
      if (!postId) return
      const content = `Test comment ${uniqueId()}`
      const res = await api(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: content }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      expect(res.status).toBeLessThan(500)
      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body).toHaveProperty("commentId")
    },
    60_000
  )

  it.skipIf(!AUTH_TOKEN)(
    "returns 400 for an empty comment body",
    async () => {
      if (!postId) return
      const res = await api(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: "" }),
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      expect(res.status).toBe(400)
    },
    60_000
  )
})
