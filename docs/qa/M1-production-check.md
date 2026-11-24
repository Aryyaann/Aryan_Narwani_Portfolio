# M1 — Production check, 2026-11-24

Run by Claude from Aryan's Mac against the live site. No form was submitted.

## The live page is `HEAD`

`curl -sL <url> | cmp - index.html` at commit `e9b92c8`:

| URL | Host | Same as `HEAD` |
|---|---|---|
| https://aryannarwani.com/ | Vercel | yes |
| https://aryan-narwani-portfolio.vercel.app/ | Vercel | yes |
| https://aryyaann.github.io/Aryan_Narwani_Portfolio/ | GitHub Pages | yes |

`https://www.aryannarwani.com` has no DNS record (`dig` returns nothing).

## Every referenced file resolves

Each `href`/`src` in `index.html` (25, excluding the Google Fonts preconnect roots and the
`mailto:`), the 9 images in `assets/projects/` and the 13 files in `js/` (`main.js` and the 12
modules it imports): all HTTP 200 on
`aryannarwani.com`, including `assets/AryanNarwaniCV2026.pdf` and the pinned jsDelivr
scripts (GSAP 3.12.5, Lenis 1.1.13, Swiper 14.3.0). `https://github.com/Aryyaann`: 200.
`https://www.linkedin.com/in/aryannarwani`: 999 (LinkedIn's answer to automated requests;
unchecked).

## Headless Chromium

Playwright Chromium, page loaded with `networkidle` plus 6 s for the preloader and
animations:

```
{"vp":1440,"preloaderHidden":true,"hScroll":false,"sections":["hero","about","skills","projects","experience","focus","contact"],"imgsBroken":[],"errors":[],"failed":[]}
{"vp":390,"preloaderHidden":true,"hScroll":false,"sections":["hero","about","skills","projects","experience","focus","contact"],"imgsBroken":[],"errors":[],"failed":[]}
```

Seen in the 390 px screenshot: the outlined "Narwani" in the hero is clipped on the right
(goes to M4).

## Contact form storage (M3)

- `portfolio_contacts` (Supabase project `mmhhsocuxrrwttkiugby`): 1 row, created
  2026-10-06 10:32:31 UTC — the test of commit `50a07b8`.
- Policies: one, `Public can submit the contact form`, `INSERT` for `anon`.
- `GET /rest/v1/portfolio_contacts` with the publishable key: HTTP 401, `42501 permission
  denied` — visitors cannot read submissions.
- Formspree delivery: no message from `formspree.io` in `aryannarwani04@gmail.com` since
  2026-10-05. Unverified.
