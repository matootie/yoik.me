/**
 * Authentication middleware.
 * Verifies Firebase ID tokens from the Authorization header.
 */

import { createMiddleware } from "hono/factory"
import { auth } from "../utils/firebase"

export interface AuthVariables {
  uid: string
}

export const requireAuth = createMiddleware<{
  Variables: AuthVariables
}>(async (c, next) => {
  const header = c.req.header("Authorization")
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401)
  }

  const token = header.slice(7)
  try {
    const decoded = await auth.verifyIdToken(token)
    c.set("uid", decoded.uid)
    await next()
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401)
  }
})
