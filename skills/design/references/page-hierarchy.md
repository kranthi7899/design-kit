<!-- Source: snowe-ui-skill@6447ca7 skill/snowe-ui-skill/references/page-hierarchy.md (MIT). KEEP-TRIMMED: condensed, product-specific example dropped, harness gates added. -->
# Page hierarchy, copy and actions

Status: written, not eval-proven; the gates are the measured part.

Use before choosing components for a new page with a known job, a material change to one page's hierarchy, or a
composition the person rejected. This is `focused` work when the objects and the surrounding flow are known. A
single property fix stays `direct`; unknown page goals or product-wide relationships escalate to `portfolio`.

## Map the page before containers

State the user's task and context. List the content and operations the page needs, then assign roles:

```text
group / purpose / parent or related group / importance / required states
what the user must understand or do / what must be seen together
```

Roles might include resource context, page identity, local navigation, selected object, primary work or data,
current action, supporting state, reference and help. Distinguish a selector from a status summary and a working
collection from settings before styling any of them. State the reading order and which relationships must survive
a narrow viewport.

Only then choose grouping and components. Do not map every group to a card (rule:nested-cards, rule:card-rows):
a container stands for an independent object or operation; ordinary attributes need only proximity, alignment and
type. A section heading must distinguish its contents (rule:untitled-section). Existing markup is a baseline, not
evidence that its hierarchy was accepted.

For an open choice, compare the baseline map with an alternative that changes the weak relationships. Reordering
identical boxes without changing importance or grouping is not an alternative.

## Connect importance to visible cues

For each state that changes the user's decision, extend the record:

```text
state / immediate user question / intended attention order
visible cue and owner / competing element / observed render (cell id) / disposition
```

Name the actual content, not "primary" and "secondary". Explain how placement, scale, weight, grouping, contrast
or disclosure makes it stand out and what competes with it. While a process runs, progress may lead; on failure,
the problem and recovery lead; after completion, the result and the next operation lead. Keep geometry stable
and change emphasis only where the user's question changes.

Write the intended order before rendering, then compare it with the screenshots. Do not derive the expectation
from the same DOM you are checking. Heading order is measured (rule:skipped-heading, rule:many-h1); attention
order is Inferred.

## Use references at the requested level

Identify what the person likes in a reference: hierarchy, density, navigation, type, material, interaction.
Inspect the actual referenced surface; a vendor's marketing page is not evidence of its dashboard. Record which
relationship transfers and why, and keep the target product's own semantics and identity. A seed is a reference
of this kind (`knowledge/seeds/index.json`): take a named property, not the whole.

## Audit user-facing text

Classify visible text by job: domain data, state, action, guidance, or implementation detail. A phrase earns space
when it helps orientation, a decision, an operation or recovery. Remove descriptions that restate a heading or
explain an obvious empty container (rule:copy-src flags genre phrasing; judgment covers the rest).

Treat a visible ordinal as a content relationship before choosing its look: numbers on landing-page sections,
benefits or services need a real order, navigation or reference value (rule:numbering, rule:numbering-src,
rule:zero-pad-src). Keep genuine steps, identifiers and quantities.

Keep legitimate technical content in technical products: ids, commands and parameters can be essential data.
Errors use the user's language and keep recovery visible. Fixture notes, hashes and test results stay in the
review report, never in a product screenshot. Never use a global forbidden-word list.

## Audit actions by meaning

For each action record `operation + target object + outcome + context` and check it against its handler or
destination. Different labels do not make identical operations distinct; by default keep one primary entry to the
same outcome in the same context. Identical row buttons for different objects are distinct actions. A repeated
action needs its own demonstrated benefit and a clear hierarchy (rule:cta-copy-src for vague labels).

## Accept the relationships

From the current complete render, establish where the user is, what is selected, which objects matter, what can be
done now and which tools are secondary, without opening every panel. Check empty, sparse and populated states,
permission and error states, keyboard access, text scaling and narrow viewports (`engine/capture.mjs`,
`engine/states.mjs`).

DOM presence and bounding boxes do not prove visibility: opacity, clipping and occlusion can hide content
(rule:covered-text, rule:clipped-text). Use gate output and screenshots together.

A clear role map is not a finished visual direction; use `skills/design/references/art-direction-gate.md` when the
structure is clear but the expression is weak. Report four outcomes separately: technical contract (gates),
evidence integrity (cells present and current), visual assessment (verdict) and the person's acceptance. Their
rejection reopens the direction; silence is not approval.
