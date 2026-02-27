/**
 * API client utilities.
 */

import { getAuth } from "#utils/firebase"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001"

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
