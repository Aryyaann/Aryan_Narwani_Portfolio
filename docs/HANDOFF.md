# Handoff

**2026-11-24.** M1 and M2 verified. M3 at 3/4: the contact form is tested against
stand-ins (a failed or refused Supabase save still sends the email; nothing real is sent),
`docs/qa/M3-review.md`. Its last step, the real email reaching Aryan, waits on owner
action #1. `npm run verify`: 15 tests, passing. The page itself has not changed since
2026-10-06.

## Next

1. M4: *Nara Intelligences* everywhere; the hero name fitting at 390 px (add the gate check
   first and see it fail on today's page).
2. M3's last step when Aryan answers #1: one real submission with his OK, then mark M3
   verified.

## Open questions for Aryan

GitHub Pages copy (switch off? it also serves the docs, which `.vercelignore` keeps off
Vercel), `www.aryannarwani.com` (no DNS), and what the portfolio is for — see the end of
`docs/PLAN.md`. His personal Gmail address was written into the docs in commit `f60a10f`
and removed in the next one; it remains in the public git history unless he approves a
history rewrite.
