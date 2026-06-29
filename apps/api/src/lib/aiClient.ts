/**
 * Client for the Python AI microservice.
 *
 * Price recommendations are ADVISORY: if the AI service is slow or unavailable,
 * we must not break job posting or bidding. So every failure (timeout, network,
 * non-200) resolves to null and the UI simply hides the hint (graceful
 * degradation). This is the only place the API talks to the AI service (DRY).
 */
import { env } from './env';
import { logger } from './logger';

export interface PriceBand {
  min: number;
  typical: number;
  max: number;
}

export interface PriceRecommendation {
  category: string;
  hourlyRate: PriceBand;
  total: PriceBand | null;
}

export async function predictPrice(payload: {
  category: string;
  complexity: number;
  estimatedHours?: number;
}): Promise<PriceRecommendation | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${env.aiServiceUrl}/predict-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as PriceRecommendation;
  } catch (err) {
    logger.warn('AI price service unavailable', (err as Error).message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
