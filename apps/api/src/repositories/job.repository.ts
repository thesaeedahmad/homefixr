/**
 * Job repository — the only place that runs database queries for jobs.
 */
import { Prisma, JobCategory, JobStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const jobRepository = {
  create(data: {
    customerId: string;
    category: JobCategory;
    title: string;
    description: string;
    location: string;
    photos: string[];
    budgetHint?: number;
  }) {
    return prisma.job.create({ data });
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: { customer: { select: { id: true, name: true } } },
    });
  },

  /** Browse OPEN jobs, optionally filtered by category and/or location (FR-30). */
  findOpen(filters: { category?: JobCategory; location?: string }) {
    const where: Prisma.JobWhereInput = { status: 'OPEN' };
    if (filters.category) where.category = filters.category;
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    return prisma.job.findMany({
      where,
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByCustomer(customerId: string) {
    return prisma.job.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  },

  update(
    id: string,
    data: { title?: string; description?: string; location?: string; budgetHint?: number },
  ) {
    return prisma.job.update({ where: { id }, data });
  },

  updateStatus(id: string, status: JobStatus) {
    return prisma.job.update({ where: { id }, data: { status } });
  },
};
