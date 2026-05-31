import type { SystemConfig } from './types';
import pf1e from './pf1e';
import pf2e from './pf2e';

const SYSTEMS: Record<string, SystemConfig> = {
  [pf1e.id]: pf1e,
  [pf2e.id]: pf2e,
};

export const defaultSystemId = pf1e.id;

export function getSystem(id: string): SystemConfig {
  const sys = SYSTEMS[id];
  if (!sys) throw new Error(`Unknown system: ${id}`);
  return sys;
}

export function listSystems(): SystemConfig[] {
  return Object.values(SYSTEMS);
}
