import { describe, it, expect } from "vitest"
import type { Post, Comment, PaginatedResponse } from "./index"

describe("types", () => {
  it("Post type is structurally valid", () => {
    const post: Post = {
      postId: "123",
      body: "hello",
      published: new Date().toISOString(),
      author: { uid: "u1", color: "#000000", username: "Test User" },
    }
    expect(post.postId).toBe("123")
  })

  it("PaginatedResponse works with generics", () => {
    const response: PaginatedResponse<Post> = {
      items: [],
      cursor: undefined,
    }
    expect(response.items).toHaveLength(0)
  })

  it("Comment type is structurally valid", () => {
    const comment: Comment = {
      commentId: "c1",
      postId: "p1",
      body: "nice",
      published: new Date().toISOString(),
      author: { uid: "u1", color: "#ff0000", username: "Cool Cat" },
    }
    expect(comment.commentId).toBe("c1")
  })
})
