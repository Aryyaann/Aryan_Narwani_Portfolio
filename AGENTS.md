# How this repository is built

The method comes from the Nara Sales Agent build: milestones with verification gates,
review separated from development, and evidence before claims. This file is the Nara Hub
template (`nara-hub/templates/project/AGENTS.md`) adapted to this repository.

## This repository

Aryan's personal portfolio: one static page (`index.html`, `css/`, `js/` as ES modules,
`assets/`), no build step. `package.json` exists only for the gate (Playwright). GSAP, ScrollTrigger, Lenis and Swiper
come from jsDelivr at pinned versions; fonts from Google Fonts. The contact form saves to
the `portfolio_contacts` table of the Nara Dashboard Supabase project (publishable key,
insert-only for `anon`) and sends the email through Formspree.

Live at `https://aryannarwani.com` (Vercel). GitHub Pages also serves a copy at
`https://aryyaann.github.io/Aryan_Narwani_Portfolio/`.

## The plan

`docs/PLAN.md` holds the milestone sequence. Each milestone has acceptance criteria and the
checks that prove them. A milestone is **done** only when every criterion has evidence (a
passing test, a recorded run, a reviewed document) — never because the code was written.

## The loop, per milestone

1. Implement. Parallel subagents only when their file sets do not overlap.
2. Static checks: the reference check inside the gate.
3. Tests for what can break: the page loading without errors at desktop and phone width,
   every referenced file resolving, and the contact form where input crosses a trust
   boundary.
4. **Adversarial review, by a different model.** If the Codex CLI is installed (`which codex`),
   Codex reviews, read-only, before the milestone is committed:

   ```sh
   codex exec -s read-only "You are an adversarial reviewer. Review ONLY the changes of
     milestone M<n>: run git status, git diff and git diff --staged (or git diff <base>...HEAD
     for committed work). Acceptance criteria: <paste them>. Try to break this change. Report
     only confirmed defects — security holes, wrong results, data loss, repetition, code that
     is not needed — each with file:line, what fails and how to reproduce it. Change nothing." \
     < /dev/null > docs/qa/M<n>-codex.md
   ```

   (`codex exec review` cannot take custom instructions together with `--uncommitted`,
   `--base` or `--commit`, so the criteria go through plain `codex exec`; and outside a
   terminal it waits for more input on stdin unless that is closed, hence `< /dev/null`.) Without Codex, an
   independent Claude subagent does it. Either way the reviewer gets the criteria and the diff, **not**
   the developer's reasoning. Treat its findings as claims to check, not facts: each one you
   confirm gets a regression test **before** the fix, and each one you reject gets a line
   saying why. Both go in `docs/qa/`.
5. The gate passes.
6. One commit for the verified milestone, pushed. Update `progress/state.json` in the same
   commit.

## The gate: `npm run verify`

Runs the gate's own tests (each provokes one breakage on a copy of the site and expects
the gate to name it), then checks this folder: every referenced file exists, every in-page
link has its target, and in headless Chromium at 1440 and 390 px there is no JavaScript
error, failed request, undecodable image, missing section or horizontal scroll. Details in
`docs/qa/M2-verify.md`. It needs the network (CDN scripts and fonts) and, on a new machine,
`npx playwright install chromium`. A new check is added with a test that breaks a copy and
sees it fail first.

Write the output to a log and check the exit code — **never pipe it through `grep`**, which
swallows the failure.

## Commits

Imperative subject, no `feat:`-style prefixes. The body says **why**, in prose: what was
wrong or missing, and what the change does about it. End with the co-author line. Commit
and push each verified change; the push is what updates the progress page.

## Databases and migrations

This site writes to one table it does not own: `portfolio_contacts` in the Nara Dashboard
Supabase project. Any change to that table or its policies is a migration in that project,
approved by Aryan first.

- **Never edit a migration that has been applied.** Write a new one. An edited migration
  silently diverges from production.
- Dry-run a migration before applying it, and say exactly what each one changes.
- The form must keep sending the email when the database write fails (it does today:
  `js/contact.js`).

## Integrations

Anything that needs credentials you do not have is built against a contract, tested with a
local adapter or recorded fixtures, and reported as **unverified live** until it has
actually run against the real service. Formspree is unverified live until Aryan confirms the
email arrives (see `OWNER_ACTIONS.md`). Never submit the real form without his OK: it
writes a row and sends him an email.

## Progress: `progress/state.json`

Aryan watches every project on Nara Hub, which reads this file from GitHub.
Keep it true; it is the single source for "where is this":

```json
{
  "status": "planning | building | waiting | done",
  "now": "one line: what is happening right now",
  "milestones": [
    { "id": "M1", "title": "…", "status": "pending | active | verified", "done": 3, "total": 5 }
  ],
  "waitingOn": ["what only Aryan can do, each one line (also in OWNER_ACTIONS.md)"],
  "lastVerify": { "at": "ISO time", "passed": true, "tests": 120 },
  "updatedAt": "ISO time"
}
```

`waiting` means blocked on Aryan. A milestone is `verified` only under the rules above.
`lastVerify` is the last `npm run verify` run; `tests` counts the gate's own tests.

## Documents that stay current

| File | Purpose |
|---|---|
| `docs/PLAN.md` | Milestones, acceptance criteria, gates |
| `docs/HANDOFF.md` | Where the work stands and the next actions — updated at every checkpoint, so an interrupted session resumes without losing anything |
| `OWNER_ACTIONS.md` | Only what Aryan still has to do, with what it unblocks and its step-by-step in the format Nara Hub reads (below); done items are deleted |
| `docs/adr/` | One short record per decision that is expensive to reverse |
| `docs/qa/` | Review findings, recorded checks, and what was done about each |
| `docs/KNOWN_LIMITATIONS.md` | What does not work yet, said plainly |

## OWNER_ACTIONS.md: a step-by-step for every open item

Aryan does his part from Nara Hub's "Te toca a ti", which opens each item's step-by-step.
Keep the table (`#` and `State` columns); below it, under `## Paso a paso`, one section per
open item headed `### #N — título` (N = its `#`), in Spanish:

- one action per step, in order; the full URL of where to go; buttons and menus named exactly
  as on screen, in « »;
- commands in ```` ```sh ```` blocks, complete (with their `cd`), ready to copy and paste;
  nothing to edit inside them except a value only he has, written `<así>` and explained;
- never a secret in the file or on a command line: commands that ask for the value
  (`npx vercel env add …`) or `read -s` into a git-ignored file;
- end with `**Hecho cuando:**` — how he knows it worked and what to tell you.

Invent no step you cannot check; say so in the step instead.

**The file holds only what is still open** (Aryan, 2026-11-23: it must not grow long). When an
item is done, delete its row and its section in the commit that records it done; what it
changed goes to `docs/HANDOFF.md` or `docs/qa/`, a how-to worth keeping to its own doc, and git
keeps the old text. Numbers are never reused: a line under the intro says the next one.

## Deploying

A push to `main` deploys through Vercel's Git integration (proven again on 2026-11-24
after the repository's move to NaraIntelligences and back). `.vercelignore` keeps plans,
tests and tooling off the live site; a new top-level file that is not part of the page goes
there too. Do not assume a push deployed: check its Vercel status
(`gh api repos/Aryyaann/Aryan_Narwani_Portfolio/commits/<sha>/status`) and compare
`https://aryannarwani.com/` with `index.html` at `HEAD`.
