/**
 * Database seed — creates the Administrator account.
 *
 * Admins are NOT created via public sign-up (a security decision), so we seed
 * one here. Credentials come from .env (ADMIN_EMAIL / ADMIN_PASSWORD). Running
 * this repeatedly is safe (upsert).
 *
 * Run with: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import { env } from '../src/lib/env';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main() {
  const { email, name, password } = env.admin;
  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: { email, name, role: 'ADMIN', passwordHash, isVerified: true },
  });

  console.log(`Admin account ready: ${admin.email} (role: ${admin.role})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
