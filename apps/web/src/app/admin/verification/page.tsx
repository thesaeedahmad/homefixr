'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';

/*
  Admin verification queue (FR-6).

  HCI applied:
   - Dense, scannable list with clear primary actions (Approve / Reject).
   - Document images shown inline so the admin has the evidence in context.
   - Empty state when the queue is clear (Recognition over recall).
   - Each decision gives immediate feedback by removing the row.
*/
type PendingItem = {
  id: string;
  verificationStatus: string;
  user: { id: string; name: string; email: string };
  documents: { id: string; type: string; imageUrl: string }[];
};

export default function AdminVerificationPage() {
  const router = useRouter();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ pending: PendingItem[] }>('/verification/pending')
      .then((data) => setItems(data.pending))
      .catch((err) => setAccessError(err instanceof Error ? err.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }, [router]);

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    setBusyId(id);
    try {
      await apiPatch(`/verification/${id}/review`, { status });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      // Keep the row so the admin can retry; a toast system is added later.
    } finally {
      setBusyId('');
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-neutral-600">Loading verification queue…</p>
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-neutral-900">Verification queue</h1>
        <p className="mt-2 text-sm text-danger-600">{accessError}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Verification queue</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {items.length} provider{items.length === 1 ? '' : 's'} awaiting review.
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">All caught up — no pending verifications.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-neutral-200 bg-white p-5">
              <p className="font-medium text-neutral-900">{item.user.name}</p>
              <p className="text-sm text-neutral-600">{item.user.email}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {item.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.imageUrl}
                      alt={`${doc.type} document for ${item.user.name}`}
                      className="h-24 w-24 rounded-md border border-neutral-200 object-cover"
                    />
                    <span className="mt-1 block text-center text-xs text-neutral-600">
                      {doc.type}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="primary"
                  loading={busyId === item.id}
                  onClick={() => decide(item.id, 'APPROVED')}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  loading={busyId === item.id}
                  onClick={() => decide(item.id, 'REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
