# Changelog

## [Unreleased]

### Changed

- The draft Primitive release advances to `0.1.0-draft.4` and explicitly
  consumes Architecture draft `0.1.0-draft.4` at
  `61b2285334b5cff4ae2dba7875b132ad2a4a8502`.

- The draft Primitive release advances to `0.1.0-draft.3` and consumes
  Architecture draft `0.1.0-draft.2` at
  `9b06a4e2202e851cdc700921828aac49d4a90d9d`.

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
