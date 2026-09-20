# Primitive metadata validator boundary

Primitive metadata is parsed from the `agentic-primitive` block in each
primitive source file and cross-checked against `manifests/primitive-catalog.yml`.
The metadata names governing ADRs, bounded contexts, kind, and enforcement; it
does not store secrets, mutable runtime state, or publication credentials.
