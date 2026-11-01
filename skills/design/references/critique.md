<!-- Source: taste-skill@6010f91 skills/taste-skill/references/critique.md and references/tells.md (MIT). REWRITE: scores replaced by verdicts; tells moved to knowledge/tells.json. -->
# Critique: judging the render

Status: written, not eval-proven; the gates are the measured part.

Gates exiting 0 means nothing banned or broken was measured. It says nothing about whether the surface is good.
Critique is how you find out, and it is done on screenshots, never on code: you wrote the code and will read your
intentions into it. The pictures show only what is there.

The harness returns verdicts, not scores (KEEP, REVISE, REJECT, UNKNOWN). A verdict with cited evidence is meant
to resist rounding up.

## 1. Gather the evidence

- `engine/inspect.mjs <url or file> --out .harness/inspect` writes `desktop-fold.jpg`, `desktop-page-NN.jpg`, `mobile-fold.jpg` (and tablet at
  mid widths) plus `report.json` into its `--out` directory.
- `engine/capture.mjs` writes one fold JPEG per cell to `<out>/cells/<cell-id>.jpg`; a cell id reads
  `1440x900.dark.reduce.rest` (term:capture-matrix).
- `engine/bench.mjs` and `engine/board.mjs` write the sample page per settings, captioned with the settings hash.

Cite every observation by cell id or file name, so the next round can compare like with like.

## 2. Look in passes

Make each pass on its own. Where an instrument measures part of a pass, its rule is named; the rest is judgment.

1. **One second, then five.** Glance and look away: there should be one answer (a word, an image, an object).
   Then five seconds as a stranger: what is this, who is it for, what do I do next? (rule:focal-point,
   rule:no-title, rule:late-title, rule:first-action)
2. **Squint.** Text becomes grey bars. The surface should reduce to two or three masses of clearly different size.
   Many similar masses means nothing leads.
3. **Cover the logo.** The competitor test from `skills/design/references/idea-gate.md`, on the first screen
   and on one later section. Does the idea reach the end, or does the surface turn into stock blocks?
4. **Edges.** Follow the left edge of each text block down the page and count distinct x positions. Two or three,
   reused on purpose, is composed; six is placement one element at a time. (rule:ragged-edges, rule:off-centre)
5. **Space and frame.** Related things close, unrelated far; gaps between sections larger than any gap inside one;
   no hole left by accident; equal outer margins. (rule:blank-gap, rule:empty-middle, rule:hero-void,
   rule:lopsided, rule:empty-screens; app: rule:unused-canvas, rule:panel-void)
6. **Type.** A decisive jump from body to headline; few sizes; no orphaned last word; measure under about 75
   characters. (rule:size-count, rule:headline-lines, rule:measure, rule:small-text, rule:body-size; app:
   rule:app-size-count, rule:tiny-text)
7. **Colour.** Name the proportions: which colour holds most of the surface, which supports, where the accent
   lands. An accent in ten places means nothing. (rule:contrast, rule:grey-body; app: rule:colour-sprawl,
   rule:rainbow-chart, rule:no-data-hue)
8. **Pictures.** Does each image do a job (show the thing, set the place, prove the claim)? Shared crop ratios,
   one light and grade, nothing stretched or grey. (rule:few-pictures, rule:no-real-pictures, rule:broken-image)
9. **Sameness.** One word per section for its layout (split, list, grid, statement, full-bleed). The same word
   three times on a page is the template showing. (rule:card-rows, rule:icon-cards)
10. **Phone.** Is the phone screen composed in its own right, or the desktop squeezed? (rule:overflow,
    rule:side-scroll, rule:sidebar-phone)
11. **Substance.** Does every section the brief asks for deliver its content completely at a readable size?
    (rule:placeholder-data, rule:lorem-src, rule:untitled-section)
12. **Collisions.** Is anything on top of a headline, a statement or a button, at any scroll position or width?
    (rule:covered-text, rule:clipped-text, rule:edge-text)
13. **States and themes.** Hover, focus-visible, disabled, error and loading look deliberate; dark mode is designed,
    not inverted; reduced motion still shows the content. (`engine/states.mjs`, rule:theme-unresponsive,
    rule:reduced-hidden, rule:reduced-motion-ignored)
14. **The live thing.** Name it. If you cannot, that is the first problem of the round.

For app screens, add the relationship test from `skills/design/references/page-hierarchy.md`: where am I,
what is selected, what matters, what can I do now, and which tools are secondary, readable without opening panels.

## 3. Tells

A tell is a device that reads as generated because it is produced by default, everywhere, without a reason.
The registry is `knowledge/tells.json`:
- `check: rule` tells are measured; their `ruleIds` say which gate fires. Do not re-judge them by eye.
- `check: review` tells are judged on screenshots; cite them as `tell:<id>`.

The registry never names a replacement font, colour or component. Replacements are procedures (derive from the
subject, blend seeds, turn a lever), because every published "use this instead" list becomes the next tell.

## 4. Write the round down

```text
ROUND n  (cells: <ids>)
seen in one second:
idea (one sentence):            competitor test: pass | fail
live thing:
layout words by section:
gates: lint <exit> · contrast <exit> · inspect <exit> · capture <exit> · states <exit>
top problems, most visible first (cell id, rule:/tell: or "judged", fix):
1.
2.
3.
verdict: KEEP | REVISE | REJECT | UNKNOWN
```

Name problems as a designer would to a colleague: "the supporting paragraph starts 40 px left of the headline's
edge in 1440x900.light.no-preference.rest". "Could be more polished" is not a finding.

## 5. Fix order

Later items cannot rescue earlier ones: (1) the idea, (2) hierarchy (one dominant element per screen),
(3) composition (shared edges, section spacing, holes), (4) type, (5) imagery, (6) colour proportion,
(7) detail (states, focus, small alignment), (8) motion. When removing something leaves a gap, close the gap or
enlarge what remains; do not refill it with an ornament.

## 6. Stop

At most three rounds of critique, fix the top three, re-run the gates, critique. Stop early when a round finds
nothing a stranger would notice, then hand the evidence to the `reviewer` for the verdict. If round three still
has material problems, report them plainly; do not round up.
