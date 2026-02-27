/**
 * Hono application instance.
 *
 * Separated from the server entrypoint so it can be reused
 * across runtimes (Bun dev server, Cloud Functions v2, etc.).
 */

import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { posts } from "./routes/posts"
import { comments } from "./routes/comments"

const app = new Hono()

// Global error handler — catch unhandled exceptions and return structured JSON
// instead of a raw 500. This prevents Hono's default HTML error page from
// leaking to API consumers and ensures clients always get valid JSON.
app.onError((err, c) => {
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return c.json({ error: "Invalid or missing JSON body" }, 400)
  }
  console.error("Unhandled error:", err)
  return c.json({ error: "Internal server error" }, 500)
})

// Middleware.
app.use("*", logger())
app.use("*", cors())

// Health check.
app.get("/health", (c) => c.json({ status: "ok" }))

// Routes.
app.route("/api/posts", posts)
app.route("/api/posts/:postId/comments", comments)

export default app
