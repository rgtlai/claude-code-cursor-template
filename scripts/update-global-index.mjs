#!/usr/bin/env node
/**
 * Update tasks/_index.md by aggregating per‑PRD Blocked/Prereqs tables
 * and computing a recommended topological execution order.
 *
 * Usage:
 *   node scripts/update-global-index.mjs [--tasks-dir tasks] [--index-file tasks/_index.md] [--dry-run]
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const hasFlag = (name) => args.includes(name);

const repoRoot = process.cwd();
const tasksDir = path.resolve(repoRoot, getArg('--tasks-dir', 'tasks'));
const indexFile = path.resolve(repoRoot, getArg('--index-file', path.join('tasks', '_index.md')));
const dryRun = hasFlag('--dry-run');

/** Simple logger */
const log = (...m) => console.log('[update-global-index]', ...m);

/** Read all task files except _index.md */
function listTaskFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('tasks-') && f.endsWith('.md'))
    .map((f) => path.join(dir, f));
}

/** Extract PRD ID from filename (tasks-0007-prd-*.md => PRD-0007) */
function prdIdFromFilename(file) {
  const m = path.basename(file).match(/tasks-(\d{4})-prd-/i);
  return m ? `PRD-${m[1]}` : 'PRD-UNKNOWN';
}

/** Parse Blocked/Prereqs table from a tasks file */
function parseBlockedTable(filePath, prdId) {
  const txt = fs.readFileSync(filePath, 'utf8');
  const lines = txt.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/Blocked\/Prereqs/i.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start < 0) return [];
  // Find first table header line starting with |
  let hdr = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('|')) {
      hdr = i;
      break;
    }
    if (/^\s*#/.test(lines[i])) break; // next section
  }
  if (hdr < 0) return [];
  const header = lines[hdr]
    .split('|')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const sep = hdr + 1;
  const rows = [];
  for (let i = sep + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cols = line.split('|').map((s) => s.trim());
    // map by header index; skip leading/trailing empties
    const cells = cols.filter((c, idx) => !(idx === 0 || idx === cols.length - 1));
    const get = (nameVariants) => {
      const idx = header.findIndex((h) => nameVariants.some((nv) => h.includes(nv)));
      return idx >= 0 && idx < cells.length ? cells[idx] : '';
    };
    const parentCell = get(['parent', 'parent task']);
    const parentMatch = parentCell.match(/^(\d+\.\d+)/);
    const parent = parentMatch ? parentMatch[1] : parentCell || '?';
    const blockedBy = get(['blocked']);
    const ready = (get(['ready']).toUpperCase().match(/Y/) ? 'Y' : 'N');
    const notes = get(['notes']);
    rows.push({
      taskFile: filePath.replace(/\\/g, '/'),
      parent,
      prdId,
      blockedBy,
      ready,
      notes,
    });
  }
  return rows;
}

/** Extract inter-task edges from a Blocked By string */
function parseEdges(blockedBy, nodesSet) {
  const edges = [];
  const re = /(tasks\/[A-Za-z0-9._\-\/]+\.md)\s+([0-9]+\.[0-9]+)/g;
  let m;
  while ((m = re.exec(blockedBy)) !== null) {
    const nodeId = `${m[1]}::${m[2]}`;
    if (nodesSet.has(nodeId)) edges.push(nodeId);
  }
  return edges;
}

/** Compute topological order from nodes and edges (best-effort) */
function topoOrder(nodes) {
  const ids = nodes.map((n) => `${n.taskFile}::${n.parent}`);
  const nodesSet = new Set(ids);
  const outgoing = new Map();
  const indeg = new Map();
  nodes.forEach((n) => {
    const id = `${n.taskFile}::${n.parent}`;
    const deps = parseEdges(n.blockedBy || '', nodesSet);
    outgoing.set(id, []);
    indeg.set(id, indeg.get(id) || 0);
    deps.forEach((dep) => {
      // edge dep -> id
      outgoing.set(dep, (outgoing.get(dep) || []).concat(id));
      indeg.set(id, (indeg.get(id) || 0) + 1);
      indeg.set(dep, indeg.get(dep) || 0);
    });
  });
  // Kahn's algorithm
  const q = ids.filter((id) => (indeg.get(id) || 0) === 0).sort();
  const order = [];
  const indegMut = new Map(indeg);
  while (q.length) {
    const id = q.shift();
    order.push(id);
    (outgoing.get(id) || []).forEach((v) => {
      indegMut.set(v, (indegMut.get(v) || 0) - 1);
      if ((indegMut.get(v) || 0) === 0) q.push(v);
    });
    q.sort();
  }
  // Append remaining (cycles/unresolved) deterministically
  ids.forEach((id) => {
    if (!order.includes(id)) order.push(id);
  });
  return order.map((id) => {
    const [taskFile, parent] = id.split('::');
    return nodes.find((n) => n.taskFile === taskFile && n.parent === parent);
  });
}

function renderGlobalTable(rows) {
  const header = '| Task File | Parent | PRD IDs | Blocked By (FRs/Tasks) | Ready? (Y/N) | Notes |\n|---|---|---|---|---|---|';
  const body = rows
    .map((r) => `| ${r.taskFile} | ${r.parent} | ${r.prdId} | ${r.blockedBy || '—'} | ${r.ready} | ${r.notes || ''} |`)
    .join('\n');
  return `${header}\n${body}`;
}

function renderTopoList(ordered) {
  return ordered
    .map(
      (r) => `- ${r.taskFile} ${r.parent} — Ready: ${r.ready} — Blocked By: ${r.blockedBy || '—'}`
    )
    .join('\n');
}

function updateIndexFile(indexPath, tableMd, topoMd) {
  const markers = {
    tableStart: '<!-- BEGIN AUTO-GENERATED: BLOCKED_TABLE -->',
    tableEnd: '<!-- END AUTO-GENERATED: BLOCKED_TABLE -->',
    topoStart: '<!-- BEGIN AUTO-GENERATED: TOPO_ORDER -->',
    topoEnd: '<!-- END AUTO-GENERATED: TOPO_ORDER -->',
  };
  let content = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  const ensureSection = (start, end, headerLine) => {
    if (!content.includes(start)) {
      content += `\n\n${headerLine}\n${start}\n${end}\n`;
    }
  };
  if (!content) {
    // seed with a minimal template
    content = `# Global Tasks Index\n\n## Blocked/Prereqs Table (Global)\n${markers.tableStart}\n${markers.tableEnd}\n\n## Topological Order (Recommended Execution)\n${markers.topoStart}\n${markers.topoEnd}\n`;
  } else {
    ensureSection(markers.tableStart, markers.tableEnd, '## Blocked/Prereqs Table (Global)');
    ensureSection(markers.topoStart, markers.topoEnd, '## Topological Order (Recommended Execution)');
  }
  const replaceBetween = (start, end, payload) => {
    const re = new RegExp(`${start}[\s\S]*?${end}`);
    return content.replace(re, `${start}\n${payload}\n${end}`);
  };
  content = replaceBetween(markers.tableStart, markers.tableEnd, tableMd);
  content = replaceBetween(markers.topoStart, markers.topoEnd, topoMd);
  if (dryRun) {
    log('Dry run. New content preview:\n');
    console.log(content);
  } else {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, content, 'utf8');
    log(`Updated ${indexPath}`);
  }
}

function main() {
  if (!fs.existsSync(tasksDir)) {
    log(`Tasks dir not found: ${tasksDir}`);
    process.exit(0);
  }
  const files = listTaskFiles(tasksDir);
  const rows = [];
  files.forEach((f) => {
    const prdId = prdIdFromFilename(f);
    const r = parseBlockedTable(f, prdId);
    rows.push(...r);
  });
  if (rows.length === 0) {
    log('No tasks found with Blocked/Prereqs tables. Writing empty sections.');
  }
  const ordered = topoOrder(rows);
  const tableMd = renderGlobalTable(rows);
  const topoMd = renderTopoList(ordered);
  updateIndexFile(indexFile, tableMd, topoMd);
}

main();

