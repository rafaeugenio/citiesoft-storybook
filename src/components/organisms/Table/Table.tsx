import { useState, type ReactNode } from 'react';
import { Checkbox } from '../../atoms/Choice/Choice';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import './Table.css';

export type Alinhamento = 'esquerda' | 'direita' | 'centro';

export interface Coluna<T> {
  chave: string;
  /** Substantivo curto, sem verbo: "Data de emissão", nunca "Ver data". */
  cabecalho: string;
  alinhamento?: Alinhamento;
  ordenavel?: boolean;
  largura?: string;
  render: (linha: T) => ReactNode;
}

export interface TableProps<T> {
  /** Nome acessível da tabela, com o total de registros. */
  legenda: string;
  colunas: Coluna<T>[];
  linhas: T[];
  chaveDaLinha: (linha: T) => string;
  /** Nomeia o registro no checkbox de linha. */
  rotuloDaLinha?: (linha: T) => string;
  densidade?: 'confortavel' | 'compacta';
  /** Obrigatória acima de 5 colunas. */
  zebra?: boolean;
  selecionavel?: boolean;
  headerFixo?: boolean;
  carregando?: boolean;
  /** Empty state ou mensagem de erro renderizados no lugar do corpo. */
  semConteudo?: ReactNode;
  /** Barra que aparece acima do cabeçalho quando há seleção. */
  acoesEmMassa?: (selecionados: string[]) => ReactNode;
  /**
   * Ações rápidas por linha, sempre na última coluna e alinhadas à direita.
   *
   * Existe porque o consumidor vinha improvisando isso como coluna comum com
   * `render`, e o resultado divergia de tela para tela: largura diferente,
   * alinhamento diferente, e o cabeçalho da coluna às vezes com verbo. Aqui a
   * coluna é gerada pela tabela, então a anatomia é a mesma em todo lugar.
   *
   * O cabeçalho fica visualmente oculto de propósito: "Ações" repetido em toda
   * tabela é ruído visual, mas o leitor de tela precisa dele para anunciar a
   * coluna.
   */
  acoesDaLinha?: (linha: T) => ReactNode;
  /**
   * Destaque de linha por estado, como barra vertical na borda de início.
   *
   * A barra é `box-shadow: inset`, e não cor de fundo, de propósito: fundo
   * colorido briga com o zebrado e com o realce de hover, e a linha destacada
   * deixa de responder ao ponteiro. A barra convive com os dois.
   *
   * Devolva `undefined` para a linha sem destaque. A severidade escolhe o token
   * de cor, e o `motivo` vira texto para o leitor de tela, porque barra colorida
   * sozinha não comunica nada a quem não a enxerga.
   */
  destaqueDaLinha?: (linha: T) => DestaqueDeLinha | undefined;
}

export interface DestaqueDeLinha {
  severidade: 'info' | 'atencao' | 'critico';
  /** Por que esta linha está destacada. Anunciado ao leitor de tela. */
  motivo: string;
}

const CLASSE_ALINHAMENTO: Record<Alinhamento, string> = {
  esquerda: 'citie-table__celula--esquerda',
  direita: 'citie-table__celula--direita',
  centro: 'citie-table__celula--centro',
};

/**
 * Tabela operacional (tables-data-grid.md).
 * Ordem fixa de colunas: seleção, identificador, descritivos, numéricos e data,
 * status, ações. O cabeçalho permanece real e visível durante o carregamento.
 */
export function Table<T>({
  legenda,
  colunas,
  linhas,
  chaveDaLinha,
  rotuloDaLinha,
  densidade = 'confortavel',
  zebra = false,
  selecionavel = false,
  headerFixo = false,
  carregando = false,
  semConteudo,
  acoesEmMassa,
  acoesDaLinha,
  destaqueDaLinha,
}: TableProps<T>) {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<{ chave: string; direcao: 'ascending' | 'descending' } | null>(
    null,
  );

  const chaves = linhas.map(chaveDaLinha);
  const todasMarcadas = chaves.length > 0 && chaves.every((chave) => selecionados.includes(chave));
  const algumasMarcadas = selecionados.length > 0 && !todasMarcadas;

  const alternarLinha = (chave: string) =>
    setSelecionados((atual) =>
      atual.includes(chave) ? atual.filter((c) => c !== chave) : [...atual, chave],
    );

  const alternarOrdenacao = (chave: string) =>
    setOrdenacao((atual) =>
      atual?.chave === chave
        ? { chave, direcao: atual.direcao === 'ascending' ? 'descending' : 'ascending' }
        : { chave, direcao: 'ascending' },
    );

  return (
    <div
      className="citie-table-wrapper"
      // A rolagem horizontal do envoltório é conteúdo alcançável só por gesto
      // ou arraste da barra sem isto: tabIndex, role e nome tornam a região
      // navegável e nomeada por teclado (WCAG 2.1.1 Keyboard, 4.1.2 Name Role Value).
      tabIndex={0}
      role="group"
      aria-label={`Rolagem horizontal de ${legenda}`}
    >
      {acoesEmMassa && selecionados.length > 0 ? (
        <div className="citie-table__acoes-massa" role="status">
          <span>{selecionados.length} selecionados</span>
          {acoesEmMassa(selecionados)}
        </div>
      ) : null}

      <table
        className={`citie-table citie-table--${densidade}${zebra ? ' citie-table--zebra' : ''}${
          headerFixo ? ' citie-table--header-fixo' : ''
        }`}
        role="grid"
        aria-label={legenda}
        aria-busy={carregando || undefined}
      >
        <thead>
          <tr>
            {selecionavel ? (
              <th scope="col" className="citie-table__celula--selecao">
                <Checkbox
                  // O checkbox do cabeçalho seleciona apenas a página atual.
                  label={<span className="citie-visualmente-oculto">Selecionar a página atual</span>}
                  checked={todasMarcadas}
                  indeterminate={algumasMarcadas}
                  onChange={(marcado) => setSelecionados(marcado ? chaves : [])}
                />
              </th>
            ) : null}

            {colunas.map((coluna) => {
              const ativa = ordenacao?.chave === coluna.chave;
              return (
                <th
                  key={coluna.chave}
                  scope="col"
                  style={{ width: coluna.largura }}
                  className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                  aria-sort={coluna.ordenavel ? (ativa ? ordenacao.direcao : 'none') : undefined}
                >
                  {coluna.ordenavel ? (
                    <button
                      type="button"
                      className={`citie-table__ordenar${ativa ? ' citie-table__ordenar--ativa' : ''}`}
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
            {acoesDaLinha ? (
              <th scope="col" className="citie-table__celula--acoes">
                <span className="citie-visualmente-oculto">Ações</span>
              </th>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {carregando ? (
            // Skeleton rows: o cabeçalho continua real e legível.
            Array.from({ length: 5 }, (_, indice) => (
              <tr key={`skeleton-${indice}`}>
                {selecionavel ? (
                  <td className="citie-table__celula--selecao">
                    <Skeleton forma="linha" width="18px" height="18px" />
                  </td>
                ) : null}
                {colunas.map((coluna) => (
                  <td key={coluna.chave}>
                    <div className="citie-table__conteudo">
                      <Skeleton forma="linha" width="70%" />
                    </div>
                  </td>
                ))}
                {acoesDaLinha ? (
                  <td className="citie-table__celula--acoes">
                    <Skeleton forma="linha" width="56px" />
                  </td>
                ) : null}
              </tr>
            ))
          ) : linhas.length === 0 ? (
            <tr>
              <td colSpan={colunas.length + (selecionavel ? 1 : 0) + (acoesDaLinha ? 1 : 0)}>{semConteudo}</td>
            </tr>
          ) : (
            linhas.map((linha) => {
              const chave = chaveDaLinha(linha);
              const marcada = selecionados.includes(chave);
              const destaque = destaqueDaLinha?.(linha);
              const classes = [
                marcada ? 'citie-table__linha--selecionada' : null,
                destaque ? `citie-table__linha--destaque citie-table__linha--destaque-${destaque.severidade}` : null,
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <tr key={chave} className={classes || undefined}>

                  {selecionavel ? (
                    <td className="citie-table__celula--selecao">
                      <Checkbox
                        label={
                          <span className="citie-visualmente-oculto">
                            {`Selecionar ${rotuloDaLinha?.(linha) ?? chave}`}
                          </span>
                        }
                        checked={marcada}
                        onChange={() => alternarLinha(chave)}
                      />
                    </td>
                  ) : null}
                  {colunas.map((coluna, posicao) => (
                    <td
                      key={coluna.chave}
                      className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                    >
                      <div className="citie-table__conteudo">
                        {/*
                          O motivo do destaque entra na primeira célula de dado, e
                          não numa célula própria: coluna extra só nas linhas
                          destacadas quebraria a contagem de colunas da grade.
                          A barra é visual, e o texto é o que chega a quem não a vê.
                        */}
                        {destaque && posicao === 0 ? (
                          <span className="citie-visualmente-oculto">{destaque.motivo}. </span>
                        ) : null}
                        {coluna.render(linha)}
                      </div>
                    </td>
                  ))}
                  {acoesDaLinha ? (
                    <td className="citie-table__celula--acoes">
                      <div className="citie-table__acoes">{acoesDaLinha(linha)}</div>
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Dado ausente recebe legenda explícita, nunca célula em branco nem "N/A". */
export function SemRegistro({ texto = 'Sem registro' }: { texto?: string }) {
  return <span className="citie-table__ausente">{texto}</span>;
}

/** CPF mascarado por padrão na listagem; valor completo só no detalhe. */
export function mascararCPF(cpf: string) {
  return `***.***.**${cpf.slice(-4)}`;
}
