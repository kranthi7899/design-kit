// Phase 1 shared contract (PHASE-1-CONTRACT.md §2). Read-only for lanes; change only via L2 escalation.
export const SCHEMA = Object.freeze({ registry: 'harness.registry/1', impeccableMap: 'harness.impeccable-map/1',
  contrast: 'harness.contrast/1', capture: 'harness.capture/1' });
export const LEVELS = Object.freeze(['FAIL', 'WARN']);
export const SURFACES = Object.freeze(['marketing', 'app']);
export const SCOPES = Object.freeze(['marketing', 'app', 'both']);
export const LAYERS = Object.freeze(['source', 'render', 'token', 'capture']);
export const ORIGINS = Object.freeze(['harness', 'impeccable', 'taste-skill', 'snowe-ui-skill']);
export const WAIVERS = Object.freeze(['allow', 'comment', 'none']);
export const IMPECCABLE_STATUS = Object.freeze(['implemented', 'todo']);
export const THEMES = Object.freeze(['light', 'dark']);
export const MOTION = Object.freeze(['no-preference', 'reduce']);
export const STATES_P1 = Object.freeze(['rest']);
export const RULE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const IMPL_REF = /^engine\/(lib|rules)\/[a-z0-9_-]+\.mjs#[A-Za-z_$][\w$]*$/;
export const WCAG = Object.freeze({ body: 4.5, large: 3, ui: 3 });
export const REDUCED_MAX_MS = 10;
export const MATRIX_MAX_CELLS = 32;
export const EXIT = Object.freeze({ OK: 0, FAIL: 1, ERROR: 2 });
export const ERR = Object.freeze(Object.fromEntries(['E_USAGE', 'E_IO', 'E_JSON', 'E_REGISTRY_SCHEMA',
  'E_REGISTRY_DUP', 'E_IMPL_MISSING', 'E_COLOR_UNSUPPORTED', 'E_COLOR_TRANSLUCENT_BG', 'E_ALIAS_MISSING',
  'E_ALIAS_CYCLE', 'E_MODES_INVALID', 'E_PAIR_TOKEN_MISSING', 'E_PAIR_NOT_COLOR', 'E_PAIR_BELOW_FLOOR',
  'E_MATRIX_EMPTY', 'E_MATRIX_TOO_LARGE', 'E_STATE_UNSUPPORTED', 'E_VALUE', 'E_EMULATION', 'E_BROWSER',
  'E_NAV'].map((c) => [c, c])));
export class HarnessError extends Error {
  constructor(code, message, details = []) { super(message); this.name = 'HarnessError'; this.code = code; this.details = details; }
}
/** @typedef {{level:'FAIL'|'WARN', id:string, message:string, fix?:string, width?:number, cell?:string,
 *   file?:string, line?:number, [k:string]:unknown}} Finding */
// --- Phase 2 (PHASE-2-CONTRACT.md §1.2). Append-only.
export const SCHEMA2 = Object.freeze({ levers: 'harness.levers/1', dials: 'harness.dials/1', settings: 'harness.lever-settings/1',
  bench: 'harness.bench/1', board: 'harness.board/1', glossary: 'harness.glossary/1', ledger: 'harness.ledger/1',
  knowledge: 'harness.knowledge/1', ruleNotes: 'harness.rule-notes/1', tells: 'harness.tells/1', seeds: 'harness.seeds/1',
  states: 'harness.states/1', studio: 'harness.studio/1', tool: 'harness.tool/1' });
export const LEVER_GROUPS = Object.freeze(['type', 'space', 'shape', 'colour', 'motion']);
export const LEVER_CONTROLS = Object.freeze(['range', 'enum', 'color']);
export const DEPTHS = Object.freeze(['direct', 'focused', 'portfolio']);
export const VERDICTS = Object.freeze(['KEEP', 'REVISE', 'REJECT', 'UNKNOWN']);
export const KNOWLEDGE_VERDICTS = Object.freeze(['KEEP', 'KEEP-TRIMMED', 'KEEP-DERIVED', 'REWRITE', 'VENDOR', 'OWN']);
export const STATES_P2 = Object.freeze(['rest', 'default', 'hover', 'focus-visible', 'active', 'disabled', 'invalid', 'loading']);
export const POINTER_KINDS = Object.freeze(['down', 'move', 'up', 'wheel']);
export const AUTHORS = Object.freeze(['human', 'claude']);
export const LEVER_ID = /^[a-z]+\.[a-z0-9]+(-[a-z0-9]+)*$/;          // 'type.ratio', 'colour.accent-tone'
export const TERM_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const REF = /\b(rule|term|tell|lever|dial):([a-z0-9.-]+)\b/g;  // cross-references in .md and JSON prose
export const BOARD_MAX_VARIANTS = 6;
export const FRAME = Object.freeze({ maxBytes: 2 * 1024 * 1024, defaultWidth: 800, defaultFps: 8, maxFps: 15 });
export const STUDIO = Object.freeze({ maxBody: 256 * 1024, ring: 256, idleMs: 10 * 60 * 1000, noteMax: 2000 });
export const ERR2 = Object.freeze(Object.fromEntries(['E_NOT_IMPLEMENTED', 'E_LEVER_UNKNOWN', 'E_LEVER_RANGE', 'E_DIAL_UNKNOWN',
  'E_PROTOCOL', 'E_AUTH', 'E_TOOL_UNKNOWN', 'E_TOOL_SCHEMA', 'E_FRONTMATTER', 'E_KNOWLEDGE', 'E_SEED_PARSE', 'E_STATE_FORCE',
  'E_FRAME_TOO_LARGE', 'E_SERVER_BUSY', 'E_BROWSER_BUSY'].map((c) => [c, c])));
// --- Phase 3 (PHASE-3-CONTRACT.md §1.2). Append-only.
export const SCHEMA3 = Object.freeze({ vibe: 'harness.vibe/1', vibeRules: 'harness.vibe-rules/1', cellScene: 'harness.cell-scene/1',
  vibeCurrent: 'harness.vibe-current/1' });
export const IMAGE_FORMATS = Object.freeze(['png', 'jpeg', 'gif', 'webp']);
export const IMAGE = Object.freeze({ maxBytes: 32 * 1024 * 1024, maxSide: 12000, maxPixels: 50_000_000, maxImages: 12,
  chromeSide: 1024, analysisSide: 256, thumbSide: 64, decodeMs: 10_000 });
export const VIBE = Object.freeze({ minCandidates: 3, maxCandidates: 5, defaultCandidates: 4, maxPerSet: 24, paletteK: 12,
  minSeedChroma: 16, minShare: 0.03, distinctDeltaE: 0.08, floorSteps: 3, renderWidth: 480, miniWidth: 220 });
export const MOOD_AXES = Object.freeze(['warmth', 'energy', 'contrast', 'lightness', 'density', 'roundness']);
export const VIBE_STRATEGIES = Object.freeze(['baseline', 'dominant', 'accent', 'quiet', 'bold', 'second-hue', 'adjusted']);
export const VIBE_MOVES = Object.freeze(['warmer', 'cooler', 'vivid', 'muted']);
export const VIEW_MODES = Object.freeze(['gallery', 'focus']);
export const JOB_PHASES = Object.freeze(['start', 'progress', 'done', 'error']);
export const COLOR_DEPTHS = Object.freeze(['truecolor', '256']);
export const CELL = Object.freeze({ maxColumns: 512, maxRows: 256, pairBudget: 900, cardMs: 200, defaultColor: 0x01000000 });
export const ERR3 = Object.freeze(Object.fromEntries(['E_IMAGE_PATH', 'E_IMAGE_FORMAT', 'E_IMAGE_TOO_LARGE', 'E_IMAGE_DECODE',
  'E_VIBE_EMPTY', 'E_VIBE_UNKNOWN', 'E_VIBE_FLOOR', 'E_VIBE_BUSY', 'E_CELLS'].map((c) => [c, c])));
