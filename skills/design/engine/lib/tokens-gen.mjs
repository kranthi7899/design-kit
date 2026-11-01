// Token generator: lever settings -> DTCG tokens -> CSS custom properties (PHASE-2-CONTRACT.md section 4). Pure: no cdp, child_process, http, net.
import { HarnessError, ERR } from './contracts-types.mjs';
import { loadLevers, applySettings, settingsHash } from './levers.mjs';
import { flatten, permutations, resolvePermutation } from './tokens.mjs';
import { parseColor, toHex } from './color.mjs';
import { checkTokens } from './contrast.mjs';
import { Hct } from '../vendor/mcu/hct.mjs';
import { TonalPalette } from '../vendor/mcu/tonal_palette.mjs';

const round2 = (n) => Math.round(n * 100) / 100;
const px = (n) => ({ value: n, unit: 'px' });
const ms = (n) => ({ value: n, unit: 'ms' });
const clamp = (lo, hi, v) => Math.min(hi, Math.max(lo, v));

/** Type scale: size(k) = base x ratio^k for k = -1..5, 2 dp. */
export function typeScale(base, ratio) {
  const names = ['sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'];
  return Object.fromEntries(names.map((n, i) => [n, round2(base * ratio ** (i - 1))]));
}
/** Space scale: [1,2,3,4,6,8,12,16] x unit x density, whole pixels. */
export function spaceScale(unit, density) {
  return [1, 2, 3, 4, 6, 8, 12, 16].map((m) => Math.round(m * unit * density));
}
/** Corner radii: sm = r/2, md = r, lg = min(2r, 32), full = 9999. */
export function radiusScale(r) {
  return { sm: r / 2, md: r, lg: Math.min(2 * r, 32), full: 9999 };
}
/** Duration ladder: instant, quick, base, slow, scene = d x [0.45, 0.68, 1, 1.64, 2.73], rounded to 10 ms. */
export function durationLadder(d) {
  return [0.45, 0.68, 1, 1.64, 2.73].map((m) => Math.round((d * m) / 10) * 10);
}
/** Line-height ladder from the body leading. */
export function leadingScale(leading) {
  return { tight: round2(Math.max(1.1, leading - 0.3)), base: leading, loose: round2(leading + 0.15) };
}
// Mirrors the curves in knowledge/levers.json (a unit test keeps the two in step).
export const EASING = Object.freeze({ standard: [0.2, 0, 0, 1], gentle: [0.4, 0, 0.2, 1], linear: [0, 0, 1, 1] });
const DECELERATE = [0.05, 0.7, 0.1, 1];
const ACCELERATE = [0.3, 0, 0.8, 0.15];

const hexOf = (argb) => '#' + (argb & 0xffffff).toString(16).padStart(6, '0');
const argbOf = (hex) => (0xff000000 | parseInt(hex.slice(1), 16)) >>> 0;
const ROLES = ['surface', 'raised', 'on-surface', 'muted', 'accent', 'on-accent', 'focus-ring', 'danger', 'on-danger'];

/**
 * HCT tonal palettes -> role hexes. Returns { light, dark, high: { light, dark } }.
 * light/dark follow `contrast` ('standard' | 'high'); `high` always holds the high-contrast set (used by prefers-contrast: more).
 * Roles are picked by tone (CIE L*), so a tone gap predicts contrast: about 40 = 3:1, 50 ~ 4.45:1 worst case.
 * Judgement calls (contract leaves them open): dark focus-ring = dark accent; high mode leaves surfaces and danger alone;
 * dark on-accent is A20 but never closer than 45 tones to the dark accent, so a pale light accent cannot make dark fail first.
 * A19 f: `darkSurfaceChroma` (lever colour.dark-surface-chroma) gives the dark surface and raised roles their own palette D
 * (seed hue, that chroma); `darkAccentTone` (colour.dark-accent-tone) replaces clamp(120 - accentTone, 60, 90). Both undefined
 * (the levers' auto default) reproduce the Phase 2 output exactly.
 */
export function palette(seedHex, { accentTone = 40, neutralTint = 4, contrast = 'standard', darkSurfaceChroma, darkAccentTone } = {}) {
  const seed = Hct.fromInt(argbOf(seedHex));
  const pal = { A: TonalPalette.fromHueAndChroma(seed.hue, seed.chroma), N: TonalPalette.fromHueAndChroma(seed.hue, neutralTint), T: TonalPalette.fromHueAndChroma(25, 84) };
  if (darkSurfaceChroma !== undefined) pal.D = TonalPalette.fromHueAndChroma(seed.hue, darkSurfaceChroma);
  const opts = { darkSurface: darkSurfaceChroma !== undefined, darkAccentTone };
  const hex = ([letter, tone]) => hexOf(pal[letter].tone(clamp(0, 100, tone)));
  const set = (dark, high) => Object.fromEntries(Object.entries(toneSpec(dark, high, accentTone, opts)).map(([role, spec]) => [role, hex(spec)]));
  const hi = contrast === 'high';
  return { light: set(false, hi), dark: set(true, hi), high: { light: set(false, true), dark: set(true, true) } };
}

/** The dark accent tone that lever colour.dark-accent-tone's auto default stands for: clamp(120 - light accent tone, 60, 90). */
export function darkAccentToneOf(accentTone) { return clamp(60, 90, 120 - accentTone); }

/** role -> [palette letter, tone]: A accent (seed hue + chroma), N neutral (seed hue, neutral-tint chroma), T danger (hue 25, chroma 84), D dark surface (A19 f). */
function toneSpec(dark, high, accentTone, { darkSurface = false, darkAccentTone } = {}) {
  const darkBase = darkAccentTone !== undefined ? darkAccentTone : darkAccentToneOf(accentTone);
  const accentT = dark ? Math.min(95, darkBase + (high ? 10 : 0)) : clamp(0, 100, accentTone - (high ? 10 : 0));
  const S = dark && darkSurface ? 'D' : 'N';
  return {
    surface: [S, dark ? 10 : 98], raised: [S, dark ? 17 : 100],
    'on-surface': ['N', high ? (dark ? 100 : 0) : (dark ? 90 : 10)], muted: ['N', high ? (dark ? 90 : 20) : (dark ? 80 : 40)],
    accent: ['A', accentT], 'on-accent': ['A', dark ? Math.min(20, accentT - 45) : 100], 'focus-ring': ['A', accentT],
    danger: ['T', dark ? 80 : 40], 'on-danger': ['T', dark ? 20 : 100],
  };
}
const label = ([l, t]) => `${l}${t}`;

/** Source-tone sentence per role, for a learner reading tokens.json. */
function describeRole(role, contrast, accentTone, opts = {}) {
  const hi = contrast === 'high';
  const [lt, dk, hl, hd] = [toneSpec(false, hi, accentTone, opts), toneSpec(true, hi, accentTone, opts), toneSpec(false, true, accentTone, opts), toneSpec(true, true, accentTone, opts)].map((x) => label(x[role]));
  const d = opts.darkSurface ? ', D = dark surface palette (seed hue, dark-surface chroma)' : '';
  return `Source tone: light ${lt}, dark ${dk}; high contrast light ${hl}, dark ${hd}. A = accent palette from the seed hue and chroma, N = neutral palette (seed hue, neutral-tint chroma), T = danger palette (hue 25, chroma 84)${d}; the number is the HCT tone (CIE L*).`;
}

/**
 * Checks each lever's examples against the generator: a pass example must pass contrast, and a fail example must either fail contrast
 * or be labelled "No gate fails..." (honest: nothing in the bench can catch it). Returns problems as strings ([] = fine).
 */
export function checkExamples(leverList) {
  const problems = [];
  for (const l of leverList) {
    const failed = (settings) => checkTokens(generateTokens(settings)).summary.failed;
    if (failed(l.example.pass.settings)) problems.push(`${l.id}: its pass example fails contrast`);
    if (!/^No (bench )?gate fails/.test(l.example.fail.label) && !failed(l.example.fail.settings)) {
      problems.push(`${l.id}: its fail example claims a failure but passes contrast; label it "No gate fails: ..." or change the settings`);
    }
  }
  return problems;
}

let cache;
const levers = () => (cache ??= loadLevers().levers);
/** Complete settings values -> palette() options. An auto lever (A19 f) is absent from the values and so stays undefined. */
export function paletteOpts(v) {
  return { accentTone: v['colour.accent-tone'], neutralTint: v['colour.neutral-tint'], contrast: v['colour.contrast'],
    darkSurfaceChroma: v['colour.dark-surface-chroma'], darkAccentTone: v['colour.dark-accent-tone'] };
}
const rolesTo = (prefix, set, sep = '.') => Object.fromEntries(ROLES.map((r) => [`${prefix}${sep}${r}`, set[r]]));

/** Lever settings (partial, full or {values}) -> DTCG token document with modes, contrast pairs and provenance. */
export function generateTokens(settings) {
  const s = applySettings(levers(), settings);
  const v = s.values;
  const p = palette(v['colour.seed'], paletteOpts(v));
  const roleOpts = { darkSurface: v['colour.dark-surface-chroma'] !== undefined, darkAccentTone: v['colour.dark-accent-tone'] };
  const group = (type, entries, describe) => ({ $type: type, ...Object.fromEntries(Object.entries(entries).map(([k, val]) => [k, describe ? { $value: val, $description: describe(k) } : { $value: val }])) });
  const color = (set) => group('color', set, (role) => describeRole(role, v['colour.contrast'], v['colour.accent-tone'], roleOpts));
  const sizes = typeScale(v['type.base'], v['type.ratio']);
  const rad = radiusScale(v['shape.radius']);
  const dur = durationLadder(v['motion.duration']);
  const curve = EASING[v['motion.easing']];
  const space = spaceScale(v['space.unit'], v['space.density']);
  const pair = (fg, bg, role) => ({ fg: `color.${fg}`, bg: `color.${bg}`, role });
  return {
    $description: 'Generated by engine/lib/tokens-gen.mjs from lever settings. Do not edit by hand; change the levers.',
    color: color(p.light),
    alt: { $description: 'Internal helper tokens for the high-contrast mode (named hi-<role> so contrast pairing never infers them). Not emitted to CSS.', $type: 'color',
      ...Object.fromEntries(ROLES.map((r) => [`hi-${r}`, { $value: p.high.light[r] }])) },
    font: {
      family: group('fontFamily', { sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'] }),
      size: group('dimension', Object.fromEntries(Object.entries(sizes).map(([k, n]) => [k, px(n)]))),
      'line-height': group('number', leadingScale(v['type.leading'])),
    },
    space: group('dimension', Object.fromEntries(space.map((n, i) => [String(i + 1), px(n)]))),
    radius: group('dimension', Object.fromEntries(Object.entries(rad).map(([k, n]) => [k, px(n)]))),
    motion: {
      duration: group('duration', Object.fromEntries(['instant', 'quick', 'base', 'slow', 'scene'].map((k, i) => [k, ms(dur[i])]))),
      easing: group('cubicBezier', { standard: curve, decelerate: DECELERATE, accelerate: ACCELERATE }),
    },
    $extensions: {
      'harness.modes': {
        $description: 'Every permutation is contrast-checked. High mode reads alt.hi-*, which the dark override re-points to the dark high-contrast values.',
        theme: ['light', 'dark'], contrast: ['default', 'high'],
        overrides: {
          dark: { ...rolesTo('color', p.dark), ...rolesTo('alt', p.high.dark, '.hi-') },
          high: Object.fromEntries(ROLES.map((r) => [`color.${r}`, `{alt.hi-${r}}`])),
        },
      },
      'harness.contrastPairs': [pair('on-surface', 'surface', 'body'), pair('on-surface', 'raised', 'body'), pair('muted', 'surface', 'body'),
        pair('on-accent', 'accent', 'body'), pair('on-danger', 'danger', 'body'), pair('accent', 'surface', 'ui'), pair('focus-ring', 'surface', 'ui')],
      'harness.provenance': { source: 'harness.levers/1', method: 'generated', confidence: 1, settingsHash: settingsHash(s) },
    },
  };
}

const cssValue = (type, val, path) => {
  const bad = () => new HarnessError(ERR.E_VALUE, `cannot write ${path} (${type ?? 'untyped'}) as CSS`, [path, JSON.stringify(val)]);
  if (type === 'color') return toHex(parseColor(val));
  if ((type === 'dimension' || type === 'duration') && val && typeof val === 'object' && typeof val.value === 'number' && typeof val.unit === 'string') return `${val.value}${val.unit}`;
  if (type === 'cubicBezier' && Array.isArray(val) && val.length === 4) return `cubic-bezier(${val.join(', ')})`;
  if (type === 'fontFamily' && Array.isArray(val)) return val.map((f) => (/^[\w-]+$/.test(f) ? f : `"${f}"`)).join(', ');
  if (type === 'number' && typeof val === 'number') return String(val);
  if (typeof val === 'string' && !/[;{}]/.test(val)) return val;
  throw bad();
};
const INTERNAL = /^alt(\.|$)/;
const varName = (path) => '--' + path.replaceAll('.', '-');

/** DTCG doc -> { css, cssMap }. a.b-c -> --a-b-c; dark via prefers-color-scheme, high via prefers-contrast: more. */
export function tokensToCss(doc) {
  const perms = permutations(doc);
  const at = (modes) => {
    const flat = resolvePermutation(doc, modes);
    const out = new Map();
    for (const [path, tok] of flat) if (!INTERNAL.test(path)) out.set(path, cssValue(tok.type, tok.value, path));
    return out;
  };
  const base = at(perms[0].modes);
  const cssMap = {};
  for (const path of base.keys()) {
    const name = varName(path);
    if (name in cssMap) throw new HarnessError(ERR.E_VALUE, `css name collision: ${name} is both ${cssMap[name]} and ${path}`, [cssMap[name], path]);
    cssMap[name] = path;
  }
  const first = perms[0].modes;
  const find = (theme, contrast) => perms.find((x) => (theme === undefined || x.modes.theme === theme) && (contrast === undefined || x.modes.contrast === contrast)
    && Object.entries(first).every(([k, val]) => k === 'theme' && theme !== undefined || k === 'contrast' && contrast !== undefined || x.modes[k] === val));
  const body = (map, only) => [...map].filter(([path]) => !only || only.has(path)).map(([path, val]) => `    ${varName(path)}: ${val};`);
  const differs = (map) => new Set([...map].filter(([path, val]) => base.get(path) !== val).map(([path]) => path));
  const lines = [':root {'];
  if (first.theme !== undefined) lines.push('  color-scheme: light dark;');
  lines.push(...body(base).map((l) => l.slice(2)), '}');
  const blocks = [];
  const dark = find('dark', first.contrast) && perms.length > 1 ? find('dark', first.contrast) : null;
  const high = find(first.theme, 'high');
  const both = find('dark', 'high');
  const maps = { dark: dark && at(dark.modes), high: high && high !== perms[0] && at(high.modes), both: both && at(both.modes) };
  if (maps.dark && dark !== perms[0]) blocks.push(['(prefers-color-scheme: dark)', maps.dark, differs(maps.dark)]);
  if (maps.high) blocks.push(['(prefers-contrast: more)', maps.high, differs(maps.high)]);
  if (maps.both && both !== perms[0]) {
    const union = new Set([...differs(maps.both), ...blocks.flatMap((b) => [...b[2]])]);
    blocks.push(['(prefers-color-scheme: dark) and (prefers-contrast: more)', maps.both, union]);
  }
  for (const [query, map, only] of blocks) {
    if (only.size === 0) continue;
    lines.push(`@media ${query} {`, '  :root {', ...body(map, only), '  }', '}');
  }
  return { css: lines.join('\n') + '\n', cssMap };
}
