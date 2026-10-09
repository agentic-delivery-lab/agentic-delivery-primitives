import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { replayEvaluation } from '../tools/replay-evaluation.mjs';

const root = path.resolve(import.meta.dirname, '..');
const architectureSchemaPath = path.resolve(
  root,
  '../agentic-delivery-architecture/architecture/contracts/evaluation-report.schema.json',
);
const generatedAt = '2026-10-09T00:00:00.000Z';

test('offline evaluation replay validates pinned artifacts and returns reproducible evidence', async () => {
  const first = await replayEvaluation({ root, architectureSchemaPath, generatedAt });
  const second = await replayEvaluation({ root, architectureSchemaPath, generatedAt });

  assert.deepEqual(first.report, second.report);
  assert.equal(first.report.classification, 'synthetic');
  assert.equal(first.report.evaluationMode, 'offline');
  assert.equal(first.report.dataset.caseIds.length, 4);
  assert.equal(first.report.results.deterministicChecks.length, 4);
  assert.deepEqual(first.report.results.semanticJudgments, []);
  assert.equal(first.report.baseline.status, 'measured');
  assert.equal(first.report.comparison.claim, 'no-change');
  assert.equal(first.report.review.status, 'pending');
  assert.equal(first.report.recommendation.action, 'owner-issue');
  assert.equal(first.report.recommendation.ownerIssue, 'https://github.com/agentic-delivery-lab/agentic-delivery-primitives/issues/3');
  assert.equal(
    first.report.$schema,
    'https://github.com/agentic-delivery-lab/agentic-delivery-architecture/blob/d6af08cf503b9dc06f6b0f706c843b23cfe61a3e/architecture/contracts/evaluation-report.schema.json',
  );
  assert.deepEqual(first.report.results.deterministicChecks.map(({ outcome }) => outcome), [
    'pass', 'pass', 'pass', 'pass',
  ]);

  const candidatePins = first.report.dependencies.filter(({ id }) => id.startsWith('candidate-'));
  const baselinePins = first.report.dependencies.filter(({ id }) => id.startsWith('baseline-'));
  assert.equal(candidatePins.length, 2);
  assert.equal(baselinePins.length, 2);
  assert.ok(candidatePins.every(({ sourcePin }) => sourcePin.commit === first.candidateCommit));
  assert.ok(baselinePins.every(({ sourcePin }) => sourcePin.commit === 'e4933566fbf5b0f593830f8933f18fbd21024fa7'));
  assert.equal(first.reportSchemaValid, true);
});
