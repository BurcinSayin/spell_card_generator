import type { Pf2eSpell, Tradition } from './record';
import type { FilterState } from '../types';

export function filterPf2e(records: Pf2eSpell[], state: FilterState): Pf2eSpell[] {
  const q = ((state.query as string) ?? '').trim().toLowerCase();
  const includeText = Boolean(state.queryIncludeText);
  const levels = new Set((state.levels as number[] | undefined) ?? []);
  const traditions = new Set(
    (state.traditions as Tradition[] | undefined) ?? [],
  );
  const traits = new Set((state.traits as string[] | undefined) ?? []);
  return records.filter((s) => {
    if (q) {
      const nameMatch = s.name.toLowerCase().includes(q);
      const textMatch = includeText && s.description.toLowerCase().includes(q);
      if (!nameMatch && !textMatch) return false;
    }
    if (levels.size && !levels.has(s.level)) return false;
    if (
      traditions.size &&
      !(s.traditions ?? []).some((t) => traditions.has(t))
    ) {
      return false;
    }
    if (traits.size && !(s.traits ?? []).some((t) => traits.has(t))) return false;
    return true;
  });
}
