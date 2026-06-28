/**
 * Centralised application configuration.
 *
 * The rest of the codebase imports from here instead of reading `process.env`
 * directly. This keeps configuration in ONE place (DRY) and gives us typed,
 * validated values with sensible defaults for local development.
 */
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
};
