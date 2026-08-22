import { useState, type SelectHTMLAttributes } from 'react';
import { FieldWrapper, type FieldSize } from '../../primitives/Field/Field';
import { useRealceDeslizante } from '../../primitives/RealceDeslizante/useRealceDeslizante';
import '../../primitives/Field/Field.css';
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
  /**
   * Dado consolidado: focável e legível, sem troca de valor. Diferente de
   * `disabled`, que tira o campo da ordem de Tab e desbota a tinta. O `<select>`
   * nativo não conhece `readonly`, então o componente comunica por
   * `aria-readonly` e bloqueia a abertura do painel e as teclas que trocam o
   * valor, preservando Tab e Escape.
   */
  readOnly?: boolean;
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
  readOnly = false,
  required,
  className,
  ...rest
}: SelectProps) {
  const classes = [
    'citie-field-control',
    `citie-field-control--${size}`,
    'citie-select',
    filled ? 'citie-field-control--filled' : null,
    readOnly ? 'citie-field-control--readonly' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <div
          className={`citie-select-wrapper${readOnly ? ' citie-select-wrapper--readonly' : ''}`}
        >
          <select
            id={id}
            className={classes}
            defaultValue=""
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
            required={required}
            // Consolidado: o ponteiro não abre o painel e as teclas que trocam
            // o valor são bloqueadas. Tab e Shift+Tab seguem livres, então o
            // campo continua na ordem de foco e o valor continua legível.
            onMouseDown={readOnly ? (evento) => evento.preventDefault() : undefined}
            onKeyDown={
              readOnly
                ? (evento) => {
                    if (evento.key !== 'Tab' && evento.key !== 'Escape') {
                      evento.preventDefault();
                    }
                  }
                : undefined
            }
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
 *
 * Na escolha única o preenchimento ativo é um realce único que **desliza** do
 * segmento anterior para o novo, então o olho acompanha a mudança em vez de
 * reencontrar o ativo do zero. O realce é decoração (`aria-hidden`): o estado
 * continua sendo comunicado por `aria-pressed` e pela cor do rótulo. Na escolha
 * múltipla pode haver mais de um ativo ao mesmo tempo, então não existe "o"
 * realce para deslizar e cada segmento pinta o próprio preenchimento.
 */
export function SelectButton({
  legend,
  options,
  multiple = false,
  defaultValue = [],
  onChangeValue,
}: SelectButtonProps) {
  const [ativos, setAtivos] = useState<string[]>(defaultValue);
  const { trilhoRef, estilo } = useRealceDeslizante<HTMLDivElement>(
    multiple ? null : (ativos[0] ?? null),
  );

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
    <div
      ref={trilhoRef}
      className={`citie-selectbutton${multiple ? ' citie-selectbutton--multiplo' : ''}`}
      role="group"
      aria-label={legend}
    >
      {estilo ? (
        <span className="citie-selectbutton__realce" aria-hidden="true" style={estilo} />
      ) : null}
      {options.map((opcao) => {
        const ativo = ativos.includes(opcao.value);
        return (
          <button
            key={opcao.value}
            type="button"
            data-realce-id={opcao.value}
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
