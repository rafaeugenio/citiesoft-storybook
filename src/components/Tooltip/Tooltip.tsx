import { useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cloneElement } from 'react';
import './Tooltip.css';

export type TamanhoTooltip = 'sm' | 'md' | 'lg';
export type PosicaoTooltip = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Substantivo ou locução nominal, nunca verbo de ação nem duplicata do label. */
  conteudo: string;
  size?: TamanhoTooltip;
  posicao?: PosicaoTooltip;
  /** Gatilho focável por teclado. O tooltip em si nunca recebe foco. */
  children: ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }>;
  /** Atraso antes de abrir no hover, evita piscar na varredura de tabela. */
  atraso?: number;
}

export function Tooltip({
  conteudo,
  size = 'md',
  posicao = 'top',
  children,
  atraso = 400,
}: TooltipProps) {
  const [visivel, setVisivel] = useState(false);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const abrirComAtraso = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisivel(true), atraso);
  };

  const fechar = () => {
    clearTimeout(timer.current);
    setVisivel(false);
  };

  const gatilho = cloneElement(children, {
    // Associação explícita entre gatilho e texto, para o leitor de tela.
    'aria-describedby': visivel ? id : undefined,
    onMouseEnter: abrirComAtraso,
    onMouseLeave: fechar,
    // Por teclado abre no foco, sem atraso, e fecha ao perder o foco.
    onFocus: () => setVisivel(true),
    onBlur: fechar,
  });

  return (
    <span className="citie-tooltip-anchor">
      {gatilho}
      {visivel ? (
        <span
          id={id}
          role="tooltip"
          className={`citie-tooltip citie-tooltip--${size} citie-tooltip--${posicao}`}
        >
          {conteudo}
        </span>
      ) : null}
    </span>
  );
}

export interface PopoverProps {
  /** Nome acessível do painel ancorado. */
  label: string;
  gatilho: ReactNode;
  children: ReactNode;
  aberto: boolean;
  onClose: () => void;
}

/**
 * Painel ancorado com conteúdo interativo. Quando o tooltip precisaria de link
 * ou botão dentro, a spec manda migrar para cá.
 */
export function Popover({ label, gatilho, children, aberto, onClose }: PopoverProps) {
  return (
    <span className="citie-tooltip-anchor">
      {gatilho}
      {aberto ? (
        <div
          className="citie-popover"
          role="dialog"
          aria-label={label}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') onClose();
          }}
        >
          {children}
        </div>
      ) : null}
    </span>
  );
}
