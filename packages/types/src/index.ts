/**
 * Shared types for yoik.me API.
 */

/** Author information derived from a user ID. */
export interface Author {
  uid: string
  color: string
  username: string
}

/** A post as returned by the API. */
export interface Post {
  postId: string
  body: string
  published: string
  author: Author
}

/** A comment as returned by the API. */
export interface Comment {
  commentId: string
  postId: string
  body: string
  published: string
  author: Author
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[]
  cursor?: string
}

/** Request body for creating a post. */
export interface CreatePostRequest {
  body: string
}

/** Request body for creating a comment. */
export interface CreateCommentRequest {
  body: string
}

/** SSE event types. */
export type PostEvent = { type: "new-post"; data: Post }
export type CommentEvent = { type: "new-comment"; data: Comment }
