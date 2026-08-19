import { useId, type ReactNode } from 'react';
import './Listagem.css';

/**
 * Template de tela de listagem.
 *
 * Origem da anatomia: `design-system/09-templates/tela-listagem.md` v1.0.0.
 * O template só conhece regiões, ordem e responsividade: nada de conteúdo de
 * domínio. Quem sabe que a listagem é de solicitações de TFD é a página.
 *
 * Zonas, na ordem fixa da spec:
 *  1. Cabeçalho: trilha, título da entidade no plural e ação primária de criação.
 *  2. Barra de filtros: busca à esquerda, filtros contextuais à direita.
 *  3. Chips de filtros ativos, um removível por filtro.
 *  4. Barra de ações em massa, que substitui as zonas 2 e 3 quando há seleção.
 *  5. Tabela principal.
 *  6. Rodapé: paginador e seletor de itens por página.
 */
export interface ListagemProps {
  /** Zona 1: trilha de navegação (`Breadcrumb`). */
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
  /**
   * Zonas 2 e 3: barra de filtros e a linha de chips de filtros ativos.
   * O `FilterBar` da biblioteca já compõe as duas zonas: os controles na linha
   * de cima, os chips removíveis e o "Limpar tudo" na linha de baixo.
   */
  filtros?: ReactNode;
  /**
   * Zona 4: quando verdadeiro, as zonas 2 e 3 saem da tela e dão lugar à barra
   * de ações em massa. A barra em si é renderizada pelo `Table`, via a prop
   * `acoesEmMassa`, que é quem detém o estado de seleção e o contador.
   */
  selecaoAtiva?: boolean;
  /** Zona 5: a tabela principal (`Table`). */
  tabela: ReactNode;
  /** Zona 6: paginador com intervalo e total (`Pagination`). */
  paginacao?: ReactNode;
  /** Zona 6: seletor de itens por página (`Select`). */
  itensPorPagina?: ReactNode;
}

export function Listagem({
  trilha,
  titulo,
  descricao,
  acaoPrimaria,
  filtros,
  selecaoAtiva = false,
  tabela,
  paginacao,
  itensPorPagina,
}: ListagemProps) {
  const tituloId = useId();
  const temRodape = Boolean(paginacao || itensPorPagina);

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

      {/* Zonas 2 e 3. Some por inteiro quando a seleção múltipla está ativa:
          a barra de ações em massa ocupa o lugar, nunca as duas ao mesmo tempo. */}
      {filtros && !selecaoAtiva ? (
        <div className="citie-tpl-listagem__filtros">{filtros}</div>
      ) : null}

      {/* Zonas 4 e 5. A barra de ações em massa nasce dentro do próprio Table,
          logo acima do cabeçalho da tabela, no lugar deixado pelos filtros. */}
      <div className="citie-tpl-listagem__tabela">{tabela}</div>

      {temRodape ? (
        <footer className="citie-tpl-listagem__rodape">
          {itensPorPagina ? (
            <div className="citie-tpl-listagem__itens-por-pagina">{itensPorPagina}</div>
          ) : null}
          {paginacao ? <div className="citie-tpl-listagem__paginacao">{paginacao}</div> : null}
        </footer>
      ) : null}
    </main>
  );
}
