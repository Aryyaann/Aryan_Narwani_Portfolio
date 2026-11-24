# M2 — The gate, 2026-11-24

`npm run verify` = `node --test tests/*.test.mjs && node scripts/verify.mjs`. Since M3 it also
runs `tests/contact-form.test.mjs` (`docs/qa/M3-review.md`). It needs the
network (the page loads GSAP, Lenis, Swiper and fonts from CDNs) and Playwright's Chromium
(`npx playwright install chromium` once on a new machine).

## What it checks

- **Without a browser:** every `href`/`src` and inline `url(…)` in `index.html`, and every
  `url(…)` in `css/`, points to a file that exists; every `href="#id"` has its element.
- **In headless Chromium at 1440×900 and 390×844**, after the preloader goes and the page
  is scrolled top to bottom: no JavaScript error, no console error, no failed request or
  HTTP ≥ 400, every `<img>` and same-origin CSS background decodes, the seven sections are
  there, and the page is no wider than the viewport.

## Proof it fails when it should

`tests/check-site.test.mjs` breaks a copy of the site one way at a time and expects the
gate to name it: a JavaScript error, a runtime 404, an image that does not decode, a missing
section, horizontal scroll at phone width, a missing referenced file, a missing inline
background image, an in-page link to nowhere, and single-quoted attributes. A further test
covers the local server's handling of a malformed URL.

## Run on `main`

```
✔ reads attributes in single quotes too
✔ the local server answers a malformed URL with 400 and keeps serving
✔ the unchanged site passes
✔ fails on a JavaScript error
✔ fails on a request that fails at runtime
✔ fails on an image that does not decode
✔ fails on a missing section
✔ fails on horizontal scroll at phone width
✔ fails on a referenced file that does not exist
✔ fails on a missing background image in an inline style
✔ fails on an in-page link to nowhere
ℹ tests 11  ℹ pass 11  ℹ fail 0
Site check passed (screenshots in .verify/).
```

Exit code 0.

## Deploys

The plan commit `f60a10f` deployed to Vercel Production (GitHub deployment `8027261121`,
status success) and `aryannarwani.com` served it: the Git link survived the repository's
move to NaraIntelligences and back. From this milestone `.vercelignore` keeps the plans,
tests and tooling off the deployed site.
