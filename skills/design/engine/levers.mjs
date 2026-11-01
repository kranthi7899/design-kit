#!/usr/bin/env node
// harness / levers: list, validate and explain the 14 design levers, or print the tokens they generate.
//
//   node engine/levers.mjs [--check] [--explain <id>] [--tokens] [--settings f] [--set id=v]... [--json]
//
// Exit 0 ok, 1 a lever's own pass example fails contrast (--check), 2 usage or input error.
import { HarnessError, ERR, ERR2, EXIT } from './lib/contracts-types.mjs';
import { loadLevers, loadDials, applySettings, parseAssignment, readSettingsFile, settingsHash, defaults } from './lib/levers.mjs';
import { generateTokens, EASING, checkExamples } from './lib/tokens-gen.mjs';
import { checkTokens } from './lib/contrast.mjs';
import { clean, cleanLine, errCode } from './lib/term.mjs';

function parseArgs(argv) {
  const o = { sets: [], mode: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const need = () => { if (i + 1 >= argv.length) throw new HarnessError(ERR.E_USAGE, `${a} needs a value`); return argv[++i]; };
    if (a === '--check') o.mode = 'check';
    else if (a === '--tokens') o.mode = 'tokens';
    else if (a === '--explain') { o.mode = 'explain'; o.id = need(); }
    else if (a === '--settings') o.settings = need();
    else if (a === '--set') o.sets.push(need());
    else if (a === '--json') o.json = true;
    else throw new HarnessError(ERR.E_USAGE, `unknown argument ${a}; usage: levers.mjs [--check] [--explain <id>] [--tokens] [--settings f] [--set id=v]... [--json]`);
  }
  return o;
}

function check(levers, dials) {
  const problems = [];
  for (const l of levers.levers) {
    if (l.id === 'motion.easing') {
      for (const opt of l.options) if (JSON.stringify(opt.curve) !== JSON.stringify(EASING[opt.value])) problems.push(`${l.id}: option ${opt.value} curve differs from tokens-gen EASING`);
    }
  }
  problems.push(...checkExamples(levers.levers));
  const d = checkTokens(generateTokens({}));
  if (d.summary.failed || d.summary.checks !== 28) problems.push(`defaults give ${d.summary.checks} checks, ${d.summary.failed} failed (contract: 28, 0)`);
  for (const dial of dials.dials) {
    const unknown = Object.keys(dial.moves).filter((id) => !levers.byId.has(id));
    if (unknown.length) problems.push(`dial ${dial.id} moves unknown lever(s) ${unknown.join(', ')}`);
    if (Object.keys(dial.moves).length < 2) problems.push(`dial ${dial.id} moves fewer than 2 levers`);
  }
  return problems;
}

function explain(l, value, json) {
  if (json) return JSON.stringify({ ...l, value }, null, 2);
  const ex = (k) => `  ${k}: ${l.example[k].label}  ${JSON.stringify(l.example[k].settings)}`;
  const range = l.control === 'range' ? `${l.min}..${l.max} step ${l.step}` : l.control === 'enum' ? l.options.map((o) => `${o.value} (${o.label})`).join(', ') : '#rrggbb';
  return [`${l.id}: ${l.label}  [${l.group}, ${l.control}${l.unit ? ', ' + l.unit : ''}]`, `value ${value === undefined ? 'auto' : JSON.stringify(value)} (default ${JSON.stringify(l.default)}; allowed ${range})`, '',
    `In plain words: ${l.plain}`, `Technically: ${l.technical}`, `Term: term:${l.term}`, `Maps to: ${l.mapsTo.join(', ')}`,
    `Checked by: ${[...l.gates.map((g) => `gate ${g}`), ...l.ruleIds.map((r) => `rule:${r}`)].join(', ') || 'nothing (judge by eye)'}`, 'Examples:', ex('pass'), ex('fail')].join('\n');
}

try {
  const o = parseArgs(process.argv.slice(2));
  const levers = loadLevers();
  const base = o.settings ? readSettingsFile(o.settings) : {};
  const overlay = Object.fromEntries(o.sets.map((s) => parseAssignment(levers.levers, s)));
  const settings = applySettings(levers.levers, { ...base, ...overlay });
  let code = EXIT.OK;
  if (o.mode === 'check') {
    const dials = loadDials();
    const problems = check(levers, dials);
    if (o.json) console.log(JSON.stringify({ levers: levers.levers.length, dials: dials.dials.length, problems }, null, 2));
    else {
      console.log(`levers: ${levers.levers.length} levers, ${dials.dials.length} dials, ${problems.length} problem(s)`);
      for (const p of problems) console.log(cleanLine(`  ${p}`));
    }
    if (problems.length) code = EXIT.FAIL;
  } else if (o.mode === 'tokens') {
    console.log(JSON.stringify(generateTokens(settings), null, 2));
  } else if (o.mode === 'explain') {
    const l = levers.byId.get(o.id);
    if (!l) throw new HarnessError(ERR2.E_LEVER_UNKNOWN, `unknown lever ${o.id}`, [`known: ${[...levers.byId.keys()].join(', ')}`]);
    console.log(o.json ? explain(l, settings.values[l.id], true) : clean(explain(l, settings.values[l.id], false)));
  } else if (o.json) {
    console.log(JSON.stringify({ settings, settingsHash: settingsHash(settings) }, null, 2));
  } else {
    const def = defaults(levers.levers).values;
    console.log(`settings ${settingsHash(settings)}`);
    for (const l of levers.levers) console.log(cleanLine(`  ${l.id.padEnd(20)} ${String(settings.values[l.id]).padEnd(9)} ${settings.values[l.id] === def[l.id] ? '' : `(default ${def[l.id]})`}`.trimEnd()));
  }
  process.exitCode = code;
} catch (e) {
  if (e instanceof HarnessError) {
    console.error(cleanLine(`harness: ${e.code} ${e.message}`));
    for (const d of e.details) console.error(cleanLine('  ' + d));
  } else console.error(cleanLine(`harness: ${errCode(e)} ${(e && e.message) || e}`));
  process.exitCode = EXIT.ERROR;
}
