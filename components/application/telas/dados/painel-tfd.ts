import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiFileList3Line,
  RiTimeLine,
} from "@remixicon/react";
import type { Stat } from "@/components/application/dashboard/stat-cards";
import {
  SOLICITACOES_LISTAGEM,
  STATUS_SOLICITACAO,
  type SolicitacaoListagem,
  type StatusSolicitacao,
} from "../../../../.storybook/fixtures/listagem-solicitacoes";

/**
 * Dados do painel TFD. Todo número é uma soma sobre a matriz mensal
 * `CONTAGENS` (mês × especialidade × situação), então os indicadores, a rosca,
 * as barras por mês e a lista por especialidade fecham entre si em qualquer
 * período. Fictício e determinístico.
 */

export type PeriodoId = "trimestre" | "semestre" | "ano";

export const PERIODOS: { id: PeriodoId; label: string; meses: number; comparadoA: string }[] = [
  { id: "trimestre", label: "Trimestre", meses: 3, comparadoA: "trimestre anterior" },
  { id: "semestre", label: "Semestre", meses: 6, comparadoA: "semestre anterior" },
  { id: "ano", label: "Ano", meses: 10, comparadoA: "mesmo período de 2025" },
];

const NOMES_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const NOMES_MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export const ESPECIALIDADES = ["Cardiologia", "Oncologia", "Oftalmologia", "Ortopedia", "Neurologia"] as const;
export const SITUACOES: StatusSolicitacao[] = STATUS_SOLICITACAO;

const PESO_ESPECIALIDADE = [30, 26, 19, 14, 11];
const PESO_SITUACAO = [0.2, 0.14, 0.17, 0.19, 0.24, 0.06];

/** De jan/2025 a out/2026: 22 meses. O índice 12 é jan/2026. */
const MESES_TOTAIS = 22;

function contagem(mes: number, especialidade: number, situacao: number): number {
  const sazonal = 1 + (mes % 12) * 0.035 + (mes >= 12 ? 0.12 : 0);
  const ruido = 0.85 + (((mes * 7 + especialidade * 3 + situacao * 5) % 6) / 6) * 0.3;
  return Math.max(1, Math.round((PESO_ESPECIALIDADE[especialidade] / 6) * PESO_SITUACAO[situacao] * 10 * sazonal * ruido));
}

interface Janela {
  inicio: number;
  fim: number;
}

function somar(janela: Janela, filtro?: { especialidade?: number; situacoes?: number[] }): number {
  let total = 0;
  for (let m = janela.inicio; m <= janela.fim; m += 1) {
    for (let e = 0; e < ESPECIALIDADES.length; e += 1) {
      if (filtro?.especialidade !== undefined && filtro.especialidade !== e) continue;
      for (let s = 0; s < SITUACOES.length; s += 1) {
        if (filtro?.situacoes && !filtro.situacoes.includes(s)) continue;
        total += contagem(m, e, s);
      }
    }
  }
  return total;
}

const IDX = Object.fromEntries(SITUACOES.map((s, i) => [s, i])) as Record<StatusSolicitacao, number>;
const APROVADAS = [IDX.Aprovada, IDX.Agendada, IDX["Concluída"]];

function janelaAtual(id: PeriodoId): Janela {
  const { meses } = PERIODOS.find((p) => p.id === id)!;
  return { inicio: MESES_TOTAIS - meses, fim: MESES_TOTAIS - 1 };
}

function janelaAnterior(id: PeriodoId): Janela {
  const { meses } = PERIODOS.find((p) => p.id === id)!;
  if (id === "ano") return { inicio: 0, fim: meses - 1 };
  return { inicio: MESES_TOTAIS - 2 * meses, fim: MESES_TOTAIS - meses - 1 };
}

const pt = (n: number) => n.toLocaleString("pt-BR");
const variacao = (atual: number, anterior: number) => (anterior === 0 ? 0 : (atual - anterior) / anterior);

function rotuloDelta(v: number): string {
  const pct = Math.round(Math.abs(v) * 1000) / 10;
  if (pct === 0) return "0,0%";
  return `${v > 0 ? "+" : "-"}${pct.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`;
}

export interface DadosDoPainelTfd {
  intervalo: string;
  comparadoA: string;
  indicadores: Stat[];
  porSituacao: { label: string; value: number }[];
  porMes: { label: string; solicitacoes: number; aprovacao: number }[];
  totalPeriodo: number;
  variacaoPeriodo: number;
  porEspecialidade: { label: string; value: number }[];
  recentes: SolicitacaoListagem[];
}

export function dadosDoPainelTfd(id: PeriodoId): DadosDoPainelTfd {
  const periodo = PERIODOS.find((p) => p.id === id)!;
  const atual = janelaAtual(id);
  const anterior = janelaAnterior(id);

  const total = somar(atual);
  const totalAnt = somar(anterior);
  const emAnalise = somar(atual, { situacoes: [IDX["Em análise"]] });
  const emAnaliseAnt = somar(anterior, { situacoes: [IDX["Em análise"]] });
  const aprovadas = somar(atual, { situacoes: APROVADAS });
  const aprovadasAnt = somar(anterior, { situacoes: APROVADAS });
  const negadas = somar(atual, { situacoes: [IDX.Negada] });
  const negadasAnt = somar(anterior, { situacoes: [IDX.Negada] });

  const delta = (a: number, b: number, ruimSeSobe = false): Pick<Stat, "delta" | "deltaColor"> => {
    const v = variacao(a, b);
    const cor = Math.round(Math.abs(v) * 1000) === 0 ? "neutral" : (v > 0) !== ruimSeSobe ? "lime" : "rose";
    return { delta: rotuloDelta(v), deltaColor: cor };
  };

  const indicadores: Stat[] = [
    { icon: RiFileList3Line, label: "Solicitações recebidas", value: pt(total), ...delta(total, totalAnt) },
    { icon: RiTimeLine, label: "Aguardando análise", value: pt(emAnalise), ...delta(emAnalise, emAnaliseAnt, true) },
    { icon: RiCheckboxCircleLine, label: "Aprovadas e agendadas", value: pt(aprovadas), ...delta(aprovadas, aprovadasAnt) },
    { icon: RiCloseCircleLine, label: "Negadas", value: pt(negadas), ...delta(negadas, negadasAnt, true) },
  ];

  const porSituacao = SITUACOES.map((situacao, s) => ({
    label: situacao,
    value: somar(atual, { situacoes: [s] }),
  }));

  const porMes = Array.from({ length: periodo.meses }, (_, i) => {
    const m = atual.inicio + i;
    const janela = { inicio: m, fim: m };
    const totalMes = somar(janela);
    const aprovMes = somar(janela, { situacoes: APROVADAS });
    return {
      label: NOMES_MESES[m % 12],
      solicitacoes: totalMes,
      aprovacao: Math.round((aprovMes / totalMes) * 1000) / 10,
    };
  });

  const porEspecialidade = ESPECIALIDADES.map((nome, e) => ({
    label: nome,
    value: somar(atual, { especialidade: e }),
  })).sort((a, b) => b.value - a.value);

  const mesInicial = atual.inicio % 12;
  const mesFinal = atual.fim % 12;
  const intervalo = `${NOMES_MESES_LONGOS[mesInicial]} a ${NOMES_MESES_LONGOS[mesFinal]} de 2026`;

  return {
    intervalo,
    comparadoA: periodo.comparadoA,
    indicadores,
    porSituacao,
    porMes,
    totalPeriodo: total,
    variacaoPeriodo: variacao(total, totalAnt),
    porEspecialidade,
    recentes: [...SOLICITACOES_LISTAGEM]
      .sort((a, b) => b.dataConsulta.localeCompare(a.dataConsulta))
      .slice(0, 6),
  };
}

/** Rótulo curto do intervalo para o botão de período do gráfico. */
export function rotuloIntervaloCurto(id: PeriodoId): string {
  const atual = janelaAtual(id);
  return `${NOMES_MESES[atual.inicio % 12]} a ${NOMES_MESES[atual.fim % 12]} 2026`;
}

export { pt as formatarNumeroPt };
