// Lane B: WCAG 2.2 contrast gate over token permutations. Pure, no I/O.
import { HarnessError, ERR, SCHEMA, WCAG } from './contracts-types.mjs';
import { parseColor, contrastRatio, toHex } from './color.mjs';
import { flatten, permutations, resolvePermutation } from './tokens.mjs';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const pairErr = (code, msg, d) => new HarnessError(code, msg, d);

function normalizeDeclared(raw, i) {
  let fg, bg, role, min;
  if (Array.isArray(raw)) [fg, bg, min] = raw;
  else if (isObj(raw)) ({ fg, bg, role, min } = raw);
  else throw pairErr(ERR.E_VALUE, `harness.contrastPairs[${i}] must be a tuple or object`);
  if (typeof fg !== 'string' || typeof bg !== 'string') throw pairErr(ERR.E_VALUE, `harness.contrastPairs[${i}] needs fg and bg token paths`);
  if (role !== undefined && !Object.hasOwn(WCAG, role)) throw pairErr(ERR.E_VALUE, `harness.contrastPairs[${i}] role "${role}" is not one of ${Object.keys(WCAG).join(', ')}`);
  if (min !== undefined && typeof min !== 'number') throw pairErr(ERR.E_VALUE, `harness.contrastPairs[${i}] min must be a number`);
  let required;
  if (role) required = Math.max(WCAG[role], min ?? 0);
  else if (min !== undefined) {
    if (min < 3) throw pairErr(ERR.E_PAIR_BELOW_FLOOR, `harness.contrastPairs[${i}] min ${min} is below the WCAG floor of 3`, [fg, bg]);
    required = min;
  } else required = WCAG.body;
  return { fg, bg, role: role ?? 'body', required, inferred: false };
}

/** Declared pairs plus inferred sibling '<g>.on-X' / '<g>.X' colour pairs; dedupe fg|bg, declared wins. */
export function collectPairs(doc, flat) {
  const declared = doc?.$extensions?.['harness.contrastPairs'];
  if (declared !== undefined && !Array.isArray(declared)) throw pairErr(ERR.E_VALUE, 'harness.contrastPairs must be an array');
  const out = new Map();
  (declared ?? []).forEach((raw, i) => {
    const p = normalizeDeclared(raw, i);
    const key = `${p.fg}|${p.bg}`;
    const prev = out.get(key);
    if (!prev) out.set(key, p);
    else prev.required = Math.max(prev.required, p.required);
  });
  for (const [path, tok] of flat) {
    if (tok.type !== 'color') continue;
    const dot = path.lastIndexOf('.');
    const group = dot < 0 ? '' : path.slice(0, dot + 1);
    const name = path.slice(dot + 1);
    if (!name.startsWith('on-')) continue;
    const bgPath = group + name.slice(3);
    if (flat.get(bgPath)?.type !== 'color') continue;
    const key = `${path}|${bgPath}`;
    if (!out.has(key)) out.set(key, { fg: path, bg: bgPath, role: 'body', required: WCAG.body, inferred: true });
  }
  return [...out.values()];
}

const round2 = (n) => Math.round(n * 100) / 100;

/** Pure: tokens doc -> ContrastReport (harness.contrast/1). */
export function checkTokens(doc, { source } = {}) {
  const perms = permutations(doc);
  const pairs = collectPairs(doc, flatten(doc));
  const checks = [];
  for (const perm of perms) {
    const flat = resolvePermutation(doc, perm.modes);
    for (const p of pairs) {
      const tokens = [p.fg, p.bg].map((path) => {
        const t = flat.get(path);
        if (!t) throw pairErr(ERR.E_PAIR_TOKEN_MISSING, `pair token ${path} is missing in ${perm.id}`, [perm.id, path]);
        if (t.type !== 'color') throw pairErr(ERR.E_PAIR_NOT_COLOR, `pair token ${path} has type ${t.type ?? 'none'}, not color`, [perm.id, path]);
        return t;
      });
      const fg = parseColor(tokens[0].value);
      const bg = parseColor(tokens[1].value);
      const ratio = contrastRatio(fg, bg);
      checks.push({ permutation: perm.id, fg: p.fg, bg: p.bg, fgValue: toHex(fg), bgValue: toHex(bg),
        ratio: round2(ratio), required: p.required, role: p.role, inferred: p.inferred, pass: ratio >= p.required });
    }
  }
  const findings = judgePairs(checks);
  return {
    schema: SCHEMA.contrast,
    tokens: source,
    permutations: perms,
    checks,
    summary: { permutations: perms.length, pairs: pairs.length, checks: checks.length, failed: checks.filter((c) => !c.pass).length },
    findings,
    advisory: { apca: 'not computed in Phase 1; WCAG 2.2 ratio is the gate' },
  };
}

/** Failed checks -> Finding[] (id 'token-contrast'). */
export function judgePairs(checks) {
  return checks.filter((c) => !c.pass).map((c) => ({
    level: 'FAIL',
    id: 'token-contrast',
    message: `${c.fg} on ${c.bg} is ${c.ratio}:1, needs ${c.required}:1 in ${c.permutation} (${c.fgValue} on ${c.bgValue})`,
    fix: `Change ${c.fg} or ${c.bg} in ${c.permutation} until the ratio is at least ${c.required}:1.`,
    permutation: c.permutation,
    pair: [c.fg, c.bg],
  }));
}
