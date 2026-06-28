/**
 * Unit tests for password hashing (Node's built-in test runner — no extra deps).
 * Run with: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from './password';

test('hashPassword does not return the plain text', async () => {
  const hash = await hashPassword('secret123');
  assert.notEqual(hash, 'secret123');
  assert.ok(hash.length > 0);
});

test('verifyPassword accepts the correct password', async () => {
  const hash = await hashPassword('secret123');
  assert.equal(await verifyPassword('secret123', hash), true);
});

test('verifyPassword rejects an incorrect password', async () => {
  const hash = await hashPassword('secret123');
  assert.equal(await verifyPassword('wrong-password', hash), false);
});
