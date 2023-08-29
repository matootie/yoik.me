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
  Unsubscribe,
  where,
  Timestamp,
  onSnapshot,
} from "#utils/firebase"
import { getColor, getName } from "#utils/id"

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
  author: {
    uid: string
    color: string
    username: string
  }
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
        where("published", "<", Timestamp.now()),
        orderBy("published", "desc"),
        limit(lim),
        startAfter(await getDoc(doc(db, "posts", postId, "comments", cursor)))
      )
    : query(
        collection(db, "posts", postId, "comments"),
        where("published", "<", Timestamp.now()),
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
      author: {
        uid: data.author,
        color: getColor(data.author),
        username: getName(data.author),
      },
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

export interface ListenCommentsComment {
  commentId: string
  postId: string
  body: string
  published: Date
  author: {
    uid: string
    color: string
    username: string
  }
}
export interface ListenCommentsInput {
  postId: string
  onData: (data: ListenCommentsComment[]) => void
}
export interface ListenCommentsOutput {
  unsubscribe: Unsubscribe
}
export function listenComments({
  postId,
  onData,
}: ListenCommentsInput): ListenCommentsOutput {
  const db = getFirestore()
  const q = query(
    collection(db, "posts", postId, "comments"),
    where("published", ">=", Timestamp.now()),
    orderBy("published", "desc")
  )
  const unsubscribe = onSnapshot(q, (qs) => {
    // Parse the new data.
    const items: ListenCommentsComment[] = []
    qs.forEach((item) => {
      const data = item.data()
      items.push({
        postId,
        commentId: item.id,
        body: data.body,
        published: data.published.toDate(),
        author: {
          uid: data.author,
          color: getColor(data.author),
          username: getName(data.author),
        },
      })
    })
    // Run the callback function with new data.
    onData(items)
  })
  // Return the unsubscribe function.
  return { unsubscribe }
}
