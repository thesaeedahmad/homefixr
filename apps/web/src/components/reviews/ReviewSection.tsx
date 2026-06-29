'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import { apiGet, apiPost } from '@/lib/api';
import type { Review } from '@/lib/types';

/*
  Review section (FR-24/FR-25).

  HCI applied:
   - Only appears once the job is COMPLETED and only the customer can submit
     (recognition; right action at the right time).
   - Star control gives immediate visual feedback; the existing review is shown
     read-only afterwards (dialog closure — the task is clearly finished).
*/
export function ReviewSection({
  jobId,
  jobStatus,
  isOwner,
}: {
  jobId: string;
  jobStatus: string;
  isOwner: boolean;
}) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet<{ review: Review | null }>(`/jobs/${jobId}/review`)
      .then((d) => setReview(d.review))
      .catch(() => setReview(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  // Reviews only make sense once the work is done.
  if (jobStatus !== 'COMPLETED') return null;
  if (loading) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setError('Please select a star rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const comment = (new FormData(event.currentTarget).get('comment') as string) || undefined;
      const { review: created } = await apiPost<{ review: Review }>(`/jobs/${jobId}/review`, {
        rating,
        comment,
      });
      setReview(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  }

  if (review) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-neutral-900">Review</h2>
        <div className="mt-2">
          <StarRating value={review.rating} readOnly />
        </div>
        {review.comment && <p className="mt-2 text-sm text-neutral-900">“{review.comment}”</p>}
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
        Awaiting the customer&apos;s review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-neutral-900">Rate your provider</h2>
      <StarRating value={rating} onChange={setRating} />
      <Textarea label="Comment (optional)" name="comment" placeholder="How was the service?" />
      {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}
      <Button type="submit" loading={submitting}>Submit review</Button>
    </form>
  );
}
