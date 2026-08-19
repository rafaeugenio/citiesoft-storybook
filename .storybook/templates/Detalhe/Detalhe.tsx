import { useId, type ReactNode } from 'react';
import './Detalhe.css';

/**
 * Template de detalhe de registro.
 *
 * Estrutura vinda de `design-system/09-templates/tela-detalhe-registro.md`
 * (Anatomia, na ordem): cabeçalho, corpo em abas ou painel lateral de
 * metadados, timeline de atividade e comentários.
 *
 * O template não conhece o domínio: recebe tudo por slot. Quem sabe que o
 * registro é um processo de TFD é a página.
 */

export type LayoutDoDetalhe = 'abas' | 'painel-lateral';

export interface DetalheProps {
  /** Zona 1 · trilha de navegação (Breadcrumb). */
  trilha: ReactNode;
  /**
   * Zona 1 · identidade do registro: o dado mais reconhecível para quem lê,
   * nunca o identificador técnico isolado. Vira o `h1` da tela.
   */
  identidade: ReactNode;
  /** Zona 1 · linha de apoio sob o título: código, tipo, referência secundária. */
  identificacao?: ReactNode;
  /** Zona 1 · badge de estado (StatusIndicator). */
  status?: ReactNode;
  /** Zona 1 · ação primária, sempre visível fora de menu (regra fixa da spec). */
  acaoPrimaria?: ReactNode;
  /** Zona 1 · menu de ações, onde mora "Excluir" e as ações secundárias. */
  menuDeAcoes?: ReactNode;
  /** Faixa de aviso entre cabeçalho e corpo: bloqueio, permissão, dado desatualizado. */
  aviso?: ReactNode;
  /**
   * Zona 2 · `abas` para registro com múltiplas dimensões; `painel-lateral`
   * para registro simples, com os metadados à direita.
   */
  layout?: LayoutDoDetalhe;
  /** Zona 2 · corpo principal: as abas, ou os dados quando há painel lateral. */
  corpo: ReactNode;
  /**
   * Nome da zona 2. Existe por acessibilidade, não por decoração: o `Card` traz
   * `h3` próprio, então sem um `h2` aqui a tela saltaria de `h1` para `h3`
   * (`heading-order`). Fica oculto visualmente por padrão, porque as abas já
   * dizem o que cada painel é.
   */
  tituloDoCorpo?: string;
  /** Torna o título da zona 2 visível, quando o corpo não tem abas que o expliquem. */
  tituloDoCorpoVisivel?: boolean;
  /** Zona 2 · painel lateral de metadados. Só é renderizado no layout `painel-lateral`. */
  metadados?: ReactNode;
  /** Nome da região do painel lateral, para leitor de tela e para o `h2`. */
  tituloDosMetadados?: string;
  /**
   * Zona 3 · timeline de atividade como seção própria. No layout `abas` a
   * timeline costuma viver dentro de uma aba, e este slot fica vazio.
   */
  atividade?: ReactNode;
  tituloDaAtividade?: string;
  /** Zona 4 · comentários, apenas em domínio com colaboração assíncrona. */
  comentarios?: ReactNode;
  tituloDosComentarios?: string;
  /** Overlays da tela (ConfirmDialog). Ficam fora do fluxo, sempre fechados no início. */
  overlays?: ReactNode;
  /** Pilha de toasts da tela. */
  feedback?: ReactNode;
}

export function Detalhe({
  trilha,
  identidade,
  identificacao,
  status,
  acaoPrimaria,
  menuDeAcoes,
  aviso,
  layout = 'abas',
  corpo,
  tituloDoCorpo = 'Detalhes do registro',
  tituloDoCorpoVisivel = false,
  metadados,
  tituloDosMetadados = 'Resumo',
  atividade,
  tituloDaAtividade = 'Atividade',
  comentarios,
  tituloDosComentarios = 'Comentários',
  overlays,
  feedback,
}: DetalheProps) {
  const tituloId = useId();
  const corpoId = useId();
  const metadadosId = useId();
  const atividadeId = useId();
  const comentariosId = useId();

  const temAcoes = Boolean(acaoPrimaria || menuDeAcoes);
  const comPainel = layout === 'painel-lateral' && Boolean(metadados);

  return (
    <main className="citie-tpl-detalhe" aria-labelledby={tituloId}>
      <header className="citie-tpl-detalhe__cabecalho">
        {trilha}

        <div className="citie-tpl-detalhe__linha-identidade">
          <div className="citie-tpl-detalhe__identidade">
            <h1 className="citie-tpl-detalhe__titulo" id={tituloId}>
              {identidade}
            </h1>
            {status ? <div className="citie-tpl-detalhe__status">{status}</div> : null}
          </div>

          {temAcoes ? (
            <div className="citie-tpl-detalhe__acoes">
              {acaoPrimaria}
              {menuDeAcoes}
            </div>
          ) : null}
        </div>

        {identificacao ? (
          <p className="citie-tpl-detalhe__identificacao">{identificacao}</p>
        ) : null}
      </header>

      {aviso ? <div className="citie-tpl-detalhe__aviso">{aviso}</div> : null}

      <div
        className={`citie-tpl-detalhe__corpo${
          comPainel ? ' citie-tpl-detalhe__corpo--com-painel' : ''
        }`}
      >
        <section className="citie-tpl-detalhe__principal" aria-labelledby={corpoId}>
          {/* h2 da zona 2: mantém a escada h1 → h2 → h3 (o Card usa h3). */}
          <h2
            id={corpoId}
            className={
              tituloDoCorpoVisivel ? 'citie-tpl-detalhe__secao-titulo' : 'citie-visualmente-oculto'
            }
          >
            {tituloDoCorpo}
          </h2>
          {corpo}
        </section>

        {comPainel ? (
          <aside className="citie-tpl-detalhe__painel" aria-labelledby={metadadosId}>
            <h2 className="citie-tpl-detalhe__secao-titulo" id={metadadosId}>
              {tituloDosMetadados}
            </h2>
            {metadados}
          </aside>
        ) : null}
      </div>

      {atividade ? (
        <section className="citie-tpl-detalhe__secao" aria-labelledby={atividadeId}>
          <h2 className="citie-tpl-detalhe__secao-titulo" id={atividadeId}>
            {tituloDaAtividade}
          </h2>
          {atividade}
        </section>
      ) : null}

      {comentarios ? (
        <section className="citie-tpl-detalhe__secao" aria-labelledby={comentariosId}>
          <h2 className="citie-tpl-detalhe__secao-titulo" id={comentariosId}>
            {tituloDosComentarios}
          </h2>
          {comentarios}
        </section>
      ) : null}

      {overlays}
      {feedback}
    </main>
  );
}
