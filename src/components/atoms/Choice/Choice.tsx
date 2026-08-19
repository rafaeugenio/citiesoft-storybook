import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AlertIcon } from '../../primitives/Field/Field';
import './Choice.css';

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

export interface CheckboxProps {
  /** Afirmação clara do que a opção representa. */
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Estado parcial de um grupo (alguns filhos marcados). */
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (marcado: boolean) => void;
}

export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  invalid = false,
  onChange,
}: CheckboxProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const controlado = checked !== undefined;
  const [interno, setInterno] = useState(defaultChecked);
  const marcado = controlado ? checked : interno;

  useEffect(() => {
    // `indeterminate` só existe como propriedade do DOM, não como atributo.
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={`citie-choice${disabled ? ' citie-choice--disabled' : ''}`} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={`citie-choice__control citie-choice__control--checkbox${
          invalid ? ' citie-choice__control--invalid' : ''
        }`}
        checked={marcado}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(evento) => {
          if (!controlado) setInterno(evento.target.checked);
          onChange?.(evento.target.checked);
        }}
      />
      <span className="citie-choice__label">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* RadioGroup                                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* ToggleSwitch                                                        */
/* ------------------------------------------------------------------ */

export interface SwitchProps {
  /** Descreve o estado ligado, nunca a ação ("Notificações por e-mail"). */
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (ligado: boolean) => void;
}

/**
 * Efeito imediato. Nunca usar dentro de formulário que só aplica ao salvar,
 * porque o switch promete que a mudança já valeu.
 */
export function Switch({ label, defaultChecked = false, disabled = false, onChange }: SwitchProps) {
  const id = useId();
  const [ligado, setLigado] = useState(defaultChecked);

  return (
    <label className={`citie-choice${disabled ? ' citie-choice--disabled' : ''}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="citie-switch"
        checked={ligado}
        disabled={disabled}
        onChange={(evento) => {
          setLigado(evento.target.checked);
          onChange?.(evento.target.checked);
        }}
      />
      <span className="citie-choice__label">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* ToggleButton                                                        */
/* ------------------------------------------------------------------ */

export interface ToggleButtonProps {
  label?: string;
  icon?: ReactNode;
  /** Obrigatório quando não há rótulo visível. */
  'aria-label'?: string;
  defaultPressed?: boolean;
  disabled?: boolean;
  onChange?: (pressionado: boolean) => void;
}

export function ToggleButton({
  label,
  icon,
  defaultPressed = false,
  disabled = false,
  onChange,
  ...rest
}: ToggleButtonProps) {
  const [pressionado, setPressionado] = useState(defaultPressed);

  return (
    <button
      type="button"
      className={`citie-togglebutton${pressionado ? ' citie-togglebutton--pressed' : ''}`}
      aria-pressed={pressionado}
      disabled={disabled}
      onClick={() => {
        setPressionado(!pressionado);
        onChange?.(!pressionado);
      }}
      {...rest}
    >
      {icon ? (
        <span className="citie-togglebutton__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {label}
    </button>
  );
}
