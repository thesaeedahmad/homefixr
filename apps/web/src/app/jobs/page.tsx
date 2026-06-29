'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { JOB_CATEGORIES, categoryLabel } from '@/lib/categories';
import type { Job } from '@/lib/types';

/*
  Browse open jobs (FR-30).

  HCI applied:
   - Filters are simple and obvious (category dropdown + location text).
   - Results are scannable cards (chunking, recognition over recall).
   - Loading and empty states are explicit.
*/
export default function BrowseJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchJobs(category = '', location = '') {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    apiGet<{ jobs: Job[] }>(`/jobs?${params.toString()}`)
      .then((data) => setJobs(data.jobs))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    fetchJobs(String(form.get('category') ?? ''), String(form.get('location') ?? ''));
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Browse jobs</h1>

      <form onSubmit={applyFilters} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-neutral-900">Category</label>
          <select
            id="category"
            name="category"
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-600"
          >
            <option value="">All categories</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-medium text-neutral-900">Location</label>
          <input
            id="location"
            name="location"
            placeholder="e.g. Lahore"
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-600 focus:border-primary-600"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Apply
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-600">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">No open jobs match your filters.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block rounded-lg border border-neutral-200 bg-white p-5 hover:border-primary-600"
              >
                <Badge tone="neutral">{categoryLabel(job.category)}</Badge>
                <p className="mt-2 font-medium text-neutral-900">{job.title}</p>
                <p className="mt-1 text-sm text-neutral-600">{job.location}</p>
                {job.budgetHint != null && (
                  <p className="mt-2 text-sm text-neutral-900">~ PKR {job.budgetHint}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
