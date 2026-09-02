import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import './Button.css';

/**
 * Variantes da casa e a pele do UI Kit em que cada uma cai. A escolha comunica
 * severidade: no máximo uma primary por contexto visível, e danger só para
 * ação destrutiva.
 *
 *   primary, success, warn, info, contrast : pele Primary do kit, na família de cor
 *   danger                                  : pele Destructive
 *   secondary                               : pele Secondary (fundo neutro recuado)
 *   outline                                 : pele Outline (fundo transparente, contorno)
 *   text                                    : pele Ghost (sem fundo, hover accent)
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'danger'
  | 'warn'
  | 'info'
  | 'text'
  | 'contrast';

/** Cinco degraus do kit: 24 / 32 / 36 / 40 / 48px. */
export type ButtonSize = 'mini' | 'small' | 'normal' | 'large' | 'xl';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Hierarquia da ação. Máximo 1 `primary` por contexto visível. */
  variant?: ButtonVariant;
  /**
   * Altura do controle: mini 24, small 32, normal 36, large 40, xl 48.
   *
   * Onde cada piso vale:
   * - `mini` (24) é pele legítima do kit para contexto denso operado por
   *   mouse e teclado: célula de tabela, barra de filtro embutida, badge de
   *   ação. É o mínimo da WCAG 2.5.8 (24 × 24), e por isso não desce mais.
   * - `small` (32) é o piso em formulário, barra de ferramentas e qualquer
   *   superfície que um dedo alcance em tela de servidor.
   * - Tela de cidadão e mobile pedem `touchTarget="comfortable"`, que garante
   *   44 × 44 (`--citie-touch-target-comfortable`) por cima de qualquer degrau.
   */
  size?: ButtonSize;
  /** `Roundness = Round` do kit: pílula. */
  rounded?: boolean;
  /**
   * Rótulo no padrão verbo no infinitivo + objeto ("Salvar colaborador").
   * Opcional apenas quando `iconOnly` for true.
   */
  children?: ReactNode;
  /** Ícone à esquerda ou à direita do rótulo. */
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  /** Botão quadrado sem rótulo. Exige `aria-label` com a ação nomeada. */
  iconOnly?: boolean;
  /** Substitui o ícone por spinner e bloqueia o clique até concluir. */
  loading?: boolean;
  /** Rótulo alternativo durante o carregamento, tipicamente no gerúndio. */
  loadingLabel?: string;
  /** Garante alvo de toque de 44x44px (contexto de cidadão e mobile). */
  touchTarget?: 'default' | 'comfortable';
  /** Em React 19 a ref é uma prop comum, sem necessidade de `forwardRef`. */
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'normal',
  rounded = false,
  children,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  loadingLabel,
  touchTarget = 'default',
  disabled = false,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  if (import.meta.env.DEV && iconOnly && !rest['aria-label']) {
    console.warn(
      '[Citiesoft/Button] Botão somente-ícone sem aria-label. A spec exige nome acessível com a ação nomeada.',
    );
  }

  const classes = [
    'citie-button',
    `citie-button--${variant}`,
    `citie-button--${size}`,
    iconOnly ? 'citie-button--icon-only' : null,
    rounded ? 'citie-button--round' : null,
    touchTarget === 'comfortable' ? 'citie-button--touch-comfortable' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const label = loading && loadingLabel ? loadingLabel : children;
  const affix = loading ? (
    <span className="citie-button__spinner" aria-hidden="true" />
  ) : icon ? (
    <span className="citie-button__icon" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        // Loading mantém o foco no botão, então o clique precisa ser barrado aqui.
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {iconPosition === 'left' ? affix : null}
      {iconOnly ? null : label}
      {iconPosition === 'right' ? affix : null}
    </button>
  );
}
