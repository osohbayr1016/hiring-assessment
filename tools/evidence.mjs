/** Candidate-triggered, privacy-limited work evidence. No telemetry or network requests. */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MAX_LOG = 12000;
function git(args) {
  const res = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024 });
  if (res.error || res.status !== 0) return null;
  return res.stdout.trim();
}
function safeText(value, max = 220) {
  return String(value ?? '').replace(/[\r\n\t\0]+/g, ' ').slice(0, max);
}
function getCommitDetails(base) {
  const raw = git(['log', '--format=%H%x1f%s%x1f%cI%x1e', '-n', '80', base ? `${base}..HEAD` : 'HEAD']);
  if (!raw) return [];
  return raw.split('\x1e').map(r => r.trim()).filter(Boolean).map(row => {
    const [sha, subject, committedAt] = row.split('\x1f');
    return { sha: sha?.slice(0, 40), subject: safeText(subject), committedAt: safeText(committedAt, 40) };
  }).filter(x => /^[0-9a-f]{40}$/.test(x.sha));
}
function collect({ base, runChecks }) {
  const branch = git(['branch', '--show-current']);
  const head = git(['rev-parse', 'HEAD']);
  const dirty = Boolean(git(['status', '--porcelain']));
  const filesRaw = git(base ? ['diff', '--name-only', `${base}...HEAD`] : ['show', '--pretty=', '--name-only', 'HEAD']);
  const files = (filesRaw ?? '').split('\n').filter(Boolean).slice(0, 250).filter(p => !p.startsWith('.data/') && !p.includes('.env') && !p.includes('node_modules'));
  let checks = [];
  if (runChecks) {
    for (const [label, cmd, args] of [['unit-tests', process.execPath, ['--test', 'tests/smoke.test.mjs']], ['syntax', process.execPath, ['--check', 'src/server.mjs']]]) {
      const start = Date.now();
      const res = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024 });
      checks.push({ label, passed: res.status === 0 && !res.error, exitCode: res.status, durationMs: Date.now() - start, outputTail: safeText(((res.stdout ?? '') + (res.stderr ?? '')).slice(-MAX_LOG), 300) });
    }
  }
  return { schemaVersion: 1, collectedAt: new Date().toISOString(), source: 'candidate-local-self-report', base: base || null, branch: safeText(branch, 100), head, dirty, changedFiles: files, commits: getCommitDetails(base), checks, declaration: 'Locally generated evidence; reviewer must verify against submitted PR and CI. No keystroke or screen monitoring.' };
}
function main(argv) {
  const idx = argv.indexOf('--base');
  const base = idx >= 0 ? argv[idx + 1] : null;
  if (idx >= 0 && (!base || !/^[0-9a-fA-F]{7,40}$/.test(base))) throw new Error('--base must be a valid commit SHA (7–40 hexadecimal characters)');
  const evidence = collect({ base, runChecks: argv.includes('--run-checks') });
  const dest = resolve(ROOT, '.data', 'candidate-evidence.json');
  mkdirSync(resolve(ROOT, '.data'), { recursive: true });
  writeFileSync(dest, JSON.stringify(evidence, null, 2) + '\n', { mode: 0o600 });
  console.log(`Candidate evidence saved locally to ${dest}. Attach to PRIVATE submission, not the public starter. Checks are self-reported until verified by reviewer.`);
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) main(process.argv.slice(2));
export { collect, safeText };
