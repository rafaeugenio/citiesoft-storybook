"use client";

import { useEffect, useState } from "react";
import {
  RiArrowRightLine,
  RiCustomerService2Line,
  RiDownloadLine,
  RiMoreFill,
  RiPrinterLine,
  RiSettings3Line,
  RiUserAddLine,
} from "@remixicon/react";
import { ActionMenu, type ActionMenuEntry } from "@/components/application/action-menu/action-menu";
import { AppFrame } from "@/components/application/app-frame/app-frame";
import { DockBar } from "@/components/application/dock-bar/dock-bar";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";
import { GRUPOS_NAVEGACAO_TFD, MENU_USUARIO_TFD, USUARIO_TFD } from "./dados/navegacao-sistema";
import { ATALHOS_DOCK, PENDENCIAS, RECENTES, ROTULOS_CURTOS, type SituacaoRecente } from "./dados/painel-dock";

export interface PainelMenuFlutuanteTelaProps {
  /** Altura fixa de janela (previews). */
  contained?: boolean;
}

const COR_SITUACAO: Record<SituacaoRecente, "cyan" | "yellow" | "lime" | "blue"> = {
  "Em análise": "cyan",
  "Aguardando documentos": "yellow",
  Aprovada: "lime",
  Agendada: "blue",
};

const MAIS_ACOES: ActionMenuEntry[] = [
  {
    type: "section",
    id: "atalhos",
    label: "Mais atalhos",
    items: [
      { id: "paciente", label: "Cadastrar paciente", icon: RiUserAddLine },
      { id: "relatorio", label: "Exportar relatório do dia", icon: RiDownloadLine },
      { id: "pauta", label: "Imprimir pauta de viagens", icon: RiPrinterLine, shortcut: "⌘P" },
    ],
  },
  { type: "separator" },
  { id: "ajuda", label: "Falar com o suporte", icon: RiCustomerService2Line },
  { id: "config", label: "Preferências do painel", icon: RiSettings3Line },
];

/** Tela estreita: o dock usa rótulos curtos e abre mão do botão de recolher. */
function useTelaEstreita() {
  const [estreita, setEstreita] = useState(false);
  useEffect(() => {
    const consulta = window.matchMedia("(max-width: 639px)");
    const atualizar = () => setEstreita(consulta.matches);
    atualizar();
    consulta.addEventListener("change", atualizar);
    return () => consulta.removeEventListener("change", atualizar);
  }, []);
  return estreita;
}

/**
 * Tela de trabalho com menu flutuante: pendências do dia e solicitações
 * recentes, com o DockBar embaixo como acesso rápido. O "Mais" abre um
 * ActionMenu para cima. No desktop o dock se centraliza sobre o conteúdo e
 * pode ser recolhido; no celular ele fica sobre a área de toque do polegar,
 * enquanto a barra lateral vira gaveta.
 */
export function PainelMenuFlutuanteTela({ contained = false }: PainelMenuFlutuanteTelaProps) {
  const [ativo, setAtivo] = useState<string | undefined>(undefined);
  const [recolhido, setRecolhido] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  const estreita = useTelaEstreita();
  const itensDock = estreita
    ? ATALHOS_DOCK.map((item) => ({ ...item, label: ROTULOS_CURTOS[item.id] ?? item.label }))
    : ATALHOS_DOCK;

  const rotulo = (id: string) => ATALHOS_DOCK.find((item) => item.id === id)?.label ?? id;

  return (
    <div className={cx("relative w-full", contained ? "h-[var(--template-preview-height,640px)]" : "h-dvh")}>
      <AppFrame
        contained={contained}
        navGroups={GRUPOS_NAVEGACAO_TFD}
        selected="painel"
        user={USUARIO_TFD}
        userMenuItems={MENU_USUARIO_TFD}
        breadcrumb={[{ label: "Início", href: "#" }, { label: "Painel de trabalho" }]}
        notificationCount={3}
        className={contained ? "h-full" : undefined}
      >
        <div className="flex flex-col gap-4 p-1 pb-32">
          <PageHeader
            title="Painel de trabalho"
            description="Pendências do dia e solicitações recentes da regional."
            meta={[{ label: "Hoje", value: "21/10/2026" }]}
          />

          <section aria-label="Pendências do dia" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PENDENCIAS.map((pendencia) => (
              <article
                key={pendencia.id}
                className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center rounded-md bg-stat-card-icon-background p-1.5">
                    <pendencia.icone className="size-5 text-foreground-icon-primary" aria-hidden />
                  </span>
                  <p className="text-title-1-medium text-text-primary tabular-nums">{pendencia.quantidade}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-body-medium text-text-primary">{pendencia.rotulo}</h2>
                  <p className="text-body-2-regular text-text-secondary">{pendencia.detalhe}</p>
                </div>
                <a
                  href="#solicitacoes"
                  className="inline-flex w-fit items-center gap-1 rounded-sm text-body-2-medium text-text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  {pendencia.acao}
                  <RiArrowRightLine className="size-4" aria-hidden />
                </a>
              </article>
            ))}
          </section>

          <section
            aria-labelledby="recentes-titulo"
            className="flex flex-col rounded-3xl border border-border-button-default bg-background-primary-default p-2"
          >
            <h2 id="recentes-titulo" className="px-3 pb-2 pt-3 text-headline-semibold text-text-primary">
              Solicitações recentes
            </h2>
            <ul className="flex flex-col">
              {RECENTES.map((item) => (
                <li key={item.id} className="border-t border-separator-border first:border-t-0">
                  <a
                    href={`#/solicitacoes/${item.id}`}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 outline-none transition-colors hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <Avatar size="md" color="blue" initials={item.iniciais} alt="" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-body-medium text-text-primary">{item.paciente}</span>
                      <span className="truncate text-caption-1-regular text-text-secondary">
                        {item.protocolo} · {item.especialidade} em {item.destino}
                      </span>
                    </span>
                    <Chip variant="caption" color={COR_SITUACAO[item.situacao]} className="hidden sm:inline-flex">
                      {item.situacao}
                    </Chip>
                    <span className="shrink-0 text-caption-1-medium text-text-tertiary">{item.quando}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </AppFrame>

      <p role="status" className="sr-only">
        {anuncio}
      </p>

      <div
        className={cx(
          "pointer-events-none absolute inset-x-0 bottom-4 z-40 flex items-center justify-center gap-2 px-3",
          "lg:ps-[284px]",
        )}
      >
        <DockBar
          anchor="inline"
          items={itensDock}
          activeId={ativo}
          onSelect={(id) => {
            setAtivo(id);
            setAnuncio(`Atalho acionado: ${rotulo(id)}.`);
          }}
          collapsible={!estreita}
          isCollapsed={estreita ? false : recolhido}
          onCollapsedChange={setRecolhido}
          aria-label="Atalhos do painel de trabalho"
          className="w-auto min-w-0 flex-initial px-0"
        />
        {estreita || !recolhido ? (
          <ActionMenu
            aria-label="Mais ações"
            placement="top"
            items={MAIS_ACOES}
            onAction={(id) => setAnuncio(`Ação acionada: ${id}.`)}
            triggerClassName="pointer-events-auto h-[62px] w-16 shrink-0 flex-col gap-0.5 rounded-full border border-border-button-default bg-background-primary-default text-text-secondary shadow-dropdown hover:bg-background-secondary-hover/60"
            trigger={
              <>
                <RiMoreFill className="size-5 text-foreground-icon-secondary" aria-hidden />
                <span className="text-caption-1-semibold">Mais</span>
              </>
            }
          />
        ) : null}
      </div>
    </div>
  );
}
