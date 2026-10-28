import {
  RiCheckboxCircleLine,
  RiFileAddLine,
  RiFileSearchLine,
  RiMailSendLine,
  RiTimeLine,
} from "@remixicon/react";
import type { ChipProps } from "@/components/base/badges/chip";
import type { TimelineEvent } from "@/components/application/detalhe/timeline";

export type SituacaoSolicitacao = "Em análise" | "Aguardando documentos" | "Aprovada" | "Agendada" | "Concluída" | "Negada";

export const COR_SITUACAO: Record<SituacaoSolicitacao, ChipProps["color"]> = {
  "Em análise": "blue",
  "Aguardando documentos": "yellow",
  Aprovada: "lime",
  Agendada: "cyan",
  Concluída: "neutral",
  Negada: "rose",
};

export const PROXIMO_PASSO: Record<SituacaoSolicitacao, string> = {
  "Em análise": "A regulação confere os dados e a documentação.",
  "Aguardando documentos": "O solicitante precisa anexar o comprovante de residência atualizado.",
  Aprovada: "O agendamento da consulta é feito pela central de regulação.",
  Agendada: "O transporte é confirmado até 48 horas antes da viagem.",
  Concluída: "Nenhuma pendência. A prestação de contas está encerrada.",
  Negada: "A solicitação pode ser refeita com nova justificativa.",
};

export const SOLICITACAO_DETALHE = {
  protocolo: "TFD-2026-004812",
  paciente: "Joana Pereira Alves",
  municipioOrigem: "Açailândia",
  criadaEm: "07/07/2026",
  responsavel: "Mariana Souza",
  dados: {
    paciente: [
      { label: "Nome completo", value: "Joana Pereira Alves" },
      { label: "CPF", value: "111.***.***-35" },
      { label: "Cartão SUS", value: "***********0008" },
      { label: "Data de nascimento", value: "14/03/1968" },
      { label: "Telefone", value: "(99) 98877-****" },
      { label: "Acompanhante", value: undefined },
    ],
    atendimento: [
      { label: "Especialidade", value: "Cardiologia" },
      { label: "Caráter", value: "Eletivo" },
      { label: "Unidade de destino", value: "Hospital Regional de Imperatriz" },
      { label: "Município de destino", value: "Imperatriz" },
      { label: "Data da consulta", value: "28/07/2026, 08h30" },
      { label: "Justificativa clínica", value: "Avaliação cardiológica de seguimento, sem oferta do serviço no município de origem.", span: 2 as const },
    ],
    transporte: [
      { label: "Tipo de transporte", value: "Ambulância" },
      { label: "Município de origem", value: "Açailândia" },
      { label: "Ida", value: "27/07/2026" },
      { label: "Volta", value: "29/07/2026" },
    ],
  },
  documentos: [
    { id: "d1", tipo: "Laudo médico", arquivo: "laudo-cardiologia.pdf", enviadoEm: "07/07/2026", por: "Ana Ribeiro", situacao: "Conferido" },
    { id: "d2", tipo: "Encaminhamento", arquivo: "encaminhamento-ubs.pdf", enviadoEm: "07/07/2026", por: "Ana Ribeiro", situacao: "Conferido" },
    { id: "d3", tipo: "Documento com foto", arquivo: "documento-frente-verso.jpg", enviadoEm: "08/07/2026", por: "Ana Ribeiro", situacao: "Conferido" },
    { id: "d4", tipo: "Comprovante de residência", arquivo: "Não enviado", enviadoEm: "", por: "", situacao: "Pendente" },
  ],
} as const;

/** Do evento mais recente para o mais antigo. */
export const HISTORICO_SOLICITACAO: TimelineEvent[] = [
  {
    key: "e5",
    title: "Documento pendente",
    description: "Solicitado o comprovante de residência atualizado.",
    date: "10/07/2026 às 16:48",
    dateTime: "2026-07-10T16:48",
    author: "Mariana Souza",
    icon: RiMailSendLine,
    tone: "warning",
  },
  {
    key: "e4",
    title: "Documentos conferidos",
    description: "Laudo médico, encaminhamento e documento com foto validados.",
    date: "09/07/2026 às 10:05",
    dateTime: "2026-07-09T10:05",
    author: "Carlos Lima",
    icon: RiFileSearchLine,
    tone: "brand",
  },
  {
    key: "e3",
    title: "Triagem concluída",
    description: "Indicação de TFD confirmada pela regulação regional.",
    date: "08/07/2026 às 14:20",
    dateTime: "2026-07-08T14:20",
    author: "Carlos Lima",
    icon: RiCheckboxCircleLine,
    tone: "success",
  },
  {
    key: "e2",
    title: "Em análise",
    date: "08/07/2026 às 09:12",
    dateTime: "2026-07-08T09:12",
    author: "Mariana Souza",
    icon: RiTimeLine,
  },
  {
    key: "e1",
    title: "Solicitação criada",
    date: "07/07/2026 às 15:20",
    dateTime: "2026-07-07T15:20",
    author: "Ana Ribeiro",
    icon: RiFileAddLine,
  },
];
