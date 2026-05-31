import { useMemo, useState } from 'react';
import { TopBar } from './components/TopBar';
import { Filters } from './components/Browser/Filters';
import { SpellList } from './components/Browser/SpellList';
import { SelectedTray } from './components/Tray/SelectedTray';
import { PdfModal } from './components/Preview/PdfModal';
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

export function App(): JSX.Element {
  const records = useRecords();
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const filters = useFilters();
  const selectedIds = useSelectedIds();
  const layout = useSelection((s) => s.layout);
  const [pdfOpen, setPdfOpen] = useState(false);

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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar selectionCount={selected.length} totalSpells={all.length} />
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '264px 1fr 332px',
          minHeight: 0,
        }}
      >
        <Filters optionCounts={optionCounts} resultCount={filtered.length} />
        <SpellList records={filtered} loaded={records !== null} />
        <SelectedTray
          records={selected}
          openPdf={() => setPdfOpen(true)}
        />
      </div>

      {pdfOpen && (
        <PdfModal records={selected} onClose={() => setPdfOpen(false)} />
      )}

      <div className="print-host">
        <PrintSheet records={selected} layout={layout} />
      </div>
    </div>
  );
}
