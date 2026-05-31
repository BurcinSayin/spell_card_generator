import type { Spell } from './record';
import { SCHOOL_COLORS } from './record';
import { loadPf1eSpells } from './data';
import { filterPf1e } from './filter';
import {
  renderCardPf1e,
  renderRowPf1e,
  renderTrayItemPf1e,
} from './render';
import { FILTER_CONTROLS } from './filters';
import type {
  Record_,
  SplitCaps,
  SystemConfig,
} from '../types';

const CAPS: Record<'portrait-4' | 'landscape-6', SplitCaps> = {
  'portrait-4': {
    defaultFontSize: 6.5,
    floorFontSize: 5,
    step: 0.5,
    frontCap: 800,
    backCap: 1400,
  },
  'landscape-6': {
    defaultFontSize: 6,
    floorFontSize: 5,
    step: 0.5,
    frontCap: 420,
    backCap: 800,
  },
};

const pf1e: SystemConfig = {
  id: 'pf1e',
  label: 'Pathfinder 1e',
  shortLabel: 'pathfinder 1e · v0.1',
  loadRecords: () =>
    loadPf1eSpells() as unknown as Promise<Record_[]>,
  filter: filterPf1e as unknown as SystemConfig['filter'],
  emptyFilterState: {
    query: '',
    queryIncludeText: false,
    schools: [],
    classes: [],
    levels: [],
  },
  filterControls: FILTER_CONTROLS,
  renderCard: renderCardPf1e as unknown as SystemConfig['renderCard'],
  renderRow: renderRowPf1e as unknown as SystemConfig['renderRow'],
  renderTrayItem:
    renderTrayItemPf1e as unknown as SystemConfig['renderTrayItem'],
  themeColor: ((r: Record_) =>
    SCHOOL_COLORS[(r as unknown as Spell).school]) as SystemConfig['themeColor'],
  detail: {
    extract: ((r: Record_) =>
      (r as unknown as Spell).description) as SystemConfig['detail']['extract'],
    caps: CAPS,
  },
};

export default pf1e;
