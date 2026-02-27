/**
 * API service entrypoint.
 */

import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { posts } from "./routes/posts"
import { comments } from "./routes/comments"

const app = new Hono()

// Middleware.
app.use("*", logger())
app.use("*", cors())

// Health check.
app.get("/health", (c) => c.json({ status: "ok" }))

// Routes.
app.route("/api/posts", posts)
app.route("/api/posts/:postId/comments", comments)

// Start server.
const port = Number(process.env.PORT || 3001)
console.log(`API server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
