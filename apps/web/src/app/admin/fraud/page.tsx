'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';

/*
  Fraud-flag review (FR-19).

  HCI applied:
   - Each flag shows the reason + a score so the admin can triage quickly.
   - Two clear actions (Confirm / Dismiss); empty state reassures.
*/
type Flag = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  score: number;
  status: 'OPEN' | 'DISMISSED' | 'CONFIRMED';
  createdAt: string;
};

export default function AdminFraudPage() {
  const router = useRouter();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  function load() {
    apiGet<{ flags: Flag[] }>('/admin/fraud-flags?status=OPEN')
      .then((d) => setFlags(d.flags))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    load();
  }, [router]);

  async function review(id: string, status: 'CONFIRMED' | 'DISMISSED') {
    setBusy(id);
    try {
      await apiPatch(`/admin/fraud-flags/${id}`, { status });
      setFlags((prev) => prev.filter((f) => f.id !== id));
    } finally {
      setBusy('');
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Fraud flags</h1>
      <div className="mt-6">
        <AdminTabs />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger-600">{error}</p>
      ) : flags.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
          No open fraud flags. 🎉
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {flags.map((f) => (
            <li key={f.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Badge tone="warning">{f.targetType}</Badge>
                <span className="text-xs text-neutral-600">score {f.score.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-900">{f.reason}</p>
              <p className="mt-1 text-xs text-neutral-600">Target id: {f.targetId}</p>
              <div className="mt-3 flex gap-2">
                <Button loading={busy === f.id} onClick={() => review(f.id, 'CONFIRMED')}>Confirm</Button>
                <Button variant="secondary" loading={busy === f.id} onClick={() => review(f.id, 'DISMISSED')}>
                  Dismiss
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
