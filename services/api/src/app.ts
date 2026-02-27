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

// Middleware.
app.use("*", logger())
app.use("*", cors())

// Health check.
app.get("/health", (c) => c.json({ status: "ok" }))

// Routes.
app.route("/api/posts", posts)
app.route("/api/posts/:postId/comments", comments)

export default app
