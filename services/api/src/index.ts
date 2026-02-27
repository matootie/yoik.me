/**
 * API service entrypoint (Bun dev server).
 */

import app from "./app"

const port = Number(process.env.PORT || 3001)
console.log(`API server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
