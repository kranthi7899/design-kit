# Glass box: explaining every choice by its mechanism

The person has taste and wants to learn the craft, not be shielded from it. So every render links to the lever that
produced it, every quality claim to the instrument that measured it, and every term to its definition. Plain
dials ("calmer") are shortcuts onto levers, never a replacement for them.

## 1. Terms: define once, record, then use

- The first time a glossary term appears in a conversation, give its plain sentence and run
  `node engine/knowledge.mjs term <id>`. That prints the full entry and records the sighting in the person's
  ledger (default `~/.design-harness/ledger.json`), so later sessions know what has been introduced.
- After that, use the term without re-defining it, unless the ledger shows it was seen once long ago.
- In files you write (DESIGN.md, review notes), cite terms as `term:<id>` so they resolve and back-link.
- `node engine/knowledge.mjs backlinks <id>` lists every rule, lever and tell that uses a term: the fastest way to
  show where a concept is enforced.

Starter vocabulary, in the order it usually arrives: term:design-token, term:dtcg, term:alias-token,
term:surface-type, term:gate, term:finding, term:severity-ceiling, term:waiver, term:lever, term:dial,
term:board, term:contrast-ratio, term:relative-luminance, term:wcag, term:theme, term:mode, term:permutation,
term:modular-scale, term:type-scale, term:leading, term:tracking, term:spacing-scale, term:density, term:radius,
term:hct, term:tone, term:chroma, term:hue, term:seed-colour, term:tonal-palette, term:surface-and-on-surface,
term:accent, term:interaction-state, term:focus-visible, term:focus-ring, term:reduced-motion,
term:motion-duration, term:easing, term:cubic-bezier, term:transition, term:spring, term:viewport,
term:capture-matrix, term:provenance, term:why-panel, term:annotation, term:selector, term:computed-style,
term:specificity.

## 2. A lever behind every visual claim

A visual claim names the parameter that produces it, the current value, and what changing it would do.

| Weak | Glass box (illustrative values) |
|---|---|
| "The headings feel cramped." | "lever:type.ratio is 1.125: body 16 px and the next step 18 px read as one size. At 1.25 the step is 20 px." |
| "Make it calmer." | "dial:calmer moved lever:motion.duration 220 to 264 ms, lever:type.ratio one option down, lever:space.density +0.1 (as the bench report lists them)." |
| "The button doesn't pop." | "on-accent on accent is 4.6:1 in light (passes rule:token-contrast) but the accent covers 30% of the first screen, so it no longer marks one place (rule:colour-sprawl on app)." |

When no lever covers the property (a layout rule, an image crop), name the token, CSS property or selector and say
there is no lever for it yet. Report dial moves from the bench output, not from memory.

## 3. Why-panels

Explain a lever, gate or finding in three parts, short enough to read beside the render:

1. **Plain**: one or two sentences, no jargon, what it is and why it matters.
2. **Technical**: the term, the formula or threshold, and the source (WCAG success criterion, DTCG spec, the
   registry record).
3. **Example**: one pass and one fail, preferably a real file. The rule fixtures are pass/fail pairs, for example
   `fixtures/impeccable/side-tab.pass.html` and `fixtures/impeccable/side-tab.fail.html`; the token gate's pair is
   `contracts/tokens.example.json` (passes) and `fixtures/tokens/fail-dark.json` (fails).

Source the text from the harness, never from memory: `node engine/levers.mjs --explain <lever>` for a lever,
`knowledge/rule-notes.json` for a rule (cite `rule:<id>`), `node engine/knowledge.mjs term <id>` for a term. The
bench report carries the why-panel for each gate. If a why is missing, say so; do not invent one.

Example, rule:token-contrast:
- Plain: text has to be different enough in lightness from its background to read; 1 means identical, 21 is
  black on white.
- Technical: term:contrast-ratio, (L1 + 0.05) / (L2 + 0.05) over term:relative-luminance; 4.5:1 for body text,
  3:1 for large text and UI parts (WCAG 2.2 SC 1.4.3 and 1.4.11). Checked in every theme x contrast permutation.
- Example: the example tokens pass in all four permutations; the fail-dark fixture's on-accent on accent is
  3.1:1 in both dark permutations.

## 4. Evidence labels

Every claim in a report carries one label:

| Label | Means | Example |
|---|---|---|
| Observed | an instrument printed it or a screenshot shows it | "contrast: 28 checks, 0 failed" |
| Derived | follows arithmetically from observed values | "the h1 is 2.44 times the body size" |
| Inferred | a judgment, however confident | "the hero reads as generic" |
| Unknown | no evidence either way | "JS-driven motion under reduced motion" |

Never upgrade a label: a reviewer KEEP is an Inferred judgment backed by Observed gates, not a measurement of
quality. If an instrument's blind spot covers the claim (see `skills/design/references/instruments.md`), it is
Unknown until something else observes it.

## 5. Teach-back, not lecture

Offer the mechanism when it helps the decision at hand; skip it for a term already in the ledger. When the person
turns a lever in the studio or asks "why", answer with the why-panel for that lever and the before/after cells.
When they say "I don't like it", ask which part (type, space, colour, shape, motion, composition), then show a
board with one lever varied rather than guessing.
