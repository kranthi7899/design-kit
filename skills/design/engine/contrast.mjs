#!/usr/bin/env node
// Lane B CLI: node engine/contrast.mjs <tokens.json> [--json] [--out file]. Exit 0 ok, 1 FAIL, 2 error.
import { readFileSync, writeFileSync } from 'node:fs';
import { HarnessError, ERR, EXIT } from './lib/contracts-types.mjs';
import { checkTokens } from './lib/contrast.mjs';
import { cleanLine as clean } from './lib/term.mjs';

function main(argv) {
  let file; let json = false; let out;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') json = true;
    else if (a === '--out') {
      out = argv[++i];
      if (!out) throw new HarnessError(ERR.E_USAGE, '--out needs a file');
    } else if (a.startsWith('--')) throw new HarnessError(ERR.E_USAGE, `unknown option ${a}`);
    else if (file === undefined) file = a;
    else throw new HarnessError(ERR.E_USAGE, `unexpected argument ${a}`);
  }
  if (!file) throw new HarnessError(ERR.E_USAGE, 'usage: contrast.mjs <tokens.json> [--json] [--out file]');
  let text;
  try { text = readFileSync(file, 'utf8'); } catch (e) { throw new HarnessError(ERR.E_IO, `cannot read ${file}: ${e.message}`); }
  let doc;
  try { doc = JSON.parse(text); } catch (e) { throw new HarnessError(ERR.E_JSON, `${file}: ${e.message}`); }
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) throw new HarnessError(ERR.E_VALUE, `${file}: token file must be a JSON object`);
  const rep = checkTokens(doc, { source: file });
  // A gate that checked nothing must not pass: no pair (declared or inferred) means the file is not doing its job.
  if (rep.summary.checks === 0) throw new HarnessError(ERR.E_VALUE, `${file}: no contrast pairs to check (declare harness.contrastPairs or add on-X/X colour siblings)`);
  const body = JSON.stringify(rep, null, 2);
  if (out) {
    try { writeFileSync(out, body + '\n'); } catch (e) { throw new HarnessError(ERR.E_IO, `cannot write ${out}: ${e.message}`); }
  }
  if (json) console.log(body);
  else {
    const s = rep.summary;
    console.log(`contrast: ${s.checks} checks, ${s.failed} failed (${s.permutations} permutations, ${s.pairs} pairs)`);
    for (const f of rep.findings) console.log(clean(`FAIL ${f.id} ${f.message}`));
  }
  return rep.summary.failed ? EXIT.FAIL : EXIT.OK;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (e) {
  if (!(e instanceof HarnessError)) throw e;
  console.error(clean(`harness: ${e.code} ${e.message}`));
  for (const d of e.details) console.error(clean(`  ${d}`));
  process.exitCode = EXIT.ERROR;
}
