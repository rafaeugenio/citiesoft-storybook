"use client";

import { useEffect, useRef, useState } from "react";
import { RiAddLine, RiDeleteBin6Line, RiFileList3Line } from "@remixicon/react";
import { AppFrame } from "@/components/application/app-frame/app-frame";
import { BrandLogo } from "@/components/application/app-frame/brand-logo";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { DataListing } from "@/components/application/data-listing/data-listing";
import type { DataListingColumn } from "@/components/application/data-listing/data-listing";
import { EmptyState } from "@/components/application/estados/empty-state";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import {
  ERROS,
  SOLICITACOES_EXCLUSAO,
  type SolicitacaoExclusao,
  type VarianteErro,
  type VarianteErrosEstados,
} from "./dados/erros-estados";
import { GRUPOS_NAVEGACAO_TFD, MENU_USUARIO_TFD, USUARIO_TFD } from "./dados/navegacao-sistema";

export interface ErrosEstadosTelaProps {
  /** Altura fixa de janela (previews). */
  contained?: boolean;
  variante?: VarianteErrosEstados;
}

const ALTURA = (contained: boolean) =>
  contained ? "h-[var(--template-preview-height,640px)]" : "min-h-dvh";

/* --------------------------------------------------------------- erro */

/**
 * Página de erro centrada, sem navegação principal. As quatro zonas (código,
 * explicação, orientação e CTA) são iguais nas variantes. O foco inicial vai
 * para o título da página.
 */
function PaginaErro({ variante, contained }: { variante: VarianteErro; contained: boolean }) {
  const erro = ERROS[variante];
  const Icone = erro.icone;
  const titulo = useRef<HTMLHeadingElement>(null);
  const [tentando, setTentando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    titulo.current?.focus({ preventScroll: true });
  }, [variante]);

  useEffect(() => {
    if (!tentando) return;
    const espera = window.setTimeout(() => {
      setTentando(false);
      setFalhou(true);
    }, 1200);
    return () => window.clearTimeout(espera);
  }, [tentando]);

  const reforcarSuporte = variante === "500" && falhou;

  return (
    <div className={cx("flex w-full flex-col bg-background-full p-6", ALTURA(contained))}>
      <header>
        <BrandLogo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
        <span
          aria-hidden
          className="inline-flex size-12 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-tertiary"
        >
          <Icone className="size-6" aria-hidden />
        </span>
        <div className="flex max-w-[440px] flex-col items-center gap-3">
          <h1 ref={titulo} tabIndex={-1} className="flex flex-col items-center gap-1 outline-none">
            <span aria-hidden className="text-display-1-semibold text-text-primary">
              {erro.codigo}
            </span>
            <span className="sr-only">{`Erro ${erro.codigo}. ${erro.titulo}.`}</span>
          </h1>
          <p className="text-headline-semibold text-text-primary">{erro.explicacao}</p>
          <p className="text-body-regular text-text-secondary">{erro.orientacao}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {variante === "500" || variante === "manutencao" ? (
            <Button
              variant={reforcarSuporte ? "secondary" : "primary"}
              disabled={tentando}
              aria-busy={tentando || undefined}
              onClick={() => {
                setFalhou(false);
                setTentando(true);
              }}
            >
              {tentando ? "Tentando…" : erro.cta}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => undefined}>
              {erro.cta}
            </Button>
          )}
          {erro.suporte ? (
            <Button variant={reforcarSuporte ? "primary" : "secondary"}>Falar com o suporte</Button>
          ) : null}
        </div>
        <p role="status" className="min-h-5 text-body-2-regular text-text-secondary">
          {falhou ? "A falha persiste. O suporte pode ajudar a retomar o trabalho." : ""}
        </p>
      </main>
    </div>
  );
}

/* ------------------------------------------------------- vazio inicial */

function MolduraListagem({
  contained,
  titulo,
  children,
}: {
  contained: boolean;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <AppFrame
      contained={contained}
      navGroups={GRUPOS_NAVEGACAO_TFD}
      selected="solicitacoes"
      user={USUARIO_TFD}
      userMenuItems={MENU_USUARIO_TFD}
      breadcrumb={[{ label: "Início", href: "#" }, { label: "Regulação", href: "#" }, { label: titulo }]}
      notificationCount={3}
    >
      <div className="flex flex-col gap-4 p-1 pb-4">{children}</div>
    </AppFrame>
  );
}

/** Primeiro acesso, sem nenhum registro: ícone leve, frase de ausência e CTA de criação. */
function EstadoVazioInicial({ contained }: { contained: boolean }) {
  return (
    <MolduraListagem contained={contained} titulo="Solicitações de TFD">
      <PageHeader
        title="Solicitações de TFD"
        description="Pedidos de tratamento fora do domicílio dos pacientes do município."
      />
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default">
        <EmptyState
          size="lg"
          icon={RiFileList3Line}
          titleAs="h2"
          title="Nenhuma solicitação cadastrada"
          description="As solicitações de TFD criadas aparecem aqui. A primeira solicitação leva poucos minutos."
          action={<Button leadingIcon={RiAddLine}>Nova solicitação</Button>}
        />
      </div>
    </MolduraListagem>
  );
}

/* ------------------------------------------------ confirmação destrutiva */

const COLUNAS: DataListingColumn<SolicitacaoExclusao>[] = [
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
  { id: "especialidade", header: "Especialidade", cell: (r) => r.especialidade, width: "w-[150px]" },
  { id: "situacao", header: "Situação", cell: (r) => r.situacao, width: "w-[200px]" },
];

/**
 * Exclusão de alto impacto: o título nomeia o protocolo, o corpo diz a
 * consequência primeiro e o botão só libera depois de digitar o protocolo.
 * O foco inicial fica em "Cancelar" e Esc equivale a cancelar.
 */
function ConfirmacaoDestrutiva({ contained }: { contained: boolean }) {
  const [linhas, setLinhas] = useState(SOLICITACOES_EXCLUSAO);
  const [alvo, setAlvo] = useState<SolicitacaoExclusao | null>(SOLICITACOES_EXCLUSAO[0]);
  const [digitado, setDigitado] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [aviso, setAviso] = useState("");
  const [aberto, setAberto] = useState(true);

  useEffect(() => {
    if (!aberto) return;
    const espera = window.setTimeout(() => {
      const cancelar = [...document.querySelectorAll<HTMLButtonElement>('[role="alertdialog"] button')].find(
        (botao) => botao.textContent?.trim() === "Cancelar",
      );
      cancelar?.focus();
    }, 80);
    return () => window.clearTimeout(espera);
  }, [aberto, alvo]);

  const abrir = (linha: SolicitacaoExclusao) => {
    setAlvo(linha);
    setDigitado("");
    setAberto(true);
  };

  const confirmar = () => {
    if (!alvo) return;
    setExcluindo(true);
    window.setTimeout(() => {
      setLinhas((atual) => atual.filter((linha) => linha.id !== alvo.id));
      setAviso(`Solicitação ${alvo.protocolo} excluída.`);
      setExcluindo(false);
      setAberto(false);
    }, 900);
  };

  const liberado = alvo !== null && digitado.trim() === alvo.protocolo;

  return (
    <MolduraListagem contained={contained} titulo="Solicitações de TFD">
      <PageHeader
        title="Solicitações de TFD"
        description="A exclusão remove a solicitação e tudo o que está vinculado a ela."
      />
      <p role="status" className="min-h-5 text-body-2-medium text-text-brand">
        {aviso}
      </p>
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-2">
        <DataListing
          label="Solicitações de TFD"
          entity={{ singular: "solicitação", plural: "solicitações" }}
          data={linhas}
          columns={COLUNAS}
          getRowId={(r) => r.id}
          getRowLabel={(r) => r.protocolo}
          getRowHref={(r) => `#/solicitacoes/${r.id}`}
          rowActions={[
            {
              id: "excluir",
              label: "Excluir",
              icon: RiDeleteBin6Line,
              tone: "danger",
              onAction: abrir,
            },
          ]}
          total={linhas.length}
          page={1}
          pageSize={Math.max(linhas.length, 1)}
          className="border-0"
        />
      </div>
      <ConfirmDialog
        isOpen={aberto && alvo !== null}
        onOpenChange={setAberto}
        onConfirm={() => liberado && confirmar()}
        tone="danger"
        title={alvo ? `Excluir a solicitação ${alvo.protocolo}?` : "Excluir solicitação?"}
        description="A exclusão não pode ser desfeita. O histórico, os documentos anexados e as viagens vinculadas também serão removidos."
        confirmLabel="Excluir solicitação"
        loadingLabel="Excluindo…"
        isLoading={excluindo}
        size="md"
      >
        <Input
          label="Digitar o protocolo para confirmar"
          hint={alvo ? `Protocolo: ${alvo.protocolo}` : undefined}
          value={digitado}
          onChange={setDigitado}
          isDisabled={excluindo}
        />
      </ConfirmDialog>
    </MolduraListagem>
  );
}

/**
 * Páginas de erro e estados de apoio do sistema: 404, 403, 500, manutenção,
 * estado vazio inicial e confirmação destrutiva. Segue `tela-erro.md` e
 * `tela-estados-apoio.md`.
 */
export function ErrosEstadosTela({ contained = false, variante = "404" }: ErrosEstadosTelaProps) {
  if (variante === "vazio") return <EstadoVazioInicial contained={contained} />;
  if (variante === "confirmacao") return <ConfirmacaoDestrutiva contained={contained} />;
  return <PaginaErro key={variante} variante={variante} contained={contained} />;
}
