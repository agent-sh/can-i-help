'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const script = path.resolve(__dirname, '..', 'scripts', 'collect.js');
const { parseArgs } = require(script);
const { partitionSlop } = require('../lib/collector');

test('parseArgs accepts a path and both --depth spellings', () => {
  assert.deepEqual(parseArgs(['/tmp', '--depth=deep']), { depth: 'deep', target: '/tmp' });
  assert.equal(parseArgs(['--depth', 'normal']).depth, 'normal');
  assert.equal(parseArgs([]).target, process.cwd());
});

test('parseArgs rejects bad depth, unknown flags and two paths', () => {
  assert.throws(() => parseArgs(['--depth=quick']), /normal, deep/);
  assert.throws(() => parseArgs(['--depth']), /got nothing/);
  assert.throws(() => parseArgs(['--verbose']), /unknown flag/);
  assert.throws(() => parseArgs(['a', 'b']), /only one path/);
});

test('bad flag exits 2 with the allowed values', () => {
  const r = cp.spawnSync(process.execPath, [script, '--depth=huge'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /normal, deep/);
});

test('partitionSlop counts every finding and caps samples at 10', () => {
  const fixes = [];
  for (let i = 0; i < 12; i++) fixes.push({ category: 'orphan-export', file: `f${i}` });
  fixes.push({ category: 'commented-out-code' }, { category: 'empty-catch' });
  const out = partitionSlop({ fixes });
  assert.equal(out.counts.orphanExports, 12);
  assert.equal(out.orphanExports.length, 10);
  assert.equal(out.counts.commentedOutCode, 1);
  assert.equal(out.counts.passthroughWrappers, 0);
  assert.equal(out.emptyCatch, undefined);
  assert.deepEqual(partitionSlop(null).counts.alwaysTrueConditions, 0);
});

test('writes the data file into the target state dir', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cih-'));
  try {
    cp.execFileSync('git', ['init', '-q'], { cwd: dir });
    fs.writeFileSync(path.join(dir, 'README.md'), '# demo\n');
    const r = cp.spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    const outFile = path.join(dir, '.claude', 'can-i-help-data.json');
    assert.match(r.stdout, new RegExp(`data: ${outFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    for (const key of ['manifest', 'readme', 'structure', 'gitInfo', 'contributorSignals', 'issues']) {
      assert.ok(key in data, `missing ${key}`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('repo-map summary reads the current object shape and the old array shape', () => {
  const { summarizeRepoMapFiles } = require('../lib/collector');
  const sym = (name, line) => ({ name, kind: 'function', line });
  const r = summarizeRepoMapFiles({
    'src/a.js': { symbols: { exports: [sym('a', 1), sym('b', 2), sym('c', 3), sym('d', 4)], functions: [sym('a', 1), sym('e', 9)] } },
    'src/b.js': { symbols: { exports: [sym('x', 1)] } }
  });
  assert.equal(r.totalFiles, 2);
  assert.equal(r.totalSymbols, 6);
  assert.deepEqual(r.keyExports, { 'src/a.js': ['a', 'b', 'c', 'd'] });

  const o = summarizeRepoMapFiles({
    'src/c.js': { symbols: ['p', 'q', 'r', 's', 't'].map(n => ({ name: n, exported: n !== 't' })) }
  });
  assert.equal(o.totalSymbols, 5);
  assert.deepEqual(o.keyExports, { 'src/c.js': ['p', 'q', 'r', 's'] });
});
