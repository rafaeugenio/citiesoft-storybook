import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as EventoTecladoReact,
  type MouseEvent as EventoMouseReact,
  type ReactNode,
} from 'react';
import './ContextMenu.css';

/**
 * ContextMenu — página do Figma CitieOne `6738:52934`.
 *
 * Variantes do arquivo cobertas:
 * - `contextmenu` (painel: raio 6, lista com respiro de 4 e itens espaçados de 2);
 * - `contextmenu-item` com os eixos `Show Icon`, `Icon` (swap), `Text`,
 *   `Show Submenu Icon` e `State` (Idle · Hover · Focus · Active);
 * - `contextmenu-separator` (régua de 1px na largura do painel).
 *
 * Inferências além do arquivo: atalho de teclado à direita do rótulo, item
 * destrutivo e item desabilitado. O Figma não desenha esses três, mas o menu de
 * contexto do produto precisa deles (Excluir processo, ação sem permissão).
 *
 * Cor nunca vem do Figma: o kit ainda carrega o azul do PrimeOne. Tudo aqui sai
 * dos tokens Citiesoft.
 */

export interface ItemMenuContexto {
  id: string;
  /** Verbo da ação nomeando o objeto: "Baixar anexos", nunca "Baixar". */
  rotulo: string;
  icone?: ReactNode;
  /** Atalho já formatado, exibido à direita: "Ctrl + O". */
  atalho?: string;
  /** Ação destrutiva: fica vermelha e sempre acompanhada de ícone próprio. */
  perigoso?: boolean;
  desabilitado?: boolean;
  submenu?: ItemMenuContexto[];
  aoSelecionar?: () => void;
}

export interface SeparadorMenuContexto {
  id: string;
  tipo: 'separador';
}

export type EntradaMenuContexto = ItemMenuContexto | SeparadorMenuContexto;

function ehSeparador(entrada: EntradaMenuContexto): entrada is SeparadorMenuContexto {
  return (entrada as SeparadorMenuContexto).tipo === 'separador';
}

interface Ancora {
  x: number;
  y: number;
  /** Borda usada quando o menu não cabe à direita: o painel vira para cá. */
  xAlternativo?: number;
}

const MARGEM_VIEWPORT = 8;

interface PainelMenuProps {
  entradas: EntradaMenuContexto[];
  rotulo: string;
  ancora: Ancora;
  /** Item pai que abriu este painel, marcado como expandido no painel anterior. */
  submenuAbertoId?: string | null;
  /** Muda de valor quando o painel precisa reconquistar o foco. */
  chaveFoco: number;
  /** Item que deve receber o foco quando `chaveFoco` muda; padrão é o primeiro. */
  idFocoDesejado?: string | null;
  aoSelecionar: (item: ItemMenuContexto) => void;
  aoAbrirSubmenu: (item: ItemMenuContexto, gatilho: HTMLElement) => void;
  aoFecharSubmenu?: () => void;
  aoFecharTudo: (devolverFoco: boolean) => void;
  /** Recuar um nível: usado por seta esquerda e Escape dentro do submenu. */
  aoVoltar?: () => void;
}

function PainelMenu({
  entradas,
  rotulo,
  ancora,
  submenuAbertoId = null,
  chaveFoco,
  idFocoDesejado = null,
  aoSelecionar,
  aoAbrirSubmenu,
  aoFecharSubmenu,
  aoFecharTudo,
  aoVoltar,
}: PainelMenuProps) {
  const painelRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [ativo, setAtivo] = useState(0);

  // Separador não recebe foco; item desabilitado recebe (aria-disabled), para o
  // usuário de teclado descobrir que a ação existe mas está indisponível.
  const navegaveis = entradas.filter((entrada): entrada is ItemMenuContexto => !ehSeparador(entrada));

  // Se um item tem ícone, todos reservam o líder: sem isso a coluna de texto
  // quebra de uma linha para a outra dentro do mesmo painel.
  const reservaLider = navegaveis.some((entrada) => Boolean(entrada.icone));

  /**
   * `preventScroll` é obrigatório aqui: o painel é `position: fixed`, e o
   * navegador rolaria a página atrás dele para trazer o item à vista. Essa
   * rolagem dispara o próprio fechamento por scroll e o menu sumia logo depois
   * de abrir, em página longa o bastante para rolar.
   */
  const focar = (indice: number) => {
    itensRef.current[indice]?.focus({ preventScroll: true });
  };

  /**
   * Posição e foco no mesmo efeito de layout, antes da pintura.
   *
   * A correção do lado é escrita direto no nó em vez de virar estado: guardar a
   * posição em `useState` obrigava a esconder o painel no primeiro quadro, e
   * elemento com `visibility: hidden` não aceita `focus()` — o menu abria sem
   * foco no primeiro item.
   */
  useLayoutEffect(() => {
    const painel = painelRef.current;
    if (!painel) return;

    painel.style.left = `${ancora.x}px`;
    painel.style.top = `${ancora.y}px`;

    const { width, height } = painel.getBoundingClientRect();
    let x = ancora.x;
    let y = ancora.y;

    if (x + width > window.innerWidth - MARGEM_VIEWPORT) {
      x = Math.max(MARGEM_VIEWPORT, (ancora.xAlternativo ?? ancora.x) - width);
    }
    if (y + height > window.innerHeight - MARGEM_VIEWPORT) {
      y = Math.max(MARGEM_VIEWPORT, y - height);
    }

    painel.style.left = `${x}px`;
    painel.style.top = `${y}px`;
  }, [ancora]);

  useLayoutEffect(() => {
    const indice = idFocoDesejado
      ? Math.max(0, navegaveis.findIndex((item) => item.id === idFocoDesejado))
      : 0;
    setAtivo(indice);
    focar(indice);
    // `navegaveis` é recriado a cada render; o foco só depende do pedido explícito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveFoco, idFocoDesejado]);

  const mover = (passo: number) => {
    if (navegaveis.length === 0) return;
    const proximo = (ativo + passo + navegaveis.length) % navegaveis.length;
    setAtivo(proximo);
    focar(proximo);
  };

  const irPara = (indice: number) => {
    setAtivo(indice);
    focar(indice);
  };

  const acionar = (item: ItemMenuContexto, gatilho: HTMLElement) => {
    if (item.desabilitado) return;
    if (item.submenu) {
      aoAbrirSubmenu(item, gatilho);
      return;
    }
    aoSelecionar(item);
  };

  const aoTeclar = (evento: EventoTecladoReact<HTMLDivElement>) => {
    const item = navegaveis[ativo];

    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault();
        mover(1);
        break;
      case 'ArrowUp':
        evento.preventDefault();
        mover(-1);
        break;
      case 'Home':
        evento.preventDefault();
        irPara(0);
        break;
      case 'End':
        evento.preventDefault();
        irPara(navegaveis.length - 1);
        break;
      case 'ArrowRight':
        if (item?.submenu && !item.desabilitado) {
          evento.preventDefault();
          const gatilho = itensRef.current[ativo];
          if (gatilho) aoAbrirSubmenu(item, gatilho);
        }
        break;
      case 'ArrowLeft':
        if (aoVoltar) {
          evento.preventDefault();
          aoVoltar();
        }
        break;
      case 'Escape':
        evento.preventDefault();
        if (aoVoltar) aoVoltar();
        else aoFecharTudo(true);
        break;
      case 'Tab':
        // Tab nunca navega dentro do menu: fecha e devolve o foco ao alvo.
        evento.preventDefault();
        aoFecharTudo(true);
        break;
      default:
        break;
    }
  };

  let indiceNavegavel = -1;

  return (
    <div
      ref={painelRef}
      role="menu"
      aria-label={rotulo}
      className={
        reservaLider
          ? 'citie-context-menu__painel citie-context-menu__painel--com-lider'
          : 'citie-context-menu__painel'
      }
      style={{ left: `${ancora.x}px`, top: `${ancora.y}px` }}
      onKeyDown={aoTeclar}
    >
      {entradas.map((entrada) => {
        if (ehSeparador(entrada)) {
          return <div key={entrada.id} role="separator" className="citie-context-menu__separador" />;
        }

        indiceNavegavel += 1;
        const indice = indiceNavegavel;
        const temSubmenu = Boolean(entrada.submenu);

        return (
          <button
            key={entrada.id}
            type="button"
            role="menuitem"
            ref={(elemento) => {
              itensRef.current[indice] = elemento;
            }}
            className={[
              'citie-context-menu__item',
              entrada.perigoso ? 'citie-context-menu__item--perigoso' : '',
              entrada.desabilitado ? 'citie-context-menu__item--desabilitado' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            tabIndex={indice === ativo ? 0 : -1}
            aria-haspopup={temSubmenu ? 'menu' : undefined}
            aria-expanded={temSubmenu ? submenuAbertoId === entrada.id : undefined}
            aria-disabled={entrada.desabilitado || undefined}
            onClick={(evento) => acionar(entrada, evento.currentTarget)}
            onMouseEnter={() => {
              // Passar o mouse só destaca. Submenu abre por clique ou seta
              // direita, para o ponteiro não empurrar o foco sem intenção.
              irPara(indice);
              if (!temSubmenu) aoFecharSubmenu?.();
            }}
          >
            {reservaLider ? (
              <span className="citie-context-menu__icone" aria-hidden="true">
                {entrada.icone}
              </span>
            ) : null}

            <span className="citie-context-menu__rotulo">{entrada.rotulo}</span>

            {entrada.atalho ? (
              <span className="citie-context-menu__atalho">{entrada.atalho}</span>
            ) : null}

            {temSubmenu ? (
              <svg
                className="citie-context-menu__seta"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export interface ContextMenuProps {
  itens: EntradaMenuContexto[];
  /** Nome acessível do menu: "Ações do processo 2025/0481". */
  rotulo: string;
  /** Área que responde ao botão direito. */
  children: ReactNode;
}

export function ContextMenu({ itens, rotulo, children }: ContextMenuProps) {
  const raizRef = useRef<HTMLDivElement>(null);
  const alvoRef = useRef<HTMLDivElement>(null);
  const instrucaoId = useId();

  const [ancora, setAncora] = useState<Ancora | null>(null);
  // Cada nível tem a própria chave: abrir o submenu não pode fazer o painel raiz
  // roubar o foco de volta.
  const [chaveFocoRaiz, setChaveFocoRaiz] = useState(0);
  const [chaveFocoSubmenu, setChaveFocoSubmenu] = useState(0);
  const [submenu, setSubmenu] = useState<{ item: ItemMenuContexto; ancora: Ancora } | null>(null);
  const [idFocoRaiz, setIdFocoRaiz] = useState<string | null>(null);

  const aberto = ancora !== null;

  const fechar = useCallback((devolverFoco: boolean) => {
    setAncora(null);
    setSubmenu(null);
    setIdFocoRaiz(null);
    if (devolverFoco) alvoRef.current?.focus({ preventScroll: true });
  }, []);

  const abrir = (novaAncora: Ancora) => {
    setSubmenu(null);
    setIdFocoRaiz(null);
    setAncora(novaAncora);
    setChaveFocoRaiz((valor) => valor + 1);
  };

  useEffect(() => {
    if (!aberto) return;

    const aoApontarFora = (evento: PointerEvent) => {
      if (!raizRef.current?.contains(evento.target as Node)) fechar(false);
    };
    // Rolagem da página invalida a âncora presa ao ponto do cursor: o menu
    // fecha. Rolagem dentro do próprio menu (lista longa) não conta.
    const aoRolar = (evento: Event) => {
      // O mesmo handler atende `scroll` e `resize`. No `resize` o alvo é o
      // `window`, que não é um `Node`, e `contains` lança TypeError com ele.
      // Só faz sentido perguntar se o alvo está dentro do menu quando o alvo é
      // de fato um nó do documento.
      const alvo = evento.target;
      if (alvo instanceof Node && raizRef.current?.contains(alvo)) return;
      fechar(false);
    };

    document.addEventListener('pointerdown', aoApontarFora, true);
    window.addEventListener('scroll', aoRolar, true);
    window.addEventListener('resize', aoRolar);

    return () => {
      document.removeEventListener('pointerdown', aoApontarFora, true);
      window.removeEventListener('scroll', aoRolar, true);
      window.removeEventListener('resize', aoRolar);
    };
  }, [aberto, fechar]);

  const aoBotaoDireito = (evento: EventoMouseReact<HTMLDivElement>) => {
    evento.preventDefault();
    abrir({ x: evento.clientX, y: evento.clientY });
  };

  const aoTeclarNoAlvo = (evento: EventoTecladoReact<HTMLDivElement>) => {
    // Alternativa de teclado ao botão direito: tecla de menu de contexto e
    // Shift + F10. Aqui a âncora é o elemento focado, não o cursor.
    const pediuMenu = evento.key === 'ContextMenu' || (evento.shiftKey && evento.key === 'F10');
    if (!pediuMenu) return;

    evento.preventDefault();
    const retangulo = evento.currentTarget.getBoundingClientRect();
    abrir({ x: retangulo.left + 8, y: retangulo.bottom + 4 });
  };

  const abrirSubmenu = (item: ItemMenuContexto, gatilho: HTMLElement) => {
    const retangulo = gatilho.getBoundingClientRect();
    setSubmenu({
      item,
      ancora: { x: retangulo.right - 2, y: retangulo.top - 4, xAlternativo: retangulo.left + 2 },
    });
    setChaveFocoSubmenu((valor) => valor + 1);
  };

  const voltarDoSubmenu = () => {
    const idPai = submenu?.item.id ?? null;
    setSubmenu(null);
    setIdFocoRaiz(idPai);
    setChaveFocoRaiz((valor) => valor + 1);
  };

  return (
    <div className="citie-context-menu" ref={raizRef}>
      <div
        ref={alvoRef}
        className="citie-context-menu__alvo"
        tabIndex={0}
        aria-describedby={instrucaoId}
        onContextMenu={aoBotaoDireito}
        onKeyDown={aoTeclarNoAlvo}
      >
        {children}
      </div>

      <span id={instrucaoId} className="citie-visualmente-oculto">
        Pressione a tecla de menu de contexto ou Shift + F10 para abrir as ações.
      </span>

      {ancora ? (
        <PainelMenu
          entradas={itens}
          rotulo={rotulo}
          ancora={ancora}
          submenuAbertoId={submenu?.item.id ?? null}
          chaveFoco={chaveFocoRaiz}
          idFocoDesejado={idFocoRaiz}
          aoSelecionar={(item) => {
            fechar(true);
            item.aoSelecionar?.();
          }}
          aoAbrirSubmenu={abrirSubmenu}
          aoFecharSubmenu={() => setSubmenu(null)}
          aoFecharTudo={fechar}
        />
      ) : null}

      {submenu ? (
        <PainelMenu
          entradas={submenu.item.submenu ?? []}
          rotulo={submenu.item.rotulo}
          ancora={submenu.ancora}
          chaveFoco={chaveFocoSubmenu}
          aoSelecionar={(item) => {
            fechar(true);
            item.aoSelecionar?.();
          }}
          aoAbrirSubmenu={() => undefined}
          aoFecharTudo={fechar}
          aoVoltar={voltarDoSubmenu}
        />
      ) : null}
    </div>
  );
}
