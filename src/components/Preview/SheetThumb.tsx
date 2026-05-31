import { useActiveSystemId } from '../../store/selectionStore';
import { getSystem } from '../../systems';
import type { Layout } from '../../store/selectionStore';
import type { Record_ } from '../../systems/types';

interface Props {
  layout: Layout;
  records: Record_[];
}

export function SheetThumb({ layout, records }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const portrait = layout === 'portrait-4';
  const cols = portrait ? 2 : 3;
  const rows = 2;
  const cells = cols * rows;
  const W = portrait ? 132 : 188;
  const H = portrait ? 188 : 132;

  return (
    <div
      style={{
        width: W,
        height: H,
        background: '#fff',
        border: '1px solid var(--rule2)',
        borderRadius: 3,
        padding: 5,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols},1fr)`,
        gridTemplateRows: `repeat(${rows},1fr)`,
        gap: 3,
        boxShadow: '0 6px 14px rgba(31,26,20,.10), 0 1px 2px rgba(31,26,20,.06)',
      }}
    >
      {Array.from({ length: cells }).map((_, i) => {
        const rec = records[i];
        if (!rec)
          return (
            <div
              key={i}
              style={{
                border: '1px dashed rgba(31,26,20,.18)',
                borderRadius: 2,
              }}
            />
          );
        const color = system.themeColor(rec);
        const rendered = system.renderCard(rec);
        return (
          <div
            key={i}
            style={{
              border: '1px solid rgba(31,26,20,.4)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <div style={{ height: 3, background: color }} />
            <div
              style={{
                padding: '2px 3px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {rendered.title.name}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 5,
                  color: 'var(--muted)',
                }}
              >
                {rendered.title.badge ?? ''}
              </div>
              <div
                style={{ height: 1.5, background: 'rgba(31,26,20,.08)', marginTop: 1 }}
              />
              <div
                style={{ height: 1.5, background: 'rgba(31,26,20,.08)', width: '85%' }}
              />
              <div
                style={{ height: 1.5, background: 'rgba(31,26,20,.08)', width: '70%' }}
              />
              <div style={{ height: 1.5, background: 'rgba(31,26,20,.08)' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
