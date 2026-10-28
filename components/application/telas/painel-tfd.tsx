"use client";

import { useMemo, useState } from "react";
import { RiArrowRightLine, RiEyeLine } from "@remixicon/react";
import { AppFrame } from "@/components/application/app-frame/app-frame";
import { ComboChartCard } from "@/components/application/charts/combo-chart-card";
import { BarListCard } from "@/components/application/charts/bar-list-card";
import { RadialChartCard } from "@/components/application/charts/radial-chart-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { DataListing } from "@/components/application/data-listing/data-listing";
import type { DataListingColumn } from "@/components/application/data-listing/data-listing";
import { EmptyState } from "@/components/application/estados/empty-state";
import { SkeletonBar } from "@/components/application/estados/table-skeleton";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Chip } from "@/components/base/badges/chip";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";
import { formatarDataBR } from "../../../.storybook/fixtures/listagem-solicitacoes";
import type { SolicitacaoListagem, StatusSolicitacao } from "../../../.storybook/fixtures/listagem-solicitacoes";
import { GRUPOS_NAVEGACAO_TFD, MENU_USUARIO_TFD, USUARIO_TFD } from "./dados/navegacao-sistema";
import {
  PERIODOS,
  dadosDoPainelTfd,
  formatarNumeroPt,
  rotuloIntervaloCurto,
  type PeriodoId,
} from "./dados/painel-tfd";

export type PainelTfdEstado = "pronto" | "carregando" | "sem-dados";

export interface PainelTfdTelaProps {
  /** Altura fixa de janela (previews). */
  contained?: boolean;
  periodoInicial?: PeriodoId;
  /** Força um estado para documentar carregamento e ausência de dados. */
  estado?: PainelTfdEstado;
}

const COR_STATUS: Record<StatusSolicitacao, "cyan" | "yellow" | "lime" | "blue" | "gray" | "rose"> = {
  "Em análise": "cyan",
  "Aguardando documentos": "yellow",
  Aprovada: "lime",
  Agendada: "blue",
  Concluída: "gray",
  Negada: "rose",
};

const COLUNAS: DataListingColumn<SolicitacaoListagem>[] = [
  { id: "protocolo", header: "Protocolo", isIdentifier: true, cell: (r) => r.protocolo, width: "w-[200px] whitespace-nowrap" },
  {
    id: "paciente",
    header: "Paciente",
    cell: (r) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-medium text-text-primary">{r.paciente}</span>
        <span className="text-caption-1-regular text-text-secondary">CPF {r.cpf}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: "Situação",
    cell: (r) => (
      <Chip variant="caption" color={COR_STATUS[r.status]}>
        {r.status}
      </Chip>
    ),
    width: "w-[240px]",
  },
  { id: "dataConsulta", header: "Consulta", cell: (r) => formatarDataBR(r.dataConsulta), width: "w-[110px]" },
];

/** Alternativa tabular de um gráfico, lida por leitores de tela. */
function TabelaAlternativa({
  legenda,
  colunas,
  linhas,
}: {
  legenda: string;
  colunas: string[];
  linhas: (string | number)[][];
}) {
  return (
    <table className="sr-only">
      <caption>{legenda}</caption>
      <thead>
        <tr>
          {colunas.map((coluna) => (
            <th key={coluna} scope="col">
              {coluna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((linha) => (
          <tr key={String(linha[0])}>
            {linha.map((celula, i) => (i === 0 ? <th key={i} scope="row">{celula}</th> : <td key={i}>{celula}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LinkDrill({ children, href }: { children: string; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex w-fit items-center gap-1 rounded-sm text-body-2-medium text-text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      {children}
      <RiArrowRightLine className="size-4" aria-hidden />
    </a>
  );
}

function Bloco({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("flex min-w-0 flex-col gap-2", className)}>{children}</div>;
}

function CarregandoPainel() {
  return (
    <div role="status" aria-label="Carregando indicadores e gráficos" className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex h-[132px] flex-col justify-between rounded-2xl bg-background-secondary-default p-4">
            <SkeletonBar className="size-8" />
            <div className="flex flex-col gap-2">
              <SkeletonBar className="w-28" />
              <SkeletonBar className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-[329px] rounded-2xl bg-background-secondary-default p-4 xl:col-span-2">
          <SkeletonBar className="w-40" />
        </div>
        <div className="h-[329px] rounded-2xl bg-background-secondary-default p-4">
          <SkeletonBar className="w-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * Painel de acompanhamento do TFD: filtro global de período, indicadores,
 * gráficos por mês, situação e especialidade e as solicitações recentes.
 * Segue `tela-dashboard.md`. Nada é editável aqui; cada bloco leva à listagem.
 */
export function PainelTfdTela({ contained = false, periodoInicial = "semestre", estado = "pronto" }: PainelTfdTelaProps) {
  const [periodo, setPeriodo] = useState<PeriodoId>(periodoInicial);
  const dados = useMemo(() => dadosDoPainelTfd(periodo), [periodo]);
  const rotuloPeriodo = PERIODOS.find((p) => p.id === periodo)!.label;
  const intervaloCurto = rotuloIntervaloCurto(periodo);

  return (
    <AppFrame
      contained={contained}
      navGroups={GRUPOS_NAVEGACAO_TFD}
      selected="painel"
      user={USUARIO_TFD}
      userMenuItems={MENU_USUARIO_TFD}
      breadcrumb={[{ label: "Início", href: "#" }, { label: "Painel" }]}
      showSearch
      searchPlaceholder="Buscar paciente ou protocolo"
      notificationCount={3}
    >
      <div className="flex flex-col gap-4 p-1 pb-4">
        <PageHeader
          title="Painel de acompanhamento"
          description="Visão agregada das solicitações de tratamento fora do domicílio do município."
          meta={[{ label: "Período", value: dados.intervalo }]}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl
            aria-label="Período dos indicadores"
            selectedKeys={new Set([periodo])}
            onSelectionChange={(keys) => {
              const proximo = [...keys][0];
              if (proximo) setPeriodo(proximo as PeriodoId);
            }}
          >
            {PERIODOS.map((p) => (
              <SegmentedControlItem key={p.id} id={p.id}>
                {p.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <p role="status" className="text-body-2-regular text-text-secondary">
            {estado === "pronto"
              ? `${rotuloPeriodo}: ${dados.intervalo}. Variações comparadas ao ${dados.comparadoA}.`
              : `${rotuloPeriodo}: ${dados.intervalo}.`}
          </p>
        </div>

        {estado === "carregando" ? <CarregandoPainel /> : null}

        {estado === "sem-dados" ? (
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default">
            <EmptyState
              size="lg"
              title="Nenhuma solicitação no período"
              description="Ampliar o período mostra solicitações de meses anteriores."
              action={
                <a
                  href="#solicitacoes"
                  className="inline-flex h-9 items-center rounded-2lg border border-border-button-default bg-background-primary-default px-3 text-body-medium text-text-primary shadow-xs outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  Ver todas as solicitações
                </a>
              }
            />
          </div>
        ) : null}

        {estado === "pronto" ? (
          <>
            <section aria-label="Indicadores do período" className="flex flex-col gap-2">
              <StatCards stats={dados.indicadores} />
              <LinkDrill href="#solicitacoes">Ver solicitações do período</LinkDrill>
            </section>

            <section aria-label="Gráficos do período" className="grid items-start gap-4 xl:grid-cols-3">
              <div className="contents xl:col-span-2 xl:flex xl:flex-col xl:gap-4">
              <Bloco className="order-1">
                <ComboChartCard
                  key={`mes-${periodo}`}
                  title="Solicitações por mês"
                  data={dados.porMes}
                  bar={{
                    key: "solicitacoes",
                    label: "Solicitações",
                    format: formatarNumeroPt,
                    axisFormat: formatarNumeroPt,
                  }}
                  line={{
                    key: "aprovacao",
                    label: "Taxa de aprovação",
                    format: (n) => `${(Math.round(n * 10) / 10).toLocaleString("pt-BR")}%`,
                    axisFormat: (n) => `${Math.round(n)}%`,
                  }}
                  headline={dados.totalPeriodo}
                  delta={dados.variacaoPeriodo}
                  range={intervaloCurto}
                />
                <TabelaAlternativa
                  legenda="Solicitações por mês e taxa de aprovação"
                  colunas={["Mês", "Solicitações", "Taxa de aprovação (%)"]}
                  linhas={dados.porMes.map((m) => [m.label, m.solicitacoes, m.aprovacao])}
                />
                <LinkDrill href="#solicitacoes">Ver solicitações por mês</LinkDrill>
              </Bloco>

              <Bloco className="order-4">
                <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-2">
                  <h2 className="px-3 pt-3 text-headline-semibold text-text-primary">Solicitações recentes</h2>
                  <DataListing
                    label="Solicitações recentes"
                    entity={{ singular: "solicitação", plural: "solicitações" }}
                    data={dados.recentes}
                    columns={COLUNAS}
                    getRowId={(r) => r.id}
                    getRowLabel={(r) => r.protocolo}
                    getRowHref={(r) => `#/solicitacoes/${r.id}`}
                    rowActions={[{ id: "ver", label: "Ver detalhes", icon: RiEyeLine, onAction: () => {} }]}
                    total={dados.recentes.length}
                    page={1}
                    pageSize={dados.recentes.length}
                    className="border-0"
                  />
                </div>
                <LinkDrill href="#solicitacoes">Ver todas as solicitações</LinkDrill>
              </Bloco>
              </div>
              <div className="contents xl:flex xl:flex-col xl:gap-4">
              <Bloco className="order-2">
                <RadialChartCard
                  key={`situacao-${periodo}`}
                  variant="rings"
                  tiles
                  title="Solicitações por situação"
                  data={dados.porSituacao.map((s) => ({ label: s.label, value: s.value }))}
                  headline={dados.totalPeriodo}
                  range={intervaloCurto}
                  format={formatarNumeroPt}
                />
                <TabelaAlternativa
                  legenda="Solicitações por situação"
                  colunas={["Situação", "Solicitações"]}
                  linhas={dados.porSituacao.map((s) => [s.label, s.value])}
                />
                <LinkDrill href="#solicitacoes">Ver solicitações por situação</LinkDrill>
              </Bloco>

              <Bloco className="order-3">
                <BarListCard
                  key={`esp-${periodo}`}
                  title="Por especialidade"
                  items={dados.porEspecialidade}
                  metric="value"
                  metricLabel="Solicitações"
                  format={formatarNumeroPt}
                  limit={6}
                  color="var(--color-chart-1)"
                />
                <TabelaAlternativa
                  legenda="Solicitações por especialidade"
                  colunas={["Especialidade", "Solicitações"]}
                  linhas={dados.porEspecialidade.map((s) => [s.label, s.value])}
                />
                <LinkDrill href="#solicitacoes">Ver solicitações por especialidade</LinkDrill>
              </Bloco>

              </div>
            </section>
          </>
        ) : null}
      </div>
    </AppFrame>
  );
}
