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
| M3 | Contact form proven end to end | active | 2/4 |
| M4 | Brand name and phone layout fixed | pending | 0/2 |

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
| A failed save does not stop the email | Gate test: Supabase request aborted, Formspree intercepted (nothing really sent); the Formspree request is still made and the success message shows | To do |
| The email reaches Aryan | One real submission, approved by him, arrives in his inbox | **Unverified** — no Formspree email in Aryan's personal Gmail since 2026-10-05; the receiving inbox is unknown (owner action #1) |

## M4 — Brand name and phone layout fixed · pending

| Criterion | Check |
|---|---|
| The site says *Nara Intelligences* everywhere (today *Nara Intelligence*, 7 times: meta and Open Graph descriptions, hero, status line, about, experience) | `grep` finds no "Nara Intelligence" without the *s*; the gate passes |
| The name in the hero is not cut at phone width (today "Narwani" is clipped on the right at 390 px) | A gate check that the hero name's box fits the viewport at 390 px, seen failing on today's page first |

## Not in this plan, for Aryan to decide

- **The GitHub Pages copy** at `aryyaann.github.io/Aryan_Narwani_Portfolio/` duplicates the
  site, and the repository's homepage points to it rather than `aryannarwani.com`.
  Recommendation: switch Pages off and point the homepage to `aryannarwani.com`.
- **`www.aryannarwani.com`** has no DNS record, so it does not open.
- **What the portfolio is for** (recruiters, Nara clients, both) and anything to add: a
  note in the vault is what turns it into milestones.
