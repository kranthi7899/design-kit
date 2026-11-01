<!-- Source: taste-skill@6010f91 skills/taste-skill/SKILL.md, step 4 "the idea", competitor test, one live thing (MIT). REWRITE. -->
# Idea gate: the competitor test and one live thing

Gates catch what is broken or banned. They cannot tell you whether a surface belongs to this product and no
other. The idea gate is a forcing function for that, run before any lever is turned on a `focused` or
`portfolio` task. Status: a judgment check (the reviewer applies it); no instrument measures it, and the harness
has no eval yet showing it helps. Treat its output as Inferred.

## 1. Write the idea sentence

> On this surface, **[something that belongs to the subject]** becomes **[the device the surface uses]**.

Fill the first blank from the product's own material (PRODUCT.md, the real content), not from its category.
Places to look:

- **Output**: what the thing produces (a report, a print, a route, a sound). Put real output on the surface.
- **Object**: its shape, cross-section or silhouette, enlarged, cropped or used as the frame.
- **Name**: what the letters or the meaning of the name can hold.
- **Place**: one view that makes someone want to be there.
- **Ritual**: a sequence the surface can perform as it scrolls or as the task advances.
- **Artefact**: a printed or physical thing already in its world (ticket, label, manual, receipt).
- **Opposite**: the category that owns the feeling this one lacks.

"Clean and modern", "premium", "bold" are adjectives, not ideas. An adjective becomes usable only as a
consequence: which lever, which composition, which content.

## 2. Run the competitor test

Put the nearest real competitor into the sentence (the shop two streets away, the other tool in the same
category). If the sentence still works, the idea belongs to the category, and the surface will too.

- Fail: "a loaf of bread becomes the hero image" (every bakery).
- Pass: "the seven doors of the street this bakery is named after become the section frames" (only this one).

On a rendered surface the same test is "cover the logo": could this first screen belong to a competitor, or
another industry? The reviewer runs it on screenshots; a fail is a REJECT-level finding, because detail work
cannot fix a surface with no idea.

## 3. Name one live thing

One thing the visitor can do, or that differs each visit, made from the idea and the real content: choose a
material and see the product in it; set the amount and read the real monthly figure; see whether the shop is open
right now.

Rules:
- it uses real content, never placeholder data (rule:placeholder-data, rule:lorem-src);
- it works by touch on a phone and has a plain fallback without script;
- it never blocks reading or the primary action;
- it is one thing, not a playground, and it is built as part of the surface, not added later as motion;
- it honours reduced motion (rule:reduced-motion-ignored).

## 4. Surface changes the gate

| | marketing (persuade) | app (operate) |
|---|---|---|
| Idea | required; drives the first screen and must reach the last section | the task model: which object or result the user came for, and how the screen makes it lead |
| Competitor test | cover the logo on the first screen and on one later section | swap in the competitor's data: does the hierarchy still say what matters for this product's users? |
| Live thing | required; usually in the first screen or where it proves the main claim | the primary task itself: it responds immediately and visibly; no decorative extra |
| Related gates | rule:focal-point, rule:first-action, rule:no-title, rule:still-page | rule:app-no-title, rule:below-fold, rule:placeholder-data, rule:kpi-size |

The related gates measure symptoms of a missing idea (no dominant element, no action in the first screen). Passing
them does not pass the idea gate.

## 5. Removing tells is not an idea

A surface with every tell removed and nothing put in their place reads as generated too: anyone could predict it
from the category plus the list of things to avoid. Tells (see `knowledge/tells.json`) fill a gap where an idea
should be. Fill the gap first, then run the gates.

## 6. Record

Write this into the surface's section of PRODUCT.md (or the direction record the art-director returns):

```text
surface / type (marketing | app):
idea: On this surface, ... becomes ...
competitor test: <competitor> -> pass | fail, because ...
live thing: ... (fallback: ...)
carried into: <sections or states where the idea must still be visible>
```

If the idea fails after a round of critique, change the concept, not the details. Fix order: idea, hierarchy,
composition, type, imagery, colour, detail, motion (`skills/design/references/critique.md`).
