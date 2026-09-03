import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Tree.css';

/**
 * Tree (Figma CitieOne, página `6738:49728`).
 *
 * Variantes do arquivo respeitadas:
 * - `tree-treenode`: State (Idle | Hover | Highlight), Selection (False | True),
 *   Show Checkbox (False | True), Show Toggle Button, Show Icon + Icon
 *   (instance swap) e Text.
 * - `tree-node-toggle-button`: State (Idle | Hover), Toggle (False | True),
 *   Selected (False | True) — daí o chevron que gira ao abrir e acompanha a
 *   cor do nó selecionado.
 * - `tree`: um `inputtext` opcional acima de `root-children`, com `node-children`
 *   aninhado sob o nó que os abriu. É essa aninhação que o markup reproduz.
 *
 * Os exemplos da página cobrem Basic, Checkbox e Filter. Seleção múltipla sem
 * caixa e carregamento sob demanda não têm exemplo desenhado: vieram do
 * comportamento do `p-tree` equivalente e estão marcados como inferência.
 *
 * Cores saem só dos tokens Citiesoft; o azul do CitieOne é do kit PrimeOne.
 */

export interface NoDaArvore {
  /** Identificador estável do nó, usado na seleção e na expansão. */
  chave: string;
  rotulo: string;
  /** Ícone à esquerda do rótulo (`👁️ Show Icon` + `Icon` do Figma). */
  icone?: ReactNode;
  filhos?: NoDaArvore[];
  /**
   * Nó que anuncia filhos ainda não carregados. Ele exibe o chevron mesmo sem
   * `filhos` e dispara `aoCarregarFilhos` na primeira abertura.
   */
  carregaSobDemanda?: boolean;
}

export type ModoSelecaoArvore = 'nenhuma' | 'unica' | 'multipla' | 'checkbox';

export interface TreeProps {
  /** Nome acessível da árvore. Fica no `aria-label` da raiz. */
  rotulo: string;
  nos: NoDaArvore[];
  /** `checkbox` marca a subárvore inteira e mantém o pai coerente. */
  modoSelecao?: ModoSelecaoArvore;
  chavesExpandidas?: string[];
  chavesSelecionadas?: string[];
  /** Campo de filtro acima da árvore (exemplo "Filter" da página). */
  comFiltro?: boolean;
  /** Nós cujos filhos estão sendo buscados: o chevron vira indicador de carga. */
  chavesCarregando?: string[];
  aoCarregarFilhos?: (no: NoDaArvore) => void;
  aoSelecionar?: (chaves: string[]) => void;
  aoExpandir?: (chaves: string[]) => void;
  mensagemVazio?: string;
}

interface NoVisivel {
  no: NoDaArvore;
  nivel: number;
}

function temRamo(no: NoDaArvore): boolean {
  return Boolean(no.filhos?.length) || Boolean(no.carregaSobDemanda);
}

/** Lista linear dos nós que o teclado percorre: só o que está visível na tela. */
function achatarVisiveis(nos: NoDaArvore[], expandidos: Set<string>, nivel = 1): NoVisivel[] {
  return nos.flatMap((no) => {
    const linha: NoVisivel = { no, nivel };
    const abrir = Boolean(no.filhos?.length) && expandidos.has(no.chave);
    return abrir ? [linha, ...achatarVisiveis(no.filhos ?? [], expandidos, nivel + 1)] : [linha];
  });
}

function chavesDaSubarvore(no: NoDaArvore): string[] {
  return [no.chave, ...(no.filhos ?? []).flatMap(chavesDaSubarvore)];
}

function todasAsChaves(nos: NoDaArvore[]): string[] {
  return nos.flatMap(chavesDaSubarvore);
}

/**
 * Mantém o pai coerente com os filhos depois de cada clique: pai marcado só
 * quando todo filho está marcado, senão ele volta a parcial.
 */
function normalizarPais(nos: NoDaArvore[], marcados: Set<string>): Set<string> {
  const resultado = new Set(marcados);

  const visitar = (no: NoDaArvore): boolean => {
    if (!no.filhos?.length) return resultado.has(no.chave);
    const filhosMarcados = no.filhos.map(visitar);
    if (filhosMarcados.every(Boolean)) resultado.add(no.chave);
    else resultado.delete(no.chave);
    return resultado.has(no.chave);
  };

  nos.forEach(visitar);
  return resultado;
}

function filtrarArvore(nos: NoDaArvore[], termo: string): NoDaArvore[] {
  return nos.flatMap((no) => {
    const bate = no.rotulo.toLowerCase().includes(termo);
    // Nó que bate carrega a subárvore inteira; senão só os ramos que batem.
    const filhos = bate ? no.filhos : filtrarArvore(no.filhos ?? [], termo);
    if (!bate && !filhos?.length) return [];
    return [{ ...no, filhos }];
  });
}

function Chevron({ aberto }: { aberto: boolean }) {
  return (
    <svg
      className={`citie-tree__chevron${aberto ? ' citie-tree__chevron--aberto' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Girador() {
  return (
    <svg
      className="citie-tree__girador"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
    </svg>
  );
}

export function Tree({
  rotulo,
  nos,
  modoSelecao = 'unica',
  chavesExpandidas = [],
  chavesSelecionadas = [],
  comFiltro = false,
  chavesCarregando = [],
  aoCarregarFilhos,
  aoSelecionar,
  aoExpandir,
  mensagemVazio = 'Nenhum item para o filtro aplicado',
}: TreeProps) {
  const idBase = useId().replace(/[^\w-]/g, '');
  const [expandidos, setExpandidos] = useState(() => new Set(chavesExpandidas));
  const [marcados, setMarcados] = useState(
    () =>
      new Set(
        modoSelecao === 'checkbox'
          ? normalizarPais(nos, new Set(chavesSelecionadas))
          : chavesSelecionadas,
      ),
  );
  const [termo, setTermo] = useState('');
  const [ativo, setAtivo] = useState<string | undefined>(chavesSelecionadas[0]);

  const carregando = useMemo(() => new Set(chavesCarregando), [chavesCarregando]);
  const filtrando = comFiltro && termo.trim().length > 0;
  const arvore = useMemo(
    () => (filtrando ? filtrarArvore(nos, termo.trim().toLowerCase()) : nos),
    [filtrando, nos, termo],
  );
  // Filtro em árvore só é legível com tudo aberto: esconder o ramo que bateu
  // atrás de um nó fechado devolve uma lista aparentemente vazia.
  const expandidosEfetivos = useMemo(
    () => (filtrando ? new Set(todasAsChaves(arvore)) : expandidos),
    [arvore, expandidos, filtrando],
  );

  const visiveis = useMemo(
    () => achatarVisiveis(arvore, expandidosEfetivos),
    [arvore, expandidosEfetivos],
  );

  const idDoNo = (chave: string) => `${idBase}-no-${chave.replace(/[^\w-]/g, '_')}`;

  const indiceAtivo = Math.max(
    visiveis.findIndex((linha) => linha.no.chave === ativo),
    0,
  );
  const linhaAtiva = visiveis[indiceAtivo];

  const irPara = (indice: number) => {
    const destino = visiveis[Math.min(Math.max(indice, 0), visiveis.length - 1)];
    if (destino) setAtivo(destino.no.chave);
  };

  const alternarExpansao = (no: NoDaArvore, abrir?: boolean) => {
    const deveAbrir = abrir ?? !expandidosEfetivos.has(no.chave);
    // Só busca na primeira abertura de um nó que ainda não trouxe os filhos.
    if (deveAbrir && no.carregaSobDemanda && !no.filhos?.length) aoCarregarFilhos?.(no);

    const proximo = new Set(expandidos);
    if (deveAbrir) proximo.add(no.chave);
    else proximo.delete(no.chave);
    setExpandidos(proximo);
    aoExpandir?.([...proximo]);
  };

  const selecionar = (no: NoDaArvore) => {
    if (modoSelecao === 'nenhuma') return;
    setAtivo(no.chave);

    const emitir = (proximos: Set<string>) => {
      setMarcados(proximos);
      aoSelecionar?.([...proximos]);
    };

    if (modoSelecao === 'unica') {
      emitir(new Set([no.chave]));
      return;
    }

    if (modoSelecao === 'multipla') {
      const proximos = new Set(marcados);
      if (proximos.has(no.chave)) proximos.delete(no.chave);
      else proximos.add(no.chave);
      emitir(proximos);
      return;
    }

    const subarvore = chavesDaSubarvore(no);
    const proximos = new Set(marcados);
    if (marcados.has(no.chave)) subarvore.forEach((chave) => proximos.delete(chave));
    else subarvore.forEach((chave) => proximos.add(chave));
    emitir(normalizarPais(nos, proximos));
  };

  const estadoDe = (no: NoDaArvore): 'marcado' | 'parcial' | 'vazio' => {
    if (marcados.has(no.chave)) return 'marcado';
    const parcial = chavesDaSubarvore(no).some((chave) => marcados.has(chave));
    return parcial ? 'parcial' : 'vazio';
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (!linhaAtiva) return;
    const { no, nivel } = linhaAtiva;
    const ramo = temRamo(no);
    const expandido = expandidosEfetivos.has(no.chave);

    const acoes: Record<string, () => void> = {
      ArrowDown: () => irPara(indiceAtivo + 1),
      ArrowUp: () => irPara(indiceAtivo - 1),
      Home: () => irPara(0),
      End: () => irPara(visiveis.length - 1),
      ArrowRight: () => {
        if (ramo && !expandido) alternarExpansao(no, true);
        else if (ramo) irPara(indiceAtivo + 1);
      },
      ArrowLeft: () => {
        if (ramo && expandido) {
          alternarExpansao(no, false);
          return;
        }
        // Sobe para o ancestral: primeira linha acima com nível menor.
        for (let i = indiceAtivo - 1; i >= 0; i -= 1) {
          if (visiveis[i].nivel < nivel) {
            irPara(i);
            return;
          }
        }
      },
      Enter: () => selecionar(no),
      ' ': () => selecionar(no),
    };

    const acao = acoes[evento.key];
    if (acao) {
      evento.preventDefault();
      acao();
    }
  };

  /**
   * Hierarquia montada em `div` com papéis explícitos: `role="group"` não é
   * permitido em `<li>`, então a lista semântica não serve aqui. O `group` fica
   * dentro do `treeitem` que o abre, como manda o padrão de árvore.
   */
  const renderizarRamo = (lista: NoDaArvore[], nivel: number): ReactNode =>
    lista.map((no) => {
      const ramo = temRamo(no);
      const expandido = expandidosEfetivos.has(no.chave);
      const buscando = carregando.has(no.chave);
      const estado = modoSelecao === 'checkbox' ? estadoDe(no) : undefined;
      const selecionado = modoSelecao === 'checkbox' ? estado === 'marcado' : marcados.has(no.chave);
      const rotuloId = `${idDoNo(no.chave)}-rotulo`;

      return (
        <div
          key={no.chave}
          id={idDoNo(no.chave)}
          role="treeitem"
          aria-level={nivel}
          aria-expanded={ramo ? expandido : undefined}
          aria-selected={modoSelecao === 'nenhuma' ? undefined : selecionado}
          // Nome vem só do rótulo: sem isso o `treeitem` herdaria o texto de
          // todos os descendentes abertos.
          aria-labelledby={rotuloId}
          className="citie-tree__no"
          // O clique precisa ficar no próprio `treeitem`: é ele que o usuário e
          // o leitor de tela enxergam como o nó. Como os filhos são renderizados
          // dentro dele, o evento é interrompido para não selecionar o ancestral
          // junto.
          onClick={(evento) => {
            evento.stopPropagation();
            selecionar(no);
          }}
        >
          <div
            className={[
              'citie-tree__linha',
              selecionado ? 'citie-tree__linha--selecionada' : null,
              no.chave === linhaAtiva?.no.chave ? 'citie-tree__linha--ativa' : null,
              modoSelecao === 'nenhuma' ? 'citie-tree__linha--sem-selecao' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingInlineStart: `calc(${nivel - 1} * var(--citie-spacing-4))` }}
          >
            <span
              className="citie-tree__alternador"
              aria-hidden="true"
              onClick={
                ramo
                  ? (evento) => {
                      // Expandir não é escolher: o clique no chevron para aqui.
                      evento.stopPropagation();
                      setAtivo(no.chave);
                      alternarExpansao(no);
                    }
                  : undefined
              }
            >
              {buscando ? <Girador /> : ramo ? <Chevron aberto={expandido} /> : null}
            </span>

            {modoSelecao === 'checkbox' ? (
              <span className={`citie-tree__caixa citie-tree__caixa--${estado}`} aria-hidden="true">
                {estado === 'marcado' ? '✓' : estado === 'parcial' ? '–' : ''}
              </span>
            ) : null}

            {no.icone ? (
              <span className="citie-tree__icone" aria-hidden="true">
                {no.icone}
              </span>
            ) : null}

            <span id={rotuloId} className="citie-tree__rotulo">
              {no.rotulo}
              {estado === 'parcial' ? (
                <span className="citie-visualmente-oculto"> (seleção parcial)</span>
              ) : null}
              {buscando ? (
                <span className="citie-visualmente-oculto"> (carregando os itens)</span>
              ) : null}
            </span>
          </div>

          {no.filhos?.length && expandido ? (
            <div role="group" className="citie-tree__grupo">
              {renderizarRamo(no.filhos, nivel + 1)}
            </div>
          ) : null}
        </div>
      );
    });

  return (
    <div className="citie-tree">
      {comFiltro ? (
        <input
          type="search"
          className="citie-tree__filtro"
          placeholder="Filtrar"
          aria-label={`Filtrar ${rotulo.toLowerCase()}`}
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
        />
      ) : null}

      {visiveis.length === 0 ? (
        // Sem nó nenhum o papel `tree` fica sem filho válido e quebra a
        // estrutura ARIA: o container vira texto comum.
        <p className="citie-tree__vazio">{mensagemVazio}</p>
      ) : (
        <div
          role="tree"
          aria-label={rotulo}
          aria-multiselectable={
            modoSelecao === 'checkbox' || modoSelecao === 'multipla' || undefined
          }
          aria-activedescendant={linhaAtiva ? idDoNo(linhaAtiva.no.chave) : undefined}
          // Região rolável precisa receber foco; é também a dona do teclado.
          tabIndex={0}
          className="citie-tree__raiz"
          onKeyDown={aoTeclar}
        >
          {renderizarRamo(arvore, 1)}
        </div>
      )}
    </div>
  );
}
