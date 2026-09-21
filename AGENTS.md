# Agentic Primitives

## Mission

This repository owns reusable agents, skills, instructions, hooks, validators,
capability definitions, and MCP/tool contracts. A primitive is a versioned
capability, not a lifecycle state machine or a private publication surface.

## Boundaries

- Architecture Authority governs primitives through stable ADR and concept IDs.
- The Delivery Control Plane selects and executes approved capabilities.
- Distribution packages approved releases for consumer repositories.
- `.github-private` receives only reviewed, generated organization-agent
  projections.

Do not put secrets, runner state, organization issue state, or a second
authoritative lifecycle implementation here.

## Required metadata and checks

Every primitive has an `agentic-primitive` metadata block and an entry in the
machine-readable catalog. Run `pnpm primitive:check`, `pnpm migration:check`,
and `pnpm test` before a release. Releases include source commit, content
digest, governing ADRs, capability policy version, and compatibility targets.
