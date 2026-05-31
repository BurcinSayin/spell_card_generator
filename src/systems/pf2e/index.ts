import type { Layout } from '../../store/selectionStore';
import type { Pf2eSpell } from './record';
import { loadPf2eSpells } from './data';
import { filterPf2e } from './filter';
import {
  pf2eThemeColor,
  renderCardPf2e,
  renderRowPf2e,
  renderTrayItemPf2e,
} from './render';
import { FILTER_CONTROLS } from './filters';
import type { Record_, SplitCaps, SystemConfig } from '../types';

const CAPS: Record<Layout, SplitCaps> = {
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

const pf2e: SystemConfig = {
  id: 'pf2e',
  label: 'Pathfinder 2e',
  shortLabel: 'pathfinder 2e · v0.1',
  loadRecords: () => loadPf2eSpells() as unknown as Promise<Record_[]>,
  filter: filterPf2e as unknown as SystemConfig['filter'],
  emptyFilterState: {
    query: '',
    queryIncludeText: false,
    traditions: [],
    levels: [],
    traits: [],
  },
  filterControls: FILTER_CONTROLS,
  renderCard: renderCardPf2e as unknown as SystemConfig['renderCard'],
  renderRow: renderRowPf2e as unknown as SystemConfig['renderRow'],
  renderTrayItem:
    renderTrayItemPf2e as unknown as SystemConfig['renderTrayItem'],
  themeColor: ((r: Record_) =>
    pf2eThemeColor(r as unknown as Pf2eSpell)) as SystemConfig['themeColor'],
  detail: {
    extract: ((r: Record_) =>
      (r as unknown as Pf2eSpell)
        .description) as SystemConfig['detail']['extract'],
    caps: CAPS,
  },
};

export default pf2e;
