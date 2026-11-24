# Handoff

**2026-11-24.** M1 verified against production (`docs/qa/M1-production-check.md`). M2
verified: `npm run verify` exists and passes (11 tests), pushes still deploy to Vercel
(`docs/qa/M2-verify.md`, `docs/qa/M2-codex.md`). The page itself has not changed since
2026-10-06.

## Next

1. M3: a gate test that a failed Supabase save still sends the email (Supabase aborted,
   Formspree intercepted, nothing really sent); then owner action #1 for the real email.
2. M4: *Nara Intelligences* everywhere; the hero name fitting at 390 px (add the gate check
   first and see it fail on today's page).

## Open questions for Aryan

GitHub Pages copy (switch off? it also serves the docs, which `.vercelignore` keeps off
Vercel), `www.aryannarwani.com` (no DNS), and what the portfolio is for — see the end of
`docs/PLAN.md`. His personal Gmail address was written into the docs in commit `f60a10f`
and removed in the next one; it remains in the public git history unless he approves a
history rewrite.
