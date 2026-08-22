import type { InputHTMLAttributes, ReactNode } from 'react';
import { FieldWrapper, type FieldSize } from '../../primitives/Field/Field';
import '../../primitives/Field/Field.css';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  size?: FieldSize;
  /** Preenchido em vez de contornado. Um só padrão por tela. */
  filled?: boolean;
  helper?: string;
  error?: string;
  /** Addon fixo colado à borda: "R$", "@", unidade. Não substitui o label. */
  addonStart?: ReactNode;
  addonEnd?: ReactNode;
  /** Validação assíncrona em curso: spinner à direita, dentro do campo. */
  loading?: boolean;
  /**
   * Dado consolidado: focável, selecionável e copiável, sem edição. Diferente
   * de `disabled`, que tira o campo da ordem de Tab e desbota a tinta. Número
   * de processo homologado: o valor está decidido e segue disponível para ler
   * e copiar.
   */
  readOnly?: boolean;
}

export function Input({
  label,
  size = 'normal',
  filled = false,
  helper,
  error,
  addonStart,
  addonEnd,
  loading = false,
  readOnly = false,
  required,
  className,
  ...rest
}: InputProps) {
  const classes = [
    'citie-field-control',
    `citie-field-control--${size}`,
    filled ? 'citie-field-control--filled' : null,
    readOnly ? 'citie-field-control--readonly' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => {
        const campo = (
          <div
            className={`citie-field-wrapper${loading ? ' citie-field-wrapper--has-affix' : ''}`}
          >
            <input
              id={id}
              className={classes}
              readOnly={readOnly}
              aria-required={required || undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              required={required}
              {...rest}
            />
            {loading ? (
              <span className="citie-field-wrapper__affix">
                <span className="citie-field__spinner" role="status" aria-label="Validando" />
              </span>
            ) : null}
          </div>
        );

        if (!addonStart && !addonEnd) return campo;

        return (
          <div
            className={`citie-input-group${addonStart ? ' citie-input-group--start' : ''}${
              addonEnd ? ' citie-input-group--end' : ''
            }`}
          >
            {addonStart ? (
              <span className="citie-input-group__addon citie-input-group__addon--start">
                {addonStart}
              </span>
            ) : null}
            {campo}
            {addonEnd ? (
              <span className="citie-input-group__addon citie-input-group__addon--end">
                {addonEnd}
              </span>
            ) : null}
          </div>
        );
      }}
    </FieldWrapper>
  );
}
