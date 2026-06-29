import { ReactNode } from 'react';

/**
 * Badge — a small status label.
 *
 * Status is conveyed by BOTH colour and text (never colour alone) so it remains
 * understandable for colour-blind users (WCAG 1.4.1). Used for verification
 * status and the provider trust badge.
 */
type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const tones: Record<Tone, string> = {
  success: 'bg-success-600/10 text-success-600',
  warning: 'bg-warning-600/10 text-warning-600',
  danger: 'bg-danger-600/10 text-danger-600',
  neutral: 'bg-neutral-200 text-neutral-600',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
