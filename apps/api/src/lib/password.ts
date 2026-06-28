/**
 * Password hashing utilities (bcrypt).
 *
 * Passwords are NEVER stored in plain text. We hash with bcrypt (salted, slow
 * by design to resist brute force) — satisfying "Secure Password Storage"
 * (NFR-1). We use `bcryptjs` (pure JavaScript) to avoid native build steps,
 * keeping installation and free-tier deployment simple.
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
