import test from 'node:test';
import assert from 'node:assert/strict';
import { collect, safeText } from '../tools/evidence.mjs';

test('evidence collector returns a privacy-limited schema and no credentials', () => {
  const report = collect({ base: null, runChecks: false });
  assert.equal(report.schemaVersion, 1);
  assert.equal(report.source, 'candidate-local-self-report');
  assert.equal(Array.isArray(report.changedFiles), true);
  assert.equal(Array.isArray(report.commits), true);
  assert.deepEqual(report.checks, []);
  assert.equal(Object.hasOwn(report, 'environment'), false);
  assert.equal(Object.hasOwn(report, 'remoteUrl'), false);
});

test('evidence fields normalize newlines and truncate long values', () => {
  assert.equal(safeText('hello\nworld', 20), 'hello world');
  assert.equal(safeText('x'.repeat(500), 12).length, 12);
});
