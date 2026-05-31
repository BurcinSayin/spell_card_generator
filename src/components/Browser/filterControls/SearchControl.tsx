import type { FilterControl } from '../../../systems/types';
import { Icon } from '../../atoms/Icon';

type SearchCtrl = Extract<FilterControl, { kind: 'search' }>;

interface Props {
  control: SearchCtrl;
  value: string;
  onChange: (v: string) => void;
  includeText: boolean;
  onIncludeTextChange: (v: boolean) => void;
}

export function SearchControl({
  control,
  value,
  onChange,
  includeText,
  onIncludeTextChange,
}: Props): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid var(--rule2)',
          background: 'var(--paper2)',
        }}
      >
        <span style={{ color: 'var(--muted)' }}>
          <Icon name="search" size={14} />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={control.placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 13,
            color: 'var(--ink)',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--muted)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: 'var(--muted)',
          cursor: 'pointer',
          userSelect: 'none',
          paddingLeft: 2,
        }}
      >
        <input
          type="checkbox"
          checked={includeText}
          onChange={(e) => onIncludeTextChange(e.target.checked)}
          style={{ margin: 0, cursor: 'pointer' }}
        />
        Include text
      </label>
    </div>
  );
}
