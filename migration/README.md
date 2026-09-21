# Migration evidence

`manifest.json` records the history-preserving extraction from the Control
Plane source. `source-commit-map.csv` is the generated mapping produced by the
pinned `git-filter-repo` run. It exists for traceability only; it is not a
Primitive catalog or runtime registry.

The manifest remains `local-prepared` until the repository is created,
reviewed, and protected by an authorized operator. Issue and pull-request URLs
remain the original GitHub URLs.
