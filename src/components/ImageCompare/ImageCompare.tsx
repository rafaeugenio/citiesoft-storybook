import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import './ImageCompare.css';

/**
 * ImageCompare (Figma CitieOne, página ❖ ImageCompare).
 * Variantes do arquivo: a única parte com eixos é `imagecompare-handle`,
 * com State (Idle | Hover) e Focus (False | True) — respeitados aqui como
 * `:hover` e `:focus-visible` da alça. O componente em si não tem variante no
 * Figma: é uma área com duas imagens sobrepostas e um divisor vertical.
 *
 * A alça é um `role="slider"` focável, não um enfeite de arraste: setas movem,
 * Home e End vão aos extremos, e o valor é anunciado em porcentagem. Arrastar
 * com o ponteiro é atalho, nunca o único caminho.
 */

export interface ImagemComparada {
  /** Fonte da imagem. Use data URI ou asset local: a suíte roda offline. */
  src: string;
  /** Descreve o que a imagem mostra, incluindo o momento (antes/depois de quê). */
  alt: string;
  /** Selo curto exibido sobre a imagem, para identificar o lado sem depender da cor. */
  rotulo: string;
}

export interface ImageCompareProps {
  /** Imagem revelada à esquerda do divisor. */
  antes: ImagemComparada;
  /** Imagem revelada à direita do divisor. */
  depois: ImagemComparada;
  /** Posição inicial do divisor, em porcentagem da largura. */
  posicaoInicial?: number;
  /** Quanto cada seta do teclado move o divisor, em pontos percentuais. */
  passo?: number;
  /** Proporção da área de comparação, no formato aceito por `aspect-ratio`. */
  proporcao?: string;
  /** Nome acessível da alça. */
  rotuloAlca?: string;
  /** Texto abaixo da comparação, no `figcaption`. */
  legenda?: string;
  onChange?: (posicao: number) => void;
}

const limitar = (valor: number) => Math.min(100, Math.max(0, Math.round(valor)));

export function ImageCompare({
  antes,
  depois,
  posicaoInicial = 50,
  passo = 5,
  proporcao = '3 / 2',
  rotuloAlca = 'Posição da comparação',
  legenda,
  onChange,
}: ImageCompareProps) {
  const idLegenda = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const alcaRef = useRef<HTMLDivElement>(null);
  const [posicao, setPosicao] = useState(limitar(posicaoInicial));
  const [arrastando, setArrastando] = useState(false);

  const atualizar = (proxima: number) => {
    const valor = limitar(proxima);
    setPosicao(valor);
    onChange?.(valor);
  };

  const posicionarPeloPonteiro = (clienteX: number) => {
    const area = areaRef.current;
    if (!area) return;
    const caixa = area.getBoundingClientRect();
    atualizar(((clienteX - caixa.left) / caixa.width) * 100);
  };

  const aoPressionar = (evento: PointerEvent<HTMLDivElement>) => {
    evento.currentTarget.setPointerCapture(evento.pointerId);
    setArrastando(true);
    posicionarPeloPonteiro(evento.clientX);
    alcaRef.current?.focus();
  };

  const aoMover = (evento: PointerEvent<HTMLDivElement>) => {
    if (arrastando) posicionarPeloPonteiro(evento.clientX);
  };

  const aoSoltar = (evento: PointerEvent<HTMLDivElement>) => {
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
    setArrastando(false);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const movimentos: Record<string, number> = {
      ArrowLeft: -passo,
      ArrowDown: -passo,
      ArrowRight: passo,
      ArrowUp: passo,
      PageDown: -passo * 4,
      PageUp: passo * 4,
    };

    if (evento.key in movimentos) {
      evento.preventDefault();
      atualizar(posicao + movimentos[evento.key]);
      return;
    }
    if (evento.key === 'Home') {
      evento.preventDefault();
      atualizar(0);
      return;
    }
    if (evento.key === 'End') {
      evento.preventDefault();
      atualizar(100);
    }
  };

  const descricaoDoValor = `${posicao}% de ${antes.rotulo}, ${100 - posicao}% de ${depois.rotulo}`;

  return (
    <figure className="citie-image-compare">
      <div
        ref={areaRef}
        className={`citie-image-compare__area${arrastando ? ' citie-image-compare__area--arrastando' : ''}`}
        style={{ '--posicao': `${posicao}%`, '--proporcao': proporcao } as CSSProperties}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        <img className="citie-image-compare__imagem" src={antes.src} alt={antes.alt} draggable={false} />

        {/* O recorte revela a segunda imagem à direita do divisor; o alt continua
            legível para o leitor de tela em qualquer posição da alça. */}
        <div className="citie-image-compare__recorte">
          <img className="citie-image-compare__imagem" src={depois.src} alt={depois.alt} draggable={false} />
        </div>

        <span className="citie-image-compare__selo citie-image-compare__selo--antes">{antes.rotulo}</span>
        <span className="citie-image-compare__selo citie-image-compare__selo--depois">{depois.rotulo}</span>

        <div className="citie-image-compare__divisor" aria-hidden="true" />

        <div
          ref={alcaRef}
          className="citie-image-compare__alca"
          role="slider"
          tabIndex={0}
          aria-label={rotuloAlca}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={posicao}
          aria-valuetext={descricaoDoValor}
          aria-describedby={legenda ? idLegenda : undefined}
          onKeyDown={aoTeclar}
        >
          <svg className="citie-image-compare__setas" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 8 6 12l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m14 8 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {legenda ? (
        <figcaption className="citie-image-compare__legenda" id={idLegenda}>
          {legenda}
        </figcaption>
      ) : null}
    </figure>
  );
}
