/**
 * Comment providers.
 */

// Local imports.
import {
  getFirestore,
  getDocs,
  getDoc,
  addDoc,
  query,
  doc,
  collection,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "#utils/firebase"

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
  author,
}: CreateCommentInput): Promise<CreateCommentOutput> {
  const db = getFirestore()
  const { id } = await addDoc(collection(db, "posts", postId, "comments"), {
    body,
    published: serverTimestamp(),
    author,
  })
  return { commentId: id }
}

/**
 * List comments under a post.
 */
export interface ListCommentsInput {
  postId: string
  limit?: number
  cursor?: string
}
export interface ListCommentsComment {
  commentId: string
  postId: string
  body: string
  published: Date
  author: string
}
export interface ListCommentsOutput {
  items: ListCommentsComment[]
  cursor?: string
}
export async function listComments({
  postId,
  limit: l = 10,
  cursor,
}: ListCommentsInput): Promise<ListCommentsOutput> {
  // Clamp the limit.
  const lim = l > 10 ? 10 : l
  // Get the data.
  const db = getFirestore()
  const q = cursor
    ? query(
        collection(db, "posts", postId, "comments"),
        orderBy("published", "desc"),
        limit(lim),
        startAfter(await getDoc(doc(db, "posts", postId, "comments", cursor)))
      )
    : query(
        collection(db, "posts", postId, "comments"),
        orderBy("published", "desc"),
        limit(lim)
      )
  const qs = await getDocs(q)
  // Parse the response.
  const items: ListCommentsComment[] = []
  qs.forEach((item) => {
    const data = item.data()
    items.push({
      postId,
      commentId: item.id,
      body: data.body,
      published: data.published.toDate(),
      author: data.author,
    })
  })
  // Return the data.
  const lastItem =
    items.length < lim ? undefined : items[items.length - 1].commentId
  return {
    items,
    cursor: lastItem,
  }
}
