# Plan

Written 2026-11-24 from what exists: the code, the git history (17 commits, last deploy
2026-10-06), the live site, and the vault (`~/Nara-Vault/Nara`). The vault has **no meeting
or note about the portfolio**; the only requirements it gives are brand facts (the official
name is *Nara Intelligences*, used consistently — knowledge base 0001, 0002, 0036). So this
plan proves and repairs what is already built and adds nothing new. New scope comes from
Aryan, recorded in the vault.

| # | Milestone | Status | Done |
|---|---|---|---|
| M1 | The site, live in production | verified | 4/4 |
| M2 | Verification gate and deploy pipeline | verified | 3/3 |
| M3 | Contact form proven end to end | active | 3/4 |
| M4 | Brand name and phone layout fixed | verified | 2/2 |

## M1 — The site, live in production · verified

Hero, about, skills, projects (9 agent cards), experience (flight path), focus and contact
sections, preloader, smooth scroll, CV download.

| Criterion | Check | Evidence |
|---|---|---|
| `aryannarwani.com` serves the current `main` | `curl` the page and `cmp` it with `index.html` at `HEAD` | Identical on 2026-11-24 (Vercel; also the `.vercel.app` alias and GitHub Pages) |
| Every referenced file resolves | Request each `href`/`src` in `index.html`, the 9 project images and the 13 files in `js/` | All 200 on 2026-11-24, CV PDF included |
| The page runs without errors at desktop and phone width | Headless Chromium at 1440×900 and 390×844 | 7 sections, preloader hidden, 0 JS errors, 0 failed requests, 0 broken images, no horizontal scroll |
| The CV downloads | `assets/AryanNarwaniCV2026.pdf` returns 200 | 2026-11-24 |

Recorded in `docs/qa/M1-production-check.md`. Not covered: the LinkedIn link answers bots
with HTTP 999, so it is unchecked by machine.

## M2 — Verification gate and deploy pipeline · verified

| Criterion | Check | Evidence |
|---|---|---|
| `npm run verify` serves the folder locally and fails on a JS error, a failed request, an image or CSS background that does not decode, a missing section, horizontal scroll at 390 px, a referenced file that does not exist, or an in-page link to nowhere | Each failure is provoked on a broken copy (`tests/check-site.test.mjs`) | 9 breakage tests pass, plus 2 from the Codex review |
| The gate passes on `main` | Exit code 0 | 11/11 tests, site check passed (2026-11-24) |
| A push to `main` still deploys to `aryannarwani.com` after the repository's move to NaraIntelligences and back | After the push, the live site serves the new commit | `f60a10f` deployed to Vercel Production and was live |

`.DS_Store` and `agentsimg/` (the 14 MB PNG originals of the WebP images, converted in
`afea5dc`) are git-ignored; `.vercelignore` keeps plans, tests and tooling off the live site.
Recorded in `docs/qa/M2-verify.md` and `docs/qa/M2-codex.md`.

## M3 — Contact form proven end to end · active

| Criterion | Check | State |
|---|---|---|
| A submission is saved to `portfolio_contacts` (Nara Dashboard Supabase) | Row in the table | **Done** — the test row of 2026-10-06 10:32 UTC, the minute of commit `50a07b8` |
| Visitors can insert but not read | Policy list; `GET` with the publishable key | **Done** — only an `INSERT` policy for `anon`; `GET` answers 401 `42501` (2026-11-24) |
| A failed save does not stop the email | Gate tests with stand-ins for Supabase and Formspree (nothing really sent): Supabase unreachable or refusing (401), the email still goes to `/f/meewzbpo` with the four fields and the success message shows | **Done** — `tests/contact-form.test.mjs`, each test seen failing against a broken `contact.js` (`docs/qa/M3-review.md`) |
| The email reaches Aryan | One real submission, approved by him, arrives in his inbox | **Sent, delivery unverified** — real message sent 2026-11-24 13:15 UTC: Supabase 201, Formspree 200 (`docs/qa/M3-live-test.md`). Not in his personal Gmail; owner action #1 asks him to check the inbox Formspree uses |

## M4 — Brand name and phone layout fixed · verified

| Criterion | Check | Evidence |
|---|---|---|
| The site says *Nara Intelligences* everywhere (it said *Nara Intelligence* 7 times: meta and Open Graph descriptions, hero, status line, about, experience) | Gate: `index.html` holds no "Nara Intelligence" without the *s* | Check seen failing on the old page (7), passing after the rename; live after the push |
| The name in the hero is not cut at phone width ("Narwani." was clipped at 390 px) | Gate: each name row fits the row that clips it, within the viewport, at 390 px | Seen failing on the old page (24–402 px); passing after; a sweep from 280 to 1024 px shows no cut |

Recorded in `docs/qa/M4-review.md`. The CV (`assets/AryanNarwaniCV2026.pdf`) does not
mention Nara, so it needed no rename.

## Not in this plan, for Aryan to decide

- **The GitHub Pages copy** at `aryyaann.github.io/Aryan_Narwani_Portfolio/` duplicates the
  site, and the repository's homepage points to it rather than `aryannarwani.com`.
  Recommendation: switch Pages off and point the homepage to `aryannarwani.com`.
- **`www.aryannarwani.com`** has no DNS record, so it does not open.
- **What the portfolio is for** (recruiters, Nara clients, both) and anything to add: a
  note in the vault is what turns it into milestones. Related: the CV presents Aryan as an
  AI & Data Engineer at Arbentia (Madrid, since 03/2026) and does not mention Nara; the site
  presents him as founder of Nara Intelligences, based in Bangalore.
