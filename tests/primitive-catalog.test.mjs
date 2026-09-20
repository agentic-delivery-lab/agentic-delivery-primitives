import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import { validatePrimitiveCatalog } from '../tools/validate-primitive-catalog.mjs';

test('every extracted primitive has catalog and metadata coverage', async () => {
  assert.deepEqual(await validatePrimitiveCatalog(path.resolve(import.meta.dirname, '..')), { primitives: 14 });
});

test('empty primitive extension boundaries remain explicit', async () => {
  const root = path.resolve(import.meta.dirname, '..');
  for (const relativePath of [
    'agents/copilot/README.md',
    'instructions/README.md',
    'hooks/README.md',
    'scripts/README.md',
    'docs/decisions/README.md',
    'docs/decisions/ADP-0001-primitive-release-and-projection.md',
  ]) await access(path.join(root, relativePath));
});

test('draft release pins the extracted Architecture Authority', async () => {
  const { readFile } = await import('node:fs/promises');
  const release = JSON.parse(await readFile(path.resolve(import.meta.dirname, '../manifests/primitive-release.json'), 'utf8'));
  assert.equal(release.architecture.id, 'urn:agentic-delivery:architecture:authority');
  assert.equal(release.architecture.sourceCommit, '6ba3c1bfd7f2709d5070cb5c8155e2dea984f5b4');
});
