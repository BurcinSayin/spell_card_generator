import { useMemo, useRef } from 'react';
import { useSelection, useActiveSystemId } from '../../store/selectionStore';
import { getSystem } from '../../systems';
import type { Record_ } from '../../systems/types';
import { Icon } from '../atoms/Icon';
import { TrayItem } from './TrayItem';
import { LayoutPicker } from './LayoutPicker';
import { SheetThumb } from '../Preview/SheetThumb';

interface Props {
  records: Record_[];
  openPdf: () => void;
}

export function SelectedTray({ records, openPdf }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const layout = useSelection((s) => s.layout);
  const toggle = useSelection((s) => s.toggle);
  const reorder = useSelection((s) => s.reorder);
  const clear = useSelection((s) => s.clear);

  const items = useMemo(
    () => records.map((r) => system.renderTrayItem(r)),
    [records, system],
  );

  const dragIdx = useRef<number | null>(null);
  const onDragStart = (i: number) => (e: React.DragEvent): void => {
    dragIdx.current = i;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = () => (e: React.DragEvent): void => {
    e.preventDefault();
  };
  const onDrop = (i: number) => (e: React.DragEvent): void => {
    e.preventDefault();
    const from = dragIdx.current;
    dragIdx.current = null;
    if (from == null || from === i) return;
    reorder(from, i);
  };

  const empty = records.length === 0;
  const cardsPerPage = layout === 'portrait-4' ? 4 : 6;
  const totalPages = Math.max(1, Math.ceil(records.length / cardsPerPage));

  const today = new Date().toISOString().slice(0, 10);
  const filename = `spell-cards-${today}.pdf`;

  return (
    <div
      style={{
        borderLeft: '1px solid var(--rule2)',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          borderBottom: '1px solid var(--rule2)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14 }}>Selection</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            padding: '2px 7px',
            borderRadius: 4,
            background: 'var(--paper2)',
            color: 'var(--muted)',
          }}
        >
          {records.length}
        </span>
        <div style={{ flex: 1 }} />
        {!empty && (
          <button
            type="button"
            onClick={clear}
            title="Clear all"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 4,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
        {empty ? (
          <div
            style={{
              border: '1.5px dashed var(--rule2)',
              borderRadius: 8,
              padding: '30px 20px',
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              No spells yet
            </div>
            <div style={{ fontSize: 12 }}>
              Click any row in the list to add it here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {records.map((r, i) => (
              <TrayItem
                key={r.id}
                item={items[i]}
                idx={i}
                onRemove={() => toggle(r.id)}
                onDragStart={onDragStart(i)}
                onDragOver={onDragOver()}
                onDrop={onDrop(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--rule2)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'var(--paper2)',
        }}
      >
        <LayoutPicker />

        {!empty && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color: 'var(--muted)',
              }}
            >
              {totalPages} page{totalPages === 1 ? '' : 's'} · {records.length} card
              {records.length === 1 ? '' : 's'}
            </span>
            <SheetThumb layout={layout} records={records} />
          </div>
        )}

        <button
          type="button"
          onClick={openPdf}
          disabled={empty}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px',
            border: 'none',
            borderRadius: 8,
            background: empty ? 'var(--rule2)' : 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: empty ? 'not-allowed' : 'pointer',
            boxShadow: empty
              ? 'none'
              : '0 1px 0 rgba(255,255,255,.2) inset, 0 2px 6px rgba(185,74,42,.3)',
            opacity: empty ? 0.6 : 1,
            transition: 'all .12s',
          }}
        >
          <Icon name="pdf" size={16} /> Download PDF
        </button>
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--muted)',
            textAlign: 'center',
          }}
        >
          {filename}
        </div>
      </div>
    </div>
  );
}
