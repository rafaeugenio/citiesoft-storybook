/**
 * Painel de TFD (Tratamento Fora do Domicílio).
 *
 * Nenhum número desta tela é digitado. Todo indicador, toda fatia e toda faixa
 * é uma soma sobre `MOVIMENTO_DIARIO`, o registro diário de `dominio-tfd.ts`.
 * Daí decorre, por construção e não por conferência:
 *
 * - o indicador de processos recebidos é igual à soma das fatias da rosca;
 * - o indicador de viagens autorizadas é igual à soma das barras por município
 *   e igual à soma das faixas por especialidade;
 * - o indicador de ajuda de custo empenhada é igual à soma das faixas de
 *   empenho por situação do lançamento;
 * - o indicador de processos aguardando regulação é a própria fatia
 *   "Em Análise" da rosca.
 *
 * As três igualdades valem nos três períodos, porque as quatro leituras
 * percorrem os mesmos registros.
 */

import type { Serie } from '../../src';
import {
  PERIODOS as DEFINICOES_DE_PERIODO,
  PROCESSOS_COM_PRAZO,
  agregarPainel,
  definicaoDoPeriodo,
  formatarInteiro,
  formatarMoedaCheia,
  type PeriodoId,
  type SituacaoDoProcesso,
} from './dominio-tfd';

export type { PeriodoId };

export interface IndicadorDoPainel {
  id: string;
  rotulo: string;
  valor: string;
  variacao?: { percentual: number; comparadoA: string };
  /** Alimenta o sparkline do stat card. */
  tendencia: number[];
  /** Rótulo da listagem para onde o drill-down leva. */
  destino: string;
}

export interface ItemDePrazo {
  id: string;
  principal: string;
  secundario: string;
  estado: SituacaoDoProcesso;
}

export interface DadosDoPainel {
  /** Intervalo por extenso, anunciado quando o filtro muda. */
  intervalo: string;
  comparadoA: string;
  indicadores: IndicadorDoPainel[];
  fluxo: { categorias: string[]; series: Serie[] };
  situacao: { rotulo: string; valor: number }[];
  destinos: { categorias: string[]; series: Serie[] };
  especialidades: { rotulo: string; valor: number }[];
  empenho: { rotulo: string; valor: number }[];
  prazos: ItemDePrazo[];
}

/** Opções do filtro global de período. */
export const PERIODOS = DEFINICOES_DE_PERIODO.map((periodo) => ({
  value: periodo.id,
  label: periodo.label,
}));

/** Fila de atenção lida do registro de processos, nunca inventada aqui. */
const PRAZOS: ItemDePrazo[] = PROCESSOS_COM_PRAZO.map((processo) => ({
  id: processo.protocolo,
  principal: `Processo ${processo.protocolo} · ${processo.paciente}`,
  secundario: processo.prazo ?? '',
  estado: processo.situacao,
}));

export function dadosDoPainel(id: PeriodoId): DadosDoPainel {
  const agregado = agregarPainel(id);
  const comparadoA = agregado.comparadoA;

  return {
    intervalo: agregado.intervalo,
    comparadoA,
    indicadores: [
      {
        id: 'recebidos',
        rotulo: 'Processos recebidos',
        valor: formatarInteiro(agregado.recebidos),
        variacao: { percentual: agregado.variacao.recebidos, comparadoA },
        tendencia: agregado.tendencia.recebidos,
        destino: 'processos recebidos',
      },
      {
        id: 'analise',
        rotulo: 'Aguardando regulação',
        valor: formatarInteiro(agregado.emAnalise),
        variacao: { percentual: agregado.variacao.emAnalise, comparadoA },
        tendencia: agregado.tendencia.emAnalise,
        destino: 'processos em análise',
      },
      {
        id: 'viagens',
        rotulo: 'Viagens autorizadas',
        valor: formatarInteiro(agregado.autorizados),
        variacao: { percentual: agregado.variacao.autorizados, comparadoA },
        tendencia: agregado.tendencia.autorizados,
        destino: 'viagens autorizadas',
      },
      {
        id: 'ajuda',
        rotulo: 'Ajuda de custo empenhada',
        valor: formatarMoedaCheia(agregado.empenhado),
        variacao: { percentual: agregado.variacao.empenhado, comparadoA },
        tendencia: agregado.tendencia.empenhado,
        destino: 'lançamentos de ajuda de custo',
      },
    ],
    fluxo: agregado.fluxo,
    situacao: agregado.porSituacao,
    destinos: agregado.porDestino,
    especialidades: agregado.porEspecialidade,
    empenho: agregado.empenhoPorSituacao,
    prazos: PRAZOS,
  };
}

/** Período sem nenhum processo registrado, para o estado vazio da tela. */
export const PERIODO_SEM_DADO: DadosDoPainel = {
  intervalo: '1 a 7 de janeiro de 2026',
  comparadoA: 'semana anterior',
  indicadores: dadosDoPainel('semana').indicadores.map((indicador) => ({
    ...indicador,
    valor: 'Sem registro',
    variacao: undefined,
    tendencia: [],
  })),
  fluxo: { categorias: [], series: [] },
  situacao: [],
  destinos: { categorias: [], series: [] },
  especialidades: [],
  empenho: [],
  prazos: [],
};

/** Intervalo por extenso de cada período, para o chip do filtro global. */
export function intervaloDoPeriodo(id: PeriodoId): string {
  return definicaoDoPeriodo(id).intervalo;
}
