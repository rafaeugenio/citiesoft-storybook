import { Children, useId, type ReactNode } from 'react';
import './KpiFaixa.css';

export interface KpiFaixaProps {
  /**
   * Nome da faixa. Vira o rótulo acessível da lista de indicadores, para que
   * quem navega por leitor de tela saiba a que fila os números pertencem.
   */
  titulo: string;
  /**
   * Mostra o título acima da faixa. Por padrão ele existe só para o leitor de
   * tela, porque na tela de listagem a faixa vem logo abaixo do título da
   * página e repetir o assunto rouba linha de conteúdo.
   */
  tituloVisivel?: boolean;
  /** De 3 a 8 `KpiWidget`. Cada um vira um item da lista. */
  children: ReactNode;
}

/**
 * Faixa de indicadores: de 3 a 8 KPIs como uma linha tipográfica única, dentro
 * de um contêiner só, em vez de cards soltos em grade.
 *
 * É o que dá a leitura de painel de fila. O divisor entre indicadores é de 1px
 * e nasce da borda da célula, ou seja, é decoração de CSS e nunca entra na
 * árvore de acessibilidade. Abaixo de 768px a faixa empilha e o divisor vira
 * horizontal.
 */
export function KpiFaixa({ titulo, tituloVisivel = false, children }: KpiFaixaProps) {
  const idDoTitulo = useId();

  return (
    <section className="citie-kpi-faixa">
      {tituloVisivel ? (
        <p className="citie-kpi-faixa__titulo" id={idDoTitulo}>
          {titulo}
        </p>
      ) : null}

      <ul
        className="citie-kpi-faixa__lista"
        role="list"
        aria-label={tituloVisivel ? undefined : titulo}
        aria-labelledby={tituloVisivel ? idDoTitulo : undefined}
      >
        {Children.map(children, (filho) =>
          filho == null ? null : <li className="citie-kpi-faixa__celula">{filho}</li>,
        )}
      </ul>
    </section>
  );
}
