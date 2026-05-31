export type Tradition = 'arcane' | 'divine' | 'occult' | 'primal';

export const TRADITIONS: Tradition[] = ['arcane', 'divine', 'occult', 'primal'];

export const TRADITION_NAMES: Record<Tradition, string> = {
  arcane: 'Arcane',
  divine: 'Divine',
  occult: 'Occult',
  primal: 'Primal',
};

export const TRADITION_COLORS: Record<Tradition, string> = {
  arcane: '#3B82F6',
  divine: '#F59E0B',
  occult: '#A855F7',
  primal: '#10B981',
};

export const NEUTRAL_COLOR = '#94A3B8';

export const COMMON_TRAITS = [
  'Cantrip',
  'Focus',
  'Concentrate',
  'Manipulate',
  'Attack',
  'Acid',
  'Air',
  'Cold',
  'Electricity',
  'Fire',
  'Force',
  'Mental',
  'Healing',
  'Polymorph',
  'Light',
  'Sonic',
  'Death',
  'Curse',
  'Disease',
  'Incapacitation',
  'Rare',
  'Abjuration',
  'Divination',
  'Enchantment',
  'Evocation',
  'Illusion',
  'Necromancy',
  'Transmutation',
];

export interface HeightenedEntry {
  label: string;
  text: string;
}

export interface Pf2eSpell {
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
