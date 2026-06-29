'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet, apiPost } from '@/lib/api';
import type { Bid, BidStatus } from '@/lib/types';

/*
  Provider's bid form (FR-13/FR-14).

  HCI applied:
   - The total updates live as the provider types (immediate feedback) and the
     breakdown is shown explicitly (transparency, match real world).
   - If the provider has already bid, their bid + status is shown instead of the
     form (recognition over recall; prevents duplicate bids).
*/
const STATUS_TONE: Record<BidStatus, 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

export function BidForm({ jobId, jobStatus }: { jobId: string; jobStatus: string }) {
  const [myBid, setMyBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState('');
  const [hours, setHours] = useState('');
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet<{ bids: Bid[] }>('/bids/mine')
      .then((data) => setMyBid(data.bids.find((b) => b.job?.id === jobId) ?? null))
      .catch(() => setMyBid(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  const total = Math.round((Number(rate) || 0) * (Number(hours) || 0) + (Number(equipment) || 0));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { bid } = await apiPost<{ bid: Bid }>(`/jobs/${jobId}/bids`, {
        hourlyRate: Number(rate),
        estimatedHours: Number(hours),
        equipmentCost: Number(equipment) || 0,
        message: (new FormData(event.currentTarget).get('message') as string) || undefined,
      });
      setMyBid(bid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit bid');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-neutral-600">Loading…</p>;

  if (myBid) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-neutral-900">Your bid</h2>
          <Badge tone={STATUS_TONE[myBid.status]}>{myBid.status}</Badge>
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          PKR {myBid.hourlyRate} × {myBid.estimatedHours}h + PKR {myBid.equipmentCost} equipment
        </p>
        <p className="mt-1 text-base font-medium text-neutral-900">Total: PKR {myBid.totalAmount}</p>
      </div>
    );
  }

  if (jobStatus !== 'OPEN') {
    return <p className="text-sm text-neutral-600">This job is no longer accepting bids.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-neutral-900">Place a bid</h2>
      <Input
        label="Hourly rate (PKR)"
        name="hourlyRate"
        type="number"
        min={1}
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        required
      />
      <Input
        label="Estimated hours"
        name="estimatedHours"
        type="number"
        min={0.5}
        step={0.5}
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        required
      />
      <Input
        label="Equipment / materials cost (PKR)"
        name="equipmentCost"
        type="number"
        min={0}
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
        placeholder="0"
      />
      <Textarea label="Message (optional)" name="message" placeholder="Anything the customer should know" />

      <div className="rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-700">
        Total: <span className="font-semibold">PKR {total}</span>{' '}
        <span className="text-xs text-neutral-600">(rate × hours + equipment)</span>
      </div>

      {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}

      <Button type="submit" loading={submitting}>Submit bid</Button>
    </form>
  );
}
