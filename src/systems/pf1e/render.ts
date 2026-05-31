import type { Spell } from './record';
import { SCHOOL_COLORS, SCHOOL_NAMES } from './record';
import type { RenderedCard, RowData, TrayItemData } from '../types';

export function renderCardPf1e(spell: Spell): RenderedCard {
  const firstLvl = Object.values(spell.levels)[0];
  const subLabel = spell.subschool ? ` · ${spell.subschool.split(',')[0]}` : '';
  return {
    themeColor: SCHOOL_COLORS[spell.school],
    title: {
      name: spell.name,
      badge: firstLvl ?? '–',
      badgeCaption: 'level',
      subtitle: `${SCHOOL_NAMES[spell.school]}${subLabel}`,
      metaLine: Object.entries(spell.levels)
        .map(([c, l]) => `${c.slice(0, 3)} ${l}`)
        .join(', '),
    },
    shortInfo: [
      { label: 'CAST', value: spell.castingTime },
      { label: 'RANGE', value: spell.range },
      { label: 'COMP', value: spell.components.join(', ') },
      { label: 'DURATION', value: spell.duration },
      { label: 'SAVE', value: spell.savingThrow },
      { label: 'SR', value: spell.spellResistance },
    ],
    detail: spell.description,
  };
}

export function renderRowPf1e(spell: Spell): RowData {
  const subLabel = spell.subschool ? ` · ${spell.subschool.split(',')[0]}` : '';
  return {
    name: spell.name,
    themeColor: SCHOOL_COLORS[spell.school],
    subtitle: `${SCHOOL_NAMES[spell.school]}${subLabel}`,
    summary: spell.summary ?? spell.description,
    badges: [
      Object.entries(spell.levels)
        .map(([c, l]) => `${c.slice(0, 3)} ${l}`)
        .slice(0, 4)
        .join(', '),
      'core',
    ],
  };
}

export function renderTrayItemPf1e(spell: Spell): TrayItemData {
  return {
    name: spell.name,
    themeColor: SCHOOL_COLORS[spell.school],
    caption: Object.entries(spell.levels)
      .slice(0, 2)
      .map(([c, l]) => `${c.slice(0, 3)} ${l}`)
      .join(', '),
  };
}
