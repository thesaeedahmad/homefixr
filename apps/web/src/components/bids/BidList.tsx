'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet, apiPatch } from '@/lib/api';
import type { Bid, BidStatus } from '@/lib/types';

/*
  Bid comparison for the job owner (FR-15/FR-16).

  HCI applied:
   - Bids are ordered cheapest-first and show a transparent breakdown + total.
   - Trust signals (Verified badge, rating) sit next to each provider.
   - Accept asks for confirmation and explains the consequence (others declined).
   - Empty state reassures the customer that bids will arrive.
*/
const STATUS_TONE: Record<BidStatus, 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

export function BidList({
  jobId,
  jobStatus,
  onChange,
}: {
  jobId: string;
  jobStatus: string;
  onChange: () => void;
}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    apiGet<{ bids: Bid[] }>(`/jobs/${jobId}/bids`)
      .then((data) => setBids(data.bids))
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  async function accept(id: string) {
    if (!window.confirm('Accept this bid? All other bids will be declined.')) return;
    setBusyId(id);
    try {
      await apiPatch(`/bids/${id}/accept`, {});
      load();
      onChange();
    } finally {
      setBusyId('');
    }
  }

  if (loading) return <p className="text-sm text-neutral-600">Loading bids…</p>;

  if (bids.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">
        No bids yet — we&apos;ll notify you when providers respond.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bids.map((bid) => (
        <li key={bid.id} className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">{bid.provider?.name}</span>
            {bid.provider?.isVerified && <Badge tone="success">Verified</Badge>}
            {bid.provider?.providerProfile && bid.provider.providerProfile.ratingCount > 0 && (
              <span className="text-sm text-neutral-600">
                ★ {bid.provider.providerProfile.ratingAvg.toFixed(1)}
              </span>
            )}
            <span className="ml-auto">
              <Badge tone={STATUS_TONE[bid.status]}>{bid.status}</Badge>
            </span>
          </div>

          <p className="mt-2 text-sm text-neutral-600">
            PKR {bid.hourlyRate} × {bid.estimatedHours}h + PKR {bid.equipmentCost} equipment
          </p>
          <p className="mt-1 text-base font-medium text-neutral-900">Total: PKR {bid.totalAmount}</p>
          {bid.message && <p className="mt-2 text-sm text-neutral-900">“{bid.message}”</p>}

          {jobStatus === 'OPEN' && bid.status === 'PENDING' && (
            <div className="mt-3">
              <Button loading={busyId === bid.id} onClick={() => accept(bid.id)}>
                Accept bid
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
