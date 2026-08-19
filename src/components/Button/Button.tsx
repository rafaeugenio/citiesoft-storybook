import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import './Button.css';

/**
 * Variantes da spec Citiesoft. A escolha comunica severidade, não estética:
 * no máximo uma primary por contexto visível, e danger só para ação destrutiva.
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warn'
  | 'info'
  | 'text'
  | 'contrast';

export type ButtonSize = 'small' | 'normal' | 'large';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Hierarquia da ação. Máximo 1 `primary` por contexto visível. */
  variant?: ButtonVariant;
  /** Altura do controle: 32 / 40 / 48px. Nunca abaixo de 32px em produto. */
  size?: ButtonSize;
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
