---
name: craft-floor
description: Load immediately before writing or editing interface code or design tokens (HTML, CSS, React, JSX, Vue, Svelte, Tailwind, tokens.json) and before saying any UI is done. Use when about to build, fix, restyle, theme or polish a page, screen or component. Gives the verify list, the refuse list (WCAG 2.2 floors that are never waived), how to waive a rule honestly, and the definition of done, which needs the evidence in the message.
---

# Craft floor

Source: rewrites the idea of impeccable's craft-floor verify/refuse list (Apache-2.0); text and rule mapping are ours.

The floor holds the mechanics; it never picks the direction. Direction lives in DESIGN.md and the lever settings
(see the `design` skill). When every check is green, spend the remaining effort on the direction, not on more polish.

Each `rule:<id>` below has its why and a pass/fail example in the design skill's `knowledge/rule-notes.json`.
Where a check says *by eye*, judge it on a rendered artifact or screenshot and label it Inferred.

## Before the first edit

1. **Tokens only.** Every colour, font size, line height, space, radius, duration and easing in code references a
   token (a CSS custom property such as `--color-accent` generated from tokens.json). A value that is not there
   means a lever change or a token addition, never a literal.
2. **Surface.** Know whether the screen is `marketing` or `app`; the rules differ.
3. **States.** Know which states each component needs (hover, focus-visible, active, disabled, invalid, loading).
4. **Real content.** Build with the real copy, data and images, at real lengths.

## Verify

| Area | Check |
|---|---|
| Contrast | body text 4.5:1, large text 3:1, UI parts and focus ring 3:1, in every theme and contrast mode. Run `node engine/contrast.mjs tokens.json` from the design skill folder when you can run code (rule:token-contrast, rule:contrast) |
| Tokens | no literal colour, size, space, radius or timing in changed code |
| Type scale | few sizes, far apart; readable body (16 px is typical); nothing meant to be read under 13 px (rule:size-count, rule:body-size, rule:small-text) |
| Lines | measure under about 75 characters; marketing headlines within two lines at every width (rule:measure, rule:headline-lines) |
| Fonts | the declared faces load; two families at most unless the brief says otherwise (rule:font-fallback, rule:font-count) |
| Headings | one h1; no skipped level; every screen and section titled (rule:many-h1, rule:skipped-heading) |
| Fit | nothing overflows, clips, covers text or touches the edge at 320, 390, 768 and 1440 px (rule:overflow, rule:clipped-text, rule:edge-text) |
| Space | no accidental holes or blank bands (rule:blank-gap, rule:hero-void) |
| Containers | no cards nested in cards; no thick coloured side stripe on rounded boxes (rule:nested-cards, rule:side-tab) |
| Motion | honours `prefers-reduced-motion`, and content stays visible under reduce; no `transition: all`, ease-in entrances, bounce or scale-from-zero (rule:reduced-motion-ignored, rule:transition-all-src, rule:bounce-src) |
| Theme | responds to `prefers-color-scheme` when tokens define a dark mode (rule:theme-unresponsive) |
| States | hover, focus-visible, active, disabled, invalid and loading each differ visibly from rest; by eye |
| Screen states | empty, loading, error and long-content states are designed; by eye |
| Content | real copy and data; no lorem or placeholder rows; no emoji as icons; buttons named for what they do (rule:lorem-src, rule:emoji-src, rule:cta-copy-src) |
| Images | every image loads and is not stretched; crop by eye |
| Browser surfaces | links, selection, caret, scrollbars and focus ring styled from tokens; tabular numerals where figures update (rule:default-link, rule:tabular) |
| Brief | every requirement in PRODUCT.md is present and findable in seconds |

## Refuse

These are floors. Do not ship them and do not waive them, even when the person asks. Explain the floor in plain
words, offer the closest compliant option (often a darker accent tone, `colour.accent-tone`, or `colour.contrast`),
and leave the choice there.

1. **A token pair below its contrast floor** in any theme or contrast mode. Fix it at the lever or the token,
   never by hand-patching one hex.
2. **Rendered text below 4.5:1, or large text below 3:1** (WCAG 2.2 SC 1.4.3). Exempt: inactive components, pure
   decoration, invisible text, text inside a picture with other significant content, logotypes.
3. **UI parts and focus indicators below 3:1** against adjacent colours (SC 1.4.11). Disabled components exempt.
4. **No visible keyboard focus**: `outline: none` without an equally visible replacement (SC 2.4.7).
5. **Pointer targets smaller than 24 x 24 CSS px**, unless an SC 2.5.8 exception applies.
6. **Two-dimensional scrolling at 320 CSS px width** (SC 1.4.10), except content that needs 2D layout (maps,
   data tables, diagrams, video, games).
7. **Meaning carried by colour alone**: errors, required fields, status, chart series (SC 1.4.1).
8. **Text that clips or disappears at 200% text size** (SC 1.4.4).

## Honest waivers

A waiver claims the rule is wrong for this case. Make one only when the brief or the content says so, for example
"no dark mode: PRODUCT.md specifies a single dark theme". "Looks fine", "design choice" or "requested" without what
the brief needs are not reasons. The Refuse list cannot be waived. List every waiver, with its reason, in the
done report.

## Done

Done means the evidence is in the message, not paraphrased. "All checks pass" is not evidence.

1. Paste the output of every script you ran, with its exit code, for example:

   ```text
   $ node engine/contrast.mjs tokens.json
   contrast: 28 checks, 0 failed (4 permutations, 7 pairs)
   exit 0
   ```

2. List the by-eye checks you judged and what you saw, labelled Inferred.
3. List the waivers and their reasons.
4. List what is Unknown (a check you could not run, a width you did not see, JS-driven motion).
5. On focused and portfolio work, add the reviewer's verdict line (KEEP, REVISE, REJECT or UNKNOWN).

A check that could not run makes the result UNKNOWN. Say so; do not report done.
