interface Props {
  label: string;
  short: string;
  color?: string;
  count: number;
  on: boolean;
  onClick: () => void;
  showColors: boolean;
}

export function EnumTile({
  short,
  color,
  count,
  on,
  onClick,
  showColors,
}: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 6px',
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: 8,
        border: '1px solid ' + (on ? 'transparent' : 'var(--rule2)'),
        background: on
          ? showColors && color
            ? color
            : 'var(--ink)'
          : 'var(--paper)',
        color: on ? '#fff' : 'var(--ink)',
        transition: 'all .15s',
        boxShadow: on ? '0 2px 8px rgba(31,26,20,.18)' : 'none',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '.06em',
        }}
      >
        {short}
      </div>
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          opacity: 0.7,
          marginTop: 2,
        }}
      >
        {count}
      </div>
    </button>
  );
}
