import type { SplitCaps } from '../systems/types';

export interface DetailSplit {
  front: string;
  back?: string;
  fontSize: number;
  defaultFontSize: number;
  backTruncated: boolean;
}

export function splitDetail(text: string, caps: SplitCaps): DetailSplit {
  const sizes = enumerateSizes(caps);

  for (const size of sizes) {
    const ratio = caps.defaultFontSize / size;
    const frontCap = Math.floor(caps.frontCap * ratio);
    const backCap = Math.floor(caps.backCap * ratio);

    if (text.length <= frontCap) {
      return {
        front: text,
        fontSize: size,
        defaultFontSize: caps.defaultFontSize,
        backTruncated: false,
      };
    }

    const { head, rest } = splitAtWordBoundary(text, frontCap);
    if (rest.length <= backCap) {
      return {
        front: head,
        back: rest,
        fontSize: size,
        defaultFontSize: caps.defaultFontSize,
        backTruncated: false,
      };
    }
  }

  const floor = caps.floorFontSize;
  const ratio = caps.defaultFontSize / floor;
  const frontCap = Math.floor(caps.frontCap * ratio);
  const backCap = Math.floor(caps.backCap * ratio);
  const { head, rest } = splitAtWordBoundary(text, frontCap);
  const cappedBack = truncateAtWordBoundary(rest, backCap);
  return {
    front: head,
    back: cappedBack,
    fontSize: floor,
    defaultFontSize: caps.defaultFontSize,
    backTruncated: true,
  };
}

function enumerateSizes(caps: SplitCaps): number[] {
  const sizes: number[] = [];
  for (
    let s = caps.defaultFontSize;
    s >= caps.floorFontSize - 1e-9;
    s -= caps.step
  ) {
    sizes.push(Number(s.toFixed(2)));
  }
  return sizes;
}

function splitAtWordBoundary(
  text: string,
  cap: number,
): { head: string; rest: string } {
  if (text.length <= cap) return { head: text, rest: '' };
  const slice = text.slice(0, cap);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > cap * 0.8) {
    return {
      head: slice.slice(0, lastSpace).trimEnd(),
      rest: text.slice(lastSpace + 1).trimStart(),
    };
  }
  return { head: slice, rest: text.slice(cap) };
}

function truncateAtWordBoundary(text: string, cap: number): string {
  if (text.length <= cap) return text;
  const slice = text.slice(0, cap);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > cap * 0.8 ? slice.slice(0, lastSpace) : slice;
  return cut.trimEnd() + '…';
}
