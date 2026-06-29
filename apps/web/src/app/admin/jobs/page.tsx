'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { categoryLabel } from '@/lib/categories';
import type { JobStatus } from '@/lib/types';

type AdminJob = {
  id: string;
  title: string;
  category: string;
  status: JobStatus;
  createdAt: string;
  customer: { name: string };
};

const STATUS_TONE: Record<JobStatus, 'neutral' | 'warning' | 'success' | 'danger'> = {
  OPEN: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CLOSED: 'danger',
};

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ jobs: AdminJob[] }>('/admin/jobs')
      .then((d) => setJobs(d.jobs))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Jobs</h1>
      <div className="mt-6">
        <AdminTabs />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-neutral-200 last:border-0">
                  <td className="p-3">
                    <Link href={`/jobs/${j.id}`} className="text-primary-700 hover:underline">{j.title}</Link>
                  </td>
                  <td className="p-3 text-neutral-600">{categoryLabel(j.category)}</td>
                  <td className="p-3 text-neutral-600">{j.customer.name}</td>
                  <td className="p-3"><Badge tone={STATUS_TONE[j.status]}>{j.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
