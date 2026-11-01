# Notices

This harness contains code and ideas derived from the projects below, used under their licenses
(full texts in `docs/LICENSE.*`). Copied files keep their original headers.

| Source | License | What we took |
|---|---|---|
| taste-skill (Leonxlnx) | MIT | `engine/lib/cdp.mjs`, `probe.mjs`, `rules.mjs`, `engine/inspect.mjs`, `engine/lint.mjs` (forked, being pruned) |
| impeccable (Paul Bakaus) | Apache-2.0 | `rules/impeccable-antipatterns.meta.json` (rule ids/descriptions); design of hook, craft-floor, reviewer |
| snowe-ui-skill (What0ff) | MIT | design of depth calibration, capture plan, corrections gate, the references `art-direction-gate.md`, `visual-reasoning.md` and `page-hierarchy.md` (trimmed); `knowledge/tables/*` (google-fonts, ux-guidelines, app-interface, charts and stack CSVs, verbatim) |
| playwright-cli (Microsoft) | Apache-2.0 | used as an external tool, not copied |
| awesome-design-md (VoltAgent) | MIT | `knowledge/seeds/*`: 74 DESIGN.md files kept verbatim under a source header, plus tokens parsed from them; brand-derived content, check before redistributing |
| material-color-utilities (Google) | Apache-2.0 | `engine/vendor/mcu/*`: HCT subset ported from TypeScript to ESM JavaScript, types removed, headers kept |
| design.md (@google/design.md) | Apache-2.0 | DESIGN.md frontmatter spec ideas only; text in `docs/LICENSE.design-md.Apache-2.0` |
| OKLab (Björn Ottosson, 2020; bottosson.github.io/posts/oklab) | public domain (MIT also offered) | the OKLab conversion matrices in `engine/lib/pixels.mjs` (linear sRGB to LMS to OKLab and back); the code around them is our own |

impeccable's own NOTICE (platform-design-skills by ehmo, MIT) applies if its iOS/Android references are ever copied.
Apache-2.0 requires stating changes: files under `engine/` are modified from upstream.
