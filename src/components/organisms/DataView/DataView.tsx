import { useMemo, useState, type ReactNode } from 'react';
import { Card } from '../../molecules/Card/Card';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { Pagination } from '../../molecules/Pagination/Pagination';
import { Select, SelectButton } from '../../molecules/Select/Select';
import { Skeleton, SkeletonRegion } from '../../atoms/Skeleton/Skeleton';
import './DataView.css';

export type VisaoDataView = 'lista' | 'grade';

export interface ItemDataView {
  id: string;
  /** Identifica o registro: nome do servidor, nome da unidade. */
  titulo: string;
  /** Qualificação imediata: lotação, município, cargo. */
  subtitulo?: string;
  descricao?: string;
  /** Situação do registro. Equivale ao slot "Tag" do item no Figma. */
  etiqueta?: ReactNode;
  /** Valor numérico ou métrica alinhada à direita. Equivale ao slot "Price". */
  destaque?: ReactNode;
  /** Foto do servidor ou brasão da unidade. Equivale ao slot "image". */
  midia?: ReactNode;
  /** Torna o item navegável. Com `href`, `acoes` não é renderizada. */
  href?: string;
  acoes?: ReactNode;
}

export interface OrdenacaoDataView {
  value: string;
  /** Enuncia critério e direção: "Nome (A-Z)", "Mais recentes". */
  label: string;
  comparar: (a: ItemDataView, b: ItemDataView) => number;
}

export interface VazioDataView {
  titulo: string;
  descricao: string;
  acao?: { rotulo: string; onClick?: () => void };
}

export interface DataViewProps {
  /** Nome acessível da região, com o vocabulário do módulo. */
  legenda: string;
  itens: ItemDataView[];
  visaoInicial?: VisaoDataView;
  ordenacoes?: OrdenacaoDataView[];
  ordenacaoInicial?: string;
  itensPorPagina?: number;
  paginacao?: boolean;
  carregando?: boolean;
  /** Verdadeiro quando há busca ou filtro aplicado: muda o vazio exibido. */
  filtroAtivo?: boolean;
  /** Vazio estrutural: nada cadastrado ainda. Sempre obrigatório. */
  vazioEstrutural: VazioDataView;
  /** Vazio por filtro: há registros, o recorte é que não devolveu nada. */
  vazioPorFiltro?: VazioDataView;
  /** Substantivo contado na região de contagem. */
  unidadeDeContagem?: { singular: string; plural: string };
  onVisaoChange?: (visao: VisaoDataView) => void;
  onOrdenacaoChange?: (ordenacao: string) => void;
}

const OPCOES_DE_VISAO = [
  { value: 'lista', label: 'Lista' },
  { value: 'grade', label: 'Grade' },
];

const ROTULO_DA_VISAO: Record<VisaoDataView, string> = {
  lista: 'visão em lista',
  grade: 'visão em grade',
};

function ItemEmLista({ item }: { item: ItemDataView }) {
  return (
    <li className="citie-dataview__linha">
      {item.midia ? <div className="citie-dataview__midia">{item.midia}</div> : null}

      <div className="citie-dataview__texto">
        <h3 className="citie-dataview__titulo">
          {item.href ? (
            <a className="citie-dataview__link" href={item.href}>
              {item.titulo}
            </a>
          ) : (
            item.titulo
          )}
        </h3>
        {item.subtitulo ? <p className="citie-dataview__subtitulo">{item.subtitulo}</p> : null}
        {item.descricao ? <p className="citie-dataview__descricao">{item.descricao}</p> : null}
      </div>

      <div className="citie-dataview__meta">
        {item.etiqueta}
        {item.destaque ? <span className="citie-dataview__destaque">{item.destaque}</span> : null}
      </div>

      {item.acoes && !item.href ? (
        <div className="citie-dataview__acoes">{item.acoes}</div>
      ) : null}
    </li>
  );
}

function ItemEmGrade({ item }: { item: ItemDataView }) {
  return (
    <li className="citie-dataview__celula">
      <Card
        titulo={item.titulo}
        subtitulo={item.subtitulo}
        densidade="compacta"
        href={item.href}
        midia={item.midia}
        rodape={
          item.etiqueta || item.destaque || (item.acoes && !item.href) ? (
            <div className="citie-dataview__rodape">
              {item.etiqueta}
              {item.destaque ? (
                <span className="citie-dataview__destaque">{item.destaque}</span>
              ) : null}
              {item.acoes && !item.href ? item.acoes : null}
            </div>
          ) : null
        }
      >
        {item.descricao ? <p className="citie-dataview__descricao">{item.descricao}</p> : null}
      </Card>
    </li>
  );
}

function EsqueletoDaVisao({ visao, itens }: { visao: VisaoDataView; itens: number }) {
  if (visao === 'grade') {
    return (
      <div className="citie-dataview__grade citie-dataview__grade--esqueleto">
        {Array.from({ length: itens }, (_, indice) => (
          <div key={indice} className="citie-dataview__celula-esqueleto">
            <Skeleton forma="card" height="96px" />
            <Skeleton forma="titulo" width="70%" />
            <Skeleton forma="linha" width="45%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="citie-dataview__lista citie-dataview__lista--esqueleto">
      {Array.from({ length: itens }, (_, indice) => (
        <div key={indice} className="citie-dataview__linha-esqueleto">
          <Skeleton forma="circulo" width="40px" height="40px" />
          <div className="citie-dataview__texto-esqueleto">
            <Skeleton forma="linha" width="40%" />
            <Skeleton forma="linha" width="65%" />
          </div>
          <Skeleton forma="linha" width="88px" />
        </div>
      ))}
    </div>
  );
}

/**
 * DataView (página ❖ DataView do CitieOne, `6738:49722`).
 * Cobre o eixo `Layout` do component set `dataview` (List e Grid) e os três
 * blocos do desenho: header com ordenação e alternador, content e paginator.
 * Equivalente PrimeNG: `p-dataview`.
 *
 * A alternância de visão é um grupo de botões com `aria-pressed` (SelectButton),
 * e a contagem de resultados vive numa região `aria-live="polite"` própria, para
 * que o leitor de tela saiba quantos registros sobraram depois de ordenar,
 * paginar ou trocar de visão.
 */
export function DataView({
  legenda,
  itens,
  visaoInicial = 'lista',
  ordenacoes,
  ordenacaoInicial,
  itensPorPagina = 6,
  paginacao = true,
  carregando = false,
  filtroAtivo = false,
  vazioEstrutural,
  vazioPorFiltro,
  unidadeDeContagem = { singular: 'resultado', plural: 'resultados' },
  onVisaoChange,
  onOrdenacaoChange,
}: DataViewProps) {
  const [visao, setVisao] = useState<VisaoDataView>(visaoInicial);
  const [ordenacao, setOrdenacao] = useState(ordenacaoInicial ?? '');
  const [pagina, setPagina] = useState(1);

  const itensOrdenados = useMemo(() => {
    const escolhida = ordenacoes?.find((opcao) => opcao.value === ordenacao);
    return escolhida ? [...itens].sort(escolhida.comparar) : itens;
  }, [itens, ordenacoes, ordenacao]);

  const itensVisiveis = paginacao
    ? itensOrdenados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina)
    : itensOrdenados;

  const vazio = !carregando && itensOrdenados.length === 0;
  const conteudoVazio = filtroAtivo && vazioPorFiltro ? vazioPorFiltro : vazioEstrutural;

  const trocarVisao = (valores: string[]) => {
    const escolhida = (valores[0] ?? 'lista') as VisaoDataView;
    setVisao(escolhida);
    onVisaoChange?.(escolhida);
  };

  const trocarOrdenacao = (valor: string) => {
    setOrdenacao(valor);
    // Ordem nova invalida a posição atual: a leitura recomeça da primeira página.
    setPagina(1);
    onOrdenacaoChange?.(valor);
  };

  const contagem = itensOrdenados.length;
  const substantivo = contagem === 1 ? unidadeDeContagem.singular : unidadeDeContagem.plural;
  const mensagemDeContagem = carregando
    ? `Carregando ${unidadeDeContagem.plural}`
    : vazio
      ? // Sem adjetivo com gênero: o substantivo contado muda a cada módulo.
        `Sem ${unidadeDeContagem.plural} para exibir`
      : `${contagem.toLocaleString('pt-BR')} ${substantivo} · ${ROTULO_DA_VISAO[visao]}`;

  return (
    <section className="citie-dataview" aria-label={legenda}>
      <div className="citie-dataview__cabecalho">
        {ordenacoes && ordenacoes.length > 0 ? (
          <div className="citie-dataview__ordenacao">
            <Select
              label="Ordenar por"
              size="small"
              placeholder="Ordem padrão"
              options={ordenacoes.map(({ value, label }) => ({ value, label }))}
              defaultValue={ordenacao}
              onChange={(evento) => trocarOrdenacao(evento.target.value)}
            />
          </div>
        ) : (
          <span />
        )}

        <SelectButton
          legend="Visualização dos resultados"
          options={OPCOES_DE_VISAO}
          defaultValue={[visaoInicial]}
          onChangeValue={trocarVisao}
        />
      </div>

      <p className="citie-dataview__contagem" role="status" aria-live="polite">
        {mensagemDeContagem}
      </p>

      {carregando ? (
        <SkeletonRegion label={`Carregando ${legenda.toLowerCase()}`}>
          <EsqueletoDaVisao visao={visao} itens={Math.min(itensPorPagina, 6)} />
        </SkeletonRegion>
      ) : vazio ? (
        <EmptyState
          titulo={conteudoVazio.titulo}
          descricao={conteudoVazio.descricao}
          situacao={filtroAtivo && vazioPorFiltro ? 'busca-sem-resultado' : 'primeiro-uso'}
          // `md` não rouba o foco da página: o DataView vive dentro de uma tela maior.
          size="md"
          acaoPrimaria={conteudoVazio.acao}
        />
      ) : visao === 'grade' ? (
        <ul className="citie-dataview__grade">
          {itensVisiveis.map((item) => (
            <ItemEmGrade key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <ul className="citie-dataview__lista">
          {itensVisiveis.map((item) => (
            <ItemEmLista key={item.id} item={item} />
          ))}
        </ul>
      )}

      {paginacao && !carregando && !vazio ? (
        <Pagination
          // Trocar a ordem devolve o paginador à primeira página.
          key={ordenacao}
          label={`Paginação de ${legenda.toLowerCase()}`}
          totalRegistros={itensOrdenados.length}
          itensPorPagina={itensPorPagina}
          variant="compacta"
          onPageChange={setPagina}
        />
      ) : null}
    </section>
  );
}
