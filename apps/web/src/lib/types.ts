/**
 * Shared front-end types. The REST API is the source of truth for these shapes
 * (see docs/02-design/api.md); we mirror the parts the UI needs here.
 */
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export type Job = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  budgetHint: number | null;
  status: JobStatus;
  photos: string[];
  createdAt: string;
  customer?: { id: string; name: string };
};
