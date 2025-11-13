#!/usr/bin/env node
/**
 * Scan test files and warn/error when test names lack PRD tokens
 * (e.g., PRD-0007-FR-3, PRD-0007-NFR-1).
 *
 * Usage:
 *   node scripts/check-prd-tokens.mjs [--root .] [--strict]
 *     [--include-ext js,ts,tsx,jsx,py,rb,go] [--print]
 */
import fs from 'fs';
import path from 'path';

const argv = process.argv.slice(2);
const getArg = (name, def) => {
  const idx = argv.indexOf(name);
  return idx >= 0 ? argv[idx + 1] : def;
};
const hasFlag = (name) => argv.includes(name);

const root = path.resolve(getArg('--root', '.'));
const strict = hasFlag('--strict');
const print = hasFlag('--print') || hasFlag('--print-files');
const includeExt = (getArg('--include-ext', 'js,ts,tsx,jsx,py,rb,go') || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const TEST_PATTERNS = [
  // JS/TS (Jest/Mocha)
  { ext: ['js', 'jsx', 'ts', 'tsx'], file: /(\.test\.|\.spec\.)/i, testLine: /(describe\(|it\(|test\()/ },
  // Python (pytest)
  { ext: ['py'], file: /(^(tests|test)[\/\\]|_test\.py$|^test_)/i, testLine: /^\s*def\s+test_/ },
  // Ruby (RSpec)
  { ext: ['rb'], file: /(^(spec)[\/\\]|_spec\.rb$)/i, testLine: /(describe\s+|it\s+["'])/ },
  // Go (gotest)
  { ext: ['go'], file: /_test\.go$/i, testLine: /^\s*func\s+Test[A-Za-z0-9_]+\s*\(/ },
];

const TOKEN_RE = /PRD-\d{4}-(?:FR|NFR)-\d+/;

function shouldCheckFile(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  if (!includeExt.includes(ext)) return false;
  const rel = path.relative(root, file);
  if (/node_modules|\.git|dist|build|coverage|\.venv|__pycache__/i.test(rel)) return false;
  return TEST_PATTERNS.some((p) => p.ext.includes(ext) && p.file.test(rel));
}

function findTestIndicator(content, ext) {
  const patt = TEST_PATTERNS.find((p) => p.ext.includes(ext));
  if (!patt) return false;
  return patt.testLine.test(content);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) return [dir];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (/node_modules|\.git|dist|build|coverage|\.venv|__pycache__/.test(e.name)) continue;
      out.push(...walk(p));
    } else if (e.isFile()) {
      out.push(p);
    }
  }
  return out;
}

function main() {
  const files = walk(root).filter(shouldCheckFile);
  const offenders = [];
  for (const f of files) {
    const ext = path.extname(f).slice(1).toLowerCase();
    const content = fs.readFileSync(f, 'utf8');
    if (!findTestIndicator(content, ext)) continue; // not a test file with recognizable tests
    if (!TOKEN_RE.test(content)) {
      offenders.push(f);
    }
  }
  if (offenders.length) {
    console.log('\n[check-prd-tokens] Tests missing PRD tokens:');
    offenders.forEach((f) => console.log(' -', path.relative(root, f)));
    console.log('\nHint: include PRD-scoped IDs like PRD-0007-FR-3 or PRD-0007-NFR-1 in test names/descriptions.');
    if (strict) process.exit(1);
  } else if (print) {
    console.log('[check-prd-tokens] All checked tests include PRD tokens.');
  }
}

main();

