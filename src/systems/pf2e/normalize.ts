import type { HeightenedEntry, Pf2eSpell, Tradition } from './record';

const VALID_TRADITIONS = new Set<Tradition>([
  'arcane',
  'divine',
  'occult',
  'primal',
]);

export interface UpstreamRow {
  id?: string;
  name?: string;
  Name?: string;
  level?: string | number;
  Level?: string | number;
  actions?: string;
  Actions?: string;
  cast?: string;
  Cast?: string;
  traits?: string[];
  Traits?: string[];
  source?: string;
  Source?: string;
  traditions?: string | string[];
  Traditions?: string | string[];
  deities?: string | string[];
  Deities?: string | string[];
  range?: string;
  Range?: string;
  targets?: string;
  Targets?: string;
  area?: string;
  Area?: string;
  duration?: string;
  Duration?: string;
  bloodline?: string;
  Bloodline?: string;
  description?: string;
  Description?: string;
  heightened?: HeightenedEntry[];
  [key: string]: unknown;
}

const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/�\?"/g, '—'],
  [/�\?T/g, '’'],
  [/�\?s/g, '’s'],
  [/�\?/g, ''],
  [/�/g, ''],
];

export function cleanText(s: string): string {
  let out = s;
  for (const [re, rep] of MOJIBAKE_REPLACEMENTS) out = out.replace(re, rep);
  return out;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function optionalTrim(s: unknown): string | undefined {
  if (typeof s !== 'string') return undefined;
  const t = s.trim().replace(/[;\s]+$/, '').trim();
  return t.length ? t : undefined;
}

export function splitList(s: unknown): string[] {
  if (Array.isArray(s)) {
    return s
      .map((x) => (typeof x === 'string' ? x.trim() : ''))
      .filter((x): x is string => Boolean(x));
  }
  if (typeof s !== 'string') return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export function parseLevel(v: unknown): number {
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

const HEIGHTENED_RE = /^Heightened\s*\((.+)\)\s*$/;

export function extractHeightenedFromKeys(row: UpstreamRow): HeightenedEntry[] {
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

function pickHeightened(row: UpstreamRow): HeightenedEntry[] {
  if (Array.isArray(row.heightened)) {
    const out: HeightenedEntry[] = [];
    for (const h of row.heightened) {
      if (!h || typeof h !== 'object') continue;
      const label = typeof h.label === 'string' ? h.label.trim() : '';
      const text = typeof h.text === 'string' ? cleanText(h.text).trim() : '';
      if (label && text) out.push({ label, text });
    }
    if (out.length) return out;
  }
  return extractHeightenedFromKeys(row);
}

export function normalizeRow(row: UpstreamRow): Pf2eSpell | null {
  const name = (row.name ?? row.Name)?.toString().trim();
  if (!name) return null;
  const id = row.id?.toString().trim() || slugify(name);

  const traditions = splitList(row.traditions ?? row.Traditions)
    .map((t) => t.toLowerCase())
    .filter((t): t is Tradition =>
      VALID_TRADITIONS.has(t as Tradition),
    );

  const rawTraits = row.traits ?? row.Traits;
  const traits = Array.isArray(rawTraits)
    ? rawTraits.filter((t): t is string => typeof t === 'string')
    : [];

  const out: Pf2eSpell = {
    id,
    name,
    level: parseLevel(row.level ?? row.Level),
    traits,
    traditions,
    source: ((row.source ?? row.Source) as string | undefined)?.trim() ?? '',
    description: cleanText(
      ((row.description ?? row.Description) as string | undefined)?.trim() ?? '',
    ),
  };

  const actions = optionalTrim(row.actions ?? row.Actions);
  if (actions) out.actions = actions;

  const cast = optionalTrim(row.cast ?? row.Cast);
  if (cast) out.cast = cleanText(cast);

  const range = optionalTrim(row.range ?? row.Range);
  if (range) out.range = range;

  const targets = optionalTrim(row.targets ?? row.Targets);
  if (targets) out.targets = targets;

  const area = optionalTrim(row.area ?? row.Area);
  if (area) out.area = area;

  const duration = optionalTrim(row.duration ?? row.Duration);
  if (duration) out.duration = duration;

  const deities = splitList(row.deities ?? row.Deities);
  if (deities.length) out.deities = deities;

  const bloodline = optionalTrim(row.bloodline ?? row.Bloodline);
  if (bloodline) out.bloodline = bloodline;

  const heightened = pickHeightened(row);
  if (heightened.length) out.heightened = heightened;

  return out;
}

export function normalizeRows(rows: unknown): Pf2eSpell[] {
  if (!Array.isArray(rows)) {
    throw new Error('PF2e spells data must be a JSON array of spell rows');
  }
  const out: Pf2eSpell[] = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const norm = normalizeRow(row as UpstreamRow);
    if (norm) out.push(norm);
  }
  return out;
}
