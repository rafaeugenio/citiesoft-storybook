import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Checkbox } from '../Choice/Choice';
import { Skeleton } from '../Skeleton/Skeleton';
import './TreeTable.css';

export type AlinhamentoDaColuna = 'esquerda' | 'direita' | 'centro';

export interface NoDaArvore<T> {
  chave: string;
  dados: T;
  filhos?: NoDaArvore<T>[];
}

export interface ColunaDaArvore<T> {
  chave: string;
  /** Substantivo curto, sem verbo: "Dotação atualizada", nunca "Ver dotação". */
  cabecalho: string;
  alinhamento?: AlinhamentoDaColuna;
  ordenavel?: boolean;
  largura?: string;
  render: (dados: T, no: NoDaArvore<T>) => ReactNode;
  /** Valor comparável da coluna; sem ele a ordenação usa o texto renderizado. */
  valorDeOrdenacao?: (dados: T) => string | number;
  /** Célula da linha de total, exibida quando `comRodape` está ligado. */
  rodape?: ReactNode;
}

export interface TreeTableProps<T> {
  /** Nome acessível da tabela, com o total de registros do primeiro nível. */
  legenda: string;
  colunas: ColunaDaArvore<T>[];
  nos: NoDaArvore<T>[];
  /** Nomeia o nó no botão de expandir e no checkbox de linha. */
  rotuloDoNo: (dados: T) => string;
  densidade?: 'confortavel' | 'compacta';
  /** Obrigatória acima de 5 colunas. */
  zebra?: boolean;
  /** Linhas de grade verticais entre as colunas (Grid Lines do Figma). */
  linhasDeGrade?: boolean;
  selecionavel?: boolean;
  headerFixo?: boolean;
  carregando?: boolean;
  /** Empty state ou mensagem de erro renderizados no lugar do corpo. */
  semConteudo?: ReactNode;
  /** Faixa de título acima do cabeçalho (treetable-header do Figma). */
  titulo?: ReactNode;
  /** Linha de totais montada a partir de `coluna.rodape`. */
  comRodape?: boolean;
  /** Chaves já abertas na primeira renderização. */
  expandidosIniciais?: string[];
  onExpandidosMudaram?: (chaves: string[]) => void;
  onSelecaoMudou?: (chaves: string[]) => void;
}

interface LinhaVisivel<T> {
  no: NoDaArvore<T>;
  nivel: number;
  temFilhos: boolean;
  expandido: boolean;
  posicao: number;
  totalDeIrmaos: number;
  chaveDoPai: string | null;
}

const CLASSE_ALINHAMENTO: Record<AlinhamentoDaColuna, string> = {
  esquerda: 'citie-treetable__celula--esquerda',
  direita: 'citie-treetable__celula--direita',
  centro: 'citie-treetable__celula--centro',
};

/** Folhas do nó; um nó sem filhos é a própria folha. Base da seleção em cascata. */
function folhasDoNo<T>(no: NoDaArvore<T>): string[] {
  if (!no.filhos?.length) return [no.chave];
  return no.filhos.flatMap(folhasDoNo);
}

function ordenarRecursivo<T>(
  nos: NoDaArvore<T>[],
  coluna: ColunaDaArvore<T>,
  direcao: 'ascending' | 'descending',
): NoDaArvore<T>[] {
  const sinal = direcao === 'ascending' ? 1 : -1;
  const valor = (no: NoDaArvore<T>) =>
    coluna.valorDeOrdenacao ? coluna.valorDeOrdenacao(no.dados) : no.chave;

  return [...nos]
    .sort((a, b) => {
      const va = valor(a);
      const vb = valor(b);
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sinal;
      return String(va).localeCompare(String(vb), 'pt-BR') * sinal;
    })
    .map((no) =>
      no.filhos?.length ? { ...no, filhos: ordenarRecursivo(no.filhos, coluna, direcao) } : no,
    );
}

/**
 * TreeTable (página ❖ TreeTable do CitieOne, fileKey B6fM1Aig3uPIvQ6amLObZC).
 * Cobre os eixos do arquivo: Size (Default/Small mapeados para as densidades de
 * 48px e 36px da marca), Grid Lines, Sortable com Sort Order, Selection com
 * checkbox em cascata, treetable-node-toggle-button, treetable-header e
 * treetable-footer. Cor e espaçamento vêm dos tokens Citiesoft, nunca do Figma.
 * Equivalente PrimeNG: p-treetable.
 */
export function TreeTable<T>({
  legenda,
  colunas,
  nos,
  rotuloDoNo,
  densidade = 'confortavel',
  zebra = false,
  linhasDeGrade = false,
  selecionavel = false,
  headerFixo = false,
  carregando = false,
  semConteudo,
  titulo,
  comRodape = false,
  expandidosIniciais = [],
  onExpandidosMudaram,
  onSelecaoMudou,
}: TreeTableProps<T>) {
  const [expandidos, setExpandidos] = useState<string[]>(expandidosIniciais);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<{
    chave: string;
    direcao: 'ascending' | 'descending';
  } | null>(null);
  const [chaveFocada, setChaveFocada] = useState<string | null>(null);
  const referenciasDeLinha = useRef(new Map<string, HTMLTableRowElement>());

  const nosOrdenados = useMemo(() => {
    const coluna = colunas.find((c) => c.chave === ordenacao?.chave);
    return coluna && ordenacao ? ordenarRecursivo(nos, coluna, ordenacao.direcao) : nos;
  }, [nos, colunas, ordenacao]);

  const linhas = useMemo(() => {
    const achatadas: LinhaVisivel<T>[] = [];
    const percorrer = (lista: NoDaArvore<T>[], nivel: number, chaveDoPai: string | null) => {
      lista.forEach((no, indice) => {
        const temFilhos = Boolean(no.filhos?.length);
        const expandido = temFilhos && expandidos.includes(no.chave);
        achatadas.push({
          no,
          nivel,
          temFilhos,
          expandido,
          posicao: indice + 1,
          totalDeIrmaos: lista.length,
          chaveDoPai,
        });
        if (expandido) percorrer(no.filhos!, nivel + 1, no.chave);
      });
    };
    percorrer(nosOrdenados, 1, null);
    return achatadas;
  }, [nosOrdenados, expandidos]);

  const alternarExpansao = (chave: string) =>
    setExpandidos((atual) => {
      const proximo = atual.includes(chave)
        ? atual.filter((c) => c !== chave)
        : [...atual, chave];
      onExpandidosMudaram?.(proximo);
      return proximo;
    });

  const alternarSelecao = (no: NoDaArvore<T>, marcado: boolean) =>
    setSelecionados((atual) => {
      const folhas = folhasDoNo(no);
      const proximo = marcado
        ? Array.from(new Set([...atual, ...folhas]))
        : atual.filter((c) => !folhas.includes(c));
      onSelecaoMudou?.(proximo);
      return proximo;
    });

  const estadoDeSelecao = (no: NoDaArvore<T>) => {
    const folhas = folhasDoNo(no);
    const marcadas = folhas.filter((c) => selecionados.includes(c));
    return {
      marcado: marcadas.length === folhas.length && folhas.length > 0,
      parcial: marcadas.length > 0 && marcadas.length < folhas.length,
    };
  };

  const alternarOrdenacao = (chave: string) =>
    setOrdenacao((atual) =>
      atual?.chave === chave
        ? { chave, direcao: atual.direcao === 'ascending' ? 'descending' : 'ascending' }
        : { chave, direcao: 'ascending' },
    );

  const focarLinha = (chave: string | undefined) => {
    if (!chave) return;
    setChaveFocada(chave);
    referenciasDeLinha.current.get(chave)?.focus();
  };

  /** Padrão treegrid: setas navegam linhas, direita abre, esquerda fecha ou sobe. */
  const aoTeclar = (evento: KeyboardEvent<HTMLTableRowElement>, indice: number) => {
    const linha = linhas[indice];
    const teclas = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!teclas.includes(evento.key)) return;
    evento.preventDefault();

    if (evento.key === 'ArrowDown') focarLinha(linhas[indice + 1]?.no.chave);
    if (evento.key === 'ArrowUp') focarLinha(linhas[indice - 1]?.no.chave);
    if (evento.key === 'Home') focarLinha(linhas[0]?.no.chave);
    if (evento.key === 'End') focarLinha(linhas[linhas.length - 1]?.no.chave);

    if (evento.key === 'ArrowRight') {
      if (linha.temFilhos && !linha.expandido) alternarExpansao(linha.no.chave);
      else if (linha.expandido) focarLinha(linhas[indice + 1]?.no.chave);
    }

    if (evento.key === 'ArrowLeft') {
      if (linha.temFilhos && linha.expandido) alternarExpansao(linha.no.chave);
      else if (linha.chaveDoPai) focarLinha(linha.chaveDoPai);
    }
  };

  const totalDeColunas = colunas.length + (selecionavel ? 1 : 0);
  const chaveTabulavel = chaveFocada ?? linhas[0]?.no.chave;

  return (
    <div className="citie-treetable-wrapper">
      {titulo ? <div className="citie-treetable__titulo">{titulo}</div> : null}

      <table
        className={`citie-treetable citie-treetable--${densidade}${
          zebra ? ' citie-treetable--zebra' : ''
        }${linhasDeGrade ? ' citie-treetable--grade' : ''}${
          headerFixo ? ' citie-treetable--header-fixo' : ''
        }`}
        role="treegrid"
        aria-label={legenda}
        aria-busy={carregando || undefined}
        aria-multiselectable={selecionavel || undefined}
      >
        <thead role="rowgroup">
          <tr role="row">
            {selecionavel ? (
              <th scope="col" role="columnheader" className="citie-treetable__celula--selecao">
                <span className="citie-visualmente-oculto">Seleção</span>
              </th>
            ) : null}

            {colunas.map((coluna) => {
              const ativa = ordenacao?.chave === coluna.chave;
              return (
                <th
                  key={coluna.chave}
                  scope="col"
                  role="columnheader"
                  style={{ width: coluna.largura }}
                  className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                  aria-sort={coluna.ordenavel ? (ativa ? ordenacao.direcao : 'none') : undefined}
                >
                  {coluna.ordenavel ? (
                    <button
                      type="button"
                      className={`citie-treetable__ordenar${
                        ativa ? ' citie-treetable__ordenar--ativa' : ''
                      }`}
                      onClick={() => alternarOrdenacao(coluna.chave)}
                    >
                      {coluna.cabecalho}
                      <span aria-hidden="true">
                        {ativa ? (ordenacao.direcao === 'ascending' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  ) : (
                    coluna.cabecalho
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody role="rowgroup">
          {carregando ? (
            // Skeleton rows: o cabeçalho continua real e legível.
            Array.from({ length: 5 }, (_, indice) => (
              <tr key={`skeleton-${indice}`} role="row" aria-level={1}>
                {selecionavel ? (
                  <td role="gridcell" className="citie-treetable__celula--selecao">
                    <Skeleton forma="linha" width="18px" height="18px" />
                  </td>
                ) : null}
                {colunas.map((coluna) => (
                  <td key={coluna.chave} role="gridcell">
                    <div className="citie-treetable__conteudo">
                      <Skeleton forma="linha" width="70%" />
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : linhas.length === 0 ? (
            <tr role="row" aria-level={1}>
              <td role="gridcell" colSpan={totalDeColunas}>
                {semConteudo}
              </td>
            </tr>
          ) : (
            linhas.map((linha, indice) => {
              const { marcado, parcial } = estadoDeSelecao(linha.no);
              const rotulo = rotuloDoNo(linha.no.dados);
              return (
                <tr
                  key={linha.no.chave}
                  role="row"
                  ref={(elemento) => {
                    if (elemento) referenciasDeLinha.current.set(linha.no.chave, elemento);
                    else referenciasDeLinha.current.delete(linha.no.chave);
                  }}
                  tabIndex={linha.no.chave === chaveTabulavel ? 0 : -1}
                  aria-level={linha.nivel}
                  aria-posinset={linha.posicao}
                  aria-setsize={linha.totalDeIrmaos}
                  aria-expanded={linha.temFilhos ? linha.expandido : undefined}
                  aria-selected={selecionavel ? marcado : undefined}
                  className={`citie-treetable__linha citie-treetable__linha--nivel-${Math.min(
                    linha.nivel,
                    3,
                  )}${marcado ? ' citie-treetable__linha--selecionada' : ''}`}
                  onFocus={() => setChaveFocada(linha.no.chave)}
                  onKeyDown={(evento) => aoTeclar(evento, indice)}
                >
                  {selecionavel ? (
                    <td role="gridcell" className="citie-treetable__celula--selecao">
                      <Checkbox
                        label={
                          <span className="citie-visualmente-oculto">{`Selecionar ${rotulo}`}</span>
                        }
                        checked={marcado}
                        indeterminate={parcial}
                        onChange={(valor) => alternarSelecao(linha.no, valor)}
                      />
                    </td>
                  ) : null}

                  {colunas.map((coluna, posicaoDaColuna) => {
                    const primeira = posicaoDaColuna === 0;
                    return (
                      <td
                        key={coluna.chave}
                        role="gridcell"
                        className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                      >
                        <div
                          className={`citie-treetable__conteudo${
                            primeira ? ' citie-treetable__conteudo--hierarquia' : ''
                          }`}
                          // A indentação vive numa custom property para render de
                          // um nível novo não exigir classe nova.
                          style={
                            primeira
                              ? ({ '--citie-treetable-nivel': linha.nivel - 1 } as CSSProperties)
                              : undefined
                          }
                        >
                          {primeira ? (
                            linha.temFilhos ? (
                              <button
                                type="button"
                                // O foco de teclado percorre as linhas, não os
                                // botões: o toggle atende só ponteiro e leitor.
                                tabIndex={-1}
                                className="citie-treetable__toggle"
                                aria-label={`${linha.expandido ? 'Recolher' : 'Expandir'} ${rotulo}`}
                                onClick={() => alternarExpansao(linha.no.chave)}
                              >
                                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                                  <path
                                    d="M6 3.5 10.5 8 6 12.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <span className="citie-treetable__toggle-vazio" aria-hidden="true" />
                            )
                          ) : null}
                          {coluna.render(linha.no.dados, linha.no)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>

        {comRodape && !carregando ? (
          <tfoot role="rowgroup">
            <tr role="row" aria-level={1}>
              {selecionavel ? (
                <td role="gridcell" className="citie-treetable__celula--selecao" />
              ) : null}
              {colunas.map((coluna) => (
                <td
                  key={coluna.chave}
                  role="gridcell"
                  className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                >
                  <div className="citie-treetable__conteudo">{coluna.rodape}</div>
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

/** Soma uma métrica em toda a subárvore; o nó pai exibe o total dos filhos. */
export function somarSubarvore<T>(no: NoDaArvore<T>, metrica: (dados: T) => number): number {
  if (!no.filhos?.length) return metrica(no.dados);
  return no.filhos.reduce((total, filho) => total + somarSubarvore(filho, metrica), 0);
}
