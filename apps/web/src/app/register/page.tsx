'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiPost } from '@/lib/api';
import { saveToken } from '@/lib/auth';

/*
  Registration screen (FR-1).

  HCI applied:
   - One clear task per screen, short form (Minimalist, low cognitive load).
   - Role is chosen with two large, plain-language options (Match real world:
     "Hire a professional" / "Offer my services" rather than enum names).
   - A single inline error region explains failures (Help users recover).
   - The submit button shows a loading state (Visibility of system status).
*/
type Role = 'CUSTOMER' | 'PROVIDER';
type AuthResponse = { token: string };

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'CUSTOMER', label: 'Hire a professional' },
  { value: 'PROVIDER', label: 'Offer my services' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const { token } = await apiPost<AuthResponse>('/auth/register', {
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
        role,
      });
      saveToken(token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Create your account</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Join HomeFixr to post jobs or offer your services.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <fieldset className="flex flex-col gap-1.5 text-left">
          <legend className="mb-1.5 text-sm font-medium text-neutral-900">I want to…</legend>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-600 ${
                  role === option.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Input label="Full name" name="name" type="text" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && (
          <p role="alert" className="rounded-md bg-danger-600/10 px-3 py-2 text-sm text-danger-600">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-700 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
