'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';

/*
  Admin dashboard overview (FR-29).

  HCI applied:
   - At-a-glance metric cards (visibility of system status, chunking).
   - Consistent admin sub-navigation across all admin screens.
*/
type Overview = {
  users: number;
  jobs: { open: number; inProgress: number; completed: number };
  pendingVerifications: number;
  openFraud: number;
};

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<Overview>('/admin/overview')
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Admin dashboard</h1>
      <div className="mt-6">
        <AdminTabs />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger-600">{error}</p>
      ) : data ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card label="Users" value={data.users} />
          <Card label="Open jobs" value={data.jobs.open} />
          <Card label="In progress" value={data.jobs.inProgress} />
          <Card label="Completed jobs" value={data.jobs.completed} />
          <Card label="Pending verifications" value={data.pendingVerifications} />
          <Card label="Open fraud flags" value={data.openFraud} />
        </div>
      ) : null}
    </main>
  );
}
