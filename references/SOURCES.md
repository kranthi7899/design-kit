# Upstream sources

Everything under `references/` is an unmodified copy of the tracked files of the upstream repo at the pinned commit,
minus tests, benchmarks, evals and build/binary folders (to keep the kit small). Each keeps its own LICENSE.
The design-harness plugin in `../harness` already contains what it needs from these; nothing here is needed to run it.

| Folder | Upstream | Commit | License |
|---|---|---|---|
| taste-skill | https://github.com/Leonxlnx/taste-skill | 6010f91a9935 | MIT |
| impeccable | https://github.com/pbakaus/impeccable | dad8dbb3aac2 | Apache-2.0 |
| snowe-ui-skill | https://github.com/What0ff/snowe-ui-skill | 6447ca78e2e7 | MIT |
| awesome-design-md | https://github.com/VoltAgent/awesome-design-md | 3b605329240c | MIT |
| playwright-cli | https://github.com/microsoft/playwright-cli | b1a5903c5b63 | Apache-2.0 |
| design.md | https://github.com/google-labs-code/design.md | 6e5da5382f41 | Apache-2.0 |
| material-color-utilities | https://github.com/material-foundation/material-color-utilities | bd811e4ca2ab | Apache-2.0 |
| anthropic-frontend-design | https://github.com/anthropics/skills (skills/frontend-design only) | dbd4588f9e10 | Apache-2.0 |

## Not copied (links only)

| Upstream | Commit | License | Why not copied |
|---|---|---|---|
| https://github.com/dequelabs/axe-core | f86d97816094 | MPL-2.0 | Used as an outside tool, never vendored; 51 MB |
| https://github.com/projectwallace/css-design-tokens | 83a5ae90ef1e | EUPL-1.2 | Copyleft; run as an outside tool only |
