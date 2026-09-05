import { useId, type ReactNode } from 'react';
import './Field.css';

export type FieldSize = 'mini' | 'small' | 'normal' | 'large';

/** Ícone de alerta: a spec proíbe cor como único indicador de erro. */
export function AlertIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      style={{ flex: 'none', marginTop: 1 }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export interface FieldWrapperProps {
  /** Substantivo que nomeia o dado, sem verbo ("Data de nascimento"). */
  label: string;
  required?: boolean;
  /** Regra de preenchimento. Convive com a mensagem de erro: quando o usuário
   *  erra, a instrução de como preencher é o que ele mais precisa ler. */
  helper?: string;
  /** Mensagem no padrão o que aconteceu mais como resolver. */
  error?: string;
  /** Contagem de caracteres, usada pelo Textarea. */
  counter?: { current: number; limit: number };
  /**
   * Rótulo só para o leitor de tela. Na linha de filtro do Sismental o select
   * de escopo ("Todos os setores") vive ao lado da busca sem rótulo visível,
   * porque o placeholder já nomeia o escopo. O `<label>` continua no DOM,
   * ligado ao campo por `for`/`id`; só sai da pintura (WCAG 1.3.1 e 4.1.2).
   */
  rotuloOculto?: boolean;
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
}

/**
 * Empilha label, campo, helper e erro no padrão FormGroup do DS, e faz a
 * ligação de acessibilidade (`for`/`id`, `aria-describedby`, `aria-invalid`).
 */
export function FieldWrapper({
  label,
  required,
  helper,
  error,
  counter,
  rotuloOculto = false,
  children,
}: FieldWrapperProps) {
  const uid = useId();
  const id = `campo-${uid}`;
  const erroId = `${id}-erro`;
  const helperId = `${id}-helper`;
  const contadorId = `${id}-contador`;

  // O erro vem primeiro no describedby: o leitor de tela anuncia o que
  // aconteceu antes da regra de preenchimento que ajuda a resolver.
  const describedBy =
    [error ? erroId : null, helper ? helperId : null, counter ? contadorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const proximoDoLimite = counter ? counter.current >= counter.limit * 0.9 : false;

  return (
    // O rótulo oculto é resolvido no próprio `<label>`, por
    // `citie-visualmente-oculto`, e o wrapper segue com a mesma classe: um
    // modificador sem regra de CSS promete um comportamento que não existe.
    <div className="citie-field">
      <label
        className={`citie-field__label${rotuloOculto ? ' citie-visualmente-oculto' : ''}`}
        htmlFor={id}
      >
        {label}
        {required ? (
          <span className="citie-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error || helper || counter ? (
        <div className="citie-field__footer">
          {error || helper ? (
            <span className="citie-field__mensagens">
              {error ? (
                <span id={erroId} className="citie-field__helper citie-field__helper--error">
                  <AlertIcon />
                  {error}
                </span>
              ) : null}
              {helper ? (
                <span id={helperId} className="citie-field__helper">
                  {helper}
                </span>
              ) : null}
            </span>
          ) : (
            <span />
          )}
          {counter ? (
            <span
              id={contadorId}
              // Região de status para o leitor de tela anunciar ao aproximar do limite.
              role="status"
              aria-live="polite"
              className={`citie-field__counter${
                proximoDoLimite ? ' citie-field__counter--warning' : ''
              }`}
            >
              {counter.current}/{counter.limit}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
