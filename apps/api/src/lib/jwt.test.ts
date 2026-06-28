/**
 * Unit tests for JWT signing/verification (Node's built-in test runner).
 * Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signToken, verifyToken } from './jwt';

test('signToken then verifyToken round-trips the payload', () => {
  const token = signToken({ sub: 'user-1', role: 'CUSTOMER' });
  const payload = verifyToken(token);
  assert.equal(payload.sub, 'user-1');
  assert.equal(payload.role, 'CUSTOMER');
});

test('verifyToken throws on a tampered token', () => {
  const token = signToken({ sub: 'user-1', role: 'CUSTOMER' });
  assert.throws(() => verifyToken(token + 'tampered'));
});
