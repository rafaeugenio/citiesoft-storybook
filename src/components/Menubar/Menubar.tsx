import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import './Menubar.css';

export interface ItemDeSubmenuProps {
  id: string;
  /** Rótulo do comando, em linguagem do servidor público: "Abrir processo". */
  rotulo: string;
  icone?: ReactNode;
  disabled?: boolean;
  /** Um nível de submenu aninhado, sinalizado pela seta à direita. */
  submenu?: ItemDeSubmenuProps[];
  onSelecionar?: () => void;
}

export interface ItemDeMenubarProps {
  id: string;
  /** Nome do módulo: "Pessoas", "Processos". Substantivo, sem verbo. */
  rotulo: string;
  icone?: ReactNode;
  disabled?: boolean;
  submenu?: ItemDeSubmenuProps[];
  onSelecionar?: () => void;
}

export interface MenubarProps {
  /** Nome acessível da barra, lido pelo leitor de tela antes dos módulos. */
  label: string;
  itens: ItemDeMenubarProps[];
  /** Área à esquerda da barra: logotipo ou nome do sistema. */
  inicio?: ReactNode;
  /** Área à direita da barra: busca, notificações, usuário. */
  fim?: ReactNode;
}

/**
 * Menubar — barra horizontal de módulos do sistema.
 *
 * Página do Figma CitieOne `6738:52937` (❖ Menubar). Variantes respeitadas:
 * - `menubar` · Submenu = False | True (barra sozinha ou com o suspenso aberto);
 * - `menubar-item` · State = Idle | Hover | Focus | Active, mais os booleanos
 *   Show Icon e Show Submenu Icon, e a seta `angle-right` do item aninhado.
 *
 * As áreas `inicio` e `fim` não existem no arquivo do Figma; vieram do uso real
 * do produto (logotipo à esquerda, ações à direita) e ficam fora do
 * `role="menubar"` para não poluir a árvore de acessibilidade da barra.
 *
 * Teclado (padrão APG): setas esquerda/direita andam na barra em anel, Home e
 * End vão às pontas, seta para baixo abre o submenu e foca o primeiro item,
 * Escape fecha e devolve o foco ao item de topo. Dentro do submenu, seta para a
 * direita abre o aninhado ou pula para o próximo módulo.
 *
 * Não confundir com `../Navigation/Navigation`, que é o menu lateral do produto.
 */
export function Menubar({ label, itens, inicio, fim }: MenubarProps) {
  const uid = useId();
  const [focoId, setFocoId] = useState(itens[0]?.id);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [aninhadoId, setAninhadoId] = useState<string | null>(null);
  // Só o teclado joga o foco para dentro do submenu; o mouse deixa o foco parado.
  const [focarPrimeiro, setFocarPrimeiro] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const submenuRef = useRef<HTMLDivElement>(null);

  const fechar = (devolverFoco = true) => {
    setAbertoId(null);
    setAninhadoId(null);
    setFocarPrimeiro(false);
    if (devolverFoco && focoId) itensRef.current[focoId]?.focus();
  };

  useEffect(() => {
    if (!abertoId || !focarPrimeiro) return;
    submenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    setFocarPrimeiro(false);
  }, [abertoId, focarPrimeiro]);

  useEffect(() => {
    if (!abertoId) return;
    const aoClicarFora = (evento: MouseEvent) => {
      if (!raizRef.current?.contains(evento.target as Node)) fechar(false);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [abertoId]);

  const moverNaBarra = (passo: number | 'inicio' | 'fim') => {
    const indice = itens.findIndex((item) => item.id === focoId);
    const destino =
      passo === 'inicio'
        ? itens[0]
        : passo === 'fim'
          ? itens[itens.length - 1]
          : itens[(indice + passo + itens.length) % itens.length];
    setFocoId(destino.id);
    setAninhadoId(null);
    // Barra com submenu aberto mantém o comportamento de "menu ativo" ao andar.
    if (abertoId) setAbertoId(destino.submenu ? destino.id : null);
    itensRef.current[destino.id]?.focus();
  };

  const acionarTopo = (item: ItemDeMenubarProps, abrirComFoco: boolean) => {
    if (item.disabled) return;
    if (item.submenu?.length) {
      const jaAberto = abertoId === item.id;
      setAbertoId(jaAberto ? null : item.id);
      setAninhadoId(null);
      setFocarPrimeiro(!jaAberto && abrirComFoco);
      return;
    }
    fechar(false);
    item.onSelecionar?.();
  };

  const itemAberto = itens.find((item) => item.id === abertoId);

  return (
    <div className="citie-menubar" ref={raizRef}>
      {inicio ? <div className="citie-menubar__inicio">{inicio}</div> : null}

      <div
        className="citie-menubar__barra"
        role="menubar"
        aria-orientation="horizontal"
        aria-label={label}
        onKeyDown={(evento) => {
          const acoes: Record<string, () => void> = {
            ArrowRight: () => moverNaBarra(1),
            ArrowLeft: () => moverNaBarra(-1),
            Home: () => moverNaBarra('inicio'),
            End: () => moverNaBarra('fim'),
            Escape: () => fechar(),
          };
          const acao = acoes[evento.key];
          if (acao) {
            evento.preventDefault();
            acao();
          }
        }}
      >
        {itens.map((item) => {
          const temSubmenu = Boolean(item.submenu?.length);
          const aberto = abertoId === item.id;
          return (
            <div className="citie-menubar__grupo" key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                id={`menubar-${uid}-${item.id}`}
                ref={(elemento) => {
                  itensRef.current[item.id] = elemento;
                }}
                className={`citie-menubar__item${aberto ? ' citie-menubar__item--ativo' : ''}`}
                tabIndex={item.id === focoId ? 0 : -1}
                aria-haspopup={temSubmenu ? 'menu' : undefined}
                aria-expanded={temSubmenu ? aberto : undefined}
                aria-disabled={item.disabled || undefined}
                onFocus={() => setFocoId(item.id)}
                onClick={() => acionarTopo(item, false)}
                onKeyDown={(evento) => {
                  if (evento.key === 'ArrowDown' && temSubmenu) {
                    evento.preventDefault();
                    evento.stopPropagation();
                    setAbertoId(item.id);
                    setAninhadoId(null);
                    setFocarPrimeiro(true);
                  }
                  if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    evento.stopPropagation();
                    acionarTopo(item, true);
                  }
                }}
              >
                {item.icone ? (
                  <span className="citie-menubar__icone" aria-hidden="true">
                    {item.icone}
                  </span>
                ) : null}
                {item.rotulo}
                {temSubmenu ? <SetaBaixo aberta={aberto} /> : null}
              </button>

              {aberto && itemAberto?.submenu ? (
                <div
                  ref={submenuRef}
                  className="citie-menubar__submenu"
                  role="menu"
                  aria-label={item.rotulo}
                  onKeyDown={(evento) => {
                    const alvos = Array.from(
                      submenuRef.current?.querySelectorAll<HTMLButtonElement>(
                        ':scope > [role="menuitem"], :scope > [role="none"] > [role="menuitem"]',
                      ) ?? [],
                    );
                    const atual = alvos.indexOf(document.activeElement as HTMLButtonElement);
                    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
                      evento.preventDefault();
                      evento.stopPropagation();
                      const passo = evento.key === 'ArrowDown' ? 1 : -1;
                      alvos[(atual + passo + alvos.length) % alvos.length]?.focus();
                      setAninhadoId(null);
                    }
                    if (evento.key === 'Escape') {
                      evento.preventDefault();
                      evento.stopPropagation();
                      fechar();
                    }
                    if (evento.key === 'Tab') fechar(false);
                  }}
                >
                  {itemAberto.submenu.map((filho) => (
                    <ItemDeSubmenu
                      key={filho.id}
                      item={filho}
                      aninhadoAberto={aninhadoId === filho.id}
                      aoAbrirAninhado={(id) => setAninhadoId(id)}
                      aoSelecionar={() => {
                        fechar();
                        filho.onSelecionar?.();
                      }}
                      aoSairPelaLateral={(direcao) => moverNaBarra(direcao)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {fim ? <div className="citie-menubar__fim">{fim}</div> : null}
    </div>
  );
}

interface ItemDeSubmenuInternoProps {
  item: ItemDeSubmenuProps;
  aninhadoAberto: boolean;
  aoAbrirAninhado: (id: string | null) => void;
  aoSelecionar: () => void;
  aoSairPelaLateral: (passo: number) => void;
}

function ItemDeSubmenu({
  item,
  aninhadoAberto,
  aoAbrirAninhado,
  aoSelecionar,
  aoSairPelaLateral,
}: ItemDeSubmenuInternoProps) {
  const temAninhado = Boolean(item.submenu?.length);
  const aninhadoRef = useRef<HTMLDivElement>(null);

  const conteudo = (
    <button
      type="button"
      role="menuitem"
      className="citie-menubar__opcao"
      tabIndex={-1}
      aria-haspopup={temAninhado ? 'menu' : undefined}
      aria-expanded={temAninhado ? aninhadoAberto : undefined}
      aria-disabled={item.disabled || undefined}
      onClick={() => {
        if (item.disabled) return;
        if (temAninhado) {
          aoAbrirAninhado(aninhadoAberto ? null : item.id);
          return;
        }
        aoSelecionar();
      }}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          evento.stopPropagation();
          if (item.disabled) return;
          if (temAninhado) {
            aoAbrirAninhado(item.id);
            return;
          }
          aoSelecionar();
        }
        if (evento.key === 'ArrowRight') {
          evento.preventDefault();
          evento.stopPropagation();
          if (temAninhado) {
            aoAbrirAninhado(item.id);
            // O foco entra no aninhado depois que ele existe no DOM.
            requestAnimationFrame(() =>
              aninhadoRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus(),
            );
            return;
          }
          aoSairPelaLateral(1);
        }
        if (evento.key === 'ArrowLeft') {
          evento.preventDefault();
          evento.stopPropagation();
          aoSairPelaLateral(-1);
        }
      }}
    >
      {item.icone ? (
        <span className="citie-menubar__icone" aria-hidden="true">
          {item.icone}
        </span>
      ) : null}
      {item.rotulo}
      {temAninhado ? <SetaDireita /> : null}
    </button>
  );

  if (!temAninhado) return conteudo;

  return (
    <div className="citie-menubar__grupo-aninhado" role="none">
      {conteudo}
      {aninhadoAberto ? (
        <div
          ref={aninhadoRef}
          className="citie-menubar__submenu citie-menubar__submenu--aninhado"
          role="menu"
          aria-label={item.rotulo}
          onKeyDown={(evento) => {
            const alvos = Array.from(
              aninhadoRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
            );
            const atual = alvos.indexOf(document.activeElement as HTMLButtonElement);
            if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
              evento.preventDefault();
              evento.stopPropagation();
              const passo = evento.key === 'ArrowDown' ? 1 : -1;
              alvos[(atual + passo + alvos.length) % alvos.length]?.focus();
            }
          }}
        >
          {item.submenu?.map((neto) => (
            <button
              key={neto.id}
              type="button"
              role="menuitem"
              className="citie-menubar__opcao"
              tabIndex={-1}
              aria-disabled={neto.disabled || undefined}
              onClick={() => {
                if (neto.disabled) return;
                aoSelecionar();
                neto.onSelecionar?.();
              }}
            >
              {neto.rotulo}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SetaBaixo({ aberta }: { aberta: boolean }) {
  return (
    <svg
      className={`citie-menubar__seta${aberta ? ' citie-menubar__seta--aberta' : ''}`}
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

function SetaDireita() {
  return (
    <svg
      className="citie-menubar__seta citie-menubar__seta--direita"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4.25 2.5 7.75 6l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
