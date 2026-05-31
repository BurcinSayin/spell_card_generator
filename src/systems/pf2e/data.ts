import type { Pf2eSpell } from './record';
import { normalizeRows } from './normalize';

let cache: Promise<Pf2eSpell[]> | null = null;

export function loadPf2eSpells(): Promise<Pf2eSpell[]> {
  if (!cache) {
    cache = fetch('/data/pf2e/spells.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load PF2e spells: ${res.status}`);
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
