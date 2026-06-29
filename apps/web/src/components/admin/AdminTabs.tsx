'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* Sub-navigation for the admin area (consistency across admin screens). */
const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/verification', label: 'Verifications' },
  { href: '/admin/fraud', label: 'Fraud' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/jobs', label: 'Jobs' },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-4 border-b border-neutral-200 pb-3 text-sm">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={path === t.href ? 'font-medium text-primary-700' : 'text-neutral-600 hover:text-neutral-900'}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
