# M4 — Brand name and phone layout, 2026-11-24

## The checks came first

Two gate checks were added and seen failing on the page as it was:

```
- index.html says "Nara Intelligence" 7 time(s); the name is "Nara Intelligences"
- [phone] hero name is cut by the 390px viewport: "Narwani." spans 24–402px
```

Then the fix: the seven mentions renamed (meta and Open Graph descriptions, hero tag,
status line, about, experience title and description), and on screens ≤ 640 px the second
name row gets `font-size: clamp(2rem, 12vw, 4.2rem)` instead of keeping hero.css's 3.5rem
minimum. Desktop is unchanged (the rule sits in the ≤ 640 px block of `responsive.css`).

## Review

Codex was at its usage limit, so an independent Claude subagent reviewed the diff
read-only, given the criteria. It confirmed the copy (only the seven renames) and the
cascade (same specificity, `responsive.css` loads last), and found:

1. **Confirmed, fixed.** The check compared the name with the viewport, but each name row
   hides its overflow and ends 24 px before the viewport, so a cut of up to 24 px passed.
   The check now measures against the row within the viewport. Test *fails on a hero name
   cut by its row but inside the viewport*, seen failing first.
2. **Confirmed, fixed.** With a 2.5rem minimum the name was still cut below about 290 px
   (Galaxy Fold closed, 280 px). The minimum is now 2rem and the size 12vw (12.5vw left the
   name less than 1 px over at 280 px).
3. **Confirmed, fixed.** The 1.5 s pause for the lines under the name only matters to the
   screenshot; it now runs only when screenshots are taken.

While building, the gate's screenshots were found to catch the hero half-drawn (the
entrance runs about 2.5 s after the preloader). The gate now waits for the name to be
revealed before measuring, and fails if it never is (test *fails on a hero name that is
never revealed*).

## Widths

The gate checks 1440 and 390 px. A one-off sweep with the same checks at 280, 320, 360,
375, 414, 640, 641, 768 and 1024 px: no problems. Without the CSS fix, 320, 360 and 375 px
were cut too.

`npm run verify` afterwards: 19/19 tests, site check passed.
