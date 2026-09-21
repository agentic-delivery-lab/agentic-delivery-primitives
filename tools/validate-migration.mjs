import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const SHA = /^[0-9a-f]{40}$/i;
const ZERO = '0'.repeat(40);

function fail(message) {
  throw new Error(`Migration manifest check: ${message}`);
}

async function git(root, args) {
  try {
    return (await execFileAsync('git', ['-C', root, ...args], { encoding: 'utf8' })).stdout.trim();
  } catch (error) {
    fail(`git ${args.join(' ')} failed: ${error.message}`);
  }
}

export async function validateMigrationManifest(root) {
  const manifestPath = path.join(root, 'migration', 'manifest.json');
  const schemaPath = path.join(root, 'migration', 'manifest.v1.schema.json');
  const mapPath = path.join(root, 'migration', 'source-commit-map.csv');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  if (manifest.schemaVersion !== 1 || schema.properties?.schemaVersion?.const !== 1) fail('schema version must be 1');
  if (manifest.$schema !== './manifest.v1.schema.json') fail('manifest must identify the local schema');
  if (manifest.source?.repository !== 'agentic-delivery-lab/agentic-delivery') fail('source repository is not the migration source');
  if (!SHA.test(manifest.source?.commit ?? '')) fail('source commit is not an immutable SHA');
  if (!SHA.test(manifest.target?.initialImportCommit ?? '')) fail('initial import commit is not an immutable SHA');
  if (manifest.target?.defaultBranch !== 'main') fail('target default branch must be main');
  if (manifest.history?.strategy !== 'filtered-history-with-source-map') fail('history strategy is not history-preserving');
  if (manifest.history?.filterTool?.name !== 'git-filter-repo') fail('filter tool is not git-filter-repo');
  if (!/^\d+\.\d+\.\d+$/.test(manifest.history?.filterTool?.version ?? '')) fail('filter tool version is not pinned');
  if (!SHA.test(manifest.history?.filterTool?.tagCommit ?? '')) fail('filter tool tag commit is not pinned');
  if (manifest.sourceCommitMap !== 'source-commit-map.csv') fail('source map must be local and explicit');
  if (manifest.issueAndPullRequestUrls !== 'preserved') fail('issue and pull-request URL policy is not preserved');
  if (manifest.publication !== 'local-prepared') fail('publication status must remain local-prepared');
  const map = await readFile(mapPath, 'utf8');
  const lines = map.split(/\r?\n/).filter(Boolean);
  if (lines.shift()?.trim() !== 'old                                      new') fail('source map header is invalid');
  const sourceCommits = new Set();
  const targetCommits = new Set();
  for (const [index, line] of lines.entries()) {
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 2 || !SHA.test(fields[0]) || !(SHA.test(fields[1]) || fields[1] === ZERO)) {
      fail(`source map line ${index + 2} is invalid`);
    }
    if (sourceCommits.has(fields[0])) fail(`source map repeats source commit ${fields[0]}`);
    sourceCommits.add(fields[0]);
    if (fields[1] !== ZERO) targetCommits.add(fields[1]);
  }
  if (lines.length === 0) fail('source map is empty');
  if (!targetCommits.has(manifest.target.initialImportCommit)) fail('initial import commit is absent from the source map');
  if (await git(root, ['cat-file', '-t', manifest.target.initialImportCommit]) !== 'commit') fail('initial import commit is not present in target history');
  return { manifest, mappedCommits: lines.length };
}

const root = process.argv[2] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  const result = await validateMigrationManifest(root);
  process.stdout.write(`Migration manifest check passed: ${result.mappedCommits} source commit mappings.\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
