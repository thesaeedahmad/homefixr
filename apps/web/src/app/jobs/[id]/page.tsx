'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { categoryLabel } from '@/lib/categories';
import type { Job, JobStatus } from '@/lib/types';

/*
  Job detail.

  HCI applied:
   - Status is shown as a badge (visibility of system status).
   - Owner-only actions (Edit / Cancel) appear only when relevant and only
     while the job is OPEN (recognition, error prevention).
   - Cancel asks for confirmation (error prevention / easy reversal).
*/
const STATUS_TONE: Record<JobStatus, 'neutral' | 'warning' | 'success' | 'danger'> = {
  OPEN: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CLOSED: 'danger',
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    Promise.all([
      apiGet<{ job: Job }>(`/jobs/${params.id}`),
      apiGet<{ user: { id: string } }>('/users/me'),
    ])
      .then(([jobRes, meRes]) => {
        setJob(jobRes.job);
        setMyId(meRes.user.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load job'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleCancel() {
    if (!window.confirm('Cancel this job? This cannot be undone.')) return;
    setCancelling(true);
    try {
      const { job: updated } = await apiPatch<{ job: Job }>(`/jobs/${params.id}/cancel`, {});
      setJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading job…</p>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-danger-600">{error || 'Job not found'}</p>
        <Link href="/jobs" className="mt-3 inline-block text-sm text-primary-700 hover:underline">
          ← Back to jobs
        </Link>
      </main>
    );
  }

  const isOwner = myId !== null && job.customer?.id === myId;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/jobs" className="text-sm text-neutral-600 hover:underline">← Back to jobs</Link>

      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">{job.title}</h1>
        <Badge tone={STATUS_TONE[job.status]}>{job.status.replace('_', ' ')}</Badge>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
        <Badge tone="neutral">{categoryLabel(job.category)}</Badge>
        <span>{job.location}</span>
        {job.budgetHint != null && <span>· ~ PKR {job.budgetHint}</span>}
      </div>

      <p className="mt-6 whitespace-pre-wrap text-sm text-neutral-900">{job.description}</p>

      {job.photos.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {job.photos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={`Photo for ${job.title}`}
              className="h-28 w-28 rounded-md border border-neutral-200 object-cover"
            />
          ))}
        </div>
      )}

      {isOwner && job.status === 'OPEN' && (
        <div className="mt-8 flex gap-2 border-t border-neutral-200 pt-6">
          <Button href={`/jobs/${job.id}/edit`} variant="secondary">Edit</Button>
          <Button variant="secondary" loading={cancelling} onClick={handleCancel}>
            Cancel job
          </Button>
        </div>
      )}
    </main>
  );
}
