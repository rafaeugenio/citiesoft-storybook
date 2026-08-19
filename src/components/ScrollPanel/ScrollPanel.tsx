import type { ReactNode } from 'react';
import './ScrollPanel.css';

/**
 * ScrollPanel — página do Figma CitieOne `6738:49737` (❖ ScrollPanel).
 *
 * Variantes do arquivo respeitadas:
 * - `scrollpanel` · Type = Default | Custom Bar → `variante` `'padrao' | 'personalizada'`
 *   (no Figma a barra Custom vem azul; aqui a cor sai de `--citie-brand-primary`).
 * - `scrollpanel-bar` · Focus = False | True → estado de foco da região rolável,
 *   que acende o anel e destaca a barra.
 *
 * O eixo horizontal não existe como variante no Figma, mas o `p-scrollpanel`
 * equivalente do PrimeNG rola nos dois eixos, então `orientacao` cobre os três casos.
 *
 * A rolagem é a nativa do navegador, apenas estilizada por `scrollbar-*` e
 * `::-webkit-scrollbar`. Reimplementar rolagem em JavaScript quebraria teclado,
 * toque e leitor de tela.
 */

export type OrientacaoScrollPanel = 'vertical' | 'horizontal' | 'ambas';
export type VarianteScrollPanel = 'padrao' | 'personalizada';

export interface ScrollPanelProps {
  children: ReactNode;
  /**
   * Nome acessível da região rolável. Obrigatório: sem ele o leitor de tela
   * anuncia só "região" e o gate de acessibilidade reprova.
   */
  rotulo: string;
  orientacao?: OrientacaoScrollPanel;
  variante?: VarianteScrollPanel;
  /** Altura do painel. Precisa ser fixa para haver o que rolar no eixo vertical. */
  altura?: string;
  /** Largura do painel. Só faz diferença no eixo horizontal. */
  largura?: string;
}

export function ScrollPanel({
  children,
  rotulo,
  orientacao = 'vertical',
  variante = 'padrao',
  altura = '260px',
  largura,
}: ScrollPanelProps) {
  const classes = [
    'citie-scrollpanel',
    `citie-scrollpanel--${orientacao}`,
    `citie-scrollpanel--${variante}`,
  ].join(' ');

  return (
    <div
      className={classes}
      // A região precisa ser focável para quem navega por teclado conseguir rolar.
      tabIndex={0}
      role="region"
      aria-label={rotulo}
      style={{ height: orientacao === 'horizontal' ? undefined : altura, width: largura }}
    >
      <div className="citie-scrollpanel__conteudo">{children}</div>
    </div>
  );
}
