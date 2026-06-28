import Link from 'next/link';
import { ReactNode } from 'react';

/**
 * Button — a reusable design-system component.
 *
 * One component, two variants, used everywhere (DRY + Consistency heuristic).
 * It renders an accessible <a> (via Next Link) when `href` is provided, or a
 * <button> otherwise — so navigation and actions share one consistent look.
 *
 * HCI built in:
 *  - `loading` shows progress and disables the control (Visibility of System
 *    Status + Error Prevention: no accidental double-submit)
 *  - inherits the global :focus-visible ring (keyboard users)
 *  - generous padding for an adequate touch target (Fitts' Law)
 */
type Variant = 'primary' | 'secondary';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary:
    'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50',
};

export function Button({
  children,
  variant = 'primary',
  href,
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const className = `${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className} disabled={disabled || loading}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}
