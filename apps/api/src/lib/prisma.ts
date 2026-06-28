/**
 * Prisma client singleton.
 *
 * Prisma is our ORM: it gives type-safe database queries and uses parameterised
 * SQL under the hood (preventing SQL injection — NFR-1). We export a single
 * shared instance so the whole API reuses one connection pool.
 *
 * This is the data-access foundation; repositories will import it from
 * Iteration 1 onward. No queries are written in Iteration 0.
 */
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
