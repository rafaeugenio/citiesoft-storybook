import { useId } from 'react';
import { AlertIcon } from '../../primitives/Field/Field';
import '../../atoms/Choice/Choice.css';
import './RadioGroup.css';

export interface RadioGroupProps {
  /** Legenda do grupo, obrigatória por spec. */
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  disabled?: boolean;
  /** Grupo obrigatório não preenchido. */
  error?: string;
  onChange?: (valor: string) => void;
}

export function RadioGroup({
  legend,
  name,
  options,
  defaultValue,
  disabled = false,
  error,
  onChange,
}: RadioGroupProps) {
  const uid = useId();
  const mensagemId = `${uid}-erro`;

  return (
    <fieldset
      className="citie-choice-group"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? mensagemId : undefined}
    >
      <legend className="citie-choice-group__legend">{legend}</legend>
      <div className="citie-choice-group__items">
        {options.map((opcao) => (
          <label
            key={opcao.value}
            className={`citie-choice${disabled ? ' citie-choice--disabled' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={opcao.value}
              defaultChecked={defaultValue === opcao.value}
              disabled={disabled}
              className={`citie-choice__control citie-choice__control--radio${
                error ? ' citie-choice__control--invalid' : ''
              }`}
              onChange={() => onChange?.(opcao.value)}
            />
            <span className="citie-choice__label">{opcao.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <span id={mensagemId} className="citie-choice-group__error">
          <AlertIcon />
          {error}
        </span>
      ) : null}
    </fieldset>
  );
}
