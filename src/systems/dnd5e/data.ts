import type { DndSpell } from './record';
import { normalizeRows } from './normalize';

let cache: Promise<DndSpell[]> | null = null;

export function loadDnd5eSpells(): Promise<DndSpell[]> {
  if (!cache) {
    cache = fetch('/data/dnd5e/spells.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load D&D 5e spells: ${res.status}`);
        return res.json();
      })
      .then((raw: unknown) => {
        const spells = normalizeRows(raw);
        spells.sort((a, b) => a.name.localeCompare(b.name));
        return spells;
      });
  }
  return cache;
}
