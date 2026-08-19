import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './MegaMenu.css';

/**
 * MegaMenu — port da página `❖ MegaMenu` do Figma CitieOne (6738:52938),
 * fileKey `B6fM1Aig3uPIvQ6amLObZC`. Equivalente PrimeNG: `p-megamenu`.
 *
 * Variantes do arquivo que este componente respeita:
 * - Component set `megamenu`: `Orientation` (Horizontal | Vertical) e
 *   `Overlay` (True | False) → props `orientacao` e `sobreposto`.
 * - Component set `megamenu-item`: `State` (Idle | Hover | Focus | Active),
 *   `Show Icon` e `Show Submenu Icon` → estados de CSS, prop `icone` e a seta
 *   de submenu, desenhada só no item de topo que abre painel.
 * - Partes `megamenu-submenu-label` e `megamenu-submenu` → título e coluna do
 *   painel.
 *
 * Cor, tipografia, raio e espaçamento vêm dos tokens Citiesoft, não do Figma
 * (o CitieOne ainda carrega a paleta Aura).
 */

export interface ItemDoPainel {
  id: string;
  rotulo: string;
  href?: string;
  icone?: ReactNode;
  /** Linha de apoio abaixo do rótulo, para item cujo nome não se explica sozinho. */
  descricao?: string;
}

export interface ColunaDoPainel {
  id: string;
  /** Vira o `aria-labelledby` do `role="group"` da coluna. */
  titulo: string;
  itens: ItemDoPainel[];
}

export interface ItemDeTopo {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  colunas: ColunaDoPainel[];
}

export interface MegaMenuProps {
  /** Nome acessível da barra. Ex.: "Menu de módulos". */
  label: string;
  itens: ItemDeTopo[];
  /** `Orientation` do Figma: barra em linha ou barra em coluna. */
  orientacao?: 'horizontal' | 'vertical';
  /** `Overlay` do Figma: painel flutua sobre o conteúdo (true) ou ocupa espaço (false). */
  sobreposto?: boolean;
  /** Item de topo aberto no primeiro render, para a story de estado aberto. */
  abertoInicial?: string;
  onSelecionar?: (idDoItem: string, idDoTopo: string) => void;
}

/** Seta do item de topo (`Show Submenu Icon` do Figma). */
function SetaDeSubmenu() {
  return (
    <svg className="citie-megamenu__seta" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path d="M2.5 4.25 6 7.75l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MegaMenu({
  label,
  itens,
  orientacao = 'horizontal',
  sobreposto = true,
  abertoInicial,
  onSelecionar,
}: MegaMenuProps) {
  const idBase = useId();
  const [aberto, setAberto] = useState<string | null>(abertoInicial ?? null);
  const [focado, setFocado] = useState(0);

  const raizRef = useRef<HTMLElement | null>(null);
  const painelRef = useRef<HTMLDivElement | null>(null);
  const topoRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focarTopo = useCallback((indice: number) => {
    setFocado(indice);
    topoRefs.current[indice]?.focus();
  }, []);

  const fechar = useCallback(
    (devolverFoco: boolean) => {
      setAberto(null);
      if (devolverFoco) topoRefs.current[focado]?.focus();
    },
    [focado],
  );

  // Clique fora fecha sem devolver o foco: o ponteiro já saiu do menu.
  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (raizRef.current && !raizRef.current.contains(evento.target as Node)) setAberto(null);
    }
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [aberto]);

  /** Colunas do painel na ordem do DOM, cada uma com seus itens focáveis. */
  function colunasDoPainel(): HTMLElement[][] {
    const painel = painelRef.current;
    if (!painel) return [];
    return Array.from(painel.querySelectorAll('[role="group"]')).map((grupo) =>
      Array.from(grupo.querySelectorAll<HTMLElement>('[role="menuitem"]')),
    );
  }

  function abrirEEntrar(indice: number) {
    setAberto(itens[indice].id);
    // O painel só existe depois do render, então o foco espera o próximo quadro.
    requestAnimationFrame(() => colunasDoPainel()[0]?.[0]?.focus());
  }

  const teclaAnterior = orientacao === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
  const teclaProxima = orientacao === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const teclaDeEntrada = orientacao === 'vertical' ? 'ArrowRight' : 'ArrowDown';

  function aoTeclarNaBarra(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    switch (evento.key) {
      case teclaProxima:
        evento.preventDefault();
        focarTopo((indice + 1) % itens.length);
        break;
      case teclaAnterior:
        evento.preventDefault();
        focarTopo((indice - 1 + itens.length) % itens.length);
        break;
      case teclaDeEntrada:
        evento.preventDefault();
        abrirEEntrar(indice);
        break;
      case 'Home':
        evento.preventDefault();
        focarTopo(0);
        break;
      case 'End':
        evento.preventDefault();
        focarTopo(itens.length - 1);
        break;
      case 'Escape':
        if (aberto) {
          evento.preventDefault();
          fechar(true);
        }
        break;
      default:
        break;
    }
  }

  function aoTeclarNoPainel(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      fechar(true);
      return;
    }
    if (evento.key === 'Tab') {
      // Tab sai do menu inteiro, como manda o padrão de menubar.
      setAberto(null);
      return;
    }

    const colunas = colunasDoPainel();
    const alvo = evento.target as HTMLElement;
    const coluna = colunas.findIndex((itensDaColuna) => itensDaColuna.includes(alvo));
    if (coluna < 0) return;
    const linha = colunas[coluna].indexOf(alvo);

    switch (evento.key) {
      case 'ArrowDown': {
        evento.preventDefault();
        const proxima = colunas[coluna];
        proxima[(linha + 1) % proxima.length].focus();
        break;
      }
      case 'ArrowUp': {
        evento.preventDefault();
        const atual = colunas[coluna];
        if (linha === 0) {
          // Do topo da primeira coluna o foco volta para o item de topo.
          topoRefs.current[focado]?.focus();
        } else {
          atual[linha - 1].focus();
        }
        break;
      }
      case 'ArrowRight': {
        evento.preventDefault();
        const destino = colunas[(coluna + 1) % colunas.length];
        destino[Math.min(linha, destino.length - 1)].focus();
        break;
      }
      case 'ArrowLeft': {
        evento.preventDefault();
        const destino = colunas[(coluna - 1 + colunas.length) % colunas.length];
        destino[Math.min(linha, destino.length - 1)].focus();
        break;
      }
      case 'Home':
        evento.preventDefault();
        colunas[coluna][0].focus();
        break;
      case 'End': {
        evento.preventDefault();
        const atual = colunas[coluna];
        atual[atual.length - 1].focus();
        break;
      }
      default:
        break;
    }
  }

  const itemAberto = itens.find((item) => item.id === aberto) ?? null;

  return (
    <nav
      ref={raizRef}
      className={`citie-megamenu citie-megamenu--${orientacao}${
        sobreposto ? ' citie-megamenu--sobreposto' : ' citie-megamenu--embutido'
      }`}
      aria-label={label}
    >
      {/*
        A landmark de navegação e a barra de menu são nomeadas as duas: o leitor
        de tela anuncia primeiro a região, depois a barra dentro dela.
      */}
      <div
        className="citie-megamenu__barra"
        role="menubar"
        aria-label={label}
        aria-orientation={orientacao}
      >
        {itens.map((item, indice) => {
          const estaAberto = item.id === aberto;
          return (
            <button
              key={item.id}
              type="button"
              ref={(elemento) => {
                topoRefs.current[indice] = elemento;
              }}
              role="menuitem"
              className={`citie-megamenu__topo${estaAberto ? ' citie-megamenu__topo--ativo' : ''}`}
              aria-haspopup="true"
              aria-expanded={estaAberto}
              aria-controls={estaAberto ? `${idBase}-painel` : undefined}
              // Roving tabindex: a barra inteira é uma parada de Tab só.
              tabIndex={indice === focado ? 0 : -1}
              onFocus={() => setFocado(indice)}
              onKeyDown={(evento) => aoTeclarNaBarra(evento, indice)}
              onClick={() => setAberto(estaAberto ? null : item.id)}
            >
              {item.icone ? (
                <span className="citie-megamenu__icone" aria-hidden="true">
                  {item.icone}
                </span>
              ) : null}
              <span className="citie-megamenu__rotulo">{item.rotulo}</span>
              <SetaDeSubmenu />
            </button>
          );
        })}
      </div>

      {itemAberto ? (
        <div
          ref={painelRef}
          id={`${idBase}-painel`}
          className="citie-megamenu__painel"
          // `role="menu"` é obrigatório: o axe exige que o `group` de cada coluna
          // esteja dentro de menu ou menubar, senão os `menuitem` de dentro
          // reprovam em `aria-required-parent`.
          role="menu"
          aria-label={itemAberto.rotulo}
          onKeyDown={aoTeclarNoPainel}
        >
          {itemAberto.colunas.map((coluna) => {
            const idDoTitulo = `${idBase}-${itemAberto.id}-${coluna.id}`;
            return (
              // O título fica dentro do próprio group, e não solto dentro do
              // `role="menu"` do painel, onde seria filho sem papel válido.
              <div key={coluna.id} className="citie-megamenu__coluna" role="group" aria-labelledby={idDoTitulo}>
                <p className="citie-megamenu__titulo" id={idDoTitulo}>
                  {coluna.titulo}
                </p>
                {coluna.itens.map((item) => (
                  <a
                    key={item.id}
                    role="menuitem"
                    className="citie-megamenu__item"
                    href={item.href ?? '#'}
                    onClick={(evento) => {
                      if (!item.href) evento.preventDefault();
                      onSelecionar?.(item.id, itemAberto.id);
                      fechar(true);
                    }}
                  >
                    {item.icone ? (
                      <span className="citie-megamenu__icone" aria-hidden="true">
                        {item.icone}
                      </span>
                    ) : null}
                    <span className="citie-megamenu__textos">
                      <span className="citie-megamenu__rotulo">{item.rotulo}</span>
                      {item.descricao ? (
                        <span className="citie-megamenu__descricao">{item.descricao}</span>
                      ) : null}
                    </span>
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
