"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiEyeLine,
  RiFileList3Line,
  RiSendPlaneLine,
} from "@remixicon/react";
import { ActionMenu } from "@/components/application/action-menu/action-menu";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { DataListing } from "@/components/application/data-listing/data-listing";
import type {
  DataListingColumn,
  DataListingDensity,
  DataListingSort,
  DataListingState,
} from "@/components/application/data-listing/data-listing";
import { KeyValueList } from "@/components/application/detalhe/key-value-list";
import { Drawer } from "@/components/application/drawer/drawer";
import { DrawerActions } from "@/components/application/drawer/drawer-actions";
import { FilterBar, emptyFilterBarValue } from "@/components/application/filter-bar/filter-bar";
import type {
  FilterBarField,
  FilterBarFilter,
  FilterBarValue,
} from "@/components/application/filter-bar/filter-bar";
import { PageHeader } from "@/components/application/page-header/page-header";
import { SelectionBar } from "@/components/application/selection-bar/selection-bar";
import { Chip } from "@/components/base/badges/chip";
import {
  COR_DOCUMENTO,
  COR_STATUS,
  DESTINOS,
  ESPECIALIDADES,
  ORIGENS,
  SOLICITACOES,
  STATUS_SOLICITACAO,
  formatarDataBR,
} from "./dados/listagem-solicitacoes";
import type { SolicitacaoTFD } from "./dados/listagem-solicitacoes";
import { AvisoStatus } from "./aviso-status";
import { MolduraGestao } from "./moldura-gestao";

const ENTIDADE = { singular: "solicitação", plural: "solicitações" };
const PREFIXO_LINK = "#/solicitacoes/";

const COLUNAS_ORDENAVEIS: Record<string, (s: SolicitacaoTFD) => string> = {
  protocolo: (s) => s.protocolo,
  paciente: (s) => s.paciente,
  especialidade: (s) => s.especialidade,
  dataConsulta: (s) => s.dataConsulta,
};

const FILTROS: FilterBarFilter[] = [
  { id: "status", label: "Situação", options: STATUS_SOLICITACAO.map((v) => ({ value: v, label: v })) },
  { id: "especialidade", label: "Especialidade", multiple: true, options: ESPECIALIDADES.map((v) => ({ value: v, label: v })) },
  { id: "destino", label: "Destino", multiple: true, options: DESTINOS.map((v) => ({ value: v, label: v })) },
];

const CAMPOS_CONDICAO: FilterBarField[] = [
  { id: "paciente", label: "Paciente" },
  { id: "origem", label: "Origem", options: ORIGENS.map((v) => ({ value: v, label: v })) },
  { id: "especialidade", label: "Especialidade", options: ESPECIALIDADES.map((v) => ({ value: v, label: v })) },
  { id: "status", label: "Situação", options: STATUS_SOLICITACAO.map((v) => ({ value: v, label: v })) },
];

function filtrar(dados: SolicitacaoTFD[], filtro: FilterBarValue): SolicitacaoTFD[] {
  const busca = filtro.search.trim().toLowerCase();
  return dados.filter((linha) => {
    if (busca && !`${linha.paciente} ${linha.protocolo}`.toLowerCase().includes(busca)) return false;
    for (const [id, valores] of Object.entries(filtro.selections)) {
      if (valores.length === 0) continue;
      if (!valores.includes(String(linha[id as keyof SolicitacaoTFD]))) return false;
    }
    for (const c of filtro.conditions) {
      const atual = String(linha[c.fieldId as keyof SolicitacaoTFD] ?? "").toLowerCase();
      const alvo = c.value.toLowerCase();
      if (c.operatorId === "igual" && atual !== alvo) return false;
      if (c.operatorId === "diferente" && atual === alvo) return false;
      if (c.operatorId === "contem" && !atual.includes(alvo)) return false;
    }
    return true;
  });
}

function ordenar(dados: SolicitacaoTFD[], sort: DataListingSort | null): SolicitacaoTFD[] {
  const chave = sort ? COLUNAS_ORDENAVEIS[sort.column] : undefined;
  if (!sort || !chave) return dados;
  const fator = sort.direction === "ascending" ? 1 : -1;
  return [...dados].sort((a, b) => chave(a).localeCompare(chave(b), "pt-BR") * fator);
}

function baixarCsv(linhas: SolicitacaoTFD[]) {
  const cabecalho = ["Protocolo", "Paciente", "CPF", "Especialidade", "Origem", "Destino", "Consulta", "Situação"];
  const corpo = linhas.map((s) =>
    [s.protocolo, s.paciente, s.cpf, s.especialidade, s.origem, s.destino, formatarDataBR(s.dataConsulta), s.status]
      .map((c) => `"${c.replaceAll('"', '""')}"`)
      .join(";"),
  );
  const blob = new Blob([`﻿${[cabecalho.join(";"), ...corpo].join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "solicitacoes-tfd.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function TituloSecao({ children }: { children: string }) {
  return <h3 className="text-headline-medium text-text-primary">{children}</h3>;
}

function DetalheSolicitacao({ s }: { s: SolicitacaoTFD }) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Situação" className="flex flex-wrap items-center gap-2">
        <Chip variant="bold" color={COR_STATUS[s.status]}>
          {s.status}
        </Chip>
        <span className="text-body-regular text-text-secondary">
          Solicitada em {formatarDataBR(s.dataSolicitacao)}
        </span>
      </section>

      <section className="flex flex-col gap-3">
        <TituloSecao>Paciente</TituloSecao>
        <KeyValueList
          columns={2}
          items={[
            { label: "Nome", value: s.paciente, span: 2 },
            { label: "CPF", value: s.cpf },
            { label: "Nascimento", value: formatarDataBR(s.nascimento) },
            { label: "Telefone", value: s.telefone },
            { label: "Acompanhante", value: s.acompanhante ? "Necessário" : "Dispensado" },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <TituloSecao>Trajeto</TituloSecao>
        <KeyValueList
          columns={2}
          items={[
            { label: "Origem", value: s.origem },
            { label: "Destino", value: s.destino },
            { label: "Unidade de destino", value: s.unidadeDestino, span: 2 },
            { label: "Especialidade", value: s.especialidade },
            { label: "Transporte", value: s.transporte },
            { label: "Data da consulta", value: formatarDataBR(s.dataConsulta) },
          ]}
        />
      </section>

      <section className="flex flex-col gap-3">
        <TituloSecao>Documentos</TituloSecao>
        <ul className="flex flex-col divide-y divide-separator-border rounded-2xl border border-border-table">
          {s.documentos.map((doc) => (
            <li key={doc.nome} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="text-body-medium text-text-primary">{doc.nome}</span>
              <Chip variant="caption" color={COR_DOCUMENTO[doc.situacao]}>
                {doc.situacao}
              </Chip>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <TituloSecao>Observação</TituloSecao>
        <p className="text-body-regular text-text-secondary">{s.observacao}</p>
      </section>
    </div>
  );
}

export interface ListagemSolicitacoesTelaProps {
  /** Altura fixa de janela, para pré-visualizações. */
  contained?: boolean;
  /** Abre o drawer de detalhe da solicitação (id) ao montar. */
  detalheInicial?: string;
  /** Linhas já selecionadas ao montar (ids). */
  selecionadosIniciais?: string[];
  /** Abre a confirmação de cancelamento das linhas selecionadas ao montar. */
  cancelarInicial?: boolean;
  /** Força um estado da listagem, para documentação. */
  forcarEstado?: DataListingState;
}

/** Tela de listagem de solicitações de TFD: filtros, seleção em massa, ações de linha e drawer de detalhe. */
export function ListagemSolicitacoesTela({
  contained = false,
  detalheInicial,
  selecionadosIniciais = [],
  cancelarInicial = false,
  forcarEstado,
}: ListagemSolicitacoesTelaProps) {
  const [dados, setDados] = useState(SOLICITACOES);
  const [filtro, setFiltro] = useState<FilterBarValue>(emptyFilterBarValue);
  const [sort, setSort] = useState<DataListingSort | null>({ column: "dataConsulta", direction: "ascending" });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(10);
  const [densidade, setDensidade] = useState<DataListingDensity>("confortavel");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set(selecionadosIniciais));
  const [detalheId, setDetalheId] = useState<string | null>(detalheInicial ?? null);
  const [ultimoId, setUltimoId] = useState<string | null>(detalheInicial ?? null);
  const [alvoCancelar, setAlvoCancelar] = useState<string[] | null>(
    cancelarInicial ? selecionadosIniciais : null,
  );
  const [aviso, setAviso] = useState<string | null>(null);

  const filtrados = useMemo(() => ordenar(filtrar(dados, filtro), sort), [dados, filtro, sort]);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamanho));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const fatia = filtrados.slice((paginaAtual - 1) * tamanho, paginaAtual * tamanho);
  const filtrando =
    filtro.search.trim() !== "" || filtro.conditions.length > 0 || Object.keys(filtro.selections).length > 0;

  let estado: DataListingState = "pronto";
  if (forcarEstado) estado = forcarEstado;
  else if (dados.length === 0) estado = "vazio";
  else if (filtrados.length === 0 && filtrando) estado = "vazio-filtro";

  const abrirDetalhe = (id: string) => {
    setUltimoId(id);
    setDetalheId(id);
  };

  const encaminhar = (ids: string[]) => {
    setAviso(`${ids.length} ${ids.length === 1 ? "solicitação encaminhada" : "solicitações encaminhadas"} ao regulador.`);
    setSelecionados(new Set());
  };

  const confirmarCancelamento = () => {
    if (!alvoCancelar) return;
    const ids = new Set(alvoCancelar);
    setDados((atual) => atual.filter((s) => !ids.has(s.id)));
    setSelecionados((atual) => new Set([...atual].filter((id) => !ids.has(id))));
    setAviso(`${ids.size} ${ids.size === 1 ? "solicitação cancelada" : "solicitações canceladas"}.`);
    setAlvoCancelar(null);
    setDetalheId(null);
  };

  const colunas: DataListingColumn<SolicitacaoTFD>[] = [
    {
      id: "protocolo",
      header: "Protocolo",
      isIdentifier: true,
      sortable: true,
      width: "w-[170px]",
      cell: (s) => s.protocolo,
    },
    {
      id: "paciente",
      header: "Paciente",
      sortable: true,
      width: "w-[220px]",
      cell: (s) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-medium text-text-primary">{s.paciente}</span>
          <span className="text-caption-1-regular text-text-secondary">CPF {s.cpf}</span>
        </div>
      ),
    },
    { id: "especialidade", header: "Especialidade", sortable: true, width: "w-[140px]", cell: (s) => s.especialidade },
    { id: "trajeto", header: "Trajeto", width: "w-[200px]", cell: (s) => `${s.origem} para ${s.destino}` },
    {
      id: "dataConsulta",
      header: "Consulta",
      sortable: true,
      width: "w-[120px]",
      cell: (s) => formatarDataBR(s.dataConsulta),
    },
    {
      id: "status",
      header: "Situação",
      width: "w-[190px]",
      cell: (s) => (
        <Chip variant="caption" color={COR_STATUS[s.status]}>
          {s.status}
        </Chip>
      ),
    },
    {
      id: "acoes",
      header: "Ações",
      align: "end",
      width: "w-[72px]",
      cell: (s) => (
        <div className="flex justify-end">
          <ActionMenu
            aria-label={`Mais ações de ${s.protocolo}`}
            placement="bottom"
            items={[
              { id: "ver", label: "Ver detalhes", icon: RiEyeLine, onAction: () => abrirDetalhe(s.id) },
              { id: "editar", label: "Editar", icon: RiEditLine },
              {
                id: "encaminhar",
                label: "Encaminhar",
                icon: RiSendPlaneLine,
                onAction: () => encaminhar([s.id]),
              },
              { type: "separator" },
              {
                id: "cancelar",
                label: "Cancelar solicitação",
                icon: RiDeleteBin6Line,
                tone: "danger",
                onAction: () => setAlvoCancelar([s.id]),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const detalhe = dados.find((s) => s.id === ultimoId) ?? null;
  const total = dados.length;

  return (
    <MolduraGestao
      selecionado="solicitacoes"
      trilha={[{ label: "TFD" }, { label: "Solicitações" }]}
      contained={contained}
    >
      <div
        className="flex flex-col gap-4"
        onClick={(evento) => {
          const link = (evento.target as HTMLElement).closest("a");
          const href = link?.getAttribute("href");
          if (href?.startsWith(PREFIXO_LINK)) {
            evento.preventDefault();
            abrirDetalhe(href.slice(PREFIXO_LINK.length));
          }
        }}
      >
        <PageHeader
          title="Solicitações"
          description="Pedidos de tratamento fora do domicílio abertos pelos municípios, da análise ao agendamento."
          meta={[
            { label: "Total", value: `${total} ${total === 1 ? ENTIDADE.singular : ENTIDADE.plural}` },
            { label: "Atualizado em", value: "21/10/2026" },
          ]}
          primaryAction={{ label: "Nova solicitação", icon: RiAddLine }}
        />

        {aviso ? <AvisoStatus mensagem={aviso} onDispensar={() => setAviso(null)} /> : null}

        <FilterBar
          value={filtro}
          onChange={(v) => {
            setFiltro(v);
            setPagina(1);
          }}
          filters={FILTROS}
          conditionFields={CAMPOS_CONDICAO}
          searchPlaceholder="Buscar por paciente ou protocolo"
          searchLabel="Buscar solicitações por paciente ou protocolo"
          resultCount={filtrados.length}
          resultNoun={ENTIDADE}
        />

        <DataListing
          label="Solicitações de TFD"
          entity={ENTIDADE}
          data={fatia}
          columns={colunas}
          getRowId={(s) => s.id}
          getRowLabel={(s) => s.protocolo}
          getRowHref={(s) => `${PREFIXO_LINK}${s.id}`}
          state={estado}
          density={densidade}
          onDensityChange={setDensidade}
          selectable
          selectedKeys={selecionados}
          onSelectedKeysChange={setSelecionados}
          sort={sort}
          onSortChange={(proximo) => {
            setSort(proximo);
            setPagina(1);
          }}
          total={filtrados.length}
          page={paginaAtual}
          pageSize={tamanho}
          onPageChange={setPagina}
          onPageSizeChange={(n) => {
            setTamanho(n);
            setPagina(1);
          }}
          onClearFilters={() => setFiltro(emptyFilterBarValue)}
          emptyAction={null}
          minTableWidth="min-w-[1060px]"
        />

        <SelectionBar
          count={selecionados.size}
          position="container"
          onClear={() => setSelecionados(new Set())}
          actions={[
            { id: "encaminhar", label: "Encaminhar", icon: RiSendPlaneLine, onPress: () => encaminhar([...selecionados]) },
            {
              id: "exportar",
              label: "Exportar",
              icon: RiDownload2Line,
              onPress: () => baixarCsv(dados.filter((s) => selecionados.has(s.id))),
            },
            {
              id: "cancelar",
              label: "Cancelar",
              icon: RiDeleteBin6Line,
              tone: "danger",
              onPress: () => setAlvoCancelar([...selecionados]),
            },
          ]}
        />
      </div>

      <Drawer
        isOpen={detalheId !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setDetalheId(null);
        }}
        title={detalhe?.protocolo ?? "Solicitação"}
        description={detalhe?.paciente}
        icon={RiFileList3Line}
        size="md"
        footer={
          <DrawerActions
            primaryLabel="Encaminhar"
            onPrimary={() => {
              if (detalhe) encaminhar([detalhe.id]);
              setDetalheId(null);
            }}
            isPrimaryDisabled={detalhe?.status === "Concluída" || detalhe?.status === "Negada"}
            secondaryLabel="Fechar"
            onSecondary={() => setDetalheId(null)}
            destructiveLabel="Cancelar solicitação"
            onDestructive={() => detalhe && setAlvoCancelar([detalhe.id])}
          />
        }
      >
        {detalhe ? <DetalheSolicitacao s={detalhe} /> : null}
      </Drawer>

      <ConfirmDialog
        isOpen={alvoCancelar !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setAlvoCancelar(null);
        }}
        tone="danger"
        verb="Cancelar"
        affectedCount={alvoCancelar?.length ?? 0}
        entitySingular={ENTIDADE.singular}
        entityPlural={ENTIDADE.plural}
        description="As solicitações saem da fila de análise e o paciente deixa de ser avisado sobre a viagem. Esta ação não pode ser desfeita."
        confirmLabel={`Cancelar ${alvoCancelar?.length ?? 0} ${alvoCancelar?.length === 1 ? ENTIDADE.singular : ENTIDADE.plural}`}
        cancelLabel="Voltar"
        onConfirm={confirmarCancelamento}
      />
    </MolduraGestao>
  );
}
