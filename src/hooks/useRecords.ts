import { useEffect, useState } from 'react';
import { useActiveSystemId } from '../store/selectionStore';
import { getSystem } from '../systems';
import type { Record_ } from '../systems/types';

interface LoadedRecords {
  systemId: string;
  records: Record_[];
}

export function useRecords(): Record_[] | null {
  const systemId = useActiveSystemId();
  const [loaded, setLoaded] = useState<LoadedRecords | null>(null);
  useEffect(() => {
    let cancelled = false;
    getSystem(systemId)
      .loadRecords()
      .then((r) => {
        if (!cancelled) setLoaded({ systemId, records: r });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoaded({ systemId, records: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [systemId]);
  return loaded && loaded.systemId === systemId ? loaded.records : null;
}
