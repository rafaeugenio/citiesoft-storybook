"use client";

import { useEffect, useMemo, useState } from "react";
import { RiCheckLine, RiCheckDoubleLine, RiDeleteBinLine, RiExternalLinkLine, RiMailCheckLine, RiNotificationOffLine } from "@remixicon/react";
import { ActionMenu } from "@/components/application/action-menu/action-menu";
import { AppFrame } from "@/components/application/app-frame/app-frame";
import { EmptyState } from "@/components/application/estados/empty-state";
import { ErrorState } from "@/components/application/estados/error-state";
import { SkeletonBar } from "@/components/application/estados/table-skeleton";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/base/table/table";
import { cx } from "@/utils/cx";
import { GRUPOS_NAVEGACAO_TFD, MENU_USUARIO_TFD, USUARIO_TFD } from "./dados/navegacao-sistema";
import {
  NOTIFICACOES,
  PREFERENCIAS,
  ROTULO_CATEGORIA,
  ROTULO_FREQUENCIA,
  type CategoriaNotificacao,
  type EventoPreferencia,
  type Frequencia,
  type GrupoNotificacao,
  type GrupoPreferencia,
  type Notificacao,
} from "./dados/notificacoes";

export type NotificacoesAba = "central" | "preferencias";
export type NotificacoesEstado = "pronto" | "carregando" | "erro" | "vazio";

export interface NotificacoesTelaProps {
  /** Altura fixa de janela (previews). */
  contained?: boolean;
  abaInicial?: NotificacoesAba;
  /** Força um estado da central, para documentar carregamento, erro e ausência total. */
  estado?: NotificacoesEstado;
}

const COR_CATEGORIA: Record<CategoriaNotificacao, "blue" | "orange" | "gray"> = {
  atividade: "blue",
  seguranca: "orange",
  sistema: "gray",
};

const TOM_ICONE = {
  information: "bg-notification-information-background text-notification-information-foreground",
  success: "bg-notification-success-background text-notification-success-foreground",
  error: "bg-notification-error-background text-notification-error-foreground",
  neutral: "bg-background-tertiary-default text-text-secondary",
} as const;

const GRUPOS: GrupoNotificacao[] = ["Hoje", "Esta semana"];

/* ---------------------------------------------------------------- central */

function ItemNotificacao({
  item,
  onLer,
  onRemover,
}: {
  item: Notificacao;
  onLer: (id: string, lida: boolean) => void;
  onRemover: (id: string) => void;
}) {
  const Icone = item.icone;
  return (
    <li className="flex gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-background-secondary-hover">
      <span className={cx("flex size-10 shrink-0 items-center justify-center rounded-full", TOM_ICONE[item.tom])}>
        <Icone className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <a
            href="#"
            onClick={(evento) => {
              evento.preventDefault();
              onLer(item.id, true);
            }}
            className={cx(
              "min-w-0 rounded-sm text-body-medium text-text-primary outline-none hover:underline",
              "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            )}
          >
            {item.titulo}
            <span className="sr-only">{item.lida ? ". Lida." : ". Não lida."}</span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap text-caption-1-medium text-text-tertiary">{item.tempo}</span>
            {!item.lida ? <span aria-hidden className="size-2 rounded-full bg-accent-500" /> : null}
          </div>
        </div>
        <p className="text-body-regular text-text-secondary">{item.descricao}</p>
        <Chip variant="caption" color={COR_CATEGORIA[item.categoria]} className="mt-0.5 w-fit">
          {ROTULO_CATEGORIA[item.categoria]}
        </Chip>
      </div>
      <ActionMenu
        aria-label={`Ações da notificação ${item.titulo}`}
        placement="bottom"
        onAction={(id) => {
          if (id === "alternar") onLer(item.id, !item.lida);
          if (id === "remover") onRemover(item.id);
        }}
        items={[
          {
            id: "alternar",
            label: item.lida ? "Marcar como não lida" : "Marcar como lida",
            icon: item.lida ? RiMailCheckLine : RiCheckLine,
          },
          { id: "abrir", label: "Ir para o item", icon: RiExternalLinkLine },
          { type: "separator" },
          { id: "remover", label: "Remover", icon: RiDeleteBinLine, tone: "danger" },
        ]}
      />
    </li>
  );
}

function CentralNotificacoes({ estado }: { estado: NotificacoesEstado }) {
  const [itens, setItens] = useState<Notificacao[]>(estado === "vazio" ? [] : NOTIFICACOES);
  const [filtro, setFiltro] = useState<"todas" | "nao-lidas">("todas");
  const [tentativas, setTentativas] = useState(0);

  const naoLidas = itens.filter((item) => !item.lida).length;
  const visiveis = useMemo(
    () => (filtro === "todas" ? itens : itens.filter((item) => !item.lida)),
    [itens, filtro],
  );

  const alternarLida = (id: string, lida: boolean) =>
    setItens((atual) => atual.map((item) => (item.id === id ? { ...item, lida } : item)));
  const remover = (id: string) => setItens((atual) => atual.filter((item) => item.id !== id));
  /** Afeta só as notificações visíveis no filtro ativo. */
  const marcarVisiveisComoLidas = () => {
    const ids = new Set(visiveis.map((item) => item.id));
    setItens((atual) => atual.map((item) => (ids.has(item.id) ? { ...item, lida: true } : item)));
  };

  const mostrandoErro = estado === "erro" && tentativas === 0;

  return (
    <section
      aria-label="Central de notificações"
      className="flex w-full max-w-[860px] flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          aria-label="Filtro de notificações"
          selectedKeys={new Set([filtro])}
          onSelectionChange={(chaves) => {
            const proximo = [...chaves][0];
            if (proximo) setFiltro(proximo as "todas" | "nao-lidas");
          }}
        >
          <SegmentedControlItem id="todas">Todas ({itens.length})</SegmentedControlItem>
          <SegmentedControlItem id="nao-lidas">Não lidas ({naoLidas})</SegmentedControlItem>
        </SegmentedControl>
        <Button
          variant="ghost"
          size="small"
          leadingIcon={RiCheckDoubleLine}
          disabled={!visiveis.some((item) => !item.lida)}
          onClick={marcarVisiveisComoLidas}
        >
          Marcar todas como lidas
        </Button>
      </div>
      <p role="status" className="sr-only">
        {naoLidas === 0 ? "Nenhuma notificação não lida." : `${naoLidas} notificações não lidas.`}
      </p>

      {estado === "carregando" ? (
        <div role="status" aria-label="Carregando notificações" className="flex flex-col gap-4 px-3 py-2">
          {[0, 1, 2, 3].map((linha) => (
            <div key={linha} aria-hidden className="flex items-start gap-3">
              <SkeletonBar className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <SkeletonBar className="w-2/5" />
                <SkeletonBar className="w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : mostrandoErro ? (
        <ErrorState
          title="Não foi possível carregar as notificações"
          description="Houve uma falha na conexão com o servidor. Nenhuma notificação foi alterada."
          onRetry={() => setTentativas((n) => n + 1)}
        />
      ) : itens.length === 0 ? (
        <EmptyState
          icon={RiNotificationOffLine}
          title="Nenhuma notificação por aqui"
          description="Novos avisos de solicitações, segurança e sistema aparecem nesta central."
        />
      ) : visiveis.length === 0 ? (
        <EmptyState
          icon={RiNotificationOffLine}
          title="Nenhuma notificação não lida"
          description="Tudo foi lido. As notificações anteriores continuam em Todas."
          action={
            <Button variant="secondary" size="small" onClick={() => setFiltro("todas")}>
              Ver todas
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {GRUPOS.map((grupo) => {
            const doGrupo = visiveis.filter((item) => item.grupo === grupo);
            if (doGrupo.length === 0) return null;
            return (
              <div key={grupo} className="flex flex-col gap-1">
                <h2 className="px-3 text-caption-1-semibold text-text-tertiary">{grupo}</h2>
                <ul className="flex flex-col">
                  {doGrupo.map((item) => (
                    <ItemNotificacao key={item.id} item={item} onLer={alternarLida} onRemover={remover} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ----------------------------------------------------------- preferências */

type CanalId = "email" | "sistema";
const CANAIS: { id: CanalId; rotulo: string }[] = [
  { id: "email", rotulo: "E-mail" },
  { id: "sistema", rotulo: "No sistema" },
];

function Preferencias() {
  const [grupos, setGrupos] = useState<GrupoPreferencia[]>(PREFERENCIAS);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (!salvo) return;
    const espera = window.setTimeout(() => setSalvo(false), 3000);
    return () => window.clearTimeout(espera);
  }, [salvo]);

  const atualizar = (categoria: CategoriaNotificacao, id: string, mudanca: Partial<EventoPreferencia>) => {
    setGrupos((atual) =>
      atual.map((grupo) =>
        grupo.categoria !== categoria
          ? grupo
          : { ...grupo, eventos: grupo.eventos.map((evento) => (evento.id === id ? { ...evento, ...mudanca } : evento)) },
      ),
    );
    setSalvo(true);
  };

  const alternarGrupo = (categoria: CategoriaNotificacao, canal: CanalId, ligado: boolean) => {
    setGrupos((atual) =>
      atual.map((grupo) =>
        grupo.categoria !== categoria
          ? grupo
          : {
              ...grupo,
              eventos: grupo.eventos.map((evento) =>
                canal === "email" && evento.emailObrigatorio ? evento : { ...evento, [canal]: ligado },
              ),
            },
      ),
    );
    setSalvo(true);
  };

  return (
    <section
      aria-label="Preferências de notificação"
      className="flex w-full max-w-[860px] flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[560px] text-body-regular text-text-secondary">
          Cada evento pode chegar por e-mail, no sistema ou nos dois. As alterações são salvas automaticamente.
        </p>
        <p role="status" className="min-h-6 text-body-2-medium text-text-brand">
          {salvo ? "Preferências salvas." : ""}
        </p>
      </div>

      <Table aria-label="Preferências de notificação por evento e canal" containerClassName="rounded-2xl" className="min-w-[640px]">
        <TableHeader>
          <TableColumn isRowHeader id="evento">
            Evento
          </TableColumn>
          {CANAIS.map((canal) => (
            <TableColumn key={canal.id} id={canal.id} className="w-[120px]">
              {canal.rotulo}
            </TableColumn>
          ))}
          <TableColumn id="frequencia" className="w-[200px]">
            Frequência
          </TableColumn>
        </TableHeader>
        <TableBody>
          {grupos.flatMap((grupo) => {
            const rotulo = ROTULO_CATEGORIA[grupo.categoria];
            const todosLigados = (canal: CanalId) =>
              grupo.eventos.every((evento) => evento[canal] || (canal === "email" && evento.emailObrigatorio));
            const cabecalho = (
              <TableRow key={`grupo-${grupo.categoria}`} id={`grupo-${grupo.categoria}`} className="bg-background-secondary-default">
                <TableCell>
                  <span className="text-body-medium text-text-primary">{rotulo}</span>
                </TableCell>
                {CANAIS.map((canal) => (
                  <TableCell key={canal.id}>
                    <Switch
                      size="sm"
                      aria-label={`${rotulo}, todos os eventos, ${canal.rotulo}`}
                      isSelected={todosLigados(canal.id)}
                      isDisabled={canal.id === "email" && grupo.categoria === "seguranca"}
                      onChange={(ligado) => alternarGrupo(grupo.categoria, canal.id, ligado)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <span className="text-caption-1-regular text-text-secondary">Ativar todos</span>
                </TableCell>
              </TableRow>
            );
            const linhas = grupo.eventos.map((evento) => (
              <TableRow key={evento.id} id={evento.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-body-regular text-text-primary">{evento.rotulo}</span>
                    {evento.emailObrigatorio ? (
                      <span className="text-caption-1-regular text-text-secondary">Obrigatório por e-mail</span>
                    ) : null}
                  </div>
                </TableCell>
                {CANAIS.map((canal) => (
                  <TableCell key={canal.id}>
                    <Switch
                      size="sm"
                      aria-label={`${evento.rotulo}, ${canal.rotulo}`}
                      isSelected={evento[canal.id]}
                      isDisabled={canal.id === "email" && evento.emailObrigatorio}
                      onChange={(ligado) => atualizar(grupo.categoria, evento.id, { [canal.id]: ligado })}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Select
                    size="sm"
                    aria-label={`Frequência de ${evento.rotulo}`}
                    selectedKey={evento.frequencia}
                    isDisabled={evento.frequenciaFixa}
                    onSelectionChange={(chave) =>
                      atualizar(grupo.categoria, evento.id, { frequencia: String(chave) as Frequencia })
                    }
                  >
                    {(Object.keys(ROTULO_FREQUENCIA) as Frequencia[]).map((frequencia) => (
                      <SelectItem key={frequencia} id={frequencia}>
                        {ROTULO_FREQUENCIA[frequencia]}
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ));
            return [cabecalho, ...linhas];
          })}
        </TableBody>
      </Table>
      <p className="text-caption-1-regular text-text-secondary">
        Eventos de segurança chegam sempre por e-mail e só podem ser desativados no sistema.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------- tela */

/**
 * Notificações: central (lista agrupada por período, filtro Todas e Não lidas,
 * marcar como lida) e preferências (matriz evento por canal com frequência).
 * Segue `tela-notificacoes.md`.
 */
export function NotificacoesTela({ contained = false, abaInicial = "central", estado = "pronto" }: NotificacoesTelaProps) {
  const [aba, setAba] = useState<NotificacoesAba>(abaInicial);
  const naoLidas = estado === "pronto" ? NOTIFICACOES.filter((item) => !item.lida).length : 0;

  return (
    <AppFrame
      contained={contained}
      navGroups={GRUPOS_NAVEGACAO_TFD}
      selected="notificacoes"
      user={USUARIO_TFD}
      userMenuItems={MENU_USUARIO_TFD}
      breadcrumb={[{ label: "Início", href: "#" }, { label: "Notificações" }]}
      notificationCount={naoLidas}
      onNotificationsClick={() => setAba("central")}
    >
      <div className="flex flex-col gap-4 p-1 pb-4">
        <PageHeader
          title="Notificações"
          description="Avisos de solicitações, segurança e sistema, e os canais pelos quais chegam."
          tabs={[
            { id: "central", label: "Central", count: naoLidas > 0 ? naoLidas : undefined },
            { id: "preferencias", label: "Preferências" },
          ]}
          selectedTab={aba}
          onTabChange={(id) => setAba(id as NotificacoesAba)}
          tabsLabel="Seções de notificações"
        />
        {aba === "central" ? <CentralNotificacoes key={estado} estado={estado} /> : <Preferencias />}
      </div>
    </AppFrame>
  );
}
