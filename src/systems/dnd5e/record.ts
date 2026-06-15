export type DndSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

// SRD 5.2 spellcasting classes. Stored as canonical display strings (matching the
// upstream `Classes` array), so render and filter can use them verbatim.
export type DndClass =
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Paladin'
  | 'Ranger'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';

export interface DndSpell {
  id: string;
  name: string;
  level: number;
  school: DndSchool;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  ritual: boolean;
  concentration: boolean;
  classes: string[];
  description: string;
  material?: string;
  higherLevels?: string;
  source: string;
}

export const ALL_SCHOOLS: DndSchool[] = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
];

export const SCHOOL_NAMES: Record<DndSchool, string> = {
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
};

// Palette mirrors the shared school colours used by PF1e (src/systems/pf1e/record.ts).
export const SCHOOL_COLORS: Record<DndSchool, string> = {
  abjuration: '#3B82F6',
  conjuration: '#10B981',
  divination: '#A78BFA',
  enchantment: '#EC4899',
  evocation: '#EF4444',
  illusion: '#8B5CF6',
  necromancy: '#374151',
  transmutation: '#F59E0B',
};

export const NEUTRAL_COLOR = '#94A3B8';

export const ALL_CLASSES: DndClass[] = [
  'Bard',
  'Cleric',
  'Druid',
  'Paladin',
  'Ranger',
  'Sorcerer',
  'Warlock',
  'Wizard',
];
