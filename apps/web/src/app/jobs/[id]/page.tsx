'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BidList } from '@/components/bids/BidList';
import { BidForm } from '@/components/bids/BidForm';
import { Chat } from '@/components/chat/Chat';
import { PaymentPanel } from '@/components/payment/PaymentPanel';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { categoryLabel } from '@/lib/categories';
import type { Job, JobStatus } from '@/lib/types';

/*
  Job detail — the hub for the bidding workflow (Iteration 5).

  HCI applied:
   - Status badge always visible (system status).
   - Owner sees the bid comparison; providers see the bid form. Each role sees
     exactly what it needs (recognition, minimalist).
   - Owner-only Edit/Cancel appear only while OPEN; Cancel confirms first.
*/
const STATUS_TONE: Record<JobStatus, 'neutral' | 'warning' | 'success' | 'danger'> = {
  OPEN: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CLOSED: 'danger',
};

type Me = { id: string; role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN' };

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const loadJob = useCallback(() => {
    return apiGet<{ job: Job }>(`/jobs/${params.id}`).then((data) => setJob(data.job));
  }, [params.id]);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    Promise.all([loadJob(), apiGet<{ user: Me }>('/users/me').then((d) => setMe(d.user))])
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load job'))
      .finally(() => setLoading(false));
  }, [loadJob, router]);

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

  const isOwner = me !== null && job.customer?.id === me.id;

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
          <Button variant="secondary" loading={cancelling} onClick={handleCancel}>Cancel job</Button>
        </div>
      )}

      {/* Bidding: owner compares bids; provider places a bid. */}
      {isOwner && me?.role === 'CUSTOMER' && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">Bids</h2>
          <BidList jobId={job.id} jobStatus={job.status} onChange={loadJob} />
        </section>
      )}

      {me?.role === 'PROVIDER' && (
        <section className="mt-10">
          <BidForm jobId={job.id} jobStatus={job.status} category={job.category} />
        </section>
      )}

      {/* Escrow payment — participants only; self-hides while the job is OPEN. */}
      {me && (isOwner || me.role === 'PROVIDER') && (
        <section className="mt-10">
          <PaymentPanel
            jobId={job.id}
            jobStatus={job.status}
            isOwner={isOwner}
            role={me.role}
            onChange={loadJob}
          />
        </section>
      )}

      {/* Review — appears after completion; only the owner can submit. */}
      {me && (isOwner || me.role === 'PROVIDER') && (
        <section className="mt-10">
          <ReviewSection jobId={job.id} jobStatus={job.status} isOwner={isOwner} />
        </section>
      )}

      {/* Chat — visible to the customer owner and the assigned provider. */}
      {me && (isOwner || me.role === 'PROVIDER') && (
        <section className="mt-10">
          <Chat jobId={job.id} meId={me.id} />
        </section>
      )}
    </main>
  );
}
