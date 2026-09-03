import type { ReactNode } from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import './Filters.css';

export interface BotaoDeFiltroProps {
  /** Nome da dimensão: "Situação", "Prioridade". */
  rotulo: string;
  /** Quantos valores da dimensão estão aplicados. Zero esconde o contador. */
  contador?: number;
  aberto?: boolean;
  onClick?: () => void;
}

/**
 * Botão de dimensão da barra do kit ("Status", "Priority"): outline de 32 com
 * chevron de 16 e, com filtro aplicado, o contador em badge secondary. Abre o
 * painel de valores da dimensão; o painel em si é do consumidor (Select,
 * MultiSelect ou popover).
 */
export function BotaoDeFiltro({ rotulo, contador = 0, aberto = false, onClick }: BotaoDeFiltroProps) {
  return (
    <Button variant="outline" size="small" aria-expanded={aberto} onClick={onClick}>
      {rotulo}
      {contador > 0 ? <Badge value={contador} severity="secondary" size="sm" /> : null}
      <svg
        className="citie-filtros__dimensao-chevron"
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
        <path d="m4 6 4 4 4-4" />
      </svg>
    </Button>
  );
}

export type DimensaoDoFiltro = 'select' | 'data' | 'busca';

export interface FiltroAtivo {
  id: string;
  /** Nomeia a dimensão: "Secretaria", "Situação". Chip de busca leva o prefixo. */
  rotulo: string;
  valor: string;
  dimensao: DimensaoDoFiltro;
}

/** Chips agrupados por tipo, independentemente da ordem de aplicação. */
const ORDEM_DAS_DIMENSOES: DimensaoDoFiltro[] = ['select', 'data', 'busca'];

export function ordenarFiltros(filtros: FiltroAtivo[]): FiltroAtivo[] {
  return [...filtros].sort(
    (a, b) => ORDEM_DAS_DIMENSOES.indexOf(a.dimensao) - ORDEM_DAS_DIMENSOES.indexOf(b.dimensao),
  );
}

export interface FilterBarProps {
  /** Controles da linha superior: busca, selects, datas. */
  controles: ReactNode;
  filtros: FiltroAtivo[];
  /** Contagem sempre visível, no plural correto. */
  resultado?: { total: number; substantivo: [string, string] };
  densidade?: 'confortavel' | 'compacta';
  onRemover?: (id: string) => void;
  onLimparTudo?: () => void;
}

export function FilterBar({
  controles,
  filtros,
  resultado,
  densidade = 'confortavel',
  onRemover,
  onLimparTudo,
}: FilterBarProps) {
  const ordenados = ordenarFiltros(filtros);

  const contagem = resultado
    ? `${resultado.total} ${resultado.total === 1 ? resultado.substantivo[0] : resultado.substantivo[1]} ${
        resultado.total === 1 ? 'encontrado' : 'encontrados'
      }`
    : null;

  return (
    <div
      className={`citie-filtros citie-filtros--${densidade}`}
      role="group"
      aria-label="Filtros da listagem"
    >
      <div className="citie-filtros__controles">{controles}</div>

      {/* Sem filtro ativo a linha de chips some, sem reservar espaço. */}
      {ordenados.length > 0 ? (
        <div className="citie-filtros__chips">
          {ordenados.map((filtro) => (
            <span key={filtro.id} className="citie-filtro-chip">
              <span className="citie-filtro-chip__rotulo">{filtro.rotulo}:</span>
              <span className="citie-filtro-chip__valor">{filtro.valor}</span>
              <button
                type="button"
                className="citie-filtro-chip__remover"
                aria-label={`Remover filtro ${filtro.rotulo}: ${filtro.valor}`}
                onClick={() => onRemover?.(filtro.id)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}

          <button type="button" className="citie-filtros__limpar" onClick={onLimparTudo}>
            Limpar tudo
          </button>
        </div>
      ) : null}

      {contagem ? (
        <p className="citie-filtros__contagem" aria-live="polite">
          {contagem}
        </p>
      ) : null}
    </div>
  );
}
