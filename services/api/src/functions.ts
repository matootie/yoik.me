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

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await new Promise<Uint8Array>((resolve) => {
            const chunks: Uint8Array[] = []
            req.on("data", (chunk: Buffer) =>
              chunks.push(new Uint8Array(chunk))
            )
            req.on("end", () => {
              const total = chunks.reduce((n, c) => n + c.length, 0)
              const merged = new Uint8Array(total)
              let offset = 0
              for (const c of chunks) {
                merged.set(c, offset)
                offset += c.length
              }
              resolve(merged)
            })
          })
        : undefined

    const webRequest = new Request(url, {
      method: req.method,
      headers,
      body: body ? (body.buffer as ArrayBuffer) : undefined,
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
