import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

interface MedidaDoRealce {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

/**
 * Mede a posição do item ativo dentro de um trilho, para o realce único que
 * desliza entre segmentos (SelectButton, Tabs, e o próximo consumidor que a
 * triagem previu, Sidebar). O trilho precisa de `position: relative`; cada item
 * candidato declara `data-realce-id`.
 *
 * A medida sai numa única forma de aplicar: o objeto `estilo`, com as quatro
 * variáveis `--citie-realce-x/y/largura/altura`, vai direto no `style` do
 * elemento de realce, e o CSS de cada consumidor decide a forma (pílula cheia,
 * sublinhado, barra lateral) consumindo só as variáveis de que precisa. Um
 * consumidor novo não escolhe plumbing: aplica `estilo` e escreve CSS.
 *
 * Por que medir com `getBoundingClientRect` e não com `offsetLeft`: o rect
 * devolve a posição no mesmo sistema do trilho, e a subtração de
 * `clientLeft`/`clientTop` desconta a borda do trilho, que é exatamente a
 * origem do posicionamento absoluto do realce. `offsetLeft` depende de qual
 * ancestral vira `offsetParent` e diverge entre navegadores quando o trilho
 * tem borda. Largura e altura também saem do rect: são fracionárias, e o
 * arredondamento de `offsetWidth` deixaria o realce até 1px fora do item.
 *
 * A primeira renderização não anima de propósito: a medida nasce `null`, o
 * realce só entra no DOM depois do `useLayoutEffect`, que roda antes da
 * primeira pintura. O navegador nunca pinta o realce fora do lugar, então não
 * existe quadro inicial do qual deslizar.
 *
 * Dois observadores mantêm a medida verdadeira depois da montagem: o
 * `ResizeObserver` cobre mudança de tamanho do trilho ou de um item (fonte que
 * termina de carregar, contêiner redimensionado), e o `MutationObserver` cobre
 * item que entra ou sai do trilho em runtime com a mesma chave ativa, caso em
 * que o item novo precisa entrar no observador de tamanho e a posição do ativo
 * pode ter mudado. Os itens são filhos diretos do trilho nos consumidores
 * atuais, então `childList` sem `subtree` basta.
 */
export function useRealceDeslizante<T extends HTMLElement>(chaveAtiva: string | null) {
  const trilhoRef = useRef<T>(null);
  const [medida, setMedida] = useState<MedidaDoRealce | null>(null);

  useLayoutEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho || chaveAtiva === null) {
      setMedida(null);
      return;
    }

    const medir = () => {
      const itens = Array.from(trilho.querySelectorAll<HTMLElement>('[data-realce-id]'));
      const alvo = itens.find((item) => item.dataset.realceId === chaveAtiva);
      if (!alvo) {
        setMedida(null);
        return;
      }
      const caixaDoTrilho = trilho.getBoundingClientRect();
      const caixaDoAlvo = alvo.getBoundingClientRect();
      setMedida({
        x: caixaDoAlvo.left - caixaDoTrilho.left - trilho.clientLeft,
        y: caixaDoAlvo.top - caixaDoTrilho.top - trilho.clientTop,
        largura: caixaDoAlvo.width,
        altura: caixaDoAlvo.height,
      });
    };

    const redimensionamento = new ResizeObserver(medir);

    const observarItens = () => {
      redimensionamento.disconnect();
      redimensionamento.observe(trilho);
      trilho
        .querySelectorAll<HTMLElement>('[data-realce-id]')
        .forEach((item) => redimensionamento.observe(item));
      medir();
    };

    observarItens();

    const mutacao = new MutationObserver(observarItens);
    mutacao.observe(trilho, { childList: true });

    return () => {
      redimensionamento.disconnect();
      mutacao.disconnect();
    };
  }, [chaveAtiva]);

  const estilo = medida
    ? ({
        '--citie-realce-x': `${medida.x}px`,
        '--citie-realce-y': `${medida.y}px`,
        '--citie-realce-largura': `${medida.largura}px`,
        '--citie-realce-altura': `${medida.altura}px`,
      } as CSSProperties)
    : null;

  return { trilhoRef, estilo };
}
