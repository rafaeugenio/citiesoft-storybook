import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { Button } from '../../atoms/Button/Button';
import './OrganizationChart.css';

/**
 * Organograma hierárquico.
 *
 * Figma CitieOne, página `6738:49724` (❖ OrganizationChart). Component sets do
 * arquivo e como cada eixo foi respeitado:
 *
 * - `organizationchart-node`: `State` (Default/Hover), `Toggleable`,
 *   `Selected`, e os eixos de conector `Top`, `Top Left`, `Top Right`, `Down`,
 *   que no Figma são variantes manuais e aqui saem da posição real do nó
 *   (primeiro, meio, último, com ou sem filhos).
 * - `organizationchart-nodetogglebutton`: `Expanded`, `State` (Default/Hover) e
 *   `Focus`. O foco não mora no botão: quem recebe foco é o nó, pelo padrão de
 *   árvore ARIA, então o eixo `Focus` foi remapeado para o nó.
 *
 * Decisão de acessibilidade: o desenho é inacessível por natureza, então a
 * hierarquia existe duas vezes. Os conectores são `span` decorativos com
 * `aria-hidden`, o desenho é uma árvore ARIA de verdade (`tree` / `treeitem` /
 * `group` com `aria-level` e `aria-expanded`, navegável por setas) e há sempre
 * a alternativa "Ver lista", uma lista aninhada com a hierarquia inteira
 * aberta, no mesmo espírito do "Ver tabela" do componente de Gráficos.
 *
 * O foco funciona como no TreeSelect deste repositório: quem recebe foco do
 * teclado é o container `tree`, e o nó ativo é apontado por
 * `aria-activedescendant`. Os `treeitem` são aninhados no DOM, então um
 * `onKeyDown` por nó faria o evento subir e cada ancestral reagir de novo à
 * mesma tecla.
 *
 * Cor, tipografia, raio e espaçamento saem dos tokens Citiesoft, nunca do
 * CitieOne (que ainda carrega o azul Tailwind do Aura).
 */
export interface NoDoOrganograma {
  id: string;
  /** Unidade ou cargo. É o que nomeia o nó para o leitor de tela. */
  titulo: string;
  /** Quem ocupa a unidade, tipicamente o nome do servidor. */
  subtitulo?: string;
  /** Informação curta de apoio: sigla, lotação, quantidade de servidores. */
  detalhe?: string;
  filhos?: NoDoOrganograma[];
}

export interface OrganizationChartProps {
  /** Nome acessível da árvore. Aparece também como título do bloco. */
  label: string;
  raiz: NoDoOrganograma;
  /** Ids abertos na primeira renderização. A raiz abre sempre. */
  expandidosPadrao?: string[];
  /** Liga `aria-selected` e o realce de nó escolhido. */
  selecionavel?: boolean;
  selecionadoPadrao?: string;
  onSelecionar?: (no: NoDoOrganograma) => void;
  /** Desliga o gatilho "Ver lista". Só use quando a lista já existir na tela. */
  semAlternativaEmLista?: boolean;
}

interface NoVisivel {
  no: NoDoOrganograma;
  paiId?: string;
}

/** Percorre a árvore na ordem em que ela é lida na tela, pulando o que está fechado. */
function achatarVisiveis(
  no: NoDoOrganograma,
  expandidos: Set<string>,
  paiId?: string,
  acumulado: NoVisivel[] = [],
): NoVisivel[] {
  acumulado.push({ no, paiId });
  if (no.filhos?.length && expandidos.has(no.id)) {
    for (const filho of no.filhos) achatarVisiveis(filho, expandidos, no.id, acumulado);
  }
  return acumulado;
}

function contarDescendentes(no: NoDoOrganograma): number {
  return (no.filhos ?? []).reduce((total, filho) => total + 1 + contarDescendentes(filho), 0);
}

/** Lista aninhada com a hierarquia inteira: a leitura nunca depende do desenho. */
function ListaAninhada({ nos, nivel }: { nos: NoDoOrganograma[]; nivel: number }) {
  return (
    <ul className="citie-organograma__lista" data-nivel={nivel}>
      {nos.map((no) => (
        <li key={no.id}>
          <span className="citie-organograma__lista-titulo">{no.titulo}</span>
          {no.subtitulo ? (
            <span className="citie-organograma__lista-apoio">{no.subtitulo}</span>
          ) : null}
          {no.detalhe ? <span className="citie-organograma__lista-apoio">{no.detalhe}</span> : null}
          {no.filhos?.length ? <ListaAninhada nos={no.filhos} nivel={nivel + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}

interface ContextoDaArvore {
  expandidos: Set<string>;
  selecionado?: string;
  selecionavel: boolean;
  /** Nó apontado por `aria-activedescendant`. */
  ativo: string;
  alternar: (id: string) => void;
  escolher: (no: NoDoOrganograma) => void;
  idDoNo: (id: string) => string;
  prefixo: string;
}

function ItemDaArvore({
  no,
  nivel,
  posicao,
  total,
  primeiro,
  ultimo,
  ctx,
}: {
  no: NoDoOrganograma;
  nivel: number;
  posicao: number;
  total: number;
  primeiro: boolean;
  ultimo: boolean;
  ctx: ContextoDaArvore;
}) {
  const temFilhos = Boolean(no.filhos?.length);
  const aberto = temFilhos && ctx.expandidos.has(no.id);
  const escolhido = ctx.selecionavel && ctx.selecionado === no.id;
  const rotuloId = `${ctx.prefixo}-rotulo-${no.id}`;
  const ativo = ctx.ativo === no.id;

  return (
    <div
      className={
        ativo ? 'citie-organograma__item citie-organograma__item--ativo' : 'citie-organograma__item'
      }
      id={ctx.idDoNo(no.id)}
      role="treeitem"
      aria-labelledby={rotuloId}
      aria-level={nivel}
      aria-posinset={posicao}
      aria-setsize={total}
      aria-expanded={temFilhos ? aberto : undefined}
      aria-selected={ctx.selecionavel ? escolhido : undefined}
      onClick={(evento) => {
        // O clique para no nó tocado; sem isto o ancestral também reagiria.
        evento.stopPropagation();
        if (ctx.selecionavel) ctx.escolher(no);
        else if (temFilhos) ctx.alternar(no.id);
      }}
    >
      {nivel > 1 ? (
        <>
          <span
            className={[
              'citie-organograma__conector',
              'citie-organograma__conector--barra',
              total === 1 ? 'citie-organograma__conector--unico' : '',
              primeiro ? 'citie-organograma__conector--primeiro' : '',
              ultimo ? 'citie-organograma__conector--ultimo' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
          <span
            className="citie-organograma__conector citie-organograma__conector--haste"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div
        className={[
          'citie-organograma__no',
          escolhido ? 'citie-organograma__no--selecionado' : '',
          temFilhos ? 'citie-organograma__no--expansivel' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="citie-organograma__titulo" id={rotuloId}>
          {no.titulo}
          {escolhido ? (
            // Seleção nunca é só cor: o nó escolhido também ganha marca visual.
            <svg
              className="citie-organograma__marca"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path
                d="M3 8.5l3.2 3.2L13 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        {no.subtitulo ? <span className="citie-organograma__ocupante">{no.subtitulo}</span> : null}
        {no.detalhe ? <span className="citie-organograma__detalhe">{no.detalhe}</span> : null}

        {temFilhos ? (
          // Atalho de mouse. O teclado abre e fecha pelo próprio nó, que é quem
          // carrega o aria-expanded, então este alvo fica fora da árvore ARIA.
          <span
            className="citie-organograma__alternador"
            aria-hidden="true"
            onClick={(evento) => {
              evento.stopPropagation();
              ctx.alternar(no.id);
            }}
          >
            <svg viewBox="0 0 16 16" width="12" height="12" className="citie-organograma__seta">
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : null}
      </div>

      {temFilhos && aberto ? (
        <div className="citie-organograma__filhos" role="group">
          <span
            className="citie-organograma__conector citie-organograma__conector--tronco"
            aria-hidden="true"
          />
          {no.filhos!.map((filho, indice) => (
            <ItemDaArvore
              key={filho.id}
              no={filho}
              nivel={nivel + 1}
              posicao={indice + 1}
              total={no.filhos!.length}
              primeiro={indice === 0}
              ultimo={indice === no.filhos!.length - 1}
              ctx={ctx}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OrganizationChart({
  label,
  raiz,
  expandidosPadrao,
  selecionavel = false,
  selecionadoPadrao,
  onSelecionar,
  semAlternativaEmLista = false,
}: OrganizationChartProps) {
  const prefixo = useId();
  const [expandidos, setExpandidos] = useState<Set<string>>(
    () => new Set([raiz.id, ...(expandidosPadrao ?? [])]),
  );
  const [selecionado, setSelecionado] = useState<string | undefined>(selecionadoPadrao);
  const [ativo, setAtivo] = useState<string>(raiz.id);
  const [verLista, setVerLista] = useState(false);

  const visiveis = useMemo(() => achatarVisiveis(raiz, expandidos), [raiz, expandidos]);
  const idDoNo = (id: string) => `${prefixo}-no-${id}`;

  const alternar = (id: string) => {
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
    setAtivo(id);
  };

  const escolher = (no: NoDoOrganograma) => {
    setSelecionado(no.id);
    setAtivo(no.id);
    onSelecionar?.(no);
  };

  /** Um único handler, no container: os `treeitem` são aninhados no DOM. */
  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const indice = Math.max(
      0,
      visiveis.findIndex((item) => item.no.id === ativo),
    );
    const no = visiveis[indice].no;
    const temFilhos = Boolean(no.filhos?.length);
    const aberto = temFilhos && expandidos.has(no.id);

    switch (evento.key) {
      case 'ArrowDown': {
        evento.preventDefault();
        const proximo = visiveis[indice + 1];
        if (proximo) setAtivo(proximo.no.id);
        break;
      }
      case 'ArrowUp': {
        evento.preventDefault();
        const anterior = visiveis[indice - 1];
        if (anterior) setAtivo(anterior.no.id);
        break;
      }
      case 'ArrowRight': {
        evento.preventDefault();
        if (temFilhos && !aberto) alternar(no.id);
        else if (aberto) setAtivo(no.filhos![0].id);
        break;
      }
      case 'ArrowLeft': {
        evento.preventDefault();
        if (aberto) alternar(no.id);
        else {
          const paiId = visiveis[indice].paiId;
          if (paiId) setAtivo(paiId);
        }
        break;
      }
      case 'Home':
        evento.preventDefault();
        setAtivo(visiveis[0].no.id);
        break;
      case 'End':
        evento.preventDefault();
        setAtivo(visiveis[visiveis.length - 1].no.id);
        break;
      case 'Enter':
      case ' ':
        evento.preventDefault();
        if (selecionavel) escolher(no);
        else if (temFilhos) alternar(no.id);
        break;
      default:
        break;
    }
  };

  const ctx: ContextoDaArvore = {
    expandidos,
    selecionado,
    selecionavel,
    ativo,
    alternar,
    escolher,
    idDoNo,
    prefixo,
  };

  return (
    <section className="citie-organograma" aria-label={label}>
      <header className="citie-organograma__cabecalho">
        <div>
          <h3 className="citie-organograma__legenda">{label}</h3>
          <p className="citie-organograma__resumo">
            {contarDescendentes(raiz) + 1} unidades no total
          </p>
        </div>
        {semAlternativaEmLista ? null : (
          <Button variant="text" size="small" onClick={() => setVerLista(!verLista)}>
            {verLista ? 'Ver organograma' : 'Ver lista'}
          </Button>
        )}
      </header>

      {verLista ? (
        <div className="citie-organograma__lista-bloco">
          <ListaAninhada nos={[raiz]} nivel={1} />
        </div>
      ) : (
        <div
          className="citie-organograma__arvore"
          role="tree"
          aria-label={label}
          aria-activedescendant={idDoNo(ativo)}
          // Dono do teclado e região rolável na horizontal: precisa receber foco.
          tabIndex={0}
          onKeyDown={aoTeclar}
        >
          <ItemDaArvore no={raiz} nivel={1} posicao={1} total={1} primeiro ultimo ctx={ctx} />
        </div>
      )}
    </section>
  );
}
