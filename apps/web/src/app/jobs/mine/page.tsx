'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { categoryLabel } from '@/lib/categories';
import type { Job, JobStatus } from '@/lib/types';

/*
  Customer's own jobs.

  HCI applied:
   - Clear status per job (visibility of system status).
   - Empty state invites the primary action (post a job).
*/
const STATUS_TONE: Record<JobStatus, 'neutral' | 'warning' | 'success' | 'danger'> = {
  OPEN: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CLOSED: 'danger',
};

export default function MyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ jobs: Job[] }>('/jobs/mine')
      .then((data) => setJobs(data.jobs))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load your jobs'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">My jobs</h1>
        <Button href="/jobs/new">Post a job</Button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-danger-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">You haven&apos;t posted any jobs yet.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 hover:border-primary-600"
              >
                <div>
                  <p className="font-medium text-neutral-900">{job.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {categoryLabel(job.category)} · {job.location}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[job.status]}>{job.status.replace('_', ' ')}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
