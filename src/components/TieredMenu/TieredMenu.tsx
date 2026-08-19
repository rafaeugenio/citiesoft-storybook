import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Button } from '../Button/Button';
import './TieredMenu.css';

/**
 * TieredMenu (Figma CitieOne, página ❖ TieredMenu, nó 6738:52940).
 * Variantes do arquivo respeitadas:
 *  - `tieredmenu` → Level (0 | 1 | 2): a cascata tem três níveis de painel.
 *  - `tieredmenu-item` → State (Idle | Hover | Focus | Active), Show Icon,
 *    Icon, Text e Show Submenu Icon (a seta que indica submenu).
 *  - `tieredmenu-popup` → Menu (True | False): a mesma cascata aberta por um
 *    gatilho, em vez do painel sempre visível.
 *  - `tieredmenu-separator`: linha entre grupos de itens.
 *
 * Cor, tipografia e espaçamento vêm dos tokens Citiesoft, nunca do arquivo do
 * Figma (o kit ainda carrega o azul do PrimeOne/Aura).
 */

export interface ItemDoMenu {
  id: string;
  label: string;
  /** Ícone à esquerda do rótulo (variante Show Icon do item). */
  icone?: ReactNode;
  /** Itens do próximo nível. Presente = a seta de submenu aparece. */
  itens?: ItemDoMenu[];
  disabled?: boolean;
  /** Desenha o `tieredmenu-separator` imediatamente acima deste item. */
  separadorAcima?: boolean;
}

export interface TieredMenuProps {
  itens: ItemDoMenu[];
  /** Nome acessível do painel raiz, por exemplo "Relatórios". */
  ariaLabel: string;
  /** Menu = True do `tieredmenu-popup`: abre por gatilho e devolve o foco a ele. */
  popup?: boolean;
  /** Rótulo do botão que abre o popup. */
  rotuloDoGatilho?: string;
  /** Chamado quando um item folha (sem submenu) é acionado. */
  onSelecionar?: (item: ItemDoMenu) => void;
}

/**
 * O deslocamento vertical de cada submenu é calculado, não medido: o painel
 * abre alinhado ao item que o originou, e para isso a altura de item e de
 * separador precisam bater com o CSS.
 */
const ALTURA_ITEM = 34;
const ALTURA_SEPARADOR = 9;

function SetaDeSubmenu() {
  return (
    <svg
      className="citie-tieredmenu__seta"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function habilitados(lista: ItemDoMenu[]) {
  return lista.filter((item) => !item.disabled);
}

/** Distância do topo do painel até o topo do item, somando separadores. */
function deslocamentoDoItem(lista: ItemDoMenu[], id: string) {
  let total = 0;
  for (const item of lista) {
    if (item.separadorAcima) total += ALTURA_SEPARADOR;
    if (item.id === id) return total;
    total += ALTURA_ITEM;
  }
  return total;
}

export function TieredMenu({
  itens,
  ariaLabel,
  popup = false,
  rotuloDoGatilho = 'Abrir menu',
  onSelecionar,
}: TieredMenuProps) {
  const uid = useId();
  const [aberto, setAberto] = useState(!popup);
  /** Um id por nível: `caminho[n]` é o item aberto do nível `n`. */
  const [caminho, setCaminho] = useState<string[]>([]);
  const [foco, setFoco] = useState<{ nivel: number; id: string } | null>(null);

  const referencias = useRef(new Map<string, HTMLDivElement>());
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const blocoRef = useRef<HTMLDivElement>(null);

  const chave = (nivel: number, id: string) => `${nivel}:${id}`;

  useEffect(() => {
    if (!foco) return;
    referencias.current.get(chave(foco.nivel, foco.id))?.focus();
  }, [foco]);

  useEffect(() => {
    if (!popup || !aberto) return;
    const aoClicarFora = (evento: MouseEvent) => {
      if (!blocoRef.current?.contains(evento.target as Node)) {
        setAberto(false);
        setCaminho([]);
      }
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [popup, aberto]);

  // Monta os painéis visíveis a partir do caminho aberto, acumulando o
  // deslocamento para que cada nível nasça na linha do seu item de origem.
  const niveis: { itens: ItemDoMenu[]; rotulo: string; deslocamento: number }[] = [];
  let listaAtual = itens;
  let rotuloAtual = ariaLabel;
  let deslocamento = 0;
  for (let nivel = 0; ; nivel += 1) {
    niveis.push({ itens: listaAtual, rotulo: rotuloAtual, deslocamento });
    const abertoNoNivel = caminho[nivel];
    const pai = abertoNoNivel ? listaAtual.find((item) => item.id === abertoNoNivel) : undefined;
    if (!pai?.itens?.length) break;
    deslocamento += deslocamentoDoItem(listaAtual, pai.id);
    listaAtual = pai.itens;
    rotuloAtual = pai.label;
  }

  const fecharTudo = () => {
    setCaminho([]);
    if (popup) {
      setAberto(false);
      gatilhoRef.current?.focus();
    }
  };

  const abrirSubmenu = (nivel: number, item: ItemDoMenu) => {
    const primeiro = habilitados(item.itens ?? [])[0];
    setCaminho([...caminho.slice(0, nivel), item.id]);
    if (primeiro) setFoco({ nivel: nivel + 1, id: primeiro.id });
  };

  const acionar = (nivel: number, item: ItemDoMenu) => {
    if (item.disabled) return;
    if (item.itens?.length) {
      abrirSubmenu(nivel, item);
      return;
    }
    onSelecionar?.(item);
    fecharTudo();
  };

  const mover = (nivel: number, lista: ItemDoMenu[], atual: string, passo: number) => {
    const navegaveis = habilitados(lista);
    if (navegaveis.length === 0) return;
    const indice = navegaveis.findIndex((item) => item.id === atual);
    const destino = navegaveis[(indice + passo + navegaveis.length) % navegaveis.length];
    setFoco({ nivel, id: destino.id });
  };

  const aoTeclar = (
    evento: KeyboardEvent<HTMLDivElement>,
    nivel: number,
    lista: ItemDoMenu[],
    item: ItemDoMenu,
  ) => {
    const acoes: Record<string, () => void> = {
      ArrowDown: () => mover(nivel, lista, item.id, 1),
      ArrowUp: () => mover(nivel, lista, item.id, -1),
      Home: () => {
        const primeiro = habilitados(lista)[0];
        if (primeiro) setFoco({ nivel, id: primeiro.id });
      },
      End: () => {
        const navegaveis = habilitados(lista);
        const ultimo = navegaveis[navegaveis.length - 1];
        if (ultimo) setFoco({ nivel, id: ultimo.id });
      },
      ArrowRight: () => {
        if (item.itens?.length && !item.disabled) abrirSubmenu(nivel, item);
      },
      ArrowLeft: () => {
        if (nivel === 0) return;
        const pai = caminho[nivel - 1];
        setCaminho(caminho.slice(0, nivel - 1));
        if (pai) setFoco({ nivel: nivel - 1, id: pai });
      },
      Escape: () => {
        const raiz = caminho[0];
        fecharTudo();
        if (!popup && raiz) setFoco({ nivel: 0, id: raiz });
      },
      Enter: () => acionar(nivel, item),
      ' ': () => acionar(nivel, item),
    };
    const acao = acoes[evento.key];
    if (!acao) return;
    evento.preventDefault();
    acao();
  };

  const cascata = (
    <div className={`citie-tieredmenu${popup ? ' citie-tieredmenu--popup' : ''}`} id={`${uid}-menu`}>
      {niveis.map((nivel, indice) => {
        // Roving tabindex por nível: um único item alcançável por Tab em cada
        // painel, o restante entra pelas setas.
        const paradaDeTab =
          foco?.nivel === indice
            ? foco.id
            : (caminho[indice] ?? habilitados(nivel.itens)[0]?.id ?? '');

        return (
          <div
            key={indice}
            role="menu"
            aria-label={nivel.rotulo}
            className="citie-tieredmenu__painel"
            style={{ marginTop: nivel.deslocamento }}
          >
            {nivel.itens.map((item) => {
              const temSubmenu = Boolean(item.itens?.length);
              const expandido = caminho[indice] === item.id;
              return (
                <Fragment key={item.id}>
                  {item.separadorAcima ? (
                    <div role="separator" className="citie-tieredmenu__separador" />
                  ) : null}
                  <div
                    role="menuitem"
                    ref={(elemento) => {
                      if (elemento) referencias.current.set(chave(indice, item.id), elemento);
                      else referencias.current.delete(chave(indice, item.id));
                    }}
                    tabIndex={paradaDeTab === item.id ? 0 : -1}
                    aria-haspopup={temSubmenu ? 'menu' : undefined}
                    aria-expanded={temSubmenu ? expandido : undefined}
                    aria-disabled={item.disabled || undefined}
                    className={[
                      'citie-tieredmenu__item',
                      expandido ? 'citie-tieredmenu__item--aberto' : null,
                      item.disabled ? 'citie-tieredmenu__item--desabilitado' : null,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => acionar(indice, item)}
                    onMouseEnter={() => {
                      if (item.disabled) return;
                      // Passar o mouse em uma folha fecha os níveis abertos
                      // abaixo dela, como no comportamento em cascata do kit.
                      if (temSubmenu) setCaminho([...caminho.slice(0, indice), item.id]);
                      else setCaminho(caminho.slice(0, indice));
                    }}
                    onKeyDown={(evento) => aoTeclar(evento, indice, nivel.itens, item)}
                  >
                    {item.icone ? (
                      <span className="citie-tieredmenu__icone" aria-hidden="true">
                        {item.icone}
                      </span>
                    ) : null}
                    <span className="citie-tieredmenu__rotulo">{item.label}</span>
                    {temSubmenu ? <SetaDeSubmenu /> : null}
                  </div>
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  if (!popup) return cascata;

  return (
    <div className="citie-tieredmenu-bloco" ref={blocoRef}>
      <Button
        ref={gatilhoRef}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={aberto ? `${uid}-menu` : undefined}
        onClick={() => {
          const proximo = !aberto;
          setAberto(proximo);
          setCaminho([]);
          const primeiro = habilitados(itens)[0];
          if (proximo && primeiro) setFoco({ nivel: 0, id: primeiro.id });
        }}
      >
        {rotuloDoGatilho}
      </Button>
      {aberto ? cascata : null}
    </div>
  );
}
