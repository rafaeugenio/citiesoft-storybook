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
  /**
   * Data, código, protocolo e número em Red Hat Mono com dígitos tabulares,
   * como as datas da listagem de prontuários do Sismental: a coluna alinha na
   * vertical e a varredura compara sem contar casas.
   */
  mono?: boolean;
  render: (linha: T) => ReactNode;
}

/**
 * Cabeçalho do cartão da tabela, medido na lista de profissionais do
 * Sismental: título 16 Medium, subtítulo muted e a ação primária à direita.
 */
export interface CabecalhoDaTabela {
  titulo: string;
  subtitulo?: string;
  /** Botão primário da tela: "Cadastrar profissional". */
  acao?: ReactNode;
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
   * A barra é `box-shadow: inset`, de propósito: fundo colorido briga com o
   * zebrado e com o realce de hover, e a linha destacada para de responder ao
   * ponteiro. A barra convive com os dois.
   *
   * Devolva `undefined` para a linha sem destaque. A severidade escolhe o token
   * de cor, e o `motivo` vira texto para o leitor de tela, porque barra colorida
   * sozinha não comunica nada a quem não a enxerga.
   */
  destaqueDaLinha?: (linha: T) => DestaqueDeLinha | undefined;
  /**
   * Linha inativa: o registro existe e está desligado (profissional inativo,
   * unidade descredenciada). A tinta da linha desce para text-secondary e o
   * texto oculto "(inativo)" entra na primeira célula, para a informação não
   * depender só da cor. Diferente de `destaqueDaLinha`, que chama atenção;
   * aqui a linha recua.
   */
  linhaInativa?: (linha: T) => boolean;
  /**
   * Mantém as ações por linha visíveis sem hover. É o caso do botão outline
   * "Editar" da lista de profissionais: ação principal da tela, presente em
   * toda linha. O padrão continua sendo revelar no hover e no foco.
   */
  acoesSempreVisiveis?: boolean;
  /**
   * Cartão da listagem, como no Sismental: cabeçalho com título, subtítulo e
   * ação primária; linha de filtro (busca larga à esquerda, select de escopo à
   * direita); rodapé com paginação à esquerda e o resumo à direita. Os três
   * são opcionais e vivem dentro do mesmo envoltório da tabela, com o mesmo
   * raio 10, borda e sombra curta do Card.
   */
  cabecalho?: CabecalhoDaTabela;
  /** Busca e selects da linha de filtro. O primeiro filho cresce. */
  filtros?: ReactNode;
  /** Paginação. Fica à esquerda no rodapé; o `resumo` fica à direita. */
  paginacao?: ReactNode;
  /** "Mostrando 1 a 10 de 98 registros". Ver `resumoDePaginacao`. */
  resumo?: string;
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

const classeDaCelula = <T,>(coluna: Coluna<T>) =>
  `${CLASSE_ALINHAMENTO[coluna.alinhamento ?? 'esquerda']}${coluna.mono ? ' citie-table__celula--mono' : ''}`;

/**
 * Ícone de ordenação de 16, no traço do sistema: as duas setas em repouso, e
 * só a seta da direção quando a coluna ordena. Substitui as setas em texto
 * (↑ ↓ ↕), que mudavam de desenho e de peso com a fonte.
 */
export function IconeDeOrdenacao({ direcao }: { direcao?: 'ascending' | 'descending' }) {
  return (
    <svg
      className="citie-table__ordenar-icone"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direcao !== 'descending' ? <path d="M5.5 6.5 8 4l2.5 2.5M8 4v4.5" /> : null}
      {direcao !== 'ascending' ? <path d="M5.5 9.5 8 12l2.5-2.5M8 12V7.5" /> : null}
    </svg>
  );
}

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
  linhaInativa,
  acoesSempreVisiveis = false,
  cabecalho,
  filtros,
  paginacao,
  resumo,
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
      {cabecalho ? (
        <header className="citie-table__cabecalho">
          <div>
            <h3 className="citie-table__titulo">{cabecalho.titulo}</h3>
            {cabecalho.subtitulo ? (
              <p className="citie-table__subtitulo">{cabecalho.subtitulo}</p>
            ) : null}
          </div>
          {cabecalho.acao ? <div className="citie-table__acao-principal">{cabecalho.acao}</div> : null}
        </header>
      ) : null}

      {filtros ? <div className="citie-table__filtros">{filtros}</div> : null}

      {acoesEmMassa && selecionados.length > 0 ? (
        <div className="citie-table__acoes-massa" role="status">
          <span>{selecionados.length} selecionados</span>
          {acoesEmMassa(selecionados)}
        </div>
      ) : null}

      <table
        className={`citie-table citie-table--${densidade}${zebra ? ' citie-table--zebra' : ''}${
          headerFixo ? ' citie-table--header-fixo' : ''
        }${acoesSempreVisiveis ? ' citie-table--acoes-visiveis' : ''}`}
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
                      <IconeDeOrdenacao direcao={ativa ? ordenacao.direcao : undefined} />
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
              const inativa = linhaInativa?.(linha) ?? false;
              const classes = [
                marcada ? 'citie-table__linha--selecionada' : null,
                destaque ? `citie-table__linha--destaque citie-table__linha--destaque-${destaque.severidade}` : null,
                inativa ? 'citie-table__linha--inativa' : null,
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
                    <td key={coluna.chave} className={classeDaCelula(coluna)}>
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
                        {inativa && posicao === 0 ? (
                          <span className="citie-visualmente-oculto">Inativo. </span>
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

      {paginacao || resumo ? (
        <footer className="citie-table__rodape">
          {paginacao}
          {resumo ? <p className="citie-table__resumo">{resumo}</p> : null}
        </footer>
      ) : null}
    </div>
  );
}

/**
 * Identificador em duas linhas, como na listagem de prontuários do Sismental:
 * o nome em 14 e, abaixo, o CPF ou a matrícula em mono 12 muted. Cabe nos
 * 44px da célula confortável (20 + 16). Combine com `mascararCPF`.
 */
export function Identificador({ principal, secundario }: { principal: ReactNode; secundario: ReactNode }) {
  return (
    <span className="citie-table__identificador">
      <span className="citie-table__identificador-principal">{principal}</span>
      <span className="citie-table__identificador-secundario">{secundario}</span>
    </span>
  );
}

/**
 * "Mostrando 1 a 10 de 98 profissionais". O intervalo é calculado a partir da
 * página, para o texto nunca dizer "11 a 20" numa lista de 15.
 */
export function resumoDePaginacao(
  pagina: number,
  itensPorPagina: number,
  total: number,
  substantivo: [string, string] = ['registro', 'registros'],
) {
  if (total === 0) return `Nenhum ${substantivo[0]} para mostrar`;
  const inicio = (pagina - 1) * itensPorPagina + 1;
  const fim = Math.min(pagina * itensPorPagina, total);
  const nome = total === 1 ? substantivo[0] : substantivo[1];
  return `Mostrando ${inicio.toLocaleString('pt-BR')} a ${fim.toLocaleString('pt-BR')} de ${total.toLocaleString('pt-BR')} ${nome}`;
}

/** Dado ausente recebe legenda explícita, nunca célula em branco nem "N/A". */
export function SemRegistro({ texto = 'Sem registro' }: { texto?: string }) {
  return <span className="citie-table__ausente">{texto}</span>;
}

/**
 * CPF mascarado por padrão na listagem. O valor completo só aparece no detalhe,
 * e só para quem tem permissão de leitura do dado pessoal.
 *
 * A versão anterior era `***.***.**${cpf.slice(-4)}`, e tinha dois defeitos.
 * Expunha os **quatro** dígitos finais, o que é exposição desnecessária de dado
 * pessoal num sistema público, e ainda produzia uma máscara malformada, sem o
 * hífen que separa os dígitos verificadores.
 *
 * A regra agora é: nove dígitos ocultos, o nono visível como âncora de
 * conferência, e os dois verificadores após o hífen. É o suficiente para o
 * servidor confirmar que está no registro certo, e insuficiente para
 * reconstituir o número cruzando telas.
 *
 * Aceita o CPF com ou sem pontuação. Entrada que não tenha 11 dígitos volta
 * inalterada, porque mascarar dado inválido esconderia o defeito do cadastro.
 */
export function mascararCPF(cpf: string) {
  const digitos = cpf.replace(/\D/g, '');
  if (digitos.length !== 11) return cpf;
  return `***.***.**${digitos[8]}-${digitos.slice(9)}`;
}
