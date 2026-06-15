import type { DndSchool, DndSpell } from './record';
import type { FilterState } from '../types';

export function filterDnd5e(records: DndSpell[], state: FilterState): DndSpell[] {
  const q = ((state.query as string) ?? '').trim().toLowerCase();
  const includeText = Boolean(state.queryIncludeText);
  const schools = new Set((state.schools as DndSchool[] | undefined) ?? []);
  const levels = new Set((state.levels as number[] | undefined) ?? []);
  const classes = new Set((state.classes as string[] | undefined) ?? []);
  return records.filter((s) => {
    if (q) {
      const nameMatch = s.name.toLowerCase().includes(q);
      const textMatch = includeText && s.description.toLowerCase().includes(q);
      if (!nameMatch && !textMatch) return false;
    }
    if (schools.size && !schools.has(s.school)) return false;
    if (levels.size && !levels.has(s.level)) return false;
    if (classes.size && !(s.classes ?? []).some((c) => classes.has(c))) {
      return false;
    }
    return true;
  });
}
