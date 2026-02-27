/**
 * Shared helpers for e2e tests.
 */

/** Base URL for the API under test. Defaults to local dev server. */
export const BASE_URL = (
  process.env.E2E_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "")

/**
 * Typed fetch wrapper that prepends the base URL and sets JSON headers.
 */
export async function api(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BASE_URL}${path}`
  const headers = new Headers(options.headers)
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  return fetch(url, { ...options, headers })
}

/**
 * Generate a unique string for test isolation.
 */
export function uniqueId(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
