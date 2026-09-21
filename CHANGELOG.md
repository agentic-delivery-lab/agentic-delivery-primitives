# Changelog

## [Unreleased]

### Changed

- The draft Primitive release advances to `0.1.0-draft.2` at source commit
  `a39267da377328dbfb1ed210a23b2628c224bed6`, pins the current Architecture
  Authority commit, and records the canonical source digest.

- Added a deterministic content digest for the canonical Primitive source
  tree; release provenance can now bind the source snapshot without hashing
  its own self-referential release field.

- The draft Primitive release now records the immutable source commit containing the extracted skill-boundary correction.

### Added

- Added the history-preserving extraction of reusable skills, the Codex
  delivery agent, and repository-delivery validators.
- Added primitive metadata, release, capability, and tool-policy contracts.
