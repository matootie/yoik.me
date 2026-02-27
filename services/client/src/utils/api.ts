/**
 * API client utilities.
 *
 * In production the client is served by Firebase Hosting, which rewrites
 * `/api/**` requests to the Cloud Function.  An empty API_BASE (the default
 * for production builds) produces relative URLs that go through the rewrite
 * automatically.
 *
 * In development the local Bun dev server runs on port 3001, so the fallback
 * points there unless overridden via a `CLIENT_API_URL` env var.
 *
 * Note: Vite is configured with `envPrefix: "CLIENT_"`, so only env vars
 * starting with `CLIENT_` are exposed to client code via `import.meta.env`.
 */

import { getAuth } from "#utils/firebase"

/**
 * Resolve the API base URL from the environment.
 *
 * Priority:
 * 1. Explicit `CLIENT_API_URL` env var (allows overrides for staging, etc.)
 * 2. Production builds → empty string (relative URLs; Firebase Hosting
 *    rewrites `/api/**` to the Cloud Function)
 * 3. Development → `http://localhost:3001` (local Bun dev server)
 *
 * Uses nullish coalescing (`??`) so an explicit empty string is respected.
 */
export function resolveApiBase(env: {
  CLIENT_API_URL?: string
  PROD?: boolean
}): string {
  return env.CLIENT_API_URL ?? (env.PROD ? "" : "http://localhost:3001")
}

const API_BASE = resolveApiBase(import.meta.env)

/**
 * Get the current user's ID token for API authentication.
 */
async function getIdToken(): Promise<string | null> {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

/**
 * Make an authenticated API request.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getIdToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

/**
 * Create an EventSource for SSE streams.
 */
export function apiEventSource(path: string): EventSource {
  return new EventSource(`${API_BASE}${path}`)
}
