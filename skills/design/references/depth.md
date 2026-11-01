<!-- Source: snowe-ui-skill@6447ca7 skill/snowe-ui-skill/SKILL.md, "Calibrate Consequence and Change Surface" (MIT). REWRITE. -->
# Depth: how much process a task earns

Status: written, not eval-proven; the gates are the measured part.

Depth decides which instruments, references and Crew a task uses. It is set from what you observe in the code and
contracts, not from how the request is worded, how long it is, or how many files a diff touches. A one-line ask
can touch a shared token; a ten-file change can be a bounded fix.

## 1. Inspect the change surface first

Before loading any broad reference, find:

- the **owner**: the file, component or token that actually produces the symptom;
- its **consumers**: every sibling screen or component that reads the same owner or token;
- the **contracts touched**: tokens.json, states.json, DESIGN.md, a shared component API;
- the **open questions**: user goal, page job, content, identity, interaction, responsive behaviour;
- the **consequence if wrong**: who is hurt and how reversible it is.

Write the record in your working notes (not to the person unless asked):

```text
ask / outcome:
symptom or open decision:
owner -> consumers:
contracts touched:
open questions (none | which):
consequence if wrong, reversible?:
depth:
loaded / deliberately not loaded:
proof that closes it (gates + cells):
escalate if:
```

## 2. Choose the smallest depth the record supports

**direct** needs all of: one owner in an accepted system, a known answer, no new consumer or shared contract.
- Load: the `craft-floor` skill. Skip idea gate, boards, Crew.
- Gates: `engine/lint.mjs` on the changed files; `engine/inspect.mjs <target> --widths <affected> --out .harness/inspect`; `engine/contrast.mjs`
  if a token changed; `engine/states.mjs` if an interaction state changed.
- Stop when the affected invariant holds in the affected cells and the gates exit 0.

**focused** is one surface whose job and objects are known, but a material choice is open: a new page, a look the
person rejected, a shared component, a token or lever change.
- Adds: `skills/design/references/idea-gate.md`, levers (`engine/levers.mjs --explain`), a bench run, the
  capture matrix in light/dark x both motion settings, and the `reviewer`.
- For a shared owner, render at least one representative sibling consumer as well.
- Compare the baseline with the smallest credible challenger. An open look may need several directions, all
  holding the page job, content and owners fixed. That is still focused, not portfolio.
- Stop at a reviewer KEEP with every gate at 0, or at a REVISE you report with its fix.

**portfolio** activates only when inspection shows material uncertainty in user goals, navigation or journey,
content relationships, interaction contracts, responsive transformation or the token system itself. A new
product, identity or design system usually has one; name which before widening.
- Adds: `art-director` boards, `systems-designer` contract work, capture at every target viewport, the state
  matrix over every component in states.json, a review per surface.
- Stop when each surface has a verdict and the contracts are written.

## 3. Consequence is not breadth

A narrow change that is safety-, money- or accessibility-critical stays `direct` in scope, but its proof widens:
every theme and contrast mode, keyboard and pointer, the error and recovery path, reduced motion. High
consequence is not a licence to open architecture or direction work.

Creative breadth is separate too. For an open visual choice, name what is fixed, what may be invented, and what
rendered difference would justify another option. Explore until the real alternatives are on a board or the
evidence stops changing the choice; there is no fixed count. A `direct` fix never opens creative search.

## 4. Change depth only on evidence

- **Escalate** when proof exposes a new consumer, a shared contract, a floor you cannot fix at the owner (for
  example a rule:token-contrast FAIL that needs a palette change), or one of the portfolio uncertainties.
- **De-escalate** when evidence closes the uncertainty.
- The absence of a trigger is not evidence for broad work. Say the change of depth in one line, with the trigger.

## 5. Tell the person

One line before work, naming the depth, the scope and what is added, for example:

- "Depth: direct. Button focus ring only; craft-floor + lint, inspect at 1440 and the state matrix for focus-visible."
- "Depth: focused. The settings screen (app surface); idea gate, a bench run and a review."
- "Depth: portfolio. New identity across marketing and app; three directions on a board first."

At delivery: direct reports the change, the pasted gate output and anything still Unknown; focused also reports
the resolved choice and the sibling checks; portfolio also reports the chosen direction, the main trade-off and
the strongest rejected option.
