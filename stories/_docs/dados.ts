import dados from '@/tokens/citiesoft.tokens.json';

/** Token resolvido pelo `npm run gerar-tokens`. `declarado` mostra de onde o valor vem. */
export interface Token {
  nome: string;
  tipo: 'color' | 'text';
  declarado: string;
  claro: string;
  bruto?: string;
  escuro?: string;
  declaradoEscuro?: string;
}

export const tokens = dados.tokens as Token[];

const porNome = new Map(tokens.map((t) => [t.nome, t]));

export const token = (nome: string): Token | undefined => porNome.get(nome);

/** Valor de um token em um modo; no escuro, cai no valor claro quando o tema não sobrescreve. */
export const valor = (t: Token, modo: 'claro' | 'escuro') => (modo === 'escuro' ? (t.escuro ?? t.claro) : t.claro);

export const comPrefixo = (...prefixos: string[]) => tokens.filter((t) => prefixos.some((p) => t.nome.startsWith(p)));

/** Famílias da paleta primitiva. `accent` é um alias de `blue` pensado para a cor de ação. */
export const FAMILIAS = [
  'accent', 'blue', 'neutral', 'slate', 'gray', 'zinc', 'stone', 'mauve', 'olive', 'mist', 'taupe',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'indigo',
  'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const;

export const ehPrimitiva = (nome: string) =>
  new RegExp(`^--color-(${FAMILIAS.join('|')})-\\d+$`).test(nome) || nome === '--color-white' || nome === '--color-black';

/** Nome do token como classe Tailwind e como uso em CSS puro. */
export const comoCss = (nome: string) => `var(${nome})`;
