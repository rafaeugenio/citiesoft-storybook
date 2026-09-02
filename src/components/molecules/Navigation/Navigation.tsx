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

function IconeCasaDaTrilha() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SeparadorDaTrilha() {
  return (
    <svg
      className="citie-breadcrumb__separador"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
          // Primeiro nível ganha o ícone de casa, como no shell do Sismental.
          const raiz = indice === 0;
          return (
            <li key={`${nivel.rotulo}-${indice}`} className="citie-breadcrumb__item">
              {indice > 0 ? <SeparadorDaTrilha /> : null}
              {atual ? (
                // O item atual é página corrente, nunca link.
                <span className="citie-breadcrumb__atual" aria-current="page">
                  {nivel.rotulo}
                </span>
              ) : nivel.href ? (
                <a className="citie-breadcrumb__link" href={nivel.href}>
                  {raiz ? (
                    <span className="citie-breadcrumb__icone-casa" aria-hidden="true">
                      <IconeCasaDaTrilha />
                    </span>
                  ) : null}
                  {nivel.rotulo}
                </a>
              ) : (
                <span className="citie-breadcrumb__oculto">
                  {raiz ? (
                    <span className="citie-breadcrumb__icone-casa" aria-hidden="true">
                      <IconeCasaDaTrilha />
                    </span>
                  ) : null}
                  {nivel.rotulo}
                </span>
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
