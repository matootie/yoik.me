/**
 * Post providers.
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
  where,
  Unsubscribe,
  onSnapshot,
  Timestamp,
} from "#utils/firebase"
import { getColor, getName } from "#utils/id"

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
  author,
}: CreatePostInput): Promise<CreatePostOutput> {
  const db = getFirestore()
  const { id } = await addDoc(collection(db, "posts"), {
    body,
    published: serverTimestamp(),
    author,
  })
  return { postId: id }
}

/**
 * Get a single post.
 */
export interface GetPostInput {
  postId: string
}
export interface GetPostPost {
  postId: string
  body: string
  published: Date
  author: {
    uid: string
    color: string
    username: string
  }
}
export interface GetPostOutput {
  item?: GetPostPost
}
export async function getPost({
  postId,
}: GetPostInput): Promise<GetPostOutput> {
  const db = getFirestore()
  const x = await getDoc(doc(db, "posts", postId))
  const data = x.data()
  if (!data) {
    return {}
  }
  return {
    item: {
      postId,
      body: data.body,
      published: data.published.toDate(),
      author: {
        uid: data.author,
        color: getColor(data.author),
        username: getName(data.author),
      },
    },
  }
}

/**
 * List a page of posts.
 */
export interface ListPostsInput {
  limit?: number
  cursor?: string
}
export interface ListPostsPost {
  postId: string
  body: string
  published: Date
  author: {
    uid: string
    color: string
    username: string
  }
}
export interface ListPostsOutput {
  items: ListPostsPost[]
  cursor?: string
}
export async function listPosts({
  limit: l = 10,
  cursor,
}: ListPostsInput | undefined = {}): Promise<ListPostsOutput> {
  // Clamp the limit.
  const lim = l > 10 ? 10 : l
  // Get the data.
  const db = getFirestore()
  const q = cursor
    ? query(
        collection(db, "posts"),
        where("published", "<", Timestamp.now()),
        orderBy("published", "desc"),
        limit(lim),
        startAfter(await getDoc(doc(db, "posts", cursor)))
      )
    : query(
        collection(db, "posts"),
        where("published", "<", Timestamp.now()),
        orderBy("published", "desc"),
        limit(lim)
      )
  const qs = await getDocs(q)
  // Parse the response.
  const items: ListPostsPost[] = []
  qs.forEach((item) => {
    const data = item.data()
    items.push({
      postId: item.id,
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
    items.length < lim ? undefined : items[items.length - 1].postId
  return {
    items,
    cursor: lastItem,
  }
}

export interface ListenPostsPost {
  postId: string
  body: string
  published: Date
  author: {
    uid: string
    color: string
    username: string
  }
}
export interface ListenPostsInput {
  onData?: (data: ListenPostsPost[]) => void
  onNewData?: (data: ListenPostsPost) => void
}
export interface ListenPostsOutput {
  unsubscribe: Unsubscribe
}
export function listenPosts({
  onData,
  onNewData,
}: ListenPostsInput): ListenPostsOutput {
  const db = getFirestore()
  const q = query(
    collection(db, "posts"),
    where("published", ">=", Timestamp.now()),
    orderBy("published", "desc")
  )
  const unsubscribe = onSnapshot(q, (qs) => {
    if (onNewData !== undefined) {
      qs.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data()
          const item = {
            postId: change.doc.id,
            body: data.body,
            published: data.published.toDate(),
            author: {
              uid: data.author,
              color: getColor(data.author),
              username: getName(data.author),
            },
          }
          onNewData(item)
        }
      })
    }
    if (onData !== undefined) {
      const items: ListenPostsPost[] = []
      qs.forEach((item) => {
        const data = item.data()
        items.push({
          postId: item.id,
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
    }
  })
  // Return the unsubscribe function.
  return { unsubscribe }
}
