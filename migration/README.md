# Migration evidence

`manifest.json` records the history-preserving extraction from the Control
Plane source. `source-commit-map.csv` is the generated mapping produced by the
pinned `git-filter-repo` run. It exists for traceability only; it is not a
Primitive catalog or runtime registry.

The manifest remains `local-prepared` until the repository is created,
reviewed, and protected by an authorized operator. Issue and pull-request URLs
remain the original GitHub URLs.

The current draft manifest was prepared from the planning branch
`67d328b46d84ae599ebfe65ef550d156f689e112`. It is not yet the extraction of
the supplied `main` snapshot `8b9bd77e1cb6008ce9dab3bbe8652ab7979b4c99`.
Regenerate the filtered history and source map with the pinned tool from that
snapshot before publication. Do not make the draft appear ready by changing
the manifest metadata alone.
