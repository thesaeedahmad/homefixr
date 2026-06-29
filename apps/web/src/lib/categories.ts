/**
 * The fixed set of service categories (FR-10). Defined once and reused across
 * the post-a-job form and the browse filters (DRY). Values must match the
 * JobCategory enum in the API's Prisma schema.
 */
export const JOB_CATEGORIES = [
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'HANDYMAN', label: 'Handyman' },
  { value: 'CLEANING', label: 'Cleaning' },
] as const;

export type JobCategoryValue = (typeof JOB_CATEGORIES)[number]['value'];

/** Human-readable label for a category value. */
export function categoryLabel(value: string): string {
  return JOB_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
