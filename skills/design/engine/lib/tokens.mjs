// Lane B: DTCG token flattening, alias resolution, mode permutations. Pure, no I/O.
import { HarnessError, ERR } from './contracts-types.mjs';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const ALIAS = /^\{([^{}]+)\}$/;

/** doc -> Map<'a.b', {type, value}>; $type inherited from groups; '$'-keys skipped. */
export function flatten(doc) {
  const out = new Map();
  const walk = (node, path, type) => {
    if (!isObj(node)) return;
    const t = typeof node.$type === 'string' ? node.$type : type;
    if ('$value' in node) {
      out.set(path.join('.'), { type: t, value: node.$value });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      walk(v, [...path, k], t);
    }
  };
  for (const [k, v] of Object.entries(doc ?? {})) {
    if (!k.startsWith('$')) walk(v, [k], undefined);
  }
  return out;
}

/** Resolve whole-value '{a.b}' refs, recursively and inside composite values. */
export function resolveAliases(flat) {
  const done = new Map();
  const resolveToken = (path, stack) => {
    if (done.has(path)) return done.get(path);
    if (stack.includes(path)) {
      throw new HarnessError(ERR.E_ALIAS_CYCLE, `alias cycle: ${[...stack, path].join(' -> ')}`, [...stack, path]);
    }
    const tok = flat.get(path);
    const next = [...stack, path];
    let type = tok.type;
    const val = (v) => {
      if (typeof v === 'string') {
        const m = ALIAS.exec(v);
        if (!m) return v;
        const target = m[1].trim();
        if (!flat.has(target)) {
          throw new HarnessError(ERR.E_ALIAS_MISSING, `alias {${target}} not found (referenced from ${path})`, [...next, target]);
        }
        const r = resolveToken(target, next);
        if (v === tok.value && type === undefined) type = r.type;
        return r.value;
      }
      if (Array.isArray(v)) return v.map(val);
      if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)]));
      return v;
    };
    const value = val(tok.value);
    const res = { type, value };
    done.set(path, res);
    return res;
  };
  const out = new Map();
  for (const path of flat.keys()) out.set(path, resolveToken(path, []));
  return out;
}

const bad = (msg, details) => new HarnessError(ERR.E_MODES_INVALID, msg, details);

function modesOf(doc) {
  const m = doc?.$extensions?.['harness.modes'];
  if (m === undefined) return { axes: [], overrides: {} };
  if (!isObj(m)) throw bad('harness.modes must be an object');
  const axes = [];
  for (const [k, v] of Object.entries(m)) {
    if (k.startsWith('$') || k === 'overrides') continue;
    if (!Array.isArray(v)) continue;
    if (v.length === 0 || v.some((x) => typeof x !== 'string' || !x)) throw bad(`mode axis "${k}" must be a non-empty string[]`);
    axes.push([k, v]);
  }
  const overrides = m.overrides ?? {};
  if (!isObj(overrides)) throw bad('harness.modes.overrides must be an object');
  for (const [k, v] of Object.entries(overrides)) if (!isObj(v)) throw bad(`override "${k}" must be an object of token -> value`);
  const known = new Set(axes.flatMap(([a, vs]) => [...vs, ...vs.map((v) => `${a}:${v}`)]));
  const unknown = Object.keys(overrides).filter((k) => !known.has(k));
  if (unknown.length) throw bad(`override keys match no mode value: ${unknown.join(', ')}`, unknown);
  for (const k of Object.keys(overrides)) {
    const hits = axes.filter(([, vs]) => vs.includes(k)).map(([a]) => a);
    if (hits.length > 1) throw bad(`override key "${k}" is ambiguous: matches axes ${hits.join(', ')}; use "<axis>:${k}"`, hits);
  }
  return { axes, overrides };
}

/** Cartesian product of axes in declaration order (first axis outermost). */
export function permutations(doc) {
  const { axes } = modesOf(doc);
  // not an `id: '<literal>'` object key: that spelling is reserved for finding emission sites (contract §3.4)
  if (!axes.length) { const id = 'default'; return [{ id, modes: {} }]; }
  let combos = [{}];
  for (const [axis, values] of axes) combos = combos.flatMap((c) => values.map((v) => ({ ...c, [axis]: v })));
  return combos.map((modes) => ({ id: Object.entries(modes).map(([k, v]) => `${k}=${v}`).join(','), modes }));
}

/** base -> apply overrides in axis order ('<value>' then '<axis>:<value>') -> resolveAliases. */
export function resolvePermutation(doc, modes) {
  const { axes, overrides } = modesOf(doc);
  const names = new Set(axes.map(([a]) => a));
  for (const k of Object.keys(modes ?? {})) if (!names.has(k)) throw bad(`unknown mode axis "${k}"`);
  const flat = flatten(doc);
  for (const [axis, values] of axes) {
    const v = modes?.[axis];
    if (v === undefined) throw bad(`mode axis "${axis}" has no value`);
    if (!values.includes(v)) throw bad(`"${v}" is not a value of axis "${axis}"`);
    for (const key of [v, `${axis}:${v}`]) {
      const ov = overrides[key];
      if (!ov) continue;
      for (const [path, value] of Object.entries(ov)) {
        const cur = flat.get(path);
        if (!cur) throw bad(`override "${key}" targets unknown token ${path}`);
        flat.set(path, { type: cur.type, value });
      }
    }
  }
  return resolveAliases(flat);
}
