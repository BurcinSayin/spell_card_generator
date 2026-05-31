import type { FilterControl } from '../types';
import {
  ALL_CLASSES,
  ALL_SCHOOLS,
  SCHOOL_COLORS,
  SCHOOL_NAMES,
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
    id: 'schools',
    label: 'School',
    columns: 3,
    showColors: true,
    field: 'school',
    options: ALL_SCHOOLS.map((s) => ({
      value: s,
      label: SCHOOL_NAMES[s],
      short: SCHOOL_NAMES[s].slice(0, 4),
      color: SCHOOL_COLORS[s],
    })),
  },
  {
    kind: 'class-level',
    id: 'class-level',
    label: '',
    levels: {
      id: 'levels',
      label: 'Level',
      values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    classes: {
      id: 'classes',
      label: 'Class',
      options: ALL_CLASSES.map((c) => ({ value: c, label: c })),
    },
  },
];
