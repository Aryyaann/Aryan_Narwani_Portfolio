# M3 — Review of the contact form tests, 2026-11-24

Codex was at its usage limit, so an independent Claude subagent reviewed
`tests/contact-form.test.mjs` read-only, given the criteria and the code, not the
developer's reasoning.

## Findings

1. **Confirmed, fixed.** The stand-ins matched the Supabase project URL copied by hand; if
   `js/contact.js` moved to another project (it did in `50a07b8`) the request would have
   reached the real database. Now every request that is not to the local server or the
   page's CDNs is intercepted: `*.supabase.co` and `formspree.io` go to stand-ins, anything
   else is aborted and fails the test.
2. **Confirmed, fixed.** Only an unreachable Supabase was tested, not a refused save (RLS
   answers 401). New test *the email is still sent when Supabase refuses the save*; seen
   failing against a mutant that treats a 4xx as an exception.
3. **Confirmed, fixed.** The email was checked with `includes()` on its body, so an empty
   `FORMSPREE_ID` passed. Now the URL must be `https://formspree.io/f/meewzbpo` and the
   multipart body must hold exactly the four fields; seen failing with `FORMSPREE_ID = ''`.
4. **Rejected.** The tests depend on the CDN scripts: if jsDelivr fails, `initContact` never
   runs and the test fails. That is a loud failure, never a false pass, and the network
   dependency is documented in `docs/qa/M2-verify.md`. The status wait is now 10 s, so it
   fails quickly.
5. **Confirmed, fixed.** Waiting for the preloader was not needed (it has
   `pointer-events: none`); the wait and its export are gone.

## Mutants

Each was applied to `js/contact.js`, run, and reverted (`git checkout`):

| Change | Test that failed |
|---|---|
| A failed save throws instead of warning (the bug fixed in `50a07b8`) | the email is still sent when Supabase cannot be reached |
| A 4xx from Supabase throws | the email is still sent when Supabase refuses the save |
| `FORMSPREE_ID = ''` | the email is still sent when Supabase cannot be reached |

`npm run verify` afterwards: 15/15 tests, site check passed.
