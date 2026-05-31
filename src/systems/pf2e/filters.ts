import type { FilterControl } from '../types';
import {
  COMMON_TRAITS,
  TRADITIONS,
  TRADITION_COLORS,
  TRADITION_NAMES,
} from './record';

export const FILTER_CONTROLS: FilterControl[] = [
  {
    kind: 'search',
    id: 'query',
    label: '',
    placeholder: "Search names · 'Include text' for descriptions",
  },
  {
    kind: 'enum-grid',
    id: 'traditions',
    label: 'Tradition',
    columns: 4,
    showColors: true,
    field: 'traditions',
    options: TRADITIONS.map((t) => ({
      value: t,
      label: TRADITION_NAMES[t],
      short: TRADITION_NAMES[t].slice(0, 4),
      color: TRADITION_COLORS[t],
    })),
  },
  {
    kind: 'int-dots',
    id: 'levels',
    label: 'Level',
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    kind: 'enum-pills',
    id: 'traits',
    label: 'Traits',
    options: COMMON_TRAITS.map((t) => ({ value: t, label: t })),
  },
];
