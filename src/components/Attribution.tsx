import { useActiveSystemId } from '../store/selectionStore';
import { getSystem } from '../systems';

export function Attribution(): JSX.Element | null {
  const systemId = useActiveSystemId();
  const attribution = getSystem(systemId).attribution;
  if (!attribution) return null;

  return (
    <div className="app-attribution">
      {attribution.href ? (
        <a href={attribution.href} target="_blank" rel="noopener noreferrer">
          {attribution.text}
        </a>
      ) : (
        attribution.text
      )}
    </div>
  );
}
