import { useId, type ReactNode } from 'react';
import './Listagem.css';

/**
 * Template de tela de listagem, recomposto no Lote 6b sobre a listagem de
 * prontuários do Sismental (`docs/figma-ui-kit.md`, "Composição de tela").
 *
 * O template só conhece regiões, ordem e responsividade: nada de conteúdo de
 * domínio. Quem sabe que a listagem é de solicitações de TFD é a página.
 *
 * Zonas, na ordem de leitura:
 *  1. Cabeçalho de página: título 24, subtítulo muted e a ação primária de
 *     criação à direita, na mesma linha.
 *  2. Barra de filtro: busca larga com lupa à esquerda e o select de escopo à
 *     direita, os dois com 36px. Ou o `FilterBar` completo, com chips.
 *  3. Barra de ações em massa, que substitui a zona 2 quando há seleção.
 *  4. Tabela em cartão (raio 10, borda, sombra curta), com identificador em
 *     duas linhas, badge de status, datas em mono e ação por linha.
 *  5. Rodapé: paginação à esquerda, "Mostrando 1 a 10 de 98" à direita.
 */
export interface ListagemProps {
  /** Zona 1: trilha de navegação (`Breadcrumb`), quando a tela vive fora do shell. */
  trilha?: ReactNode;
  /** Zona 1: nome da entidade no plural, renderizado como o `h1` da tela. */
  titulo: string;
  /** Zona 1: uma linha de contexto abaixo do título, opcional. */
  descricao?: ReactNode;
  /**
   * Zona 1: ação primária de criação ("Novo [Entidade]"), sempre no canto
   * superior direito. Regra fixa da spec: nunca dentro da barra de filtros.
   */
  acaoPrimaria?: ReactNode;
  /** Zona 2: busca larga com lupa (`Search`). Cresce para ocupar a linha. */
  busca?: ReactNode;
  /**
   * Zona 2: select de escopo à direita da busca (`Select` com `rotuloOculto`,
   * placeholder "Todos os setores"). Um ou mais controles.
   */
  escopo?: ReactNode;
  /**
   * Zona 2 completa: `FilterBar` com controles, chips de filtros ativos e
   * contagem. Quando presente, ocupa a linha no lugar de `busca` e `escopo`.
   */
  filtros?: ReactNode;
  /**
   * Zona 3: quando verdadeiro, a zona 2 sai da tela e dá lugar à barra de
   * ações em massa. A barra em si é renderizada pelo `Table`, via a prop
   * `acoesEmMassa`, que é quem detém o estado de seleção e o contador.
   */
  selecaoAtiva?: boolean;
  /** Zona 4: a tabela principal (`Table`). */
  tabela: ReactNode;
  /** Zona 5: paginador (`Pagination`). Fica à esquerda. */
  paginacao?: ReactNode;
  /** Zona 5: seletor de itens por página (`Select`), ao lado do paginador. */
  itensPorPagina?: ReactNode;
  /** Zona 5: "Mostrando 1 a 10 de 98 registros" (`resumoDePaginacao`), à direita. */
  resumo?: string;
}

export function Listagem({
  trilha,
  titulo,
  descricao,
  acaoPrimaria,
  busca,
  escopo,
  filtros,
  selecaoAtiva = false,
  tabela,
  paginacao,
  itensPorPagina,
  resumo,
}: ListagemProps) {
  const tituloId = useId();
  const temFiltro = Boolean(filtros || busca || escopo);
  const temRodape = Boolean(paginacao || itensPorPagina || resumo);

  return (
    <main className="citie-tpl-listagem" aria-labelledby={tituloId}>
      <header className="citie-tpl-listagem__cabecalho">
        <div className="citie-tpl-listagem__identificacao">
          {trilha}
          <h1 className="citie-tpl-listagem__titulo" id={tituloId}>
            {titulo}
          </h1>
          {descricao ? <p className="citie-tpl-listagem__descricao">{descricao}</p> : null}
        </div>

        {acaoPrimaria ? <div className="citie-tpl-listagem__acao">{acaoPrimaria}</div> : null}
      </header>

      {/* Zona 2. Some por inteiro quando a seleção múltipla está ativa:
          a barra de ações em massa ocupa o lugar, nunca as duas ao mesmo tempo. */}
      {temFiltro && !selecaoAtiva ? (
        filtros ? (
          <div className="citie-tpl-listagem__filtros">{filtros}</div>
        ) : (
          <div className="citie-tpl-listagem__filtro" role="search" aria-label={`Filtro de ${titulo}`}>
            {busca ? <div className="citie-tpl-listagem__busca">{busca}</div> : null}
            {escopo ? <div className="citie-tpl-listagem__escopo">{escopo}</div> : null}
          </div>
        )
      ) : null}

      {/* Zonas 3 e 4. A barra de ações em massa nasce dentro do próprio Table,
          logo acima do cabeçalho da tabela, no lugar deixado pelos filtros. */}
      <div className="citie-tpl-listagem__tabela">{tabela}</div>

      {temRodape ? (
        <footer className="citie-tpl-listagem__rodape">
          <div className="citie-tpl-listagem__navegacao">
            {paginacao ? <div className="citie-tpl-listagem__paginacao">{paginacao}</div> : null}
            {itensPorPagina ? (
              <div className="citie-tpl-listagem__itens-por-pagina">{itensPorPagina}</div>
            ) : null}
          </div>
          {resumo ? <p className="citie-tpl-listagem__resumo">{resumo}</p> : null}
        </footer>
      ) : null}
    </main>
  );
}
