#!/usr/bin/env node
// collect - gather project data and contributor signals for /can-i-help
'use strict';

/**
 * Usage: node scripts/collect.js [path] [--depth normal|deep]
 *
 * Runs lib/collector (manifest, structure, git, repo-intel, contributor
 * signals, open issues), writes the result to
 * <path>/<stateDir>/can-i-help-data.json and prints one status line per
 * source. Exit 2 on a bad argument, 1 if the path is not a directory.
 */

const fs = require('fs');
const path = require('path');
const collector = require('../lib/collector');

const DEPTHS = ['normal', 'deep'];

function parseArgs(argv) {
  const out = { depth: 'normal', target: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--depth' || arg.startsWith('--depth=')) {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[++i];
      if (!DEPTHS.includes(value)) {
        throw new Error(`--depth must be one of: ${DEPTHS.join(', ')} (got ${value === undefined ? 'nothing' : value})`);
      }
      out.depth = value;
    } else if (arg.startsWith('--')) {
      throw new Error(`unknown flag ${arg}. Usage: [path] [--depth normal|deep]`);
    } else if (out.target === null) {
      out.target = arg;
    } else {
      throw new Error(`only one path is accepted (got ${out.target} and ${arg})`);
    }
  }
  out.target = path.resolve(out.target || process.cwd());
  return out;
}

function stateDirFor(target) {
  return ['.claude', '.opencode', '.codex']
    .find(d => fs.existsSync(path.join(target, d))) || '.claude';
}

function count(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') {
    for (const key of ['files', 'items', 'results', 'gaps', 'docs', 'references']) {
      if (Array.isArray(value[key])) return value[key].length;
    }
    return 'available';
  }
  return 0;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`[ERROR] ${e.message}`);
    process.exit(2);
  }
  if (!fs.existsSync(opts.target) || !fs.statSync(opts.target).isDirectory()) {
    console.error(`[ERROR] not a directory: ${opts.target}`);
    process.exit(1);
  }

  const data = collector.collect(opts.target, { depth: opts.depth });
  const outDir = path.join(opts.target, stateDirFor(opts.target));
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'can-i-help-data.json');
  const tmp = `${outFile}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, outFile);

  const s = data.contributorSignals;
  const lines = [
    `manifest: ${data.manifest ? `${data.manifest.type || 'unknown'} (${data.manifest.language || '?'})` : 'none'}`,
    `repo-intel: ${data.repoIntel ? 'available' : 'unavailable'}`,
    `contributor signals: ${s ? 'available' : 'unavailable (no repo-intel map or analyzer)'}`
  ];
  if (s) {
    for (const key of ['canIHelp', 'testGaps', 'docDrift', 'bugspots', 'staleDocs', 'conventions']) {
      lines.push(`  ${key}: ${s[key] === null ? 'unavailable' : count(s[key])}`);
    }
    const slop = s.slopFirstContributions;
    lines.push(`  slopFirstContributions: ${slop ? Object.entries(slop.counts).map(([k, v]) => `${k}=${v}`).join(' ') : 'unavailable'}`);
  }
  lines.push(`open issues: ${data.issues ? data.issues.length : 'none or gh unavailable'}`);
  if (opts.depth === 'deep') lines.push(`repo-map: ${data.repoMap ? `${data.repoMap.totalFiles} files` : 'unavailable'}`);
  for (const line of lines) console.log(line);
  console.log(`data: ${outFile}`);
}

if (require.main === module) main();

module.exports = { parseArgs };
