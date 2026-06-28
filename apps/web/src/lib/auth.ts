/**
 * Client-side auth token storage.
 *
 * The JWT returned by the API is stored in localStorage and sent on future
 * requests. Keeping all token access in ONE module (DRY) means we can change
 * the storage strategy later without touching the rest of the app.
 *
 * Note: this is intentionally simple for an undergraduate project. The token is
 * only ever sent to our own API over the Authorization header.
 */
const TOKEN_KEY = 'homefixr_token';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
