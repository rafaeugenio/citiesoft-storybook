import { useState, type ReactNode } from 'react';
import './Navigation.css';

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                          */
/* ------------------------------------------------------------------ */

export interface NivelDaTrilha {
  rotulo: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** O nome de cada nível é o mesmo do título da página correspondente. */
  niveis: NivelDaTrilha[];
  compacto?: boolean;
}

export function Breadcrumb({ niveis, compacto = false }: BreadcrumbProps) {
  // Acima de 4 níveis os do meio colapsam, preservando raiz e atual.
  const colapsar = niveis.length > 4;
  const visiveis = colapsar
    ? [niveis[0], { rotulo: '…' }, niveis[niveis.length - 2], niveis[niveis.length - 1]]
    : niveis;

  return (
    <nav
      className={`citie-breadcrumb${compacto ? ' citie-breadcrumb--compacto' : ''}`}
      aria-label="Trilha de navegação"
    >
      <ol className="citie-breadcrumb__lista">
        {visiveis.map((nivel, indice) => {
          const atual = indice === visiveis.length - 1;
          return (
            <li key={`${nivel.rotulo}-${indice}`} className="citie-breadcrumb__item">
              {indice > 0 ? (
                <span className="citie-breadcrumb__separador" aria-hidden="true">
                  /
                </span>
              ) : null}
              {atual ? (
                // O item atual é página corrente, nunca link.
                <span className="citie-breadcrumb__atual" aria-current="page">
                  {nivel.rotulo}
                </span>
              ) : nivel.href ? (
                <a className="citie-breadcrumb__link" href={nivel.href}>
                  {nivel.rotulo}
                </a>
              ) : (
                <span className="citie-breadcrumb__oculto">{nivel.rotulo}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

export type EstadoDaEtapa = 'pendente' | 'atual' | 'concluida' | 'erro';

export interface EtapaProps {
  id: string;
  rotulo: string;
  /** Resumo da etapa, oculto no modo compacto. */
  sublabel?: string;
  estado: EstadoDaEtapa;
}

export interface StepperProps {
  label: string;
  etapas: EtapaProps[];
  orientacao?: 'horizontal' | 'vertical';
  compacto?: boolean;
  /** Linear só deixa avançar com a etapa atual válida. */
  linear?: boolean;
  onSelecionar?: (id: string) => void;
}

const ROTULO_DO_ESTADO: Record<EstadoDaEtapa, string> = {
  pendente: 'pendente',
  atual: 'etapa atual',
  concluida: 'concluída',
  erro: 'com erro',
};

export function Stepper({
  label,
  etapas,
  orientacao = 'horizontal',
  compacto = false,
  linear = true,
  onSelecionar,
}: StepperProps) {
  return (
    <ol
      className={`citie-stepper citie-stepper--${orientacao}${
        compacto ? ' citie-stepper--compacto' : ''
      }`}
      aria-label={label}
    >
      {etapas.map((etapa, indice) => (
        <li key={etapa.id} className={`citie-stepper__etapa citie-stepper__etapa--${etapa.estado}`}>
          <button
            type="button"
            className="citie-stepper__gatilho"
            aria-current={etapa.estado === 'atual' ? 'step' : undefined}
            // No modo linear, etapa futura não é alcançável.
            disabled={linear && etapa.estado === 'pendente'}
            onClick={() => onSelecionar?.(etapa.id)}
          >
            <span className="citie-stepper__indicador" aria-hidden="true">
              {etapa.estado === 'concluida' ? '✓' : etapa.estado === 'erro' ? '!' : indice + 1}
            </span>
            <span className="citie-stepper__textos">
              <span className="citie-stepper__rotulo">{etapa.rotulo}</span>
              {etapa.sublabel && !compacto ? (
                <span className="citie-stepper__sublabel">{etapa.sublabel}</span>
              ) : null}
              <span className="citie-visualmente-oculto">({ROTULO_DO_ESTADO[etapa.estado]})</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

export interface ItemDoMenu {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  contagem?: number;
  filhos?: { id: string; rotulo: string }[];
}

export interface SecaoDoMenu {
  rotulo: string;
  itens: ItemDoMenu[];
}

export interface SidebarProps {
  secoes: SecaoDoMenu[];
  ativo: string;
  colapsada?: boolean;
}

/**
 * Menu principal (navigation-sidebar-header.md).
 * Item sem permissão nunca é renderizado, para não expor a existência de
 * funcionalidade não autorizada. Colapso é sempre ação explícita.
 */
export function Sidebar({ secoes, ativo, colapsada = false }: SidebarProps) {
  const [expandidos, setExpandidos] = useState<string[]>([]);

  return (
    <nav
      className={`citie-sidebar${colapsada ? ' citie-sidebar--colapsada' : ''}`}
      aria-label="Menu principal"
    >
      <a className="citie-sidebar__skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      {secoes.map((secao) => (
        <div key={secao.rotulo} className="citie-sidebar__secao">
          {!colapsada ? <p className="citie-sidebar__categoria">{secao.rotulo}</p> : null}
          <ul className="citie-sidebar__lista">
            {secao.itens.map((item) => {
              const selecionado = item.id === ativo;
              const aberto = expandidos.includes(item.id);

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`citie-sidebar__item${
                      selecionado ? ' citie-sidebar__item--ativo' : ''
                    }`}
                    aria-current={selecionado ? 'page' : undefined}
                    aria-expanded={item.filhos ? aberto : undefined}
                    // Em modo colapsado o ícone sozinho é ambíguo, então o rótulo
                    // sobrevive como nome acessível.
                    aria-label={colapsada ? item.rotulo : undefined}
                    title={colapsada ? item.rotulo : undefined}
                    onClick={() =>
                      item.filhos
                        ? setExpandidos((atual) =>
                            atual.includes(item.id)
                              ? atual.filter((id) => id !== item.id)
                              : [...atual, item.id],
                          )
                        : undefined
                    }
                  >
                    {item.icone ? (
                      <span className="citie-sidebar__icone" aria-hidden="true">
                        {item.icone}
                      </span>
                    ) : null}
                    {!colapsada ? <span className="citie-sidebar__rotulo">{item.rotulo}</span> : null}
                    {!colapsada && item.contagem ? (
                      <span className="citie-sidebar__contagem">{item.contagem}</span>
                    ) : null}
                    {!colapsada && item.filhos ? (
                      <span
                        className={`citie-sidebar__seta${aberto ? ' citie-sidebar__seta--aberta' : ''}`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    ) : null}
                  </button>

                  {item.filhos && aberto && !colapsada ? (
                    <ul className="citie-sidebar__sublista">
                      {item.filhos.map((filho) => (
                        <li key={filho.id}>
                          <button type="button" className="citie-sidebar__subitem">
                            {filho.rotulo}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
