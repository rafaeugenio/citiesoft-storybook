import { useState, type TextareaHTMLAttributes } from 'react';
import { FieldWrapper } from '../Field/Field';
import '../Field/Field.css';
import './Textarea.css';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label: string;
  filled?: boolean;
  helper?: string;
  error?: string;
  /** Mínimo de 3 linhas visíveis por spec. */
  rows?: number;
  /** Limite de caracteres da regra de negócio. Liga a contagem no rodapé. */
  limit?: number;
}

export function Textarea({
  label,
  filled = false,
  helper,
  error,
  rows = 3,
  limit,
  required,
  className,
  defaultValue,
  value,
  onChange,
  ...rest
}: TextareaProps) {
  const controlado = value !== undefined;
  const [interno, setInterno] = useState(String(defaultValue ?? ''));
  const conteudo = controlado ? String(value) : interno;

  const classes = [
    'citie-field-control',
    'citie-textarea',
    filled ? 'citie-field-control--filled' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper
      label={label}
      required={required}
      helper={helper}
      error={error}
      counter={limit ? { current: conteudo.length, limit } : undefined}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          className={classes}
          rows={Math.max(3, rows)}
          value={conteudo}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          required={required}
          onChange={(evento) => {
            if (!controlado) setInterno(evento.target.value);
            onChange?.(evento);
          }}
          {...rest}
        />
      )}
    </FieldWrapper>
  );
}
