import { useActiveSystemId } from '../store/selectionStore';
import { getSystem } from '../systems';
import { SystemPicker } from './SystemPicker';

interface Props {
  selectionCount: number;
  totalSpells: number;
}

export function TopBar({ selectionCount, totalSpells }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 18px',
        background: 'var(--paper)',
        borderBottom: '1px solid var(--rule2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--ink)',
            color: 'var(--paper)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
          }}
        >
          S
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>
            Spell Cards
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              color: 'var(--muted)',
            }}
          >
            {system.shortLabel}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <SystemPicker />
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: 'var(--muted)',
        }}
      >
        {totalSpells.toLocaleString()} spells loaded
      </div>
      <div
        style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: 'var(--paper2)',
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {selectionCount} selected
      </div>
    </div>
  );
}
