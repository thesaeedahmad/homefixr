/**
 * User repository — the ONLY place that talks to the database for users.
 *
 * Keeping all User queries here means the service layer depends on a small,
 * stable interface rather than on Prisma directly (Dependency Inversion). If we
 * ever change how users are stored, only this file changes.
 */
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: { name: string; email: string; passwordHash: string; role: Role }) {
    return prisma.user.create({ data });
  },

  update(
    id: string,
    data: { name?: string; phone?: string; location?: string; avatarUrl?: string },
  ) {
    return prisma.user.update({ where: { id }, data });
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({ where: { id }, data: { passwordHash } });
  },
};
