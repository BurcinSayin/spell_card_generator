import type { Layout } from '../../store/selectionStore';
import { useSelection } from '../../store/selectionStore';

export function LayoutPicker(): JSX.Element {
  const layout = useSelection((s) => s.layout);
  const setLayout = useSelection((s) => s.setLayout);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
        }}
      >
        Layout
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
        }}
      >
        <LayoutBtn
          icon={<PortraitIcon />}
          label="Portrait"
          sub="4 per page"
          on={layout === 'portrait-4'}
          onClick={() => setLayout('portrait-4')}
        />
        <LayoutBtn
          icon={<LandscapeIcon />}
          label="Landscape"
          sub="6 per page"
          on={layout === 'landscape-6'}
          onClick={() => setLayout('landscape-6')}
        />
      </div>
    </div>
  );
}

interface BtnProps {
  icon: JSX.Element;
  label: string;
  sub: string;
  on: boolean;
  onClick: () => void;
}

function LayoutBtn({ icon, label, sub, on, onClick }: BtnProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 6px',
        border: '1px solid ' + (on ? 'var(--ink)' : 'var(--rule2)'),
        borderRadius: 8,
        background: on ? 'var(--ink)' : 'var(--paper)',
        color: on ? 'var(--paper)' : 'var(--ink)',
        cursor: 'pointer',
        transition: 'all .12s',
      }}
    >
      <span style={{ display: 'grid', placeItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, opacity: 0.7 }}>
        {sub}
      </span>
    </button>
  );
}

function PortraitIcon(): JSX.Element {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="2" y="2" width="18" height="22" rx="2" />
      <line x1="2" y1="13" x2="20" y2="13" />
      <line x1="11" y1="2" x2="11" y2="24" />
    </svg>
  );
}

function LandscapeIcon(): JSX.Element {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 26 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="2" y="2" width="22" height="18" rx="2" />
      <line x1="2" y1="11" x2="24" y2="11" />
      <line x1="9" y1="2" x2="9" y2="20" />
      <line x1="17" y1="2" x2="17" y2="20" />
    </svg>
  );
}

export type { Layout };
