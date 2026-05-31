import type { Spell } from './record';
import { normalizeRows } from './normalize';

let cache: Promise<Spell[]> | null = null;

export function loadPf1eSpells(): Promise<Spell[]> {
  if (!cache) {
    cache = fetch('/data/pf1e/spells.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load spells: ${res.status}`);
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
