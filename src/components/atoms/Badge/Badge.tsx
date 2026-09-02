import { useState, type ReactNode } from 'react';
import './Badge.css';

/** Mapa canônico de severidade. Nunca aplicar hex direto fora dele. */
export type Severidade =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'primary'
  | 'contrast';

export type TamanhoMarcador = 'sm' | 'md' | 'lg';

/**
 * Peles do Badge do UI Kit. `tonal` é a pele da casa (fundo claro da família,
 * texto forte) e continua sendo o padrão de Tag e Status; `preenchida` é o
 * Primary e o Destructive do kit, `contorno` o Outline, `fantasma` o Ghost.
 */
export type PeleMarcador = 'tonal' | 'preenchida' | 'contorno' | 'fantasma';

/** Classe da pele, só quando ela difere da tonal, que é o que `.citie-sev` já desenha. */
const classeDaPele = (pele: PeleMarcador) => (pele === 'tonal' ? '' : ` citie-sev--pele-${pele}`);

/* ------------------------------------------------------------------ */
/* Badge: contagem ou dot sobreposto a ícone, avatar ou botão         */
/* ------------------------------------------------------------------ */

export interface BadgeProps {
  /** Contagem de pendências. Zero suprime o badge; acima de 99 vira "99+". */
  value?: number;
  /** Indica novidade sem contar. */
  dot?: boolean;
  severity?: Severidade;
  size?: TamanhoMarcador;
  /** Pele do kit. Contagem sobre ícone costuma pedir `preenchida`. */
  pele?: PeleMarcador;
  /** Elemento que recebe o badge sobreposto. */
  children?: ReactNode;
}

export function Badge({
  value,
  dot = false,
  severity = 'primary',
  size = 'md',
  pele = 'tonal',
  children,
}: BadgeProps) {
  // Nunca exibir "0": o badge some.
  if (!dot && (value === undefined || value <= 0)) return <>{children}</>;

  const rotulo = dot ? null : value! > 99 ? '99+' : String(value);

  const marcador = (
    <span
      className={`citie-badge citie-sev citie-sev--${severity}${classeDaPele(pele)} citie-badge--${size}${
        dot ? ' citie-badge--dot' : ''
      }${
        children
          ? ' citie-badge-anchor__badge'
          : // Solto na linha, o badge entra na escala de altura de Tag, Status e
            // Chip; ancorado, mantém a caixa compacta para não vazar do alvo.
            ' citie-badge--solto'
      }`}
      // Badge é decorativo: o nome acessível completo vive no elemento pai.
      aria-hidden="true"
    >
      {rotulo}
    </span>
  );

  if (!children) return marcador;

  return (
    <span className="citie-badge-anchor">
      {children}
      {marcador}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tag: atributo estático, não removível                              */
/* ------------------------------------------------------------------ */

export interface TagProps {
  label: string;
  severity?: Severidade;
  size?: TamanhoMarcador;
  /** Decorativo: 12px, nunca maior que o cap-height do texto. */
  icon?: ReactNode;
  /** Pele do kit: tonal (padrão), preenchida, contorno ou fantasma. */
  pele?: PeleMarcador;
}

export function Tag({ label, severity = 'secondary', size = 'md', icon, pele = 'tonal' }: TagProps) {
  return (
    <span
      className={`citie-tag citie-sev citie-sev--${severity}${classeDaPele(pele)} citie-tag--${size}`}
    >
      {icon ? (
        <span className="citie-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="citie-tag__label">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Status Indicator: etapa de um fluxo de trabalho                    */
/* ------------------------------------------------------------------ */

/** Estados oficiais do glossário, com a severidade canônica de cada um. */
export const ESTADOS_DE_FLUXO = {
  Rascunho: 'secondary',
  Enviado: 'info',
  'Em Análise': 'warn',
  Aprovado: 'success',
  Devolvido: 'danger',
  Cancelado: 'secondary',
  'Aguardando Assinatura': 'warn',
  Homologado: 'success',
  Vencido: 'danger',
  Suspenso: 'warn',
  Pendente: 'warn',
} as const satisfies Record<string, Severidade>;

export type EstadoDeFluxo = keyof typeof ESTADOS_DE_FLUXO;

export interface StatusIndicatorProps {
  /** Rótulo oficial por extenso, nunca abreviado nem em caixa alta. */
  estado: EstadoDeFluxo;
  size?: TamanhoMarcador;
  icon?: ReactNode;
}

export function StatusIndicator({ estado, size = 'md', icon }: StatusIndicatorProps) {
  const severidade = ESTADOS_DE_FLUXO[estado];
  return (
    <span
      className={`citie-tag citie-status citie-sev citie-sev--${severidade} citie-tag--${size}`}
    >
      {icon ? (
        <span className="citie-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="citie-tag__label">{estado}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Chip: entidade interativa, removível ou alternável                 */
/* ------------------------------------------------------------------ */

export interface ChipProps {
  label: string;
  size?: TamanhoMarcador;
  variant?: 'removable' | 'selectable' | 'read-only';
  defaultSelected?: boolean;
  disabled?: boolean;
  error?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
}

export function Chip({
  label,
  size = 'md',
  variant = 'removable',
  defaultSelected = false,
  disabled = false,
  error = false,
  icon,
  onRemove,
}: ChipProps) {
  const [selecionado, setSelecionado] = useState(defaultSelected);
  const selecionavel = variant === 'selectable';

  const classes = [
    'citie-chip',
    `citie-chip--${size}`,
    selecionavel ? 'citie-chip--selectable' : null,
    selecionavel && selecionado ? 'citie-chip--selected' : null,
    disabled ? 'citie-chip--disabled' : null,
    error ? 'citie-chip--error' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = (
    <>
      {icon ? (
        <span className="citie-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {label}
    </>
  );

  if (selecionavel) {
    return (
      <button
        type="button"
        className={classes}
        aria-pressed={selecionado}
        disabled={disabled}
        onClick={() => setSelecionado(!selecionado)}
      >
        {conteudo}
      </button>
    );
  }

  return (
    <span
      className={classes}
      tabIndex={variant === 'removable' && !disabled ? 0 : undefined}
      onKeyDown={(evento) => {
        // Delete ou Backspace remove o chip com foco (WCAG 2.5.7).
        if (variant === 'removable' && !disabled && ['Delete', 'Backspace'].includes(evento.key)) {
          evento.preventDefault();
          onRemove?.();
        }
      }}
    >
      {conteudo}
      {variant === 'removable' ? (
        <button
          type="button"
          className="citie-chip__remove"
          aria-label={`Remover ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
