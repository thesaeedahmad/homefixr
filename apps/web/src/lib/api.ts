/**
 * Minimal API client.
 *
 * A single, tiny wrapper around fetch so every component calls the backend the
 * same way and errors are handled consistently (DRY). We use the built-in
 * fetch — no HTTP library is needed (KISS). The API base URL comes from the
 * NEXT_PUBLIC_API_URL environment variable.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // The API returns errors as { error: { message } }.
    throw new Error(data?.error?.message ?? 'Something went wrong. Please try again.');
  }

  return data as T;
}
