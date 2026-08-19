import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import './Carousel.css';

/**
 * Carousel (Figma CitieOne, página ❖ Carousel).
 *
 * Variantes do arquivo respeitadas:
 * - `carousel` com Direction = Horizontal | Vertical. Em ambas a composição é a
 *   mesma: botão anterior, viewport com N itens visíveis, botão próximo e a
 *   instância `carousel-indicator-list` abaixo.
 * - `carousel-indicator` com State = Idle | Hover | Active e Focus = False |
 *   True. O indicador é a barra arredondada de 28x7, não um ponto.
 *
 * Autoplay e navegação circular não existem como variante no Figma (são
 * propriedades de comportamento do `p-carousel`), então entram como props.
 */

export interface CarouselItem {
  id: string;
  /** Nome do item, usado como rótulo do slide para leitor de tela. */
  rotulo: string;
  conteudo: ReactNode;
}

export interface CarouselProps {
  /** Nomeia o carrossel inteiro. Vira o `aria-label` da região. */
  rotulo: string;
  itens: CarouselItem[];
  orientacao?: 'horizontal' | 'vertical';
  /** Quantos itens cabem numa página. O Figma mostra 3 no horizontal e 1 no vertical. */
  itensPorPagina?: number;
  /** Passar da última página volta para a primeira. */
  circular?: boolean;
  indicadores?: boolean;
  /**
   * Intervalo do autoplay em milissegundos. Quando definido, o controle de
   * pausar aparece sempre visível — autoplay sem pausa reprova WCAG 2.2.2.
   */
  autoplayIntervalo?: number;
  /** Altura do viewport na orientação vertical. */
  altura?: string;
  onPaginaChange?: (pagina: number) => void;
}

function Chevron({ direcao }: { direcao: 'anterior' | 'proximo' | 'acima' | 'abaixo' }) {
  const caminho = {
    anterior: 'M14.5 4.5 8 11l6.5 6.5',
    proximo: 'M7.5 4.5 14 11l-6.5 6.5',
    acima: 'M4.5 14.5 11 8l6.5 6.5',
    abaixo: 'M4.5 7.5 11 14l6.5-6.5',
  }[direcao];

  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="citie-carousel__icone">
      <path d={caminho} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconePausa({ reproduzindo }: { reproduzindo: boolean }) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="citie-carousel__icone">
      {reproduzindo ? (
        <path d="M8 5h2.5v12H8zM11.5 5H14v12h-2.5z" fill="currentColor" />
      ) : (
        <path d="M7.5 4.8 17 11l-9.5 6.2z" fill="currentColor" />
      )}
    </svg>
  );
}

export function Carousel({
  rotulo,
  itens,
  orientacao = 'horizontal',
  itensPorPagina = 3,
  circular = false,
  indicadores = true,
  autoplayIntervalo,
  altura = '320px',
  onPaginaChange,
}: CarouselProps) {
  const idBase = useId();
  const [pagina, definirPagina] = useState(0);
  const [reproduzindo, definirReproduzindo] = useState(Boolean(autoplayIntervalo));
  const [interagindo, definirInteragindo] = useState(false);
  const [movimentoReduzido, definirMovimentoReduzido] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const vertical = orientacao === 'vertical';
  const totalPaginas = Math.max(1, Math.ceil(itens.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const temAutoplay = Boolean(autoplayIntervalo);

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => definirMovimentoReduzido(consulta.matches);
    aplicar();
    consulta.addEventListener('change', aplicar);
    return () => consulta.removeEventListener('change', aplicar);
  }, []);

  const irPara = useCallback(
    (destino: number) => {
      const alvo = circular
        ? (destino + totalPaginas) % totalPaginas
        : Math.min(Math.max(destino, 0), totalPaginas - 1);
      definirPagina(alvo);
      onPaginaChange?.(alvo);
    },
    [circular, totalPaginas, onPaginaChange],
  );

  /** O autoplay para em hover, em foco, no controle de pausa e em reduced motion. */
  useEffect(() => {
    if (!autoplayIntervalo || !reproduzindo || interagindo || movimentoReduzido) return;
    const relogio = window.setInterval(
      () => definirPagina((anterior) => (anterior + 1) % totalPaginas),
      autoplayIntervalo,
    );
    return () => window.clearInterval(relogio);
  }, [autoplayIntervalo, reproduzindo, interagindo, movimentoReduzido, totalPaginas]);

  const noInicio = paginaAtual === 0;
  const noFim = paginaAtual === totalPaginas - 1;
  const anteriorBloqueado = !circular && noInicio;
  const proximoBloqueado = !circular && noFim;

  function aoTeclar(evento: React.KeyboardEvent<HTMLDivElement>) {
    const anterior = vertical ? 'ArrowUp' : 'ArrowLeft';
    const proximo = vertical ? 'ArrowDown' : 'ArrowRight';

    if (evento.key === anterior) {
      evento.preventDefault();
      irPara(paginaAtual - 1);
    } else if (evento.key === proximo) {
      evento.preventDefault();
      irPara(paginaAtual + 1);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      irPara(0);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      irPara(totalPaginas - 1);
    }
  }

  const deslocamento = `${-100 * paginaAtual}%`;

  return (
    <section
      className={[
        'citie-carousel',
        vertical ? 'citie-carousel--vertical' : 'citie-carousel--horizontal',
        movimentoReduzido ? 'citie-carousel--sem-movimento' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onMouseEnter={() => definirInteragindo(true)}
      onMouseLeave={() => definirInteragindo(false)}
      onFocus={() => definirInteragindo(true)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) {
          definirInteragindo(false);
        }
      }}
    >
      <div className="citie-carousel__conteudo">
        <button
          type="button"
          className="citie-carousel__navegacao"
          aria-label="Itens anteriores"
          aria-controls={`${idBase}-viewport`}
          disabled={anteriorBloqueado}
          onClick={() => irPara(paginaAtual - 1)}
        >
          <Chevron direcao={vertical ? 'acima' : 'anterior'} />
        </button>

        <div
          id={`${idBase}-viewport`}
          ref={viewportRef}
          className="citie-carousel__viewport"
          style={vertical ? { height: altura } : undefined}
          role="group"
          aria-label={`Itens de ${rotulo}`}
          tabIndex={0}
          onKeyDown={aoTeclar}
        >
          <div
            className="citie-carousel__trilha"
            style={{
              transform: vertical ? `translateY(${deslocamento})` : `translateX(${deslocamento})`,
            }}
          >
            {itens.map((item, indice) => {
              const paginaDoItem = Math.floor(indice / itensPorPagina);
              return (
                <div
                  key={item.id}
                  className="citie-carousel__slide"
                  style={
                    vertical
                      ? { height: `calc(100% / ${itensPorPagina})` }
                      : { width: `calc(100% / ${itensPorPagina})` }
                  }
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${indice + 1} de ${itens.length}`}
                  // Fora da página visível o slide sai da ordem de leitura e de tabulação.
                  aria-hidden={paginaDoItem !== paginaAtual || undefined}
                  inert={paginaDoItem !== paginaAtual ? true : undefined}
                >
                  {item.conteudo}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="citie-carousel__navegacao"
          aria-label="Próximos itens"
          aria-controls={`${idBase}-viewport`}
          disabled={proximoBloqueado}
          onClick={() => irPara(paginaAtual + 1)}
        >
          <Chevron direcao={vertical ? 'abaixo' : 'proximo'} />
        </button>
      </div>

      {(indicadores || temAutoplay) && (
        <div className="citie-carousel__rodape">
          {temAutoplay && (
            <button
              type="button"
              className="citie-carousel__pausa"
              onClick={() => definirReproduzindo((estado) => !estado)}
            >
              <IconePausa reproduzindo={reproduzindo} />
              {reproduzindo ? 'Pausar' : 'Reproduzir'}
            </button>
          )}

          {indicadores && (
            <div className="citie-carousel__indicadores">
              {Array.from({ length: totalPaginas }, (_, indice) => {
                const ativo = indice === paginaAtual;
                return (
                  <button
                    key={indice}
                    type="button"
                    className={`citie-carousel__indicador${
                      ativo ? ' citie-carousel__indicador--ativo' : ''
                    }`}
                    aria-label={`Página ${indice + 1} de ${totalPaginas}`}
                    aria-current={ativo ? 'true' : undefined}
                    aria-controls={`${idBase}-viewport`}
                    onClick={() => irPara(indice)}
                  >
                    <span className="citie-carousel__indicador-barra" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p
        className="citie-visualmente-oculto"
        // Durante o autoplay o anúncio automático viraria ruído: só narra a
        // mudança feita pela pessoa.
        aria-live={temAutoplay && reproduzindo && !interagindo ? 'off' : 'polite'}
      >
        Página {paginaAtual + 1} de {totalPaginas}
      </p>
    </section>
  );
}
