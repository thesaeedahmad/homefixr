'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, clearToken } from '@/lib/auth';
import { apiGet } from '@/lib/api';

/*
  Global navigation bar.

  HCI applied:
   - Persistent, role-aware navigation (recognition over recall, consistency).
   - The notification count is always visible (visibility of system status).
   - Hidden entirely when logged out, so the auth screens stay focused.
*/
type Me = { id: string; role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'; name: string };

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [unread, setUnread] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setMe(null);
      setReady(true);
      return;
    }
    Promise.all([
      apiGet<{ user: Me }>('/users/me').then((d) => setMe(d.user)).catch(() => setMe(null)),
      apiGet<{ unreadCount: number }>('/notifications').then((d) => setUnread(d.unreadCount)).catch(() => {}),
    ]).finally(() => setReady(true));
  }, [pathname]);

  if (!ready || !me) return null;

  const link = 'text-neutral-600 hover:text-neutral-900';

  function logout() {
    clearToken();
    setMe(null);
    router.push('/login');
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-3 text-sm">
        <Link href="/jobs" className="font-semibold text-primary-700">HomeFixr</Link>
        <Link href="/jobs" className={link}>Browse</Link>
        {me.role === 'CUSTOMER' && (
          <>
            <Link href="/jobs/mine" className={link}>My jobs</Link>
            <Link href="/jobs/new" className={link}>Post</Link>
          </>
        )}
        {me.role === 'PROVIDER' && (
          <>
            <Link href="/bids/mine" className={link}>My bids</Link>
            <Link href="/verification" className={link}>Verification</Link>
          </>
        )}
        {me.role === 'ADMIN' && <Link href="/admin/verification" className={link}>Admin</Link>}

        <div className="ml-auto flex items-center gap-4">
          <Link href="/notifications" className={`relative ${link}`}>
            Notifications
            {unread > 0 && (
              <span className="ml-1 rounded-full bg-danger-600 px-1.5 py-0.5 text-xs font-medium text-white">
                {unread}
              </span>
            )}
          </Link>
          <span className="text-neutral-900">{me.name}</span>
          <button onClick={logout} className={link}>Logout</button>
        </div>
      </nav>
    </header>
  );
}
