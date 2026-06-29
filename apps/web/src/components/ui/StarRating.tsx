'use client';

/**
 * StarRating — accessible 1–5 star control.
 *
 * Read-only mode shows a rating; interactive mode lets the user pick one. Each
 * star is a real button with an aria-label so it is keyboard- and
 * screen-reader-accessible (not just a decorative glyph).
 */
export function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((n) => {
        const filled = n <= value;
        const cls = `text-xl leading-none ${filled ? 'text-warning-600' : 'text-neutral-200'}`;
        if (readOnly) {
          return (
            <span key={n} className={cls} aria-hidden="true">★</span>
          );
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={value === n}
            className={`${cls} rounded`}
          >
            ★
          </button>
        );
      })}
      {readOnly && <span className="sr-only">{value} out of 5</span>}
    </div>
  );
}
