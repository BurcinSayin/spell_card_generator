import type { RenderedCard } from '../../systems/types';

interface Props {
  rendered: RenderedCard;
  portrait?: boolean;
  variant?: 'front' | 'back';
  detailText?: string;
  detailFontScale?: number;
  continuedOnBack?: boolean;
  continuedInSource?: boolean;
}

const HEIGHTENED_MARKER = 'Heightened (';

export function CardModern({
  rendered,
  portrait = true,
  variant = 'front',
  detailText,
  detailFontScale = 1,
  continuedOnBack = false,
  continuedInSource = false,
}: Props): JSX.Element {
  if (variant === 'back') {
    return (
      <BackCard
        rendered={rendered}
        portrait={portrait}
        text={detailText ?? ''}
        scale={detailFontScale}
        continuedInSource={continuedInSource}
      />
    );
  }
  return (
    <FrontCard
      rendered={rendered}
      portrait={portrait}
      detailText={detailText ?? rendered.detail}
      scale={detailFontScale}
      continuedOnBack={continuedOnBack}
    />
  );
}

interface FrontProps {
  rendered: RenderedCard;
  portrait: boolean;
  detailText: string;
  scale: number;
  continuedOnBack: boolean;
}

function FrontCard({
  rendered,
  portrait,
  detailText,
  scale,
  continuedOnBack,
}: FrontProps): JSX.Element {
  const color = rendered.themeColor;
  const { title, shortInfo } = rendered;
  const fs = portrait ? 1 : 0.92;
  const descBase = portrait ? 8 : 7;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#fbfaf6',
        border: '1px solid #1f1a14',
        borderRadius: 4,
        display: 'flex',
      }}
    >
      <div style={{ width: 8, background: color }} />
      <div
        style={{
          padding: `${10 * fs}px ${12 * fs}px`,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 6 * fs,
          minWidth: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 800,
                fontSize: portrait ? 17 : 14,
                lineHeight: 1.05,
                letterSpacing: '-.01em',
                color: '#1f1a14',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title.name}
            </div>
            {title.subtitle && (
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: portrait ? 8 : 7,
                  color: '#6b6357',
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '.12em',
                }}
              >
                {title.subtitle}
              </div>
            )}
          </div>
          {title.badge !== undefined && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 800,
                  fontSize: portrait ? 28 : 22,
                  lineHeight: 1,
                  color,
                }}
              >
                {title.badge}
              </div>
              {title.badgeCaption && (
                <div
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 6,
                    color: '#6b6357',
                    textTransform: 'uppercase',
                    letterSpacing: '.14em',
                  }}
                >
                  {title.badgeCaption}
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ height: 1, background: '#1f1a14' }} />
        {title.metaLine && (
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: portrait ? 7.5 : 7,
              color: '#3a342b',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title.metaLine}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 10,
            rowGap: 4 * fs,
          }}
        >
          {shortInfo.map((cell, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 6,
                  letterSpacing: '.14em',
                  color: '#6b6357',
                }}
              >
                {cell.label}
              </div>
              <div style={{ fontSize: portrait ? 8 : 7, lineHeight: 1.25, color: '#1f1a14' }}>
                {cell.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: 'rgba(31,26,20,.25)' }} />
        <div
          style={{
            fontFamily: 'Inter',
            fontSize: descBase * scale,
            lineHeight: 1.4,
            color: '#1f1a14',
            flex: 1,
            overflow: 'hidden',
            textAlign: 'justify',
          }}
        >
          <DetailText text={detailText} boldTerms={rendered.detailBoldTerms} />
        </div>
        {continuedOnBack && (
          <div
            style={{
              fontFamily: 'Inter',
              fontStyle: 'italic',
              fontSize: 6.5,
              color: '#6b6357',
            }}
          >
            (continued on back)
          </div>
        )}
      </div>
    </div>
  );
}

interface BackProps {
  rendered: RenderedCard;
  portrait: boolean;
  text: string;
  scale: number;
  continuedInSource: boolean;
}

function BackCard({
  rendered,
  portrait,
  text,
  scale,
  continuedInSource,
}: BackProps): JSX.Element {
  const color = rendered.themeColor;
  const fs = portrait ? 1 : 0.92;
  const descBase = portrait ? 8 : 7;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#fbfaf6',
        border: '1px solid #1f1a14',
        borderRadius: 4,
        display: 'flex',
      }}
    >
      <div style={{ width: 8, background: color }} />
      <div
        style={{
          padding: `${10 * fs}px ${12 * fs}px`,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 6 * fs,
          minWidth: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: portrait ? 13 : 11,
              lineHeight: 1.05,
              letterSpacing: '-.01em',
              color: '#1f1a14',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {rendered.title.name}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontStyle: 'italic',
              fontSize: portrait ? 9 : 8,
              color: '#6b6357',
              flexShrink: 0,
            }}
          >
            continued
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(31,26,20,.25)' }} />
        <div
          style={{
            fontFamily: 'Inter',
            fontSize: descBase * scale,
            lineHeight: 1.4,
            color: '#1f1a14',
            flex: 1,
            overflow: 'hidden',
            textAlign: 'justify',
          }}
        >
          <DetailText text={text} boldTerms={rendered.detailBoldTerms} />
        </div>
        {continuedInSource && (
          <div
            style={{
              fontFamily: 'Inter',
              fontStyle: 'italic',
              fontSize: 6.5,
              color: '#6b6357',
            }}
          >
            (continued in source)
          </div>
        )}
      </div>
    </div>
  );
}

function DetailText({
  text,
  boldTerms = [],
}: {
  text: string;
  boldTerms?: ReadonlyArray<string>;
}): JSX.Element {
  const heightenedIndex = text.indexOf(HEIGHTENED_MARKER);
  if (heightenedIndex < 0) return <>{renderInlineText(text, boldTerms)}</>;

  const before = text.slice(0, heightenedIndex).trimEnd();
  const heightened = text.slice(heightenedIndex);
  return (
    <>
      {before && <div>{renderInlineText(before, boldTerms)}</div>}
      <div
        style={{
          height: 1,
          background: 'rgba(31,26,20,.35)',
          margin: before ? '6px 0 5px' : '0 0 5px',
        }}
      />
      <div>{renderInlineText(heightened, boldTerms)}</div>
    </>
  );
}

function renderInlineText(
  text: string,
  boldTerms: ReadonlyArray<string>,
): Array<string | JSX.Element> | string {
  if (boldTerms.length === 0) return text;

  const terms = [...boldTerms].sort((a, b) => b.length - a.length);
  const termSet = new Set(terms);
  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'g');
  return text.split(pattern).map((part, index) =>
    termSet.has(part) ? <strong key={index}>{part}</strong> : part,
  );
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
