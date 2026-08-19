import type { EstadoDeFluxo, Serie } from '../../src';

/**
 * Dados fictícios do Painel de TFD (Tratamento Fora do Domicílio).
 *
 * Determinísticos de propósito: nenhum `Math.random()` e nenhuma data corrente,
 * para o snapshot visual não oscilar entre execuções. Nenhum dado pessoal real.
 */

export type PeriodoId = 'semana' | 'mes' | 'trimestre';

export const PERIODOS = [
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'trimestre', label: 'Trimestre' },
];

export interface IndicadorDoPainel {
  id: string;
  rotulo: string;
  valor: string;
  variacao: { percentual: number; comparadoA: string };
  /** Alimenta o sparkline do stat card. */
  tendencia: number[];
  /** Rótulo da listagem para onde o drill-down leva. */
  destino: string;
}

export interface ItemDePrazo {
  id: string;
  principal: string;
  secundario: string;
  estado: EstadoDeFluxo;
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
  prazos: ItemDePrazo[];
}

const PRAZOS_CURTOS: ItemDePrazo[] = [
  {
    id: '2025/0481',
    principal: 'Processo 2025/0481 · Maria de Fátima Souza',
    secundario: 'Parecer da regulação vence em 1 dia',
    estado: 'Em Análise',
  },
  {
    id: '2025/0492',
    principal: 'Processo 2025/0492 · João Batista Ferreira',
    secundario: 'Documentação devolvida há 3 dias',
    estado: 'Devolvido',
  },
  {
    id: '2025/0503',
    principal: 'Processo 2025/0503 · Antônia Ribeiro Lima',
    secundario: 'Passagem a emitir até quinta-feira',
    estado: 'Pendente',
  },
  {
    id: '2025/0517',
    principal: 'Processo 2025/0517 · Sebastião Nunes Aguiar',
    secundario: 'Laudo aguarda assinatura do Dr. Carlos Andrade',
    estado: 'Aguardando Assinatura',
  },
];

export const DADOS_POR_PERIODO: Record<PeriodoId, DadosDoPainel> = {
  semana: {
    intervalo: '13 a 19 de julho de 2026',
    comparadoA: 'semana anterior',
    indicadores: [
      {
        id: 'recebidas',
        rotulo: 'Solicitações recebidas',
        valor: '128',
        variacao: { percentual: 9.4, comparadoA: 'semana anterior' },
        tendencia: [14, 19, 22, 18, 25, 17, 13],
        destino: 'solicitações recebidas',
      },
      {
        id: 'analise',
        rotulo: 'Aguardando regulação',
        valor: '34',
        variacao: { percentual: -6.2, comparadoA: 'semana anterior' },
        tendencia: [41, 39, 38, 36, 35, 34, 34],
        destino: 'solicitações em análise',
      },
      {
        id: 'viagens',
        rotulo: 'Viagens autorizadas',
        valor: '96',
        variacao: { percentual: 12.8, comparadoA: 'semana anterior' },
        tendencia: [9, 12, 15, 14, 18, 16, 12],
        destino: 'viagens autorizadas',
      },
      {
        id: 'ajuda',
        rotulo: 'Ajuda de custo empenhada',
        valor: 'R$ 84.320',
        variacao: { percentual: 4.1, comparadoA: 'semana anterior' },
        tendencia: [9800, 11200, 13400, 12100, 15600, 12900, 9320],
        destino: 'lançamentos de ajuda de custo',
      },
    ],
    fluxo: {
      categorias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      series: [
        { rotulo: 'Recebidas', valores: [14, 19, 22, 18, 25, 17, 13] },
        { rotulo: 'Autorizadas', valores: [9, 12, 15, 14, 18, 16, 12] },
      ],
    },
    situacao: [
      { rotulo: 'Autorizada', valor: 96 },
      { rotulo: 'Em análise', valor: 34 },
      { rotulo: 'Devolvida', valor: 11 },
      { rotulo: 'Cancelada', valor: 5 },
    ],
    destinos: {
      categorias: ['São Luís', 'Imperatriz', 'Teresina', 'Fortaleza', 'São Paulo'],
      series: [{ rotulo: 'Viagens autorizadas', valores: [38, 21, 14, 12, 11] }],
    },
    especialidades: [
      { rotulo: 'Cardiologia', valor: 29 },
      { rotulo: 'Oncologia', valor: 24 },
      { rotulo: 'Oftalmologia', valor: 18 },
      { rotulo: 'Ortopedia', valor: 15 },
      { rotulo: 'Neurologia', valor: 10 },
    ],
    prazos: PRAZOS_CURTOS,
  },

  mes: {
    intervalo: 'Julho de 2026',
    comparadoA: 'junho de 2026',
    indicadores: [
      {
        id: 'recebidas',
        rotulo: 'Solicitações recebidas',
        valor: '512',
        variacao: { percentual: 7.6, comparadoA: 'junho de 2026' },
        tendencia: [118, 126, 140, 128],
        destino: 'solicitações recebidas',
      },
      {
        id: 'analise',
        rotulo: 'Aguardando regulação',
        valor: '87',
        variacao: { percentual: -11.3, comparadoA: 'junho de 2026' },
        tendencia: [112, 104, 95, 87],
        destino: 'solicitações em análise',
      },
      {
        id: 'viagens',
        rotulo: 'Viagens autorizadas',
        valor: '401',
        variacao: { percentual: 10.2, comparadoA: 'junho de 2026' },
        tendencia: [88, 96, 121, 96],
        destino: 'viagens autorizadas',
      },
      {
        id: 'ajuda',
        rotulo: 'Ajuda de custo empenhada',
        valor: 'R$ 336.480',
        variacao: { percentual: 5.8, comparadoA: 'junho de 2026' },
        tendencia: [76400, 82100, 93660, 84320],
        destino: 'lançamentos de ajuda de custo',
      },
    ],
    fluxo: {
      categorias: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      series: [
        { rotulo: 'Recebidas', valores: [118, 126, 140, 128] },
        { rotulo: 'Autorizadas', valores: [88, 96, 121, 96] },
      ],
    },
    situacao: [
      { rotulo: 'Autorizada', valor: 401 },
      { rotulo: 'Em análise', valor: 87 },
      { rotulo: 'Devolvida', valor: 42 },
      { rotulo: 'Cancelada', valor: 18 },
    ],
    destinos: {
      categorias: ['São Luís', 'Imperatriz', 'Teresina', 'Fortaleza', 'São Paulo'],
      series: [{ rotulo: 'Viagens autorizadas', valores: [156, 88, 61, 52, 44] }],
    },
    especialidades: [
      { rotulo: 'Cardiologia', valor: 121 },
      { rotulo: 'Oncologia', valor: 98 },
      { rotulo: 'Oftalmologia', valor: 74 },
      { rotulo: 'Ortopedia', valor: 63 },
      { rotulo: 'Neurologia', valor: 45 },
    ],
    prazos: PRAZOS_CURTOS,
  },

  trimestre: {
    intervalo: 'Maio a julho de 2026',
    comparadoA: 'trimestre anterior',
    indicadores: [
      {
        id: 'recebidas',
        rotulo: 'Solicitações recebidas',
        valor: '1.486',
        variacao: { percentual: 14.7, comparadoA: 'trimestre anterior' },
        tendencia: [462, 512, 512],
        destino: 'solicitações recebidas',
      },
      {
        id: 'analise',
        rotulo: 'Aguardando regulação',
        valor: '142',
        variacao: { percentual: -18.9, comparadoA: 'trimestre anterior' },
        tendencia: [201, 168, 142],
        destino: 'solicitações em análise',
      },
      {
        id: 'viagens',
        rotulo: 'Viagens autorizadas',
        valor: '1.184',
        variacao: { percentual: 16.4, comparadoA: 'trimestre anterior' },
        tendencia: [366, 417, 401],
        destino: 'viagens autorizadas',
      },
      {
        id: 'ajuda',
        rotulo: 'Ajuda de custo empenhada',
        valor: 'R$ 962.150',
        variacao: { percentual: 9.3, comparadoA: 'trimestre anterior' },
        tendencia: [298400, 327270, 336480],
        destino: 'lançamentos de ajuda de custo',
      },
    ],
    fluxo: {
      categorias: ['Maio', 'Junho', 'Julho'],
      series: [
        { rotulo: 'Recebidas', valores: [462, 512, 512] },
        { rotulo: 'Autorizadas', valores: [366, 417, 401] },
      ],
    },
    situacao: [
      { rotulo: 'Autorizada', valor: 1184 },
      { rotulo: 'Em análise', valor: 142 },
      { rotulo: 'Devolvida', valor: 114 },
      { rotulo: 'Cancelada', valor: 46 },
    ],
    destinos: {
      categorias: ['São Luís', 'Imperatriz', 'Teresina', 'Fortaleza', 'São Paulo'],
      series: [{ rotulo: 'Viagens autorizadas', valores: [452, 261, 189, 148, 134] }],
    },
    especialidades: [
      { rotulo: 'Cardiologia', valor: 356 },
      { rotulo: 'Oncologia', valor: 289 },
      { rotulo: 'Oftalmologia', valor: 218 },
      { rotulo: 'Ortopedia', valor: 186 },
      { rotulo: 'Neurologia', valor: 135 },
    ],
    prazos: PRAZOS_CURTOS,
  },
};

/** Período sem nenhuma solicitação registrada, para o estado vazio da tela. */
export const PERIODO_SEM_DADO: DadosDoPainel = {
  intervalo: '1 a 7 de janeiro de 2026',
  comparadoA: 'semana anterior',
  indicadores: DADOS_POR_PERIODO.semana.indicadores.map((indicador) => ({
    ...indicador,
    valor: '—',
    tendencia: [],
  })),
  fluxo: { categorias: [], series: [] },
  situacao: [],
  destinos: { categorias: [], series: [] },
  especialidades: [],
  prazos: [],
};
