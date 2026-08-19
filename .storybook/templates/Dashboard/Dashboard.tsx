import type { ReactNode } from 'react';
import { Button } from '../../../src';
import './Dashboard.css';

/**
 * Template de painel de indicadores.
 *
 * Anatomia de `design-system/09-templates/tela-dashboard.md`, na ordem que a
 * spec fixa: filtro global de período, linha de stat cards, grid de gráficos em
 * seções temáticas, drill-down em todo card e gráfico.
 *
 * O template não conhece domínio: recebe cada região por slot. Quem sabe que o
 * indicador é de TFD é a página.
 */

/** De 2 a 4 colunas em tela larga, ponto de variação permitido pela spec. */
export type ColunasDoGrid = 2 | 3 | 4;

export interface SecaoDoDashboard {
  id: string;
  /** Assunto da seção. Vira `h2`: os gráficos dentro dela usam `h3`. */
  titulo: string;
  /** Explica o recorte da seção quando o título não basta. */
  descricao?: string;
  /** Sobrescreve o número de colunas do grid só nesta seção. */
  colunas?: ColunasDoGrid;
  /** Os gráficos da seção, tipicamente envoltos em `CelulaDoDashboard`. */
  graficos: ReactNode;
}

export interface DashboardProps {
  /** Nome da tela. Único `h1` da página. */
  titulo: string;
  /** Uma linha de contexto abaixo do título. */
  descricao?: string;
  /** Ações de tela que não escrevem dado: exportar, imprimir, atualizar. */
  acoes?: ReactNode;
  /** Região 1: filtro global de período, sempre no topo. */
  filtroDePeriodo: ReactNode;
  /** Região 2: linha de stat cards, sempre antes dos gráficos. */
  indicadores: ReactNode;
  /** Nome acessível da região dos indicadores. */
  rotuloDosIndicadores?: string;
  colunasDosIndicadores?: ColunasDoGrid;
  /** Região 3: grid de gráficos em seções temáticas. */
  secoes: SecaoDoDashboard[];
  colunasDosGraficos?: ColunasDoGrid;
  /** Ocupa o lugar do grid quando o período inteiro não tem dado. */
  vazio?: ReactNode;
}

export function Dashboard({
  titulo,
  descricao,
  acoes,
  filtroDePeriodo,
  indicadores,
  rotuloDosIndicadores = 'Indicadores do período',
  colunasDosIndicadores = 4,
  secoes,
  colunasDosGraficos = 2,
  vazio,
}: DashboardProps) {
  return (
    <main className="citie-dashboard">
      <header className="citie-dashboard__cabecalho">
        <div>
          <h1 className="citie-dashboard__titulo">{titulo}</h1>
          {descricao ? <p className="citie-dashboard__descricao">{descricao}</p> : null}
        </div>
        {acoes ? <div className="citie-dashboard__acoes">{acoes}</div> : null}
      </header>

      {/* Região 1. Fica acima de tudo e vale para todos os widgets da tela. */}
      <div className="citie-dashboard__filtro">{filtroDePeriodo}</div>

      {vazio ? (
        <div className="citie-dashboard__vazio">{vazio}</div>
      ) : (
        <>
          {/* Região 2. O valor absoluto vem antes da tendência, por regra da spec. */}
          <section className="citie-dashboard__indicadores" aria-labelledby="dashboard-indicadores">
            <h2 className="citie-visualmente-oculto" id="dashboard-indicadores">
              {rotuloDosIndicadores}
            </h2>
            <div
              className="citie-dashboard__linha"
              data-colunas={colunasDosIndicadores}
            >
              {indicadores}
            </div>
          </section>

          {/* Região 3. Um bloco por assunto do módulo. */}
          {secoes.map((secao) => (
            <section
              key={secao.id}
              className="citie-dashboard__secao"
              aria-labelledby={`dashboard-secao-${secao.id}`}
            >
              <div className="citie-dashboard__secao-cabecalho">
                <h2 className="citie-dashboard__secao-titulo" id={`dashboard-secao-${secao.id}`}>
                  {secao.titulo}
                </h2>
                {secao.descricao ? (
                  <p className="citie-dashboard__secao-descricao">{secao.descricao}</p>
                ) : null}
              </div>

              <div
                className="citie-dashboard__grid"
                data-colunas={secao.colunas ?? colunasDosGraficos}
              >
                {secao.graficos}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}

export interface CelulaDoDashboardProps {
  children: ReactNode;
  /**
   * Região 4 da anatomia: todo gráfico leva à listagem filtrada equivalente.
   * Os stat cards já resolvem isso pelo `onDrillDown` do próprio `KpiWidget`;
   * os gráficos precisam desta moldura porque o componente `Chart` ainda não
   * expõe a ação (gap registrado no relatório do template).
   */
  drillDown?: { rotulo: string; onClick?: () => void };
  /** Ocupa duas colunas do grid quando o gráfico precisa de largura. */
  largo?: boolean;
}

/** Envelope de um item do grid: conteúdo mais a ação de drill-down. */
export function CelulaDoDashboard({ children, drillDown, largo = false }: CelulaDoDashboardProps) {
  return (
    <div className={`citie-dashboard__celula${largo ? ' citie-dashboard__celula--larga' : ''}`}>
      {children}
      {drillDown ? (
        <div className="citie-dashboard__drill">
          <Button variant="text" size="small" onClick={drillDown.onClick}>
            {drillDown.rotulo}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
