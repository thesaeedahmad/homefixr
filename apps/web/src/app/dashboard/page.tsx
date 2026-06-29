'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { Job, Bid } from '@/lib/types';

/*
  Role-based dashboard — the landing screen after login (FR-27/FR-28).

  HCI applied:
   - Each role sees a tailored summary + its primary next action (recognition,
     minimalism, clear call-to-action).
   - At-a-glance metric cards (visibility of system status, chunking).
*/
type Me = { id: string; role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'; name: string };

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [verification, setVerification] = useState<string>('NOT_SUBMITTED');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ user: Me }>('/users/me')
      .then(async ({ user }) => {
        setMe(user);
        if (user.role === 'ADMIN') {
          router.replace('/admin');
          return;
        }
        if (user.role === 'CUSTOMER') {
          const d = await apiGet<{ jobs: Job[] }>('/jobs/mine').catch(() => ({ jobs: [] }));
          setJobs(d.jobs);
        } else {
          const [b, v] = await Promise.all([
            apiGet<{ bids: Bid[] }>('/bids/mine').catch(() => ({ bids: [] })),
            apiGet<{ verification: { verificationStatus: string } | null }>('/verification/me').catch(() => ({ verification: null })),
          ]);
          setBids(b.bids);
          setVerification(v.verification?.verificationStatus ?? 'NOT_SUBMITTED');
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !me) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {me.name}</h1>

      {me.role === 'CUSTOMER' && (
        <>
          <div className="mt-6 flex gap-2">
            <Button href="/jobs/new">Post a job</Button>
            <Button href="/jobs/mine" variant="secondary">My jobs</Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card label="Open" value={jobs.filter((j) => j.status === 'OPEN').length} />
            <Card label="In progress" value={jobs.filter((j) => j.status === 'IN_PROGRESS').length} />
            <Card label="Completed" value={jobs.filter((j) => j.status === 'COMPLETED').length} />
            <Card label="Total jobs" value={jobs.length} />
          </div>
        </>
      )}

      {me.role === 'PROVIDER' && (
        <>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-neutral-600">Verification:</span>
            <Badge
              tone={
                verification === 'APPROVED' ? 'success' : verification === 'REJECTED' ? 'danger' : 'warning'
              }
            >
              {verification.replace('_', ' ')}
            </Badge>
          </div>
          <div className="mt-6 flex gap-2">
            <Button href="/jobs">Browse jobs</Button>
            <Button href="/bids/mine" variant="secondary">My bids</Button>
            {verification !== 'APPROVED' && (
              <Button href="/verification" variant="secondary">Get verified</Button>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card label="Pending" value={bids.filter((b) => b.status === 'PENDING').length} />
            <Card label="Accepted" value={bids.filter((b) => b.status === 'ACCEPTED').length} />
            <Card label="Rejected" value={bids.filter((b) => b.status === 'REJECTED').length} />
            <Card label="Total bids" value={bids.length} />
          </div>
        </>
      )}
    </main>
  );
}
