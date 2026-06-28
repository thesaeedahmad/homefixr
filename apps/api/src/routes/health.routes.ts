/**
 * Health-check route.
 *
 * GET /api/health is a lightweight "liveness probe". Render (our host) and any
 * uptime monitor can call it to confirm the API is running. It also proves the
 * scaffold boots correctly during development.
 */
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'homefixr-api',
    timestamp: new Date().toISOString(),
  });
});

export default router;
