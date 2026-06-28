/**
 * JSON Web Token (JWT) helpers.
 *
 * After a successful login/registration we issue a signed token containing the
 * user id (`sub`) and `role`. The client sends it back on each request; the
 * server verifies it instead of keeping server-side sessions (stateless auth,
 * simple to scale and to explain). One module owns all token logic (DRY).
 */
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './env';

export interface JwtPayload {
  sub: string; // user id
  role: string; // CUSTOMER | PROVIDER | ADMIN
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
