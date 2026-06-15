import type { DndSpell } from './record';
import { NEUTRAL_COLOR, SCHOOL_COLORS, SCHOOL_NAMES } from './record';
import type { RenderedCard, RowData, TrayItemData } from '../types';

const BOLD_TERMS = ['Higher Levels'];

export function dnd5eThemeColor(s: DndSpell): string {
  return SCHOOL_COLORS[s.school] ?? NEUTRAL_COLOR;
}

// Card body: description plus an appended "Higher Levels" block when present.
// Shared with detail.extract so the print front/back split sees identical text.
export function dnd5eDetail(s: DndSpell): string {
  const description = s.description ?? '';
  const higher = s.higherLevels ? `Higher Levels: ${s.higherLevels}` : '';
  if (!higher) return description;
  return description ? `${description}\n\n${higher}` : higher;
}

function levelBadge(level: number): { badge: string | number; caption: string } {
  return level === 0
    ? { badge: 'C', caption: 'cantrip' }
    : { badge: level, caption: 'level' };
}

export function renderCardDnd5e(s: DndSpell): RenderedCard {
  const classes = s.classes ?? [];
  const { badge, caption } = levelBadge(s.level);
  const duration =
    s.concentration && s.duration && s.duration !== '—'
      ? `Conc. ${s.duration}`
      : s.duration;
  return {
    themeColor: dnd5eThemeColor(s),
    title: {
      name: s.name,
      badge,
      badgeCaption: caption,
      subtitle: SCHOOL_NAMES[s.school],
      metaLine: classes.join(' · '),
    },
    shortInfo: [
      { label: 'CAST', value: s.castingTime },
      { label: 'RANGE', value: s.range },
      { label: 'COMP', value: s.components },
      { label: 'DURATION', value: duration },
      { label: 'RITUAL', value: s.ritual ? 'Yes' : '—' },
      { label: 'CLASSES', value: classes.join(', ') || '—' },
    ],
    detail: dnd5eDetail(s),
    detailBoldTerms: BOLD_TERMS,
  };
}

export function renderRowDnd5e(s: DndSpell): RowData {
  return {
    name: s.name,
    themeColor: dnd5eThemeColor(s),
    subtitle: SCHOOL_NAMES[s.school],
    summary: s.description ?? '',
    badges: [
      s.level === 0 ? 'cantrip' : `lvl ${s.level}`,
      (s.classes ?? [])[0] ?? SCHOOL_NAMES[s.school],
    ],
  };
}

export function renderTrayItemDnd5e(s: DndSpell): TrayItemData {
  const lvl = s.level === 0 ? 'cantrip' : `lvl ${s.level}`;
  return {
    name: s.name,
    themeColor: dnd5eThemeColor(s),
    caption: `${lvl} · ${SCHOOL_NAMES[s.school]}`,
  };
}
