import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { FieldWrapper, type FieldSize } from '../Field/Field';
import '../Field/Field.css';
import './TreeSelect.css';

/**
 * TreeSelect (Figma CitieOne, página `6738:46436`).
 *
 * Variantes do arquivo respeitadas:
 * - `treeselect`: State (Idle | Open | Selected | Hover), Float Label.
 * - `treeselect-input`: State (Default | Hover | Focus), Invalid, Disabled,
 *   Filled, Size (Normal | Small | Large), Show Helper, Show Label,
 *   Show Clear Icon.
 * - `treeselect-input-content`: Text Config (Placeholder | Text | Chip) e
 *   Show Chip [1..3] — daí o teto de três fichas mais o resumo "+N".
 *
 * Os exemplos da página cobrem Basic, Checkbox, Float Label, Filter, Invalid e
 * Disabled. Float label não foi portado: o DS Citiesoft já resolve rótulo pelo
 * `FieldWrapper`, que empilha label acima do controle em todos os campos.
 *
 * Cores saem só dos tokens Citiesoft; o azul do CitieOne é do kit PrimeOne.
 */

export interface NoArvore {
  /** Identificador estável do nó, usado na seleção e na expansão. */
  chave: string;
  rotulo: string;
  filhos?: NoArvore[];
}

export type ModoTreeSelect = 'simples' | 'checkbox';

export interface TreeSelectProps {
  label: string;
  nos: NoArvore[];
  /** `simples` escolhe um nó e fecha; `checkbox` marca vários com propagação. */
  modo?: ModoTreeSelect;
  size?: FieldSize;
  placeholder?: string;
  filled?: boolean;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  error?: string;
  /** Campo de filtro no topo do painel (exemplo "Filter" da página). */
  comFiltro?: boolean;
  /** Ícone de limpar do Figma (`✖️ Show Clear Icon`). */
  comLimpar?: boolean;
  chavesExpandidas?: string[];
  chavesSelecionadas?: string[];
  onChange?: (chaves: string[]) => void;
}

interface NoVisivel {
  no: NoArvore;
  nivel: number;
}

/** Lista linear dos nós que o teclado percorre: só o que está visível na tela. */
function achatarVisiveis(nos: NoArvore[], expandidos: Set<string>, nivel = 1): NoVisivel[] {
  return nos.flatMap((no) => {
    const linha: NoVisivel = { no, nivel };
    const abrir = Boolean(no.filhos?.length) && expandidos.has(no.chave);
    return abrir ? [linha, ...achatarVisiveis(no.filhos ?? [], expandidos, nivel + 1)] : [linha];
  });
}

function chavesDaSubarvore(no: NoArvore): string[] {
  return [no.chave, ...(no.filhos ?? []).flatMap(chavesDaSubarvore)];
}

function todasAsChaves(nos: NoArvore[]): string[] {
  return nos.flatMap(chavesDaSubarvore);
}

function encontrar(nos: NoArvore[], chave: string): NoArvore | undefined {
  for (const no of nos) {
    if (no.chave === chave) return no;
    const achado = no.filhos ? encontrar(no.filhos, chave) : undefined;
    if (achado) return achado;
  }
  return undefined;
}

/**
 * Mantém o pai coerente com os filhos depois de cada clique: pai marcado só
 * quando todo filho está marcado, senão ele volta a parcial.
 */
function normalizarPais(nos: NoArvore[], marcados: Set<string>): Set<string> {
  const resultado = new Set(marcados);

  const visitar = (no: NoArvore): boolean => {
    if (!no.filhos?.length) return resultado.has(no.chave);
    const filhosMarcados = no.filhos.map(visitar);
    if (filhosMarcados.every(Boolean)) resultado.add(no.chave);
    else resultado.delete(no.chave);
    return resultado.has(no.chave);
  };

  nos.forEach(visitar);
  return resultado;
}

/** Nós marcados sem pai marcado: são eles que viram ficha no campo. */
function topoMarcado(nos: NoArvore[], marcados: Set<string>): NoArvore[] {
  return nos.flatMap((no) =>
    marcados.has(no.chave) ? [no] : topoMarcado(no.filhos ?? [], marcados),
  );
}

function filtrarArvore(nos: NoArvore[], termo: string): NoArvore[] {
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
      className={`citie-treeselect__chevron${aberto ? ' citie-treeselect__chevron--aberto' : ''}`}
      width="14"
      height="14"
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

export function TreeSelect({
  label,
  nos,
  modo = 'simples',
  size = 'normal',
  placeholder = 'Selecione',
  filled = false,
  disabled = false,
  required = false,
  helper,
  error,
  comFiltro = false,
  comLimpar = false,
  chavesExpandidas = [],
  chavesSelecionadas = [],
  onChange,
}: TreeSelectProps) {
  const uid = useId().replace(/[^\w-]/g, '');
  const [aberto, setAberto] = useState(false);
  const [expandidos, setExpandidos] = useState(() => new Set(chavesExpandidas));
  const [marcados, setMarcados] = useState(
    () => new Set(modo === 'checkbox' ? normalizarPais(nos, new Set(chavesSelecionadas)) : chavesSelecionadas),
  );
  const [termo, setTermo] = useState('');
  const [ativo, setAtivo] = useState<string | undefined>(chavesSelecionadas[0]);

  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const arvoreRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (aberto) arvoreRef.current?.focus();
  }, [aberto]);

  const idDoNo = (chave: string) => `${uid}-no-${chave.replace(/[^\w-]/g, '_')}`;

  const indiceAtivo = Math.max(
    visiveis.findIndex((linha) => linha.no.chave === ativo),
    0,
  );
  const linhaAtiva = visiveis[indiceAtivo];

  const irPara = (indice: number) => {
    const destino = visiveis[Math.min(Math.max(indice, 0), visiveis.length - 1)];
    if (destino) setAtivo(destino.no.chave);
  };

  const alternarExpansao = (chave: string, abrir?: boolean) => {
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      const deveAbrir = abrir ?? !proximo.has(chave);
      if (deveAbrir) proximo.add(chave);
      else proximo.delete(chave);
      return proximo;
    });
  };

  const emitir = (proximos: Set<string>) => {
    setMarcados(proximos);
    onChange?.([...proximos]);
  };

  const selecionar = (no: NoArvore) => {
    if (modo === 'simples') {
      emitir(new Set([no.chave]));
      setAtivo(no.chave);
      setAberto(false);
      gatilhoRef.current?.focus();
      return;
    }

    const subarvore = chavesDaSubarvore(no);
    const proximos = new Set(marcados);
    if (marcados.has(no.chave)) subarvore.forEach((chave) => proximos.delete(chave));
    else subarvore.forEach((chave) => proximos.add(chave));
    emitir(normalizarPais(nos, proximos));
    setAtivo(no.chave);
  };

  const limpar = () => {
    emitir(new Set());
    gatilhoRef.current?.focus();
  };

  const estadoDe = (no: NoArvore): 'marcado' | 'parcial' | 'vazio' => {
    if (marcados.has(no.chave)) return 'marcado';
    const parcial = chavesDaSubarvore(no).some((chave) => marcados.has(chave));
    return parcial ? 'parcial' : 'vazio';
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (!linhaAtiva) return;
    const { no, nivel } = linhaAtiva;
    const temFilhos = Boolean(no.filhos?.length);
    const expandido = expandidosEfetivos.has(no.chave);

    const acoes: Record<string, () => void> = {
      ArrowDown: () => irPara(indiceAtivo + 1),
      ArrowUp: () => irPara(indiceAtivo - 1),
      Home: () => irPara(0),
      End: () => irPara(visiveis.length - 1),
      ArrowRight: () => {
        if (temFilhos && !expandido) alternarExpansao(no.chave, true);
        else if (temFilhos) irPara(indiceAtivo + 1);
      },
      ArrowLeft: () => {
        if (temFilhos && expandido) {
          alternarExpansao(no.chave, false);
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
      Escape: () => {
        setAberto(false);
        gatilhoRef.current?.focus();
      },
    };

    const acao = acoes[evento.key];
    if (acao) {
      evento.preventDefault();
      acao();
    }
  };

  const fichas = modo === 'checkbox' ? topoMarcado(nos, marcados) : [];
  const rotuloUnico =
    modo === 'simples' && marcados.size > 0
      ? encontrar(nos, [...marcados][0])?.rotulo
      : undefined;
  const temSelecao = modo === 'simples' ? Boolean(rotuloUnico) : fichas.length > 0;

  /**
   * Hierarquia montada em `div` com papéis explícitos: `role="group"` não é
   * permitido em `<li>`, então a lista semântica não serve aqui. O `group` fica
   * dentro do `treeitem` que o abre, como manda o padrão de árvore.
   */
  const renderizarRamo = (lista: NoArvore[], nivel: number) =>
    lista.map((no) => {
      const temFilhos = Boolean(no.filhos?.length);
      const expandido = expandidosEfetivos.has(no.chave);
      const estado = modo === 'checkbox' ? estadoDe(no) : undefined;
      const selecionado = modo === 'simples' ? marcados.has(no.chave) : estado === 'marcado';
      const rotuloId = `${idDoNo(no.chave)}-rotulo`;

      return (
        <div
          key={no.chave}
          id={idDoNo(no.chave)}
          role="treeitem"
          aria-level={nivel}
          aria-selected={selecionado}
          aria-expanded={temFilhos ? expandido : undefined}
          // Nome vem só do rótulo: sem isso o `treeitem` herdaria o texto de
          // todos os descendentes abertos.
          aria-labelledby={rotuloId}
          className="citie-treeselect__no"
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
              'citie-treeselect__linha',
              selecionado ? 'citie-treeselect__linha--selecionada' : null,
              no.chave === linhaAtiva?.no.chave ? 'citie-treeselect__linha--ativa' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingInlineStart: `calc(${nivel - 1} * var(--citie-spacing-4))` }}
          >
            <span
              className="citie-treeselect__alternador"
              aria-hidden="true"
              onClick={
                temFilhos
                  ? (evento) => {
                      // Expandir não é escolher: o clique no chevron para aqui.
                      evento.stopPropagation();
                      setAtivo(no.chave);
                      alternarExpansao(no.chave);
                    }
                  : undefined
              }
            >
              {temFilhos ? <Chevron aberto={expandido} /> : null}
            </span>

            {modo === 'checkbox' ? (
              <span
                className={`citie-treeselect__caixa citie-treeselect__caixa--${estado}`}
                aria-hidden="true"
              >
                {estado === 'marcado' ? '✓' : estado === 'parcial' ? '–' : ''}
              </span>
            ) : null}

            <span id={rotuloId} className="citie-treeselect__rotulo">
              {no.rotulo}
              {estado === 'parcial' ? (
                <span className="citie-visualmente-oculto"> (seleção parcial)</span>
              ) : null}
            </span>
          </div>

          {temFilhos && expandido ? (
            <div role="group">{renderizarRamo(no.filhos ?? [], nivel + 1)}</div>
          ) : null}
        </div>
      );
    });

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="citie-treeselect">
          <button
            id={id}
            ref={gatilhoRef}
            type="button"
            className={[
              'citie-treeselect__gatilho',
              `citie-treeselect__gatilho--${size}`,
              filled ? 'citie-treeselect__gatilho--filled' : null,
              invalid ? 'citie-treeselect__gatilho--invalido' : null,
              comLimpar && temSelecao ? 'citie-treeselect__gatilho--com-limpar' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-haspopup="tree"
            aria-expanded={aberto}
            // Só aponta para a árvore quando ela existe: `aria-controls` órfão
            // é referência quebrada e o gate de acessibilidade reprova.
            aria-controls={aberto && visiveis.length > 0 ? `${uid}-arvore` : undefined}
            // Sem `aria-required` de propósito: o papel `button` não suporta o
            // atributo e o axe reprova. A obrigatoriedade fica no `*` do rótulo.
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={() => setAberto(!aberto)}
          >
            <span className="citie-treeselect__conteudo">
              {!temSelecao ? (
                <span className="citie-treeselect__placeholder">{placeholder}</span>
              ) : modo === 'simples' ? (
                rotuloUnico
              ) : (
                <span className="citie-treeselect__fichas">
                  {fichas.slice(0, 3).map((no) => (
                    <span key={no.chave} className="citie-treeselect__ficha">
                      {no.rotulo}
                    </span>
                  ))}
                  {fichas.length > 3 ? (
                    <span className="citie-treeselect__ficha citie-treeselect__ficha--resumo">
                      +{fichas.length - 3}
                    </span>
                  ) : null}
                </span>
              )}
            </span>

            <svg
              className={`citie-treeselect__seta${
                aberto ? ' citie-treeselect__seta--aberta' : ''
              }`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Fora do `button` de propósito: botão dentro de botão é HTML inválido. */}
          {comLimpar && temSelecao && !disabled ? (
            <button
              type="button"
              className="citie-treeselect__limpar"
              aria-label={`Limpar ${label.toLowerCase()}`}
              onClick={limpar}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}

          {aberto ? (
            <div className="citie-treeselect__painel">
              {comFiltro ? (
                <input
                  type="search"
                  className="citie-treeselect__filtro"
                  placeholder="Filtrar"
                  aria-label={`Filtrar ${label.toLowerCase()}`}
                  value={termo}
                  onChange={(evento) => setTermo(evento.target.value)}
                />
              ) : null}

              {visiveis.length === 0 ? (
                // Sem nó nenhum o papel `tree` fica sem filho válido e quebra a
                // estrutura ARIA: o container vira texto comum.
                <p className="citie-treeselect__vazio">Nenhum item para o filtro aplicado</p>
              ) : (
                <div
                  id={`${uid}-arvore`}
                  ref={arvoreRef}
                  role="tree"
                  aria-label={label}
                  aria-multiselectable={modo === 'checkbox' || undefined}
                  aria-activedescendant={
                    linhaAtiva ? idDoNo(linhaAtiva.no.chave) : undefined
                  }
                  // Região rolável precisa receber foco; é também o dono do teclado.
                  tabIndex={0}
                  className="citie-treeselect__arvore"
                  onKeyDown={aoTeclar}
                >
                  {renderizarRamo(arvore, 1)}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </FieldWrapper>
  );
}
