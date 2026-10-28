"use client";

import { useState } from "react";
import {
  RiDeleteBinLine,
  RiDownload2Line,
  RiFileCopyLine,
  RiMore2Fill,
  RiPrinterLine,
} from "@remixicon/react";
import { ActionMenu } from "@/components/application/action-menu/action-menu";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { DetailHeader } from "@/components/application/detalhe/detail-header";
import { KeyValueList } from "@/components/application/detalhe/key-value-list";
import { Timeline } from "@/components/application/detalhe/timeline";
import { EmptyState } from "@/components/application/estados/empty-state";
import { ErrorState } from "@/components/application/estados/error-state";
import { SkeletonBar } from "@/components/application/estados/table-skeleton";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/base/table/table";
import { AvisoFormulario } from "./campos";
import {
  COR_SITUACAO,
  HISTORICO_SOLICITACAO,
  PROXIMO_PASSO,
  SOLICITACAO_DETALHE,
  type SituacaoSolicitacao,
} from "./dados/detalhe-solicitacao";
import { MolduraSistema } from "./moldura-sistema";

export type EstadoDetalhe = "carregado" | "carregando" | "erro";
export type AbaDetalhe = "dados" | "documentos" | "historico";

export interface DetalheSolicitacaoTelaProps {
  contained?: boolean;
  /** Estado de carregamento do registro. */
  estado?: EstadoDetalhe;
  situacao?: SituacaoSolicitacao;
  initialTab?: AbaDetalhe;
}

function Cartao({ titulo, children, id }: { titulo: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-5 sm:p-6">
      <h2 id={id} className="text-headline-medium text-text-primary">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Esqueleto() {
  return (
    <div role="status" aria-label="Carregando solicitação" className="flex flex-col gap-6 p-1">
      <div className="flex flex-col gap-3">
        <SkeletonBar className="h-3 w-48" />
        <SkeletonBar className="h-6 w-80 max-w-full" />
        <SkeletonBar className="w-40" />
      </div>
      <div className="flex gap-4">
        <SkeletonBar className="h-8 w-20" />
        <SkeletonBar className="h-8 w-24" />
        <SkeletonBar className="h-8 w-20" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBar key={i} className={i % 2 ? "w-2/3" : "w-full"} />
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
          <SkeletonBar className="w-24" />
          <SkeletonBar className="w-full" />
        </div>
      </div>
    </div>
  );
}

/** Detalhe de uma solicitação TFD: cabeçalho de status, dados, documentos e histórico. */
export function DetalheSolicitacaoTela({
  contained = false,
  estado: estadoInicial = "carregado",
  situacao = "Aguardando documentos",
  initialTab = "dados",
}: DetalheSolicitacaoTelaProps) {
  const [estado, setEstado] = useState<EstadoDetalhe>(estadoInicial);
  const [aba, setAba] = useState<AbaDetalhe>(initialTab);
  const [excluir, setExcluir] = useState(false);
  const [excluida, setExcluida] = useState(false);
  const [aviso, setAviso] = useState<string>();
  const d = SOLICITACAO_DETALHE;

  const quadro = (conteudo: React.ReactNode) => (
    <MolduraSistema
      contained={contained}
      selected="solicitacoes"
      breadcrumb={[{ label: "Solicitações TFD", href: "#solicitacoes" }, { label: d.protocolo }]}
    >
      {conteudo}
    </MolduraSistema>
  );

  if (estado === "carregando") return quadro(<Esqueleto />);

  if (estado === "erro") {
    return quadro(
      <div className="flex min-h-full items-center justify-center p-4">
        <ErrorState
          title="Não foi possível carregar a solicitação"
          description="Verifique a conexão e tente novamente."
          onRetry={() => setEstado("carregado")}
          retryLabel="Tentar novamente"
        />
      </div>,
    );
  }

  if (excluida) {
    return quadro(
      <div className="flex min-h-full items-center justify-center p-4">
        <EmptyState
          title="Solicitação excluída"
          description={`A solicitação ${d.protocolo} foi removida da listagem.`}
          action={<Button onClick={() => undefined}>Voltar para a listagem</Button>}
        />
      </div>,
    );
  }

  const menu = (
    <ActionMenu
      aria-label={`Mais ações da solicitação ${d.protocolo}`}
      placement="end"
      trigger={<RiMore2Fill className="size-5" aria-hidden />}
      triggerClassName="size-9 rounded-lg border border-border-button-default text-foreground-icon-secondary hover:bg-button-ghost-hover"
      items={[
        { id: "imprimir", label: "Imprimir comprovante", icon: RiPrinterLine, onAction: () => setAviso("Comprovante enviado para impressão.") },
        { id: "duplicar", label: "Duplicar solicitação", icon: RiFileCopyLine, onAction: () => setAviso("Rascunho criado a partir desta solicitação.") },
        { type: "separator" },
        { id: "excluir", label: "Excluir solicitação", icon: RiDeleteBinLine, tone: "danger", onAction: () => setExcluir(true) },
      ]}
    />
  );

  return quadro(
    <div className="flex flex-col gap-6 p-1">
      <DetailHeader
        title={d.paciente}
        identifier={d.protocolo}
        statusLabel={situacao}
        statusColor={COR_SITUACAO[situacao]}
        meta={`${d.municipioOrigem}, criada em ${d.criadaEm}, responsável ${d.responsavel}`}
        onEdit={() => setAviso("Edição aberta no formulário de cadastro.")}
        menu={menu}
      />

      {aviso ? (
        <AvisoFormulario role="status" tone="info">
          {aviso}
        </AvisoFormulario>
      ) : null}

      <Tabs selectedKey={aba} onSelectionChange={(k) => setAba(k as AbaDetalhe)}>
        <TabList aria-label="Seções da solicitação">
          <Tab id="dados">Dados</Tab>
          <Tab id="documentos" count={d.documentos.length}>
            Documentos
          </Tab>
          <Tab id="historico" count={HISTORICO_SOLICITACAO.length}>
            Histórico
          </Tab>
        </TabList>

        <TabPanel id="dados">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="flex min-w-0 flex-col gap-4">
              <Cartao id="sec-paciente" titulo="Paciente">
                <KeyValueList columns={2} items={[...d.dados.paciente]} />
              </Cartao>
              <Cartao id="sec-atendimento" titulo="Atendimento">
                <KeyValueList columns={2} items={[...d.dados.atendimento]} />
              </Cartao>
              <Cartao id="sec-transporte" titulo="Transporte">
                <KeyValueList columns={2} items={[...d.dados.transporte]} />
              </Cartao>
            </div>
            <aside aria-label="Andamento" className="flex h-fit flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-5 sm:p-6">
              <h2 className="text-headline-medium text-text-primary">Andamento</h2>
              <div className="flex flex-col gap-1.5">
                <span className="text-caption-1-medium text-text-secondary">Situação atual</span>
                <div>
                  <Chip variant="bold" color={COR_SITUACAO[situacao]}>
                    {situacao}
                  </Chip>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-caption-1-medium text-text-secondary">Próximo passo</span>
                <p className="text-body-regular text-text-primary">{PROXIMO_PASSO[situacao]}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-caption-1-medium text-text-secondary">Responsável</span>
                <p className="text-body-medium text-text-primary">{d.responsavel}</p>
              </div>
            </aside>
          </div>
        </TabPanel>

        <TabPanel id="documentos">
          <Cartao id="sec-documentos" titulo="Documentos da solicitação">
            <Table aria-label="Documentos da solicitação" size="sm">
              <TableHeader>
                <TableColumn isRowHeader>Documento</TableColumn>
                <TableColumn>Arquivo</TableColumn>
                <TableColumn>Enviado em</TableColumn>
                <TableColumn>Situação</TableColumn>
                <TableColumn>
                  <span className="sr-only">Ações</span>
                </TableColumn>
              </TableHeader>
              <TableBody>
                {d.documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.tipo}</TableCell>
                    <TableCell>{doc.arquivo}</TableCell>
                    <TableCell>{doc.enviadoEm ? `${doc.enviadoEm}, por ${doc.por}` : "Sem envio"}</TableCell>
                    <TableCell>
                      <Chip color={doc.situacao === "Conferido" ? "lime" : "yellow"}>{doc.situacao}</Chip>
                    </TableCell>
                    <TableCell>
                      {doc.enviadoEm ? (
                        <IconButton icon={RiDownload2Line} size="small" aria-label={`Baixar ${doc.tipo.toLowerCase()}`} />
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Cartao>
        </TabPanel>

        <TabPanel id="historico">
          <Cartao id="sec-historico" titulo="Histórico da solicitação">
            <Timeline events={HISTORICO_SOLICITACAO} aria-label="Histórico da solicitação, do mais recente ao mais antigo" />
          </Cartao>
        </TabPanel>
      </Tabs>

      <ConfirmDialog
        isOpen={excluir}
        onOpenChange={setExcluir}
        onConfirm={() => {
          setExcluir(false);
          setExcluida(true);
        }}
        tone="danger"
        title="Excluir a solicitação?"
        description={`A solicitação ${d.protocolo} de ${d.paciente} será removida da listagem. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir solicitação"
      />
    </div>,
  );
}
