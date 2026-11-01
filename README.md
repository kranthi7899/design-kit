# design-kit

Two Claude skills that make Claude design better interfaces, plus the open-source design repos they were built from.

- **design**: the method. It picks a depth, writes the brief, passes an idea gate ("what makes this *this* product?"),
  proposes up to three directions built from 14 levers and 74 real brand design systems, generates design tokens
  (light, dark, high contrast) with a WCAG contrast check, then reviews the result and gives a verdict
  (KEEP / REVISE / REJECT / UNKNOWN) with evidence.
- **craft-floor**: the quality floor. A verify list, a refuse list of accessibility floors that are never waived,
  and a definition of done that needs evidence.

## Use it in the Claude app (claude.ai or desktop)

1. Download `dist/design.zip` and `dist/craft-floor.zip` from this repo.
2. In Claude: **Settings → Capabilities**, make sure code execution is on, then under **Skills** upload each zip.
3. Ask for anything: "design a landing page for a coffee subscription", "make this dashboard calmer",
   "here are three images, use them as the vibe for my portfolio site", "review this screenshot".

Claude loads the skills on its own when the request is about design. With code execution on, it runs the token
generator and contrast checker; without it, it follows the method and labels by-eye judgments as such.

## Use it in Claude Code

    cp -r skills/design skills/craft-floor ~/.claude/skills/

## What's in the repo

| Path | What |
|---|---|
| `skills/design/` | `SKILL.md`, `references/` (method), `roles/` (art director, systems designer, reviewer), `engine/` (token generator + contrast checker, plain Node, no packages), `knowledge/` (levers, dials, glossary, tells, rule notes, 74 seed design systems, font and UX tables) |
| `skills/craft-floor/` | `SKILL.md` |
| `dist/` | the two skills zipped for upload |
| `references/` | the upstream repos, trimmed; see `references/SOURCES.md` |
| `NOTICE.md`, `licenses/` | what came from where, and their licences |

## Credits

Built from taste-skill, impeccable, snowe-ui-skill, awesome-design-md, material-color-utilities, google design.md,
playwright-cli and Anthropic's frontend-design skill. See `NOTICE.md`. The seed design systems describe real brands
(from awesome-design-md); they are reference material, not endorsements.

Status: the method is written, not yet A/B-evaluated. The token generator and contrast checker are tested.
