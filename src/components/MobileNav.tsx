import { Icon } from './atoms/Icon';

export type MobilePanel = 'filters' | 'spells' | 'selection';

interface Props {
  active: MobilePanel;
  onChange: (panel: MobilePanel) => void;
  selectionCount: number;
  filterCount: number;
}

export function MobileNav({
  active,
  onChange,
  selectionCount,
  filterCount,
}: Props): JSX.Element {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      <NavBtn
        label="Filters"
        icon="filter"
        active={active === 'filters'}
        badge={filterCount > 0 ? filterCount : undefined}
        onClick={() => onChange('filters')}
      />
      <NavBtn
        label="Spells"
        icon="list"
        active={active === 'spells'}
        onClick={() => onChange('spells')}
      />
      <NavBtn
        label="Selection"
        icon="check"
        active={active === 'selection'}
        badge={selectionCount > 0 ? selectionCount : undefined}
        onClick={() => onChange('selection')}
      />
    </nav>
  );
}

interface NavBtnProps {
  label: string;
  icon: 'filter' | 'list' | 'check';
  active: boolean;
  badge?: number;
  onClick: () => void;
}

function NavBtn({ label, icon, active, badge, onClick }: NavBtnProps): JSX.Element {
  return (
    <button
      type="button"
      className={`mobile-nav-btn${active ? ' mobile-nav-btn--active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="mobile-nav-btn__icon">
        <Icon name={icon} size={18} />
        {badge != null && (
          <span className="mobile-nav-btn__badge">{badge}</span>
        )}
      </span>
      <span className="mobile-nav-btn__label">{label}</span>
    </button>
  );
}
