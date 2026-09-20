import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'manifests/primitive-catalog.yml');

const entries = [
  ['codex-delivery', 'agents/codex/codex-delivery.md'],
  ['architecture-decision', 'skills/architecture-decision/SKILL.md'],
  ['delivery-workflow', 'skills/delivery-workflow/SKILL.md'],
  ['plain-language-communication', 'skills/plain-language-communication/SKILL.md'],
  ['ubiquitous-language', 'skills/ubiquitous-language/SKILL.md'],
  ['issue-branch-name-validator', 'validators/repository-delivery/validate-branch-name.mjs'],
  ['commit-range-validator', 'validators/repository-delivery/validate-commit-range.mjs'],
  ['changelog-structure-validator', 'validators/repository-delivery/validate-changelog.mjs'],
  ['gitmoji-validator', 'validators/repository-delivery/validate-gitmoji.mjs'],
  ['pull-request-body-validator', 'validators/repository-delivery/validate-pull-request-body.mjs'],
  ['pull-request-branch-validator', 'validators/repository-delivery/validate-pull-request-branch.mjs'],
  ['pull-request-title-validator', 'validators/repository-delivery/validate-pull-request-title.mjs'],
  ['source-issue-validator', 'validators/repository-delivery/validate-source-issue.mjs'],
  ['toolchain-policy-validator', 'validators/repository-delivery/lib/toolchain.mjs'],
];

export async function validatePrimitiveCatalog(repositoryRoot = root) {
  const catalog = await readFile(path.join(repositoryRoot, 'manifests/primitive-catalog.yml'), 'utf8');
  const errors = [];
  if (!/^schemaVersion: 1\s*$/m.test(catalog)) errors.push('catalog schemaVersion must be 1');
  const ids = new Set();
  for (const [id, relativePath] of entries) {
    if (!catalog.includes(`  - id: ${id}`)) errors.push(`catalog is missing ${id}`);
    if (ids.has(id)) errors.push(`primitive id is duplicated: ${id}`);
    ids.add(id);
    const file = path.join(repositoryRoot, relativePath);
    let source;
    try { source = await readFile(file, 'utf8'); } catch (error) { errors.push(`${relativePath} cannot be read: ${error.message}`); continue; }
    const match = source.match(/agentic-primitive:\s*(\{[^\n]+\})/);
    if (!match) errors.push(`${relativePath} is missing agentic-primitive metadata`);
    else {
      try {
        const metadata = JSON.parse(match[1]);
        if (metadata.id !== id) errors.push(`${relativePath} metadata id does not match ${id}`);
        if (!Array.isArray(metadata.adrs) || metadata.adrs.length === 0) errors.push(`${relativePath} metadata requires ADR references`);
        if (!Array.isArray(metadata.domains) || metadata.domains.length === 0) errors.push(`${relativePath} metadata requires domain references`);
      } catch (error) { errors.push(`${relativePath} metadata is not valid JSON: ${error.message}`); }
    }
  }
  let release;
  try {
    release = JSON.parse(await readFile(path.join(repositoryRoot, 'manifests/primitive-release.json'), 'utf8'));
  } catch (error) {
    errors.push(`manifests/primitive-release.json cannot be read: ${error.message}`);
  }
  if (release) {
    if (release.schemaVersion !== 1) errors.push('primitive release schemaVersion must be 1');
    if (!/^urn:agentic-delivery:primitive-release:/.test(release.releaseId ?? '')) errors.push('primitive release releaseId is invalid');
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(release.version ?? '')) errors.push('primitive release version must be SemVer');
    if (!['draft', 'released', 'withdrawn'].includes(release.status)) errors.push('primitive release status is invalid');
    if (release.architecture?.id !== 'urn:agentic-delivery:architecture:authority') errors.push('primitive release architecture id is invalid');
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(release.architecture?.version ?? '')) errors.push('primitive release architecture version must be SemVer');
    if (!/^[0-9a-f]{40}$/.test(release.architecture?.sourceCommit ?? '')) errors.push('primitive release architecture sourceCommit must be immutable');
    if (!/^[0-9a-f]{7,}$/.test(release.sourceCommit ?? '')) errors.push('primitive release sourceCommit must be an immutable commit reference');
    if (release.contentSha256 !== null && !/^[0-9a-f]{64}$/.test(release.contentSha256 ?? '')) errors.push('primitive release contentSha256 must be a SHA-256 digest or null while draft');
    if (typeof release.capabilityPolicyVersion !== 'string' || !release.capabilityPolicyVersion) errors.push('primitive release capabilityPolicyVersion is required');
  }
  if (errors.length > 0) throw new Error(`primitive catalog check failed:\n${errors.join('\n')}`);
  return { primitives: entries.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await validatePrimitiveCatalog(process.argv[2] ?? root);
    process.stdout.write(`primitive catalog check passed: ${result.primitives} primitives.\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
