# M2 — Codex review, 2026-11-24

`codex exec -s read-only`, given the M2 acceptance criteria and the new files
(`package.json`, `.vercelignore`, `scripts/`, `tests/`). Two findings, both confirmed and
fixed, each with a regression test written first and seen failing:

1. **False pass on single-quoted attributes** (`scripts/check-site.mjs`). Only `href="…"` and
   `src="…"` were read, so `href='#nowhere'` or `src='missing.png'` slipped through. Now
   attributes are read in either quote style. Test: *reads attributes in single quotes too*.
2. **A malformed URL crashed the local server** (`scripts/check-site.mjs`).
   `decodeURIComponent('/%ZZ')` threw outside the `try`, so the test run hung instead of
   reporting. Now it answers 400 and keeps serving. Test: *the local server answers a
   malformed URL with 400 and keeps serving*.

Found while building, before the review: the first reference check mistook `url(%23n)` inside
an inline SVG in `css/base.css` for a file, and the gate did not see the project images at
all (they are inline `background-image`, not `<img>`). Both fixed, with the test *fails on a
missing background image in an inline style*; the decode test now covers backgrounds.
