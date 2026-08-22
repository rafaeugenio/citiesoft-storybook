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
  /**
   * Recorte que os indicadores estão exibindo, como `Maio a julho de 2026`.
   *
   * Quando ele muda, a faixa anuncia **uma vez** que os números foram
   * atualizados. Existe porque a justificativa do valor em transição é que
   * trocar o período muda vários indicadores ao mesmo tempo e o operador
   * precisa perceber isso: quem enxerga percebe pelo movimento, e quem usa
   * leitor de tela não perceberia nada, porque texto que muda fora de uma
   * região viva não é anunciado. Atende a WCAG 2.2 4.1.3 Status Messages.
   *
   * O anúncio é do lote, e não de cada widget: oito regiões vivas disparando
   * juntas produziriam oito falas sobrepostas, que é pior do que o silêncio.
   */
  recorte?: string;
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
export function KpiFaixa({
  titulo,
  tituloVisivel = false,
  recorte,
  children,
}: KpiFaixaProps) {
  const idDoTitulo = useId();

  return (
    <section className="citie-kpi-faixa">
      {/*
        Região viva única da faixa. `polite` para esperar o leitor de tela
        terminar o que está falando, porque atualização de indicador não
        interrompe leitura em curso. `atomic` para a frase ser lida inteira, e
        não apenas o pedaço que mudou.
      */}
      {recorte ? (
        <p className="citie-visualmente-oculto" role="status" aria-live="polite" aria-atomic="true">
          {/*
            A frase não flexiona com o título. A versão anterior montava
            `${titulo} atualizados para ...`, com o particípio fixo no plural
            masculino, enquanto o título é livre e no catálogo costuma ser
            singular, o que produzia "Resumo da fila atualizados para". Aqui o
            título entra como aposto e o verbo concorda com "indicadores", que é
            invariável nesta frase.
          */}
          {`Indicadores atualizados para ${recorte}. Faixa: ${titulo}.`}
        </p>
      ) : null}

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
