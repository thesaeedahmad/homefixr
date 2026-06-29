'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiPost } from '@/lib/api';
import { saveToken } from '@/lib/auth';

/*
  Login screen (FR-1 / FR-2).

  HCI applied:
   - Minimal fields (email + password) — low cognitive load.
   - A single, non-revealing error message ("Invalid email or password")
     matches the API's security behaviour and avoids confusing the user.
   - Loading state on submit (Visibility of system status).
*/
type AuthResponse = { token: string };

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const { token } = await apiPost<AuthResponse>('/auth/login', {
        email: form.get('email'),
        password: form.get('password'),
      });
      saveToken(token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome back</h1>
      <p className="mt-1 text-sm text-neutral-600">Sign in to continue to HomeFixr.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && (
          <p role="alert" className="rounded-md bg-danger-600/10 px-3 py-2 text-sm text-danger-600">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        New to HomeFixr?{' '}
        <Link href="/register" className="font-medium text-primary-700 hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
