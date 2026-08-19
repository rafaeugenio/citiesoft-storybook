import { useId, useState } from 'react';
import './Rating.css';

/**
 * Rating (Figma CitieOne, página ❖ Rating).
 * Variantes do arquivo: Rating de 0 a 5 e Disabled; o ícone tem State
 * (Idle | Hover), Select, Read Only e Focus.
 *
 * Cada estrela é um radio de verdade dentro de um grupo, então as setas do
 * teclado navegam e o valor é anunciado sem nenhum JS extra.
 */

export interface RatingProps {
  /** Nomeia o que está sendo avaliado. */
  label: string;
  defaultValue?: number;
  total?: number;
  disabled?: boolean;
  /** Exibição sem interação, para telas de consulta. */
  readOnly?: boolean;
  onChange?: (valor: number) => void;
}

function Estrela({ preenchida }: { preenchida: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="citie-rating__icone">
      <path
        d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 17.3 6.7 20.2l1.1-6.1L3.4 9.9l6-.8L12 3.5Z"
        fill={preenchida ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Rating({
  label,
  defaultValue = 0,
  total = 5,
  disabled = false,
  readOnly = false,
  onChange,
}: RatingProps) {
  const nome = useId();
  const [valor, setValor] = useState(defaultValue);

  if (readOnly) {
    return (
      <div className="citie-rating citie-rating--leitura">
        <span className="citie-rating__label">{label}</span>
        <span className="citie-rating__estrelas" role="img" aria-label={`${valor} de ${total}`}>
          {Array.from({ length: total }, (_, indice) => (
            <span
              key={indice}
              className={`citie-rating__item${
                indice < valor ? ' citie-rating__item--preenchido' : ''
              }`}
            >
              <Estrela preenchida={indice < valor} />
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <fieldset className={`citie-rating${disabled ? ' citie-rating--desabilitado' : ''}`}>
      <legend className="citie-rating__label">{label}</legend>

      <div className="citie-rating__estrelas">
        {Array.from({ length: total }, (_, indice) => {
          const nota = indice + 1;
          return (
            <label
              key={nota}
              className={`citie-rating__item${
                nota <= valor ? ' citie-rating__item--preenchido' : ''
              }`}
            >
              <input
                type="radio"
                name={nome}
                value={nota}
                checked={nota === valor}
                disabled={disabled}
                className="citie-visualmente-oculto"
                onChange={() => {
                  setValor(nota);
                  onChange?.(nota);
                }}
              />
              <Estrela preenchida={nota <= valor} />
              <span className="citie-visualmente-oculto">
                {nota} {nota === 1 ? 'estrela' : 'estrelas'}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
