/**
 * Minimal API client.
 *
 * A single, tiny wrapper around fetch so every component calls the backend the
 * same way and errors are handled consistently (DRY). We use the built-in
 * fetch — no HTTP library is needed (KISS). When a token is stored it is sent
 * in the Authorization header (the API expects "Bearer <jwt>").
 */
import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // The API returns errors as { error: { message } }.
    throw new Error(data?.error?.message ?? 'Something went wrong. Please try again.');
  }
  return data as T;
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  }).then(handle<T>);
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  }).then(handle<T>);
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    headers: { ...authHeaders() },
  }).then(handle<T>);
}

/**
 * Multipart upload (files). We intentionally do NOT set Content-Type so the
 * browser adds the correct multipart boundary automatically.
 */
export function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  }).then(handle<T>);
}
