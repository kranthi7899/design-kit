// Lever definitions, settings validation and dials (PHASE-2-CONTRACT.md section 2.1, 2.2, 4). Pure: no cdp, child_process, http, net.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HarnessError, ERR2, SCHEMA2, LEVER_GROUPS, LEVER_CONTROLS, LEVER_ID, TERM_ID } from './contracts-types.mjs';

const here = (rel) => new URL(rel, import.meta.url);
export const GATES = Object.freeze(['token-contrast', 'reduced-motion-ignored', 'theme-unresponsive']);
const HEX = /^#[0-9a-f]{6}$/i;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;
const eq = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b);
const show = (v) => (typeof v === 'number' && !Number.isFinite(v) ? String(v) : JSON.stringify(v));
const clean = (n) => Math.round(n * 1e6) / 1e6; // strip float noise (0.1 + 0.2)
// A19 f: a range lever whose default is AUTO is derived from other levers until it is set. defaults() leaves it out, so every
// earlier settings object (and its hash and tokens) is unchanged; setting it to AUTO removes it again.
export const AUTO = 'auto';
const isAuto = (l) => l.default === AUTO;

function readJson(path, what) {
  let text;
  try { text = readFileSync(path, 'utf8'); } catch (e) { throw new HarnessError(ERR2.E_KNOWLEDGE, `cannot read ${what} ${path}: ${e.message}`, [String(path)]); }
  try { return JSON.parse(text); } catch (e) { throw new HarnessError(ERR2.E_KNOWLEDGE, `${what} ${path} is not JSON: ${e.message}`, [String(path)]); }
}

/** Is `v` a legal value of lever `l`? -> { ok, value (normalised), range (text) } */
function check(l, v) {
  if (l.control === 'range') {
    const range = `${l.min}..${l.max} step ${l.step}${isAuto(l) ? ` or "${AUTO}"` : ''}`;
    if (v === AUTO && isAuto(l)) return { ok: true, value: AUTO, range };
    if (typeof v !== 'number' || !Number.isFinite(v) || v < l.min - 1e-9 || v > l.max + 1e-9) return { ok: false, range };
    const k = (v - l.min) / l.step;
    if (Math.abs(k - Math.round(k)) > 1e-6) return { ok: false, range };
    return { ok: true, value: clean(v), range };
  }
  if (l.control === 'enum') {
    const range = `one of ${l.options.map((o) => JSON.stringify(o.value)).join(', ')}`;
    const hit = l.options.find((o) => eq(o.value, v));
    return hit ? { ok: true, value: hit.value, range } : { ok: false, range };
  }
  const range = '#rrggbb';
  return typeof v === 'string' && HEX.test(v) ? { ok: true, value: v.toLowerCase(), range } : { ok: false, range };
}

/** Loads and validates knowledge/levers.json. Throws E_KNOWLEDGE listing every problem in details. */
export function loadLevers(path = here('../../knowledge/levers.json')) {
  const doc = readJson(path, 'levers file');
  const problems = [];
  const bad = (m) => problems.push(m);
  if (!isObj(doc) || doc.schema !== SCHEMA2.levers) bad(`schema must be ${SCHEMA2.levers}`);
  const list = Array.isArray(doc?.levers) ? doc.levers : (bad('levers must be an array'), []);
  const seen = new Set();
  list.forEach((l, i) => {
    const at = `levers[${i}]${isObj(l) && l.id ? ` (${l.id})` : ''}`;
    if (!isObj(l)) return bad(`${at}: must be an object`);
    if (typeof l.id !== 'string' || !LEVER_ID.test(l.id)) bad(`${at}: id must match ${LEVER_ID}`);
    else if (seen.has(l.id)) bad(`${at}: duplicate id`); else seen.add(l.id);
    if (!LEVER_GROUPS.includes(l.group)) bad(`${at}: group must be one of ${LEVER_GROUPS.join(', ')}`);
    else if (typeof l.id === 'string' && l.id.split('.')[0] !== l.group && !(l.group === 'colour' && l.id.startsWith('colour.'))) bad(`${at}: id prefix does not match group ${l.group}`);
    if (!LEVER_CONTROLS.includes(l.control)) bad(`${at}: control must be one of ${LEVER_CONTROLS.join(', ')}`);
    if (!isStr(l.label)) bad(`${at}: label missing`);
    if (!isStr(l.plain)) bad(`${at}: plain missing`);
    if (!isStr(l.technical)) bad(`${at}: technical missing`);
    if (typeof l.term !== 'string' || !TERM_ID.test(l.term)) bad(`${at}: term must be a glossary term id`);
    if (!Array.isArray(l.mapsTo) || l.mapsTo.length === 0 || !l.mapsTo.every(isStr)) bad(`${at}: mapsTo must be a non-empty string[]`);
    if (!Array.isArray(l.gates) || !l.gates.every((g) => GATES.includes(g))) bad(`${at}: gates must be a subset of ${GATES.join(', ')}`);
    if (!Array.isArray(l.ruleIds) || !l.ruleIds.every(isStr)) bad(`${at}: ruleIds must be string[]`);
    if (l.control === 'range') {
      if (![l.min, l.max, l.step].every((n) => typeof n === 'number') || !(isAuto(l) || typeof l.default === 'number') || !(l.min < l.max) || !(l.step > 0)) bad(`${at}: range needs numeric min < max, step > 0, default (a number or "${AUTO}")`);
      if (isAuto(l) && !isStr(l.auto)) bad(`${at}: a default of "${AUTO}" needs an "auto" sentence saying what it follows`);
    } else if (l.control === 'enum') {
      if (!Array.isArray(l.options) || l.options.length < 2 || !l.options.every((o) => isObj(o) && 'value' in o && isStr(o.label))) bad(`${at}: enum needs options [{value,label}] (at least 2)`);
    }
    if (LEVER_CONTROLS.includes(l.control) && (l.control !== 'range' || problems.every((p) => !p.startsWith(at)))) {
      if (l.control === 'enum' && !Array.isArray(l.options)) return;
      try { if (!check(l, l.default).ok) bad(`${at}: default ${JSON.stringify(l.default)} is not legal for the lever`); } catch { bad(`${at}: default cannot be checked`); }
    }
    for (const k of ['pass', 'fail']) {
      const ex = l.example?.[k];
      if (!isObj(ex) || !isStr(ex.label) || !isObj(ex.settings)) bad(`${at}: example.${k} needs label and settings`);
    }
  });
  // example settings must name levers that exist and hold legal values (second pass: needs every lever)
  const byId = new Map(list.filter((l) => isObj(l) && typeof l.id === 'string').map((l) => [l.id, l]));
  if (problems.length === 0) {
    for (const l of list) for (const k of ['pass', 'fail']) for (const [id, v] of Object.entries(l.example[k].settings)) {
      const t = byId.get(id);
      if (!t) bad(`${l.id}: example.${k} names unknown lever ${id}`);
      else if (!check(t, v).ok) bad(`${l.id}: example.${k} sets ${id} to illegal ${JSON.stringify(v)}`);
    }
  }
  if (problems.length) throw new HarnessError(ERR2.E_KNOWLEDGE, `${path} is invalid (${problems.length} problem(s))`, problems);
  return { levers: list, byId };
}

/** Loads knowledge/dials.json (shape only; moves are validated when applied). */
export function loadDials(path = here('../../knowledge/dials.json')) {
  const doc = readJson(path, 'dials file');
  const problems = [];
  if (!isObj(doc) || doc.schema !== SCHEMA2.dials) problems.push(`schema must be ${SCHEMA2.dials}`);
  const list = Array.isArray(doc?.dials) ? doc.dials : (problems.push('dials must be an array'), []);
  list.forEach((d, i) => {
    if (!isObj(d) || !isStr(d.id) || !isStr(d.label) || !isStr(d.plain) || !isObj(d.moves)) return problems.push(`dials[${i}]: needs id, label, plain, moves`);
    for (const [lever, m] of Object.entries(d.moves)) {
      const keys = isObj(m) ? Object.keys(m) : [];
      if (keys.length !== 1 || !['mul', 'add', 'set', 'stepOption'].includes(keys[0])) problems.push(`dials[${i}] (${d.id}): move for ${lever} must be exactly one of mul|add|set|stepOption`);
    }
  });
  if (problems.length) throw new HarnessError(ERR2.E_KNOWLEDGE, `${path} is invalid (${problems.length} problem(s))`, problems);
  return doc;
}

const valuesOf = (s) => (isObj(s) && isObj(s.values) ? s.values : isObj(s) ? s : {});
const wrap = (values) => ({ schema: SCHEMA2.settings, values });

/** Every lever's default as a complete settings object. Auto levers (A19 f) are left out: absent means derived. */
export function defaults(levers) {
  return wrap(Object.fromEntries(levers.filter((l) => !isAuto(l)).map((l) => [l.id, l.default])));
}

/** Partial values (or a settings object) -> complete, validated, normalised settings. */
export function applySettings(levers, partial) {
  const byId = new Map(levers.map((l) => [l.id, l]));
  const out = { ...defaults(levers).values };
  for (const [id, v] of Object.entries(valuesOf(partial))) {
    const l = byId.get(id);
    if (!l) throw new HarnessError(ERR2.E_LEVER_UNKNOWN, `unknown lever ${id}`, [id, `known: ${[...byId.keys()].join(', ')}`]);
    const r = check(l, v);
    if (!r.ok) throw new HarnessError(ERR2.E_LEVER_RANGE, `${id} cannot be ${show(v)} (allowed: ${r.range})`, [id, show(v), r.range]);
    if (r.value === AUTO) delete out[id]; else out[id] = r.value;
  }
  return wrap(out);
}

/** Clamp to the lever's range, then snap to its step grid (never past max). */
function snap(l, x) {
  let v = Math.min(l.max, Math.max(l.min, x));
  v = l.min + Math.round((v - l.min) / l.step + 1e-9) * l.step;
  if (v > l.max) v -= l.step;
  return clean(v);
}

function move(l, cur, m) {
  const [op, arg] = Object.entries(m)[0];
  if (op === 'set') {
    if (l.control !== 'range' || typeof arg !== 'number') return arg; // enum/colour: applySettings rejects an illegal option
    return snap(l, arg);
  }
  if (op === 'stepOption') {
    if (l.control !== 'enum') return cur;
    const i = l.options.findIndex((o) => eq(o.value, cur));
    return l.options[Math.min(l.options.length - 1, Math.max(0, i + arg))].value;
  }
  if (l.control !== 'range' || typeof cur !== 'number') return cur;
  return snap(l, op === 'mul' ? cur * arg : cur + arg);
}

/** Applies a dial's moves to complete settings. Result is clamped and snapped; `moved` lists only levers whose value changed. */
export function applyDial(levers, dials, settings, dialId) {
  const list = Array.isArray(dials) ? dials : dials?.dials ?? [];
  const dial = list.find((d) => d.id === dialId);
  if (!dial) throw new HarnessError(ERR2.E_DIAL_UNKNOWN, `unknown dial ${dialId}`, [dialId, `known: ${list.map((d) => d.id).join(', ')}`]);
  const byId = new Map(levers.map((l) => [l.id, l]));
  const values = { ...applySettings(levers, settings).values };
  const moved = [];
  for (const [id, m] of Object.entries(dial.moves)) {
    const l = byId.get(id);
    if (!l) throw new HarnessError(ERR2.E_LEVER_UNKNOWN, `dial ${dialId} moves unknown lever ${id}`, [id]);
    const from = values[id];
    const to = move(l, from, m);
    if (!eq(from, to)) { values[id] = to; moved.push({ lever: id, from, to }); }
  }
  return { settings: applySettings(levers, values), moved };
}

const canon = (v) => (Array.isArray(v) ? `[${v.map(canon).join(',')}]` : isObj(v) ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}` : JSON.stringify(v));
/** sha1 of the canonical JSON of the full values, 12 hex digits. */
export function settingsHash(settings) {
  return createHash('sha1').update(canon(valuesOf(settings))).digest('hex').slice(0, 12);
}

/** 'type.ratio=1.2' -> ['type.ratio', 1.2], typed by the lever (number for range, the matching option for enum, hex for colour). */
export function parseAssignment(levers, text) {
  const eqAt = String(text).indexOf('=');
  if (eqAt < 1) throw new HarnessError(ERR2.E_LEVER_RANGE, `expected id=value, got ${JSON.stringify(text)}`, [String(text)]);
  const id = text.slice(0, eqAt);
  const raw = text.slice(eqAt + 1);
  const l = levers.find((x) => x.id === id);
  if (!l) throw new HarnessError(ERR2.E_LEVER_UNKNOWN, `unknown lever ${id}`, [id, `known: ${levers.map((x) => x.id).join(', ')}`]);
  if (l.control === 'range') return [id, isAuto(l) && raw.trim() === AUTO ? AUTO : raw.trim() === '' ? NaN : Number(raw)];
  if (l.control === 'enum') {
    const hit = l.options.find((o) => (typeof o.value === 'number' ? raw.trim() !== '' && eq(o.value, Number(raw)) : o.value === raw));
    return [id, hit ? hit.value : raw];
  }
  return [id, raw];
}

/** Reads a harness.lever-settings/1 file (or a bare id -> value map) and returns its values (not yet validated). */
export function readSettingsFile(path) {
  const doc = readJson(path, 'settings file');
  if (!isObj(doc)) throw new HarnessError(ERR2.E_KNOWLEDGE, `settings file ${path} must be a JSON object`, [String(path)]);
  if (doc.schema !== undefined && doc.schema !== SCHEMA2.settings) throw new HarnessError(ERR2.E_KNOWLEDGE, `settings file ${path}: schema must be ${SCHEMA2.settings}`, [String(path)]);
  return valuesOf(doc);
}
