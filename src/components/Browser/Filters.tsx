import { useSelection, useFilters, useActiveSystemId } from '../../store/selectionStore';
import { getSystem } from '../../systems';
import type { FilterControl } from '../../systems/types';
import { Icon } from '../atoms/Icon';
import { SearchControl } from './filterControls/SearchControl';
import { EnumGridControl } from './filterControls/EnumGridControl';
import { EnumPillsControl } from './filterControls/EnumPillsControl';
import { IntDotsControl } from './filterControls/IntDotsControl';
import { ClassLevelControl } from './filterControls/ClassLevelControl';

interface Props {
  optionCounts: Record<string, Record<string, number>>;
  resultCount: number;
  onCloseDrawer?: () => void;
}

function isNonEmpty(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function activeFilterCount(
  controls: FilterControl[],
  filters: Record<string, unknown>,
): number {
  let count = 0;
  for (const c of controls) {
    if (c.kind === 'class-level') {
      if (isNonEmpty(filters[c.levels.id])) {
        count += (filters[c.levels.id] as unknown[]).length;
      }
      if (isNonEmpty(filters[c.classes.id])) {
        count += (filters[c.classes.id] as unknown[]).length;
      }
    } else {
      const v = filters[c.id];
      if (c.kind === 'search') {
        if (typeof v === 'string' && v.length > 0) count += 1;
        if (filters[`${c.id}IncludeText`] === true) count += 1;
      } else if (Array.isArray(v)) {
        count += v.length;
      } else if (isNonEmpty(v)) {
        count += 1;
      }
    }
  }
  return count;
}

export function Filters({ optionCounts, resultCount, onCloseDrawer }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const filters = useFilters();
  const setFilter = useSelection((s) => s.setFilter);
  const clearFilters = useSelection((s) => s.clearFilters);

  const activeCount = activeFilterCount(system.filterControls, filters);

  const search = system.filterControls.find((c) => c.kind === 'search');
  const rest = system.filterControls.filter((c) => c.kind !== 'search');

  return (
    <div
      style={{
        borderRight: '1px solid var(--rule2)',
        background: 'var(--paper)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        height: '100%',
      }}
    >
      {onCloseDrawer && (
        <div className="filters-drawer-header">
          <span>Filters</span>
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close filters"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: 4,
              borderRadius: 6,
              color: 'var(--ink)',
            }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
      )}
      {search && (
        <div style={{ padding: '14px 14px 10px' }}>
          <SearchControl
            control={search}
            value={(filters[search.id] as string) ?? ''}
            onChange={(v) => setFilter(search.id, v)}
            includeText={Boolean(filters[`${search.id}IncludeText`])}
            onIncludeTextChange={(v) =>
              setFilter(`${search.id}IncludeText`, v)
            }
          />
        </div>
      )}

      <div
        style={{
          padding: '0 14px 14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          flex: 1,
        }}
      >
        {rest.map((c) => {
          if (c.kind === 'enum-grid') {
            return (
              <EnumGridControl
                key={c.id}
                control={c}
                value={(filters[c.id] as string[] | undefined) ?? []}
                counts={optionCounts[c.id] ?? {}}
                onChange={(v) => setFilter(c.id, v)}
              />
            );
          }
          if (c.kind === 'enum-pills') {
            return (
              <EnumPillsControl
                key={c.id}
                control={c}
                value={(filters[c.id] as string[] | undefined) ?? []}
                onChange={(v) => setFilter(c.id, v)}
              />
            );
          }
          if (c.kind === 'int-dots') {
            return (
              <IntDotsControl
                key={c.id}
                control={c}
                value={(filters[c.id] as number[] | undefined) ?? []}
                onChange={(v) => setFilter(c.id, v)}
              />
            );
          }
          if (c.kind === 'class-level') {
            return (
              <ClassLevelControl
                key={c.id}
                control={c}
                classesValue={
                  (filters[c.classes.id] as string[] | undefined) ?? []
                }
                classesOnChange={(v) => setFilter(c.classes.id, v)}
                levelsValue={
                  (filters[c.levels.id] as number[] | undefined) ?? []
                }
                levelsOnChange={(v) => setFilter(c.levels.id, v)}
              />
            );
          }
          return null;
        })}

        <div style={{ flex: 1 }} />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--rule2)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--paper2)',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: 'var(--muted)',
          }}
        >
          {resultCount} match{resultCount === 1 ? '' : 'es'}
        </span>
        <div style={{ flex: 1 }} />
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--accent)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Icon name="x" size={12} /> Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}
