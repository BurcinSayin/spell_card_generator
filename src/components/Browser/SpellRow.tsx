import type { RowData } from '../../systems/types';
import { Icon } from '../atoms/Icon';

interface Props {
  row: RowData;
  selected: boolean;
  hovered: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}

export function SpellRow({
  row,
  selected,
  hovered,
  onClick,
  onHover,
  onLeave,
}: Props): JSX.Element {
  const levelBadge = row.badges[0] ?? '';
  const sourceBadge = row.badges[1] ?? '';

  return (
    <div
      className="spell-row"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'grid',
        gridTemplateColumns: '18px 6px 1fr auto auto',
        alignItems: 'center',
        columnGap: 12,
        padding: '10px 18px',
        borderBottom: '1px solid var(--rule)',
        background: selected
          ? 'var(--selected)'
          : hovered
          ? 'var(--hover)'
          : 'transparent',
        cursor: 'pointer',
        transition: 'background .1s',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border:
            '1.5px solid ' + (selected ? 'var(--accent)' : 'var(--rule2)'),
          background: selected ? 'var(--accent)' : 'transparent',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          transition: 'all .12s',
        }}
      >
        {selected ? (
          <Icon name="check" size={12} />
        ) : hovered ? (
          <Icon name="plus" size={12} />
        ) : null}
      </span>
      <span
        style={{
          width: 4,
          height: 32,
          borderRadius: 2,
          background: row.themeColor,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{row.name}</span>
          <span
            className="spell-row-subtitle"
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '.08em',
            }}
          >
            {row.subtitle}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2,
          }}
        >
          {row.summary}
        </div>
      </div>
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: 'var(--muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {levelBadge}
      </span>
      <span
        className="spell-row-source"
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          color: 'var(--muted)',
          minWidth: 34,
          textAlign: 'right',
        }}
      >
        {sourceBadge}
      </span>
    </div>
  );
}
