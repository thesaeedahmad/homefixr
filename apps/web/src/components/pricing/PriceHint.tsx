'use client';

import { useEffect, useState } from 'react';
import { apiPost } from '@/lib/api';

/*
  AI fair-price hint (FR-17/FR-18).

  Shown on the post-a-job form (helps customers set expectations) and the bid
  form (guides providers towards a fair rate). It fetches a recommendation
  whenever the category or estimated hours change. If the AI service is
  unavailable the recommendation is null and this component renders nothing —
  so the surrounding form is never blocked (graceful degradation).
*/
type Band = { min: number; typical: number; max: number };
type Recommendation = { category: string; hourlyRate: Band; total: Band | null } | null;

export function PriceHint({
  category,
  description,
  estimatedHours,
}: {
  category?: string;
  description?: string;
  estimatedHours?: number;
}) {
  const [rec, setRec] = useState<Recommendation>(null);

  useEffect(() => {
    if (!category) {
      setRec(null);
      return;
    }
    let active = true;
    apiPost<{ recommendation: Recommendation }>('/pricing', { category, description, estimatedHours })
      .then((data) => {
        if (active) setRec(data.recommendation);
      })
      .catch(() => {
        if (active) setRec(null);
      });
    return () => {
      active = false;
    };
  }, [category, description, estimatedHours]);

  if (!rec) return null;

  return (
    <div className="rounded-md bg-success-600/10 px-3 py-2 text-sm text-success-600">
      <span className="font-medium">AI fair-price suggestion:</span>{' '}
      PKR {rec.hourlyRate.min}–{rec.hourlyRate.max}/hour
      {rec.total && (
        <>
          {' '}· estimated total PKR {rec.total.min}–{rec.total.max}
        </>
      )}
    </div>
  );
}
