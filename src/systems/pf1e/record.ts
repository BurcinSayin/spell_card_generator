export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'
  | 'universal'
  | 'varies';

export type CasterClass =
  | 'sorcerer'
  | 'wizard'
  | 'cleric'
  | 'druid'
  | 'paladin'
  | 'ranger'
  | 'bard'
  | 'inquisitor'
  | 'alchemist'
  | 'magus'
  | 'oracle'
  | 'summoner'
  | 'witch'
  | 'antipaladin'
  | 'adept'
  | 'bloodrager'
  | 'shaman'
  | 'psychic'
  | 'medium'
  | 'mesmerist'
  | 'occultist'
  | 'spiritualist'
  | 'skald'
  | 'investigator'
  | 'hunter'
  | 'summoner-unchained'
  | 'arcanist'
  | 'warpriest'
  | 'redmantisassassin';

export interface Spell {
  id: string;
  name: string;
  school: SpellSchool;
  subschool?: string;
  descriptors?: string[];
  levels: Partial<Record<CasterClass, number>>;
  castingTime: string;
  components: string[];
  range: string;
  targetOrAreaOrEffect?: string;
  duration: string;
  savingThrow: string;
  spellResistance: string;
  materials?: string;
  summary?: string;
  description: string;
  source: string;
}

export const SCHOOL_NAMES: Record<SpellSchool, string> = {
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
  universal: 'Universal',
  varies: 'Varies',
};

export const ALL_CLASSES: CasterClass[] = [
  'sorcerer','wizard','cleric','druid','paladin','ranger','bard',
  'inquisitor','alchemist','magus','oracle','summoner','witch','antipaladin','adept',
  'bloodrager','shaman','psychic','medium','mesmerist','occultist','spiritualist',
  'skald','investigator','hunter','summoner-unchained',
  'arcanist','warpriest','redmantisassassin',
];

export const ALL_SCHOOLS: SpellSchool[] = [
  'abjuration','conjuration','divination','enchantment','evocation',
  'illusion','necromancy','transmutation','universal','varies',
];

export const SCHOOL_COLORS: Record<SpellSchool, string> = {
  abjuration: '#3B82F6',
  conjuration: '#10B981',
  divination: '#A78BFA',
  enchantment: '#EC4899',
  evocation: '#EF4444',
  illusion: '#8B5CF6',
  necromancy: '#374151',
  transmutation: '#F59E0B',
  universal: '#6B7280',
  varies: '#94A3B8',
};
