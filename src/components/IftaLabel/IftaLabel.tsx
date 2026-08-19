import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react';
import { AlertIcon, type FieldSize } from '../Field/Field';
import '../Field/Field.css';
import './IftaLabel.css';

/** Dados que o invólucro entrega ao campo para fechar a ligação de acessibilidade. */
export interface IftaLabelCampo {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  /** Classes do controle já resolvidas (base do DS + altura/padding do ifta). */
  className: string;
}

export type IftaLabelChildren =
  | ReactNode
  | ((campo: IftaLabelCampo) => ReactNode);

export interface IftaLabelProps {
  /** Substantivo que nomeia o dado, sem verbo ("Número do processo"). */
  label: string;
  required?: boolean;
  /** Regra de preenchimento. Substituído pela mensagem de erro quando houver erro. */
  helper?: string;
  /** Mensagem no padrão o que aconteceu mais como resolver. */
  error?: string;
  size?: FieldSize;
  /** Preenchido em vez de contornado. Um só padrão por tela. */
  filled?: boolean;
  /**
   * O campo. Como função, recebe `id`, `describedBy`, `invalid` e `className`
   * já prontos; como elemento, essas props são injetadas por clonagem.
   */
  children: IftaLabelChildren;
}

/**
 * IftaLabel (infield top-aligned label) — página do Figma CitieOne `7462:106719`,
 * component set `iftalabel`. Variantes do arquivo cobertas: `⚙️ State`
 * (Default · Hover · Active), `❌ Invalid`, `🚫 Disabled` e `🟦 Filled`.
 * Equivalente PrimeNG: `p-iftalabel`.
 *
 * O rótulo é pequeno e **fixo** dentro da caixa, acima do valor: nunca flutua,
 * nunca some, não anima. É a diferença para o FloatLabel, onde o rótulo ocupa o
 * lugar do valor enquanto o campo está vazio e sobe ao receber conteúdo.
 *
 * Padrão do DS Citiesoft continua sendo rótulo fixo **acima** do campo
 * (`FieldWrapper`). Este invólucro existe para telas densas que já vêm assim do
 * CitieOne; helper, erro e ícone de alerta são reaproveitados de `Field` para
 * que as duas formas se comportem igual.
 */
export function IftaLabel({
  label,
  required,
  helper,
  error,
  size = 'normal',
  filled = false,
  children,
}: IftaLabelProps) {
  const uid = useId();
  const id = `ifta-${uid}`;
  const mensagemId = `${id}-mensagem`;

  const temMensagem = Boolean(error ?? helper);
  const describedBy = temMensagem ? mensagemId : undefined;
  const invalid = Boolean(error);

  const className = [
    'citie-field-control',
    'citie-iftalabel__control',
    `citie-iftalabel__control--${size}`,
    filled ? 'citie-field-control--filled' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const campo: IftaLabelCampo = { id, describedBy, invalid, className };

  const conteudo =
    typeof children === 'function'
      ? children(campo)
      : isValidElement(children)
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
            id,
            'aria-describedby': describedBy,
            'aria-invalid': invalid || undefined,
            className: [
              className,
              (children.props as { className?: string }).className,
            ]
              .filter(Boolean)
              .join(' '),
          })
        : children;

  return (
    <div className={`citie-iftalabel citie-iftalabel--${size}`}>
      <div className="citie-iftalabel__caixa">
        <label className="citie-iftalabel__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="citie-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {conteudo}
      </div>

      {temMensagem ? (
        <div className="citie-field__footer">
          <span
            id={mensagemId}
            className={`citie-field__helper${error ? ' citie-field__helper--error' : ''}`}
          >
            {error ? <AlertIcon /> : null}
            {error ?? helper}
          </span>
        </div>
      ) : null}
    </div>
  );
}
