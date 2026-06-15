import type { Layout } from '../store/selectionStore';

export interface BaseRecord {
  id: string;
  name: string;
}

export type Record_ = BaseRecord & { [field: string]: unknown };

export type FilterState = { [controlId: string]: unknown };

export interface EnumOption {
  value: string;
  label: string;
  short: string;
  color?: string;
}

export type FilterControl =
  | {
      kind: 'search';
      id: string;
      label: string;
      placeholder: string;
    }
  | {
      kind: 'enum-grid';
      id: string;
      label: string;
      columns: number;
      showColors: boolean;
      /** Record field counted to populate the per-option count badges. */
      field: string;
      options: ReadonlyArray<EnumOption>;
    }
  | {
      kind: 'enum-pills';
      id: string;
      label: string;
      options: ReadonlyArray<{ value: string; label: string }>;
    }
  | {
      kind: 'int-dots';
      id: string;
      label: string;
      values: ReadonlyArray<number>;
    }
  | {
      kind: 'class-level';
      id: string;
      label: string;
      levels: { id: string; label: string; values: ReadonlyArray<number> };
      classes: {
        id: string;
        label: string;
        options: ReadonlyArray<{ value: string; label: string }>;
      };
    };

export interface RenderedCardTitle {
  name: string;
  badge?: string | number;
  badgeCaption?: string;
  subtitle?: string;
  metaLine?: string;
}

export interface ShortInfoCell {
  label: string;
  value: string;
}

export interface RenderedCard {
  themeColor: string;
  title: RenderedCardTitle;
  shortInfo: ReadonlyArray<ShortInfoCell>;
  detail: string;
  detailBoldTerms?: ReadonlyArray<string>;
}

export interface RowData {
  name: string;
  themeColor: string;
  subtitle: string;
  summary: string;
  badges: string[];
}

export interface TrayItemData {
  name: string;
  themeColor: string;
  caption: string;
}

export interface SplitCaps {
  defaultFontSize: number;
  floorFontSize: number;
  step: number;
  frontCap: number;
  backCap: number;
}

/** Short attribution/credits line shown in the app chrome (CC-BY / OGL / ORC compliance). */
export interface Attribution {
  text: string;
  href?: string;
}

export interface SystemConfig {
  id: string;
  label: string;
  shortLabel: string;
  /** Per-system content attribution surfaced in the app footer; omit for none. */
  attribution?: Attribution;
  loadRecords: () => Promise<Record_[]>;
  filter: (records: Record_[], state: FilterState) => Record_[];
  emptyFilterState: FilterState;
  filterControls: FilterControl[];
  renderCard: (record: Record_) => RenderedCard;
  renderRow: (record: Record_) => RowData;
  renderTrayItem: (record: Record_) => TrayItemData;
  themeColor: (record: Record_) => string;
  detail: {
    extract: (record: Record_) => string;
    caps: Record<Layout, SplitCaps>;
  };
}
