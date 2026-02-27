/**
 * Post data providers — API-backed.
 */

import { apiFetch, apiEventSource } from "#utils/api"
import type { Post, PaginatedResponse } from "@yme/types"
import { getColor, getName } from "#utils/id"

/** Convert API Post (ISO string dates) to client Post (Date objects). */
export interface ClientPost {
  postId: string
  body: string
  published: Date
  author: { uid: string; color: string; username: string }
}

function toClientPost(post: Post): ClientPost {
  return {
    ...post,
    published: new Date(post.published),
  }
}

/**
 * Create a post.
 */
export interface CreatePostInput {
  body: string
  author: string
}
export interface CreatePostOutput {
  postId: string
}
export async function createPost({
  body,
}: CreatePostInput): Promise<CreatePostOutput> {
  const res = await apiFetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({ body }),
  })
  if (!res.ok) throw new Error("Failed to create post")
  return res.json()
}

/**
 * Get a single post.
 */
export interface GetPostInput {
  postId: string
}
export type GetPostPost = ClientPost
export interface GetPostOutput {
  item?: GetPostPost
}
export async function getPost({
  postId,
}: GetPostInput): Promise<GetPostOutput> {
  const res = await apiFetch(`/api/posts/${postId}`)
  if (!res.ok) return {}
  const post: Post = await res.json()
  return { item: toClientPost(post) }
}

/**
 * List a page of posts.
 */
export interface ListPostsInput {
  limit?: number
  cursor?: string
}
export type ListPostsPost = ClientPost
export interface ListPostsOutput {
  items: ListPostsPost[]
  cursor?: string
}
export async function listPosts({
  limit: l = 10,
  cursor,
}: ListPostsInput | undefined = {}): Promise<ListPostsOutput> {
  const params = new URLSearchParams({ limit: String(l) })
  if (cursor) params.set("cursor", cursor)
  const res = await apiFetch(`/api/posts?${params}`)
  if (!res.ok) throw new Error("Failed to list posts")
  const data: PaginatedResponse<Post> = await res.json()
  return {
    items: data.items.map(toClientPost),
    cursor: data.cursor,
  }
}

/**
 * Listen for new posts via SSE.
 */
export type ListenPostsPost = ClientPost
export interface ListenPostsInput {
  onData?: (data: ListenPostsPost[]) => void
  onNewData?: (data: ListenPostsPost) => void
}
export interface ListenPostsOutput {
  unsubscribe: () => void
}
export function listenPosts({
  onData,
  onNewData,
}: ListenPostsInput): ListenPostsOutput {
  const es = apiEventSource("/api/posts/live")

  es.addEventListener("new-post", (event) => {
    const post: Post = JSON.parse(event.data)
    const clientPost = toClientPost(post)
    if (onNewData) onNewData(clientPost)
    if (onData) onData([clientPost])
  })

  return {
    unsubscribe: () => es.close(),
  }
}
