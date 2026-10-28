/** Contraste WCAG 2.x entre dois hex de 6 dígitos. Usado para medir os pares da marca em tempo de render. */
function luminancia(hex: string): number {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contraste(a: string, b: string): number {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export const razao = (n: number) => `${n.toFixed(2).replace('.', ',')}:1`;

const ok = (n: number, minimo: number) => (n >= minimo ? 'Passa' : 'Falha');

/** [texto ou elemento, fundo, o que a fonte afirma] */
const PARES: [string, string, string][] = [
  ['#FAFAFA', '#146BFA', '4,69:1'],
  ['#FAFAFA', '#1261E4', '5,48:1'],
  ['#FAFAFA', '#0E4DB8', '7,03 a 7,45:1'],
  ['#FAFAFA', '#0B3C8F', '9,01 a 9,52:1'],
  ['#FAFAFA', '#0A2F6E', '11,4:1'],
  ['#FAFAFA', '#061D45', '14,1 a 14,2:1'],
  ['#146BFA', '#FAFAFA', '4,69:1'],
  ['#1261E4', '#FAFAFA', '5,48:1'],
  ['#4D8BFC', '#FAFAFA', '3,07:1'],
  ['#84AEFD', '#FAFAFA', '1,97:1'],
  ['#1261E4', '#EFF5FF', '4,84:1'],
  ['#3C3C3C', '#FAFAFA', '10,6:1'],
  ['#202020', '#FAFAFA', '16,0:1'],
  ['#3C3C3C', '#EFF5FF', '9,74:1'],
  ['#71717A', '#FAFAFA', '4,60:1'],
  ['#A1A1AA', '#FAFAFA', '2,64:1'],
  ['#16A34A', '#FAFAFA', '5,08:1'],
  ['#D97706', '#FAFAFA', '3,02:1'],
  ['#DC2626', '#FAFAFA', '4,51:1'],
  ['#16A34A', '#F0FDF4', 'cerca de 5,1:1'],
  ['#D97706', '#FFFBEB', 'sem valor'],
  ['#DC2626', '#FEF2F2', 'cerca de 5,2:1'],
  ['#00B5F0', '#FAFAFA', '2,34:1'],
  ['#0097CC', '#FAFAFA', '3,55:1'],
  ['#FAFAFA', '#00B5F0', 'sem valor'],
];

/** Linhas da tabela de contraste medido. */
export const linhasContraste: string[][] = PARES.map(([texto, fundo, fonte]) => {
  const n = contraste(texto, fundo);
  return [`\`${texto}\` sobre \`${fundo}\``, razao(n), ok(n, 4.5), ok(n, 3), fonte];
});
