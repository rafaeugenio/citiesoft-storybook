import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from '../../atoms/Button/Button';
import './SplitButton.css';

export interface ItemDeSplitButtonProps {
  id: string;
  /** Rótulo no padrão verbo no infinitivo + objeto: "Salvar e continuar". */
  rotulo: string;
  icone?: ReactNode;
  disabled?: boolean;
  /** Separador antes deste item, para isolar a ação de menor frequência. */
  separadorAcima?: boolean;
  onSelecionar?: () => void;
}

export interface SplitButtonProps {
  /** Ação padrão em destaque. Verbo no infinitivo + objeto: "Salvar colaborador". */
  rotulo: string;
  /** Ações relacionadas à padrão, nunca ações de outro assunto. */
  itens: ItemDeSplitButtonProps[];
  /** Disparado pelo clique no botão principal, não pelos itens do menu. */
  aoAcionar?: () => void;
  /** Mesma escala de severidade do Button. Máximo 1 `primary` por contexto visível. */
  variante?: ButtonVariant;
  /** Altura do controle: 24 / 32 / 36 / 40 / 48px, os cinco degraus do Button. */
  tamanho?: ButtonSize;
  icone?: ReactNode;
  /** Figma `Raised = True`: sombra de cartão sob o par de botões. */
  elevado?: boolean;
  /** Figma `Rounded = True`: extremidades externas em raio total. */
  arredondado?: boolean;
  /** Desabilita a ação padrão e o gatilho do menu ao mesmo tempo. */
  disabled?: boolean;
  /** Spinner no botão principal; o gatilho fica bloqueado até concluir. */
  loading?: boolean;
  loadingLabel?: string;
  /**
   * Nome acessível do gatilho, próprio e distinto do botão principal.
   * Padrão: "Mais ações de <rótulo em minúsculo>".
   */
  rotuloDoGatilho?: string;
}

/**
 * SplitButton: ação padrão em destaque com um gatilho de menu acoplado à direita.
 *
 * Página do Figma CitieOne `6738:49720` (❖ splitbutton). Eixos do component set
 * respeitados: `State = Idle | Open`, `Raised = False | True`,
 * `Rounded = False | True`. As linhas de exemplo da página (Basic, Icons,
 * Severity, Raised, Rounded, Text, Raised Text, Outlined) viram combinações de
 * `variante`, `icone`, `elevado` e `arredondado`, já que severidade e ênfase
 * pertencem ao Button e são reaproveitadas daqui.
 *
 * Pele do UI Kit Citiesoft (docs/figma-ui-kit.md): a mesma do Button, com um
 * divisor de 1px entre a ação e o gatilho e o gatilho quadrado (largura igual
 * à altura). Mesma altura do Button (24/32/36/40/48), `radius` do kit (10) nas
 * pontas externas e o mesmo anel de foco. Equivalente PrimeNG: `p-splitbutton`.
 *
 * São dois botões irmãos, não um só: o principal executa a ação padrão e o
 * gatilho declara `aria-haspopup="menu"` com nome acessível próprio. Teclado no
 * padrão APG: setas para baixo/cima abrem o menu no primeiro/último item, setas
 * andam em anel dentro dele, Home e End vão às pontas, Escape e Tab fecham e o
 * Escape devolve o foco ao gatilho.
 */
export function SplitButton({
  rotulo,
  itens,
  aoAcionar,
  variante = 'primary',
  tamanho = 'normal',
  icone,
  elevado = false,
  arredondado = false,
  disabled = false,
  loading = false,
  loadingLabel,
  rotuloDoGatilho,
}: SplitButtonProps) {
  const [aberto, setAberto] = useState(false);
  // Guarda de qual ponta o teclado entrou, para o foco cair no item certo.
  const [entradaPor, setEntradaPor] = useState<'primeiro' | 'ultimo' | null>(null);
  const raizRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const nomeDoGatilho = rotuloDoGatilho ?? `Mais ações de ${rotulo.toLowerCase()}`;

  const fechar = (devolverFoco: boolean) => {
    setAberto(false);
    setEntradaPor(null);
    if (devolverFoco) gatilhoRef.current?.focus();
  };

  useEffect(() => {
    if (!aberto || !entradaPor) return;
    const alvos = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    if (!alvos?.length) return;
    (entradaPor === 'primeiro' ? alvos[0] : alvos[alvos.length - 1]).focus();
    setEntradaPor(null);
  }, [aberto, entradaPor]);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (evento: MouseEvent) => {
      if (!raizRef.current?.contains(evento.target as Node)) fechar(false);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [aberto]);

  const abrir = (por: 'primeiro' | 'ultimo' | null) => {
    setAberto(true);
    setEntradaPor(por);
  };

  const andarNoMenu = (passo: number | 'inicio' | 'fim') => {
    const alvos = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    );
    if (!alvos.length) return;
    const atual = alvos.indexOf(document.activeElement as HTMLButtonElement);
    const destino =
      passo === 'inicio'
        ? alvos[0]
        : passo === 'fim'
          ? alvos[alvos.length - 1]
          : alvos[(atual + passo + alvos.length) % alvos.length];
    destino.focus();
  };

  const classes = [
    'citie-split-button',
    `citie-split-button--${variante}`,
    `citie-split-button--${tamanho}`,
    elevado ? 'citie-split-button--elevado' : null,
    arredondado ? 'citie-split-button--arredondado' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={raizRef}>
      <Button
        className="citie-split-button__acao"
        variant={variante}
        size={tamanho}
        icon={icone}
        disabled={disabled}
        loading={loading}
        loadingLabel={loadingLabel}
        onClick={aoAcionar}
      >
        {rotulo}
      </Button>

      <Button
        ref={gatilhoRef}
        className="citie-split-button__gatilho"
        variant={variante}
        size={tamanho}
        iconOnly
        icon={<SetaBaixo aberta={aberto} />}
        disabled={disabled || loading}
        aria-label={nomeDoGatilho}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar(false) : abrir(null))}
        onKeyDown={(evento) => {
          if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
            evento.preventDefault();
            abrir(evento.key === 'ArrowDown' ? 'primeiro' : 'ultimo');
          }
          if (evento.key === 'Escape' && aberto) {
            evento.preventDefault();
            fechar(false);
          }
        }}
      />

      {aberto ? (
        <div
          ref={menuRef}
          className="citie-split-button__menu"
          role="menu"
          aria-label={nomeDoGatilho}
          onKeyDown={(evento) => {
            const acoes: Record<string, () => void> = {
              ArrowDown: () => andarNoMenu(1),
              ArrowUp: () => andarNoMenu(-1),
              Home: () => andarNoMenu('inicio'),
              End: () => andarNoMenu('fim'),
              Escape: () => fechar(true),
            };
            const acao = acoes[evento.key];
            if (acao) {
              evento.preventDefault();
              acao();
            }
            if (evento.key === 'Tab') fechar(false);
          }}
        >
          {itens.map((item) => (
            <SeparadorEItem
              key={item.id}
              item={item}
              aoSelecionar={() => {
                if (item.disabled) return;
                fechar(true);
                item.onSelecionar?.();
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SeparadorEItem({
  item,
  aoSelecionar,
}: {
  item: ItemDeSplitButtonProps;
  aoSelecionar: () => void;
}) {
  return (
    <>
      {item.separadorAcima ? (
        <div role="separator" className="citie-split-button__separador" />
      ) : null}
      <button
        type="button"
        role="menuitem"
        className="citie-split-button__item"
        tabIndex={-1}
        aria-disabled={item.disabled || undefined}
        onClick={aoSelecionar}
      >
        {item.icone ? (
          <span className="citie-split-button__item-icone" aria-hidden="true">
            {item.icone}
          </span>
        ) : null}
        {item.rotulo}
      </button>
    </>
  );
}

function SetaBaixo({ aberta }: { aberta: boolean }) {
  return (
    <svg
      className={`citie-split-button__seta${aberta ? ' citie-split-button__seta--aberta' : ''}`}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
