'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { Bid, BidStatus } from '@/lib/types';

/*
  Provider's bids. Lets a provider track every offer they've made and its
  outcome (visibility of system status).
*/
const STATUS_TONE: Record<BidStatus, 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

export default function MyBidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ bids: Bid[] }>('/bids/mine')
      .then((data) => setBids(data.bids))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load your bids'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">My bids</h1>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-danger-600">{error}</p>
      ) : bids.length === 0 ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">
            You haven&apos;t placed any bids yet.{' '}
            <Link href="/jobs" className="font-medium text-primary-700 hover:underline">Browse jobs</Link>
          </p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {bids.map((bid) => (
            <li key={bid.id}>
              <Link
                href={`/jobs/${bid.job?.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 hover:border-primary-600"
              >
                <div>
                  <p className="font-medium text-neutral-900">{bid.job?.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">Total: PKR {bid.totalAmount}</p>
                </div>
                <Badge tone={STATUS_TONE[bid.status]}>{bid.status}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
