import type { Pf2eSpell } from './record';
import { NEUTRAL_COLOR, TRADITION_COLORS, TRADITION_NAMES } from './record';
import type { RenderedCard, RowData, TrayItemData } from '../types';

const OUTCOME_TERMS = ['Critical Success', 'Success', 'Failure', 'Critical Failure'];

export function pf2eThemeColor(s: Pf2eSpell): string {
  const first = s.traditions?.[0];
  return first && TRADITION_COLORS[first] ? TRADITION_COLORS[first] : NEUTRAL_COLOR;
}

function shortSource(src: string): string {
  const i = src.indexOf(' pg');
  return i >= 0 ? src.slice(0, i) : src;
}

export function renderCardPf2e(s: Pf2eSpell): RenderedCard {
  const traditions = s.traditions ?? [];
  const traits = s.traits ?? [];
  const traditionsLabel = traditions.map((t) => TRADITION_NAMES[t]).join(' · ');
  const heightenedBlock = (s.heightened ?? [])
    .map((h) => `Heightened (${h.label}): ${h.text}`)
    .join('\n\n');
  const description = s.description ?? '';
  const detail = heightenedBlock
    ? description
      ? `${description}\n\n${heightenedBlock}`
      : heightenedBlock
    : description;
  return {
    themeColor: pf2eThemeColor(s),
    title: {
      name: s.name,
      badge: s.level,
      badgeCaption: 'level',
      subtitle: traditionsLabel,
      metaLine: traits.join(' · '),
    },
    shortInfo: [
      { label: 'ACTIONS', value: s.actions ?? '—' },
      { label: 'RANGE', value: s.range ?? '—' },
      { label: 'TARGETS', value: s.targets ?? s.area ?? '—' },
      { label: 'DURATION', value: s.duration ?? '—' },
      { label: 'TRADITIONS', value: traditionsLabel || '—' },
      { label: 'SOURCE', value: shortSource(s.source ?? '') },
    ],
    detail,
    detailBoldTerms: OUTCOME_TERMS,
  };
}

export function renderRowPf2e(s: Pf2eSpell): RowData {
  const traditions = s.traditions ?? [];
  return {
    name: s.name,
    themeColor: pf2eThemeColor(s),
    subtitle: traditions.map((t) => TRADITION_NAMES[t]).join(' · '),
    summary: s.description ?? '',
    badges: [`lvl ${s.level}`, shortSource(s.source ?? '')],
  };
}

export function renderTrayItemPf2e(s: Pf2eSpell): TrayItemData {
  const first = s.traditions?.[0];
  return {
    name: s.name,
    themeColor: pf2eThemeColor(s),
    caption: `lvl ${s.level}${first ? ' · ' + first : ''}`,
  };
}
