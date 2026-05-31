import type { Layout } from '../store/selectionStore';
import { useActiveSystemId } from '../store/selectionStore';
import { getSystem } from '../systems';
import type { Record_, RenderedCard } from '../systems/types';
import { CardModern } from '../components/Preview/CardModern';
import { splitDetail } from './splitDetail';

interface Props {
  records: Record_[];
  layout: Layout;
}

interface CardItem {
  recordId: string;
  rendered: RenderedCard;
  variant: 'front' | 'back';
  detailText: string;
  scale: number;
  continuedOnBack: boolean;
  continuedInSource: boolean;
}

// Same CSS-px-per-mm scale as the on-screen PdfModal preview. Keeping this
// number in sync means text/card proportions match the preview exactly.
const PREVIEW_MM = 2.6;
// CSS px per mm at print's physical scale: 1 in = 25.4 mm = 96 CSS px.
// Scale we must apply to map preview-coord px → physical mm.
const PRINT_SCALE = 96 / (25.4 * PREVIEW_MM);

const PAGE_DIMS = {
  portrait: { wMm: 210, hMm: 297 },
  landscape: { wMm: 297, hMm: 210 },
};

const CARD_DIMS: Record<Layout, { wMm: number; hMm: number }> = {
  'portrait-4': { wMm: 95, hMm: 138.5 },
  'landscape-6': { wMm: 91, hMm: 95 },
};

export function PrintSheet({ records, layout }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const portrait = layout === 'portrait-4';
  const cardsPerPage = portrait ? 4 : 6;
  const cols = portrait ? 2 : 3;
  const rows = 2;
  const pageDims = portrait ? PAGE_DIMS.portrait : PAGE_DIMS.landscape;
  const cardDims = CARD_DIMS[layout];

  const items: CardItem[] = [];
  for (const r of records) {
    const rendered = system.renderCard(r);
    const split = splitDetail(rendered.detail, system.detail.caps[layout]);
    const fontScale = split.fontSize / split.defaultFontSize;
    items.push({
      recordId: r.id,
      rendered,
      variant: 'front',
      detailText: split.front,
      scale: fontScale,
      continuedOnBack: split.back !== undefined,
      continuedInSource: false,
    });
    if (split.back !== undefined) {
      items.push({
        recordId: r.id,
        rendered,
        variant: 'back',
        detailText: split.back,
        scale: fontScale,
        continuedOnBack: false,
        continuedInSource: split.backTruncated,
      });
    }
  }

  const pages: CardItem[][] = [];
  for (let i = 0; i < items.length; i += cardsPerPage) {
    pages.push(items.slice(i, i + cardsPerPage));
  }

  const innerW = pageDims.wMm * PREVIEW_MM;
  const innerH = pageDims.hMm * PREVIEW_MM;
  const innerCardW = cardDims.wMm * PREVIEW_MM;
  const innerCardH = cardDims.hMm * PREVIEW_MM;

  return (
    <>
      {pages.map((pageItems, pi) => (
        <div
          key={pi}
          className="print-page"
          style={{
            width: `${pageDims.wMm}mm`,
            height: `${pageDims.hMm}mm`,
            position: 'relative',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div
            style={{
              width: `${innerW}px`,
              height: `${innerH}px`,
              transform: `scale(${PRINT_SCALE})`,
              transformOrigin: 'top left',
              padding: `${8 * PREVIEW_MM}px`,
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${innerCardW}px)`,
              gridTemplateRows: `repeat(${rows}, ${innerCardH}px)`,
              justifyContent: 'space-between',
              alignContent: 'space-between',
              background: '#fff',
            }}
          >
            {Array.from({ length: cols * rows }).map((_, i) => {
              const item = pageItems[i];
              if (!item) return <div key={i} />;
              return (
                <CardModern
                  key={`${item.recordId}-${item.variant}-${i}`}
                  rendered={item.rendered}
                  portrait={portrait}
                  variant={item.variant}
                  detailText={item.detailText}
                  detailFontScale={item.scale}
                  continuedOnBack={item.continuedOnBack}
                  continuedInSource={item.continuedInSource}
                />
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
