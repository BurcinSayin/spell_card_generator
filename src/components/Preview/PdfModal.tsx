import { useEffect } from 'react';
import {
  useSelection,
  useActiveSystemId,
} from '../../store/selectionStore';
import type { Layout } from '../../store/selectionStore';
import { getSystem } from '../../systems';
import type { Record_, RenderedCard } from '../../systems/types';
import { printCards } from '../../print/printCards';
import { splitDetail } from '../../print/splitDetail';
import { Icon } from '../atoms/Icon';
import { CardModern } from './CardModern';

interface Props {
  records: Record_[];
  onClose: () => void;
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

export function PdfModal({ records, onClose }: Props): JSX.Element {
  const systemId = useActiveSystemId();
  const system = getSystem(systemId);
  const layout = useSelection((s) => s.layout);
  const portrait = layout === 'portrait-4';
  const cardsPerPage = portrait ? 4 : 6;

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const items: CardItem[] = [];
  for (const r of records) {
    const rendered = system.renderCard(r);
    const split = splitDetail(rendered.detail, system.detail.caps[layout]);
    const scale = split.fontSize / split.defaultFontSize;
    const hasBack = split.back !== undefined;
    items.push({
      recordId: r.id,
      rendered,
      variant: 'front',
      detailText: split.front,
      scale,
      continuedOnBack: hasBack,
      continuedInSource: false,
    });
    if (split.back !== undefined) {
      items.push({
        recordId: r.id,
        rendered,
        variant: 'back',
        detailText: split.back,
        scale,
        continuedOnBack: false,
        continuedInSource: split.backTruncated,
      });
    }
  }

  const pages: CardItem[][] = [];
  for (let i = 0; i < items.length; i += cardsPerPage) {
    pages.push(items.slice(i, i + cardsPerPage));
  }
  if (pages.length === 0) pages.push([]);

  const onDownload = (): void => {
    if (records.length === 0) return;
    printCards(layout);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(31,26,20,.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 22px',
          background: 'var(--paper)',
          borderBottom: '1px solid var(--rule2)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>PDF Preview</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: 'var(--muted)',
          }}
        >
          {pages.length} page{pages.length === 1 ? '' : 's'} · A4{' '}
          {portrait ? 'portrait' : 'landscape'} · {items.length} card
          {items.length === 1 ? '' : 's'}
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={onDownload}
          disabled={records.length === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            border: 'none',
            borderRadius: 8,
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: records.length === 0 ? 'not-allowed' : 'pointer',
            opacity: records.length === 0 ? 0.6 : 1,
          }}
        >
          <Icon name="pdf" size={14} /> Save as PDF
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            width: 32,
            height: 32,
            borderRadius: 6,
            display: 'grid',
            placeItems: 'center',
            color: 'var(--ink)',
          }}
        >
          <Icon name="x" size={18} />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {pages.map((pg, pi) => (
          <PageSheet
            key={pi}
            pageNum={pi + 1}
            totalPages={pages.length}
            items={pg}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

const MM = 2.6;

interface PageProps {
  pageNum: number;
  totalPages: number;
  items: CardItem[];
  layout: Layout;
}

function PageSheet({ pageNum, totalPages, items, layout }: PageProps): JSX.Element {
  const portrait = layout === 'portrait-4';
  const W = (portrait ? 210 : 297) * MM;
  const H = (portrait ? 297 : 210) * MM;
  const cardW = (portrait ? 95 : 91) * MM;
  const cardH = (portrait ? 138.5 : 95) * MM;
  const cols = portrait ? 2 : 3;
  const rows = 2;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          background: '#fff',
          position: 'relative',
          boxShadow: '0 12px 40px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.2)',
          padding: 8 * MM,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cardW}px)`,
          gridTemplateRows: `repeat(${rows}, ${cardH}px)`,
          rowGap: 4 * MM,
          columnGap: 4 * MM,
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const item = items[i];
          if (!item)
            return (
              <div
                key={i}
                style={{ border: '1px dashed #d8d2c2', borderRadius: 4 }}
              />
            );
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
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          color: '#fff',
          opacity: 0.7,
        }}
      >
        page {pageNum} / {totalPages}
      </div>
    </div>
  );
}
