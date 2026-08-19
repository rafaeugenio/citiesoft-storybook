import type { CSSProperties, ReactNode } from 'react';
import './Divider.css';

/** Eixo `Direction` do Figma. */
export type DirecaoDivider = 'horizontal' | 'vertical';

/** Eixo `Type` do Figma. O arquivo define apenas `Solid` e `Dashed`. */
export type TracoDivider = 'solid' | 'dashed';

/**
 * Eixo `Align` do Figma. `left | center | right` valem no horizontal e
 * `top | center | bottom` no vertical; o valor `N/A` do arquivo corresponde ao
 * divisor sem conteúdo, que aqui é simplesmente a ausência de `children`.
 */
export type AlinhamentoDivider = 'left' | 'center' | 'right' | 'top' | 'bottom';

export interface DividerProps {
  /** Orientação da linha. */
  direcao?: DirecaoDivider;
  /** Estilo do traço. */
  traco?: TracoDivider;
  /** Posição do conteúdo sobre a linha. Ignorado quando não há `children`. */
  alinhamento?: AlinhamentoDivider;
  /**
   * Conteúdo sobre a linha (`Type` do `divider-content`): texto, ícone, botão
   * ou ícone com texto. Sem `children`, o divisor é só a linha.
   */
  children?: ReactNode;
  /**
   * Marca o divisor como separador real de seções, com `role="separator"` e
   * `aria-orientation`. O padrão `false` mantém o divisor fora da árvore de
   * acessibilidade (`role="presentation"`), que é o caso da imensa maioria dos
   * usos, onde a linha só reforça um agrupamento que o leitor de tela já
   * percebe por cabeçalho ou landmark.
   */
  semantico?: boolean;
  /**
   * Nome do separador quando `semantico`. Conteúdo dentro de um `separator`
   * vira presentacional para o leitor de tela, então o texto visível precisa
   * ser repetido aqui. Com `children` de texto puro, é inferido.
   */
  rotuloAcessivel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Divider — página `6738:49734` do Figma CitieOne (sets `divider` e
 * `divider-content`). Variantes respeitadas: `Direction` (Horizontal ·
 * Vertical), `Type` (Solid · Dashed), `Content` (False · True) e `Align`
 * (N/A · Left · Center · Right · Top · Bottom). Equivale ao `p-divider` do
 * PrimeNG.
 *
 * Um divisor decorativo NÃO entra na árvore de acessibilidade; um divisor que
 * separa seções com significado usa `semantico` para virar `role="separator"`.
 * Conteúdo interativo (botão) exige o modo decorativo: dentro de um
 * `separator` o botão deixaria de ser alcançável.
 */
export function Divider({
  direcao = 'horizontal',
  traco = 'solid',
  alinhamento = 'center',
  children,
  semantico = false,
  rotuloAcessivel,
  className,
  style,
}: DividerProps) {
  const temConteudo = children !== undefined && children !== null && children !== false;
  const rotulo = rotuloAcessivel ?? (typeof children === 'string' ? children : undefined);

  const papeis = semantico
    ? ({ role: 'separator', 'aria-orientation': direcao, 'aria-label': rotulo } as const)
    : ({ role: 'presentation' } as const);

  const classes = [
    'citie-divider',
    `citie-divider--${direcao}`,
    `citie-divider--${traco}`,
    temConteudo ? `citie-divider--align-${alinhamento}` : 'citie-divider--sem-conteudo',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} {...papeis}>
      <span className="citie-divider__linha citie-divider__linha--inicio" aria-hidden="true" />
      {temConteudo && <span className="citie-divider__conteudo">{children}</span>}
      {temConteudo && (
        <span className="citie-divider__linha citie-divider__linha--fim" aria-hidden="true" />
      )}
    </div>
  );
}
