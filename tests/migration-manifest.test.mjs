import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMigrationManifest } from '../tools/validate-migration.mjs';

test('history-preserving Primitive extraction has an immutable manifest and source map', async () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = await validateMigrationManifest(root);
  assert.equal(result.manifest.target.repository, 'agentic-delivery-primitives');
  assert.ok(result.mappedCommits > 100);
});
