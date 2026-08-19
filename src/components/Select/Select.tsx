import { useState, type SelectHTMLAttributes } from 'react';
import { FieldWrapper, type FieldSize } from '../Field/Field';
import '../Field/Field.css';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  options: SelectOption[];
  size?: FieldSize;
  filled?: boolean;
  helper?: string;
  error?: string;
  /** Mostra a ação de escolha ("Selecione o município"), nunca fica vazio. */
  placeholder?: string;
}

/**
 * Escolha única em lista fechada. Usa `<select>` nativo de propósito: entrega
 * navegação por teclado, papel de listbox e anúncio de seleção sem reimplementar
 * nada. MultiSelect e CascadeSelect da spec ficam para o equivalente PrimeNG.
 */
export function Select({
  label,
  options,
  size = 'normal',
  filled = false,
  helper,
  error,
  placeholder = 'Selecione',
  required,
  className,
  ...rest
}: SelectProps) {
  const classes = [
    'citie-field-control',
    `citie-field-control--${size}`,
    'citie-select',
    filled ? 'citie-field-control--filled' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="citie-select-wrapper">
          <select
            id={id}
            className={classes}
            defaultValue=""
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            required={required}
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
          <svg
            className="citie-select__chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </FieldWrapper>
  );
}

export interface SelectButtonProps {
  /** Nome acessível do grupo, obrigatório por spec. */
  legend: string;
  options: SelectOption[];
  /** `multiple` permite mais de um segmento ativo ao mesmo tempo. */
  multiple?: boolean;
  defaultValue?: string[];
  onChangeValue?: (valores: string[]) => void;
}

/**
 * 2 a 4 opções exclusivas sempre visíveis. Segmento ativo em `color.brand.primary`
 * com rótulo em branco; inativos neutros. Anunciado como pressionado.
 */
export function SelectButton({
  legend,
  options,
  multiple = false,
  defaultValue = [],
  onChangeValue,
}: SelectButtonProps) {
  const [ativos, setAtivos] = useState<string[]>(defaultValue);

  const alternar = (valor: string) => {
    const proximo = multiple
      ? ativos.includes(valor)
        ? ativos.filter((v) => v !== valor)
        : [...ativos, valor]
      : [valor];
    setAtivos(proximo);
    onChangeValue?.(proximo);
  };

  return (
    <div className="citie-selectbutton" role="group" aria-label={legend}>
      {options.map((opcao) => {
        const ativo = ativos.includes(opcao.value);
        return (
          <button
            key={opcao.value}
            type="button"
            className={`citie-selectbutton__item${
              ativo ? ' citie-selectbutton__item--active' : ''
            }`}
            aria-pressed={ativo}
            onClick={() => alternar(opcao.value)}
          >
            {opcao.label}
          </button>
        );
      })}
    </div>
  );
}
