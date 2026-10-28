"use client";

import { useMemo, useRef, useState } from "react";
import { RiAddLine, RiDatabase2Line, RiDeleteBin6Line, RiEditLine } from "@remixicon/react";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { DataListing } from "@/components/application/data-listing/data-listing";
import type { DataListingColumn, DataListingSort } from "@/components/application/data-listing/data-listing";
import { Drawer } from "@/components/application/drawer/drawer";
import { DrawerActions } from "@/components/application/drawer/drawer-actions";
import { FilterBar, emptyFilterBarValue } from "@/components/application/filter-bar/filter-bar";
import type { FilterBarFilter, FilterBarValue } from "@/components/application/filter-bar/filter-bar";
import { FormField, FormGrid } from "@/components/application/formulario/form-grid";
import { FormSection } from "@/components/application/formulario/form-section";
import { SettingsLayout } from "@/components/application/settings-layout/settings-layout";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { Textarea } from "@/components/base/textarea/textarea";
import { TABELAS_AUXILIARES } from "./dados/tabelas-auxiliares";
import type { CampoAuxiliar, RegistroAuxiliar, TabelaAuxiliar } from "./dados/tabelas-auxiliares";
import { AvisoStatus } from "./aviso-status";
import { MolduraGestao } from "./moldura-gestao";

const FILTROS: FilterBarFilter[] = [
  {
    id: "situacao",
    label: "Situação",
    allLabel: "Todas",
    options: [
      { value: "ativo", label: "Ativo" },
      { value: "inativo", label: "Inativo" },
    ],
  },
];

const GRUPOS = [
  {
    label: "Tabelas auxiliares",
    items: TABELAS_AUXILIARES.map((t) => ({ key: t.id, label: t.titulo })),
  },
];

interface Rascunho {
  ativo: boolean;
  valores: Record<string, string>;
}

type Erros = Record<string, string>;

function CampoRotulado({ campo, children }: { campo: CampoAuxiliar; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-body-medium text-text-primary">
        {campo.rotulo}
        {campo.obrigatorio ? (
          <span className="ms-0.5 text-text-error-primary" aria-hidden>
            *
          </span>
        ) : null}
      </span>
      {children}
    </div>
  );
}

function validar(tabela: TabelaAuxiliar, rascunho: Rascunho, registros: RegistroAuxiliar[], idAtual?: string): Erros {
  const erros: Erros = {};
  for (const campo of tabela.campos) {
    if (campo.obrigatorio && !rascunho.valores[campo.id]?.trim()) {
      erros[campo.id] = campo.tipo === "selecao" ? "Selecione uma opção." : "Campo obrigatório.";
    }
  }
  const codigo = rascunho.valores.codigo?.trim().toLowerCase();
  if (
    codigo &&
    registros.some((r) => r.id !== idAtual && r.valores.codigo.trim().toLowerCase() === codigo)
  ) {
    erros.codigo = "Já existe um registro com este código.";
  }
  return erros;
}

export interface TabelasAuxiliaresTelaProps {
  contained?: boolean;
  /** Tabela exibida ao montar (id). Padrão: municípios. */
  tabelaInicial?: string;
  /** Abre o drawer de edição do registro (id) ao montar. */
  editarInicial?: string;
  /** Abre o drawer de novo registro ao montar. */
  novoInicial?: boolean;
  /** Abre a confirmação de exclusão do registro (id) ao montar. */
  excluirInicial?: string;
}

/** Tabelas auxiliares do TFD: navegação por tabela, listagem com alternância de ativo, drawer de edição e exclusão confirmada. */
export function TabelasAuxiliaresTela({
  contained = false,
  tabelaInicial = "municipios",
  editarInicial,
  novoInicial = false,
  excluirInicial,
}: TabelasAuxiliaresTelaProps) {
  const [tabelaId, setTabelaId] = useState(tabelaInicial);
  const [dados, setDados] = useState<Record<string, RegistroAuxiliar[]>>(() =>
    Object.fromEntries(TABELAS_AUXILIARES.map((t) => [t.id, t.registros])),
  );
  const [filtro, setFiltro] = useState<FilterBarValue>(emptyFilterBarValue);
  const [sort, setSort] = useState<DataListingSort | null>({ column: "nome", direction: "ascending" });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(10);
  const [aviso, setAviso] = useState<string | null>(null);
  const proximoId = useRef(0);

  const tabela = TABELAS_AUXILIARES.find((t) => t.id === tabelaId) ?? TABELAS_AUXILIARES[0];
  const registros = dados[tabela.id];

  /* Drawer de edição */
  const inicial = editarInicial ? registros.find((r) => r.id === editarInicial) : undefined;
  const [drawerAberto, setDrawerAberto] = useState(Boolean(inicial) || novoInicial);
  const [editandoId, setEditandoId] = useState<string | null>(inicial?.id ?? null);
  const [rascunho, setRascunho] = useState<Rascunho>(
    inicial ? { ativo: inicial.ativo, valores: { ...inicial.valores } } : { ativo: true, valores: {} },
  );
  const [erros, setErros] = useState<Erros>({});

  /* Exclusão */
  const [excluirId, setExcluirId] = useState<string | null>(excluirInicial ?? null);
  const [ultimoExcluir, setUltimoExcluir] = useState<RegistroAuxiliar | null>(
    excluirInicial ? (registros.find((r) => r.id === excluirInicial) ?? null) : null,
  );

  const filtrados = useMemo(() => {
    const busca = filtro.search.trim().toLowerCase();
    const situacao = filtro.selections.situacao?.[0];
    const lista = registros.filter((r) => {
      if (busca && !Object.values(r.valores).join(" ").toLowerCase().includes(busca)) return false;
      if (situacao === "ativo" && !r.ativo) return false;
      if (situacao === "inativo" && r.ativo) return false;
      return true;
    });
    if (!sort) return lista;
    const fator = sort.direction === "ascending" ? 1 : -1;
    return [...lista].sort(
      (a, b) =>
        (a.valores[sort.column] ?? "").localeCompare(b.valores[sort.column] ?? "", "pt-BR", { numeric: true }) * fator,
    );
  }, [registros, filtro, sort]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamanho));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const fatia = filtrados.slice((paginaAtual - 1) * tamanho, paginaAtual * tamanho);
  const filtrando = filtro.search.trim() !== "" || Object.keys(filtro.selections).length > 0;

  const trocarTabela = (id: string) => {
    setTabelaId(id);
    setFiltro(emptyFilterBarValue);
    setSort({ column: "nome", direction: "ascending" });
    setPagina(1);
    setAviso(null);
  };

  const abrirNovo = () => {
    setEditandoId(null);
    setRascunho({ ativo: true, valores: {} });
    setErros({});
    setDrawerAberto(true);
  };

  const abrirEdicao = (registro: RegistroAuxiliar) => {
    setEditandoId(registro.id);
    setRascunho({ ativo: registro.ativo, valores: { ...registro.valores } });
    setErros({});
    setDrawerAberto(true);
  };

  const salvar = () => {
    const encontrados = validar(tabela, rascunho, registros, editandoId ?? undefined);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    if (editandoId) {
      setDados((atual) => ({
        ...atual,
        [tabela.id]: atual[tabela.id].map((r) =>
          r.id === editandoId ? { ...r, ativo: rascunho.ativo, valores: rascunho.valores } : r,
        ),
      }));
      setAviso(`Registro de ${tabela.titulo.toLowerCase()} atualizado.`);
    } else {
      const novo: RegistroAuxiliar = {
        id: `${tabela.id}-novo-${++proximoId.current}`,
        ativo: rascunho.ativo,
        valores: rascunho.valores,
      };
      setDados((atual) => ({ ...atual, [tabela.id]: [novo, ...atual[tabela.id]] }));
      setAviso(`Registro adicionado a ${tabela.titulo.toLowerCase()}.`);
    }
    setDrawerAberto(false);
  };

  const alternarAtivo = (id: string, ativo: boolean) =>
    setDados((atual) => ({
      ...atual,
      [tabela.id]: atual[tabela.id].map((r) => (r.id === id ? { ...r, ativo } : r)),
    }));

  const confirmarExclusao = () => {
    if (!excluirId) return;
    setDados((atual) => ({ ...atual, [tabela.id]: atual[tabela.id].filter((r) => r.id !== excluirId) }));
    setAviso(`Registro excluído de ${tabela.titulo.toLowerCase()}.`);
    setExcluirId(null);
  };

  const colunas: DataListingColumn<RegistroAuxiliar>[] = [
    ...tabela.campos
      .filter((c) => c.naTabela)
      .map<DataListingColumn<RegistroAuxiliar>>((campo) => ({
        id: campo.id,
        header: campo.rotulo,
        sortable: campo.id === "nome" || campo.id === "codigo",
        isIdentifier: campo.id === "nome",
        width: campo.largura,
        cell: (r) =>
          campo.id === "nome" ? (
            <span className="text-body-medium text-text-primary">{r.valores[campo.id]}</span>
          ) : (
            <span className={campo.id === "descricao" ? "text-text-secondary" : undefined}>{r.valores[campo.id]}</span>
          ),
      })),
    {
      id: "ativo",
      header: "Ativo",
      width: "w-[90px]",
      cell: (r) => (
        <Switch
          size="sm"
          aria-label={`Ativo: ${r.valores.nome}`}
          isSelected={r.ativo}
          onChange={(on) => alternarAtivo(r.id, on)}
        />
      ),
    },
  ];

  const renderCampo = (campo: CampoAuxiliar) => {
    const valor = rascunho.valores[campo.id] ?? "";
    const definir = (v: string) =>
      setRascunho((r) => ({ ...r, valores: { ...r.valores, [campo.id]: v } }));
    const erro = erros[campo.id];
    if (campo.tipo === "selecao") {
      return (
        <FormField key={campo.id}>
          <CampoRotulado campo={campo}>
            <Select
              aria-label={campo.rotulo}
              placeholder="Selecione"
              isInvalid={Boolean(erro)}
              selectedKey={valor || null}
              onSelectionChange={(k) => k !== null && definir(String(k))}
              className="w-full"
            >
              {(campo.opcoes ?? []).map((o) => (
                <SelectItem key={o} id={o} textValue={o}>
                  {o}
                </SelectItem>
              ))}
            </Select>
            {erro ? <span className="text-caption-1-regular text-text-error-primary">{erro}</span> : null}
          </CampoRotulado>
        </FormField>
      );
    }
    if (campo.tipo === "texto-longo") {
      return (
        <FormField key={campo.id} span="full">
          <Textarea
            label={campo.rotulo}
            placeholder={campo.placeholder}
            rows={3}
            value={valor}
            onChange={definir}
            isInvalid={Boolean(erro)}
            hint={erro}
          />
        </FormField>
      );
    }
    return (
      <FormField key={campo.id} span={campo.id === "nome" ? "full" : 1}>
        <Input
          label={campo.rotulo}
          placeholder={campo.placeholder}
          value={valor}
          onChange={definir}
          isRequired={campo.obrigatorio}
          isInvalid={Boolean(erro)}
          hint={erro}
        />
      </FormField>
    );
  };

  const editando = editandoId ? registros.find((r) => r.id === editandoId) : undefined;
  const total = registros.length;

  return (
    <MolduraGestao
      selecionado="tabelas"
      trilha={[{ label: "Sistema" }, { label: "Tabelas auxiliares" }]}
      contained={contained}
    >
      <SettingsLayout
        title="Tabelas auxiliares"
        description="Cadastros de apoio usados nas solicitações de TFD."
        groups={GRUPOS}
        selected={tabela.id}
        onSelect={trocarTabela}
        navLabel="Tabelas auxiliares"
        selectLabel="Tabela auxiliar"
        className="p-0 sm:p-2"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="text-title-3-semibold text-text-primary">{tabela.titulo}</h2>
              <p className="text-body-regular text-text-secondary">
                {tabela.resumo} {total} {total === 1 ? "registro" : "registros"}.
              </p>
            </div>
            <Button leadingIcon={RiAddLine} onClick={abrirNovo}>
              Novo registro
            </Button>
          </div>

          {aviso ? <AvisoStatus mensagem={aviso} onDispensar={() => setAviso(null)} /> : null}

          <FilterBar
            key={tabela.id}
            value={filtro}
            onChange={(v) => {
              setFiltro(v);
              setPagina(1);
            }}
            filters={FILTROS}
            searchPlaceholder={`Buscar em ${tabela.titulo.toLowerCase()}`}
            searchLabel={`Buscar em ${tabela.titulo.toLowerCase()}`}
            resultCount={filtrados.length}
            resultNoun={{ singular: "registro", plural: "registros" }}
          />

          <DataListing
            label={tabela.titulo}
            entity={{ singular: "registro", plural: "registros" }}
            data={fatia}
            columns={colunas}
            getRowId={(r) => r.id}
            getRowLabel={(r) => r.valores.nome}
            state={filtrados.length === 0 ? (filtrando ? "vazio-filtro" : "vazio") : "pronto"}
            sort={sort}
            onSortChange={(proximo) => {
              setSort(proximo);
              setPagina(1);
            }}
            rowActions={[
              { id: "editar", label: "Editar", icon: RiEditLine, onAction: abrirEdicao },
              {
                id: "excluir",
                label: "Excluir",
                icon: RiDeleteBin6Line,
                tone: "danger",
                onAction: (r) => {
                  setUltimoExcluir(r);
                  setExcluirId(r.id);
                },
              },
            ]}
            total={filtrados.length}
            page={paginaAtual}
            pageSize={tamanho}
            pageSizeOptions={[5, 10, 25]}
            onPageChange={setPagina}
            onPageSizeChange={(n) => {
              setTamanho(n);
              setPagina(1);
            }}
            onClearFilters={() => setFiltro(emptyFilterBarValue)}
            emptyTitle={`Nenhum registro em ${tabela.titulo.toLowerCase()}`}
            emptyDescription="Os registros criados aparecem aqui."
            emptyAction={
              <Button size="small" leadingIcon={RiAddLine} onClick={abrirNovo}>
                Novo registro
              </Button>
            }
            minTableWidth="min-w-[720px]"
          />
        </div>
      </SettingsLayout>

      <Drawer
        isOpen={drawerAberto}
        onOpenChange={setDrawerAberto}
        title={editandoId ? "Editar registro" : "Novo registro"}
        description={tabela.titulo}
        icon={RiDatabase2Line}
        size="md"
        footer={
          <DrawerActions
            form="form-registro-auxiliar"
            primaryLabel={editandoId ? "Salvar alterações" : "Adicionar registro"}
            secondaryLabel="Cancelar"
            onSecondary={() => setDrawerAberto(false)}
            destructiveLabel={editando ? "Excluir" : undefined}
            onDestructive={() => {
              if (!editando) return;
              setDrawerAberto(false);
              setUltimoExcluir(editando);
              setExcluirId(editando.id);
            }}
          />
        }
      >
        <form
          id="form-registro-auxiliar"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            salvar();
          }}
        >
          <FormSection
            card={false}
            headingLevel={3}
            title="Dados do registro"
            requiredNote="* Campos obrigatórios"
          >
            <FormGrid columns={2}>
              {tabela.campos.map(renderCampo)}
              <FormField span="full">
                <Switch
                  isSelected={rascunho.ativo}
                  onChange={(on) => setRascunho((r) => ({ ...r, ativo: on }))}
                >
                  Registro ativo
                </Switch>
              </FormField>
            </FormGrid>
          </FormSection>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={excluirId !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setExcluirId(null);
        }}
        tone="danger"
        verb="Excluir"
        affectedCount={1}
        entitySingular={tabela.singular}
        entityPlural={tabela.plural}
        description={
          ultimoExcluir
            ? `${ultimoExcluir.valores.nome} deixa de aparecer nas solicitações novas. Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir registro"
        cancelLabel="Voltar"
        onConfirm={confirmarExclusao}
      />
    </MolduraGestao>
  );
}
