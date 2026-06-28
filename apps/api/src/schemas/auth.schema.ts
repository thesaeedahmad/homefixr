/**
 * Validation schemas for authentication requests (Zod).
 *
 * Defining the rules here gives us BOTH runtime validation and compile-time
 * types (via z.infer) from a single source (DRY). Note that registration only
 * allows CUSTOMER or PROVIDER — ADMIN accounts are created by seeding, never by
 * public sign-up (a security decision).
 */
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['CUSTOMER', 'PROVIDER']),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
