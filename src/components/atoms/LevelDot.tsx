interface Props {
  n: number;
  on: boolean;
  onClick: () => void;
}

export function LevelDot({ n, on, onClick }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: '1px solid ' + (on ? 'var(--ink)' : 'var(--rule2)'),
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--paper)' : 'var(--ink)',
        fontFamily: 'JetBrains Mono',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .12s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </button>
  );
}
