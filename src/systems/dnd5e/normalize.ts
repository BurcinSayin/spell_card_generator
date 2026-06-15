import type { DndSchool, DndSpell } from './record';

const VALID_SCHOOLS = new Set<DndSchool>([
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
]);

// Shape of a raw row in public/data/dnd5e/spells.json (verbatim upstream keys).
export interface UpstreamRow {
  id?: string;
  Name?: string;
  Level?: string | number;
  School?: string;
  'Casting Time'?: string;
  Range?: string;
  Components?: string;
  Duration?: string;
  Ritual?: boolean;
  Concentration?: boolean;
  Classes?: string[];
  Description?: string;
  Material?: string;
  'Higher Levels'?: string;
  Source?: string;
  key?: string;
  [key: string]: unknown;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function optionalTrim(s: unknown): string | undefined {
  if (typeof s !== 'string') return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
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

function parseSchool(v: unknown): DndSchool {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return VALID_SCHOOLS.has(s as DndSchool) ? (s as DndSchool) : 'evocation';
}

// Upstream casting time is terse/jammed (e.g. "action", "1minute"). Make it readable.
function cleanCastingTime(v: unknown): string {
  const raw = typeof v === 'string' ? v.trim() : '';
  if (!raw) return '—';
  const key = raw.toLowerCase();
  if (key === 'action') return '1 Action';
  if (key === 'bonus' || key === 'bonus action') return 'Bonus Action';
  if (key === 'reaction') return 'Reaction';
  // Split a leading number from a jammed unit: "1minute" -> "1 minute".
  const m = raw.match(/^(\d+)\s*([a-zA-Z].*)$/);
  if (m) return `${m[1]} ${m[2]}`;
  return raw;
}

export function normalizeRow(row: UpstreamRow): DndSpell | null {
  const name = row.Name?.toString().trim();
  if (!name) return null;
  const id = row.id?.toString().trim() || slugify(name);

  const classes = Array.isArray(row.Classes)
    ? row.Classes.filter((c): c is string => typeof c === 'string')
    : [];

  const out: DndSpell = {
    id,
    name,
    level: parseLevel(row.Level),
    school: parseSchool(row.School),
    castingTime: cleanCastingTime(row['Casting Time']),
    range: optionalTrim(row.Range) ?? '—',
    components: optionalTrim(row.Components) ?? '—',
    duration: optionalTrim(row.Duration) ?? '—',
    ritual: Boolean(row.Ritual),
    concentration: Boolean(row.Concentration),
    classes,
    description: optionalTrim(row.Description) ?? '',
    source: optionalTrim(row.Source) ?? '',
  };

  const material = optionalTrim(row.Material);
  if (material) out.material = material;

  const higherLevels = optionalTrim(row['Higher Levels']);
  if (higherLevels) out.higherLevels = higherLevels;

  return out;
}

export function normalizeRows(rows: unknown): DndSpell[] {
  if (!Array.isArray(rows)) {
    throw new Error('D&D 5e spells data must be a JSON array of spell rows');
  }
  const out: DndSpell[] = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const norm = normalizeRow(row as UpstreamRow);
    if (norm) out.push(norm);
  }
  return out;
}
