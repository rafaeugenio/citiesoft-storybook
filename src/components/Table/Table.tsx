import { useState, type ReactNode } from 'react';
import { Checkbox } from '../Choice/Choice';
import { Skeleton } from '../Skeleton/Skeleton';
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
    <div className="citie-table-wrapper">
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
              </tr>
            ))
          ) : linhas.length === 0 ? (
            <tr>
              <td colSpan={colunas.length + (selecionavel ? 1 : 0)}>{semConteudo}</td>
            </tr>
          ) : (
            linhas.map((linha) => {
              const chave = chaveDaLinha(linha);
              const marcada = selecionados.includes(chave);
              return (
                <tr key={chave} className={marcada ? 'citie-table__linha--selecionada' : undefined}>
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
                  {colunas.map((coluna) => (
                    <td
                      key={coluna.chave}
                      className={CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}
                    >
                      <div className="citie-table__conteudo">{coluna.render(linha)}</div>
                    </td>
                  ))}
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
