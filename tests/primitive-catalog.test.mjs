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
