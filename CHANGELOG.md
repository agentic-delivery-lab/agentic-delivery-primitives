# Changelog

## [Unreleased]

### Changed

- Added a deterministic content digest for the canonical Primitive source
  tree; release provenance can now bind the source snapshot without hashing
  its own self-referential release field.

- The draft Primitive release now records the immutable source commit containing the extracted skill-boundary correction.

### Added

- Added the history-preserving extraction of reusable skills, the Codex
  delivery agent, and repository-delivery validators.
- Added primitive metadata, release, capability, and tool-policy contracts.
