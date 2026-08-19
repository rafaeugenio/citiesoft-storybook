/**
 * Paletas categóricas de visualização de dados.
 *
 * Ficam na fundação, ao lado de `tokens.css`, porque não pertencem a nenhum
 * componente: quem consome é tanto um organismo (`Chart`) quanto uma molécula
 * (`MeterGroup`). Mantê-las dentro do gráfico criava uma aresta de import da
 * molécula para o organismo, na contramão do Atomic Design.
 */

/** Ordem oficial da spec. Nunca pular cor, nunca reatribuir entre telas. */
export const PALETA_OFICIAL = [
  'var(--citie-chart-cat-1)',
  'var(--citie-chart-cat-2)',
  'var(--citie-chart-cat-3)',
  'var(--citie-chart-cat-4)',
  'var(--citie-chart-cat-5)',
  'var(--citie-chart-cat-6)',
  'var(--citie-chart-cat-7)',
  'var(--citie-chart-cat-8)',
];

/** Proposta aprovada na validação de daltonismo e contraste. */
export const PALETA_PROPOSTA = [
  'var(--citie-chart-alt-1)',
  'var(--citie-chart-alt-2)',
  'var(--citie-chart-alt-3)',
  'var(--citie-chart-alt-4)',
  'var(--citie-chart-alt-5)',
  'var(--citie-chart-alt-6)',
];
