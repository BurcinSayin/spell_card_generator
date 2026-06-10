import { useMemo, useState } from 'react';
import {
  useSelection,
  useSelectedIds,
  useActiveSystemId,
} from '../../store/selectionStore';
import { getSystem } from '../../systems';
import type { Record_ } from '../../systems/types';
import { SpellRow } from './SpellRow';

interface Props {
  records: Record_[];
  loaded: boolean;
}

export function SpellList({ records, loaded }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const selectedIds = useSelectedIds();
  const toggle = useSelection((s) => s.toggle);
  const [hover, setHover] = useState<string | null>(null);
  const selected = new Set(selectedIds);

  const rows = useMemo(
    () => records.map((r) => system.renderRow(r)),
    [records, system],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 18px',
          background: 'var(--paper)',
          borderBottom: '1px solid var(--rule2)',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>Spells</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: 'var(--muted)',
          }}
        >
          {records.length} results
        </span>
        <div style={{ flex: 1 }} />
        <span
          className="spell-list-hint"
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--muted)',
          }}
        >
          click row to add · ↑↓ navigate
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {!loaded ? (
          <Loading />
        ) : records.length === 0 ? (
          <Empty />
        ) : (
          records.map((r, i) => (
            <SpellRow
              key={r.id}
              row={rows[i]}
              selected={selected.has(r.id)}
              hovered={hover === r.id}
              onHover={() => setHover(r.id)}
              onLeave={() => setHover(null)}
              onClick={() => toggle(r.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Loading(): JSX.Element {
  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: 13,
      }}
    >
      Loading spells…
    </div>
  );
}

function Empty(): JSX.Element {
  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: 'var(--muted)',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>∅</div>
      <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
        No spells match
      </div>
      <div style={{ fontSize: 12 }}>
        Try clearing some filters or adjusting your search.
      </div>
    </div>
  );
}
