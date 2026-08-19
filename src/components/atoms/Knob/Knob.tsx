import { useId, useState } from 'react';
import './Knob.css';

/**
 * Knob (Figma CitieOne, página ❖ Knob).
 * Variantes do arquivo: State (Idle | Disabled | Focus), Size (Default | Double)
 * e o texto do valor no centro.
 *
 * O arco é decorativo; quem carrega a semântica é o `role="slider"` com valor,
 * mínimo e máximo, navegável pelas setas do teclado.
 */

export interface KnobProps {
  /** Nome do valor ajustado: "Percentual de execução". */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  /** Default 100px, Double 200px, como no arquivo. */
  size?: 'default' | 'double';
  disabled?: boolean;
  formatar?: (valor: number) => string;
  onChange?: (valor: number) => void;
}

const RAIO = 42;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
/** O arco cobre 270 graus, deixando a base aberta como no desenho do Figma. */
const FRACAO_DO_ARCO = 0.75;

export function Knob({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 60,
  size = 'default',
  disabled = false,
  formatar,
  onChange,
}: KnobProps) {
  const id = useId();
  const [valor, setValor] = useState(defaultValue);
  const proporcao = (valor - min) / (max - min);

  const ajustar = (delta: number) => {
    const proximo = Math.min(max, Math.max(min, valor + delta));
    setValor(proximo);
    onChange?.(proximo);
  };

  return (
    <div className={`citie-knob citie-knob--${size}${disabled ? ' citie-knob--desabilitado' : ''}`}>
      <div
        className="citie-knob__controle"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={id}
        aria-valuenow={valor}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={formatar ? formatar(valor) : undefined}
        aria-disabled={disabled || undefined}
        onKeyDown={(evento) => {
          if (disabled) return;
          const acoes: Record<string, () => void> = {
            ArrowRight: () => ajustar(step),
            ArrowUp: () => ajustar(step),
            ArrowLeft: () => ajustar(-step),
            ArrowDown: () => ajustar(-step),
            Home: () => setValor(min),
            End: () => setValor(max),
            PageUp: () => ajustar(step * 10),
            PageDown: () => ajustar(-step * 10),
          };
          const acao = acoes[evento.key];
          if (acao) {
            evento.preventDefault();
            acao();
          }
        }}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {/* Trilho: sempre visível, para o vazio ter forma. */}
          <circle
            className="citie-knob__trilho"
            cx="50"
            cy="50"
            r={RAIO}
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${CIRCUNFERENCIA * FRACAO_DO_ARCO} ${CIRCUNFERENCIA}`}
            transform="rotate(135 50 50)"
            strokeLinecap="round"
          />
          <circle
            className="citie-knob__valor"
            cx="50"
            cy="50"
            r={RAIO}
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${CIRCUNFERENCIA * FRACAO_DO_ARCO * proporcao} ${CIRCUNFERENCIA}`}
            transform="rotate(135 50 50)"
            strokeLinecap="round"
          />
        </svg>

        <span className="citie-knob__texto" aria-hidden="true">
          {formatar ? formatar(valor) : valor}
        </span>
      </div>

      <span className="citie-knob__label" id={id}>
        {label}
      </span>
    </div>
  );
}
