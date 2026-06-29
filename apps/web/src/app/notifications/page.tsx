'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPatch } from '@/lib/api';
import { getToken } from '@/lib/auth';

/*
  Notifications feed (FR-26).

  HCI applied:
   - Unread items are visually distinct (dot + tinted background).
   - Clicking a notification marks it read and jumps to the related job
     (recognition; minimal steps).
   - "Mark all read" gives bulk control; clear empty state.
*/
type Notif = {
  id: string;
  type: string;
  payload: { message: string; jobId: string | null };
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    apiGet<{ notifications: Notif[] }>('/notifications')
      .then((d) => setItems(d.notifications))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    load();
  }, [router]);

  async function markAll() {
    await apiPatch('/notifications/read-all', {});
    load();
  }

  async function open(n: Notif) {
    if (!n.isRead) await apiPatch(`/notifications/${n.id}/read`, {});
    if (n.payload?.jobId) router.push(`/jobs/${n.payload.jobId}`);
    else load();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Notifications</h1>
        {items.some((i) => !i.isRead) && (
          <Button variant="secondary" onClick={markAll}>Mark all read</Button>
        )}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
          No notifications yet.
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {items.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => open(n)}
                className={`w-full rounded-lg border p-4 text-left ${
                  n.isRead ? 'border-neutral-200 bg-white' : 'border-primary-600 bg-primary-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary-600" aria-label="unread" />
                  )}
                  <span className="text-sm text-neutral-900">{n.payload?.message}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
