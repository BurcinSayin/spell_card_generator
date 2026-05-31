import type { Layout } from '../store/selectionStore';

const STYLE_ID = 'print-page-rule';

export function printCards(layout: Layout): void {
  const orientation = layout === 'portrait-4' ? 'portrait' : 'landscape';
  document.getElementById(STYLE_ID)?.remove();
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `@page { size: A4 ${orientation}; margin: 0; }`;
  document.head.appendChild(styleEl);

  const cleanup = (): void => {
    styleEl.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}
