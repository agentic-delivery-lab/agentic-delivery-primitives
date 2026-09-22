# Migration evidence

`manifest.json` records the history-preserving extraction from the Control
Plane source. `source-commit-map.csv` is the generated mapping produced by the
pinned `git-filter-repo` run. It exists for traceability only; it is not a
Primitive catalog or runtime registry.

The manifest remains `local-prepared` until the repository is created,
reviewed, and protected by an authorized operator. Issue and pull-request URLs
remain the original GitHub URLs.

The filtered history and source map were generated from the supplied `main`
snapshot `8b9bd77e1cb6008ce9dab3bbe8652ab7979b4c99` with the pinned tool. The
manifest and map are checked against that immutable source before publication;
changing metadata alone is not sufficient.
