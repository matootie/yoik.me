/**
 * Post routes.
 */

import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { db } from "../utils/firebase"
import { getName, getColor } from "../utils/id"
import { requireAuth, type AuthVariables } from "../middleware/auth"
import type { Post, PaginatedResponse, CreatePostRequest } from "@yme/types"
import { FieldValue, Timestamp } from "firebase-admin/firestore"

const posts = new Hono<{ Variables: AuthVariables }>()

/** Helper to convert a Firestore doc to a Post. */
function docToPost(id: string, data: FirebaseFirestore.DocumentData): Post {
  return {
    postId: id,
    body: data.body,
    published: data.published?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    author: {
      uid: data.author,
      color: getColor(data.author),
      username: getName(data.author),
    },
  }
}

/** POST /api/posts — create a post. */
posts.post("/", requireAuth, async (c) => {
  const uid = c.get("uid")
  const body = await c.req.json<CreatePostRequest>()

  if (!body.body?.trim()) {
    return c.json({ error: "Post body is required" }, 400)
  }

  const ref = await db.collection("posts").add({
    body: body.body,
    published: FieldValue.serverTimestamp(),
    author: uid,
  })

  return c.json({ postId: ref.id }, 201)
})

/** GET /api/posts — list posts (paginated). */
posts.get("/", async (c) => {
  const limitParam = Math.min(Number(c.req.query("limit") || 10), 10)
  const cursor = c.req.query("cursor")

  let q = db
    .collection("posts")
    .where("published", "<", Timestamp.now())
    .orderBy("published", "desc")
    .limit(limitParam)

  if (cursor) {
    const cursorDoc = await db.collection("posts").doc(cursor).get()
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc)
    }
  }

  const snapshot = await q.get()
  const items: Post[] = []
  snapshot.forEach((doc) => {
    items.push(docToPost(doc.id, doc.data()))
  })

  const lastItem = items.length < limitParam ? undefined : items[items.length - 1]?.postId
  const response: PaginatedResponse<Post> = { items, cursor: lastItem }
  return c.json(response)
})

/** GET /api/posts/:id — get a single post. */
posts.get("/:id", async (c) => {
  const id = c.req.param("id")
  const doc = await db.collection("posts").doc(id).get()

  if (!doc.exists) {
    return c.json({ error: "Post not found" }, 404)
  }

  return c.json(docToPost(doc.id, doc.data()!))
})

/** GET /api/posts/live — SSE stream for new posts. */
posts.get("/live", (c) => {
  return streamSSE(c, async (stream) => {
    const unsubscribe = db
      .collection("posts")
      .where("published", ">=", Timestamp.now())
      .orderBy("published", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const post = docToPost(change.doc.id, change.doc.data())
            stream.writeSSE({
              event: "new-post",
              data: JSON.stringify(post),
            })
          }
        })
      })

    stream.onAbort(() => {
      unsubscribe()
    })

    // Keep the stream alive.
    while (true) {
      await stream.sleep(30000)
    }
  })
})

export { posts }
