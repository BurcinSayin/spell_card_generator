import type { CasterClass, Spell, SpellSchool } from './record';
import { ALL_CLASSES, ALL_SCHOOLS } from './record';

const SCHOOL_SET = new Set<string>(ALL_SCHOOLS);
const CLASS_SET = new Set<string>(ALL_CLASSES);
const KNOWN_COMPONENTS = new Set(['V', 'S', 'M', 'F', 'DF', 'M/DF', 'F/DF']);

export interface UpstreamPf1eRow {
  id?: string;
  Name?: string;
  name?: string;
  Source?: string;
  source?: string;
  School?: string;
  school?: string;
  subschool?: string;
  descriptors?: string[];
  Level?: string;
  levels?: Partial<Record<string, number>>;
  'Casting Time'?: string;
  castingTime?: string;
  Components?: string;
  components?: string[];
  Range?: string;
  range?: string;
  Target?: string;
  Area?: string;
  Effect?: string;
  targetOrAreaOrEffect?: string;
  Duration?: string;
  duration?: string;
  'Saving Throw'?: string;
  savingThrow?: string;
  'Spell Resistance'?: string;
  spellResistance?: string;
  materials?: string;
  summary?: string;
  Description?: string;
  description?: string;
  [key: string]: unknown;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function trimSemi(s: string): string {
  return s.replace(/\s*;\s*$/, '').trim();
}

function collapseWs(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

const SCHOOL_RE =
  /^([A-Za-z]+)\s*(?:\(\s*([^)]+?)\s*\))?\s*(?:\[\s*([^\]]+?)\s*\])?\s*$/;

interface ParsedSchool {
  school: SpellSchool;
  subschool?: string;
  descriptors?: string[];
}

function parseSchool(raw: string, name: string): ParsedSchool | null {
  const cleaned = trimSemi(raw);
  if (!cleaned) return null;
  const m = cleaned.match(SCHOOL_RE);
  if (!m) {
    console.warn(`unparseable school "${raw}" (name="${name}")`);
    return { school: 'varies' };
  }
  const rawSchool = m[1].toLowerCase();
  let school: SpellSchool;
  if (SCHOOL_SET.has(rawSchool)) {
    school = rawSchool as SpellSchool;
  } else {
    console.warn(`non-canonical school "${rawSchool}" → "varies" (name="${name}")`);
    school = 'varies';
  }
  const out: ParsedSchool = { school };
  if (m[2]) {
    const sub = collapseWs(m[2]);
    if (sub) out.subschool = sub;
  }
  if (m[3]) {
    const descriptors = m[3]
      .split(',')
      .map((d) => collapseWs(d))
      .filter(Boolean);
    if (descriptors.length) out.descriptors = descriptors;
  }
  return out;
}

const LEVEL_TOKEN_RE = /^(.+?)\s+(-?\d+)(?:\s*\([^)]*\))?\s*$/;

function parseLevels(
  raw: string,
  name: string,
): Partial<Record<CasterClass, number>> {
  const out: Partial<Record<CasterClass, number>> = {};
  const tokens = raw.split(',').map((t) => t.trim()).filter(Boolean);
  for (const token of tokens) {
    const m = token.match(LEVEL_TOKEN_RE);
    if (!m) {
      console.warn(`unparseable level token "${token}" (name="${name}")`);
      continue;
    }
    const cls = slugify(m[1]);
    const lvl = Number(m[2]);
    if (!Number.isFinite(lvl)) continue;
    if (!CLASS_SET.has(cls)) {
      console.warn(
        `unknown class "${cls}" (raw="${m[1].trim()}") on "${name}" — dropped`,
      );
      continue;
    }
    if (out[cls as CasterClass] === undefined) {
      out[cls as CasterClass] = lvl;
    }
  }
  return out;
}

function parseComponentsList(raw: string): string[] {
  const withoutParens = raw.replace(/\([^)]*\)/g, '');
  const tokens = withoutParens
    .split(',')
    .map((t) => t.trim().replace(/\s+/g, ''))
    .filter(Boolean);
  const out: string[] = [];
  for (const t of tokens) {
    const norm = t.toUpperCase();
    if (KNOWN_COMPONENTS.has(norm) && !out.includes(norm)) out.push(norm);
  }
  return out;
}

function pickTargetAreaEffect(row: UpstreamPf1eRow): string | undefined {
  const canonical = row.targetOrAreaOrEffect?.trim();
  if (canonical) return canonical;
  const t = row.Target?.trim();
  if (t) return t;
  const a = row.Area?.trim();
  if (a) return a;
  const e = row.Effect?.trim();
  if (e) return e;
  return undefined;
}

function optionalTrim(s: unknown): string | undefined {
  if (typeof s !== 'string') return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
}

function canonicalLevels(
  raw: Partial<Record<string, number>>,
): Partial<Record<CasterClass, number>> {
  const out: Partial<Record<CasterClass, number>> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    if (CLASS_SET.has(k)) out[k as CasterClass] = v;
  }
  return out;
}

export function normalizeRow(row: UpstreamPf1eRow): Spell | null {
  const name = (row.name ?? row.Name)?.toString().trim();
  if (!name) return null;
  const id = row.id?.trim() || slugify(name);

  let school: SpellSchool;
  let subschool: string | undefined;
  let descriptors: string[] | undefined;

  if (typeof row.school === 'string' && SCHOOL_SET.has(row.school)) {
    school = row.school as SpellSchool;
    subschool = optionalTrim(row.subschool);
    if (Array.isArray(row.descriptors)) {
      const ds = row.descriptors.filter(
        (d): d is string => typeof d === 'string' && d.length > 0,
      );
      if (ds.length) descriptors = ds;
    }
  } else {
    const schoolRaw = (row.School ?? row.school)?.toString().trim();
    const parsed = schoolRaw ? parseSchool(schoolRaw, name) : null;
    if (!parsed) {
      console.warn(`spell "${name}" has no school — dropped`);
      return null;
    }
    school = parsed.school;
    subschool = parsed.subschool;
    descriptors = parsed.descriptors;
  }

  let levels: Partial<Record<CasterClass, number>>;
  if (row.levels && typeof row.levels === 'object') {
    levels = canonicalLevels(row.levels);
  } else if (typeof row.Level === 'string') {
    levels = parseLevels(row.Level, name);
  } else {
    levels = {};
  }

  let components: string[];
  const componentsRaw = row.Components?.trim();
  if (Array.isArray(row.components)) {
    components = row.components.filter(
      (c): c is string => typeof c === 'string',
    );
  } else if (componentsRaw) {
    components = parseComponentsList(componentsRaw);
  } else {
    components = [];
  }

  const out: Spell = {
    id,
    name,
    school,
    levels,
    castingTime: (row.castingTime ?? row['Casting Time'])?.toString().trim() ?? '',
    components,
    range: (row.range ?? row.Range)?.toString().trim() ?? '',
    duration: (row.duration ?? row.Duration)?.toString().trim() ?? '',
    savingThrow: trimSemi(
      (row.savingThrow ?? row['Saving Throw'])?.toString() ?? '',
    ),
    spellResistance: trimSemi(
      (row.spellResistance ?? row['Spell Resistance'])?.toString() ?? '',
    ),
    description: (row.description ?? row.Description)?.toString().trim() ?? '',
    source: (row.source ?? row.Source)?.toString().trim() ?? '',
  };

  if (subschool) out.subschool = subschool;
  if (descriptors) out.descriptors = descriptors;

  const tae = pickTargetAreaEffect(row);
  if (tae) out.targetOrAreaOrEffect = tae;

  const materials = optionalTrim(row.materials) ?? optionalTrim(componentsRaw);
  if (materials) out.materials = materials;

  const summary = optionalTrim(row.summary);
  if (summary) out.summary = summary;

  return out;
}

export function normalizeRows(raw: unknown): Spell[] {
  if (!Array.isArray(raw)) {
    throw new Error('PF1e spells data must be a JSON array of spell rows');
  }
  const seen = new Set<string>();
  const out: Spell[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const norm = normalizeRow(row as UpstreamPf1eRow);
    if (!norm) continue;
    if (seen.has(norm.id)) {
      console.warn(`duplicate id "${norm.id}" (name="${norm.name}") — dropped`);
      continue;
    }
    seen.add(norm.id);
    out.push(norm);
  }
  return out;
}
