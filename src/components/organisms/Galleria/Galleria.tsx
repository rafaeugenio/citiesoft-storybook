import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import './Galleria.css';

/**
 * Mesmo padrão de `Overlay.tsx`: um efeito mantém o atributo `open` do `dialog`
 * em sincronia com o estado do React, nos dois sentidos.
 */
function useDialogModal(aberto: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  return ref;
}

/**
 * Galleria — página do Figma CitieOne `6738:54005` (seção Mídia).
 * Equivalente PrimeNG: `p-galleria`.
 *
 * Variantes do arquivo respeitadas:
 * - `galleria`: Thumbnail (True/False) × Thumbnail Location (Bottom/Top/Left/Right),
 *   Indicator (True/False) × Indicator Location (Bottom/Top/Left/Right).
 * - `galleria-item`: Navigator (True/False), Show Caption, Inset Indicator +
 *   Inset Indicator Location.
 * - `galleria-thumbnails` e `galleria-indicator-list`: Orientation Horizontal/Vertical.
 * - `galleria-nav-button`, `galleria-thumbnail-nav-button`,
 *   `galleria-indicator-button`, `galleria-close-button`: estados Idle/Hover/Active
 *   e Focus, aqui expressos por `:hover`, `aria-current` e `:focus-visible`.
 *
 * Cor vem sempre dos tokens da marca, nunca do arquivo do Figma.
 */

export interface ItemGalleria {
  id: string;
  /**
   * Descrição real do que a imagem mostra ("Fachada do prédio com fissura na
   * viga central"). Nunca vazio e nunca "imagem": é o único conteúdo que o
   * leitor de tela recebe.
   */
  alt: string;
  /** Título curto sobreposto à imagem quando `mostrarLegenda` está ligado. */
  legenda?: string;
  /** Complemento da legenda: data, autor, local. */
  descricao?: string;
  /** URL da imagem. Quando ausente, `conteudo` é renderizado no lugar. */
  src?: string;
  /** Conteúdo próprio (SVG inline, canvas, placeholder) quando não há `src`. */
  conteudo?: ReactNode;
}

export type PosicaoMiniaturas = 'bottom' | 'top' | 'left' | 'right';
export type PosicaoIndicadores = 'bottom' | 'top' | 'left' | 'right';

export interface GalleriaProps {
  itens: ItemGalleria[];
  /** Nome acessível da galeria: "Anexos do processo 2025/0481". */
  rotulo: string;
  /** Índice controlado. Sem ele o componente cuida do próprio estado. */
  indice?: number;
  indiceInicial?: number;
  onIndiceChange?: (indice: number) => void;
  /** Tira de miniaturas. Corresponde a Thumbnail no Figma. */
  miniaturas?: boolean;
  posicaoMiniaturas?: PosicaoMiniaturas;
  /** Bolinhas de posição. Corresponde a Indicator no Figma. */
  indicadores?: boolean;
  posicaoIndicadores?: PosicaoIndicadores;
  /** Indicadores sobre a imagem (Inset Indicator). */
  indicadoresSobrepostos?: boolean;
  /** Setas anterior/próxima sobre a imagem (Navigator). */
  navegacao?: boolean;
  /** Legenda sobreposta ao rodapé da imagem (Show Caption). */
  mostrarLegenda?: boolean;
  /** Oferece o botão que abre a galeria em diálogo modal de tela cheia. */
  telaCheia?: boolean;
  /** Passar do último para o primeiro item, e vice-versa. */
  circular?: boolean;
}

function normalizarIndice(indice: number, total: number, circular: boolean) {
  if (total === 0) return 0;
  if (circular) return ((indice % total) + total) % total;
  return Math.min(Math.max(indice, 0), total - 1);
}

function IconeSeta({ direcao }: { direcao: 'anterior' | 'proximo' | 'acima' | 'abaixo' }) {
  const caminhos = {
    anterior: 'M15 5l-7 7 7 7',
    proximo: 'M9 5l7 7-7 7',
    acima: 'M5 15l7-7 7 7',
    abaixo: 'M5 9l7 7 7-7',
  };
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d={caminhos[direcao]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Renderiza a mídia do item. `decorativa` marca a cópia usada na miniatura. */
function Midia({
  item,
  className,
  decorativa = false,
}: {
  item: ItemGalleria;
  className: string;
  decorativa?: boolean;
}) {
  if (item.src) {
    return (
      <img
        className={className}
        src={item.src}
        alt={decorativa ? '' : item.alt}
        aria-hidden={decorativa || undefined}
      />
    );
  }

  return (
    <div
      className={className}
      role={decorativa ? undefined : 'img'}
      aria-label={decorativa ? undefined : item.alt}
      aria-hidden={decorativa || undefined}
    >
      {item.conteudo}
    </div>
  );
}

export function Galleria({
  itens,
  rotulo,
  indice: indiceControlado,
  indiceInicial = 0,
  onIndiceChange,
  miniaturas = true,
  posicaoMiniaturas = 'bottom',
  indicadores = false,
  posicaoIndicadores = 'bottom',
  indicadoresSobrepostos = false,
  navegacao = true,
  mostrarLegenda = false,
  telaCheia = false,
  circular = false,
}: GalleriaProps) {
  const total = itens.length;
  const [indiceInterno, setIndiceInterno] = useState(() =>
    normalizarIndice(indiceInicial, total, false),
  );
  const indice = normalizarIndice(indiceControlado ?? indiceInterno, total, false);

  const [telaCheiaAberta, setTelaCheiaAberta] = useState(false);
  const dialogRef = useDialogModal(telaCheiaAberta);
  const fecharTelaCheiaRef = useRef<HTMLButtonElement>(null);
  const origemFocoRef = useRef<HTMLElement | null>(null);

  const listaRef = useRef<HTMLUListElement>(null);
  const botoesRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [rolagem, setRolagem] = useState({ inicio: false, fim: false });

  const verticalMiniaturas = posicaoMiniaturas === 'left' || posicaoMiniaturas === 'right';

  const irPara = useCallback(
    (proximo: number) => {
      const novo = normalizarIndice(proximo, total, circular);
      if (indiceControlado === undefined) setIndiceInterno(novo);
      onIndiceChange?.(novo);
    },
    [circular, indiceControlado, onIndiceChange, total],
  );

  // Rolagem da tira: recalculada a cada scroll e a cada mudança de tamanho, para
  // saber se as setas da tira ainda têm para onde levar.
  const atualizarRolagem = useCallback(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const posicao = verticalMiniaturas ? lista.scrollTop : lista.scrollLeft;
    const comprimento = verticalMiniaturas ? lista.scrollHeight : lista.scrollWidth;
    const visivel = verticalMiniaturas ? lista.clientHeight : lista.clientWidth;
    setRolagem({ inicio: posicao > 1, fim: posicao + visivel < comprimento - 1 });
  }, [verticalMiniaturas]);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    atualizarRolagem();
    const observador = new ResizeObserver(atualizarRolagem);
    observador.observe(lista);
    return () => observador.disconnect();
  }, [atualizarRolagem, total, miniaturas]);

  // A miniatura ativa entra no campo visível pelo scroll da própria tira. Usar
  // `scrollIntoView` arrastaria a página de docs junto.
  useEffect(() => {
    const lista = listaRef.current;
    const alvo = botoesRef.current[indice];
    if (!lista || !alvo) return;

    const reduzido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduzido ? 'auto' : 'smooth';
    const inicio = verticalMiniaturas ? alvo.offsetTop : alvo.offsetLeft;
    const fim = inicio + (verticalMiniaturas ? alvo.offsetHeight : alvo.offsetWidth);
    const atual = verticalMiniaturas ? lista.scrollTop : lista.scrollLeft;
    const visivel = verticalMiniaturas ? lista.clientHeight : lista.clientWidth;

    if (inicio < atual) {
      lista.scrollTo(verticalMiniaturas ? { top: inicio, behavior } : { left: inicio, behavior });
    } else if (fim > atual + visivel) {
      const destino = fim - visivel;
      lista.scrollTo(verticalMiniaturas ? { top: destino, behavior } : { left: destino, behavior });
    }
  }, [indice, verticalMiniaturas]);

  const fecharTelaCheia = useCallback(() => setTelaCheiaAberta(false), []);

  useEffect(() => {
    if (!telaCheiaAberta) return;
    // `showModal` foca o primeiro elemento do diálogo; o fechar é o destino
    // esperado, e assim o foco já entra na top layer.
    fecharTelaCheiaRef.current?.focus();
  }, [telaCheiaAberta]);

  if (total === 0) {
    return (
      <div className="citie-galleria citie-galleria--vazia" role="group" aria-label={rotulo}>
        <p className="citie-galleria__vazio">Nenhuma imagem anexada.</p>
      </div>
    );
  }

  const atual = itens[indice];
  const noInicio = !circular && indice === 0;
  const noFim = !circular && indice === total - 1;
  const temLegenda = mostrarLegenda && Boolean(atual.legenda ?? atual.descricao);

  function aoTeclarNaTira(evento: KeyboardEvent<HTMLUListElement>) {
    const anterior = verticalMiniaturas ? 'ArrowUp' : 'ArrowLeft';
    const proximo = verticalMiniaturas ? 'ArrowDown' : 'ArrowRight';

    let destino: number | null = null;
    if (evento.key === anterior) destino = indice - 1;
    else if (evento.key === proximo) destino = indice + 1;
    else if (evento.key === 'Home') destino = 0;
    else if (evento.key === 'End') destino = total - 1;
    if (destino === null) return;

    evento.preventDefault();
    const novo = normalizarIndice(destino, total, circular);
    irPara(novo);
    botoesRef.current[novo]?.focus();
  }

  const listaIndicadores = (
    <ul
      className={`citie-galleria__indicadores citie-galleria__indicadores--${
        posicaoIndicadores === 'left' || posicaoIndicadores === 'right' ? 'vertical' : 'horizontal'
      }${indicadoresSobrepostos ? ' citie-galleria__indicadores--sobreposta' : ''}`}
    >
      {itens.map((item, posicao) => (
        <li key={item.id}>
          <button
            type="button"
            className="citie-galleria__indicador"
            aria-label={`Ir para a imagem ${posicao + 1} de ${total}: ${item.alt}`}
            aria-current={posicao === indice ? 'true' : undefined}
            onClick={() => irPara(posicao)}
          >
            <span className="citie-galleria__ponto" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );

  const conteudo = (
    <div
      className={`citie-galleria citie-galleria--tira-${posicaoMiniaturas}`}
      role="group"
      aria-roledescription="galeria de imagens"
      aria-label={rotulo}
    >
      <div className={`citie-galleria__principal citie-galleria__principal--ind-${posicaoIndicadores}`}>
        <div className="citie-galleria__palco">
          <Midia item={atual} className="citie-galleria__imagem" />

          {navegacao ? (
            <>
              <button
                type="button"
                className="citie-galleria__nav citie-galleria__nav--anterior"
                aria-label="Imagem anterior"
                disabled={noInicio}
                onClick={() => irPara(indice - 1)}
              >
                <IconeSeta direcao="anterior" />
              </button>
              <button
                type="button"
                className="citie-galleria__nav citie-galleria__nav--proxima"
                aria-label="Próxima imagem"
                disabled={noFim}
                onClick={() => irPara(indice + 1)}
              >
                <IconeSeta direcao="proximo" />
              </button>
            </>
          ) : null}

          {telaCheia ? (
            <button
              type="button"
              className="citie-galleria__expandir"
              aria-label="Ver em tela cheia"
              onClick={(evento) => {
                origemFocoRef.current = evento.currentTarget;
                setTelaCheiaAberta(true);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}

          {temLegenda ? (
            <div className="citie-galleria__legenda">
              {atual.legenda ? (
                <p className="citie-galleria__legenda-titulo">{atual.legenda}</p>
              ) : null}
              {atual.descricao ? (
                <p className="citie-galleria__legenda-descricao">{atual.descricao}</p>
              ) : null}
            </div>
          ) : null}

          {indicadores && indicadoresSobrepostos ? listaIndicadores : null}
        </div>

        {indicadores && !indicadoresSobrepostos ? listaIndicadores : null}
      </div>

      {miniaturas ? (
        <div
          className={`citie-galleria__tira citie-galleria__tira--${
            verticalMiniaturas ? 'vertical' : 'horizontal'
          }`}
        >
          {rolagem.inicio || rolagem.fim ? (
            <button
              type="button"
              className="citie-galleria__tira-nav"
              aria-label="Ver miniaturas anteriores"
              disabled={!rolagem.inicio}
              onClick={() => {
                const lista = listaRef.current;
                if (!lista) return;
                const passo = verticalMiniaturas ? -lista.clientHeight : -lista.clientWidth;
                lista.scrollBy(verticalMiniaturas ? { top: passo } : { left: passo });
              }}
            >
              <IconeSeta direcao={verticalMiniaturas ? 'acima' : 'anterior'} />
            </button>
          ) : null}

          <ul
            ref={listaRef}
            className="citie-galleria__miniaturas"
            onScroll={atualizarRolagem}
            onKeyDown={aoTeclarNaTira}
          >
            {itens.map((item, posicao) => {
              const ativa = posicao === indice;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    ref={(elemento) => {
                      botoesRef.current[posicao] = elemento;
                    }}
                    className="citie-galleria__miniatura"
                    aria-label={`Imagem ${posicao + 1} de ${total}: ${item.alt}`}
                    aria-current={ativa ? 'true' : undefined}
                    // Tabulação única na tira: as setas movem o foco entre as miniaturas.
                    tabIndex={ativa ? 0 : -1}
                    onClick={() => irPara(posicao)}
                  >
                    <Midia item={item} className="citie-galleria__miniatura-imagem" decorativa />
                  </button>
                </li>
              );
            })}
          </ul>

          {rolagem.inicio || rolagem.fim ? (
            <button
              type="button"
              className="citie-galleria__tira-nav"
              aria-label="Ver próximas miniaturas"
              disabled={!rolagem.fim}
              onClick={() => {
                const lista = listaRef.current;
                if (!lista) return;
                const passo = verticalMiniaturas ? lista.clientHeight : lista.clientWidth;
                lista.scrollBy(verticalMiniaturas ? { top: passo } : { left: passo });
              }}
            >
              <IconeSeta direcao={verticalMiniaturas ? 'abaixo' : 'proximo'} />
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="citie-visualmente-oculto" aria-live="polite">
        {`Imagem ${indice + 1} de ${total}: ${atual.alt}`}
      </p>
    </div>
  );

  return (
    <>
      {conteudo}

      {telaCheia ? (
        <dialog
          ref={dialogRef}
          className="citie-galleria__dialogo"
          aria-label={`${rotulo}, tela cheia`}
          // Escape: o `cancel` do navegador é interceptado e quem fecha é o
          // estado, para atributo e estado nunca divergirem.
          onCancel={(evento) => {
            evento.preventDefault();
            fecharTelaCheia();
          }}
          // Fechamento vindo do navegador (Escape nativo, close request do SO):
          // o estado acompanha em vez de ficar preso em aberto.
          onClose={() => {
            setTelaCheiaAberta(false);
            origemFocoRef.current?.focus();
          }}
          onClick={(evento) => {
            if (evento.target === dialogRef.current) fecharTelaCheia();
          }}
        >
          <button
            type="button"
            ref={fecharTelaCheiaRef}
            className="citie-galleria__fechar"
            aria-label="Fechar tela cheia"
            onClick={fecharTelaCheia}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="citie-galleria__dialogo-conteudo">
            {/* A instância de tela cheia compartilha o índice: fechar mantém a
                imagem que o usuário escolheu lá dentro. */}
            <Galleria
              itens={itens}
              rotulo={rotulo}
              indice={indice}
              onIndiceChange={irPara}
              miniaturas={miniaturas}
              posicaoMiniaturas={posicaoMiniaturas}
              indicadores={indicadores}
              posicaoIndicadores={posicaoIndicadores}
              indicadoresSobrepostos={indicadoresSobrepostos}
              navegacao={navegacao}
              mostrarLegenda={mostrarLegenda}
              circular={circular}
            />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
