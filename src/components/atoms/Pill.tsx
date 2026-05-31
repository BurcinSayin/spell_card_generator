import type { CSSProperties, ReactNode } from 'react';

interface Props {
  on: boolean;
  children: ReactNode;
  onClick: () => void;
  dot?: string;
  style?: CSSProperties;
}

export function Pill({ on, children, onClick, dot, style }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        border: '1px solid ' + (on ? 'var(--ink)' : 'var(--rule2)'),
        borderRadius: 999,
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--paper)' : 'var(--ink)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all .12s',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: dot,
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </button>
  );
}
