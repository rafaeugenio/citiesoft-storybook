import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import './ToggleGroup.css';

export type PeleToggleGroup = 'outlined' | 'ghost';
export type TamanhoToggleGroup = 'default' | 'small' | 'mini';

export interface ItemDoToggleGroup {
  valor: string;
  rotulo: string;
  icone?: ReactNode;
  desabilitado?: boolean;
}

interface CamposComuns {
  /** Nome do grupo, anunciado ao leitor de tela ("Alinhamento do texto"). */
  rotulo: string;
  itens: ItemDoToggleGroup[];
  pele?: PeleToggleGroup;
  tamanho?: TamanhoToggleGroup;
}

export interface ToggleGroupUnicaProps extends CamposComuns {
  tipo?: 'unica';
  valor: string | null;
  onChange: (valor: string) => void;
}

export interface ToggleGroupMultiplaProps extends CamposComuns {
  tipo: 'multipla';
  valor: string[];
  onChange: (valor: string[]) => void;
}

export type ToggleGroupProps = ToggleGroupUnicaProps | ToggleGroupMultiplaProps;

/**
 * ToggleGroup: segmentos de botão exclusivos ou independentes, na anatomia
 * de junção do `ButtonGroup` (raio 10 só nas pontas, borda compartilhada na
 * pele `outlined`), com a pele do estado ativo do kit (`accent-forte` com
 * `text-primary`, o "accent 2", Lote 0).
 *
 * `tipo="unica"` publica `role="radiogroup"` com roving tabindex, o padrão
 * ARIA de radiogroup: só o item selecionado (ou o primeiro, sem seleção)
 * fica no fluxo de tab, e as setas movem o foco E selecionam, como um grupo
 * de rádio nativo. `tipo="multipla"` publica `role="group"` com
 * `aria-pressed` por botão: todo item permanece tabulável, e as setas só
 * movem o foco, sem selecionar, porque cada botão já alterna com Enter e
 * Espaço por conta própria.
 */
export function ToggleGroup(props: ToggleGroupProps) {
  const { rotulo, itens, pele = 'outlined', tamanho = 'default' } = props;
  const multipla = props.tipo === 'multipla';
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const selecionados = multipla ? (props.valor as string[]) : null;

  function estaSelecionado(valorItem: string) {
    return multipla ? (selecionados as string[]).includes(valorItem) : props.valor === valorItem;
  }

  function selecionar(valorItem: string) {
    if (multipla) {
      const atual = selecionados as string[];
      const proximo = atual.includes(valorItem)
        ? atual.filter((v) => v !== valorItem)
        : [...atual, valorItem];
      (props as ToggleGroupMultiplaProps).onChange(proximo);
    } else {
      (props as ToggleGroupUnicaProps).onChange(valorItem);
    }
  }

  const habilitados = itens
    .map((item, indice) => ({ item, indice }))
    .filter(({ item }) => !item.desabilitado);

  const indiceComFoco = multipla
    ? null
    : (itens.findIndex((item) => item.valor === props.valor && !item.desabilitado) ??
      -1) >= 0
      ? itens.findIndex((item) => item.valor === props.valor && !item.desabilitado)
      : (habilitados[0]?.indice ?? -1);

  function moverFoco(indiceAtual: number, direcao: 1 | -1) {
    const posicao = habilitados.findIndex(({ indice }) => indice === indiceAtual);
    if (posicao === -1 || habilitados.length === 0) return;
    const proximaPosicao = (posicao + direcao + habilitados.length) % habilitados.length;
    const proximoIndice = habilitados[proximaPosicao].indice;
    refs.current[proximoIndice]?.focus();
    if (!multipla) selecionar(itens[proximoIndice].valor);
  }

  function aoTeclar(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
      evento.preventDefault();
      moverFoco(indice, 1);
    } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      moverFoco(indice, -1);
    } else if (evento.key === 'Home' && habilitados.length > 0) {
      evento.preventDefault();
      const primeiro = habilitados[0].indice;
      refs.current[primeiro]?.focus();
      if (!multipla) selecionar(itens[primeiro].valor);
    } else if (evento.key === 'End' && habilitados.length > 0) {
      evento.preventDefault();
      const ultimo = habilitados[habilitados.length - 1].indice;
      refs.current[ultimo]?.focus();
      if (!multipla) selecionar(itens[ultimo].valor);
    }
  }

  return (
    <div
      role={multipla ? 'group' : 'radiogroup'}
      aria-label={rotulo}
      className={`citie-toggle-group citie-toggle-group--${pele} citie-toggle-group--${tamanho}`}
    >
      {itens.map((item, indice) => {
        const selecionado = estaSelecionado(item.valor);
        const tabulavel = multipla ? true : indice === indiceComFoco;

        return (
          <button
            key={item.valor}
            ref={(el) => {
              refs.current[indice] = el;
            }}
            type="button"
            role={multipla ? undefined : 'radio'}
            aria-pressed={multipla ? selecionado : undefined}
            aria-checked={multipla ? undefined : selecionado}
            tabIndex={tabulavel ? 0 : -1}
            disabled={item.desabilitado}
            className={`citie-toggle-group__item${
              selecionado ? ' citie-toggle-group__item--ativo' : ''
            }`}
            onClick={() => selecionar(item.valor)}
            onKeyDown={(evento) => aoTeclar(evento, indice)}
          >
            {item.icone ? (
              <span className="citie-toggle-group__icone" aria-hidden="true">
                {item.icone}
              </span>
            ) : null}
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}
