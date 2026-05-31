import { useSelection, useActiveSystemId } from '../store/selectionStore';
import { listSystems } from '../systems';

export function SystemPicker(): JSX.Element | null {
  const systems = listSystems();
  const systemId = useActiveSystemId();
  const setSystem = useSelection((s) => s.setSystem);

  if (systems.length <= 1) return null;

  return (
    <select
      value={systemId}
      onChange={(e) => setSystem(e.target.value)}
      style={{
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        padding: '4px 8px',
        borderRadius: 6,
        border: '1px solid var(--rule2)',
        background: 'var(--paper2)',
        color: 'var(--ink)',
        cursor: 'pointer',
      }}
    >
      {systems.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
