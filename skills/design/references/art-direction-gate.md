<!-- Source: snowe-ui-skill@6447ca7 skill/snowe-ui-skill/references/art-direction-gate.md (MIT). KEEP-TRIMMED: sections condensed, figures and packet tooling dropped, harness levers, seeds and boards added. -->
# Art direction gate

Status: written, not eval-proven; the gates are the measured part.

Use after the surface's job and real content are understood (PRODUCT.md and the idea gate). Art direction gives
the product a coherent perceptual and behavioural point of view; it is not a style preset or a layer of decoration.

## 1. Find sources of identity

Inspect what genuinely belongs to this product: its real objects, materials and mechanisms; its workflow, state
changes and data shapes; its audience's language, expertise and anxieties; its content voice and archive; its
verified brand history and assets; its platform. Do not begin from "minimal", "premium", "bold", "playful",
"brutalist" or "glass". Translate perception into observable composition, type, colour, imagery, interaction and
motion.

## 2. Frame the perceptual job

State what the experience should feel like and why that helps the task; what it must never imply; the intended
attention order per state (see `skills/design/references/page-hierarchy.md`); how much the interface should lead,
reassure, disappear or teach. "Precise but not clinical" is useful only when followed by its design consequences.

## 3. Build directions

When the person rejects a look, the affected direction is open, even if its palette and behaviour stay valid.
Construct before subtracting: removing pills, reducing spacing and muting colour is not exploration. Give the
surface a positive, product-specific proposition, then compare it with the baseline.

Each direction holds the same requirements and real content, and records:

```text
thesis | desired perception | product-specific source | dominant composition | type voice | colour logic |
imagery/graphic logic | interaction/motion character | identity carrier and boundary | risk |
lever settings (changed from default) | seeds blended (1-3, which property from each) | board cell id
```

Directions differ where the product's tension lives: reading path, typographic voice, imagery versus diagram
versus none, surface and material logic, density, interaction character. Do not manufacture distinction with
arbitrary palettes, radii or effects. On a board, only levers differ (term:board), so a board shows token-level
choices on the sample page; composition and imagery differences need a rendered sketch of the real surface.

Translate a source into an invention: observed property -> perceptual mechanism -> compositional move ->
expected consequence -> rendered proof. Keep the source truthful; a metaphor must not invent product features or
make familiar actions ambiguous.

## 4. Work with real content

Every direction must survive the real names, prices, labels and claims; long and short headings; missing
content; a no-image state; primary, secondary, destructive, unavailable and error actions; narrow, middle and wide
viewports. A direction that needs placeholder brevity or a perfect hero image is not ready.

## 5. Choose an identity carrier

The carrier is the one repeatable decision that makes the product recognisable or easier to understand: a spatial
rule, a typographic behaviour, a photographic language, a diagram grammar, an edge or surface behaviour, a
navigation pattern, or motion tied to a real state change. Define where it appears, where it must not, and what
it serves. A logo, gradient or glow is not automatically a carrier.

**Subtraction test.** Remove the logo, decorative layer, gradient, shadow and motion. The hierarchy, type, content
and interaction should still feel intentional. Restore only what improves recognition, comprehension or feedback.

## 6. Compare and select

Use verdicts, not taste scores. Before reading a direction's rationale, describe the visible organising
difference on the board and whether its carrier belongs to this product; then check the explanation against what
you saw. A confident story cannot rescue an interchangeable render.

Reject a direction that contradicts product truth, depends on unavailable content, makes an accessibility floor
structurally infeasible (for example an accent that fails rule:token-contrast at every tone the identity allows),
hides the primary outcome, or falls apart across real states. Select the one with the strongest rendered
evidence; hybridise only moves that form one thesis.

Ask the person to choose when directions imply different brand or business positions, and whenever they asked
to choose. Resolve reversible details yourself from evidence.

## 7. Define the system

After selection, set role-based systems, each traced to a lever or a contract entry:

| System | Lever or contract |
|---|---|
| Type roles, scale, leading | lever:type.base, lever:type.ratio, lever:type.leading; fonts in DESIGN.md |
| Spacing and density | lever:space.unit, lever:space.density |
| Shape and edge | lever:shape.radius |
| Colour roles and modes | lever:colour.seed, lever:colour.accent-tone, lever:colour.neutral-tint, lever:colour.contrast |
| Motion roles | lever:motion.duration, lever:motion.easing; reduced-motion equivalent in states.json |
| Component states | states.json (term:interaction-state) |

Do not let one expressive permission spread: a campaign visual does not define every control; a soft brand edge
does not require pill-shaped fields. Before scaling, render the primary surface and one repeated or secondary
context with real content. If the direction only works in the hero, revise the system first.

## 8. Freeze the contract

Write into DESIGN.md: thesis and perception; causal source; dominant composition; carrier and its boundary; the
lever settings and their settings hash; forbidden drift; unresolved evidence and its revisit trigger; the
strongest rejected direction and its decisive weakness. This is a drift boundary, not a law: reopen it when real
content, rendered behaviour or gate output invalidates its premise.

## 9. Review the rendered product

Review the working surface, not a direction card. At thumbnail scale: focal order, rhythm, silhouette, template
resemblance. At full scale: type metrics, alignment, crop, optical balance, state coherence, detail. Cover
default and interactive states, narrow to wide, long content, light/dark/high contrast where supported, reduced
motion, failed images, and the carrier where it repeats and where it is absent. An engineering fixture that
passes its gates is not a visual KEEP. If a correction would change the thesis or carrier, reopen the direction
instead of hiding the problem with polish.
