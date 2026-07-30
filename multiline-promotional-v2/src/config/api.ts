/**
 * Centralized API configuration.
 *
 * Every fetch() call in the frontend must go through the constants exported
 * here instead of hardcoding "/api", "http://localhost:3001", etc. This is
 * what makes the app portable across:
 *   - local development (Vite dev server on :3000 proxying to Express on :3001)
 *   - Render (frontend + backend served by the same Express process)
 *   - Hostinger Business Shared Hosting (same single-process model)
 *   - Any future setup where the API is on a different host, via
 *     VITE_API_BASE_URL, without touching component code.
 *
 * Resolution order:
 *   1. VITE_API_BASE_URL / VITE_UPLOAD_ENDPOINT, if explicitly set at build
 *      time (baked in by Vite — set these in .env before `npm run build`).
 *   2. Relative same-origin paths ("/api", "/api/uploads"), which are
 *      correct for every deployment target above since Express always
 *      serves the API and the built frontend from the same origin.
 */

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL
  ? trimTrailingSlash(import.meta.env.VITE_API_BASE_URL)
  : "/api";

export const UPLOAD_ENDPOINT: string = import.meta.env.VITE_UPLOAD_ENDPOINT
  ? import.meta.env.VITE_UPLOAD_ENDPOINT
  : `${API_BASE_URL}/uploads`;

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
  quotes: `${API_BASE_URL}/quotes`,
  messages: `${API_BASE_URL}/messages`,
  uploads: UPLOAD_ENDPOINT,
  health: "/health",
} as const;

/**
 * Shared JSON fetch helper used by every context/provider. Centralizing
 * this means auth headers, error shaping, or a future API key only need to
 * change in one place.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : undefined;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return data as T;
}
