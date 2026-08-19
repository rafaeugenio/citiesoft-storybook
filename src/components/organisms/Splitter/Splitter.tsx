import {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import './Splitter.css';

/**
 * Splitter (Figma CitieOne, página ❖ Splitter).
 * Variantes do arquivo: `splitter` com Layout (Horizontal | Vertical | Nested)
 * e a peça `splitter-handle` com Direction (Vertical | Horizontal) e
 * Focus (False | True).
 *
 * O layout Nested do Figma não é um terceiro modo: é um Splitter dentro do
 * conteúdo de um painel. Por isso o componente sempre divide dois painéis e o
 * aninhamento sai da composição.
 *
 * A barra é um `separator` focalizável: arrasto pelo ponteiro e setas, Home e
 * End pelo teclado. Cores e medidas saem dos tokens Citiesoft, não do azul do
 * PrimeOne.
 */

export interface PainelSplitter {
  /** Nome do painel, usado como rótulo da região rolável e no nome da barra. */
  rotulo: string;
  conteudo: ReactNode;
  /** Percentual mínimo que o painel ocupa ao ser encolhido. */
  tamanhoMinimo?: number;
}

export interface SplitterProps {
  /** Horizontal põe os painéis lado a lado; vertical empilha. */
  layout?: 'horizontal' | 'vertical';
  inicio: PainelSplitter;
  fim: PainelSplitter;
  /** Percentual inicial do primeiro painel. */
  proporcaoInicial?: number;
  /** Quanto cada seta do teclado move, em pontos percentuais. */
  passo?: number;
  /** Altura do conjunto. Aceita qualquer medida CSS. */
  altura?: string;
  onRedimensionar?: (proporcao: number) => void;
}

export function Splitter({
  layout = 'horizontal',
  inicio,
  fim,
  proporcaoInicial = 50,
  passo = 5,
  altura = '320px',
  onRedimensionar,
}: SplitterProps) {
  const idInicio = useId();
  const idFim = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [proporcao, setProporcao] = useState(proporcaoInicial);
  const [arrastando, setArrastando] = useState(false);

  const minimoInicio = inicio.tamanhoMinimo ?? 10;
  const maximoInicio = 100 - (fim.tamanhoMinimo ?? 10);
  const horizontal = layout === 'horizontal';

  const aplicar = useCallback(
    (bruto: number) => {
      const limitado = Math.min(Math.max(bruto, minimoInicio), maximoInicio);
      setProporcao(limitado);
      onRedimensionar?.(limitado);
    },
    [minimoInicio, maximoInicio, onRedimensionar],
  );

  const aoMoverPonteiro = (evento: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!arrastando || !container) return;

    const area = container.getBoundingClientRect();
    const bruto = horizontal
      ? ((evento.clientX - area.left) / area.width) * 100
      : ((evento.clientY - area.top) / area.height) * 100;
    aplicar(bruto);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    // As duas duplas de setas respondem em qualquer orientação: quem navega por
    // teclado não deveria precisar descobrir qual eixo a barra usa.
    const movimento: Record<string, number> = {
      ArrowLeft: -passo,
      ArrowUp: -passo,
      ArrowRight: passo,
      ArrowDown: passo,
      PageUp: -passo * 2,
      PageDown: passo * 2,
    };

    if (evento.key in movimento) {
      evento.preventDefault();
      aplicar(proporcao + movimento[evento.key]);
      return;
    }

    if (evento.key === 'Home') {
      evento.preventDefault();
      aplicar(minimoInicio);
      return;
    }

    if (evento.key === 'End') {
      evento.preventDefault();
      aplicar(maximoInicio);
    }
  };

  const arredondado = Math.round(proporcao);

  return (
    <div
      ref={containerRef}
      className={`citie-splitter citie-splitter--${layout}${
        arrastando ? ' citie-splitter--arrastando' : ''
      }`}
      style={{ '--citie-splitter-altura': altura } as CSSProperties}
      onPointerMove={aoMoverPonteiro}
    >
      <div
        id={idInicio}
        className="citie-splitter__painel"
        style={{ flexBasis: `${proporcao}%` }}
        role="group"
        aria-label={inicio.rotulo}
        tabIndex={0}
      >
        {inicio.conteudo}
      </div>

      <div
        className="citie-splitter__barra"
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-label={`Redimensionar ${inicio.rotulo} e ${fim.rotulo}`}
        aria-controls={`${idInicio} ${idFim}`}
        aria-valuenow={arredondado}
        aria-valuemin={Math.round(minimoInicio)}
        aria-valuemax={Math.round(maximoInicio)}
        aria-valuetext={`${inicio.rotulo} com ${arredondado}% do espaço`}
        onKeyDown={aoTeclar}
        onPointerDown={(evento) => {
          evento.currentTarget.setPointerCapture(evento.pointerId);
          setArrastando(true);
        }}
        onPointerUp={(evento) => {
          evento.currentTarget.releasePointerCapture(evento.pointerId);
          setArrastando(false);
        }}
        onPointerCancel={() => setArrastando(false)}
      >
        <span className="citie-splitter__pega" aria-hidden="true" />
      </div>

      <div
        id={idFim}
        className="citie-splitter__painel"
        style={{ flexBasis: `${100 - proporcao}%` }}
        role="group"
        aria-label={fim.rotulo}
        tabIndex={0}
      >
        {fim.conteudo}
      </div>
    </div>
  );
}
