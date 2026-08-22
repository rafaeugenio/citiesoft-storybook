import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import './HoverCard.css';

/**
 * HoverCard: mini painel de dados ancorado ao ponteiro ou ao foco.
 *
 * Fecha a lacuna nº 2 do mapa do TFD: o protótipo entrega painel de pares
 * rótulo e valor em cinco células de tabela diferentes, e o `Tooltip` aceita
 * apenas `conteudo: string`, o que exclui qualquer estrutura.
 *
 * Divisão de trabalho na família de overlay:
 * - `Tooltip`: texto corrido de até 2 linhas, para explicar sigla ou ícone.
 * - `HoverCard`: dados estruturados só de leitura, em pares rótulo e valor.
 * - `Popover` e `ConfirmPopup`: conteúdo interativo, controlado por clique.
 *
 * Decisões de comportamento:
 * - abre com atraso maior do que fecha. Abrir instantâneo faz o painel piscar
 *   quando o ponteiro só está cruzando a célula; fechar com uma folga curta é
 *   o que permite atravessar a lacuna até dentro do painel, onde dá para
 *   selecionar e copiar um número de processo;
 * - por teclado abre no foco sem atraso, fecha no `Escape` e no blur, e o
 *   conteúdo é anunciado via `aria-describedby` no gatilho (WCAG 2.1.1 e
 *   1.4.13: alcançável, dispensável e persistente);
 * - o painel sobe para a top layer do navegador pela API nativa de `popover`.
 *   Lá ele fica acima de qualquer `z-index` da árvore comum, fora do `overflow`
 *   da tabela e acima do backdrop de um `Dialog` modal, que vive na mesma top
 *   layer e cede a vez a quem abre depois. A top layer sozinha resolve pintura
 *   e recorte, e o portal sozinho não resolveria nenhum dos dois: sem `popover`
 *   o painel portalizado para fora do modal fica atrás do backdrop, e o
 *   portalizado para dentro dele é recortado pelo `overflow: auto` que a folha
 *   do navegador dá ao `dialog`;
 * - o portal existe por outro motivo, e é de marcação: o painel é conteúdo em
 *   fluxo (`div` com `dl` dentro), e o gatilho costuma viver dentro de um `p`
 *   ("Solicitante: fulano") ou de uma célula de tabela. Nascer ao lado do
 *   gatilho poria fluxo dentro de texto, que é inválido por especificação e que
 *   o navegador desfaz ao reabrir marcação vinda do servidor. O alvo é o
 *   `dialog[open]` ancestral, quando houver, porque modal deixa inerte tudo o
 *   que está fora dele, inclusive na top layer; na ausência de modal, o
 *   contêiner de tema (`[data-theme]`), de onde os tokens chegam por herança;
 * - perto da borda da janela ele vira para o outro lado e desliza na
 *   horizontal até caber, sem nunca sair da área visível.
 */

export interface ItemHoverCard {
  /** Nome curto do dado ("CID", "Município", "Última atualização"). */
  rotulo: string;
  valor: ReactNode;
  /** Valor em Red Hat Mono: número de processo, código, CID. */
  mono?: boolean;
  /** Trecho longo (observação, justificativa) truncado em 3 linhas. */
  truncar?: boolean;
}

export interface SecaoHoverCard {
  /** Nome da seção, quando o painel tiver mais de um assunto. */
  titulo?: string;
  itens: ItemHoverCard[];
}

export type PosicaoHoverCard = 'top' | 'bottom';

export interface HoverCardProps {
  /** Nome do objeto que o painel detalha ("Maria da Conceição Santos"). */
  titulo?: string;
  /** Seções de pares rótulo e valor, com divisor entre seções. */
  secoes: SecaoHoverCard[];
  /** Lado preferido. Se não couber, o painel vira para o outro sozinho. */
  posicao?: PosicaoHoverCard;
  /**
   * Atraso de abertura no ponteiro, em ms. Maior que o de fechamento de
   * propósito: abrir é decisão do usuário, fechar não pode atrapalhar o
   * caminho do ponteiro até o painel.
   */
  atrasoAbertura?: number;
  atrasoFechamento?: number;
  /** Gatilho focável por teclado. O painel em si nunca recebe foco. */
  children: ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }>;
}

interface PosicionamentoPainel {
  top: number;
  left: number;
  lado: PosicaoHoverCard;
}

export function HoverCard({
  titulo,
  secoes,
  posicao = 'bottom',
  atrasoAbertura = 300,
  atrasoFechamento = 150,
  children,
}: HoverCardProps) {
  const [aberto, setAberto] = useState(false);
  const [posicionamento, setPosicionamento] = useState<PosicionamentoPainel | null>(null);
  const [alvoDoPortal, setAlvoDoPortal] = useState<HTMLElement | null>(null);
  /**
   * Vira `false` na primeira vez que a subida para a top layer falhar, seja por
   * a API não existir, seja por ela recusar. A folha do navegador esconde
   * `[popover]` que esteja fora da top layer, então nesse caso o atributo sai
   * do painel e ele volta a ser camada comum, com o `z-index` da família de
   * overlay.
   */
  const [naTopLayer, setNaTopLayer] = useState(true);

  const id = useId();
  const ancoraRef = useRef<HTMLSpanElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const timerAbrirRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timerFecharRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timerAbrirRef.current);
      clearTimeout(timerFecharRef.current);
    },
    [],
  );

  /**
   * O painel é um `dl` dentro de um `div`, ou seja, conteúdo em fluxo, e o
   * gatilho vive com frequência dentro de um `p` ("Solicitante: fulano") ou de
   * uma célula de tabela. Nascer ao lado do gatilho poria conteúdo em fluxo
   * dentro de conteúdo em texto, que é marcação inválida por especificação. O
   * portal tira o painel dali antes de a pergunta se colocar.
   *
   * O alvo é resolvido a cada abertura, porque o `[open]` do diálogo é
   * dinâmico. Diálogo modal deixa inerte tudo o que está fora dele, inclusive
   * quem está na top layer, então um painel portalizado para fora do modal
   * seria visível e não apontável. Estando dentro, herda os tokens do mesmo
   * jeito, porque o diálogo também vive sob o contêiner de tema.
   */
  const resolverAlvoDoPortal = () => {
    const ancora = ancoraRef.current;
    return (ancora?.closest<HTMLElement>('dialog[open]') ??
      ancora?.closest<HTMLElement>('[data-theme]') ??
      document.body) as HTMLElement;
  };

  const abrir = () => {
    setAlvoDoPortal(resolverAlvoDoPortal());
    setAberto(true);
  };

  const agendarAbertura = () => {
    clearTimeout(timerFecharRef.current);
    if (aberto) return;
    clearTimeout(timerAbrirRef.current);
    timerAbrirRef.current = setTimeout(abrir, atrasoAbertura);
  };

  const agendarFechamento = () => {
    clearTimeout(timerAbrirRef.current);
    clearTimeout(timerFecharRef.current);
    timerFecharRef.current = setTimeout(() => setAberto(false), atrasoFechamento);
  };

  const cancelarFechamento = () => {
    clearTimeout(timerFecharRef.current);
  };

  const abrirAgora = () => {
    clearTimeout(timerFecharRef.current);
    abrir();
  };

  const fecharAgora = useCallback(() => {
    clearTimeout(timerAbrirRef.current);
    clearTimeout(timerFecharRef.current);
    setAberto(false);
  }, []);

  // Escape fecha de qualquer lugar enquanto o painel existir, inclusive com o
  // foco longe do gatilho: é o "dispensável" da WCAG 1.4.13. O preventDefault
  // consome a tecla em camadas: com o painel aberto dentro de um diálogo
  // modal, o primeiro Escape fecha só o painel e o diálogo segue aberto.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (evento: globalThis.KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        fecharAgora();
      }
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, fecharAgora]);

  // Sobe o painel para a top layer, mede e posiciona antes da pintura, e
  // acompanha rolagem e redimensionamento enquanto aberto.
  useLayoutEffect(() => {
    if (!aberto) {
      setPosicionamento(null);
      return;
    }

    /**
     * `popover` deixa o painel na top layer do navegador, o mesmo plano onde o
     * `dialog` modal vive, e a ordem lá é de chegada: quem abre por último
     * pinta por cima. Sem isso o painel aberto de dentro de um `Dialog` nasce
     * atrás do backdrop, escurecido e fora do alcance do ponteiro, e ainda é
     * recortado pelo `overflow: auto` que a folha do navegador dá ao `dialog`.
     * A top layer também é o que tira o painel do `overflow` da tabela, e vale
     * para o painel portalizado tanto quanto para qualquer outro.
     */
    const painelParaAbrir = painelRef.current;
    if (naTopLayer && painelParaAbrir) {
      try {
        painelParaAbrir.showPopover();
      } catch {
        /**
         * Uma saída só para qualquer causa de falha, API ausente ou subida
         * recusada, porque as duas terminam no mesmo lugar: a folha do
         * navegador esconde `[popover]` que esteja fora da top layer, e sem
         * tirar o atributo sobraria um elemento de 0 por 0 no lugar do painel.
         * Sem o atributo ele volta a ser camada comum, com o `z-index` da
         * família de overlay e as limitações antigas de `overflow` e de modal,
         * e nunca sem painel nenhum.
         */
        setNaTopLayer(false);
      }
    }

    const posicionar = () => {
      const ancora = ancoraRef.current;
      const painel = painelRef.current;
      if (!ancora || !painel) return;

      // A folga entre gatilho e painel é o token de espaçamento, lido do CSS
      // para o posicionamento em JS não carregar número próprio.
      const folga =
        parseFloat(getComputedStyle(ancora).getPropertyValue('--citie-spacing-2')) || 0;

      /**
       * `position: fixed` costuma resolver contra a viewport, mas qualquer
       * ancestral com `transform`, `translate`, `filter` ou `contain` vira
       * bloco de contenção e passa a ser a origem. Na top layer a origem é
       * sempre a viewport, e sem suporte a popover o painel fica sujeito ao
       * ancestral, como acontece dentro do `Dialog`, que entra com `translate`
       * animado. Em vez de adivinhar a lista de propriedades que criam
       * contenção, a origem é medida: com o painel em 0,0, a caixa dele é a
       * própria origem.
       */
      const topEscrito = painel.style.top;
      const leftEscrito = painel.style.left;
      painel.style.top = '0px';
      painel.style.left = '0px';
      const caixaPainel = painel.getBoundingClientRect();
      const origem = { top: caixaPainel.top, left: caixaPainel.left };
      // Devolve o que o React escreveu antes de sair daqui. Sem isso, uma
      // remedição que chegue ao mesmo resultado não muda a prop de estilo, o
      // React não reescreve o atributo por já acreditar nele, e o painel fica
      // com o 0,0 da medição no lugar da posição calculada.
      painel.style.top = topEscrito;
      painel.style.left = leftEscrito;

      const caixaAncora = ancora.getBoundingClientRect();
      const larguraJanela = document.documentElement.clientWidth;
      const alturaJanela = document.documentElement.clientHeight;

      const cabeAbaixo = caixaAncora.bottom + folga + caixaPainel.height <= alturaJanela - folga;
      const cabeAcima = caixaAncora.top - folga - caixaPainel.height >= folga;
      const lado: PosicaoHoverCard =
        posicao === 'bottom'
          ? cabeAbaixo || !cabeAcima
            ? 'bottom'
            : 'top'
          : cabeAcima || !cabeAbaixo
            ? 'top'
            : 'bottom';

      const top =
        lado === 'bottom'
          ? caixaAncora.bottom + folga
          : caixaAncora.top - folga - caixaPainel.height;
      // Centrado no gatilho e deslizado até caber, nunca fora da janela.
      const left = Math.min(
        Math.max(caixaAncora.left + caixaAncora.width / 2 - caixaPainel.width / 2, folga),
        Math.max(larguraJanela - caixaPainel.width - folga, folga),
      );

      // Guardado já em coordenada da origem do painel, para o valor poder ir
      // direto para o `style` sem uma segunda conversão.
      setPosicionamento({ top: top - origem.top, left: left - origem.left, lado });
    };

    posicionar();
    window.addEventListener('scroll', posicionar, true);
    window.addEventListener('resize', posicionar);
    // A própria entrada do painel desloca a caixa por alguns pixels enquanto
    // roda, então a medida final é refeita quando ela termina.
    const painelAberto = painelRef.current;
    painelAberto?.addEventListener('animationend', posicionar);
    return () => {
      window.removeEventListener('scroll', posicionar, true);
      window.removeEventListener('resize', posicionar);
      painelAberto?.removeEventListener('animationend', posicionar);
    };
  }, [aberto, posicao, naTopLayer]);

  const gatilho = cloneElement(children, {
    // Associação explícita: o leitor de tela anuncia o conteúdo do painel
    // junto do gatilho enquanto ele estiver aberto.
    'aria-describedby': aberto ? id : undefined,
    onMouseEnter: agendarAbertura,
    onMouseLeave: agendarFechamento,
    // Por teclado abre no foco sem atraso: quem chegou por Tab já decidiu.
    onFocus: abrirAgora,
    onBlur: fecharAgora,
  });

  const painel = aberto ? (
    <div
      id={id}
      ref={painelRef}
      role="tooltip"
      // Modo manual: nada de fechamento por clique fora nem de Escape do
      // navegador, que fecharia o painel e o diálogo de uma vez só. Quem
      // controla o Escape é o ouvinte acima, em camadas.
      popover={naTopLayer ? 'manual' : undefined}
      className={`citie-hover-card citie-hover-card--${posicionamento?.lado ?? posicao}`}
      style={{
        top: posicionamento?.top ?? 0,
        left: posicionamento?.left ?? 0,
        // Invisível só até a primeira medição, para não piscar no canto.
        visibility: posicionamento ? undefined : 'hidden',
      }}
      onMouseEnter={cancelarFechamento}
      onMouseLeave={agendarFechamento}
    >
      {titulo ? <p className="citie-hover-card__titulo">{titulo}</p> : null}
      {secoes.map((secao, indice) => (
        <div className="citie-hover-card__secao" key={secao.titulo ?? indice}>
          {secao.titulo ? <p className="citie-hover-card__secao-titulo">{secao.titulo}</p> : null}
          <dl className="citie-hover-card__itens">
            {secao.itens.map((item) => (
              <div className="citie-hover-card__item" key={item.rotulo}>
                <dt className="citie-hover-card__rotulo">{item.rotulo}</dt>
                <dd
                  className={[
                    'citie-hover-card__valor',
                    item.mono ? 'citie-hover-card__valor--mono' : null,
                    item.truncar ? 'citie-hover-card__valor--truncado' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <span className="citie-hover-card-anchor" ref={ancoraRef}>
      {gatilho}
      {painel && alvoDoPortal ? createPortal(painel, alvoDoPortal) : null}
    </span>
  );
}
