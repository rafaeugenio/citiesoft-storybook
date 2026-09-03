import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './OrderList.css';

/**
 * OrderList (Figma CitieOne, página ❖ OrderList).
 * O arquivo traz um único componente `orderlist` sem eixos de variante: uma
 * coluna `controls` com quatro botões `Severity: Secondary` + `Icon Only: True`
 * (angle-up, angle-double-up, angle-down, angle-double-down) ao lado de uma
 * instância de `listbox`. Os exemplos cobrem Mode Light e Mode Dark.
 *
 * Reordenar só por arrastar é inacessível, então aqui os botões são o caminho
 * principal: cada um nomeia o item que move e toda reordenação é anunciada em
 * região `aria-live="polite"` com a nova posição.
 */

export interface ItemOrdenavel {
  id: string;
  label: string;
  /** Linha auxiliar sob o rótulo (prazo, responsável, situação). */
  detalhe?: string;
}

export type DirecaoDeMovimento = 'cima' | 'topo' | 'baixo' | 'fim';

export interface OrderListProps {
  /** Rótulo da lista. Nomeia o `listbox` e o conjunto de controles. */
  titulo: string;
  /** Ordem inicial. O componente mantém a ordem em estado interno. */
  itens: ItemOrdenavel[];
  /** Texto auxiliar acima da lista, explicando o que a ordem significa. */
  descricao?: string;
  /** Altura máxima da região rolável, em pixels. */
  altura?: number;
  /** Mostra o número da posição de cada item, para a ordem não depender só do olho. */
  mostrarPosicao?: boolean;
  /** Coluna de controles à direita da lista, como em telas de duas colunas. */
  controlesNaDireita?: boolean;
  disabled?: boolean;
  /** Recebe a nova ordem completa a cada movimento. */
  onChange?: (itens: ItemOrdenavel[]) => void;
}

function IconeCima() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 10L8 6l4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeTopo() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12l4-4 4 4M4 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeBaixo() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeFim() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l4 4 4-4M4 9l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Move o item de `origem` para `destino` devolvendo um novo array. */
function reordenar(lista: ItemOrdenavel[], origem: number, destino: number): ItemOrdenavel[] {
  const copia = [...lista];
  const [movido] = copia.splice(origem, 1);
  copia.splice(destino, 0, movido);
  return copia;
}

export function OrderList({
  titulo,
  itens,
  descricao,
  altura = 220,
  mostrarPosicao = true,
  controlesNaDireita = false,
  disabled = false,
  onChange,
}: OrderListProps) {
  const uid = useId();
  const [ordem, setOrdem] = useState<ItemOrdenavel[]>(itens);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState('');
  const listaRef = useRef<HTMLDivElement>(null);

  const indice = ordem.findIndex((item) => item.id === selecionado);
  const temSelecao = indice >= 0;
  const noTopo = indice === 0;
  const noFim = indice === ordem.length - 1;

  const destinoDe = (direcao: DirecaoDeMovimento) =>
    direcao === 'cima'
      ? indice - 1
      : direcao === 'baixo'
        ? indice + 1
        : direcao === 'topo'
          ? 0
          : ordem.length - 1;

  const podeMover = (direcao: DirecaoDeMovimento) => {
    if (disabled || !temSelecao) return false;
    return direcao === 'cima' || direcao === 'topo' ? !noTopo : !noFim;
  };

  const mover = (direcao: DirecaoDeMovimento, gatilho?: HTMLButtonElement | null) => {
    if (!podeMover(direcao)) return;

    const destino = destinoDe(direcao);
    const item = ordem[indice];
    const proxima = reordenar(ordem, indice, destino);

    setOrdem(proxima);
    // O leitor de tela não percebe a troca de posição sozinho: sem este anúncio
    // o movimento é silencioso para quem não vê a lista.
    setAnuncio(`${item.label} movido para a posição ${destino + 1} de ${proxima.length}.`);
    onChange?.(proxima);

    // Ao chegar na ponta, o botão acionado é desabilitado e levaria o foco
    // junto; o foco então volta para a lista, que continua operável.
    const chegouNaPonta = destino === 0 || destino === proxima.length - 1;
    if (gatilho && chegouNaPonta) listaRef.current?.focus();
  };

  const moverSelecao = (passo: number) => {
    const proximo = temSelecao
      ? ordem[Math.min(ordem.length - 1, Math.max(0, indice + passo))]
      : ordem[passo > 0 ? 0 : ordem.length - 1];
    if (proximo) setSelecionado(proximo.id);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || ordem.length === 0) return;

    // Com Alt a seta move o item; sem Alt ela move apenas a seleção.
    const comAlt = evento.altKey;
    const acoes: Record<string, () => void> = {
      ArrowDown: () => (comAlt ? mover('baixo') : moverSelecao(1)),
      ArrowUp: () => (comAlt ? mover('cima') : moverSelecao(-1)),
      Home: () => (comAlt ? mover('topo') : setSelecionado(ordem[0].id)),
      End: () => (comAlt ? mover('fim') : setSelecionado(ordem[ordem.length - 1].id)),
    };

    const acao = acoes[evento.key];
    if (acao) {
      evento.preventDefault();
      acao();
    }
  };

  const nomeDoBotao = (direcao: DirecaoDeMovimento) => {
    const destinos: Record<DirecaoDeMovimento, string> = {
      cima: 'uma posição para cima',
      topo: 'para o início da lista',
      baixo: 'uma posição para baixo',
      fim: 'para o fim da lista',
    };
    // O nome acessível precisa dizer o que move, não só para onde.
    return temSelecao
      ? `Mover ${ordem[indice].label} ${destinos[direcao]}`
      : `Mover ${destinos[direcao]}: selecione um item da lista`;
  };

  const controles = (
    <div
      className="citie-orderlist__controles"
      role="group"
      aria-label={`Reordenar ${titulo.toLowerCase()}`}
    >
      {(
        [
          ['cima', <IconeCima key="c" />],
          ['topo', <IconeTopo key="t" />],
          ['baixo', <IconeBaixo key="b" />],
          ['fim', <IconeFim key="f" />],
        ] as [DirecaoDeMovimento, ReactNode][]
      ).map(([direcao, icone]) => (
        <Button
          key={direcao}
          variant="outline"
          size="small"
          iconOnly
          icon={icone}
          aria-label={nomeDoBotao(direcao)}
          disabled={!podeMover(direcao)}
          onClick={(evento) => mover(direcao, evento.currentTarget)}
        />
      ))}
    </div>
  );

  const vazia = ordem.length === 0;

  return (
    <div
      className={[
        'citie-orderlist',
        controlesNaDireita ? 'citie-orderlist--controles-direita' : null,
        disabled ? 'citie-orderlist--desabilitada' : null,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="citie-orderlist__titulo" id={`${uid}-titulo`}>
        {titulo}
      </span>
      {descricao ? <p className="citie-orderlist__descricao">{descricao}</p> : null}

      <div className="citie-orderlist__corpo">
        {controles}

        {/*
          Estrutura em div com papéis explícitos, não em ul/li: um elemento sem
          papel entre listbox e option quebra `aria-required-parent`.
        */}
        <div
          ref={listaRef}
          className="citie-orderlist__lista"
          style={{ maxHeight: altura }}
          // Sem itens o papel de listbox seria inválido (exige filhos option),
          // então o container vira região de status com a mensagem de vazio.
          role={vazia ? 'status' : 'listbox'}
          aria-labelledby={`${uid}-titulo`}
          aria-activedescendant={
            !vazia && temSelecao ? `${uid}-item-${ordem[indice].id}` : undefined
          }
          aria-disabled={disabled || undefined}
          // A região rola, então precisa receber foco mesmo desabilitada:
          // `aria-disabled` comunica o estado sem tirar o teclado de quem usa.
          tabIndex={0}
          onKeyDown={aoTeclar}
        >
          {vazia ? (
            <p className="citie-orderlist__vazio">Nenhuma etapa cadastrada para ordenar</p>
          ) : (
            ordem.map((item, posicao) => (
              <div
                key={item.id}
                id={`${uid}-item-${item.id}`}
                role="option"
                aria-selected={item.id === selecionado}
                className={[
                  'citie-orderlist__item',
                  item.id === selecionado ? 'citie-orderlist__item--selecionado' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  if (disabled) return;
                  setSelecionado(item.id);
                }}
              >
                {mostrarPosicao ? (
                  <span className="citie-orderlist__posicao" aria-hidden="true">
                    {posicao + 1}
                  </span>
                ) : null}
                <span className="citie-orderlist__texto">
                  <span className="citie-orderlist__rotulo">{item.label}</span>
                  {item.detalhe ? (
                    <span className="citie-orderlist__detalhe">{item.detalhe}</span>
                  ) : null}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="citie-visualmente-oculto" role="status" aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}
