import type { Spell, CasterClass, SpellSchool } from './record';
import type { FilterState } from '../types';

export function filterPf1e(spells: Spell[], state: FilterState): Spell[] {
  const query = ((state.query as string) ?? '').trim().toLowerCase();
  const includeText = Boolean(state.queryIncludeText);
  const classSet = new Set((state.classes as CasterClass[] | undefined) ?? []);
  const levelSet = new Set((state.levels as number[] | undefined) ?? []);
  const schoolSet = new Set((state.schools as SpellSchool[] | undefined) ?? []);
  return spells.filter((s) => {
    if (query) {
      const nameMatch = s.name.toLowerCase().includes(query);
      const textMatch =
        includeText && s.description.toLowerCase().includes(query);
      if (!nameMatch && !textMatch) return false;
    }
    if (schoolSet.size && !schoolSet.has(s.school)) return false;
    if (classSet.size || levelSet.size) {
      const matches = Object.entries(s.levels).some(([cls, lvl]) => {
        const cMatch = classSet.size ? classSet.has(cls as CasterClass) : true;
        const lMatch = levelSet.size ? levelSet.has(lvl as number) : true;
        return cMatch && lMatch;
      });
      if (!matches) return false;
    }
    return true;
  });
}
