'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { Job } from '@/lib/types';

/*
  Edit an open job (FR-11).

  Only text fields are editable here (photos are managed at creation) — a
  deliberate simplicity choice. The API enforces ownership and the OPEN-only
  rule; the UI surfaces any resulting error message.
*/
export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ job: Job }>(`/jobs/${params.id}`)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load job'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiPatch(`/jobs/${params.id}`, {
        title: form.get('title'),
        description: form.get('description'),
        location: form.get('location'),
        budgetHint: form.get('budgetHint') || undefined,
      });
      router.push(`/jobs/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading…</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <p className="text-sm text-danger-600">{error || 'Job not found'}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Edit job</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <Input label="Title" name="title" defaultValue={job.title} required />
        <Textarea label="Description" name="description" defaultValue={job.description} required />
        <Input label="Location" name="location" defaultValue={job.location} required />
        <Input
          label="Budget hint (optional)"
          name="budgetHint"
          type="number"
          min={1}
          defaultValue={job.budgetHint ?? ''}
        />

        {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" loading={saving}>Save changes</Button>
          <Button href={`/jobs/${job.id}`} variant="secondary">Cancel</Button>
        </div>
      </form>
    </main>
  );
}
