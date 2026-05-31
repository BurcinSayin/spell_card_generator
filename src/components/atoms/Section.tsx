import type { ReactNode } from 'react';

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Section({ label, hint, children }: Props): JSX.Element {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
          }}
        >
          {label}
        </span>
        {hint && (
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              color: 'var(--muted)',
            }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
