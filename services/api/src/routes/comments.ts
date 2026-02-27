/**
 * Comment routes.
 */

import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { db } from "../utils/firebase"
import { getName, getColor } from "../utils/id"
import { requireAuth, type AuthVariables } from "../middleware/auth"
import type {
  Comment,
  PaginatedResponse,
  CreateCommentRequest,
} from "@yme/types"
import { FieldValue, Timestamp } from "firebase-admin/firestore"

const comments = new Hono<{
  Variables: AuthVariables
}>()

/** Helper to convert a Firestore doc to a Comment. */
function docToComment(
  postId: string,
  id: string,
  data: FirebaseFirestore.DocumentData
): Comment {
  return {
    commentId: id,
    postId,
    body: data.body,
    published:
      data.published?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    author: {
      uid: data.author,
      color: getColor(data.author),
      username: getName(data.author),
    },
  }
}

/** POST /api/posts/:postId/comments — create a comment. */
comments.post("/", requireAuth, async (c) => {
  const postId = c.req.param("postId")!
  const uid = c.get("uid")
  const body = await c.req.json<CreateCommentRequest>()

  if (!body.body?.trim()) {
    return c.json({ error: "Comment body is required" }, 400)
  }

  // Verify post exists.
  const post = await db.collection("posts").doc(postId).get()
  if (!post.exists) {
    return c.json({ error: "Post not found" }, 404)
  }

  const ref = await db
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .add({
      body: body.body,
      published: FieldValue.serverTimestamp(),
      author: uid,
    })

  return c.json({ commentId: ref.id }, 201)
})

/** GET /api/posts/:postId/comments — list comments (paginated). */
comments.get("/", async (c) => {
  const postId = c.req.param("postId")!
  const limitParam = Math.min(Number(c.req.query("limit") || 10), 10)
  const cursor = c.req.query("cursor")

  let q = db
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .where("published", "<", Timestamp.now())
    .orderBy("published", "desc")
    .limit(limitParam)

  if (cursor) {
    const cursorDoc = await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(cursor)
      .get()
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc)
    }
  }

  const snapshot = await q.get()
  const items: Comment[] = []
  snapshot.forEach((doc) => {
    items.push(docToComment(postId, doc.id, doc.data()))
  })

  const lastItem =
    items.length < limitParam ? undefined : items[items.length - 1]?.commentId
  const response: PaginatedResponse<Comment> = { items, cursor: lastItem }
  return c.json(response)
})

/** GET /api/posts/:postId/comments/live — SSE stream for new comments. */
comments.get("/live", (c) => {
  const postId = c.req.param("postId")!

  return streamSSE(c, async (stream) => {
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .where("published", ">=", Timestamp.now())
      .orderBy("published", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const comment = docToComment(
              postId,
              change.doc.id,
              change.doc.data()
            )
            stream.writeSSE({
              event: "new-comment",
              data: JSON.stringify(comment),
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

export { comments }
