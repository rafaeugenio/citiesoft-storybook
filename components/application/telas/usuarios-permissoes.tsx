"use client";

import { useMemo, useState } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiDeleteBin6Line,
  RiMailSendLine,
  RiSearchLine,
  RiUserAddLine,
  RiUserForbidLine,
  RiUserFollowLine,
} from "@remixicon/react";
import { ActionMenu } from "@/components/application/action-menu/action-menu";
import { DataListing } from "@/components/application/data-listing/data-listing";
import type { DataListingColumn, DataListingSort } from "@/components/application/data-listing/data-listing";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { Dialog } from "@/components/application/dialog/dialog";
import { Drawer } from "@/components/application/drawer/drawer";
import { DrawerActions } from "@/components/application/drawer/drawer-actions";
import { EmptyState } from "@/components/application/estados/empty-state";
import { FilterBar, emptyFilterBarValue } from "@/components/application/filter-bar/filter-bar";
import type { FilterBarFilter, FilterBarValue } from "@/components/application/filter-bar/filter-bar";
import { FormGrid } from "@/components/application/formulario/form-grid";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { Textarea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import {
  CONCESSOES_INICIAIS,
  CONVITES_INICIAIS,
  MODULOS,
  PAPEIS_INICIAIS,
  USUARIOS_INICIAIS,
  formatarDataBR,
} from "./dados/usuarios-permissoes";
import type { Convite, Papel, Usuario } from "./dados/usuarios-permissoes";
import { AvisoStatus } from "./aviso-status";
import { MolduraGestao } from "./moldura-gestao";

export type AbaUsuarios = "membros" | "convites" | "permissoes";

const ENTIDADE_USUARIO = { singular: "usuário", plural: "usuários" };
const ENTIDADE_CONVITE = { singular: "convite", plural: "convites" };
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

const FILTRO_SITUACAO: FilterBarFilter = {
  id: "situacao",
  label: "Situação",
  allLabel: "Todas",
  options: [
    { value: "Ativo", label: "Ativo" },
    { value: "Desativado", label: "Desativado" },
  ],
};

function iniciais(nome: string) {
  const partes = nome.split(" ").filter(Boolean);
  return `${partes[0]?.[0] ?? ""}${partes.length > 1 ? partes[partes.length - 1][0] : ""}`.toUpperCase();
}

function CampoPapel({
  rotulo,
  papeis,
  valor,
  onChange,
  ocultarRotulo = false,
}: {
  rotulo: string;
  papeis: Papel[];
  valor: string;
  onChange: (id: string) => void;
  ocultarRotulo?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {ocultarRotulo ? null : <span className="text-body-medium text-text-primary">{rotulo}</span>}
      <Select
        aria-label={rotulo}
        size={ocultarRotulo ? "sm" : "md"}
        selectedKey={valor}
        onSelectionChange={(k) => k !== null && onChange(String(k))}
        className={ocultarRotulo ? "w-[150px]" : "w-full"}
      >
        {papeis.map((p) => (
          <SelectItem key={p.id} id={p.id} textValue={p.nome}>
            {p.nome}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

/* ------------------------------------------------------- Matriz de papéis */

interface MatrizProps {
  papeis: Papel[];
  concessoes: Record<string, string[]>;
  onAlterar: (papelId: string, permissaoIds: string[], conceder: boolean) => void;
  usuariosPorPapel: Record<string, number>;
}

function MatrizPermissoes({ papeis, concessoes, onAlterar, usuariosPorPapel }: MatrizProps) {
  const [busca, setBusca] = useState("");
  const [colapsados, setColapsados] = useState<Set<string>>(new Set());
  const [anuncio, setAnuncio] = useState("");

  const termo = busca.trim().toLowerCase();
  const modulos = MODULOS.map((m) => ({
    ...m,
    permissoes: m.permissoes.filter(
      (p) => !termo || `${p.rotulo} ${p.descricao}`.toLowerCase().includes(termo) || m.nome.toLowerCase().includes(termo),
    ),
  })).filter((m) => m.permissoes.length > 0);

  const alternarModulo = (id: string) =>
    setColapsados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });

  const colunaCabecalho = "sticky top-0 z-10 border-b border-border-table bg-background-secondary-default px-3 py-3";

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full sm:w-[320px]">
        <Input
          aria-label="Buscar permissão na matriz"
          type="search"
          placeholder="Buscar permissão"
          leadingIcon={RiSearchLine}
          value={busca}
          onChange={setBusca}
        />
      </div>

      {modulos.length === 0 ? (
        <div className="rounded-2xl border border-border-table">
          <EmptyState
            size="sm"
            title="Nenhuma permissão encontrada"
            description="Nenhuma permissão corresponde à busca."
            action={
              <Button variant="secondary" size="small" onClick={() => setBusca("")}>
                Limpar busca
              </Button>
            }
          />
        </div>
      ) : (
        <div
          role="region"
          aria-label="Matriz de permissões por papel"
          tabIndex={0}
          className="max-h-[560px] overflow-auto rounded-2xl border border-border-table outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-start">
            <thead>
              <tr>
                <th scope="col" className={cx(colunaCabecalho, "start-0 z-20 w-[300px] text-start text-body-2-medium text-text-secondary")}>
                  Permissão
                </th>
                {papeis.map((papel) => (
                  <th key={papel.id} scope="col" className={cx(colunaCabecalho, "text-center")}>
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-body-medium text-text-primary">{papel.nome}</span>
                      <Chip variant="caption" color={papel.sistema ? "neutral" : "blue"}>
                        {papel.sistema ? "Papel do sistema" : "Personalizado"}
                      </Chip>
                      <span className="text-caption-1-regular text-text-secondary">
                        {usuariosPorPapel[papel.id] ?? 0} {(usuariosPorPapel[papel.id] ?? 0) === 1 ? "usuário" : "usuários"}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {modulos.map((modulo) => {
              const aberto = !colapsados.has(modulo.id);
              const ids = modulo.permissoes.map((p) => p.id);
              return (
                <tbody key={modulo.id}>
                  <tr className="bg-background-secondary-default">
                    <th scope="row" className="sticky start-0 z-[5] border-b border-border-table bg-background-secondary-default px-3 py-2 text-start">
                      <button
                        type="button"
                        aria-expanded={aberto}
                        onClick={() => alternarModulo(modulo.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        <RiArrowDownSLine
                          className={cx("size-5 text-foreground-icon-secondary transition-transform", !aberto && "-rotate-90")}
                          aria-hidden
                        />
                        {modulo.nome}
                      </button>
                    </th>
                    {papeis.map((papel) => {
                      const concedidas = ids.filter((id) => concessoes[papel.id]?.includes(id)).length;
                      return (
                        <td key={papel.id} className="border-b border-border-table bg-background-secondary-default px-3 py-2 text-center">
                          <Checkbox
                            aria-label={`Todas as permissões de ${modulo.nome} para ${papel.nome}`}
                            isDisabled={papel.id === "administrador"}
                            isSelected={concedidas === ids.length}
                            isIndeterminate={concedidas > 0 && concedidas < ids.length}
                            onChange={(on) => {
                              onAlterar(papel.id, ids, on);
                              setAnuncio(
                                `${ids.length} ${ids.length === 1 ? "permissão" : "permissões"} de ${modulo.nome} ${on ? "concedidas" : "revogadas"} para ${papel.nome}.`,
                              );
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  {aberto
                    ? modulo.permissoes.map((permissao) => (
                        <tr key={permissao.id}>
                          <th scope="row" className="sticky start-0 z-[5] border-b border-separator-border bg-background-primary-default px-3 py-3 text-start font-normal">
                            <span className="block text-body-medium text-text-primary">
                              {permissao.rotulo}
                              {permissao.critica ? (
                                <span className="ms-2 inline-block align-middle">
                                  <Chip variant="caption" color="yellow">
                                    Crítica
                                  </Chip>
                                </span>
                              ) : null}
                            </span>
                            <span className="block text-body-2-regular text-text-secondary">{permissao.descricao}</span>
                          </th>
                          {papeis.map((papel) => (
                            <td key={papel.id} className="border-b border-separator-border px-3 py-3 text-center">
                              <Checkbox
                                aria-label={`${permissao.rotulo} para ${papel.nome}`}
                                isDisabled={papel.id === "administrador"}
                                isSelected={Boolean(concessoes[papel.id]?.includes(permissao.id))}
                                onChange={(on) => onAlterar(papel.id, [permissao.id], on)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    : null}
                </tbody>
              );
            })}
          </table>
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {anuncio}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ Tela */

type AcaoUsuario = { tipo: "remover" | "desativar"; id: string } | null;

export interface UsuariosPermissoesTelaProps {
  contained?: boolean;
  /** Aba exibida ao montar. */
  abaInicial?: AbaUsuarios;
  /** Abre o drawer de convite ao montar. */
  conviteAberto?: boolean;
}

/** Gestão de usuários e permissões: membros, convites pendentes e matriz de permissões por papel. */
export function UsuariosPermissoesTela({
  contained = false,
  abaInicial = "membros",
  conviteAberto = false,
}: UsuariosPermissoesTelaProps) {
  const [aba, setAba] = useState<AbaUsuarios>(abaInicial);
  const [papeis, setPapeis] = useState<Papel[]>(PAPEIS_INICIAIS);
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIAIS);
  const [convites, setConvites] = useState<Convite[]>(CONVITES_INICIAIS);
  const [salvas, setSalvas] = useState<Record<string, string[]>>(CONCESSOES_INICIAIS);
  const [concessoes, setConcessoes] = useState<Record<string, string[]>>(CONCESSOES_INICIAIS);
  const [aviso, setAviso] = useState<string | null>(null);

  /* Membros */
  const [filtroMembros, setFiltroMembros] = useState<FilterBarValue>(emptyFilterBarValue);
  const [sortMembros, setSortMembros] = useState<DataListingSort | null>({ column: "usuario", direction: "ascending" });
  const [paginaMembros, setPaginaMembros] = useState(1);
  const [tamanhoMembros, setTamanhoMembros] = useState(10);
  const [acao, setAcao] = useState<AcaoUsuario>(null);
  const [ultimaAcao, setUltimaAcao] = useState<AcaoUsuario>(null);

  /* Convites */
  const [filtroConvites, setFiltroConvites] = useState<FilterBarValue>(emptyFilterBarValue);
  const [paginaConvites, setPaginaConvites] = useState(1);

  /* Drawer de convite */
  const [drawerConvite, setDrawerConvite] = useState(conviteAberto);
  const [emails, setEmails] = useState("");
  const [papelConvite, setPapelConvite] = useState("solicitante");
  const [mensagem, setMensagem] = useState("");
  const [erroConvite, setErroConvite] = useState<string | null>(null);

  /* Criar papel */
  const [dialogPapel, setDialogPapel] = useState(false);
  const [nomePapel, setNomePapel] = useState("");
  const [basePapel, setBasePapel] = useState("nenhum");
  const [erroPapel, setErroPapel] = useState<string | null>(null);

  /* Revogação crítica */
  const [revogar, setRevogar] = useState<{ papelId: string; ids: string[] } | null>(null);
  const [ultimaRevogacao, setUltimaRevogacao] = useState<{ papelId: string; ids: string[] } | null>(null);

  const nomePapelDe = (id: string) => papeis.find((p) => p.id === id)?.nome ?? id;
  const usuariosPorPapel = useMemo(() => {
    const contagem: Record<string, number> = {};
    for (const u of usuarios) if (u.situacao === "Ativo") contagem[u.papel] = (contagem[u.papel] ?? 0) + 1;
    return contagem;
  }, [usuarios]);

  const filtrosMembros: FilterBarFilter[] = [
    { id: "papel", label: "Papel", allLabel: "Todos", options: papeis.map((p) => ({ value: p.id, label: p.nome })) },
    FILTRO_SITUACAO,
  ];

  const membrosFiltrados = useMemo(() => {
    const busca = filtroMembros.search.trim().toLowerCase();
    const lista = usuarios.filter((u) => {
      if (busca && !`${u.nome} ${u.email}`.toLowerCase().includes(busca)) return false;
      const papel = filtroMembros.selections.papel?.[0];
      const situacao = filtroMembros.selections.situacao?.[0];
      if (papel && u.papel !== papel) return false;
      if (situacao && u.situacao !== situacao) return false;
      return true;
    });
    if (!sortMembros) return lista;
    const fator = sortMembros.direction === "ascending" ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = sortMembros.column === "entrada" ? a.entrada : a.nome;
      const vb = sortMembros.column === "entrada" ? b.entrada : b.nome;
      return va.localeCompare(vb, "pt-BR") * fator;
    });
  }, [usuarios, filtroMembros, sortMembros]);

  const totalPaginasMembros = Math.max(1, Math.ceil(membrosFiltrados.length / tamanhoMembros));
  const paginaMembrosAtual = Math.min(paginaMembros, totalPaginasMembros);
  const fatiaMembros = membrosFiltrados.slice(
    (paginaMembrosAtual - 1) * tamanhoMembros,
    paginaMembrosAtual * tamanhoMembros,
  );
  const filtrandoMembros =
    filtroMembros.search.trim() !== "" || Object.keys(filtroMembros.selections).length > 0;

  const convitesFiltrados = useMemo(() => {
    const busca = filtroConvites.search.trim().toLowerCase();
    return convites.filter((c) => !busca || c.email.toLowerCase().includes(busca));
  }, [convites, filtroConvites]);
  const fatiaConvites = convitesFiltrados.slice((paginaConvites - 1) * 10, paginaConvites * 10);

  /* Ações de usuário */
  const pedirAcao = (proxima: NonNullable<AcaoUsuario>) => {
    setUltimaAcao(proxima);
    setAcao(proxima);
  };

  const confirmarAcao = () => {
    if (!acao) return;
    const alvo = usuarios.find((u) => u.id === acao.id);
    if (acao.tipo === "remover") {
      setUsuarios((atual) => atual.filter((u) => u.id !== acao.id));
      setAviso(`${alvo?.nome} foi removido(a) do sistema.`);
    } else {
      setUsuarios((atual) => atual.map((u) => (u.id === acao.id ? { ...u, situacao: "Desativado" } : u)));
      setAviso(`${alvo?.nome} foi desativado(a).`);
    }
    setAcao(null);
  };

  const colunasMembros: DataListingColumn<Usuario>[] = [
    {
      id: "usuario",
      header: "Usuário",
      isIdentifier: true,
      sortable: true,
      width: "w-[300px]",
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="md" color="blue" initials={iniciais(u.nome)} alt="" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">
              {u.nome}
              {u.atual ? <span className="ms-2 text-caption-1-regular text-text-secondary">(você)</span> : null}
            </span>
            <span className="truncate text-caption-1-regular text-text-secondary">{u.email}</span>
          </div>
        </div>
      ),
    },
    { id: "entrada", header: "Entrada", sortable: true, width: "w-[120px]", cell: (u) => formatarDataBR(u.entrada) },
    {
      id: "papel",
      header: "Papel",
      width: "w-[180px]",
      cell: (u) => (
        <Select
          size="sm"
          aria-label={`Papel de ${u.nome}`}
          isDisabled={u.atual}
          selectedKey={u.papel}
          className="w-[150px]"
          onSelectionChange={(k) => {
            if (k === null || String(k) === u.papel) return;
            const novo = String(k);
            setUsuarios((atual) => atual.map((x) => (x.id === u.id ? { ...x, papel: novo } : x)));
            setAviso(`Papel de ${u.nome} alterado para ${nomePapelDe(novo)}.`);
          }}
        >
          {papeis.map((p) => (
            <SelectItem key={p.id} id={p.id} textValue={p.nome}>
              {p.nome}
            </SelectItem>
          ))}
        </Select>
      ),
    },
    {
      id: "situacao",
      header: "Situação",
      width: "w-[130px]",
      cell: (u) => (
        <Chip variant="caption" color={u.situacao === "Ativo" ? "lime" : "neutral"}>
          {u.situacao}
        </Chip>
      ),
    },
    {
      id: "acoes",
      header: "Ações",
      align: "end",
      width: "w-[72px]",
      cell: (u) => (
        <div className="flex justify-end">
          <ActionMenu
            aria-label={`Mais ações de ${u.nome}`}
            items={[
              u.situacao === "Ativo"
                ? {
                    id: "desativar",
                    label: "Desativar",
                    icon: RiUserForbidLine,
                    isDisabled: u.atual,
                    onAction: () => pedirAcao({ tipo: "desativar", id: u.id }),
                  }
                : {
                    id: "ativar",
                    label: "Reativar",
                    icon: RiUserFollowLine,
                    onAction: () => {
                      setUsuarios((atual) => atual.map((x) => (x.id === u.id ? { ...x, situacao: "Ativo" } : x)));
                      setAviso(`${u.nome} foi reativado(a).`);
                    },
                  },
              { type: "separator" },
              {
                id: "remover",
                label: "Remover do sistema",
                icon: RiDeleteBin6Line,
                tone: "danger",
                isDisabled: u.atual,
                onAction: () => pedirAcao({ tipo: "remover", id: u.id }),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const colunasConvites: DataListingColumn<Convite>[] = [
    { id: "email", header: "E-mail convidado", isIdentifier: true, width: "w-[320px]", cell: (c) => c.email },
    { id: "papel", header: "Papel", width: "w-[140px]", cell: (c) => nomePapelDe(c.papel) },
    { id: "convidadoEm", header: "Convidado em", width: "w-[140px]", cell: (c) => formatarDataBR(c.convidadoEm) },
    {
      id: "situacao",
      header: "Situação",
      width: "w-[130px]",
      cell: (c) => (
        <Chip variant="caption" color={c.situacao === "Pendente" ? "yellow" : "rose"}>
          {c.situacao}
        </Chip>
      ),
    },
    {
      id: "acoes",
      header: "Ações",
      align: "end",
      width: "w-[72px]",
      cell: (c) => (
        <div className="flex justify-end">
          <ActionMenu
            aria-label={`Mais ações do convite de ${c.email}`}
            items={[
              {
                id: "reenviar",
                label: "Reenviar convite",
                icon: RiMailSendLine,
                onAction: () => {
                  setConvites((atual) =>
                    atual.map((x) => (x.id === c.id ? { ...x, situacao: "Pendente", convidadoEm: "2026-10-21" } : x)),
                  );
                  setAviso(`Convite reenviado para ${c.email}.`);
                },
              },
              { type: "separator" },
              {
                id: "cancelar",
                label: "Cancelar convite",
                icon: RiDeleteBin6Line,
                tone: "danger",
                onAction: () => {
                  setConvites((atual) => atual.filter((x) => x.id !== c.id));
                  setAviso(`Convite para ${c.email} cancelado.`);
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];

  /* Convite */
  const abrirConvite = () => {
    setEmails("");
    setMensagem("");
    setPapelConvite("solicitante");
    setErroConvite(null);
    setDrawerConvite(true);
  };

  const emailsDigitados = emails
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const validos = [...new Set(emailsDigitados.filter((e) => EMAIL.test(e)))];
  const invalidos = emailsDigitados.filter((e) => !EMAIL.test(e));

  const enviarConvites = () => {
    if (validos.length === 0) {
      setErroConvite("Informe ao menos um e-mail válido.");
      return;
    }
    if (invalidos.length > 0) {
      setErroConvite(`E-mail inválido: ${invalidos.join(", ")}.`);
      return;
    }
    const novos: Convite[] = validos.map((email, i) => ({
      id: `c-${Date.now()}-${i}`,
      email,
      papel: papelConvite,
      convidadoEm: "2026-10-21",
      situacao: "Pendente",
    }));
    setConvites((atual) => [...novos, ...atual]);
    setAviso(`${novos.length} ${novos.length === 1 ? "convite enviado" : "convites enviados"} como ${nomePapelDe(papelConvite)}.`);
    setDrawerConvite(false);
    setAba("convites");
    setPaginaConvites(1);
  };

  /* Matriz */
  const aplicarConcessao = (papelId: string, ids: string[], conceder: boolean) =>
    setConcessoes((atual) => {
      const lista = new Set(atual[papelId] ?? []);
      for (const id of ids) {
        if (conceder) lista.add(id);
        else lista.delete(id);
      }
      return { ...atual, [papelId]: [...lista] };
    });

  const alterarConcessao = (papelId: string, ids: string[], conceder: boolean) => {
    const criticas = MODULOS.flatMap((m) => m.permissoes).filter(
      (p) => p.critica && ids.includes(p.id) && concessoes[papelId]?.includes(p.id),
    );
    if (!conceder && criticas.length > 0 && (usuariosPorPapel[papelId] ?? 0) > 0) {
      const pedido = { papelId, ids };
      setUltimaRevogacao(pedido);
      setRevogar(pedido);
      return;
    }
    aplicarConcessao(papelId, ids, conceder);
  };

  const sujo = JSON.stringify(concessoes) !== JSON.stringify(salvas);

  const criarPapel = () => {
    const nome = nomePapel.trim();
    if (!nome) {
      setErroPapel("Informe o nome do papel.");
      return;
    }
    if (papeis.some((p) => p.nome.toLowerCase() === nome.toLowerCase())) {
      setErroPapel("Já existe um papel com este nome.");
      return;
    }
    const id = `papel-${papeis.length + 1}`;
    const base = basePapel === "nenhum" ? [] : [...(concessoes[basePapel] ?? [])];
    setPapeis((atual) => [...atual, { id, nome, sistema: false }]);
    setConcessoes((atual) => ({ ...atual, [id]: base }));
    setSalvas((atual) => ({ ...atual, [id]: base }));
    setAviso(`Papel ${nome} criado${basePapel === "nenhum" ? "" : ` a partir de ${nomePapelDe(basePapel)}`}.`);
    setDialogPapel(false);
  };

  const contagemMembros = usuarios.length;
  const contagemConvites = convites.length;
  const alvoAcao = ultimaAcao ? usuarios.find((u) => u.id === ultimaAcao.id) : undefined;
  const papelRevogacao = ultimaRevogacao ? papeis.find((p) => p.id === ultimaRevogacao.papelId) : undefined;

  return (
    <MolduraGestao
      selecionado="usuarios"
      trilha={[{ label: "Sistema" }, { label: "Usuários e permissões" }]}
      contained={contained}
    >
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Usuários e permissões"
          description="Quem acessa o TFD, com qual papel e o que cada papel pode fazer."
          tabs={[
            { id: "membros", label: "Membros", count: contagemMembros },
            { id: "convites", label: "Convites pendentes", count: contagemConvites },
            { id: "permissoes", label: "Permissões" },
          ]}
          selectedTab={aba}
          onTabChange={(id) => setAba(id as AbaUsuarios)}
          tabsLabel="Seções de usuários e permissões"
          primaryAction={
            aba === "permissoes"
              ? {
                  label: "Criar papel",
                  icon: RiAddLine,
                  onClick: () => {
                    setNomePapel("");
                    setBasePapel("nenhum");
                    setErroPapel(null);
                    setDialogPapel(true);
                  },
                }
              : { label: "Convidar usuário", icon: RiUserAddLine, onClick: abrirConvite }
          }
        />

        {aviso ? <AvisoStatus mensagem={aviso} onDispensar={() => setAviso(null)} /> : null}

        {aba === "membros" ? (
          <>
            <FilterBar
              value={filtroMembros}
              onChange={(v) => {
                setFiltroMembros(v);
                setPaginaMembros(1);
              }}
              filters={filtrosMembros}
              searchPlaceholder="Buscar por nome ou e-mail"
              searchLabel="Buscar usuários por nome ou e-mail"
              resultCount={membrosFiltrados.length}
              resultNoun={ENTIDADE_USUARIO}
            />
            <DataListing
              label="Membros"
              entity={ENTIDADE_USUARIO}
              data={fatiaMembros}
              columns={colunasMembros}
              getRowId={(u) => u.id}
              getRowLabel={(u) => u.nome}
              state={membrosFiltrados.length === 0 ? (filtrandoMembros ? "vazio-filtro" : "vazio") : "pronto"}
              sort={sortMembros}
              onSortChange={(proximo) => {
                setSortMembros(proximo);
                setPaginaMembros(1);
              }}
              total={membrosFiltrados.length}
              page={paginaMembrosAtual}
              pageSize={tamanhoMembros}
              onPageChange={setPaginaMembros}
              onPageSizeChange={(n) => {
                setTamanhoMembros(n);
                setPaginaMembros(1);
              }}
              onClearFilters={() => setFiltroMembros(emptyFilterBarValue)}
              minTableWidth="min-w-[860px]"
            />
          </>
        ) : null}

        {aba === "convites" ? (
          <>
            <FilterBar
              value={filtroConvites}
              onChange={(v) => {
                setFiltroConvites(v);
                setPaginaConvites(1);
              }}
              searchPlaceholder="Buscar por e-mail"
              searchLabel="Buscar convites por e-mail"
              resultCount={convitesFiltrados.length}
              resultNoun={ENTIDADE_CONVITE}
            />
            <DataListing
              label="Convites pendentes"
              entity={ENTIDADE_CONVITE}
              data={fatiaConvites}
              columns={colunasConvites}
              getRowId={(c) => c.id}
              getRowLabel={(c) => c.email}
              state={
                convitesFiltrados.length === 0
                  ? filtroConvites.search.trim()
                    ? "vazio-filtro"
                    : "vazio"
                  : "pronto"
              }
              total={convitesFiltrados.length}
              page={paginaConvites}
              pageSize={10}
              onPageChange={setPaginaConvites}
              onClearFilters={() => setFiltroConvites(emptyFilterBarValue)}
              emptyTitle="Nenhum convite pendente"
              emptyDescription="Os convites enviados e ainda não aceitos aparecem aqui."
              emptyAction={
                <Button size="small" leadingIcon={RiUserAddLine} onClick={abrirConvite}>
                  Convidar usuário
                </Button>
              }
              minTableWidth="min-w-[760px]"
            />
          </>
        ) : null}

        {aba === "permissoes" ? (
          <section
            aria-label="Permissões por papel"
            className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4 sm:p-5"
          >
            <MatrizPermissoes
              papeis={papeis}
              concessoes={concessoes}
              onAlterar={alterarConcessao}
              usuariosPorPapel={usuariosPorPapel}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-separator-border pt-4">
              <p role="status" className="text-body-regular text-text-secondary">
                {sujo ? "Há alterações não salvas." : "Todas as alterações estão salvas."}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" disabled={!sujo} onClick={() => setConcessoes(salvas)}>
                  Descartar
                </Button>
                <Button
                  disabled={!sujo}
                  onClick={() => {
                    setSalvas(concessoes);
                    setAviso("Permissões salvas.");
                  }}
                >
                  Salvar alterações
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <Drawer
        isOpen={drawerConvite}
        onOpenChange={setDrawerConvite}
        title="Convidar usuário"
        description="Os convites chegam por e-mail e valem por 7 dias."
        icon={RiUserAddLine}
        size="md"
        footer={
          <DrawerActions
            form="form-convite"
            primaryLabel={validos.length > 1 ? `Enviar ${validos.length} convites` : "Enviar convite"}
            secondaryLabel="Cancelar"
            onSecondary={() => setDrawerConvite(false)}
          />
        }
      >
        <form
          id="form-convite"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            enviarConvites();
          }}
        >
          <FormGrid columns={1}>
            <Textarea
              label="E-mails"
              placeholder="nome@orgao.gov.br"
              rows={4}
              value={emails}
              onChange={(v) => {
                setEmails(v);
                setErroConvite(null);
              }}
              isRequired
              isInvalid={Boolean(erroConvite)}
              hint={
                erroConvite ??
                (emailsDigitados.length > 0
                  ? `${validos.length} ${validos.length === 1 ? "e-mail válido" : "e-mails válidos"}${invalidos.length ? `, ${invalidos.length} inválido(s)` : ""}.`
                  : "Informe um ou mais e-mails, separados por vírgula ou por linha.")
              }
            />
            <CampoPapel rotulo="Papel" papeis={papeis} valor={papelConvite} onChange={setPapelConvite} />
            <Textarea
              label="Mensagem (opcional)"
              placeholder="Uma orientação para quem recebe o convite"
              rows={3}
              value={mensagem}
              onChange={setMensagem}
            />
          </FormGrid>
        </form>
      </Drawer>

      <Dialog
        isOpen={dialogPapel}
        onOpenChange={setDialogPapel}
        size="sm"
        title="Criar papel"
        description="Comece de um papel existente para reaproveitar as permissões."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setDialogPapel(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="form-papel">
              Criar papel
            </Button>
          </div>
        }
      >
        <form
          id="form-papel"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            criarPapel();
          }}
        >
          <FormGrid columns={1}>
            <Input
              label="Nome do papel"
              placeholder="Ex.: Auditor"
              value={nomePapel}
              onChange={(v) => {
                setNomePapel(v);
                setErroPapel(null);
              }}
              isRequired
              isInvalid={Boolean(erroPapel)}
              hint={erroPapel ?? undefined}
            />
            <div className="flex flex-col gap-1">
              <span className="text-body-medium text-text-primary">Duplicar permissões de</span>
              <Select
                aria-label="Papel base"
                selectedKey={basePapel}
                onSelectionChange={(k) => k !== null && setBasePapel(String(k))}
                className="w-full"
              >
                <SelectItem id="nenhum" textValue="Nenhum, começar vazio">
                  Nenhum, começar vazio
                </SelectItem>
                {papeis.map((p) => (
                  <SelectItem key={p.id} id={p.id} textValue={p.nome}>
                    {p.nome}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </FormGrid>
        </form>
      </Dialog>

      <ConfirmDialog
        isOpen={acao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setAcao(null);
        }}
        tone={ultimaAcao?.tipo === "remover" ? "danger" : "neutral"}
        verb={ultimaAcao?.tipo === "remover" ? "Remover" : "Desativar"}
        affectedCount={1}
        entitySingular="usuário"
        entityPlural="usuários"
        description={
          ultimaAcao?.tipo === "remover"
            ? `${alvoAcao?.nome ?? "O usuário"} perde o acesso e sai da lista de membros. Esta ação não pode ser desfeita.`
            : `${alvoAcao?.nome ?? "O usuário"} perde o acesso ao sistema, mas o histórico de atendimentos é mantido.`
        }
        confirmLabel={ultimaAcao?.tipo === "remover" ? "Remover usuário" : "Desativar usuário"}
        cancelLabel="Voltar"
        onConfirm={confirmarAcao}
      />

      <ConfirmDialog
        isOpen={revogar !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setRevogar(null);
        }}
        tone="danger"
        title="Revogar permissão crítica?"
        description={`A alteração vale para ${usuariosPorPapel[papelRevogacao?.id ?? ""] ?? 0} ${(usuariosPorPapel[papelRevogacao?.id ?? ""] ?? 0) === 1 ? "usuário ativo" : "usuários ativos"} do papel ${papelRevogacao?.nome ?? ""}, assim que as alterações forem salvas.`}
        confirmLabel="Revogar permissão"
        cancelLabel="Voltar"
        onConfirm={() => {
          if (revogar) aplicarConcessao(revogar.papelId, revogar.ids, false);
          setRevogar(null);
        }}
      />
    </MolduraGestao>
  );
}
