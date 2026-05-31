/**
 * Build script: PF2e upstream JSON → public/data/pf2e/spells.json
 *
 * Env vars:
 *   SPELLS_PF2E_PATH  (required) absolute path to the upstream PF2e JSON
 *
 * Run: npm run build:data:pf2e
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// Types duplicated from ./record.ts because composite TS projects don't share
// files across boundaries. If ./record.ts changes, mirror here.
type Tradition = 'arcane' | 'divine' | 'occult' | 'primal';

const VALID_TRADITIONS = new Set<string>([
  'arcane',
  'divine',
  'occult',
  'primal',
]);

interface HeightenedEntry {
  label: string;
  text: string;
}

interface Pf2eSpell {
  id: string;
  name: string;
  level: number;
  traits: string[];
  traditions: Tradition[];
  source: string;
  actions?: string;
  cast?: string;
  range?: string;
  targets?: string;
  area?: string;
  duration?: string;
  deities?: string[];
  bloodline?: string;
  description: string;
  heightened?: HeightenedEntry[];
}

interface UpstreamRow {
  id?: string;
  Name?: string;
  Actions?: string;
  Level?: string | number;
  Traits?: string[];
  Source?: string;
  Traditions?: string;
  Deities?: string;
  Cast?: string;
  Range?: string;
  Targets?: string;
  Area?: string;
  Duration?: string;
  Bloodline?: string;
  Description?: string;
  [k: string]: unknown;
}

const OUTPUT = 'public/data/pf2e/spells.json';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function optionalTrim(s: unknown): string | undefined {
  if (typeof s !== 'string') return undefined;
  const t = s.trim().replace(/[;\s]+$/, '').trim();
  return t.length ? t : undefined;
}

function splitList(s: unknown): string[] {
  if (typeof s !== 'string') return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/�\?"/g, '—'],
  [/�\?T/g, '’'],
  [/�\?s/g, '’s'],
  [/�\?/g, ''],
  [/�/g, ''],
];

function cleanText(s: string): string {
  let out = s;
  for (const [re, rep] of MOJIBAKE_REPLACEMENTS) out = out.replace(re, rep);
  return out;
}

const HEIGHTENED_RE = /^Heightened\s*\((.+)\)\s*$/;

function extractHeightened(row: UpstreamRow): HeightenedEntry[] {
  const out: HeightenedEntry[] = [];
  for (const key of Object.keys(row)) {
    const m = key.match(HEIGHTENED_RE);
    if (!m) continue;
    const v = row[key];
    if (typeof v !== 'string') continue;
    const text = cleanText(v).trim();
    if (!text) continue;
    out.push({ label: m[1].trim(), text });
  }
  return out;
}

function parseLevel(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const m = v.match(/-?\d+/);
    if (m) {
      const n = Number(m[0]);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function normalizeRow(row: UpstreamRow): Pf2eSpell | null {
  const name = row.Name?.trim();
  if (!name) return null;
  const id = row.id?.trim() || slugify(name);

  const traditions = splitList(row.Traditions)
    .map((t) => t.toLowerCase())
    .filter((t): t is Tradition => {
      if (!VALID_TRADITIONS.has(t)) {
        console.warn(`unknown tradition "${t}" on "${name}" — dropped`);
        return false;
      }
      return true;
    });

  const deities = row.Deities ? splitList(row.Deities) : undefined;

  const out: Pf2eSpell = {
    id,
    name,
    level: parseLevel(row.Level),
    traits: Array.isArray(row.Traits) ? row.Traits.slice() : [],
    traditions,
    source: row.Source?.trim() ?? '',
    description: cleanText(row.Description?.trim() ?? ''),
  };

  const actions = optionalTrim(row.Actions);
  if (actions) out.actions = actions;

  const cast = optionalTrim(row.Cast);
  if (cast) out.cast = cleanText(cast);

  const range = optionalTrim(row.Range);
  if (range) out.range = range;

  const targets = optionalTrim(row.Targets);
  if (targets) out.targets = targets;

  const area = optionalTrim(row.Area);
  if (area) out.area = area;

  const duration = optionalTrim(row.Duration);
  if (duration) out.duration = duration;

  if (deities && deities.length) out.deities = deities;

  const bloodline = optionalTrim(row.Bloodline);
  if (bloodline) out.bloodline = bloodline;

  const heightened = extractHeightened(row);
  if (heightened.length) out.heightened = heightened;

  return out;
}

async function main(): Promise<void> {
  const srcPath = process.env.SPELLS_PF2E_PATH;
  if (!srcPath) {
    console.error('error: SPELLS_PF2E_PATH env var is not set.');
    console.error('  Set it to the absolute path of the upstream PF2e JSON, e.g.');
    console.error('    $env:SPELLS_PF2E_PATH = "D:\\path\\to\\spells.json"  # PowerShell');
    console.error('    export SPELLS_PF2E_PATH=/path/to/spells.json        # bash');
    process.exit(1);
  }

  const resolved = resolve(srcPath);
  console.log(`reading ${resolved}`);

  const raw = await readFile(resolved, 'utf8');
  const rows = JSON.parse(raw) as UpstreamRow[];
  if (!Array.isArray(rows)) {
    throw new Error('upstream JSON must be an array of spell rows');
  }
  console.log(`loaded ${rows.length} rows`);

  const spells: Pf2eSpell[] = [];
  for (const row of rows) {
    const s = normalizeRow(row);
    if (s) spells.push(s);
  }
  spells.sort((a, b) => a.name.localeCompare(b.name));

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(spells, null, 2) + '\n', 'utf8');

  const traitSet = new Set<string>();
  for (const s of spells) for (const t of s.traits) traitSet.add(t);
  const traditionSet = new Set<string>();
  for (const s of spells) for (const t of s.traditions) traditionSet.add(t);

  console.log(
    `wrote ${OUTPUT} — ${spells.length} spells (${traditionSet.size} traditions, ${traitSet.size} traits)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
