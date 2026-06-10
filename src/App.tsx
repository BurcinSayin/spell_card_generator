import { useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { Filters } from './components/Browser/Filters';
import { SpellList } from './components/Browser/SpellList';
import { SelectedTray } from './components/Tray/SelectedTray';
import { PdfModal } from './components/Preview/PdfModal';
import { MobileNav, type MobilePanel } from './components/MobileNav';
import { PrintSheet } from './print/PrintSheet';
import { useRecords } from './hooks/useRecords';
import {
  useSelection,
  useFilters,
  useSelectedIds,
  useActiveSystemId,
} from './store/selectionStore';
import { getSystem } from './systems';
import type { Record_ } from './systems/types';
import type { FilterControl } from './systems/types';

function isNonEmpty(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function activeFilterCount(
  controls: FilterControl[],
  filters: Record<string, unknown>,
): number {
  let count = 0;
  for (const c of controls) {
    if (c.kind === 'class-level') {
      if (isNonEmpty(filters[c.levels.id])) {
        count += (filters[c.levels.id] as unknown[]).length;
      }
      if (isNonEmpty(filters[c.classes.id])) {
        count += (filters[c.classes.id] as unknown[]).length;
      }
    } else {
      const v = filters[c.id];
      if (c.kind === 'search') {
        if (typeof v === 'string' && v.length > 0) count += 1;
        if (filters[`${c.id}IncludeText`] === true) count += 1;
      } else if (Array.isArray(v)) {
        count += v.length;
      } else if (isNonEmpty(v)) {
        count += 1;
      }
    }
  }
  return count;
}

export function App(): JSX.Element {
  const records = useRecords();
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const filters = useFilters();
  const selectedIds = useSelectedIds();
  const layout = useSelection((s) => s.layout);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('spells');
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  const all = records ?? [];

  const optionCounts = useMemo(() => {
    const m: Record<string, Record<string, number>> = {};
    for (const c of system.filterControls) {
      if (c.kind !== 'enum-grid') continue;
      const counts: Record<string, number> = {};
      for (const r of all) {
        const v = r[c.field];
        if (typeof v === 'string') {
          counts[v] = (counts[v] ?? 0) + 1;
        } else if (Array.isArray(v)) {
          for (const x of v) {
            if (typeof x === 'string') counts[x] = (counts[x] ?? 0) + 1;
          }
        }
      }
      m[c.id] = counts;
    }
    return m;
  }, [all, system]);

  const filtered = useMemo(
    () => system.filter(all, filters),
    [all, filters, system],
  );

  const byId = useMemo(
    () => new Map(all.map((s) => [s.id, s])),
    [all],
  );
  const selected: Record_[] = useMemo(
    () =>
      selectedIds.flatMap((id) => {
        const r = byId.get(id);
        return r ? [r] : [];
      }),
    [selectedIds, byId],
  );

  const filterCount = activeFilterCount(system.filterControls, filters);

  const filtersPanelClass = [
    'panel-filters',
    mobilePanel === 'filters' ? 'panel-visible' : '',
    filtersDrawerOpen ? 'drawer-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="app-shell">
      <TopBar
        selectionCount={selected.length}
        totalSpells={all.length}
        filterCount={filterCount}
        onOpenFilters={() => setFiltersDrawerOpen(true)}
      />
      <div className="app-main">
        {filtersDrawerOpen && (
          <div
            className="drawer-backdrop"
            onClick={() => setFiltersDrawerOpen(false)}
            aria-hidden
          />
        )}
        <div className={filtersPanelClass}>
          <Filters
            optionCounts={optionCounts}
            resultCount={filtered.length}
            onCloseDrawer={() => setFiltersDrawerOpen(false)}
          />
        </div>
        <div
          className={`panel-spells${mobilePanel === 'spells' ? ' panel-visible' : ''}`}
        >
          <SpellList records={filtered} loaded={records !== null} />
        </div>
        <div
          className={`panel-tray${mobilePanel === 'selection' ? ' panel-visible' : ''}`}
        >
          <SelectedTray
            records={selected}
            openPdf={() => setPdfOpen(true)}
          />
        </div>
      </div>

      <MobileNav
        active={mobilePanel}
        onChange={setMobilePanel}
        selectionCount={selected.length}
        filterCount={filterCount}
      />

      {pdfOpen && (
        <PdfModal records={selected} onClose={() => setPdfOpen(false)} />
      )}

      <div className="print-host">
        <PrintSheet records={selected} layout={layout} />
      </div>
    </div>
  );
}
