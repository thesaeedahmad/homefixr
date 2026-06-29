/**
 * Unit tests for the RBAC middleware (authenticate + authorize).
 * These verify access control logic WITHOUT needing a server or database, by
 * passing minimal fake req/res/next objects.
 * Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import { authenticate, authorize } from './auth';
import { signToken } from '../lib/jwt';

/** Builds a fake Response that records the status and JSON body. */
function fakeRes() {
  const res: Partial<Response> & { statusCode?: number; body?: unknown } = {};
  res.status = ((code: number) => {
    res.statusCode = code;
    return res as Response;
  }) as Response['status'];
  res.json = ((payload: unknown) => {
    res.body = payload;
    return res as Response;
  }) as Response['json'];
  return res as Response & { statusCode?: number; body?: unknown };
}

test('authenticate rejects a request with no Authorization header (401)', () => {
  const req = { headers: {} } as Request;
  const res = fakeRes();
  let nextCalled = false;
  authenticate(req, res, () => {
    nextCalled = true;
  });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('authenticate accepts a valid Bearer token and sets req.user', () => {
  const token = signToken({ sub: 'user-1', role: 'PROVIDER' });
  const req = { headers: { authorization: `Bearer ${token}` } } as Request;
  const res = fakeRes();
  let nextCalled = false;
  authenticate(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
  assert.equal(req.user?.id, 'user-1');
  assert.equal(req.user?.role, 'PROVIDER');
});

test('authorize allows a user whose role is permitted', () => {
  const req = { user: { id: 'u1', role: 'ADMIN' } } as Request;
  const res = fakeRes();
  let nextCalled = false;
  authorize('ADMIN')(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
});

test('authorize blocks a user whose role is not permitted (403)', () => {
  const req = { user: { id: 'u1', role: 'CUSTOMER' } } as Request;
  const res = fakeRes();
  let nextCalled = false;
  authorize('ADMIN')(req, res, () => {
    nextCalled = true;
  });
  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});
