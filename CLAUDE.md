@AGENTS.md

# Aryan Narwani Portfolio

Aryan's personal portfolio at https://aryannarwani.com: who he is, what he builds with Nara
Intelligences, his experience, and a contact form.

- **For:** Nara Intelligences (listed among its projects in Nara Hub)
- **Repository:** https://github.com/Aryyaann/Aryan_Narwani_Portfolio (personal account, on
  purpose: it went back to `Aryyaann` in the GitHub reorganisation of 2026-11-23)

## Who you work for

Aryan Narwani runs Nara Intelligences alone: he sells, builds, deploys and answers the phone.
He writes in Spanish and reads your replies in Spanish. Code, comments, commit messages and
technical documentation are in English. The site's copy is in English.

## Read this before anything else

1. **The client.** Everything known about Nara Intelligences is in the Obsidian vault at
   `~/Nara-Vault/Nara`: the card `Nara Intelligences.md` and the knowledge base. As of
   2026-11-24 no meeting or note there is about the portfolio itself, so it says nothing
   about what the site must achieve beyond the brand facts (name, domain). What the site
   needs comes from what Aryan records there or tells you — never from your assumptions.
2. **Where the work stands.** `docs/HANDOFF.md`, then `docs/PLAN.md`.

## How Aryan wants you to work

- **Finish whole phases without waiting for "continúa".** He leaves while the work runs. Do
  routine decisions yourself; when a choice between real alternatives matters, explain the
  difference in a few lines and recommend one before choosing.
- **What needs him goes in `OWNER_ACTIONS.md`, and you keep going.** Credentials, business
  facts, legal answers, approvals: write them there and never invent the value. Stop only
  for something genuinely blocking.
- **Honest over pleasing.** Be critical, say when something is a bad idea, and never call
  work done that has not been verified. Say "unverified" when it is. Invent nothing: no
  figures, dates, clients, results or experience on the page that he has not given you.
- **Your own mistakes, at once and plainly.** If you broke or misstated something, say so
  in one or two sentences with the fix. Do not bury it.
- **Simple, sufficient, professional — and it must not break.** No shortcuts he did not ask
  for, no speculative abstractions, no dead code, no repetition. No framework or build step
  unless a milestone needs it.
- **The look is the site's own** (black, cyan accents, Syne / Instrument Serif / DM Mono),
  not the Nara FinOps house style. Changing it is his decision.
- **Keep the progress file true.** `progress/state.json` is what Aryan watches on Nara Hub.
  Update it whenever the state changes (see AGENTS.md).

## What needs his approval — only this

- **The database:** any change to `portfolio_contacts` or its policies in the Nara Dashboard
  Supabase project, and anything that deletes or rewrites real data. A real form submission
  also writes a row and emails him: ask first.
- **Limits:** spending money (a paid plan, a new service) and any new credential.
- **What the page says about him:** new claims, clients, figures or experience.

Everything else you do yourself, with judgement, and record: commits, pushes, deploys once
the gate passes, technical decisions. When you are unsure whether something is critical,
treat it as critical.

Never read or print a secret.

## Spending

He shares one usage budget across every project. Keep it lean: subagents only for
independent work; no multi-agent workflows unless he asks. When the work reaches a clean
checkpoint — committed, HANDOFF updated — tell him it is a good moment to start a fresh
conversation.
