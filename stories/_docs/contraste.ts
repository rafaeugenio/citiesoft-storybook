/** Razão de contraste WCAG 2.x entre duas cores hex (#rrggbb; o alfa é ignorado). */
const canal = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminancia = (hex: string) => {
  const h = hex.replace('#', '').slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
};

export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export type NivelContraste = 'AAA' | 'AA' | 'AA grande' | 'reprova';

export function nivel(razao: number): NivelContraste {
  if (razao >= 7) return 'AAA';
  if (razao >= 4.5) return 'AA';
  if (razao >= 3) return 'AA grande';
  return 'reprova';
}
