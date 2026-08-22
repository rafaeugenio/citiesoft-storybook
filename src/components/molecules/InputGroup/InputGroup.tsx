import {
  createContext,
  useContext,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { FieldWrapper, type FieldSize } from '../../primitives/Field/Field';
import '../../primitives/Field/Field.css';
import './InputGroup.css';

/**
 * InputGroup: campo com adornos emendados. Unidade antes ("R$"), sufixo
 * depois ("%", "/dia"), prefixo fixo ("SES-") ou botão de ação colado.
 *
 * Formulário de processo administrativo é cheio disso, e cada tela improvisava
 * a emenda. Aqui a junção é resolvida por construção: o contorno do campo é UM,
 * desenhado pelo trilho do grupo, então não existe borda para duplicar nem
 * canto interno para arredondar errado. As peças de dentro são divididas por
 * uma única linha por junção.
 *
 * O grupo compõe o mesmo primitivo `Field` do `Input` (mesmo rótulo, helper,
 * erro, altura, borda e estados, sem alterar nenhum dos dois): `InputGroup` é
 * o campo completo, e o controle de dentro é o `InputGroupCampo`. Botão de
 * ação entra como `Átomos/Ações/Button` comum, filho direto do grupo.
 *
 * Decisões de acessibilidade:
 * - o nome acessível do controle é o `label` do grupo, via `for`/`id` do
 *   primitivo Field, exatamente como no `Input`;
 * - adorno textual é decorativo e sai da árvore de acessibilidade
 *   (`InputGroupAdorno` aplica `aria-hidden`); se a unidade for essencial para
 *   preencher, ela pertence ao `label` ou ao `helper`, que todo mundo recebe;
 * - adorno acionável é um `Button` de verdade, com nome acessível próprio e
 *   parada de Tab própria;
 * - o anel de foco é do grupo inteiro: foco no controle acende o trilho todo,
 *   porque anel parcial numa peça emendada lê como defeito.
 */

interface ContextoInputGroup {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  size: FieldSize;
}

const InputGroupContexto = createContext<ContextoInputGroup | null>(null);

export interface InputGroupProps {
  /** Substantivo que nomeia o dado ("Valor da diária"). Vira o nome acessível do controle. */
  label: string;
  required?: boolean;
  /** Regra de preenchimento. Substituído pela mensagem de erro quando houver erro. */
  helper?: string;
  /** Mensagem no padrão o que aconteceu mais como resolver. */
  error?: string;
  size?: FieldSize;
  /**
   * As peças, na ordem visual: `InputGroupAdorno`, um único `InputGroupCampo`
   * e `Button` do catálogo quando houver ação colada.
   */
  children: ReactNode;
}

export function InputGroup({
  label,
  required,
  helper,
  error,
  size = 'normal',
  children,
}: InputGroupProps) {
  // O anel de foco pertence ao trilho, então o grupo observa o foco do
  // controle por evento (que borbulha) em vez de depender de `:focus-within`,
  // que acenderia o trilho também quando o foco estivesse no botão de ação.
  const [campoFocado, setCampoFocado] = useState(false);

  const aoMudarFoco = (evento: FocusEvent<HTMLDivElement>, focado: boolean) => {
    if ((evento.target as HTMLElement).classList.contains('citie-field-control')) {
      setCampoFocado(focado);
    }
  };

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <InputGroupContexto.Provider
          value={{ id, describedBy, invalid, required: Boolean(required), size }}
        >
          <div
            className={[
              'citie-input-group-trilho',
              `citie-input-group-trilho--${size}`,
              campoFocado ? 'citie-input-group-trilho--focado' : null,
              invalid ? 'citie-input-group-trilho--invalido' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            onFocus={(evento) => aoMudarFoco(evento, true)}
            onBlur={(evento) => aoMudarFoco(evento, false)}
          >
            {children}
          </div>
        </InputGroupContexto.Provider>
      )}
    </FieldWrapper>
  );
}

export interface InputGroupAdornoProps {
  /** Texto curto ("R$", "%", "SES-") ou ícone. */
  children: ReactNode;
}

/**
 * Adorno decorativo do grupo. Fica fora da árvore de acessibilidade: o que o
 * usuário precisa saber para preencher pertence ao `label` ou ao `helper`.
 */
export function InputGroupAdorno({ children }: InputGroupAdornoProps) {
  return (
    <span className="citie-input-group-trilho__adorno" aria-hidden="true">
      {children}
    </span>
  );
}

export interface InputGroupCampoProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

/**
 * O controle de texto do grupo. Usa as mesmas classes do primitivo `Field`
 * que o `Input` consome, então altura, tipografia e estados são idênticos aos
 * de um campo solto na mesma tela.
 */
export function InputGroupCampo({ className, ...rest }: InputGroupCampoProps) {
  const contexto = useContext(InputGroupContexto);

  if (import.meta.env.DEV && !contexto) {
    console.warn(
      '[Citiesoft/InputGroup] InputGroupCampo fora de um InputGroup. Sem o grupo não há rótulo nem ligação de acessibilidade; para campo solto, use o Input.',
    );
  }

  const classes = [
    'citie-field-control',
    `citie-field-control--${contexto?.size ?? 'normal'}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      id={contexto?.id}
      className={classes}
      aria-invalid={contexto?.invalid || undefined}
      aria-required={contexto?.required || undefined}
      required={contexto?.required || undefined}
      aria-describedby={contexto?.describedBy}
      {...rest}
    />
  );
}
