import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultSystemId } from '../systems';
import { getSystem } from '../systems';
import type { FilterState } from '../systems/types';

export type Layout = 'portrait-4' | 'landscape-6';

interface SystemSlice {
  selectedIds: string[];
  filters: FilterState;
}

interface SelectionState {
  systemId: string;
  layout: Layout;
  systems: Record<string, SystemSlice>;
  setSystem: (id: string) => void;
  toggle: (id: string) => void;
  reorder: (from: number, to: number) => void;
  clear: () => void;
  setLayout: (layout: Layout) => void;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;
}

function initialSlice(systemId: string): SystemSlice {
  return {
    selectedIds: [],
    filters: { ...getSystem(systemId).emptyFilterState },
  };
}

function ensureSlice(
  systems: Record<string, SystemSlice>,
  systemId: string,
): Record<string, SystemSlice> {
  if (systems[systemId]) return systems;
  return { ...systems, [systemId]: initialSlice(systemId) };
}

export const useSelection = create<SelectionState>()(
  persist(
    (set) => ({
      systemId: defaultSystemId,
      layout: 'portrait-4',
      systems: { [defaultSystemId]: initialSlice(defaultSystemId) },

      setSystem: (id) =>
        set((s) => ({
          systemId: id,
          systems: ensureSlice(s.systems, id),
        })),

      toggle: (id) =>
        set((s) => {
          const slice = s.systems[s.systemId] ?? initialSlice(s.systemId);
          const selectedIds = slice.selectedIds.includes(id)
            ? slice.selectedIds.filter((x) => x !== id)
            : [...slice.selectedIds, id];
          return {
            systems: { ...s.systems, [s.systemId]: { ...slice, selectedIds } },
          };
        }),

      reorder: (from, to) =>
        set((s) => {
          if (from === to) return s;
          const slice = s.systems[s.systemId] ?? initialSlice(s.systemId);
          const next = slice.selectedIds.slice();
          const [moved] = next.splice(from, 1);
          if (moved === undefined) return s;
          next.splice(to, 0, moved);
          return {
            systems: {
              ...s.systems,
              [s.systemId]: { ...slice, selectedIds: next },
            },
          };
        }),

      clear: () =>
        set((s) => {
          const slice = s.systems[s.systemId] ?? initialSlice(s.systemId);
          return {
            systems: {
              ...s.systems,
              [s.systemId]: { ...slice, selectedIds: [] },
            },
          };
        }),

      setLayout: (layout) => set({ layout }),

      setFilter: (key, value) =>
        set((s) => {
          const slice = s.systems[s.systemId] ?? initialSlice(s.systemId);
          return {
            systems: {
              ...s.systems,
              [s.systemId]: {
                ...slice,
                filters: { ...slice.filters, [key]: value },
              },
            },
          };
        }),

      clearFilters: () =>
        set((s) => {
          const slice = s.systems[s.systemId] ?? initialSlice(s.systemId);
          return {
            systems: {
              ...s.systems,
              [s.systemId]: {
                ...slice,
                filters: { ...getSystem(s.systemId).emptyFilterState },
              },
            },
          };
        }),
    }),
    {
      name: 'pf-spell-cards',
      version: 2,
      migrate: (persistedState, version) => {
        if (version === undefined || version < 2) {
          const old = (persistedState as Partial<{
            selectedIds: string[];
            layout: Layout;
            filters: {
              query?: string;
              classes?: string[];
              levels?: number[];
              schools?: string[];
            };
          }>) ?? {};
          const oldFilters = old.filters ?? {};
          return {
            systemId: 'pf1e',
            layout: old.layout ?? 'portrait-4',
            systems: {
              pf1e: {
                selectedIds: old.selectedIds ?? [],
                filters: {
                  query: oldFilters.query ?? '',
                  schools: oldFilters.schools ?? [],
                  classes: oldFilters.classes ?? [],
                  levels: oldFilters.levels ?? [],
                },
              },
            },
          } as unknown as SelectionState;
        }
        return persistedState as SelectionState;
      },
    },
  ),
);

export const useActiveSystemId = (): string =>
  useSelection((s) => s.systemId);

export const useSelectedIds = (): string[] =>
  useSelection(
    (s) => s.systems[s.systemId]?.selectedIds ?? [],
  );

export const useFilters = (): FilterState =>
  useSelection((s) => s.systems[s.systemId]?.filters ?? {});
