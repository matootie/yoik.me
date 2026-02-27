/**
 * Comment data providers — API-backed.
 */

import { apiFetch, apiEventSource } from "#utils/api"
import type { Comment, PaginatedResponse } from "@yme/types"

/** Convert API Comment (ISO string dates) to client Comment (Date objects). */
export interface ClientComment {
  commentId: string
  postId: string
  body: string
  published: Date
  author: { uid: string; color: string; username: string }
}

function toClientComment(comment: Comment): ClientComment {
  return {
    ...comment,
    published: new Date(comment.published),
  }
}

/**
 * Create a comment on a post.
 */
export interface CreateCommentInput {
  postId: string
  body: string
  author: string
}
export interface CreateCommentOutput {
  commentId: string
}
export async function createComment({
  postId,
  body,
}: CreateCommentInput): Promise<CreateCommentOutput> {
  const res = await apiFetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  })
  if (!res.ok) throw new Error("Failed to create comment")
  return res.json()
}

/**
 * List comments under a post.
 */
export interface ListCommentsInput {
  postId: string
  limit?: number
  cursor?: string
}
export type ListCommentsComment = ClientComment
export interface ListCommentsOutput {
  items: ListCommentsComment[]
  cursor?: string
}
export async function listComments({
  postId,
  limit: l = 10,
  cursor,
}: ListCommentsInput): Promise<ListCommentsOutput> {
  const params = new URLSearchParams({ limit: String(l) })
  if (cursor) params.set("cursor", cursor)
  const res = await apiFetch(`/api/posts/${postId}/comments?${params}`)
  if (!res.ok) throw new Error("Failed to list comments")
  const data: PaginatedResponse<Comment> = await res.json()
  return {
    items: data.items.map(toClientComment),
    cursor: data.cursor,
  }
}

/**
 * Listen for new comments via SSE.
 */
export type ListenCommentsComment = ClientComment
export interface ListenCommentsInput {
  postId: string
  onData: (data: ListenCommentsComment[]) => void
}
export interface ListenCommentsOutput {
  unsubscribe: () => void
}
export function listenComments({
  postId,
  onData,
}: ListenCommentsInput): ListenCommentsOutput {
  const es = apiEventSource(`/api/posts/${postId}/comments/live`)

  es.addEventListener("new-comment", (event) => {
    const comment: Comment = JSON.parse(event.data)
    onData([toClientComment(comment)])
  })

  return {
    unsubscribe: () => es.close(),
  }
}
