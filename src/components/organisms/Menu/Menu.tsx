import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Button } from '../../atoms/Button/Button';
import './Menu.css';

/**
 * Menu (Figma CitieOne, página ❖ Menu).
 *
 * Variantes do arquivo respeitadas:
 * - `menu` → Type: Basic | Popup (mais Show Menu e Show Button), aqui o prop `modo`.
 * - `menu-item` → Show Icon, Icon, Text e State: Idle | Hover | Focus.
 * - `menu-submenu-label` → cabeçalho de grupo.
 * - `menu-separator` → régua de 1px entre blocos de ação.
 *
 * Inferências (o arquivo não desenha esses estados): item com atalho, item
 * desabilitado e item destrutivo. Equivalente PrimeNG: `p-menu`.
 *
 * Teclado: setas circulam entre os itens, Home e End vão às pontas, Enter e
 * Espaço acionam, Escape fecha o popup e devolve o foco ao gatilho. Só um item
 * carrega `tabIndex=0` por vez (roving tabindex).
 */

export interface AcaoDoMenu {
  tipo: 'acao';
  id: string;
  rotulo: string;
  /** Ícone à esquerda do rótulo (variante Show Icon do arquivo). */
  icone?: ReactNode;
  /** Atalho de teclado exibido à direita, apenas informativo. */
  atalho?: string;
  /** Continua focável e anunciado, mas não aciona. */
  disabled?: boolean;
  /** Ação destrutiva: recebe cor de perigo mais o ícone, nunca só a cor. */
  destrutivo?: boolean;
  onSelect?: () => void;
}

export interface SeparadorDoMenu {
  tipo: 'separador';
  id: string;
}

export interface GrupoDoMenu {
  tipo: 'grupo';
  id: string;
  rotulo: string;
  itens: AcaoDoMenu[];
}

export type ItemDeMenu = AcaoDoMenu | SeparadorDoMenu | GrupoDoMenu;

export interface MenuProps {
  /** Nome acessível do menu, obrigatório porque o container é um `role="menu"`. */
  label: string;
  itens: ItemDeMenu[];
  /** `inline` é o Type=Basic do arquivo; `popup` é o Type=Popup, com gatilho. */
  modo?: 'inline' | 'popup';
  /** Rótulo do botão que abre o menu no modo popup. */
  rotuloDoGatilho?: string;
  onSelecionar?: (id: string) => void;
}

/** Percorre grupos e itens soltos na ordem visual, ignorando separadores. */
function acoesEmOrdem(itens: ItemDeMenu[]): AcaoDoMenu[] {
  return itens.flatMap((item) => {
    if (item.tipo === 'acao') return [item];
    if (item.tipo === 'grupo') return item.itens;
    return [];
  });
}

export function Menu({
  label,
  itens,
  modo = 'inline',
  rotuloDoGatilho = 'Ações',
  onSelecionar,
}: MenuProps) {
  const uid = useId();
  const acoes = acoesEmOrdem(itens);
  // Se um item do menu tem ícone, todos reservam o líder: sem isso a coluna de
  // texto quebra entre uma linha e outra dentro do mesmo painel.
  const reservaLider = acoes.some((acao) => Boolean(acao.icone));
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState<string>(acoes[0]?.id ?? '');
  const referencias = useRef(new Map<string, HTMLDivElement | null>());
  const gatilho = useRef<HTMLButtonElement>(null);

  // O menu popup só existe no DOM depois de abrir, então o foco inicial é
  // aplicado no efeito, não no clique do gatilho.
  useEffect(() => {
    if (modo === 'popup' && aberto) {
      const primeiro = acoes[0]?.id;
      if (primeiro) {
        setAtivo(primeiro);
        referencias.current.get(primeiro)?.focus();
      }
    }
  }, [aberto, modo]); // eslint-disable-line react-hooks/exhaustive-deps

  const focarItem = (id: string | undefined) => {
    if (!id) return;
    setAtivo(id);
    referencias.current.get(id)?.focus();
  };

  const mover = (passo: number) => {
    if (acoes.length === 0) return;
    const indice = acoes.findIndex((acao) => acao.id === ativo);
    // Circula: da última para a primeira e vice-versa.
    const destino = (indice + passo + acoes.length) % acoes.length;
    focarItem(acoes[destino]?.id);
  };

  const acionar = (acao: AcaoDoMenu) => {
    if (acao.disabled) return;
    acao.onSelect?.();
    onSelecionar?.(acao.id);
    if (modo === 'popup') {
      setAberto(false);
      gatilho.current?.focus();
    }
  };

  const fecharEDevolverFoco = () => {
    setAberto(false);
    gatilho.current?.focus();
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const acaoAtual = acoes.find((acao) => acao.id === ativo);
    const atalhos: Record<string, () => void> = {
      ArrowDown: () => mover(1),
      ArrowUp: () => mover(-1),
      Home: () => focarItem(acoes[0]?.id),
      End: () => focarItem(acoes[acoes.length - 1]?.id),
      Enter: () => acaoAtual && acionar(acaoAtual),
      ' ': () => acaoAtual && acionar(acaoAtual),
      Escape: () => modo === 'popup' && aberto && fecharEDevolverFoco(),
    };
    const tratador = atalhos[evento.key];
    if (tratador) {
      evento.preventDefault();
      tratador();
    }
  };

  const renderizarAcao = (acao: AcaoDoMenu) => (
    <div
      key={acao.id}
      role="menuitem"
      ref={(elemento) => {
        referencias.current.set(acao.id, elemento);
      }}
      // Roving tabindex: um único item entra na ordem de tabulação.
      tabIndex={acao.id === ativo ? 0 : -1}
      aria-disabled={acao.disabled || undefined}
      className={[
        'citie-menu__item',
        acao.disabled ? 'citie-menu__item--desabilitado' : null,
        acao.destrutivo ? 'citie-menu__item--destrutivo' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        setAtivo(acao.id);
        acionar(acao);
      }}
      onFocus={() => setAtivo(acao.id)}
    >
      {reservaLider ? (
        <span className="citie-menu__icone" aria-hidden="true">
          {acao.icone}
        </span>
      ) : null}
      <span className="citie-menu__rotulo">{acao.rotulo}</span>
      {acao.atalho ? <span className="citie-menu__atalho">{acao.atalho}</span> : null}
    </div>
  );

  const lista = (
    <div
      className={reservaLider ? 'citie-menu citie-menu--com-lider' : 'citie-menu'}
      role="menu"
      aria-label={label}
      onKeyDown={aoTeclar}
    >
      {itens.map((item) => {
        if (item.tipo === 'separador') {
          return <div key={item.id} role="separator" className="citie-menu__separador" />;
        }
        if (item.tipo === 'acao') return renderizarAcao(item);

        // O cabeçalho de grupo não pode ser filho sem papel do `role="menu"`:
        // isso quebra `aria-required-parent` dos itens. Vira `role="group"`
        // rotulado pelo próprio cabeçalho.
        return (
          <div key={item.id} role="group" aria-labelledby={`${uid}-${item.id}`}>
            <span
              className="citie-menu__grupo-rotulo"
              id={`${uid}-${item.id}`}
              role="presentation"
            >
              {item.rotulo}
            </span>
            {item.itens.map(renderizarAcao)}
          </div>
        );
      })}
    </div>
  );

  if (modo === 'inline') return lista;

  return (
    <div className="citie-menu-popup">
      <Button
        ref={gatilho}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((estava) => !estava)}
      >
        {rotuloDoGatilho}
      </Button>
      {aberto ? <div className="citie-menu-popup__painel">{lista}</div> : null}
    </div>
  );
}
