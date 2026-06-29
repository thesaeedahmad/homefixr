'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { apiUpload } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { JOB_CATEGORIES } from '@/lib/categories';
import type { Job } from '@/lib/types';

/*
  Post a job (FR-9).

  HCI applied:
   - Short, guided form with sensible field order (task analysis).
   - Category is a constrained Select (Error prevention — no free-text typos).
   - Photos are optional and clearly labelled (progressive disclosure).
   - Loading + inline error states (system status, error recovery).
*/
export default function NewJobPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setError('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      const { job } = await apiUpload<{ job: Job }>('/jobs', formData);
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post job');
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Post a job</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Describe the work and providers will send you competitive bids.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="category" className="text-sm font-medium text-neutral-900">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-600"
          >
            {JOB_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Input label="Title" name="title" placeholder="e.g. Leaking kitchen tap" required />
        <Textarea
          label="Description"
          name="description"
          placeholder="Describe the problem and any details a provider should know."
          required
        />
        <Input label="Location" name="location" placeholder="e.g. Johar Town, Lahore" required />
        <Input label="Budget hint (optional)" name="budgetHint" type="number" min={1} placeholder="PKR" />

        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="photos" className="text-sm font-medium text-neutral-900">
            Photos (optional)
          </label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className="text-sm text-neutral-600"
          />
        </div>

        {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}

        <Button type="submit" loading={loading}>Post job</Button>
      </form>
    </main>
  );
}
