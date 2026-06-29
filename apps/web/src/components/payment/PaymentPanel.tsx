'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiGet, apiPost, apiPatch } from '@/lib/api';
import type { Payment } from '@/lib/types';

/*
  Escrow payment panel (FR-21/22/23) — a SIMULATION (no real money).

  HCI applied:
   - The current escrow state is always shown as a badge + plain-language line
     (visibility of system status; match the real world: "held", "released").
   - Each role sees only the action it can take next (recognition, minimalism).
   - Release and dispute confirm first (error prevention / easy reversal).
*/
const STATUS_TONE = { HELD: 'warning', RELEASED: 'success', REFUNDED: 'danger' } as const;
const STATUS_LABEL = {
  HELD: 'Payment held',
  RELEASED: 'Payment released',
  REFUNDED: 'Payment refunded',
} as const;

export function PaymentPanel({
  jobId,
  jobStatus,
  isOwner,
  role,
  onChange,
}: {
  jobId: string;
  jobStatus: string;
  isOwner: boolean;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  onChange: () => void;
}) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiGet<{ payment: Payment | null }>(`/jobs/${jobId}/payment`)
      .then((d) => setPayment(d.payment))
      .catch(() => setHidden(true)) // 403: not a participant
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(run: () => Promise<unknown>, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    try {
      await run();
      load();
      onChange();
    } finally {
      setBusy(false);
    }
  }

  if (hidden) return null;
  // Escrow only applies once a provider is hired (job no longer OPEN).
  if (jobStatus === 'OPEN') return null;
  if (loading) return <p className="text-sm text-neutral-600">Loading payment…</p>;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-neutral-900">Escrow payment</h2>
        {payment && <Badge tone={STATUS_TONE[payment.status]}>{STATUS_LABEL[payment.status]}</Badge>}
        <span className="ml-auto text-xs text-neutral-600">Simulation — no real money</span>
      </div>

      {/* No payment yet */}
      {!payment && isOwner && role === 'CUSTOMER' && jobStatus === 'IN_PROGRESS' && (
        <div className="mt-3">
          <p className="text-sm text-neutral-600">Fund the job to let your provider start. The money is held until you confirm the work.</p>
          <div className="mt-3">
            <Button loading={busy} onClick={() => act(() => apiPost(`/jobs/${jobId}/payment`, {}))}>
              Pay into escrow
            </Button>
          </div>
        </div>
      )}
      {!payment && role === 'PROVIDER' && (
        <p className="mt-3 text-sm text-neutral-600">Waiting for the customer to fund the job.</p>
      )}

      {/* Payment exists */}
      {payment && (
        <>
          <p className="mt-2 text-base font-medium text-neutral-900">Amount: PKR {payment.amount}</p>

          {payment.status === 'HELD' && (
            <p className="mt-1 text-sm text-neutral-600">
              {payment.workMarkedDoneAt
                ? 'The provider has marked the work as done.'
                : 'Funds are held in escrow until the work is completed.'}
            </p>
          )}
          {payment.status === 'RELEASED' && (
            <p className="mt-1 text-sm text-success-600">Released to the provider. Job complete.</p>
          )}
          {payment.status === 'REFUNDED' && (
            <p className="mt-1 text-sm text-danger-600">Refunded to the customer.</p>
          )}

          {/* Provider: mark work done */}
          {payment.status === 'HELD' && !payment.workMarkedDoneAt && role === 'PROVIDER' && (
            <div className="mt-3">
              <Button loading={busy} onClick={() => act(() => apiPatch(`/jobs/${jobId}/payment/work-done`, {}))}>
                Mark work as done
              </Button>
            </div>
          )}
          {payment.status === 'HELD' && payment.workMarkedDoneAt && role === 'PROVIDER' && (
            <p className="mt-3 text-sm text-neutral-600">Waiting for the customer to confirm and release payment.</p>
          )}

          {/* Customer: release / dispute */}
          {payment.status === 'HELD' && isOwner && (
            <div className="mt-3 flex gap-2">
              <Button
                loading={busy}
                onClick={() =>
                  act(
                    () => apiPatch(`/jobs/${jobId}/payment/release`, {}),
                    'Release the payment to the provider? This confirms the work is complete.',
                  )
                }
              >
                Confirm &amp; release
              </Button>
              <Button
                variant="secondary"
                loading={busy}
                onClick={() =>
                  act(
                    () => apiPatch(`/jobs/${jobId}/payment/dispute`, {}),
                    'Dispute and refund this payment? The job will be closed.',
                  )
                }
              >
                Dispute
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
