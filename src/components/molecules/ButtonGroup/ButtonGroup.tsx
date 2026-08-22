import type { ReactNode } from 'react';
import './ButtonGroup.css';

/**
 * ButtonGroup: botões emendados como um objeto único.
 *
 * Serve para ações irmãs do mesmo nível que formam uma família ("Dia",
 * "Semana", "Mês" como disparos; paginação manual; zoom). A emenda comunica
 * a irmandade: cantos só nas extremidades e uma borda por junção, nunca duas.
 *
 * O grupo compõe o `Button` que já existe, sem alterá-lo: os filhos são
 * `<Button>` comuns e o CSS do grupo resolve as junções por seletor de
 * vizinhança. Hover, foco e pressão continuam sendo os do próprio Button; a
 * peça em foco ou sob o ponteiro sobe um plano para a borda dela vencer a
 * junção compartilhada.
 */

export type OrientacaoButtonGroup = 'horizontal' | 'vertical';

export interface ButtonGroupProps {
  /**
   * Nome acessível do grupo ("Período do painel", "Zoom do mapa"). O leitor
   * de tela anuncia o nome ao entrar no primeiro botão, o que dá o contexto
   * que a emenda visual dá para quem enxerga.
   */
  rotulo: string;
  orientacao?: OrientacaoButtonGroup;
  /** `<Button>` do catálogo, dois ou mais, todos do mesmo tamanho. */
  children: ReactNode;
}

export function ButtonGroup({ rotulo, orientacao = 'horizontal', children }: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={rotulo}
      className={`citie-button-group citie-button-group--${orientacao}`}
    >
      {children}
    </div>
  );
}
