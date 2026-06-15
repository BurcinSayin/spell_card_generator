import type { Layout } from '../../store/selectionStore';
import type { DndSpell } from './record';
import { loadDnd5eSpells } from './data';
import { filterDnd5e } from './filter';
import {
  dnd5eDetail,
  dnd5eThemeColor,
  renderCardDnd5e,
  renderRowDnd5e,
  renderTrayItemDnd5e,
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

const dnd5e: SystemConfig = {
  id: 'dnd5e',
  label: 'D&D 5th Ed.',
  shortLabel: 'd&d 5th ed. · v0.1',
  attribution: {
    text: 'D&D 5e — SRD 5.2 © Wizards of the Coast, CC BY 4.0 (modified) · via Open5e',
    href: 'https://creativecommons.org/licenses/by/4.0/',
  },
  loadRecords: () => loadDnd5eSpells() as unknown as Promise<Record_[]>,
  filter: filterDnd5e as unknown as SystemConfig['filter'],
  emptyFilterState: {
    query: '',
    queryIncludeText: false,
    schools: [],
    levels: [],
    classes: [],
  },
  filterControls: FILTER_CONTROLS,
  renderCard: renderCardDnd5e as unknown as SystemConfig['renderCard'],
  renderRow: renderRowDnd5e as unknown as SystemConfig['renderRow'],
  renderTrayItem:
    renderTrayItemDnd5e as unknown as SystemConfig['renderTrayItem'],
  themeColor: ((r: Record_) =>
    dnd5eThemeColor(r as unknown as DndSpell)) as SystemConfig['themeColor'],
  detail: {
    extract: ((r: Record_) =>
      dnd5eDetail(r as unknown as DndSpell)) as SystemConfig['detail']['extract'],
    caps: CAPS,
  },
};

export default dnd5e;
