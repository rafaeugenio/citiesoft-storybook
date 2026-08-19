import {
  cloneElement,
  useId,
  useState,
  type FocusEvent,
  type FormEvent,
  type ReactElement,
} from 'react';
import { AlertIcon, type FieldSize } from '../../primitives/Field/Field';
import '../../primitives/Field/Field.css';
import './FloatLabel.css';

/** Posição que o rótulo assume quando flutua, conforme o eixo `🎲 Variant`. */
export type FloatLabelVariante = 'over' | 'on' | 'in';

export interface FloatLabelProps {
  /** Substantivo que nomeia o dado, sem verbo ("Número do processo"). */
  label: string;
  /**
   * `over` sobe o rótulo para fora do campo, `on` o encaixa sobre a borda
   * superior e `in` o mantém dentro do campo, acima do valor.
   */
  variante?: FloatLabelVariante;
  /** Precisa casar com o tamanho do controle para o rótulo alinhar com o valor. */
  size?: FieldSize;
  required?: boolean;
  helper?: string;
  error?: string;
  /** Preenchido em vez de contornado. Um só padrão por tela. */
  filled?: boolean;
  /** O campo em si: `input`, `select`, `textarea` ou componente que repasse props ao controle. */
  children: ReactElement<PropsDoCampo>;
}

/** Props que o FloatLabel lê e reinjeta no campo recebido. */
export interface PropsDoCampo {
  id?: string;
  className?: string;
  value?: unknown;
  defaultValue?: unknown;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  onFocus?: (evento: FocusEvent<HTMLElement>) => void;
  onBlur?: (evento: FocusEvent<HTMLElement>) => void;
  onChange?: (evento: FormEvent<HTMLElement>) => void;
}

function temConteudo(valor: unknown): boolean {
  return valor !== undefined && valor !== null && String(valor) !== '';
}

function valorDoAlvo(evento: { target: EventTarget | null }): string {
  return (evento.target as HTMLInputElement | null)?.value ?? '';
}

/**
 * Rótulo flutuante. Página do Figma `7421:322901` (`❖ FloatLabel`, floatlabel
 * 4.0.0). Variantes do arquivo cobertas: `🎲 Variant` (Over · On · In),
 * `⚙️ State` (Default · Hover · Active), `❌ Invalid`, `🚫 Disabled` e
 * `🟦 Filled`. Equivalente PrimeNG: `p-floatlabel`.
 *
 * O rótulo é sempre um `<label>` de verdade ligado ao campo por `htmlFor`: ele
 * muda de posição, nunca vira placeholder e nunca some ao digitar.
 *
 * Não usa o `FieldWrapper` para o rótulo justamente porque a posição do rótulo é
 * o que esse componente altera. Helper, erro, ícone de alerta e a ligação por
 * `aria-describedby` seguem o mesmo desenho do Field, reaproveitando `Field.css`
 * e o `AlertIcon`.
 */
export function FloatLabel({
  label,
  variante = 'over',
  size = 'normal',
  required = false,
  helper,
  error,
  filled = false,
  children,
}: FloatLabelProps) {
  const uid = useId();
  const id = `flutuante-${uid}`;
  const mensagemId = `${id}-mensagem`;

  const campo = children.props;
  const controlado = campo.value !== undefined;

  const [preenchidoInterno, setPreenchidoInterno] = useState(() =>
    temConteudo(campo.defaultValue),
  );
  const [comFoco, setComFoco] = useState(false);

  const preenchido = controlado ? temConteudo(campo.value) : preenchidoInterno;
  const invalido = Boolean(error);
  const desabilitado = Boolean(campo.disabled);
  const obrigatorio = required || Boolean(campo.required);

  // Placeholder visível ocuparia o mesmo lugar do rótulo em repouso: nesse caso
  // o rótulo já nasce flutuado para os dois não se sobreporem.
  const flutuando = comFoco || preenchido || temConteudo(campo.placeholder);

  const mensagem = error ?? helper;

  const classes = [
    'citie-floatlabel',
    `citie-floatlabel--${variante}`,
    `citie-floatlabel--${size}`,
    flutuando ? 'citie-floatlabel--flutuando' : null,
    comFoco ? 'citie-floatlabel--foco' : null,
    invalido ? 'citie-floatlabel--invalido' : null,
    desabilitado ? 'citie-floatlabel--desabilitado' : null,
    filled ? 'citie-floatlabel--filled' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const campoClonado = cloneElement(children, {
    id,
    className: [campo.className, 'citie-floatlabel__campo'].filter(Boolean).join(' '),
    'aria-describedby': mensagem ? mensagemId : undefined,
    'aria-invalid': invalido || undefined,
    'aria-required': obrigatorio || undefined,
    required: obrigatorio || undefined,
    onFocus: (evento: FocusEvent<HTMLElement>) => {
      setComFoco(true);
      campo.onFocus?.(evento);
    },
    onBlur: (evento: FocusEvent<HTMLElement>) => {
      setComFoco(false);
      // Preenchimento por autofill ou máscara só aparece aqui.
      setPreenchidoInterno(temConteudo(valorDoAlvo(evento)));
      campo.onBlur?.(evento);
    },
    onChange: (evento: FormEvent<HTMLElement>) => {
      setPreenchidoInterno(temConteudo(valorDoAlvo(evento)));
      campo.onChange?.(evento);
    },
  });

  return (
    <div className={classes}>
      <div className="citie-floatlabel__area">
        {campoClonado}
        <label className="citie-floatlabel__rotulo" htmlFor={id}>
          {label}
          {obrigatorio ? (
            <span className="citie-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      </div>

      {mensagem ? (
        <span
          id={mensagemId}
          className={`citie-field__helper${error ? ' citie-field__helper--error' : ''}`}
        >
          {error ? <AlertIcon /> : null}
          {mensagem}
        </span>
      ) : null}
    </div>
  );
}
