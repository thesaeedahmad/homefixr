'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiGet<{ users: AdminUser[] }>('/admin/users')
      .then((d) => setUsers(d.users))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
      <div className="mt-6">
        <AdminTabs />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-neutral-200 last:border-0">
                  <td className="p-3 text-neutral-900">{u.name}</td>
                  <td className="p-3 text-neutral-600">{u.email}</td>
                  <td className="p-3"><Badge tone="neutral">{u.role}</Badge></td>
                  <td className="p-3">
                    {u.isVerified ? <Badge tone="success">Verified</Badge> : <span className="text-neutral-600">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
