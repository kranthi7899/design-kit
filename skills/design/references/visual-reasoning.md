<!-- Source: snowe-ui-skill@6447ca7 skill/snowe-ui-skill/references/visual-reasoning.md (MIT). KEEP-TRIMMED: figures and figure walk-throughs dropped, lever and dial pointers added. -->
# Reason from visible relationships

Status: written, not eval-proven; the gates are the measured part.

Read for an open composition, an unfinished direction, or a repair whose perceptual cause is unclear. The
judgments here are reasoned visual hypotheses, not gaze research; label them Inferred until a render confirms them.

## Redirect attention by state

Attention follows contrast, scale, area and proximity. When the wrong thing leads (a large coloured "New" action
pulls the eye before the result the user came for), redistribute those four toward the current question: move the
result to the start of the reading column, give it the heading and the accent, make the competing action
subordinate, and close the group with space before optional detail.

- **Prediction**: the current result is identifiable before any new operation, without deleting history.
- **Counterexample**: while a process runs, progress can legitimately lead. A destructive action never gains
  prominence merely because it comes next.
- Re-render the other states after the repair; they need different emphasis.

Two good answers can differ: a bounded surface with a coloured action suits occasional users and competing tasks
but costs weight when repeated; a restrained reading surface held by type and position suits frequent expert
scanning but captures less attention. Choose from the task and the accepted identity, not from fewer effects.

## Translate an impression into a falsifiable proposition

| Desired perception | Candidate moves and mechanism | Lever or dial to try | Evidence and counterexample |
|---|---|---|---|
| Confident | one decisive scale relationship; few stable alignment axes; deliberate negative space | lever:type.ratio up; dial:louder | read the silhouette at thumbnail, then real text. A dense expert tool may show confidence through consistency, not a huge headline |
| Energetic | asymmetric mass; a concentrated chromatic field; an event with acceleration and release | lever:colour.accent-tone; lever:motion.easing | the action still wins at native size. Continuous motion in a monitoring task destroys clarity |
| Calm | predictable grouping; quiet secondary contrast; measured line length; stable state geometry | dial:calmer (reports the levers it moved) | inspect errors and long labels. Pale low-contrast text (rule:grey-body) and empty wells (rule:hero-void) are not calm |
| Crafted | optical rather than geometric alignment; careful joins and crops; even typographic colour | lever:type.leading; review | compare label and control baselines at real size |
| Dense, efficient | tighter rhythm, smaller steps, more rows per screen | dial:denser; lever:space.density | target size and legibility still hold (rule:tiny-text) |

These are hypotheses. State the intended effect, turn the lever, render it, keep or reject on what you see. A dial
is a shortcut: always report which levers it moved (term:dial, term:lever).

## Diagnose whole and detail together

At thumbnail scale find the dominant masses and the route between them. Does an empty panel weigh more than
useful content? Do similar rectangles falsely imply equal status? Then inspect at native size: hierarchy must
survive without relying on illegible small copy. Return to the whole after every local repair.

Use proximity and common region to group related facts, similarity only for real peers, continuity to lead through
related operations, figure/ground to separate content from an overlay. Do not apply them all at full strength: a
card plus a thick rule plus a shadow plus a colour field overstates one relationship. Negative space is an active
interval; judge its cumulative rhythm, not each padding value.

Check optical alignment at visible edges and baselines. Check headline breaks as meaning and shape: an orphaned
article or accidental last word weakens a good scale. Colour weight depends on area and neighbours: a small vivid
action and a full vivid panel are different propositions. For translucency, judge the real backdrop; an opaque
contrast calculation does not settle a composited surface (the token gate checks declared pairs only).

## Repair as an experiment

Keep the chain: **observation -> plausible cause -> one relational change -> expected consequence -> comparable
re-render -> collateral checks -> disposition.** If the action is lost, first test its grouping and contrast
against the result, rather than changing font, palette, spacing and copy at once. Hold content and cell constant
for causal comparisons; a board with one varied lever is the cleanest form (`engine/board.mjs --vary`).

Keep rejected repairs with reasons: a larger button may restore attention but crowd the phone line. Never turn
"this decorative disc competed with these labels" into "remove all round shapes".

## Specialised routes

- **Charts**: establish the question, scale and comparison first; inspect zero, missing and outlier data; compare
  encodings before decoration (rule:rainbow-chart, rule:no-data-hue).
- **Layered colour**: trace the final paint through ancestors, pseudo-elements, filters and backdrops in both
  themes. A token change that misses a portal or a table header is incomplete.
- **Forms and dense tools**: keep label, value and action close; align numeric columns (rule:numeric-align,
  rule:tabular); readable targets; predictable keyboard order; inspect error recovery.
- **Focus**: a focus ring needs its own contrast role against the surface outside the control, not the
  control's text colour (the focus-ring/surface pair in tokens; term:focus-ring).
- **Motion**: model cause, spatial continuity, interruption and final attention; compare the moving sequence with
  its reduced counterpart. Scope expressive motion to its carrier; ordinary controls stay immediate.
- **Media and canvas**: a DOM probe cannot see shader pixels or video frames; mark those claims Unknown unless a
  screenshot shows them.
