---
date: 2026-09-21
source-issue: https://github.com/agentic-delivery-lab/agentic-delivery/issues/52
decision-makers: Primitive maintainers
consulted: Architecture Authority and Delivery Control Plane maintainers
informed: Organization maintainers
domains:
  - agentic-primitives
required-enforcement:
  - deterministic
  - instructional
---

# Primitive release and projection boundary

## Context and Problem Statement

Reusable agents, skills, instructions, hooks, validators, capability
definitions, and MCP contracts must have one canonical authoring location.
Some GitHub surfaces require a generated copy, but that copy must not become a
second editable control plane or capability catalog.

## Decision Drivers

- Keep primitive source and metadata together.
- Make every release identifiable by an immutable commit and content digest.
- Allow `.github-private` and Distribution to consume approved projections
  without importing the whole repository.
- Fail closed on unknown tools, secret-like content, missing ADR references,
  or incompatible target surfaces.

## Decision Outcome

Agentic Primitives is canonical for reusable capability source. Its catalog and
release manifest define the approved set. Distribution and `.github-private`
receive generated or promoted projections with source repository, source
commit, content hash, governing ADRs, policy version, and compatibility target.
The projection is never edited in place; a change starts in this repository and
is promoted by a reviewed pull request.

Primitive releases use SemVer plus an immutable Git commit. A withdrawn
release remains identifiable but may not be newly promoted. A compatible
consumer may remain on an older release until an intentional upgrade or a
published security withdrawal requires a controlled rollback or replacement.

## Consequences

- Consumers can verify provenance and detect drift without filesystem-relative
  cross-repository references.
- A primitive may be distributed to multiple surfaces without duplicating its
  authority.
- Promotion requires release metadata and cross-repository validation.
- Runtime lifecycle, issue state, App credentials, and runner state remain
  outside this bounded context.

## More Information

This local decision refines the global architecture and traceability decisions
referenced by primitive metadata. Issue #52 is the plan-persistence source
record, not implementation authorization; official adoption requires a
separately authorized review issue and pull request.

## Confirmation

- Catalog validation covers every listed primitive and metadata block.
- Release metadata contains immutable source and Architecture references.
- Publication and Distribution validators reject missing provenance and
  prohibited tools or secrets.
