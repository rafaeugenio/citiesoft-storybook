import { useId, useMemo, useState } from 'react';
import { Button } from '../Button/Button';
import './PickList.css';

/**
 * PickList (Figma CitieOne, página ❖ PickList, nó `picklist`).
 * O arquivo traz um único componente sem eixos de variante: cinco colunas na
 * ordem `controls` · `listbox` · `controls` · `listbox` · `controls`, onde as
 * colunas das pontas reordenam (subir, topo, descer, fim) e a coluna central
 * transfere (um para a direita, todos para a direita, todos para a esquerda,
 * um para a esquerda). As duas listas são instâncias do mesmo `listbox` do kit.
 *
 * Arrastar não é caminho acessível, então os botões são a via principal de
 * transferência e cada movimento é anunciado em região `aria-live="polite"`
 * com a contagem resultante das duas listas.
 *
 * Equivalente PrimeNG: `p-pickList`.
 */

export interface ItemDaPickList {
  value: string;
  label: string;
  /** Linha secundária do item, como matrícula ou município. */
  descricao?: string;
}

export interface PickListProps {
  /** Nome acessível da lista de origem, ex.: "Perfis disponíveis". */
  rotuloOrigem: string;
  /** Nome acessível da lista de destino, ex.: "Perfis atribuídos". */
  rotuloDestino: string;
  itensOrigem: ItemDaPickList[];
  itensDestino: ItemDaPickList[];
  /** Nome do conjunto inteiro, lido antes das duas listas. */
  legenda: string;
  /** Colunas das pontas do Figma: reordenar dentro da própria lista. */
  comReordenacao?: boolean;
  disabled?: boolean;
  altura?: number;
  onChange?: (origem: ItemDaPickList[], destino: ItemDaPickList[]) => void;
}

type Lado = 'origem' | 'destino';

const IconeSeta = ({ direcao }: { direcao: 'esquerda' | 'direita' | 'cima' | 'baixo' }) => {
  const rotacao = { direita: 0, baixo: 90, esquerda: 180, cima: 270 }[direcao];
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M6 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`rotate(${rotacao} 8 8)`}
      />
    </svg>
  );
};

const IconeSetaDupla = ({ direcao }: { direcao: 'esquerda' | 'direita' | 'cima' | 'baixo' }) => {
  const rotacao = { direita: 0, baixo: 90, esquerda: 180, cima: 270 }[direcao];
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`rotate(${rotacao} 8 8)`}
      >
        <path d="M3 3l5 5-5 5" />
        <path d="M8 3l5 5-5 5" />
      </g>
    </svg>
  );
};

const plural = (quantidade: number) => (quantidade === 1 ? 'item' : 'itens');
const movidos = (quantidade: number) => (quantidade === 1 ? 'item movido' : 'itens movidos');

export function PickList({
  rotuloOrigem,
  rotuloDestino,
  itensOrigem,
  itensDestino,
  legenda,
  comReordenacao = false,
  disabled = false,
  altura = 260,
  onChange,
}: PickListProps) {
  const uid = useId();
  const [origem, setOrigem] = useState<ItemDaPickList[]>(itensOrigem);
  const [destino, setDestino] = useState<ItemDaPickList[]>(itensDestino);
  const [selecao, setSelecao] = useState<Record<Lado, string[]>>({ origem: [], destino: [] });
  const [ativo, setAtivo] = useState<Record<Lado, string>>({
    origem: itensOrigem[0]?.value ?? '',
    destino: itensDestino[0]?.value ?? '',
  });
  const [anuncio, setAnuncio] = useState('');

  const listas = useMemo<Record<Lado, ItemDaPickList[]>>(
    () => ({ origem, destino }),
    [origem, destino],
  );

  const rotulos: Record<Lado, string> = { origem: rotuloOrigem, destino: rotuloDestino };

  const aplicar = (proximaOrigem: ItemDaPickList[], proximoDestino: ItemDaPickList[]) => {
    setOrigem(proximaOrigem);
    setDestino(proximoDestino);
    onChange?.(proximaOrigem, proximoDestino);
  };

  const transferir = (de: Lado, todos: boolean) => {
    const para: Lado = de === 'origem' ? 'destino' : 'origem';
    const candidatos = todos
      ? listas[de]
      : listas[de].filter((item) => selecao[de].includes(item.value));
    if (candidatos.length === 0) return;

    const chaves = candidatos.map((item) => item.value);
    const restante = listas[de].filter((item) => !chaves.includes(item.value));
    const recebedor = [...listas[para], ...candidatos];

    const proximas: Record<Lado, ItemDaPickList[]> = { origem: [], destino: [] };
    proximas[de] = restante;
    proximas[para] = recebedor;
    aplicar(proximas.origem, proximas.destino);

    setSelecao({ ...selecao, [de]: [] });
    setAtivo({ ...ativo, [de]: restante[0]?.value ?? '', [para]: chaves[0] });
    setAnuncio(
      `${candidatos.length} ${movidos(candidatos.length)} para ${rotulos[para]}. ` +
        `${rotuloOrigem}: ${proximas.origem.length} ${plural(proximas.origem.length)}. ` +
        `${rotuloDestino}: ${proximas.destino.length} ${plural(proximas.destino.length)}.`,
    );
  };

  const reordenar = (lado: Lado, modo: 'subir' | 'topo' | 'descer' | 'fim') => {
    const marcados = selecao[lado];
    if (marcados.length === 0) return;

    const atual = listas[lado];
    const escolhidos = atual.filter((item) => marcados.includes(item.value));
    const outros = atual.filter((item) => !marcados.includes(item.value));
    let proxima = atual;

    if (modo === 'topo') proxima = [...escolhidos, ...outros];
    else if (modo === 'fim') proxima = [...outros, ...escolhidos];
    else {
      // Passo unitário: percorre na direção do movimento para que blocos
      // contíguos deslizem juntos em vez de se atropelarem.
      proxima = [...atual];
      const passo = modo === 'subir' ? -1 : 1;
      const indices = proxima
        .map((item, indice) => ({ item, indice }))
        .filter(({ item }) => marcados.includes(item.value))
        .map(({ indice }) => indice);
      const ordem = modo === 'subir' ? indices : [...indices].reverse();
      for (const indice of ordem) {
        const alvo = indice + passo;
        if (alvo < 0 || alvo >= proxima.length) break;
        if (marcados.includes(proxima[alvo].value)) continue;
        [proxima[indice], proxima[alvo]] = [proxima[alvo], proxima[indice]];
      }
    }

    aplicar(lado === 'origem' ? proxima : origem, lado === 'destino' ? proxima : destino);
    const posicao = proxima.findIndex((item) => marcados.includes(item.value)) + 1;
    setAnuncio(
      `${marcados.length} ${plural(marcados.length)} reordenados em ${rotulos[lado]}. ` +
        `Primeiro selecionado na posição ${posicao} de ${proxima.length}.`,
    );
  };

  const alternarSelecao = (lado: Lado, valor: string) => {
    if (disabled) return;
    const marcados = selecao[lado];
    const proximos = marcados.includes(valor)
      ? marcados.filter((item) => item !== valor)
      : [...marcados, valor];
    setSelecao({ ...selecao, [lado]: proximos });
    setAtivo({ ...ativo, [lado]: valor });
  };

  const navegar = (lado: Lado, passo: number | 'inicio' | 'fim') => {
    const itens = listas[lado];
    if (itens.length === 0) return;
    const indice = itens.findIndex((item) => item.value === ativo[lado]);
    const destinoIndice =
      passo === 'inicio'
        ? 0
        : passo === 'fim'
          ? itens.length - 1
          : Math.min(itens.length - 1, Math.max(0, (indice === -1 ? 0 : indice) + passo));
    setAtivo({ ...ativo, [lado]: itens[destinoIndice].value });
  };

  const renderarLista = (lado: Lado) => {
    const itens = listas[lado];
    const vazia = itens.length === 0;
    const idLabel = `${uid}-${lado}-label`;
    // O item ativo pode ter acabado de sair da lista: só aponta para id existente.
    const ativoPresente = itens.some((item) => item.value === ativo[lado]);

    return (
      <div className="citie-picklist__painel">
        <span className="citie-picklist__rotulo" id={idLabel}>
          {rotulos[lado]}
          <span className="citie-picklist__contagem">
            {itens.length} {plural(itens.length)}
          </span>
        </span>

        {/*
          Sem itens o papel de listbox seria inválido (exige filhos `option`) e a
          mensagem de vazio ficaria como filho sem papel: o container vira
          `status` enquanto a lista estiver vazia.
        */}
        <div
          className={`citie-picklist__lista${vazia ? ' citie-picklist__lista--vazia' : ''}`}
          style={{ maxHeight: altura }}
          role={vazia ? 'status' : 'listbox'}
          aria-labelledby={idLabel}
          aria-multiselectable={vazia ? undefined : true}
          aria-activedescendant={ativoPresente ? `${uid}-${lado}-${ativo[lado]}` : undefined}
          aria-disabled={disabled || undefined}
          // A região rola: precisa receber foco mesmo desabilitada, e o estado
          // fica por conta de `aria-disabled`.
          tabIndex={0}
          onKeyDown={(evento) => {
            const acoes: Record<string, () => void> = {
              ArrowDown: () => navegar(lado, 1),
              ArrowUp: () => navegar(lado, -1),
              Home: () => navegar(lado, 'inicio'),
              End: () => navegar(lado, 'fim'),
              Enter: () => alternarSelecao(lado, ativo[lado]),
              ' ': () => alternarSelecao(lado, ativo[lado]),
            };
            const acao = acoes[evento.key];
            if (acao) {
              evento.preventDefault();
              acao();
            }
          }}
        >
          {vazia ? (
            <p className="citie-picklist__vazio">Nenhum item em {rotulos[lado].toLowerCase()}</p>
          ) : (
            itens.map((item) => {
              const marcado = selecao[lado].includes(item.value);
              return (
                <div
                  key={item.value}
                  id={`${uid}-${lado}-${item.value}`}
                  role="option"
                  aria-selected={marcado}
                  className={[
                    'citie-picklist__item',
                    marcado ? 'citie-picklist__item--selecionado' : null,
                    item.value === ativo[lado] ? 'citie-picklist__item--ativo' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => alternarSelecao(lado, item.value)}
                >
                  {/* Seleção não pode depender só de cor: a marca acompanha o estado. */}
                  <span className="citie-picklist__marca" aria-hidden="true">
                    {marcado ? '✓' : ''}
                  </span>
                  <span className="citie-picklist__texto">
                    <span className="citie-picklist__item-label">{item.label}</span>
                    {item.descricao ? (
                      <span className="citie-picklist__item-descricao">{item.descricao}</span>
                    ) : null}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderarReordenacao = (lado: Lado) => (
    <div className="citie-picklist__controles" role="group" aria-label={`Reordenar ${rotulos[lado]}`}>
      <Button
        variant="secondary"
        size="small"
        iconOnly
        icon={<IconeSeta direcao="cima" />}
        aria-label={`Subir uma posição em ${rotulos[lado]}`}
        disabled={disabled || selecao[lado].length === 0}
        onClick={() => reordenar(lado, 'subir')}
      />
      <Button
        variant="secondary"
        size="small"
        iconOnly
        icon={<IconeSetaDupla direcao="cima" />}
        aria-label={`Mover para o topo de ${rotulos[lado]}`}
        disabled={disabled || selecao[lado].length === 0}
        onClick={() => reordenar(lado, 'topo')}
      />
      <Button
        variant="secondary"
        size="small"
        iconOnly
        icon={<IconeSeta direcao="baixo" />}
        aria-label={`Descer uma posição em ${rotulos[lado]}`}
        disabled={disabled || selecao[lado].length === 0}
        onClick={() => reordenar(lado, 'descer')}
      />
      <Button
        variant="secondary"
        size="small"
        iconOnly
        icon={<IconeSetaDupla direcao="baixo" />}
        aria-label={`Mover para o fim de ${rotulos[lado]}`}
        disabled={disabled || selecao[lado].length === 0}
        onClick={() => reordenar(lado, 'fim')}
      />
    </div>
  );

  return (
    <div className="citie-picklist" role="group" aria-label={legenda}>
      {comReordenacao ? renderarReordenacao('origem') : null}

      {renderarLista('origem')}

      <div className="citie-picklist__controles" role="group" aria-label="Transferir itens">
        <Button
          variant="secondary"
          size="small"
          iconOnly
          icon={<IconeSeta direcao="direita" />}
          aria-label={`Mover selecionados para ${rotuloDestino}`}
          disabled={disabled || selecao.origem.length === 0}
          onClick={() => transferir('origem', false)}
        />
        <Button
          variant="secondary"
          size="small"
          iconOnly
          icon={<IconeSetaDupla direcao="direita" />}
          aria-label={`Mover todos para ${rotuloDestino}`}
          disabled={disabled || origem.length === 0}
          onClick={() => transferir('origem', true)}
        />
        <Button
          variant="secondary"
          size="small"
          iconOnly
          icon={<IconeSetaDupla direcao="esquerda" />}
          aria-label={`Mover todos para ${rotuloOrigem}`}
          disabled={disabled || destino.length === 0}
          onClick={() => transferir('destino', true)}
        />
        <Button
          variant="secondary"
          size="small"
          iconOnly
          icon={<IconeSeta direcao="esquerda" />}
          aria-label={`Mover selecionados para ${rotuloOrigem}`}
          disabled={disabled || selecao.destino.length === 0}
          onClick={() => transferir('destino', false)}
        />
      </div>

      {renderarLista('destino')}

      {comReordenacao ? renderarReordenacao('destino') : null}

      <p className="citie-visualmente-oculto" aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}
