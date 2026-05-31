import type { TrayItemData } from '../../systems/types';
import { Icon } from '../atoms/Icon';

interface Props {
  item: TrayItemData;
  idx: number;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TrayItem({
  item,
  idx,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: Props): JSX.Element {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: 'grid',
        gridTemplateColumns: '14px 18px 4px 1fr 22px',
        alignItems: 'center',
        columnGap: 8,
        padding: '8px 8px',
        borderRadius: 6,
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <span style={{ color: 'var(--muted)', cursor: 'grab' }}>
        <Icon name="grip" size={14} />
      </span>
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          color: 'var(--muted)',
          textAlign: 'right',
        }}
      >
        {idx + 1}
      </span>
      <span
        style={{
          width: 3,
          height: 22,
          borderRadius: 2,
          background: item.themeColor,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.caption}
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--muted)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 4,
          padding: 2,
        }}
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}
