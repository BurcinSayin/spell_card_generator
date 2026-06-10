import { useActiveSystemId } from '../store/selectionStore';
import { getSystem } from '../systems';
import { SystemPicker } from './SystemPicker';
import { Icon } from './atoms/Icon';

interface Props {
  selectionCount: number;
  totalSpells: number;
  filterCount: number;
  onOpenFilters: () => void;
}

export function TopBar({
  selectionCount,
  totalSpells,
  filterCount,
  onOpenFilters,
}: Props): JSX.Element {
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
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
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
            flexShrink: 0,
          }}
        >
          S
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>
            Spell Cards
          </div>
          <div
            className="topbar-subtitle"
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
      <button
        type="button"
        className="topbar-filter-btn"
        onClick={onOpenFilters}
        aria-label="Open filters"
        style={{
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          border: '1px solid var(--rule2)',
          borderRadius: 8,
          background: filterCount > 0 ? 'var(--selected)' : 'var(--paper2)',
          color: filterCount > 0 ? 'var(--accent)' : 'var(--ink)',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <Icon name="sliders" size={14} />
        Filters
        {filterCount > 0 && ` (${filterCount})`}
      </button>
      <SystemPicker />
      <div
        className="topbar-meta topbar-meta--spells"
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: 'var(--muted)',
        }}
      >
        {totalSpells.toLocaleString()} spells loaded
      </div>
      <div
        className="topbar-meta"
        style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: 'var(--paper2)',
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {selectionCount} selected
      </div>
    </div>
  );
}
