/**
 * Cloud Functions v2 entrypoint.
 *
 * Wraps the Hono app for deployment as a Firebase Cloud Function.
 * This file is bundled by esbuild into functions/lib/index.js.
 */

import { onRequest } from "firebase-functions/v2/https"
import app from "./app"

export const api = onRequest(
  {
    region: "us-east1",
    // Set to 1 for minimal cold starts in production; 0 for dev/cost savings.
    minInstances: 0,
  },
  async (req, res) => {
    // Convert Node.js IncomingMessage to a Web Request.
    const url = `https://${req.headers.host}${req.url}`
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value)
        headers.set(key, Array.isArray(value) ? value.join(", ") : value)
    }

    // Cloud Functions v2 pre-parses the request body, so the raw stream is
    // already consumed. Use `req.rawBody` (a Buffer provided by the runtime)
    // instead of reading from the stream, which would hang forever.
    // Note: Buffer.buffer returns the full underlying ArrayBuffer (pool-
    // allocated), so we must slice to the correct region.
    const rawBody =
      req.method !== "GET" && req.method !== "HEAD"
        ? ((req as any).rawBody as Buffer | undefined)
        : undefined

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body:
        rawBody && rawBody.byteLength > 0
          ? (rawBody.buffer.slice(
              rawBody.byteOffset,
              rawBody.byteOffset + rawBody.byteLength
            ) as ArrayBuffer)
          : undefined,
    })

    // Run through Hono.
    const webResponse = await app.fetch(webRequest)

    // Write the Web Response back to the Node.js response.
    res.status(webResponse.status)
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    const responseBody = await webResponse.arrayBuffer()
    res.end(Buffer.from(responseBody))
  }
)
