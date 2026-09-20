import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { validatePrimitiveCatalog } from '../tools/validate-primitive-catalog.mjs';

test('every extracted primitive has catalog and metadata coverage', async () => {
  assert.deepEqual(await validatePrimitiveCatalog(path.resolve(import.meta.dirname, '..')), { primitives: 14 });
});
