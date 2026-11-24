# Handoff

**2026-11-24.** M1, M2 and M4 verified; M3 at 3/4. M4 renamed the company to *Nara
Intelligences* on the page and fixed the hero name being cut on phones
(`docs/qa/M4-review.md`). `npm run verify`: 19 tests, passing. The only open work is M3's
last step: a real message was sent on 2026-11-24 (Supabase 201, Formspree 200,
`docs/qa/M3-live-test.md`) but has not been seen in an inbox; owner action #1.

## Next

1. When Aryan confirms the test email arrived (#1), mark M3 verified (4/4) and delete #1.
   If it never arrived, the Formspree form's settings are the next place to look.
2. Anything else comes from Aryan (see the open questions).

## Open questions for Aryan

GitHub Pages copy (switch off? it also serves the docs, which `.vercelignore` keeps off
Vercel), `www.aryannarwani.com` (no DNS), and what the portfolio is for — see the end of
`docs/PLAN.md`. His personal Gmail address was written into the docs in commit `f60a10f`
and removed in the next one; it remains in the public git history unless he approves a
history rewrite.
The CV and the site describe him differently (see the end of `docs/PLAN.md`).
